import { Prisma } from "@prisma/client";

// src/lib/mongodb-error-handler.ts
export function handleMongoError(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return {
          message: "Duplicate key violation",
          target: error.meta?.target,
        };
      case "P2025":
        return { message: "Record not found" };
      default:
        return { message: "Database operation failed" };
    }
  }
  return { message: "Unknown database error" };
}
