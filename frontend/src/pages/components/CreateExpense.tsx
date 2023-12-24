import { useEffect, useState } from "react";
import { ExpenseCategory } from "../../../types";

export default function CreateExpense() {
  const [expenseCategories, setExpenseCategories] = useState<
    ExpenseCategory[] | null
  >(null);

  useEffect(() => {
    const getAllExpenses = async () => {
      const response = await fetch("http://localhost:3001/expense-categories");
      const data = await response.json();
      setExpenseCategories(data);
    };
    getAllExpenses();
  }, []);
  return (
    <div>
      <form>
        <label>
          Amount
          <input type="number" />
        </label>
        <select id="category" name="category">
          {expenseCategories &&
            expenseCategories.map((expenseCat) => (
              <option>{expenseCat.name}</option>
            ))}
          <option value="Rent">🏠 Rent</option>
          <option value="coffee"></option>
        </select>
      </form>
    </div>
  );
}
