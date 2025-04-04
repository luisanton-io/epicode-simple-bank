import { ethers } from 'hardhat'
import { Wallet, JsonRpcProvider } from 'ethers'
import { SimpleBank__factory } from '../types'

if (!process.env.ACCOUNT_PK) {
    throw new Error('ACCOUNT_PK is not set')
}

const accountPK = process.env.ACCOUNT_PK
const provider = new JsonRpcProvider('http://127.0.0.1:8545/')

async function deploySimpleBank() {
    const wallet = new Wallet(accountPK, provider)
    const SimpleBank = await new SimpleBank__factory(wallet).deploy()

    console.log('SimpleBank deployed to:', await SimpleBank.getAddress())
}

deploySimpleBank().catch(console.error)
