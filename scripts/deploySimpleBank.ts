import { ethers } from 'ethers'
import { Wallet, JsonRpcProvider } from 'ethers'
import { SimpleBank__factory } from '../types'

if (!process.env.ACCOUNT_PK) {
    throw new Error('ACCOUNT_PK is not set')
}

const accountPK = process.env.ACCOUNT_PK
const provider = new JsonRpcProvider('https://bsc-testnet-rpc.publicnode.com')

async function deploySimpleBank() {
    const wallet = new Wallet(accountPK, provider)
    const balanceETH = await provider.getBalance(wallet.address)

    console.log(wallet.address, balanceETH)

    return

    const SimpleBank = await new SimpleBank__factory(wallet).deploy()

    console.log('SimpleBank deployed to:', await SimpleBank.getAddress())
}

deploySimpleBank().catch(console.error)
