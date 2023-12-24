import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const port = 3001;
const prisma = new PrismaClient();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.get("/expenses", async (req, res) => {
  const allExpenses = await prisma.expense.findMany({
    include: {
      expenseCategory: true,
    },
  });
  res.json(allExpenses);
});

app.get("/expense-categories", async (req, res) => {
  const allExpensesCategories = await prisma.expenseCategory.findMany({});
  res.json(allExpensesCategories);
});

app.listen(port, () => {
  console.log(`⚡ Server listening on port: ${port}`);
});
