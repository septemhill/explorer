import { createPublicClient, http } from "viem"
import { mainnet } from "viem/chains"
import { NextResponse } from "next/server"
import { getTransaction } from "@/lib/ethereum"


export async function GET(request: Request, { params }: { params: { hash: string } }) {
  const { hash } = await params
  try {
    const tx = await getTransaction(hash as `0x${string}`)
    console.log(tx)

    if (!tx) {
      return NextResponse.json({ error: "Transaction not found 1" }, { status: 404 })
    }

    const transaction = JSON.parse(JSON.stringify(tx, (_, v) => typeof v === 'bigint' ? v.toString() : v))

    return NextResponse.json({
      transaction,
      // receipt,
    })
  } catch (error) {
    console.error(`Error fetching transaction ${hash}:`, error)
    return NextResponse.json({ error: "Failed to fetch transaction" }, { status: 500 })
  }
}

