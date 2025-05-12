// "use client";

// import { cashierColumns } from "@/app/components/tables/cashier-columns";
// import { DataTable } from "@/components/ui/data-table";
// import { dummyCashiers } from "@/lib/data";

// const page = () => {
//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-bold pb-6">Cashiers</h1>

//       <DataTable data={dummyCashiers} columns={cashierColumns} />
//     </div>
//   );
// };

// export default page;

// app/admin/cashiers/page.tsx

// "use client";

// import Link from "next/link";
// import { PlusCircle, Loader2, Pencil, Trash2 } from "lucide-react";
// import { DataTable } from "@/components/ui/data-table";
// import { Button } from "@/components/ui/button";
// import { useCashier } from "@/hooks/useCashiers";
// import { cashierColumns } from "@/app/components/tables/cashier-columns";
// // import { cashierColumns } from "./columns";
// // import { useCashiers } from "@/hooks/useCashiers";

// const CashiersPage = () => {
//   const { data: cashiers, isLoading, error } = useCashier();

//   if (isLoading) {
//     return (
//       <div className="p-8 flex justify-center">
//         <Loader2 className="h-8 w-8 animate-spin" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-8 text-red-500">
//         Error loading cashiers: {error.message}
//       </div>
//     );
//   }

//   return (
//     <div className="p-8 space-y-4">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold">Cashiers</h1>
//         <Button asChild>
//           <Link href="/cashiers/add" className="flex items-center gap-2">
//             <PlusCircle className="h-4 w-4" />
//             Add Cashier
//           </Link>
//         </Button>
//       </div>

//       <DataTable
//         data={cashiers || []}
//         columns={cashierColumns}
//         emptyMessage="No cashiers found."
//       />
//     </div>
//   );
// };

// export default CashiersPage;

// app/admin/cashiers/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { AddCashierModal } from "@/app/components/cashier/AddCashierModal";
import { useCashier } from "@/hooks/useCashiers";
import { cashierColumns } from "@/app/components/tables/cashier-columns";
// import { DataTable } from "./_components/DataTable";
// import { AddCashierModal } from "./_components/AddCashierModal";

export default function CashiersPage() {
  const { data: cashiers, isLoading, error } = useCashier();

  const [isAddModalOpen, setAddModalOpen] = useState(false);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cashiers</h1>
        <Button onClick={() => setAddModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Cashier
        </Button>
      </div>

      <DataTable
        data={cashiers || []}
        columns={cashierColumns}
        emptyMessage="No cashiers found."
      />

      <AddCashierModal
        open={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
      />
    </div>
  );
}
