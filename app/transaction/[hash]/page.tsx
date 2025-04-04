"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react"
import { formatEther, formatGwei } from "viem"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/theme-toggle"

export default function TransactionDetails() {
  const params = useParams()
  const router = useRouter()
  const [transaction, setTransaction] = useState(null)
  const [receipt, setReceipt] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const hash = params.hash

  useEffect(() => {
    async function fetchTransaction() {
      try {
        const response = await fetch(`/api/transactions/${hash}`)

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Transaction not found")
          }
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setTransaction(data.transaction)
        setReceipt(data.receipt)
      } catch (err) {
        console.error("Failed to fetch transaction:", err)
        setError(err.message || "Failed to load transaction details")
        if (err.message === "Transaction not found") {
          router.push("/")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchTransaction()
  }, [hash, router])

  if (loading) {
    return <div className="container mx-auto py-8 px-4">Loading transaction details...</div>
  }

  if (error) {
    return <div className="container mx-auto py-8 px-4 text-red-500">{error}</div>
  }

  if (!transaction) {
    return <div className="container mx-auto py-8 px-4">Transaction not found</div>
  }

  const isSuccess = receipt?.status === 1

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Transaction Details</h1>
        </div>
        <ThemeToggle />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-4">
              <div>
                <span className="font-semibold">Transaction Hash:</span> {transaction.hash}
              </div>
              <Separator />

              <div>
                <span className="font-semibold">Status:</span>{" "}
                {receipt ? (
                  isSuccess ? (
                    <span className="text-green-500 dark:text-green-400 flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" /> Success
                    </span>
                  ) : (
                    <span className="text-red-500 dark:text-red-400 flex items-center gap-1">
                      <XCircle className="h-4 w-4" /> Failed
                    </span>
                  )
                ) : (
                  <span className="text-yellow-500 dark:text-yellow-400">Pending</span>
                )}
              </div>
              <Separator />

              <div>
                <span className="font-semibold">Block:</span>{" "}
                {transaction.blockHash ? (
                  <Button
                    variant="link"
                    className="p-0 h-auto text-blue-500 dark:text-blue-400"
                    onClick={() => router.push(`/block/${transaction.blockHash}`)}
                  >
                    {transaction.blockHash}
                  </Button>
                ) : (
                  "Pending"
                )}
              </div>
              <Separator />

              <div>
                <span className="font-semibold">Block Number:</span> {transaction.blockNumber?.toString() || "Pending"}
              </div>
              <Separator />

              <div>
                <span className="font-semibold">Transaction Index:</span>{" "}
                {transaction.transactionIndex?.toString() || "Pending"}
              </div>
              <Separator />

              <div>
                <span className="font-semibold">From:</span> {transaction.from}
              </div>
              <Separator />

              <div>
                <span className="font-semibold">To:</span> {transaction.to || "Contract Creation"}
              </div>
              <Separator />

              <div>
                <span className="font-semibold">Value:</span> {transaction.value ? formatEther(transaction.value) : "0"}{" "}
                ETH
              </div>
              <Separator />

              <div>
                <span className="font-semibold">Gas Used:</span> {receipt?.gasUsed?.toString() || "Pending"}
              </div>
              <Separator />

              <div>
                <span className="font-semibold">Gas Price:</span>{" "}
                {transaction.gasPrice ? formatGwei(transaction.gasPrice) : "N/A"} Gwei
              </div>
              <Separator />

              {receipt?.contractAddress && (
                <>
                  <div>
                    <span className="font-semibold">Contract Address:</span> {receipt.contractAddress}
                  </div>
                  <Separator />
                </>
              )}

              <div>
                <span className="font-semibold">Data:</span>
                <div className="mt-2 p-4 bg-gray-100 dark:bg-gray-800 rounded-md overflow-x-auto">
                  <code className="text-xs">{transaction.input || "0x"}</code>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

