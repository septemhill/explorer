"use client";

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { formatEther } from "viem";
import Link from "next/link";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatTimestamp } from "@/lib/utils";
import { getRecentTransactions } from "@/lib/ethereum";

interface Transaction {
    hash: `0x${string}`;
    timestamp: number;
    from: `0x${string}`;
    to: `0x${string}` | null;
    value: bigint;
}

export default function AccountDetails() {
    const params = useParams();
    const router = useRouter();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const address = params.address as string;

    useEffect(() => {
        async function fetchTransactions() {
            try {
                const recentTransactions = await getRecentTransactions(address);
                const transactionData = recentTransactions.map(tx => ({
                    hash: tx.hash,
                    timestamp: Number(tx.blockNumber),
                    from: tx.from,
                    to: tx.to,
                    value: tx.value,
                }));

                setTransactions(transactionData);
            } catch (error) {
                console.error("Failed to fetch transactions:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchTransactions();
    }, [address, router]);

    if (loading) {
        return <div className="container mx-auto py-8 px-4">Loading account details...</div>;
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <Card>
                <CardHeader>
                    <CardTitle>Account: {address}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Transaction Hash</TableHead>
                                <TableHead>Timestamp</TableHead>
                                <TableHead>From</TableHead>
                                <TableHead>To</TableHead>
                                <TableHead>Value</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.map((tx) => (
                                <TableRow key={tx.hash}>
                                    <TableCell>
                                        <Link href={`/transaction/${tx.hash}`} className="text-blue-500 dark:text-blue-400 hover:underline">
                                            {tx.hash.substring(0, 16)}...
                                        </Link>
                                    </TableCell>
                                    <TableCell>{formatTimestamp(tx.timestamp)}</TableCell>
                                    <TableCell>{tx.from}</TableCell>
                                    <TableCell>{tx.to}</TableCell>
                                    <TableCell>{tx.value ? formatEther(tx.value) : "0"} ETH</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
