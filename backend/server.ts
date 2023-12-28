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

app.get("/expenses-sum", async (req, res) => {
  const groupedExpenses = await prisma.expense.findMany({
    select: {
      expenseCategoryId: true,
      expenseCategory: true,
      amount: true,
    },
  });

  let summedExpenses: { expenseCategoryId: number; amount: number }[] = [];

  groupedExpenses.forEach((expense) => {
    const index = summedExpenses.findIndex(
      (x) => x.expenseCategoryId === expense.expenseCategoryId
    );

    if (index >= 0) {
      summedExpenses[index].amount += expense.amount;
    } else {
      summedExpenses.push({
        expenseCategoryId: expense.expenseCategoryId,
        amount: expense.amount,
      });
    }
  });

  res.status(201).send(summedExpenses);
});

app.get("/incomes-sum", async (req, res) => {
  const groupedIncomes = await prisma.income.findMany({
    select: {
      incomeCategoryId: true,
      incomeCategory: true,
      amount: true,
    },
  });

  let summedIncomes: { incomeCategoryId: number; amount: number }[] = [];

  groupedIncomes.forEach((income) => {
    const index = summedIncomes.findIndex(
      (x) => x.incomeCategoryId === income.incomeCategoryId
    );

    if (index >= 0) {
      summedIncomes[index].amount += income.amount;
    } else {
      summedIncomes.push({
        incomeCategoryId: income.incomeCategoryId,
        amount: income.amount,
      });
    }
  });

  res.status(201).send(summedIncomes);
});

app.get("/category/:categoryId/expenses", async (req, res) => {
  const categoryIdAsNumber = Number(req.params.categoryId);
  const expenses = await prisma.expense.findMany({
    where: {
      expenseCategoryId: categoryIdAsNumber,
    },
    include: {
      expenseCategory: true,
      user: true,
    },
  });
  if (!expenses) {
    res.status(404).send({
      message: "Expense Category with that id not found",
    });
    return;
  }
  res.status(200).send(expenses);
});

app.get("/category/:categoryId/incomes", async (req, res) => {
  const categoryIdAsNumber = Number(req.params.categoryId);
  const incomes = await prisma.income.findMany({
    where: {
      incomeCategoryId: categoryIdAsNumber,
    },
    include: {
      incomeCategory: true,
      user: true,
    },
  });
  if (!incomes) {
    res.status(404).send({
      message: "Expense Category with that id not found",
    });
    return;
  }
  res.status(200).send(incomes);
});

app.listen(port, () => {
  console.log(`⚡ Server listening on port: ${port}`);
});
