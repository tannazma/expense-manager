import { useEffect, useState } from "react";
import { Expense, ExpenseCategory, Income, IncomeCategory } from "../../types";
import CreateExpense from "./components/CreateExpense";
import CreateIncome from "./components/CreateIncome";

export default function Home() {
  const [allExpenses, setAllExpenses] = useState<Expense[]>([]);
  const [allIncomes, setAllIncomes] = useState<Income[]>([]);
  const [expenseSum, setExpenseSum] = useState<Expense[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>(
    []
  );
  const [incomeSum, setIncomeSum] = useState<Income[]>([]);

  const [incomeCategories, setIncomeCategories] = useState<IncomeCategory[]>(
    []
  );
  const [showCreateExpenseDialog, setShowCreateExpenseDialog] = useState(false);
  const [showCreateIncomeDialog, setShowCreateIncomeDialog] = useState(false);

  const toggleShowExpenseDialog = () => {
    setShowCreateExpenseDialog(!showCreateExpenseDialog);
  };

  const toggleShowIncomeDialog = () => {
    setShowCreateIncomeDialog(!showCreateIncomeDialog);
  };

  useEffect(() => {
    const getAllExpenses = async () => {
      const response = await fetch("http://localhost:3001/expenses");
      const data = await response.json();
      setAllExpenses(data);
    };
    getAllExpenses();
  }, []);

  useEffect(() => {
    const getAllIncomes = async () => {
      const response = await fetch("http://localhost:3001/incomes");
      const data = await response.json();
      setAllIncomes(data);
    };
    getAllIncomes();
  }, []);

  useEffect(() => {
    const getExpenseSum = async () => {
      const response = await fetch("http://localhost:3001/expenses-sum");
      const data = await response.json();
      setExpenseSum(data);
    };
    getExpenseSum();
  }, []);

  useEffect(() => {
    const getExpensesCategories = async () => {
      const response = await fetch("http://localhost:3001/expense-categories");
      const data = await response.json();
      setExpenseCategories(data);
    };
    getExpensesCategories();
  }, []);

  useEffect(() => {
    const getIncomeSum = async () => {
      const response = await fetch("http://localhost:3001/incomes-sum");
      const data = await response.json();
      setIncomeSum(data);
    };
    getIncomeSum();
  }, []);

  useEffect(() => {
    const getIncomesCategories = async () => {
      const response = await fetch("http://localhost:3001/income-categories");
      const data = await response.json();
      setIncomeCategories(data);
    };
    getIncomesCategories();
  }, []);

  // const sumAllExpensesAmount = allExpenses.reduce(
  //   (accumulator, currentValue) => accumulator + currentValue.amount,
  //   0
  // );

  // const sumAllIncomesAmount = allIncomes.reduce(
  //   (accumulator, currentValue) => accumulator + currentValue.amount,
  //   0
  // );

  // console.log(sumAllExpensesAmount, sumAllIncomesAmount);

  return (
    <div className="expense-income-container">
      <div className="expense-container">
        <div>
          <h2>Expenses</h2>
          <button onClick={toggleShowExpenseDialog}> + </button>
          {showCreateExpenseDialog && (
            <CreateExpense
              showDialog={showCreateExpenseDialog}
              setShowDialog={setShowCreateExpenseDialog}
            />
          )}
        </div>
        <div className="expense-container">
          {expenseSum.map((summary) => {
            const expCategory = expenseCategories.find(
              (cat) => cat.id === summary.expenseCategoryId
            );
            return (
              <div key={summary.expenseCategoryId} className="expense-content">
                <p className="expense-icon-name">
                  {expCategory && (
                    <p className="expense-icon-name">
                      <p className="expense-icon">{expCategory.icon}</p>
                      <p className="expense-name">{expCategory.name}</p>
                    </p>
                  )}
                </p>
                <p className="expense-amount">{summary.amount} €</p>
              </div>
            );
          })}
        </div>
      </div>
      <div className="income-container">
        <div>
          <h2>Incomes</h2>
          <button onClick={toggleShowIncomeDialog}> + </button>
          {showCreateIncomeDialog && (
            <CreateIncome
              showDialog={showCreateIncomeDialog}
              setShowDialog={setShowCreateIncomeDialog}
            />
          )}
        </div>
        <div className="income-container">
          {allIncomes.map((income) => (
            <div key={income.id} className="income-content">
              <p className="income-icon-name">
                <p className="income-icon">{income.incomeCategory.icon}</p>
                <p className="income-name">{income.incomeCategory.name}</p>
              </p>
              <p className="income-amount">{income.amount} €</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
