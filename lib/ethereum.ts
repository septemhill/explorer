import { createPublicClient, http, Block, Transaction } from "viem"
import { mainnet } from "viem/chains"


const client = createPublicClient({
  chain: mainnet,
  transport: http("https://eth.llamarpc.com"),
})

export async function getLatestBlocks(count = 10) {
  try {
    const blockNumber: bigint = await client.getBlockNumber()
    const blocks = []

    for (let i = BigInt(0); i < count; i++) {
      if (blockNumber - i < 0) break
      const block = await client.getBlock({ blockNumber: blockNumber - i, includeTransactions: false })
      if (block) {
        blocks.push(block)
      }
    }

    return blocks
  } catch (error) {
    console.error("Error fetching blocks:", error)
    return []
  }
}

export async function getBlockByHash(hash: string) {
  try {
    return await client.getBlock({
      blockHash: hash,
      includeTransactions: true,
    })
  } catch (error) {
    console.error(`Error fetching block ${hash}:`, error)
    return null
  }
}

export async function getBlockWithTransactions(hash: string) {
  try {
    return await client.getBlockWithTransactions(hash)
  } catch (error) {
    console.error(`Error fetching block with transactions ${hash}:`, error)
    return null
  }
}

export async function getTransaction(hash: string) {
  try {
    const tx = await client.getTransaction(hash)
    if (!tx) return null

    const receipt = await client.getTransactionReceipt(hash)

    return {
      ...tx,
      receipt,
    }
  } catch (error) {
    console.error(`Error fetching transaction ${hash}:`, error)
    return null
  }
}
