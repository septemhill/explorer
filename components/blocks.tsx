"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, Database, User } from "lucide-react";
import { Block } from "viem";

import { getLatestBlocks } from "@/lib/ethereum";
import { formatTimestamp, truncateHash } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AddressWithCopy } from "@/components/address-with-copy";

interface BlockData {
  hash: `0x${string}` | null;
  miner: `0x${string}`;
  timestamp: number | bigint;
  number: bigint;
}

export function Blocks() {
  const [blocks, setBlocks] = useState<BlockData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBlocks() {
      try {
        const latestBlocks = await getLatestBlocks()
        setBlocks(latestBlocks as BlockData[])
      } catch (error) {
        console.error("Failed to fetch blocks:", error)
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
            {blocks.map((block) => {
              return (<TableRow key={block.hash ?? ""}>
                <TableCell>
                  <Link
                    href={`/block/${block.hash}`}
                    className="text-blue-500 dark:text-blue-400 hover:underline"
                  >
                    {block.number?.toString() || "N/A"}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/block/${block.hash}`}
                    className="text-blue-500 dark:text-blue-400 hover:underline flex items-center"
                  >
                    <Database className="h-4 w-4 mr-2" />
                    {truncateHash(block.hash)}
                  </Link>
                </TableCell>
                <TableCell>
                  <AddressWithCopy address={block.miner} className="mr-2" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {formatTimestamp(Number(block.timestamp) * 1000)}
                  </div>
                </TableCell>
              </TableRow>)
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
