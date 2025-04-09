/**
 * Calculate the amount after applying a fee
 * @param amount - The amount to apply the fee to
 * @param fee - The fee to apply
 * @returns The amount after applying the fee
 */
export const withFee = (amount: bigint, fee: bigint = 1n) => {
    return amount - (amount * fee) / 100n
}
