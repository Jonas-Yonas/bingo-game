"use client";

import { Spinner } from "@/components/ui/spinner";
import { useSession } from "next-auth/react";

import Link from "next/link";

export default function Dashboard() {
  const { data: session, status } = useSession();

  console.log(session);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="mt-4 text-gray-600">Loading dashboard...</p>

          <Spinner />

          {/* <Button disabled>
  <Spinner size="sm" className="mr-2" />
  Submitting...
</Button> */}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row">
        {/* <CollapsibleSidebar
          user={session?.user}
          isCollapsed={isCollapsed}
          toggleSidebar={toggleSidebar}
        /> */}

        {/* Main Content - Add transition to match sidebar */}
        <div className={`flex-1 p-6 transition-all duration-300 ease-in-out`}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Recent Games
                  </h2>
                  <Link
                    href="/admin/gigs"
                    className="text-sm text-violet-600 hover:text-violet-700"
                  >
                    View All
                  </Link>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Moderation Queue
                </h2>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Recent Activity
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
