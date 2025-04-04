export interface Transaction {
  hash: string
  from: string
  to: string
  value: number
  blockNumber: number
  transactionIndex: number
  gasUsed: number
  gasPrice: number
  status: boolean
  contractAddress?: string
  data: string
}

export interface Block {
  hash: string
  timestamp: number
  size: number
  parentHash: string
  minerAddress: string
  gasUsed: number
  baseFee: number
  gasLimit: number
  nonce: string
  transactions: Transaction[]
}

// Generate random hash
function generateHash(prefix = "0x"): string {
  return prefix + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")
}

// Generate random address
function generateAddress(): string {
  return "0x" + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")
}

// Generate random transactions
function generateTransactions(count: number, blockNumber: number): Transaction[] {
  return Array.from({ length: count }, (_, i) => {
    const contractCreation = Math.random() > 0.9
    const contractAddress = contractCreation ? generateAddress() : undefined

    return {
      hash: generateHash(),
      from: generateAddress(),
      to: contractCreation ? "" : generateAddress(),
      value: Number.parseFloat((Math.random() * 10).toFixed(4)),
      blockNumber,
      transactionIndex: i,
      gasUsed: Math.floor(Math.random() * 1000000),
      gasPrice: Number.parseFloat((Math.random() * 100).toFixed(2)),
      status: Math.random() > 0.1,
      contractAddress,
      data: generateHash("0x"),
    }
  })
}

// Generate mock blocks
export const mockBlocks: Block[] = Array.from({ length: 10 }, (_, i) => {
  const blockNumber = 17000000 - i
  const txCount = Math.floor(Math.random() * 20) + 5

  return {
    hash: generateHash(),
    timestamp: Date.now() - i * 15000,
    size: Math.floor(Math.random() * 100000) + 50000,
    parentHash: i === 0 ? "0x0000000000000000000000000000000000000000000000000000000000000000" : generateHash(),
    minerAddress: generateAddress(),
    gasUsed: Math.floor(Math.random() * 30000000),
    baseFee: Number.parseFloat((Math.random() * 0.0001).toFixed(8)),
    gasLimit: 30000000,
    nonce: "0x" + Math.floor(Math.random() * 1000000000).toString(16),
    transactions: generateTransactions(txCount, blockNumber),
  }
})

