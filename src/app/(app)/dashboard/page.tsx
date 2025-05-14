"use client";

import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { Spinner } from "@/components/ui/spinner";

// import Dashboard from "@/app/components/Dashboard";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div>
        <Spinner />
        <p className="text-muted-foreground text-sm">
          Loading your experience...
        </p>
      </div>
    );
  }

  if (!session) {
    redirect("/login");
  }
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold pb-6">Dashboard</h1>
      <p>Welcome back, {session.user.email}</p>

      {/* <Dashboard /> */}
    </div>
  );
}
