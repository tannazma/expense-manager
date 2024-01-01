import express, { json } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { toToken } from "./auth/jwt";
import { AuthMiddleware, AuthRequest } from "./auth/middleware";

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

app.get("/account/:accountId/expenses", async (req, res) => {
  const accountIdAsNumber = Number(req.params.accountId);
  if (!accountIdAsNumber) {
    res.status(404).send({
      message: "Expense with that account id not found",
    });
    return;
  }
  const expensesForTheAccountId = await prisma.expense.findMany({
    where: {
      accountId: accountIdAsNumber,
    },
    include: {
      account: true,
      expenseCategory: true,
    },
  });

  res.status(200).send(expensesForTheAccountId);
});

app.get("/accounts/:accountId/incomes", async (req, res) => {
  const accountIdAsNumber = Number(req.params.accountId);
  if (!accountIdAsNumber) {
    res.status(404).send({
      message: "Income with that account id not found",
    });
    return;
  }
  const incomesForTheAccountId = await prisma.income.findMany({
    where: {
      accountId: accountIdAsNumber,
    },
    include: {
      accounts: true,
      incomeCategory: true,
    },
  });

  res.status(200).send(incomesForTheAccountId);
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
    "details" in requestBody &&
    "date" in requestBody &&
    "accountId" in requestBody
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
      message:
        "amount, date, accountId and expenseCategoryId and details are required.",
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

app.get("/accounts", async (req, res) => {
  const allAccounts = await prisma.account.findMany({
    where: {
      // for now I juste wanted the accounts for userId=1 and later I will change it
      userId: 1,
    },
  });
  res.json(allAccounts);
});

app.get("/user", AuthMiddleware, async (req: AuthRequest, res) => {
  const loggedInUser = await prisma.user.findFirst({
    where: {
      id: req.userId,
    },
  });
  res.json(loggedInUser);
});

app.post("/incomes", async (req, res) => {
  const requestBody = req.body;
  if (
    "amount" in requestBody &&
    "incomeCategoryId" in requestBody &&
    "details" in requestBody &&
    "date" in requestBody &&
    "accountId" in requestBody
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
      message:
        "amount, date, accountId and incomeCategoryId and details are required.",
    });
  }
});

app.get("/accounts/:accountId/expenses-sum", async (req, res) => {
  const accountIdAsNumber = Number(req.params.accountId);
  if (isNaN(accountIdAsNumber)) {
    res.status(404).send({
      message: "Expense with that account id not found",
    });
    return;
  }

  const groupedExpenses = await prisma.expense.findMany({
    where:
      accountIdAsNumber === 0
        ? {}
        : {
            accountId: accountIdAsNumber,
          },
    select: {
      expenseCategoryId: true,
      expenseCategory: true,
      amount: true,
    },
  });

  let summedExpenses: {
    expenseCategoryId: number;
    expenseCategoryName: string;
    amount: number;
  }[] = [];

  groupedExpenses.forEach((expense) => {
    const index = summedExpenses.findIndex(
      (x) => x.expenseCategoryId === expense.expenseCategoryId
    );

    if (index >= 0) {
      summedExpenses[index].amount += expense.amount;
    } else {
      summedExpenses.push({
        expenseCategoryId: expense.expenseCategoryId,
        expenseCategoryName: expense.expenseCategory.name,
        amount: expense.amount,
      });
    }
  });

  res.status(201).send(summedExpenses);
});

app.get("/accounts/:accountId/incomes-sum", async (req, res) => {
  const accountIdAsNumber = Number(req.params.accountId);
  if (isNaN(accountIdAsNumber)) {
    res.status(404).send({
      message: "Income with that account id not found",
    });
    return;
  }
  const groupedIncomes = await prisma.income.findMany({
    where: accountIdAsNumber === 0 ? {} : { accountId: accountIdAsNumber },
    select: {
      incomeCategoryId: true,
      incomeCategory: true,
      amount: true,
      accounts: true,
    },
  });

  let summedIncomes: {
    incomeCategoryId: number;
    amount: number;
    incomeCategoryName: string;
  }[] = [];

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
        incomeCategoryName: income.incomeCategory.name,
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
      account: true,
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
      accounts: true,
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

app.post("/login", async (req, res) => {
  const requestBody = req.body;
  if ("username" in requestBody && "password" in requestBody) {
    try {
      const userToLogin = await prisma.user.findFirst({
        where: {
          username: requestBody.username,
        },
      });
      if (userToLogin && userToLogin.password === requestBody.password) {
        const token = toToken({ userId: userToLogin.id });
        res.status(200).send({ token: token });
        return;
      }
      res.status(400).send({ message: "Login failed" });
    } catch (error) {
      res.status(500).send({ message: "Something went wrong!" });
    }
  } else {
    res
      .status(400)
      .send({ message: "'username' and 'password' are required!" });
  }
});

app.post("/users", async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const newUser = await prisma.user.create({
      data: {
        username,
        password,
        email,
      },
    });
    res.status(200).send(newUser);
    console.log(newUser);
  } catch (error) {
    res.status(500).send({ error: "Error registering user" });
  }
});

app.post("/expenses-categories", async (req, res) => {
  const { name: expenseCategoryName, icon: exoenseCategoryIcon } = req.body;
  try {
    const newExpenseCategory = await prisma.expenseCategory.create({
      data: {
        name: expenseCategoryName,
        icon: exoenseCategoryIcon,
      },
    });
    res.status(200).send(newExpenseCategory);
  } catch {
    res.status(500).send({ error: "Error registering user" });
  }
});

app.listen(port, () => {
  console.log(`⚡ Server listening on port: ${port}`);
});
