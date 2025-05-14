import { User } from "@prisma/client";

export interface Shop {
  id: string;
  name: string;
  location: string;
  shopCommission: number;
  systemCommission: number;
  walletBalance: number;
  cashiers?: Cashier[]; // Optional if not always included
  manager?: User | null; // Optional if not always included
  managerId?: string | null;
  cashierName?: string; // Add this if you're using it in your columns
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Cashier {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isActive?: boolean;
  status: "AVAILABLE" | "ON_BREAK" | "OFF_DUTY";
  // shop?: {
  //   id: string;
  //   name: string;
  //   location: string;
  // };
  shop?: Shop;
  createdAt?: Date;
  updatedAt?: Date;
}

export type Transaction = {
  id: string;
  shopName: string;
  amount: number;
  type: "TOP UP" | "DEBIT";
  description: string;
  createdAt: Date | string;
};
