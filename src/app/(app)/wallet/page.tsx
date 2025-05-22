"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/app/components/icons";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import {
  useWalletTransactions,
  useTopUpWallet,
} from "@/hooks/useWalletTransactions";
import { DataTable } from "@/components/ui/data-table";
import { transactionColumns } from "@/app/components/tables/transaction-columns";
import { TopUpModal } from "@/app/components/wallet/TopupModal";

export default function WalletPage() {
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const { data: transactions = [], isLoading, error } = useWalletTransactions();
  const { mutate: topUpWallet, isPending: isToppingUp } = useTopUpWallet();

  const handleTopUpSubmit = (values: {
    amount: number;
    method: string;
    reference: string;
    shopId: string;
  }) => {
    topUpWallet(values);
    setIsTopUpOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error:{" "}
        {error instanceof Error ? error.message : "Failed to load transactions"}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Wallet Transactions</h1>
        <Button onClick={() => setIsTopUpOpen(true)}>
          <Icons.plus className="h-4 w-4 mr-2" />
          Top Up
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={transactionColumns}
              data={transactions}
              emptyMessage="No transactions found"
            />
          </CardContent>
        </Card>
      </div>

      <TopUpModal
        open={isTopUpOpen}
        onClose={() => setIsTopUpOpen(false)}
        onSubmit={handleTopUpSubmit}
        isLoading={isToppingUp}
      />
    </div>
  );
}
