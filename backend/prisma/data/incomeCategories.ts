import { IncomeCategory } from "@prisma/client";

export const seedIncomeCategories: IncomeCategory[] = [
  {
    "id": 1,
    "name": "Salary",
    "icon": "💸"
  },
  {
    "id": 2,
    "name": "Social media",
    "icon": "📸"
  },
  {
    "id": 3,
    "name": "Forex",
    "icon": "📊"
  }
]
