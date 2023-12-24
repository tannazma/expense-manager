import { useEffect, useState } from "react";
import { ExpenseCategory } from "../../../types";

export default function CreateExpense() {
  const [expenseCategories, setExpenseCategories] = useState<
    ExpenseCategory[] | null
  >(null);

  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [details, setDetails] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log({ amount, category: categoryId, details });
  };

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
      <form onSubmit={handleSubmit}>
        <label>
          Amount:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>
        <label>
          Category:
          <select
            id="category"
            name="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            {expenseCategories &&
              expenseCategories.map((expenseCat) => (
                <option key={expenseCat.id} value={expenseCat.id}>
                  {expenseCat.icon}
                  {expenseCat.name}
                </option>
              ))}
          </select>
        </label>
        <label>
          Details:
          <input
            type="text"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
        </label>
        <button type="submit">submit</button>
      </form>
    </div>
  );
}
