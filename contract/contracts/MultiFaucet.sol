// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.0;

/// ============ Imports ============

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title MultiFaucet
/// @author Anish Agnihotri
/// @notice Drips BNB, RVC, BUSD and LP
contract MultiFaucet {

    /// ============ Immutable storage ============

    /// @notice RVC ERC20 token
    IERC20 public immutable RVC;
    /// @notice BUSD ERC20 token
    IERC20 public immutable BUSD;
    // @notice LP ERC20 token
    IERC20 public immutable LP;

    /// ============ Mutable storage ============

    /// @notice BNB to disperse
    uint256 public BNB_AMOUNT = 5e17;
    /// @notice RVC to disperse
    uint256 public RVC_AMOUNT = 20_000e18;
    /// @notice BUSD to disperse
    uint256 public BUSD_AMOUNT = 500e18;
    /// @notice LP to disperse
    uint256 public LP_AMOUNT = 500e18;
    /// @notice Addresses of approved operators
    mapping(address => bool) public approvedOperators;
    /// @notice Addresses of super operators
    mapping(address => bool) public superOperators;

    /// ============ Modifiers ============

    /// @notice Requires sender to be contract super operator
    modifier isSuperOperator() {
        // Ensure sender is super operator
        require(superOperators[msg.sender], "Not super operator");
        _;
    }

    /// @notice Requires sender to be contract approved operator
    modifier isApprovedOperator() {
        // Ensure sender is in approved operators or is super operator
        require(
            approvedOperators[msg.sender] || superOperators[msg.sender], 
            "Not approved operator"
        );
        _;
    }

    /// ============ Events ============

    /// @notice Emitted after faucet drips to a recipient
    /// @param recipient address dripped to
    event FaucetDripped(address indexed recipient);

    /// @notice Emitted after faucet drained to a recipient
    /// @param recipient address drained to
    event FaucetDrained(address indexed recipient);

    /// @notice Emitted after operator status is updated
    /// @param operator address being updated
    /// @param status new operator status
    event OperatorUpdated(address indexed operator, bool status);

    /// @notice Emitted after super operator is updated
    /// @param operator address being updated
    /// @param status new operator status
    event SuperOperatorUpdated(address indexed operator, bool status);

    /// ============ Constructor ============

    /// @notice Creates a new MultiFaucet contract
    /// @param _RVC address of RVC contract
    /// @param _BUSD address of BUSD contract
    /// @param _LP address of LP contract
    constructor(address _RVC, address _BUSD, address _LP) payable {
        RVC = IERC20(_RVC);
        BUSD = IERC20(_BUSD);
        LP = IERC20(_LP);
        superOperators[msg.sender] = true;
    }

    /// ============ Functions ============

    /// @notice Drips tokens to recipient
    /// @param _recipient to drip tokens to
    function drip(address _recipient) external isApprovedOperator {
        // Drip Ether
        (bool sent,) = _recipient.call{value: BNB_AMOUNT}("");
        require(sent, "Failed dripping BNB");

        // Drip RVC
        require(RVC.transfer(_recipient, RVC_AMOUNT), "Failed dripping RVC");

        // Drip BUSD
        require(BUSD.transfer(_recipient, BUSD_AMOUNT), "Failed dripping BUSD");

        // Drip LP
        require(LP.transfer(_recipient, LP_AMOUNT), "Failed dripping LP");

        emit FaucetDripped(_recipient);
    }

    /// @notice Returns number of available drips by token
    /// @return bnbDrips — available BNB drips
    /// @return rvcDrips — available RVC drips
    /// @return busdDrips — available BUSD drips
    /// @return lpDrips — available LP drips
    function availableDrips() public view 
        returns (uint256 bnbDrips, uint256 rvcDrips, uint256 busdDrips, uint256 lpDrips) 
    {
        bnbDrips = address(this).balance / BNB_AMOUNT;
        rvcDrips = RVC.balanceOf(address(this)) / RVC_AMOUNT;
        busdDrips = BUSD.balanceOf(address(this)) / BUSD_AMOUNT;
        lpDrips = LP.balanceOf(address(this)) / LP_AMOUNT;
    }

    /// @notice Allows super operator to drain contract of tokens
    /// @param _recipient to send drained tokens to
    function drain(address _recipient) external isSuperOperator {
        // Drain all Ether
        (bool sent,) = _recipient.call{value: address(this).balance}("");
        require(sent, "Failed draining BNB");

        // Drain all RVC
        uint256 rvcBalance = RVC.balanceOf(address(this));
        require(RVC.transfer(_recipient, rvcBalance), "Failed draining RVC");

        // Drain all BUSD
        uint256 busdBalance = BUSD.balanceOf(address(this));
        require(BUSD.transfer(_recipient, busdBalance), "Failed dripping BUSD");

        // Drain all LP
        uint256 lpBalance = LP.balanceOf(address(this));
        require(LP.transfer(_recipient, lpBalance), "Failed dripping LP");

        emit FaucetDrained(_recipient);
    }

    /// @notice Allows super operator to update approved drip operator status
    /// @param _operator address to update
    /// @param _status of operator to toggle (true == allowed to drip)
    function updateApprovedOperator(address _operator, bool _status) 
        external 
        isSuperOperator 
    {
        approvedOperators[_operator] = _status;
        emit OperatorUpdated(_operator, _status);
    }

    /// @notice Allows super operator to update super operator
    /// @param _operator address to update
    /// @param _status of operator to toggle (true === is super operator)
    function updateSuperOperator(address _operator, bool _status) 
        external
        isSuperOperator
    {
        superOperators[_operator] = _status;
        emit SuperOperatorUpdated(_operator, _status);
    }

    /// @notice Allows super operator to update drip amounts
    /// @param _bnbAmount BNB to drip
    /// @param _rvcAmount RVC to drip
    /// @param _busdAmount BUSD to drip
    /// @param _lpAmount LP to drip
    function updateDripAmounts(
        uint256 _bnbAmount,
        uint256 _rvcAmount,
        uint256 _busdAmount,
        uint256 _lpAmount
    ) external isSuperOperator {
        BNB_AMOUNT = _bnbAmount;
        RVC_AMOUNT = _rvcAmount;
        BUSD_AMOUNT = _busdAmount;
        LP_AMOUNT = _lpAmount;
    }

    /// @notice Allows receiving BNB
    receive() external payable {}
}