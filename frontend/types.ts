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

export interface Account {
  id: number;
  name: string;
  userId: number;
}

export interface expenseSumData {
  amount: number;
  expenseCategoryId: number;
  expenseCategoryName: string;
}

export interface ChartDataType {
  name: string;
  amount: number;
}

export interface incomeSumData {
  amount: number;
  incomeCategoryId: number;
  incomeCategoryName: string;
}
export interface ChartDataType {
  name: string;
  amount: number;
}
