import { useEffect, useState } from "react";
import { ExpenseCategory } from "../../../types";

export default function CreateExpense() {
  const [expenseCategories, setExpenseCategories] = useState<
    ExpenseCategory[] | null
  >(null);

  const [amount, setAmount] = useState("");
  const [expenseCategoryId, setExpenseCategoryId] = useState("");
  const [details, setDetails] = useState("");
  const [showDialog, setShowDialog] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log({
      amount,
      category: expenseCategoryId,
      details: details,
    });
    fetch("http://localhost:3001/expenses", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Number(amount),
        expenseCategoryId: Number(expenseCategoryId),
        details: details,
      }),
    });
  };

  useEffect(() => {
    const getAllExpenses = async () => {
      const response = await fetch("http://localhost:3001/expense-categories");
      const data = await response.json();
      setExpenseCategories(data);
    };
    getAllExpenses();
  }, []);

  function closeDialog() {
    setShowDialog(!showDialog);
  }

  return (
    <div
      className="dialog-backdrop"
      style={{
        display: showDialog ? "none" : "grid",
        opacity: showDialog ? 0 : 1,
      }}
    >
      <form onSubmit={handleSubmit} className="dialog-content">
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
            value={expenseCategoryId}
            onChange={(e) => setExpenseCategoryId(e.target.value)}
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
      <button className="close-button" onClick={closeDialog}>
        X
      </button>
    </div>
  );
}
