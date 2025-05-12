// import { ColumnDef } from "@tanstack/react-table";
// import { Badge } from "@/components/ui/badge";
// import { Cashier } from "@/types";
// import { Button } from "@/components/ui/button";

// export const cashierColumns: ColumnDef<Cashier>[] = [
//   {
//     accessorKey: "name", // Directly accessing the "name" field
//     header: "Name",
//   },
//   {
//     accessorKey: "email", // Directly accessing the "email" field
//     header: "Email",
//   },
//   {
//     accessorKey: "phone", // Directly accessing the "phone" field
//     header: "Phone",
//   },
//   {
//     accessorKey: "status", // Directly accessing the "status" field
//     header: "Status",
//     cell: ({ row }) => {
//       const status = row.original.status; // Get the cashier status
//       let badgeVariant:
//         | "default"
//         | "secondary"
//         | "destructive"
//         | "outline"
//         | null = null;

//       // Map the status to badge variant
//       if (status === "AVAILABLE") {
//         badgeVariant = "default";
//       } else if (status === "ON_BREAK") {
//         badgeVariant = "secondary"; // You can replace "secondary" with another variant if needed
//       } else if (status === "OFF_DUTY") {
//         badgeVariant = "destructive";
//       }

//       return (
//         <Badge
//           variant={badgeVariant} // Use the mapped variant
//           className="dark:bg-opacity-20 dark:text-opacity-90"
//         >
//           {status}
//         </Badge>
//       );
//     },
//   },
//   {
//     accessorKey: "createdAt", // Directly accessing the "createdAt" field
//     header: "Created At",
//     cell: ({ row }) => {
//       const createdAt = row.original.createdAt;
//       const date = new Date(createdAt);
//       return date.toLocaleString(); // Formatting the date
//     },
//   },
//   {
//     id: "action", // Action column for admin to block/unblock the cashier
//     header: "Action",
//     cell: ({ row }) => {
//       const isActive = row.original.status === "AVAILABLE"; // Check if cashier is available
//       return (
//         <Button
//           onClick={() =>
//             alert(`${isActive ? "Block" : "Unblock"} ${row.original.name}`)
//           }
//           className={`h-7 px-2.5 text-xs leading-none rounded-sm ${
//             !isActive ? "bg-red-400" : "bg-green-600"
//           }`}
//         >
//           {isActive ? "Block" : "Unblock"}
//         </Button>
//       );
//     },
//   },
// ];

// app/admin/cashiers/columns.ts
import { ColumnDef } from "@tanstack/react-table";
import { Cashier } from "@prisma/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

export const cashierColumns: ColumnDef<Cashier>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span
        className={`px-2 py-1 rounded-full text-xs ${
          row.original.isActive
            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
        }`}
      >
        {row.original.isActive ? "Active" : "Inactive"}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/admin/cashiers/${row.original.id}/edit`}>
            <Pencil className="h-4 w-4" />
          </Link>
        </Button>
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
