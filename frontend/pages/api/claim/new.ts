import { ethers, Wallet } from "ethers"; // Ethers
import { isValidInput } from "pages/index"; // Address check
import type { NextApiRequest, NextApiResponse } from "next"; // Types

// Setup faucet interface
const iface = new ethers.utils.Interface([
  "function drip(address _recipient) external",
]);

/**
 * Generates tx input data for drip claim
 * @param {string} recipient address
 * @returns {string} encoded input data
 */
function generateTxData(recipient: string): string {
  // Encode address for drip function
  return iface.encodeFunctionData("drip", [recipient]);
}

/**
 * Returns populated drip transaction for a network
 * @param {ethers.Wallet} wallet without RPC network connected
 * @param {string} data input for tx
 */
async function processDrip(wallet: ethers.Wallet, data: string): Promise<void> {
  // Collect provider
  const provider = new ethers.providers.StaticJsonRpcProvider(
    "https://blockchain.revenuecapital.io"
  );

  // Connect wallet to network
  const rpcWallet = wallet.connect(provider);

  // Collect nonce for network
  const nonce = await provider.getTransactionCount(
    // Collect nonce for operator
    process.env.NEXT_PUBLIC_OPERATOR_ADDRESS ?? ""
  );

  // Return populated transaction
  try {
    await rpcWallet.sendTransaction({
      to: process.env.FAUCET_ADDRESS ?? "",
      from: wallet.address,
      gasPrice: 5_000_000_000,
      gasLimit: 500_000,
      data,
      nonce,
      type: 0,
    });
  } catch (e) {
    // Throw error
    throw new Error("Error when processing drip for network");
  }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Collect address
  const { address, others }: { address: string; others: boolean } = req.body;

  if (!address || !isValidInput(address)) {
    // Return invalid address status
    return res.status(400).send({ error: address });
  }

  // Setup wallet w/o RPC provider
  const wallet = new ethers.Wallet(process.env.OPERATOR_PRIVATE_KEY ?? "");

  // Generate transaction data
  const data: string = generateTxData(address);

  try {
    // Process faucet claims
    await processDrip(wallet, data);
  } catch (e) {
    // If error in process, revert
    return res.status(500).send({ error: "Error." });
  }

  return res.status(200).send({ claimed: address });
};
