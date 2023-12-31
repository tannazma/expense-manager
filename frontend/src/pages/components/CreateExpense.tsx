import { useEffect, useState } from "react";
import { ExpenseCategory } from "../../../types";
import { useFetchAccounts } from "../hooks/useFetchAccounts";

interface createxpenseProps {
  showDialog: boolean;
  setShowDialog: any;
}

export default function CreateExpense({
  showDialog,
  setShowDialog,
}: createxpenseProps) {
  const [expenseCategories, setExpenseCategories] = useState<
    ExpenseCategory[] | null
  >(null);
  const accounts = useFetchAccounts();
  const [accountId, setAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [expenseCategoryId, setExpenseCategoryId] = useState("");
  const [details, setDetails] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log({
      amount,
      category: expenseCategoryId,
      details: details,
      account: accountId,
    });
    fetch("http://localhost:3001/expenses", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Number(amount),
        expenseCategoryId: Number(expenseCategoryId),
        accountId: Number(accountId),
        details: details,
        date: new Date().toISOString(),
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
        display: showDialog ? "grid" : "none",
        opacity: showDialog ? 1 : 0,
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
          Account:
          <select
            id="account"
            name="account"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
          >
            {accounts &&
              accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {/* {account.icon} */}
                  {account.name}
                </option>
              ))}
          </select>
        </label>
        <label>
          date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <label>
          Details:
          <input
            type="text"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
        </label>
        <button
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
          type="submit"
        >
          submit
        </button>
        <button className="close-button" onClick={closeDialog}>
          X
        </button>
      </form>
    </div>
  );
}
