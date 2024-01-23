import { ExpenseCategory } from "@prisma/client";

export const seedCategories: Omit<ExpenseCategory, "id">[] = [
  {
    name: "Rent",
    icon: "🏠",
  },
  {
    name: "Utilities",
    icon: "🚰",
  },
  {
    name: "Groceries",
    icon: "🛍️",
  },
  {
    name: "Transportation",
    icon: "🚕",
  },
  {
    name: "Health",
    icon: "💊",
  },
  {
    name: "Entertainment",
    icon: "🎬",
  },
  {
    name: "Clothes",
    icon: "👗",
  },
  {
    name: "Personal Spendings",
    icon: "🫵🏼",
  },
  {
    name: "Gifts",
    icon: "🎁",
  },
  {
    name: "Mortgage",
    icon: "💰",
  },
  {
    name: "Dining Out",
    icon: "🍜",
  },
  {
    name: "Medication",
    icon: "🚑",
  },
  {
    name: "Savings",
    icon: "💵",
  },
  {
    name: "Borrowed money",
    icon: "🫴",
  },
];
