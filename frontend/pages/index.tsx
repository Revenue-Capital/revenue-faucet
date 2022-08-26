import axios from "axios"; // Requests
import { ethers } from "ethers"; // Address check
import { toast } from "react-toastify"; // Toast notifications
import Layout from "components/Layout"; // Layout wrapper
import { useRouter } from "next/router"; // Router
import styles from "styles/Home.module.scss"; // Styles
import { ReactElement, useState } from "react"; // Local state + types
import { getNetworkDetails, getContractDetails } from "utils/addresses"; // Faucet addresses

/**
 * Checks if a provider address is valid
 * @param {string} address to check
 * @returns {boolean} validity
 */
export function isValidInput(address: string): boolean {
  try {
    // Check if address is valid + checksum match
    ethers.utils.getAddress(address);
  } catch {
    // If not, return false
    return false;
  }
  // Else, return true
  return true;
}

export default function Home() {
  // Collect prefilled address
  const {
    query: { addr },
  } = useRouter();
  // Fill prefilled address
  const prefilledAddress: string = addr && typeof addr === "string" ? addr : "";

  // Claim address
  const [address, setAddress] = useState<string>(prefilledAddress);
  // Loading status
  const [loading, setLoading] = useState<boolean>(false);
  // Collect details about addresses
  const network = getNetworkDetails();
  const contracts = getContractDetails();

  /**
   * Processes a claim to the faucet
   */
  const processClaim = async () => {
    // Toggle loading
    setLoading(true);

    try {
      // Post new claim with recipient address
      await axios.post("/api/claim/new", { address, others: 0 });
      // Toast if success + toggle claimed
      toast.success("Tokens were sent, check balances shortly!");
    } catch (error: any) {
      // If error, toast error message
      toast.error(error.response.data.error);
    }

    // Toggle loading
    setLoading(false);
  };

  return (
    <Layout>
      {/* CTA + description */}
      <div className={styles.home__cta}>
        <h1>Revenue Testnet Faucet</h1>
        <span>
          MultiFaucet funds a wallet with{" "}
          <TokenLogo name="F-BNB" imageSrc="/tokens/bnb.svg" />
          , <TokenLogo name="F-RVC" imageSrc="/tokens/rvc.png" />,
          <TokenLogo name="F-BUSD" imageSrc="/tokens/busd.svg" />, and{" "}
          <TokenLogo name="F-Cake LP" imageSrc="/tokens/lp.webp" /> to use for
          testing purpouses.
        </span>
      </div>

      {/* Claim from facuet card */}
      <div className={styles.home__card}>
        {/* Card title */}
        <div className={styles.home__card_title}>
          <h3>Request Tokens</h3>
        </div>

        {/* Card content */}
        <div className={styles.home__card_content}>
          <div className={styles.content__authenticated}>
            {/* Claim description */}
            <p>Enter your Ethereum address to receive tokens:</p>

            {/* Address input */}
            <input
              type="text"
              placeholder="0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            {isValidInput(address) ? (
              // If address is valid, allow claiming
              <button
                className={styles.button__main}
                onClick={processClaim}
                disabled={loading}
              >
                {!loading ? "Claim" : "Claiming..."}
              </button>
            ) : (
              // Else, force fix
              <button className={styles.button__main} disabled>
                {address === "" ? "Enter Valid Address" : "Invalid Address"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Faucet details card */}
      <div className={styles.home__card}>
        {/* Card title */}
        <div className={styles.home__card_title}>
          <h3>Faucet Details</h3>
        </div>

        {/* Network details */}
        <div key={network.network}>
          <div className={styles.home__card_content_section}>
            {/* Network name */}
            <h4>
              {network.formattedName}
              <span>
                {" "}
                <AddNetworkButton autoconnect={network.autoconnect} />
              </span>
            </h4>

            {/* Optional network disclaimer */}
            {network.disclaimer ? <span>{network.disclaimer}</span> : null}

            {Object.entries(network.addresses).map(([name, address]) => {
              // For each network address
              return (
                // Address description: address
                <p key={name}>
                  {name}: <TokenAddress name={name} address={address} />
                </p>
              );
            })}
          </div>
        </div>

        {/* Contract information */}
        <div>
          <div className={styles.home__card_content_section}>
            <h4>Deployed Contracts List</h4>
            {Object.entries(contracts).map(([name, address]) => {
              // For each network address
              return (
                // Address description: address
                <p key={name}>
                  {name}: <ContractAddress name={name} address={address} />
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}

/**
 * Returns button to add network to MetaMask
 * @param {temp: any} autoconnect details
 * @returns {ReactElement}
 */
function AddNetworkButton({ autoconnect }: { autoconnect: any }): ReactElement {
  /**
   * Adds network to MetaMask
   */
  const addToMetaMask = async () => {
    // @ts-expect-error
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [autoconnect],
    });
  };

  return (
    <button onClick={addToMetaMask} className={styles.addNetworkButton}>
      Add to MetaMask
    </button>
  );
}

/**
 * Returns token address component
 * @param {string?} name if displaying MM connect
 * @param {string} address to display
 * @returns {ReactElement}
 */
function TokenAddress({
  name,
  address,
}: {
  name?: string;
  address: string;
}): ReactElement {
  /**
   * Adds token to MetaMask
   */
  const addToMetaMask = async () => {
    // @ts-expect-error
    await window.ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: address,
          symbol: name,
          decimals: 18,
        },
      },
    });
  };

  return (
    <span className={styles.address}>
      <a>{ethers.utils.getAddress(address)}</a>
      <button onClick={addToMetaMask}>Add to MetaMask</button>
    </span>
  );
}

/**
 * Returns contarct address component
 * @param {string?} name if displaying MM connect
 * @param {string} address to display
 * @returns {ReactElement}
 */
function ContractAddress({
  name,
  address,
}: {
  name?: string;
  address: string;
}): ReactElement {
  return (
    <span className={styles.address}>
      <a>{ethers.utils.getAddress(address)}</a>
    </span>
  );
}

/**
 * Returns token logo component
 * @param {string} name of token
 * @param {string} imageSrc of token image
 * @returns {ReactElement}
 */
function TokenLogo({
  name,
  imageSrc,
}: {
  name: string;
  imageSrc: string;
}): ReactElement {
  return (
    <div className={styles.token}>
      <img src={imageSrc} alt={`${name}`} />
      <span>{name}</span>
    </div>
  );
}
