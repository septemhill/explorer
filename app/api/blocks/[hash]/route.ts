import { createPublicClient, http } from "viem"
import { mainnet } from "viem/chains"
import { NextResponse } from "next/server"
import { getBlockByHash } from "@/lib/ethereum"

export async function GET(request: Request, { params }: { params: { hash: string } }) {
  const { hash } = await params

  try {
    const block = await getBlockByHash(hash as `0x${string}`)

    if (!block) {
      return NextResponse.json({ error: "Block not found" }, { status: 404 })
    }
    const safeBlock = JSON.parse(JSON.stringify(block, (_, v) => typeof v === 'bigint' ? v.toString() : v))
    return NextResponse.json({ safeBlock })
  } catch (error) {
    console.error(`Error fetching block ${hash}:`, error)
    return NextResponse.json({ error: "Failed to fetch block" }, { status: 500 })
  }
}
