import { ethers } from "hardhat";

async function main() {
    const OPERATOR_ADDRESS = "0xc1dC9a390D84A231D9FCaEC41903CEe9BD467C93"

    const RVC_ADDRESS = "0xbbee2ae86219221970d567f43a533ca5a702d7b7"
    const BUSD_ADDRESS = "0x87E34FE8b5a041887253F1eAD7ff5F8a591bACA3"
    const LP_ADDRESS = "0x2Bb87838f4fF57E49A10651C3F833399a5beC302"

    const BNB_AMOUNT = "50000"
    const RVC_AMOUNT = "700000000"
    const BUSD_AMOUNT = "50000000"
    const LP_AMOUNT = "50000000"

    const IERC20 = require("../artifacts/@openzeppelin/contracts/token/ERC20/IERC20.sol/IERC20.json");
    const [deployer] = await ethers.getSigners();
    const provider = ethers.provider;
    
    
    console.log("Deploying MultiFaucet...")

    const MultiFaucet = await ethers.getContractFactory("MultiFaucet");
    const multifaucet = await MultiFaucet.deploy(RVC_ADDRESS, BUSD_ADDRESS, LP_ADDRESS, {value: ethers.utils.parseEther(BNB_AMOUNT)});
    await multifaucet.deployed();

    console.log(`Deployed MultiFaucet to address ${multifaucet.address} and funded it with ${BNB_AMOUNT} BNB.`)


    console.log("Allowing the operator to call the contract...")

    await multifaucet.updateApprovedOperator(OPERATOR_ADDRESS, true)

    console.log(`Added ${OPERATOR_ADDRESS} to the operators list.`)


    console.log("Sending F-RVC to the contract...")

    const rvcContract = new ethers.Contract(RVC_ADDRESS, IERC20.abi, provider);
    const rvc = await rvcContract.connect(deployer).transfer(multifaucet.address, ethers.utils.parseEther(RVC_AMOUNT));
    await rvc.wait()

    console.log(`Sent ${RVC_AMOUNT} F-RVC.`)


    console.log("Sending F-BUSD to the contract...")

    const busdContract = new ethers.Contract(BUSD_ADDRESS, IERC20.abi, provider);
    const busd = await busdContract.connect(deployer).transfer(multifaucet.address, ethers.utils.parseEther(BUSD_AMOUNT));
    await busd.wait()

    console.log(`Sent ${BUSD_AMOUNT} F-BUSD.`)


    console.log("Sending F-Cake LP to the contract...")
    
    const lpContract = new ethers.Contract(LP_ADDRESS, IERC20.abi, provider);
    const lp = await lpContract.connect(deployer).transfer(multifaucet.address, ethers.utils.parseEther(LP_AMOUNT));
    await lp.wait()

    console.log(`Sent ${LP_AMOUNT} F-Cake LP.`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
