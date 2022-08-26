export const revenue_network = {
    network: "revenuetestnet",
    disclaimer:
      "Faucet drips 0.5 F-BNB, 20000 F-RVC, 500 F-BUSD, and 500 LP-Tokens.",
    formattedName: "Revenue Testnet",
    autoconnect: {
      chainId: "0x133c3",
      chainName: "Revenue Testnet",
      nativeCurrency: {
        name: "F-BNB",
        symbol: "F-BNB",
        decimals: 18,
      },
      rpcUrls: ["https://blockchain.revenuecapital.io"],
    },
    addresses: {
      "F-RVC": "0xBbEe2ae86219221970d567F43A533ca5A702d7B7",
      "F-BUSD": "0x87E34FE8b5a041887253F1eAD7ff5F8a591bACA3",
      "F-Cake LP": "0x2Bb87838f4fF57E49A10651C3F833399a5beC302",
    },
}

export const revenue_contracts = {
    "Staking V3": "0xA78C7E5c4bbd32aC252Db9E40856BC850EeF92E7",
    "Farming V3": "0x16D7c61CFE9AD3ca06cc8A373C0b5Ed358Cf7020",
    "Treasury": "0xe3b8aE6a6F11d3791b21e90F319aE0F064C85f64",
    "Staking Supplier": "0xE6F8b3FF62cFF795067BAD47Ebf84db06559Acd0",
    "Farming Supplier": "0x2385CF3aAB7b32023761257709A7f2e0e2A7B85B",
    "Locking Supplier": "0x3abEbB0dBD92508116B147a4Fe475E7b686fcdC8",
    "Staking Supplier Proxy": "0xE0745df38F8741bB63bFC8Bbc8c0c62b259f36E8",
    "Farming Supplier Proxy": "0x510B50FbBD7F2F42ec638113Ef95B8a4b7Ba1844",
    "Locking Supplier Proxy": "0x2557B5750178B930BBfe4Cbb9c0a6d7805EFFAB6",
    "Voting Provider": "0x2557B5750178B930BBfe4Cbb9c0a6d7805EFFAB6",
    "Voting Provider Proxy": "0xaC0B8Ccb125352137d06394Da545edee7cfA553B",
    "Voting Controller": "0x331E65C4a2d89D8Ee35f84987F073460C87c3229",
    "Voting Single Governor": "0xdC577A5923303B955540E6F2A9287E3a9057F5a9",
    "Voting Selection Governor": "0xC4c5AeAcb4C8d69A357989Ad82146FF1Ad7a395B",
    "Backlog 1": "0x08d56f9C1e53EEa361efBDCc348D9E73Be8fDF86",
    "Backlog 2": "0xd34328e41884944E91d273d2Eaffc7302d14b471",
    "Voting Valut": "0x07dB4358794ddC6f2BE4cF59Ea31d163EbF190FB",
}

/**
 * Export details about networks
 */
export function getNetworkDetails() {
  return revenue_network;
}

/**
 * Export details about networks
 */
 export function getContractDetails() {
    return revenue_contracts;
  }
