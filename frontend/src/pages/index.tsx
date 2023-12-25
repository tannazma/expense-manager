import { useEffect, useState } from "react";
import { Expense } from "../../types";
import CreateExpense from "./components/CreateExpense";

export default function Home() {
  const [allExpenses, setAllExpenses] = useState<Expense[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const toggleShowDialog = () => {
    setShowDialog(!showDialog);
  };

  useEffect(() => {
    const getAllExpenses = async () => {
      const response = await fetch("http://localhost:3001/expenses");
      const data = await response.json();
      setAllExpenses(data);
    };
    getAllExpenses();
  }, []);

  return (
    <div>
      <h1>Expenses</h1>
      <button onClick={toggleShowDialog}> + </button>
      {showDialog && (
        <CreateExpense showDialog={showDialog} setShowDialog={setShowDialog} />
      )}
      <div>
        {allExpenses.map((expense) => (
          <div key={expense.id}>
            <p key={expense.id}>
              <span>{expense.expenseCategory.icon}</span>
              {expense.amount}
              <span>{expense.expenseCategory.name}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
