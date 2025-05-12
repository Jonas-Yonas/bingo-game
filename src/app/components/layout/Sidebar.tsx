"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Wallet,
  Users,
  ShoppingCart,
  ChevronFirst,
  Menu,
} from "lucide-react";

const SIDEBAR_ITEMS = [
  {
    name: "Dashboard",
    icon: <LayoutDashboard className="size-5" />,
    href: "/dashboard",
  },
  {
    name: "Cashiers",
    icon: <Users className="size-5" />,
    href: "/cashiers/cashier-list",
  },
  {
    name: "Shops",
    icon: <ShoppingCart className="size-5" />,
    href: "/shops/shop-list",
  },
  {
    name: "Wallet History",
    icon: <Wallet className="size-5" />,
    href: "/wallet",
  },
] as const;

export function Sidebar({
  isCollapsed,
  setIsCollapsed,
}: {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}) {
  return (
    <aside
      className={cn(
        "fixed h-screen z-10 bg-background border-r transition-all duration-300 ease-in-out w-full bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-700",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b px-4 w-full bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-700">
        {!isCollapsed && (
          <h1 className="text-lg font-semibold truncate">Bingo Admin</h1>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="size-8"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <Menu className="size-4" />
          ) : (
            <ChevronFirst className="size-4" />
          )}
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        <ul className="space-y-1">
          {SIDEBAR_ITEMS.map((item) => (
            <li key={item.name}>
              <Link href={item.href} legacyBehavior passHref>
                <Button
                  asChild
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 h-11",
                    isCollapsed && "justify-center px-0"
                  )}
                >
                  <a>
                    {item.icon}
                    {!isCollapsed && (
                      <span className="truncate">{item.name}</span>
                    )}
                  </a>
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
