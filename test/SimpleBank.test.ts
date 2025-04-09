import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers'
import { expect } from 'chai'
import { ethers } from 'hardhat'
import { SimpleBank, SimpleBank__factory } from '../types'
import { BytesLike, parseEther } from 'ethers'
import { withFee } from './utils/withFee'

describe('SimpleBank', () => {
    let SimpleBank: SimpleBank
    let admin: SignerWithAddress
    let anon1: SignerWithAddress
    let anon2: SignerWithAddress

    before(async () => {
        ;[admin, anon1, anon2] = await ethers.getSigners()

        console.log('owner', admin.address)
        SimpleBank = await new SimpleBank__factory(admin).deploy()

        console.log('Deployed SimpleBank to:', SimpleBank.target)
    })

    it('should have 0 balance', async () => {
        const balanceAnon1 = await SimpleBank.balanceOf(anon1.address)
        expect(balanceAnon1).to.equal(0n)
    })

    it('should increase balance of users when they deposit accounting for fee', async () => {
        const depositAmount = parseEther('1')
        await SimpleBank.connect(anon1).deposit({
            value: depositAmount, // 1 -> 1 * 1e18
        })

        const newAnon1Balance = await SimpleBank.balanceOf(anon1.address)
        expect(newAnon1Balance).to.equal(withFee(depositAmount))
    })

    it('should decrease balance of users when they withdraw', async () => {
        const balanceBefore = await SimpleBank.balanceOf(anon1.address)
        const withdrawAmount = parseEther('0.5')

        await SimpleBank.connect(anon1).withdraw(withdrawAmount)

        const newAnon1Balance = await SimpleBank.balanceOf(anon1.address)
        expect(newAnon1Balance).to.equal(balanceBefore - withdrawAmount)
    })

    it('should send the admin 1% of each transaction', async () => {
        const transferAmount = parseEther('0.1')
        const adminBalanceBefore = await SimpleBank.balanceOf(admin.address)
        await SimpleBank.connect(anon1).transfer(anon2.address, transferAmount)

        const adminBalanceAfter = await SimpleBank.balanceOf(admin.address)

        expect(adminBalanceAfter - adminBalanceBefore).to.equal(
            transferAmount / 100n
        )
        const balanceAnon2 = await SimpleBank.balanceOf(anon2.address)
        expect(balanceAnon2).to.equal(withFee(transferAmount))
    })

    after(() => {
        console.log('after')
    })
})
