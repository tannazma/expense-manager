export interface ExpenseCategory {
  id: number;
  name: string;
  expenses: Expense[];
  icon: string;
}

export interface Expense {
  id: number;
  amount: number;
  expenseCategoryId: number;
  expenseCategory: ExpenseCategory;
  User?: User;
  userId?: number;
}

export interface User {
  id: number;
  username: string;
  password: string;
  email: string;
  incomes: Income[];
  expenses: Expense[];
}

export interface Income {
  id: number;
  amount: number;
  date: Date;
  userId: number;
  user: User;
  incomeCategoryId: number;
  incomeCategory: IncomeCategory;
}

export interface IncomeCategory {
  id: number;
  name: string;
  incomes: Income[];
}
