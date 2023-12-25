import { useEffect, useState } from "react";
import { Expense, Income } from "../../types";
import CreateExpense from "./components/CreateExpense";
import CreateIncome from "./components/CreateIncome";

export default function Home() {
  const [allExpenses, setAllExpenses] = useState<Expense[]>([]);
  const [allIncomes, setAllIncomes] = useState<Income[]>([]);
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

  return (
    <div>
      <div>
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
          {allExpenses.map((expense) => (
            <div key={expense.id} className="expense-content">
              <p className="expense-icon-name">
                <p className="expense-icon">{expense.expenseCategory.icon}</p>
                <p className="expense-name">{expense.expenseCategory.name}</p>
              </p>
              <p className="expense-amount">{expense.amount} €</p>
            </div>
          ))}
        </div>
      </div>
      <div>
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
        <div>
          {allIncomes.map((income) => (
            <div key={income.id}>
              <p key={income.id}>
                <span>{income.incomeCategory.icon}</span>
                {income.amount}
                <span>{income.incomeCategory.name}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
