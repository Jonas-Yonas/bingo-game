import { WalletTransaction } from "@/types";
import { ColumnDef } from "@tanstack/react-table";

export const transactionColumns: ColumnDef<WalletTransaction>[] = [
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      return new Date(row.original.createdAt).toLocaleDateString();
    },
  },
  {
    accessorKey: "shop.name",
    header: "Shop",
    cell: ({ row }) => {
      return row.original.shop?.name || "-";
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const type = row.original.type;
      const amount = row.original.amount;
      return `${type === "CREDIT" ? "+" : "-"}$${Math.abs(amount).toFixed(2)}`;
    },
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "method",
    header: "Method",
    cell: ({ row }) => {
      return row.original.method.replace("_", " ");
    },
  },
  {
    accessorKey: "reference",
    header: "Reference",
    cell: ({ row }) => {
      const value = row.getValue("reference") as string;
      return (
        <div
          title={value}
          className="max-w-[150px] truncate whitespace-nowrap overflow-hidden text-ellipsis"
        >
          {value}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <span
          className={`px-2 py-1 rounded text-xs ${
            status === "completed"
              ? "bg-green-100 text-green-800"
              : status === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {status}
        </span>
      );
    },
  },
];
