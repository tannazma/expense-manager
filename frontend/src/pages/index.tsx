import { useEffect, useState } from "react";
import { Expense } from "../../types";

export default function Home() {
  const [allExpenses, setAllExpenses] = useState<Expense[]>([]);
  const [showForm, setShowForm] = useState(false);
  const toggleShowForm = () => {
    setShowForm(!showForm);
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
      <button onClick={toggleShowForm}> + </button>
      {showForm && <div>Create an expense</div>}
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
