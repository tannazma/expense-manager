import express from "express";
import cors from "cors";
import { json } from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const port = 3001;
const prisma = new PrismaClient();

app.use(cors());
app.use(json());

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

app.post("/expenses", async (req, res) => {
  const requestBody = req.body;
  if (
    "amount" in requestBody &&
    "expenseCategoryId" in requestBody &&
    "details" in requestBody
  ) {
    try {
      await prisma.expense.create({
        data: requestBody,
      });
      res.status(201).send({ message: "Expense created!" });
    } catch (error) {
      res.status(500).send({ message: "Something went wrong!" });
      console.error("error while creating expense:", error);
    }
  } else {
    res.status(400).send({
      message: "amount and expenseCategoryId and details are required.",
    });
  }
});

app.get("/incomes", async (req, res) => {
  const allIncomes = await prisma.income.findMany({
    include: {
      incomeCategory: true,
    },
  });
  res.json(allIncomes);
});

app.get("/income-categories", async (req, res) => {
  const allIncomesCategories = await prisma.incomeCategory.findMany({});
  res.json(allIncomesCategories);
});

app.post("/incomes", async (req, res) => {
  const requestBody = req.body;
  if (
    "amount" in requestBody &&
    "incomeCategoryId" in requestBody &&
    "details" in requestBody
  ) {
    try {
      await prisma.income.create({
        data: requestBody,
      });
      res.status(201).send({ message: "Income created!" });
    } catch (error) {
      res.status(500).send({ message: "Something went wrong!" });
      console.error("error while creating income:", error);
    }
  } else {
    res.status(400).send({
      message: "amount and incomeCategoryId and details are required.",
    });
  }
});

app.listen(port, () => {
  console.log(`⚡ Server listening on port: ${port}`);
});
