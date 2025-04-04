import { createPublicClient, http } from "viem"
import { mainnet } from "viem/chains"
import { NextResponse } from "next/server"
import { getLatestBlocks } from "@/lib/ethereum"

export async function GET() {
  try {
    const rawBlocks = await getLatestBlocks()

    const blocks = rawBlocks.map((block) => {
      return JSON.parse(JSON.stringify(block, (_, v) => typeof v === 'bigint' ? v.toString() : v))
    })

    return NextResponse.json({ blocks })
  } catch (error) {
    console.error("Error fetching blocks:", error)
    return NextResponse.json({ error: "Failed to fetch blocks" }, { status: 500 })
  }
}

