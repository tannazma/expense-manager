import userData from "./data/users.json";
import { seedCategories } from "./data/expenseCategories";
import { seedIncomeCategories } from "./data/incomeCategories";
import incomesData from "./data/incomes.json";
import accountsData from "./data/accounts.json";
import expensesData from "./data/expenses.json";
import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcrypt";

const prisma = new PrismaClient();

const seed = async () => {
  //   Seed every income categories
  for (let i = 0; i < seedIncomeCategories.length; i++) {
    const theIncomeCategories = seedIncomeCategories[i];
    await prisma.incomeCategory.create({
      data: theIncomeCategories,
    });
  }

  //   Seed every expense categories
  for (let i = 0; i < seedCategories.length; i++) {
    const theExpensesCategories = seedCategories[i];
    await prisma.expenseCategory.create({
      data: theExpensesCategories,
    });
  }
  // Seed every user
  for (let i = 0; i < userData.length; i++) {
    const thisUser = userData[i];
    await prisma.user.create({
      data: {
        // id: thisUser.id,
        email: thisUser.email,
        password: hashSync(thisUser.password, 10),
        username: thisUser.username,
      },
    });
  }
  // Seed every account
  for (let i = 0; i < accountsData.length; i++) {
    const thisAccount = accountsData[i];
    await prisma.account.create({
      data: thisAccount,
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
