import { IncomeCategory } from "@prisma/client";

export const seedIncomeCategories: Omit<IncomeCategory, "id">[] = [
  {
    name: "Salary",
    icon: "💸",
  },
  {
    name: "Social media",
    icon: "📸",
  },
  {
    name: "Forex",
    icon: "📊",
  },
];
