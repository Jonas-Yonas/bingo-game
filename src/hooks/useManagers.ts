import { useEffect, useState } from "react";
import { User } from "@prisma/client";

export function useManagers() {
  const [managers, setManagers] = useState<
    Pick<User, "id" | "name" | "email">[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchManagers() {
      try {
        const response = await fetch("/api/users/managers");
        if (!response.ok) {
          throw new Error("Failed to fetch managers");
        }
        const data = await response.json();
        setManagers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    }

    fetchManagers();
  }, []);

  return { managers, isLoading, error };
}
