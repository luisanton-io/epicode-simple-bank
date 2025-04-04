import { BytesLike, JsonRpcProvider, parseEther, Wallet } from 'ethers'
import { SimpleBank__factory } from '../types'

const SIMPLE_BANK_ADDRESS = '0xD5FE4236126FbA23B9356c073b3D359bad37A297'
const provider = new JsonRpcProvider('http://127.0.0.1:8545/')

async function deposit() {
    const wallet = new Wallet(process.env.ACCOUNT_PK!, provider)
    const SimpleBank = SimpleBank__factory.connect(SIMPLE_BANK_ADDRESS, wallet)

    const txResult = await SimpleBank.deposit({ value: parseEther('1') })
    const receipt = await txResult.wait()

    const depositLog = SimpleBank__factory.createInterface()
        .decodeEventLog(
            'Deposited',
            receipt?.logs[1].data as BytesLike,
            receipt?.logs[1].topics as string[]
        )
        .toObject(true)
    console.log(depositLog)
    // console.log('Deposit tx sent:', receipt.transactionHash)
}

deposit().catch(console.error)
