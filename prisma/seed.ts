import userData from "./data/users.json";
import expenseCategories from "./data/expenseCategories.json";
import incomeCategories from "./data/incomeCategories.json";
import incomesData from "./data/incomes.json";
import expensesData from "./data/expenses.json";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const seed = async () => {
  //   Seed every income categories
  for (let i = 0; i < incomeCategories.length; i++) {
    const theIncomeCategories = incomeCategories[i];
    await prisma.incomeCategory.create({
      data: theIncomeCategories,
    });
  }

  //   Seed every expense categories
  for (let i = 0; i < expenseCategories.length; i++) {
    const theExpensesCategories = expenseCategories[i];
    await prisma.expenseCategory.create({
      data: theExpensesCategories,
    });
  }
  // Seed every user
  for (let i = 0; i < userData.length; i++) {
    const thisUser = userData[i];
    await prisma.user.create({
      data: thisUser,
    });
  }
  // Seed every income
  for (let i = 0; i < incomesData.length; i++) {
    const thisIncome = incomesData[i];
    await prisma.income.create({
      data: thisIncome,
    });
  }

  // Seed every expense
  for (let i = 0; i < expensesData.length; i++) {
    const thisExpense = expensesData[i];
    await prisma.expense.create({
      data: thisExpense,
    });
  }
};
seed();
