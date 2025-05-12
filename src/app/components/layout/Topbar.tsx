"use client";

import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { User, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "../Navbar";

export function Topbar() {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 w-full bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-700">
      <Navbar />

      <div className="ml-auto flex justify-between items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full cursor-pointer"
              disabled={status === "loading"}
            >
              {status === "loading" ? (
                <Skeleton className="size-8 rounded-full" />
              ) : (
                <User className="size-5" />
              )}
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              {status === "authenticated" ? (
                <div className="flex flex-col">
                  <span className="font-medium truncate">
                    {session.user?.name || "User"}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {session.user?.email}
                  </span>
                </div>
              ) : (
                "Account"
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 size-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                signOut({
                  callbackUrl: "/login",
                  redirect: true,
                })
              }
            >
              <LogOut className="mr-2 size-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
