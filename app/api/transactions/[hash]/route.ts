import { createPublicClient, http } from "viem"
import { mainnet } from "viem/chains"
import { NextResponse } from "next/server"
import { getTransaction } from "@/lib/ethereum"


export async function GET(request: Request, { params }: { params: { hash: string } }) {
  try {
    const txHash = params.hash as `0x${string}`
    const transaction = await getTransaction(txHash)

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    return NextResponse.json({
      transaction,
      // receipt,
    })
  } catch (error) {
    console.error(`Error fetching transaction ${params.hash}:`, error)
    return NextResponse.json({ error: "Failed to fetch transaction" }, { status: 500 })
  }
}

