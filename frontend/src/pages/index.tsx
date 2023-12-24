import { useEffect, useState } from "react";
import { Expense } from "../../types";

export default function Home() {
  const [allExpenses, setAllExpenses] = useState<Expense[]>([]);

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
      <div>
        {allExpenses.map((expense) => (
          <div key={expense.id}>
            <p key={expense.id}>
              {expense.amount}
              <span>{expense.expenseCategory.name}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
