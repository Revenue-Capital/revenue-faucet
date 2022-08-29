import "@nomicfoundation/hardhat-toolbox";
import { config as dotenvConfig } from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import { resolve } from "path";

const dotenvConfigPath: string = process.env.DOTENV_CONFIG_PATH || "./.env";
dotenvConfig({ path: resolve(__dirname, dotenvConfigPath) });

const mnemonic: string | undefined = process.env.MNEMONIC;
if (!mnemonic) {
  throw new Error("Please set your MNEMONIC in a .env file");
}

const config: HardhatUserConfig = {
  networks: {
    private: {
        url: "https://blockchain.revenuecapital.io",
        chainId: 78787,
        gas: "auto",
        gasPrice: 5_000_000_000,
        accounts: {
            mnemonic,
        }
    }
  },
  solidity: {
    version:  "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};

export default config;


