import { ColumnDef } from "@tanstack/react-table";
import { Cashier } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const cashierColumns: ColumnDef<Cashier>[] = [
  {
    accessorKey: "name",
    header: "Cashier Name",
    cell: ({ row }) => (
      <div className="max-w-[180px]">
        <div className="font-medium truncate">{row.original.name}</div>
        <div className="text-xs text-muted-foreground truncate">
          {row.original.email}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: "Contact",
    cell: ({ row }) => (
      <div className="max-w-[150px]">
        <div className="text-sm truncate">
          {row.original.phone || "Not Provided"}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="max-w-[150px]">
        <div className="text-sm truncate">
          {row.original.email || "Not Provided"}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      // Map statuses to your available variants
      const statusVariantMap = {
        AVAILABLE: "default", // Using 'default' for available
        ON_BREAK: "outline", // Using 'outline' for on break
        OFF_DUTY: "destructive", // Using 'destructive' for off duty
      } as const;

      return (
        <div className="flex items-center gap-2 max-w-[180px]">
          {/* Status Badge */}
          <Badge
            variant={
              statusVariantMap[
                row.original.status as keyof typeof statusVariantMap
              ] || "secondary"
            }
            className={`capitalize ${
              row.original.status === "AVAILABLE"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : row.original.status === "ON_BREAK"
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                : ""
            }`}
          >
            {row.original.status.toLowerCase().replace("_", " ")}
          </Badge>

          {/* Active/Inactive Indicator */}
          <div className="flex items-center gap-1">
            <span
              className={`w-2 h-2 rounded-full ${
                row.original.isActive ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="text-xs text-muted-foreground">
              {row.original.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "shop",
    header: "Assigned Shop",
    cell: ({ row }) => {
      const shop = row.original.shop;
      return (
        <div className="max-w-[180px]">
          <div className="text-sm truncate">{shop?.name || "Unassigned"}</div>
          {shop?.location && (
            <div className="text-xs text-muted-foreground truncate">
              {shop.location.split(",")[0]?.trim()}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Joined On",
    cell: ({ row }) => (
      <div className="max-w-[120px]">
        <div className="text-sm">
          {new Date(row.original.createdAt!).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "id",
    header: "Cashier ID",
    cell: ({ row }) => {
      const id = row.original.id;
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="max-w-[120px] truncate cursor-pointer">{id}</div>
          </TooltipTrigger>
          <TooltipContent className="max-w-[300px] break-words">
            {id}
          </TooltipContent>
        </Tooltip>
      );
    },
  },
];
