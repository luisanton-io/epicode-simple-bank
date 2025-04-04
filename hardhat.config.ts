import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import 'dotenv/config'

if (!process.env.ACCOUNT_PK) {
    throw new Error('ACCOUNT_PK is not set')
}

const config: HardhatUserConfig = {
    solidity: '0.8.29',
    networks: {
        hardhat: {
            chainId: 31337,
            forking: {
                url: 'https://eth-pokt.nodies.app',
                // blockNumber: 18446744073709551615,
            },
            accounts: [
                {
                    privateKey: process.env.ACCOUNT_PK,
                    balance: '1000000000000000000000000',
                },
            ],
        },
        localhost: {
            chainId: 31337,
            url: 'http://127.0.0.1:8545/',
        },
    },
    typechain: {
        outDir: 'types',
        target: 'ethers-v6',
    },
}

export default config
