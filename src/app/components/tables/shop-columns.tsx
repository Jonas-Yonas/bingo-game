import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Shop } from "@/types";
import { ColumnDef } from "@tanstack/react-table";

export const shopColumns: ColumnDef<Shop>[] = [
  {
    accessorKey: "name",
    header: "Shop Name",
    cell: ({ row }) => (
      <div className="max-w-[180px]">
        <div className="font-medium truncate">{row.original.name}</div>
        {row.original.cashierName && (
          <div className="text-xs text-muted-foreground">
            {row.original.cashierName}
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => {
      const parts = row.original.location.split(",");
      return (
        <div className="max-w-[180px]">
          <div className="font-medium truncate">{parts[0]?.trim()}</div>
          <div className="text-xs text-muted-foreground truncate">
            {parts[1]?.trim()}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "cashierName",
    header: "Cashier",
    cell: ({ row }) => {
      const cashierName = row.original.cashierName;

      // If cashierName is not available, display a placeholder
      return (
        <div className="text-sm text-gray-500">
          {cashierName ? cashierName : "To Be Linked"}
        </div>
      );
    },
  },
  {
    accessorKey: "shopCommission",
    header: "Shop Commission",
    cell: ({ row }) => `${row.original.shopCommission}%`,
  },
  {
    accessorKey: "systemCommission",
    header: "System Commission",
    cell: ({ row }) => `${row.original.systemCommission}%`,
  },
  {
    accessorKey: "walletBalance",
    header: "Wallet Balance",
    cell: ({ row }) => (
      <span className="font-medium">
        $
        {row.original.walletBalance.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    ),
  },
  {
    accessorKey: "id",
    header: "Shop ID",
    cell: ({ row }) => {
      const id = row.original.id;

      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="max-w-[120px] truncate cursor-pointer">{id}</div>
          </TooltipTrigger>
          <TooltipContent
            className="bg-gray-200 text-gray-950 px-2 py-2 rounded-sm shadow-lg z-50"
            style={{ maxWidth: "300px", wordWrap: "break-word" }}
          >
            {id}
          </TooltipContent>
        </Tooltip>
      );
    },
  },
];
