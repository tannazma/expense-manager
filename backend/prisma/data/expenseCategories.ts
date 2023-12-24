import { ExpenseCategory } from "@prisma/client";

export const seedCategories: ExpenseCategory[] = [
  {
    id: 1,
    name: "Rent",
    icon: "🏠",
  },
  {
    id: 2,
    name: "Utilities",
    icon: "🚰",
  },
  {
    id: 3,
    name: "Groceries",
    icon: "🛍️",
  },
  {
    id: 4,
    name: "Transportation",
    icon: "🚕",
  },
  {
    id: 5,
    name: "Health",
    icon: "💊",
  },
  {
    id: 6,
    name: "Entertainment",
    icon: "🎬",
  },
  {
    id: 7,
    name: "Clothes",
    icon: "👗",
  },
  {
    id: 8,
    name: "Personal Spendings",
    icon: "🫵🏼",
  },
  {
    id: 9,
    name: "Gifts",
    icon: "🎁",
  },
  {
    id: 10,
    name: "Mortgage",
    icon: "💰",
  },
  {
    id: 11,
    name: "Dining Out",
    icon: "🍜",
  },
  {
    id: 12,
    name: "Medication",
    icon: "🚑",
  },
  {
    id: 13,
    name: "Savings",
    icon: "💵",
  },
  {
    id: 14,
    name: "Borrowed money",
    icon: "🫴",
  },
];
