"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaHome } from "react-icons/fa";
import { AuthForm } from "@/app/components/auth/auth-form";
import { Spinner } from "@/components/ui/spinner";

export default function RegisterPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 flex flex-col items-center justify-center">
        <Spinner />
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 bg-gray-800/50 backdrop-blur-sm">
        <CardHeader className="space-y-1 relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-4 text-emerald-400 hover:text-white cursor-pointer"
            onClick={() => router.push("/")}
          >
            <FaHome className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-center text-white">
            Create Your Account
          </h1>
          <p className="text-center text-gray-400">Join Bingo Blast today</p>
        </CardHeader>

        <CardContent>
          <AuthForm isLogin={false} />
        </CardContent>
      </Card>
    </div>
  );
}
