"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { formatEther } from "viem"

import { formatTimestamp } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ThemeToggle } from "@/components/theme-toggle"
import { Transaction } from "viem"

export default function BlockDetails() {
  const params = useParams()
  const router = useRouter()
  const [block, setBlock] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const hash = params.hash

  useEffect(() => {
    async function fetchBlock() {
      try {
        const response = await fetch(`/api/blocks/${hash}`)

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Block not found")
          }
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setBlock(data.block)
      } catch (err) {
        console.error("Failed to fetch block:", err)
        setError(err.message || "Failed to load block details")
        if (err.message === "Block not found") {
          router.push("/")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchBlock()
  }, [hash, router])

  if (loading) {
    return <div className="container mx-auto py-8 px-4">Loading block details...</div>
  }

  if (error) {
    return <div className="container mx-auto py-8 px-4 text-red-500">{error}</div>
  }

  if (!block) {
    return <div className="container mx-auto py-8 px-4">Block not found</div>
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Block Details</h1>
        </div>
        <ThemeToggle />
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Block Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div>
                <span className="font-semibold">Hash:</span> {block.hash}
              </div>
              <div>
                <span className="font-semibold">Timestamp:</span> {formatTimestamp(Number(block.timestamp) * 1000)}
              </div>
              <div>
                <span className="font-semibold">Size:</span> {block.size?.toString() || "N/A"} bytes
              </div>
              <div>
                <span className="font-semibold">Parent Hash:</span> {block.parentHash}
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <span className="font-semibold">Miner:</span> {block.miner}
              </div>
              <div>
                <span className="font-semibold">Gas Used:</span> {block.gasUsed?.toString() || "N/A"}
              </div>
              <div>
                <span className="font-semibold">Base Fee:</span>{" "}
                {block.baseFeePerGas ? formatEther(block.baseFeePerGas) : "N/A"} ETH
              </div>
              <div>
                <span className="font-semibold">Gas Limit:</span> {block.gasLimit?.toString() || "N/A"}
              </div>
              <div>
                <span className="font-semibold">Block Number:</span> {block.number}
              </div>
              <div>
                <span className="font-semibold">Number of Transactions:</span> {block.transactions.length}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction Hash</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {block.transactions.map((tx: Transaction) => (
                <TableRow key={tx.hash}>
                  <TableCell>
                    <Link href={`/transaction/${tx.hash}`} className="text-blue-500 dark:text-blue-400 hover:underline">
                      {tx.hash.substring(0, 16)}...
                    </Link>
                  </TableCell>
                  <TableCell>{tx.from ? `${tx.from.substring(0, 10)}...` : "N/A"}</TableCell>
                  <TableCell>{tx.to ? `${tx.to.substring(0, 10)}...` : "Contract Creation"}</TableCell>
                  <TableCell>{tx.value ? formatEther(tx.value) : "0"} ETH</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
