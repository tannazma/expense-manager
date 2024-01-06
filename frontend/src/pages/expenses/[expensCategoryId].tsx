import { useEffect, useState } from "react";
import { Expense, ExpenseCategory } from "../../../types";
import { useRouter } from "next/router";

const ExpenseDetailPage = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const router = useRouter();
  const categoryIdFromUrl = Number(router.query.expensCategoryId);
  const [expenseAmount, setExpenseAmount] = useState("");
  const [selectedExpenseCategoryId, setSelectedExpenseCategoryId] =
    useState("");
  const [expenseDetails, setExpenseDetails] = useState("");
  const [expenseDate, setExpenseDate] = useState("");
  const [expenseCategories, setExpenseCategories] = useState<
    ExpenseCategory[] | null
  >(null);

  useEffect(() => {
    const fetchAllExpenseCategories = async () => {
      const response = await fetch("http://localhost:3001/expense-categories");
      const data = await response.json();
      setExpenseCategories(data);
      if (data[0]) {
        setSelectedExpenseCategoryId(data[0].id);
      }
    };
    fetchAllExpenseCategories();
  }, []);

  useEffect(() => {
    if (isNaN(categoryIdFromUrl)) {
      return;
    } else {
      const fetchExpensesFromCategory = async () => {
        const response = await fetch(
          `http://localhost:3001/category/${categoryIdFromUrl}/expenses`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        const data = await response.json();
        setSelectedExpenseCategoryId(data[0].id);
        setExpenses(data);
      };
      fetchExpensesFromCategory();
    }
  }, [categoryIdFromUrl]);

  if (isNaN(categoryIdFromUrl)) {
    return <div>Expense not found</div>;
  }

  const handleDeleteExpense = (expenseId: number) => {
    if (!Number.isInteger(expenseId)) {
      console.error("Invalid expenseCategoryId:", expenseId);
      return;
    }
    fetch(`http://localhost:3001/expenses/${expenseId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch expenses:",
          error
        );
      });
  };

  const handleEditExpense = (expenseId: number) => {
    const expenseToEdit = expenses.find((expense) => expense.id === expenseId);
    if (expenseToEdit) {
      setExpenseAmount(expenseToEdit.amount.toString());
      setSelectedExpenseCategoryId(expenseToEdit.expenseCategoryId.toString());
      setExpenseDetails(expenseToEdit.details);
      setExpenseDate(expenseToEdit.date.toString());
      setIsEditMode(true);
    }
  };

  const handleUpdateExpense = async (
    expenseId: number,
    event: React.FormEvent
  ) => {
    event.preventDefault();

    const response = await fetch(
      `http://localhost:3001/expenses/${expenseId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number(expenseAmount),
          expenseCategoryId: Number(selectedExpenseCategoryId),
          details: expenseDetails,
          date: new Date(expenseDate).toISOString(),
        }),
      }
    );
    if (response.ok) {
      const updatedExpense = await response.json();
      setExpenses((prevExpenses) =>
        prevExpenses.map((expense) =>
          expense.id === expenseId ? updatedExpense : expense
        )
      );
      setIsEditMode(false);
    }
  };

  return (
    <div>
      {expenses.length > 0 ? (
        <div className="flex flex-1 flex-col gap-10 p-10 text-zinc-50 ">
          {expenses
            .sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1))
            .map((expense) => (
              <div
                key={expense.id}
                className="bg-violet-500 p-5 shadow-xl rounded-md"
              >
                <div className="flex ">
                  <span>{expense.expenseCategory?.icon}</span>
                  <p className="pr-2 pb-6">{expense.expenseCategory?.name}</p>
                  <p className="justify-between flex-1 text-right	">
                    {new Date(expense.date).toUTCString()}
                  </p>
                </div>
                <p>{expense.amount} €</p>
                <p>{expense.details}</p>
                <button onClick={() => handleDeleteExpense(expense.id)}>
                  Delete
                </button>
                <button onClick={() => handleEditExpense(expense.id)}>
                  Edit
                </button>
                {isEditMode && (
                  <div className="modal">
                    <form
                      onSubmit={(event) =>
                        handleUpdateExpense(expense.id, event)
                      }
                      className="p-10 rounded bg-violet-400 relative flex flex-col gap-5 "
                    >
                      <label>
                        Amount:
                        <input
                          type="number"
                          value={expenseAmount}
                          onChange={(e) => setExpenseAmount(e.target.value)}
                          className="w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 "
                        />
                        <label>
                          Category:
                          <select
                            id="category"
                            name="category"
                            value={selectedExpenseCategoryId}
                            onChange={(e) =>
                              setSelectedExpenseCategoryId(e.target.value)
                            }
                            className="w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 "
                          >
                            {expenseCategories &&
                              expenseCategories.map((entryCat) => {
                                console.log("entryCat", entryCat);
                                return (
                                  <option key={entryCat.id} value={entryCat.id}>
                                    {entryCat.icon}
                                    {entryCat.name}
                                  </option>
                                );
                              })}
                          </select>
                        </label>
                      </label>
                      <label>
                        Details:
                        <input
                          type="text"
                          value={expenseDetails}
                          onChange={(e) => setExpenseDetails(e.target.value)}
                          className="w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                        />
                      </label>
                      <label>
                        date:
                        <input
                          type="date"
                          value={expenseDate}
                          onChange={(e) => setExpenseDate(e.target.value)}
                          className="w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                        />
                      </label>
                      <button type="submit">Save</button>
                      <button onClick={() => setIsEditMode(false)}>
                        Close
                      </button>
                    </form>
                  </div>
                )}
              </div>
            ))}
        </div>
      ) : (
        <div>Expenses with the categoryId not found...</div>
      )}
    </div>
  );
};
export default ExpenseDetailPage;
