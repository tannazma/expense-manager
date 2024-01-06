import { useEffect, useState } from "react";
import { Expense, ExpenseCategory } from "../../../types";
import { useRouter } from "next/router";

const ExpenseDetailPage = () => {
  const [getExpenses, setExpenses] = useState<Expense[]>([]);
  const [editMode, setEditMode] = useState(false);
  const router = useRouter();
  const idFromUrl = Number(router.query.expensCategoryId);
  const [amount, setAmount] = useState("");
  const [expenseCategoryId, setExpenseCategoryId] = useState("");
  const [details, setDetails] = useState("");
  const [date, setDate] = useState("");
  const [expenseCategories, setExpenseCategories] = useState<
    ExpenseCategory[] | null
  >(null);
  console.log(idFromUrl);

  useEffect(() => {
    const getAllExpenseCategories = async () => {
      const response = await fetch("http://localhost:3001/expense-categories");
      const data = await response.json();
      setExpenseCategories(data);
      if (data[0]) {
        setExpenseCategoryId(data[0].id); // Ensure data[0] exists before accessing its id
      }
    };
    getAllExpenseCategories();
  }, []);

  useEffect(() => {
    if (isNaN(idFromUrl)) {
      return;
    } else {
      const getExpensesFromCategories = async () => {
        const response = await fetch(
          `http://localhost:3001/category/${idFromUrl}/expenses`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        const data = await response.json();
        setExpenseCategoryId(data[0].id);
        setExpenses(data);
      };
      getExpensesFromCategories();
    }
  }, [idFromUrl]);

  if (isNaN(idFromUrl)) {
    return <div>Expense not found</div>;
  }

  const handleDeleteClick = (expenseId: number) => {
    console.log(expenseId)
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

  const handleEditClick = (expenseId: number) => {
    const expenseToEdit = getExpenses.find(
      (expense) => expense.id === expenseId
    );
    if (expenseToEdit) {
      setAmount(expenseToEdit.amount.toString());
      setExpenseCategoryId(expenseToEdit.expenseCategoryId.toString());
      setDetails(expenseToEdit.details);
      setDate(expenseToEdit.date.toString());
      setEditMode(true);
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
          amount: Number(amount),
          expenseCategoryId: Number(expenseCategoryId),
          details: details,
          date: new Date(date).toISOString(),
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
      setEditMode(false);
    }
  };

  return (
    <div>
      {getExpenses.length > 0 ? (
        <div className="flex flex-1 flex-col gap-10 p-10 text-zinc-50 ">
          {getExpenses
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
                <button onClick={() => handleDeleteClick(expense.id)}>
                  Delete
                </button>
                <button onClick={() => handleEditClick(expense.id)}>
                  Edit
                </button>
                {editMode && (
                  <div className="modal">
                    <form
                      onSubmit={(event) => handleUpdateExpense(expense.id, event)}
                      className="p-10 rounded bg-violet-400 relative flex flex-col gap-5 "
                    >
                      <label>
                        Amount:
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 "
                        />
                        <label>
                          Category:
                          <select
                            id="category"
                            name="category"
                            value={expenseCategoryId}
                            onChange={(e) =>
                              setExpenseCategoryId(e.target.value)
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
                          value={details}
                          onChange={(e) => setDetails(e.target.value)}
                          className="w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                        />
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
                      <button type="submit">Save</button>
                      <button onClick={() => setEditMode(false)}>Close</button>
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
