"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Clock, Database, User } from "lucide-react"

import { formatTimestamp } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Block } from "viem"

export function Blocks() {
  const [blocks, setBlocks] = useState<Block[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchBlocks() {
      try {
        const response = await fetch("/api/blocks")

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setBlocks(data.blocks)
      } catch (err) {
        console.error("Failed to fetch blocks:", err)
        setError("Failed to load blocks. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchBlocks()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Latest Blocks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">Loading blocks...</div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Latest Blocks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500 py-4">{error}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Blocks</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Block Number</TableHead>
              <TableHead>Block Hash</TableHead>
              <TableHead>Miner Address</TableHead>
              <TableHead>Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(blocks) && blocks.map((block) => (
              <TableRow key={block.hash}>
                <TableCell>
                  <Link href={`/block/${block.hash}`} className="text-blue-500 dark:text-blue-400 hover:underline">
                    {block.number}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/block/${block.hash}`}
                    className="text-blue-500 dark:text-blue-400 hover:underline flex items-center"
                  >
                    <Database className="h-4 w-4 mr-2" />
                    {block.hash.substring(0, 16)}...
                  </Link>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    {block.miner.substring(0, 16)}...
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {formatTimestamp(Number(block.timestamp) * 1000)}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
