import express, { json } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { toToken } from "./auth/jwt";
import { AuthMiddleware, AuthRequest } from "./auth/middleware";
import { hashSync, compareSync } from "bcrypt";
import bcrypt from "bcrypt";

const app = express();
const port = process.env.PORT || 3001;
const prisma = new PrismaClient();

app.use(cors());
app.use(json());

app.get("/api/", (req, res) => {
  res.send("Hello, world!");
});

app.get("/api/expenses", async (req, res) => {
  const allExpenses = await prisma.expense.findMany({
    include: {
      expenseCategory: true,
    },
  });
  res.json(allExpenses);
});

app.get("/api/account/:accountId/expenses", async (req, res) => {
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

app.get("/api/accounts/:accountId/incomes", async (req, res) => {
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

app.get("/api/expense-categories", async (req, res) => {
  const allExpensesCategories = await prisma.expenseCategory.findMany({});
  res.json(allExpensesCategories);
});

app.post("/api/expenses", async (req, res) => {
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
      console.error("error while creating expense:", error);
      res.status(500).send({ message: "Something went wrong!" });
    }
  } else {
    res.status(400).send({
      message:
        "amount, date, accountId and expenseCategoryId and details are required.",
    });
  }
});

app.get("/api/incomes", async (req, res) => {
  const allIncomes = await prisma.income.findMany({
    include: {
      incomeCategory: true,
    },
  });
  res.json(allIncomes);
});

app.get("/api/income-categories", async (req, res) => {
  const allIncomesCategories = await prisma.incomeCategory.findMany({});
  res.json(allIncomesCategories);
});

app.get("/api/accounts", AuthMiddleware, async (req: AuthRequest, res) => {
  const allAccounts = await prisma.account.findMany({
    where: {
      userId: req.userId,
    },
  });
  res.json(allAccounts);
});

app.post("/api/accounts", AuthMiddleware, async (req: AuthRequest, res) => {
  const requestBody = req.body;
  const { name } = req.body;
  if (!name) {
    res.status(400).send({ error: "Name is required" });
    return;
  }
  if ("name" in requestBody) {
    try {
      const newAccount = await prisma.account.create({
        data: {
          name,
          userId: Number(req.userId),
        },
      });
      res.status(200).send(newAccount);
      console.log(newAccount);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Error creating account" });
    }
  } else {
    res.status(400).send({
      message:
        "amount, date, accountId and incomeCategoryId and details are required.",
    });
  }
});

app.delete(
  "/api/expenses/:expenseId",
  AuthMiddleware,
  async (req: AuthRequest, res) => {
    const { expenseId } = req.params;
    try {
      const deletedExpenses = await prisma.expense.deleteMany({
        where: { id: Number(expenseId) },
      });
      res.status(200).send({
        message: `${deletedExpenses.count} expenses successfully deleted`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Error deleting expenses" });
    }
  }
);

app.delete(
  "/api/incomes/:incomeId",
  AuthMiddleware,
  async (req: AuthRequest, res) => {
    const { incomeId } = req.params;
    try {
      const deletedIncomes = await prisma.income.deleteMany({
        where: { id: Number(incomeId) },
      });
      res.status(200).send({
        message: `${deletedIncomes.count} Income successfully deleted`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Error deleting Income" });
    }
  }
);

app.put(
  "/api/expenses/:expenseId",
  AuthMiddleware,
  async (req: AuthRequest, res) => {
    const { expenseId } = req.params;
    console.log(expenseId);
    const { amount, expenseCategoryId, details, date } = req.body;
    // console.log(req.body);
    const expense = await prisma.expense.findUnique({
      where: { id: Number(expenseId) },
    });

    if (!expense) {
      return res.status(404).send({ error: "Expense not found." });
    }

    if (!amount || !expenseCategoryId || !details || !date) {
      res.status(400).send({ error: "Expense information is incomplete" });
      return;
    }
    if (!Number.isInteger(amount) || !expenseCategoryId || !details || !date) {
      res
        .status(400)
        .send({ error: "Expense information is invalid or incomplete" });
      return;
    }
    console.log(amount, expenseCategoryId, details, date);

    try {
      const updatedExpense = await prisma.expense.update({
        where: { id: Number(expenseId) },
        data: {
          amount: amount,
          expenseCategoryId: expenseCategoryId,
          details: details,
          date: date,
        },
      });

      res.status(200).send(updatedExpense);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Error updating expense" });
    }
  }
);

app.put(
  "/api/incomes/:incomeId",
  AuthMiddleware,
  async (req: AuthRequest, res) => {
    const { incomeId } = req.params;
    console.log(incomeId);
    const { amount, incomeCategoryId, details, date } = req.body;
    // console.log(req.body);
    const income = await prisma.income.findUnique({
      where: { id: Number(incomeId) },
    });

    if (!income) {
      return res.status(404).send({ error: "Income not found." });
    }

    if (!amount || !incomeCategoryId || !details || !date) {
      res.status(400).send({ error: "Income information is incomplete" });
      return;
    }
    if (!Number.isInteger(amount) || !incomeCategoryId || !details || !date) {
      res
        .status(400)
        .send({ error: "Income information is invalid or incomplete" });
      return;
    }
    console.log(amount, incomeCategoryId, details, date);

    try {
      const updatedIncome = await prisma.income.update({
        where: { id: Number(incomeId) },
        data: {
          amount: amount,
          incomeCategoryId: incomeCategoryId,
          details: details,
          date: date,
        },
      });

      res.status(200).send(updatedIncome);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Error updating income" });
    }
  }
);

app.put(
  "/api/accounts/:accountId/edit",
  AuthMiddleware,
  async (req: AuthRequest, res) => {
    const { newName } = req.body;

    if (!newName) {
      res.status(400).send("Please provide `newName` for the account");
      return;
    }

    const accountId = Number(req.params.accountId);

    const foundAccount = await prisma.account.findFirst({
      where: {
        userId: req.userId,
        id: accountId,
      },
    });

    // foundAccount may not exist for two reasons:
    //    1) provided accountId is wrong
    //    2) the userId does not own this account
    if (!foundAccount) {
      res.status(400).send({ message: "You cannot edit this account" });
      return;
    }

    if (newName === foundAccount.name) {
      res
        .status(200)
        .send({ message: "Changd succefully (already has the same name)" });
      return;
    }

    await prisma.account.update({
      where: {
        userId: req.userId,
        id: accountId,
      },
      data: {
        name: newName,
      },
    });

    res.status(200).send({ message: "Changd succefully" });
  }
);

app.delete(
  "/api/accounts/:accountId",
  AuthMiddleware,
  async (req: AuthRequest, res) => {
    const { accountId } = req.params;
    try {
      const deletedAccount = await prisma.account.deleteMany({
        where: {
          id: Number(accountId),
        },
      });
      console.log(deletedAccount);
      res.status(200).send({
        message: `Account successfully deleted`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "something happened" });
    }
  }
);

app.get("/api/user", AuthMiddleware, async (req: AuthRequest, res) => {
  const loggedInUser = await prisma.user.findFirst({
    where: {
      id: req.userId,
    },
  });
  res.json(loggedInUser);
});

app.post("/api/incomes", async (req, res) => {
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
      console.error("error while creating income:", error);
      res.status(500).send({ message: "Something went wrong!" });
    }
  } else {
    res.status(400).send({
      message:
        "amount, date, accountId and incomeCategoryId and details are required.",
    });
  }
});

app.get(
  "/api/accounts/:accountId/expenses-sum",
  AuthMiddleware,
  async (req: AuthRequest, res) => {
    const accountIdAsNumber = Number(req.params.accountId);
    if (isNaN(accountIdAsNumber)) {
      res.status(404).send({
        message: "Expense with that account id not found",
      });
      return;
    }

    const currentUserAccounts = await prisma.account.findMany({
      where: {
        userId: req.userId,
      },
    });

    const groupedExpenses = await prisma.expense.findMany({
      where:
        accountIdAsNumber === 0
          ? {
              accountId: {
                in: currentUserAccounts.map((acc) => acc.id),
              },
            }
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
  }
);

app.get(
  "/api/accounts/:accountId/expenses-sum-filter",
  AuthMiddleware,
  async (req: AuthRequest, res) => {
    const accountIdAsNumber = Number(req.params.accountId);
    if (isNaN(accountIdAsNumber)) {
      res.status(404).send({
        message: "Expense with that account id not found",
      });
      return;
    }
    const convertDate = (dateString: string) => {
      const [day, month, year] = dateString.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    };

    const { from, to } = req.query;
    if (!from || !to) {
      return res
        .status(400)
        .send({ error: 'Please provide both "from" and "to" date' });
    }

    const fromConverted = convertDate(from as string);
    const toConverted = convertDate(to as string);

    try {
      const currentUserAccounts = await prisma.account.findMany({
        where: {
          userId: req.userId,
        },
      });

      const groupedExpenses = await prisma.expense.findMany({
        where:
          accountIdAsNumber === 0
            ? {
                accountId: {
                  in: currentUserAccounts.map((acc) => acc.id),
                },
                date: {
                  gte: new Date(fromConverted),
                  lte: new Date(toConverted),
                },
              }
            : {
                accountId: accountIdAsNumber,
                date: {
                  gte: new Date(fromConverted),
                  lte: new Date(toConverted),
                },
              },
        select: {
          expenseCategoryId: true,
          expenseCategory: true,
          amount: true,
        },
      });

      console.log("Grouped expenses:", groupedExpenses);

      let summedExpenses: {
        expenseCategoryId: number;
        expenseCategoryName: string;
        amount: number;
      }[] = [];
      console.log("sum", summedExpenses);

      groupedExpenses.forEach((expense) => {
        console.log("Current expense:", expense);
        const index = summedExpenses.findIndex(
          (x) => x.expenseCategoryId === expense.expenseCategoryId
        );
        console.log("group", groupedExpenses);

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

      res.send(summedExpenses);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Something went wrong" });
    }
  }
);

app.get(
  "/api/accounts/:accountId/incomes-sum-filter",
  AuthMiddleware,
  async (req: AuthRequest, res) => {
    const accountIdAsNumber = Number(req.params.accountId);
    if (isNaN(accountIdAsNumber)) {
      res.status(404).send({
        message: "Income with that account id not found",
      });
      return;
    }
    const convertDate = (dateString: string) => {
      const [day, month, year] = dateString.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    };

    const { from, to } = req.query;
    if (!from || !to) {
      return res
        .status(400)
        .send({ error: 'Please provide both "from" and "to" date' });
    }

    const fromConverted = convertDate(from as string);
    const toConverted = convertDate(to as string);

    try {
      const currentUserAccounts = await prisma.account.findMany({
        where: {
          userId: req.userId,
        },
      });

      const groupedIncomes = await prisma.income.findMany({
        where:
          accountIdAsNumber === 0
            ? {
                accountId: {
                  in: currentUserAccounts.map((acc) => acc.id),
                },
                date: {
                  gte: new Date(fromConverted),
                  lte: new Date(toConverted),
                },
              }
            : {
                accountId: accountIdAsNumber,
                date: {
                  gte: new Date(fromConverted),
                  lte: new Date(toConverted),
                },
              },
        select: {
          incomeCategoryId: true,
          incomeCategory: true,
          amount: true,
        },
      });

      console.log("Grouped expenses:", groupedIncomes);

      let summedIncomes: {
        incomeCategoryId: number;
        incomeCategoryName: string;
        amount: number;
      }[] = [];
      console.log("sum", summedIncomes);

      groupedIncomes.forEach((income) => {
        console.log("Current expense:", income);
        const index = summedIncomes.findIndex(
          (x) => x.incomeCategoryId === income.incomeCategoryId
        );
        console.log("group", groupedIncomes);

        if (index >= 0) {
          summedIncomes[index].amount += income.amount;
        } else {
          summedIncomes.push({
            incomeCategoryId: income.incomeCategoryId,
            incomeCategoryName: income.incomeCategory.name,
            amount: income.amount,
          });
        }
      });

      res.send(summedIncomes);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Something went wrong" });
    }
  }
);

app.get(
  "/api/accounts/:accountId/incomes-sum",
  AuthMiddleware,
  async (req: AuthRequest, res) => {
    const accountIdAsNumber = Number(req.params.accountId);
    if (isNaN(accountIdAsNumber)) {
      res.status(404).send({
        message: "Income with that account id not found",
      });
      return;
    }
    const currentUserAccounts = await prisma.account.findMany({
      where: {
        userId: req.userId,
      },
    });

    const groupedIncomes = await prisma.income.findMany({
      where:
        accountIdAsNumber === 0
          ? {
              accountId: {
                in: currentUserAccounts.map((acc) => acc.id),
              },
            }
          : { accountId: accountIdAsNumber },
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
  }
);

app.get(
  "/api/accounts/:accountId/category/:categoryId/expenses",
  AuthMiddleware,
  async (req: AuthRequest, res) => {
    const categoryIdAsNumber = Number(req.params.categoryId);
    const accountIdAsNumber = Number(req.params.accountId);
    if (!accountIdAsNumber && accountIdAsNumber !== 0) {
      res.status(400).send({
        message: "Expenses with that id not found",
      });
      return;
    }
    const currentUserAccounts = await prisma.account.findMany({
      where: {
        userId: req.userId,
      },
    });
    const expenses = await prisma.expense.findMany({
      where:
        accountIdAsNumber === 0
          ? {
              accountId: {
                in: currentUserAccounts.map((acc) => acc.id),
              },
              expenseCategoryId: categoryIdAsNumber,
            }
          : {
              accountId: accountIdAsNumber,
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
  }
);

app.get(
  "/api/accounts/:accountId/category/:categoryId/incomes",
  AuthMiddleware,
  async (req: AuthRequest, res) => {
    const categoryIdAsNumber = Number(req.params.categoryId);
    const accountIdAsNumber = Number(req.params.accountId);
    if (!accountIdAsNumber && accountIdAsNumber !== 0) {
      res.status(400).send({
        message: "Incomes with that id not found",
      });
      return;
    }
    const currentUserAccounts = await prisma.account.findMany({
      where: {
        userId: req.userId,
      },
    });
    const incomes = await prisma.income.findMany({
      where:
        accountIdAsNumber === 0
          ? {
              accountId: {
                in: currentUserAccounts.map((acc) => acc.id),
              },
              incomeCategoryId: categoryIdAsNumber,
            }
          : {
              incomeCategoryId: categoryIdAsNumber,
              accountId: accountIdAsNumber,
            },
      include: {
        incomeCategory: true,
        accounts: true,
      },
    });
    if (!incomes) {
      res.status(404).send({
        message: "Income Category with that id not found",
      });
      return;
    }
    res.status(200).send(incomes);
  }
);

app.post("/api/login", async (req, res) => {
  const requestBody = req.body;
  if ("username" in requestBody && "password" in requestBody) {
    try {
      const userToLogin = await prisma.user.findFirst({
        where: {
          username: requestBody.username,
        },
      });
      if (
        userToLogin &&
        bcrypt.compareSync(requestBody.password, userToLogin.password)
      ) {
        const token = toToken({ userId: userToLogin.id });
        res.status(200).send({ token: token });
        return;
      }
      res.status(400).send({ message: "Login failed" });
    } catch (error) {
      console.log("error 500 while logging in:", error);
      res.status(500).send({ message: "Something went wrong!" });
    }
  } else {
    res
      .status(400)
      .send({ message: "'username' and 'password' are required!" });
  }
});

app.post("/api/users", async (req, res) => {
  const { username, password, email } = req.body;
  const requestBody = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    // Check if user already exists
    const userExists = await prisma.user.findFirst({
      where: {
        username: requestBody.username,
      },
    });

    // If user exists send an error response
    if (userExists) {
      return res.status(400).send({ error: "User already exists!" });
    }

    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        email,
      },
    });

    // Generating the token with the new user data
    const token = toToken({ userId: newUser.id });

    // Sending the token along with the new user data
    res.status(200).send({ user: newUser, token: token });

    console.log(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error registering user" });
  }
});

app.post("/api/expenses-categories", async (req, res) => {
  const { name: expenseCategoryName, icon: exoenseCategoryIcon } = req.body;
  try {
    const newExpenseCategory = await prisma.expenseCategory.create({
      data: {
        name: expenseCategoryName,
        icon: exoenseCategoryIcon,
      },
    });
    res.status(200).send(newExpenseCategory);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error registering user" });
  }
});

app.post("/api/incomes-categories", async (req, res) => {
  const { name: incomeCategoryName, icon: incomeCategoryIcon } = req.body;
  try {
    const newIncomeCategory = await prisma.incomeCategory.create({
      data: {
        name: incomeCategoryName,
        icon: incomeCategoryIcon,
      },
    });
    res.status(200).send(newIncomeCategory);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error creating income category" });
  }
});

app.listen(port, () => {
  console.log(`⚡ Server listening on port: ${port}`);
});
