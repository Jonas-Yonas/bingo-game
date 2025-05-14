"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Moon, RocketIcon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function PublicTopbar() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const toggleTheme = () => {
    return null; // This line will be removed when request comes up

    if (!mounted) return;
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <header className="w-full px-6 py-4 border-b border-gray-800/40 bg-gray-900/80 backdrop-blur-md flex justify-between items-center">
      <div className="flex items-center gap-2">
        <RocketIcon className="h-6 w-6 text-emerald-400" />
        <span className="font-bold text-white text-lg">Bingo Blast</span>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-300 hover:text-white"
          onClick={toggleTheme}
        >
          {mounted && resolvedTheme === "dark" ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </Button>

        <Link href="/login">
          <Button
            variant="ghost"
            className="text-white hover:text-emerald-300 cursor-pointer"
          >
            Login
          </Button>
        </Link>

        <Link href="/register">
          <Button className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white cursor-pointer">
            Get Started
          </Button>
        </Link>
      </div>
    </header>
  );
}
