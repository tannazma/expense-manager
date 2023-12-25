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
  details: string;
  user: User;
  userId?: number;
  date: Date;
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
  details: string;
  incomeCategoryId: number;
  incomeCategory: IncomeCategory;
}

export interface IncomeCategory {
  id: number;
  name: string;
  incomes: Income[];
  icon: String;
}
