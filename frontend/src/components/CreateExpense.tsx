import { useEffect, useState } from "react";
import { ExpenseCategory } from "../../types";
import useFetchAccounts from "../pages/hooks/useFetchAccounts";

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
  const [isAddingCategory, setIsAddingCategory] = useState(false);
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
      setExpenseCategoryId(data[0].id);
      setAccountId(data[0].id);
    };
    getAllExpenses();
  }, []);

  function closeDialog() {
    setShowDialog(!showDialog);
  }

  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryIcon, setNewCategoryIcon] = useState("💟");

  async function addNewCategory() {
    console.log({ newCategoryName, newCategoryIcon });
    fetch("http://localhost:3001/expenses-categories", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newCategoryName,
        icon: newCategoryIcon,
      }),
    });
    setIsAddingCategory(false);
  }

  return (
    <div
      className="dialog-backdrop h-screen	w-screen grid place-items-center fixed top-0 left-0 right-0 bottom-0 transition-all-1s z-50 bg-black bg-opacity-50"
      style={{
        display: showDialog ? "grid" : "none",
        opacity: showDialog ? 1 : 0,
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="p-10 rounded bg-violet-400 relative flex flex-col gap-5 "
      >
        <label className="block text-sm font-medium leading-6 text-gray-900">
          Amount:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 "
          />
        </label>
        {!isAddingCategory ? (
          <div className="flex gap-2 bc-white">
            <label>
              Category:
              <select
                id="category"
                name="category"
                value={expenseCategoryId}
                onChange={(e) => setExpenseCategoryId(e.target.value)}
                className="w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 "
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
            <button
              className="bg-purple-500 hover:bg-purple-700 font-bold hover:text-white py-2 px-4 border border-purple-500 hover:border-transparent rounded ml-3 text-white"
              title="Add a new category"
              onClick={() => setIsAddingCategory(true)}
            >
              +
            </button>
          </div>
        ) : (
          <div className="border flex-col flex">
            <label>
              Category Name:
              <input
                value={newCategoryName}
                onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewCategoryName(e.target.value)
                }
                className="w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
              />
            </label>
            <label>
              Category Icon
              <select
                value={newCategoryIcon}
                onChange={(e) => setNewCategoryIcon(e.target.value)}
                className="w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 "
              >
                {["💟", "👎", "🦷", "👨‍🦲"].map((emoji, index) => (
                  <option key={index} value={emoji}>
                    {emoji}
                  </option>
                ))}
              </select>
            </label>
            <button onClick={addNewCategory}>Save Category</button>
          </div>
        )}
        <label>
          Account:
          <select
            id="account"
            name="account"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            className="w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
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
            className="w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
          />
        </label>
        <label>
          Details:
          <input
            type="text"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
          />
        </label>
        <button
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
          type="submit"
          disabled={isAddingCategory}
        >
          submit
        </button>
        <button
          className=" bg-purple-300 hover:bg-purple-700 text-white absolute -top-5 -right-5 p-2 w-10 box-border rounded-full border-none"
          onClick={closeDialog}
        >
          X
        </button>
      </form>
    </div>
  );
}
