"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { formatEther, Block, Transaction } from "viem";

import { getBlockWithTransactions } from "@/lib/ethereum";
import { formatTimestamp, truncateHash } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ThemeToggle } from "@/components/theme-toggle";
import { AddressWithCopy } from "@/components/address-with-copy";

export default function BlockDetails() {
  const params = useParams();
  const router = useRouter();
  const [block, setBlock] = useState<Block<bigint, true> | null>(null);
  const [loading, setLoading] = useState(true);
  const hash = params.hash as string;

  useEffect(() => {
    async function fetchBlock() {
      try {
        const blockData = await getBlockWithTransactions(hash);
        if (blockData) {
          setBlock(blockData);
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Failed to fetch block:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    }

    fetchBlock();
  }, [hash, router]);

  if (loading) {
    return <div className="container mx-auto py-8 px-4">Loading block details...</div>;
  }

  if (!block) {
    return <div className="container mx-auto py-8 px-4">Block not found</div>;
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
                <span className="font-semibold">Hash:</span> <span className="text-sm">{truncateHash(block.hash)}</span>
              </div>
              <div>
                <span className="font-semibold">Timestamp:</span> <span className="text-sm">{formatTimestamp(Number(block.timestamp) * 1000)}</span>
              </div>
              <div>
                <span className="font-semibold">Size:</span> <span className="text-sm">{block.size?.toString() || "N/A"} bytes</span>
              </div>
              <div>
                <span className="font-semibold">Parent Hash:</span>
                <Link href={`/block/${block.parentHash}`} className="text-blue-500 dark:text-blue-400 hover:underline">
                  <span className="text-sm">{truncateHash(block.parentHash)}</span>
                </Link>
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <span className="font-semibold">Miner:</span> <span className="text-sm">{block.miner}</span>
              </div>
              <div>
                <span className="font-semibold">Gas Used:</span> <span className="text-sm">{block.gasUsed?.toString() || "N/A"}</span>
              </div>
              <div>
                <span className="font-semibold">Base Fee:</span>{" "}
                <span className="text-sm">{block.baseFeePerGas ? formatEther(block.baseFeePerGas) : "N/A"} ETH</span>
              </div>
              <div>
                <span className="font-semibold">Gas Limit:</span> <span className="text-sm">{block.gasLimit?.toString() || "N/A"}</span>
              </div>
              <div>
                <span className="font-semibold">Nonce:</span> <span className="text-sm">{block.nonce || "N/A"}</span>
              </div>
              <div>
                <span className="font-semibold">Number of Transactions:</span> <span className="text-sm">{block.transactions.length}</span>
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
              {block.transactions && Array.isArray(block.transactions) && block.transactions.map((tx) => {
                const transaction = tx as Transaction;
                return (<TableRow key={transaction.hash}>
                  <TableCell>
                    <Link href={`/transaction/${transaction.hash}`} className="text-blue-500 dark:text-blue-400 hover:underline">
                      {transaction.hash.substring(0, 16)}...
                    </Link>
                  </TableCell>
                  <TableCell>
                    {transaction.from ? (
                      <AddressWithCopy address={transaction.from} />
                    ) : "N/A"}
                  </TableCell>
                  <TableCell>
                    {transaction.to ? (
                      <AddressWithCopy address={transaction.to} />
                    ) : "Contract Creation"}
                  </TableCell>
                  <TableCell>{transaction.value ? formatEther(transaction.value) : "0"} ETH</TableCell>
                </TableRow>)
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
