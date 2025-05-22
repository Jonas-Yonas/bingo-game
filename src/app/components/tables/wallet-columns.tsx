import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Transaction } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

export const transactionColumns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "shopName",
    header: "Shop",
    cell: ({ row }) => (
      <div className="max-w-[150px]">
        <div className="font-medium truncate">
          {row.original.shopName.replace(/Bingo\s*/i, "")}
        </div>
        <div className="text-xs text-muted-foreground truncate">
          {row.original.type}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <span
        className={cn(
          "font-medium",
          row.original.type === "TOP UP" ? "text-green-600" : "text-red-600"
        )}
      >
        {row.original.type === "TOP UP" ? "+" : "-"}$
        {Math.abs(row.original.amount).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="max-w-[200px]">
        <div className="truncate">{row.original.description}</div>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date & Time",
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return (
        <div className="whitespace-nowrap">
          <div>{date.toLocaleDateString()}</div>
          <div className="text-xs text-muted-foreground">
            {date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({}) => (
      <Button variant="ghost" size="sm">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    ),
  },
];
