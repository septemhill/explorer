"use client"

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";

import { getTransaction } from "@/lib/ethereum";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { truncateHash } from "@/lib/utils";

interface Transaction {
  hash: string;
  blockHash: string;
  blockNumber: bigint;
  transactionIndex: number;
  from: string;
  to: string | null;
  value: bigint;
  gasPrice: bigint | undefined;
  data: string;
  receipt: {
    status: number;
    gasUsed: bigint;
    contractAddress: string | null | undefined;
  };
}

export default function TransactionDetails() {
  const params = useParams<{ hash?: string }>();
  const router = useRouter();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const hash = params.hash as string;

  useEffect(() => {
    async function fetchTransaction() {
      try {
        const txData = await getTransaction(hash);
        if (txData) {
          setTransaction(txData);
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Failed to fetch transaction:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    }

    fetchTransaction();
  }, [hash, router]);

  if (loading) {
    return <div className="container mx-auto py-8 px-4">Loading transaction details...</div>;
  }

  if (!transaction) {
    return <div className="container mx-auto py-8 px-4">Transaction not found</div>;
  }

  const isSuccess = transaction.receipt?.status === 1;

  const formatBigInt = (value: bigint | undefined): string => {
    if (value === undefined) {
      return "N/A";
    }
    const ethValue = Number(value / 1000000000000000000n);
    return ethValue.toFixed(2);
  };

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
                <span className="font-semibold">Transaction Hash:</span> {truncateHash(transaction.hash)}
              </div>
              <Separator />

              <div>
                <span className="font-semibold">Status:</span>{" "}
                {isSuccess ? (
                  <span className="text-green-500 dark:text-green-400 flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" /> Success
                  </span>
                ) : (
                  <span className="text-red-500 dark:text-red-400 flex items-center gap-1">
                    <XCircle className="h-4 w-4" /> Failed
                  </span>
                )}
              </div>
              <Separator />

              <div>
                <span className="font-semibold">Block:</span>{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto text-blue-500 dark:text-blue-400"
                  onClick={() => transaction.blockHash && router.push(`/block/${transaction.blockHash}`)}
                >
                  {truncateHash(transaction.blockHash)}
                </Button>
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
                <span className="font-semibold">From:</span> {truncateHash(transaction.from)}
              </div>
              <Separator />

              <div>
                <span className="font-semibold">To:</span> {transaction.to ? truncateHash(transaction.to) : "Contract Creation"}
              </div>
              <Separator />

              <div>
                <span className="font-semibold">Value:</span>{" "}
                {transaction.value ? formatBigInt(transaction.value) : "0"} ETH
              </div>
              <Separator />

              <div>
                <span className="font-semibold">Gas Used:</span> {transaction.receipt?.gasUsed?.toString() || "Pending"}
              </div>
              <Separator />

              <div>
                <span className="font-semibold">Gas Price:</span>{" "}
                {transaction.gasPrice ? formatBigInt(transaction.gasPrice) : "N/A"} Gwei
              </div>
              <Separator />

              {transaction.receipt?.contractAddress && (
                <>
                  <div>
                    <span className="font-semibold">Contract Address:</span> {truncateHash(transaction.receipt.contractAddress)}
                  </div>
                  <Separator />
                </>
              )}

              <div>
                <span className="font-semibold">Data:</span>
                <div className="mt-2 p-4 bg-gray-100 dark:bg-gray-800 rounded-md overflow-x-auto">
                  <code className="text-xs">{transaction.data || "0x"}</code>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
