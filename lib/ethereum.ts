import { PublicClient, createPublicClient, http, GetBlockReturnType } from 'viem';
import { hardhat } from 'viem/chains';

const rpcUrl = process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL || "http://localhost:8545";

// Connect to local Ethereum node
const client: PublicClient = createPublicClient({
  transport: http(rpcUrl),
  chain: hardhat,
});

export async function getLatestBlocks(count = 100): Promise<any[]> {
  try {
    const blockNumber = BigInt((await client.request({
      method: "eth_blockNumber",
      params: [],
      returnType: "number",
    })));

    const blocks = [];

    for (let i = 0; i < count; i++) {
      if (Number(blockNumber - BigInt(i)) < 0) break;
      try {
        const block = await client.getBlock({ blockNumber: blockNumber - BigInt(i) });
        if (block) {
          blocks.push({
            hash: block.hash,
            miner: block.miner,
            timestamp: block.timestamp,
            number: block.number,
          });
        }
      } catch (error) {
        console.error(`Error fetching block ${blockNumber - BigInt(i)}:`, error);
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
    return await client.getBlock({ blockHash: hash as `0x${string}` })
  } catch (error) {
    console.error(`Error fetching block ${hash}:`, error)
    return null
  }
}

export async function getBlockWithTransactions(hash: string) {
  try {
    return await client.getBlock({ blockHash: hash as `0x${string}`, includeTransactions: true })
  } catch (error) {
    console.error(`Error fetching block with transactions ${hash}:`, error)
    return null
  }
}

export async function getTransaction(hash: string) {
  try {
    const tx = await client.getTransaction({ hash: hash as `0x${string}` });
    if (!tx) return null;

    const receipt = await client.getTransactionReceipt({ hash: hash as `0x${string}` });
    if (!receipt) return null;

    return {
      hash: tx.hash,
      blockHash: tx.blockHash,
      blockNumber: tx.blockNumber,
      transactionIndex: tx.transactionIndex,
      from: tx.from,
      to: tx.to,
      data: tx.input,
      value: BigInt(tx.value),
      gasPrice: tx.gasPrice ? BigInt(tx.gasPrice) : undefined,
      receipt: {
        status: Number(receipt.status),
        gasUsed: BigInt(receipt.gasUsed),
        contractAddress: receipt.contractAddress,
      },
    };
  } catch (error) {
    console.error(`Error fetching transaction ${hash}:`, error);
    return null;
  }
}

export async function getRecentTransactions(address: string, count = 20) {
  try {
    // 獲取最新區塊號
    // const latestBlockNumber = await client.getBlockNumber();
    const latestBlockNumber = BigInt((await client.request({
      method: "eth_blockNumber",
      params: [],
      returnType: "number",
    })));


    let transactions = [];

    // 遍歷區塊，直到找到足夠的交易
    for (let i = latestBlockNumber; i > 0 && transactions.length < count; i--) {
      const block = await client.getBlock({ blockNumber: i, includeTransactions: true });

      if (block.transactions) {
        const filteredTxs = block.transactions.filter(tx =>
          tx.from.toLowerCase() === address.toLowerCase() ||
          (tx.to && tx.to.toLowerCase() === address.toLowerCase()) // `tx.to` 可能為 `null`（合約創建）
        );

        transactions.push(...filteredTxs);
      }
    }

    return transactions.slice(0, count); // 只回傳最近 `count` 筆交易
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
}
