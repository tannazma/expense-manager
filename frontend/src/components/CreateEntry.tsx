import { ChangeEvent, useContext, useEffect, useState } from "react";
import { ExpenseCategory as EntryCategory } from "../../types";
import useFetchAccounts from "../hooks/useFetchAccounts";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";
import ThemeContext from "./ThemeContext";

interface createEntryProps {
  showDialog: boolean;
  setShowDialog: any;
  type: "expense" | "income";
  onCreated: () => void;
  refetchBalance: () => void;
}

export default function CreateEntry({
  showDialog,
  setShowDialog,
  type,
  onCreated,
  refetchBalance,
}: createEntryProps) {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  const [entryCategories, setEntryCategories] = useState<
    EntryCategory[] | null
  >(null);
  let { accounts } = useFetchAccounts();
  const [accountId, setAccountId] = useState<number | undefined>();
  const [amount, setAmount] = useState("");
  const [entryCategoryId, setEntryCategoryId] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [details, setDetails] = useState("");
  const [date, setDate] = useState(todayStr);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryIcon, setNewCategoryIcon] = useState("💟");

  useEffect(() => {
    if (accounts && accounts[0]) {
      setAccountId(accounts[0].id);
    }
  }, [accounts]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log({
      amount,
      category: entryCategoryId,
      details: details,
      account: accountId,
    });
    await fetch(
      type === "expense"
        ? `${process.env.NEXT_PUBLIC_SERVERURL}/expenses`
        : `${process.env.NEXT_PUBLIC_SERVERURL}/incomes`,
      {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(amount),
          [type === "expense" ? "expenseCategoryId" : "incomeCategoryId"]:
            Number(entryCategoryId),
          accountId: Number(accountId),
          details: details,
          date: new Date().toISOString(),
        }),
      }
    );
    onCreated();
    setShowDialog(false);
    refetchBalance();
  };

  useEffect(() => {
    const getAllExpenseCategories = async () => {
      const response = await fetch(
        type === "expense"
          ? `${process.env.NEXT_PUBLIC_SERVERURL}/expense-categories`
          : `${process.env.NEXT_PUBLIC_SERVERURL}/income-categories`
      );
      const categories = await response.json();
      setEntryCategories(categories);
      setEntryCategoryId(categories[0].id);
    };
    getAllExpenseCategories();
  }, []);

  function closeDialog() {
    setShowDialog(!showDialog);
  }

  async function addNewCategory() {
    console.log({ newCategoryName, newCategoryIcon });
    fetch(`${process.env.NEXT_PUBLIC_SERVERURL}/expenses-categories`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newCategoryName,
        icon: newCategoryIcon,
      }),
    });
    setIsAddingCategory(false);
  }

  function closeAddingCategory() {
    setIsAddingCategory(false);
  }

  const { theme } = useContext(ThemeContext);
  let saveButtonClass = "bg-purple-500 hover:bg-purple-800";
  let cancelButtonClass = "bg-purple-300 hover:bg-purple-700";
  let dynamicBackgroundClass = "bg-violet-400";

  if (theme === "red") {
    saveButtonClass = "bg-red-500 hover:bg-red-800";
    cancelButtonClass = " bg-red-400 hover:bg-red-700";
    dynamicBackgroundClass = "bg-red-200";
  } else if (theme === "green") {
    saveButtonClass = "bg-green-500 hover:bg-green-800";
    cancelButtonClass = " bg-green-400 hover:bg-green-700";
    dynamicBackgroundClass = "bg-green-200";
  } else if (theme === "blue") {
    saveButtonClass = "bg-blue-500 hover:bg-blue-800";
    cancelButtonClass = " bg-blue-400 hover:bg-blue-700";
    dynamicBackgroundClass = "bg-blue-200";
  } else if (theme === "dark") {
    saveButtonClass = "bg-gray-500 hover:bg-gray-800";
    cancelButtonClass = " bg-gray-400 hover:bg-gray-700";
    dynamicBackgroundClass = "bg-gray-200";
  }

  return (
    <div
      className="min-h-[200px] min-w-[200px] grid place-items-center fixed top-0 left-0 right-0 bottom-0 transition-all-1s z-50 bg-black bg-opacity-50"
      style={{
        display: showDialog ? "grid" : "none",
        opacity: showDialog ? 1 : 0,
      }}
    >
      <form
        onSubmit={handleSubmit}
        className={`p-6 text-xs rounded ${dynamicBackgroundClass} relative flex flex-col gap-2`}
      >
        {!isAddingCategory ? (
          <>
            <label className="block text-xs text-gray-900">
              Amount:
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-2 rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 "
              />
            </label>
            <div className="flex gap-2 bc-white items-end">
              <label className="">
                Category:
                <select
                  id="category"
                  name="category"
                  value={entryCategoryId}
                  onChange={(e) => setEntryCategoryId(e.target.value)}
                  className="mt-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 "
                >
                  {entryCategories &&
                    entryCategories.map((entryCat) => (
                      <option key={entryCat.id} value={entryCat.id}>
                        {entryCat.icon}
                        {entryCat.name}
                      </option>
                    ))}
                </select>
              </label>
              <button
                className={`${saveButtonClass} font-bold py-1.5 px-3 rounded ml-3 text-white`}
                onClick={() => setIsAddingCategory(true)}
              >
                +
              </button>
            </div>
            <label>
              Account:
              <select
                id="account"
                name="account"
                value={accountId}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setAccountId(Number(e.target.value))
                }
                className="mt-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
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
                className="mt-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
              />
            </label>
            <label>
              Details:
              <input
                type="text"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="mt-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
              />
            </label>
            <button
              className={`${saveButtonClass} text-white font-bold py-2 px-4 rounded`}
              type="submit"
              disabled={isAddingCategory}
            >
              submit
            </button>
            <button
              className={`${cancelButtonClass} text-white absolute -top-3 -right-4 p-2 w-8 box-border rounded-full border-none`}
              onClick={closeDialog}
            >
              X
            </button>
          </>
        ) : (
          <div className="flex-col flex">
            <label>
              Category Name
              <input
                value={newCategoryName}
                placeholder="tooth"
                onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewCategoryName(e.target.value)
                }
                className="mb-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
              />
            </label>
            <label>
              Category Icon
              <select
                value={newCategoryIcon}
                onChange={(e) => setNewCategoryIcon(e.target.value)}
                className="mb-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 "
              >
                {["💟", "👎", "🦷", "👨‍🦲"].map((emoji, index) => (
                  <option key={index} value={emoji}>
                    {emoji}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex ">
              <PrimaryButton onClick={addNewCategory}>Save</PrimaryButton>
              <SecondaryButton onClick={closeAddingCategory}>
                Cancel
              </SecondaryButton>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
