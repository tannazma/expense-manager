import { useContext, useEffect, useState } from "react";
import { Expense, ExpenseCategory } from "../../../types";
import { useRouter } from "next/router";
import NavBar from "@/components/NavBar";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line,
  LineChart,
} from "recharts";
import ThemeContext from "@/components/ThemeContext";
import { AlertDialogDemo } from "../../components/AlertDialog";

interface ChartDataType {
  date: string;
  amount: number;
}

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
  const [chartData, setChartData] = useState<ChartDataType[]>([]);
  const { theme } = useContext(ThemeContext);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // new state variable for controlling the dialog

  useEffect(() => {
    const fetchAllExpenseCategories = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVERURL}/expense-categories`
      );
      const data = await response.json();
      setExpenseCategories(data);
      if (data[0]) {
        setSelectedExpenseCategoryId(data[0].id);
      }
    };
    fetchAllExpenseCategories();
  }, []);

  const fetchExpensesFromCategory = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVERURL}/category/${categoryIdFromUrl}/expenses`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    const data = await response.json();
    setSelectedExpenseCategoryId(data[0].id);
    setExpenses(data);

    const chartData: ChartDataType[] = data.map((expense: Expense) => ({
      // format the date as MM-DD
      date:
        new Date(expense.date).getMonth() +
        1 +
        "/" +
        new Date(expense.date).getDate(),
      amount: expense.amount,
    }));

    setChartData(chartData);
  };

  useEffect(() => {
    if (isNaN(categoryIdFromUrl)) {
      return;
    } else {
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
    fetch(`${process.env.NEXT_PUBLIC_SERVERURL}/expenses/${expenseId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        // Refetch the expenses after successfully deleting an expense
        fetchExpensesFromCategory();
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch expenses:",
          error
        );
        setIsEditMode(false);
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
      `${process.env.NEXT_PUBLIC_SERVERURL}/expenses/${expenseId}`,
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

  let firstButtonClass =
    "border-purple-500 bg-violet-100 hover:bg-purple-500 text-purple-700";
  let secondButtonClass =
    " bg-purple-500 hover:bg-purple-700 border-purple-500";
  let entryBackgroundColorClass = "bg-violet-300";
  if (theme === "red") {
    firstButtonClass =
      "border-red-500 bg-red-100 hover:bg-red-500 text-red-700 ";
    secondButtonClass = "bg-red-500 hover:bg-red-700 border-red-500";
    entryBackgroundColorClass = "bg-red-300";
  } else if (theme === "green") {
    firstButtonClass =
      "border-green-500 bg-green-100 hover:bg-green-500 text-green-700";
    secondButtonClass = "bg-green-500 hover:bg-green-700 border-green-500";
    entryBackgroundColorClass = "bg-green-300";
  } else if (theme === "blue") {
    firstButtonClass =
      "border-blue-500 bg-blue-100 hover:bg-blue-500 text-blue-700";
    secondButtonClass = "bg-blue-500 hover:bg-blue-700 border-blue-500";
    entryBackgroundColorClass = "bg-blue-300";
  } else if (theme === "dark") {
    firstButtonClass =
      "border-gray-500 bg-gray-500 hover:bg-gray-300 text-gray-300";
    secondButtonClass = "bg-gray-500 hover:bg-gray-700 border-gray-500";
    entryBackgroundColorClass = "bg-gray-300";
  }

  return (
    <div>
      <NavBar />
      <div className="pt-10">
        <LineChart
          width={300}
          height={300}
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="5 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} height={90} />
          <YAxis tick={{ fontSize: 12 }} height={90} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#8884d8"
            animationDuration={1000}
          />
        </LineChart>
      </div>
      {expenses.length > 0 ? (
        <div className="flex flex-1 flex-col gap-3 text-xs p-3 pt-10">
          {expenses
            .sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1))
            .map((expense) => (
              <div
                key={expense.id}
                className={`${entryBackgroundColorClass} p-5 shadow-xl rounded-md`}
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
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsDialogOpen(true)}
                    className={`${firstButtonClass} font-bold py-1 px-2 hover:text-white border hover:border-transparent rounded align-right`}
                  >
                    Delete
                  </button>
                  {isDialogOpen && (
                    <AlertDialogDemo
                      isOpen={isDialogOpen}
                      onContinue={() => handleDeleteExpense(expense.id)}
                      onCancel={() => setIsDialogOpen(false)}
                    />
                  )}
                  <button
                    onClick={() => handleEditExpense(expense.id)}
                    className={`${secondButtonClass} text-white font-bold py-1 px-2 hover:text-white border hover:border-transparent rounded align-right`}
                  >
                    Edit
                  </button>
                </div>
                {isEditMode && (
                  <div
                    className="h-screen place-items-center w-screen modal transition-all-1s fixed top-0 left-0 right-0 bottom-0 z-50 gap-2 grid bg-black bg-opacity-30 items-center text-center justify-center"
                    style={{
                      display: isEditMode ? "grid" : "none",
                      opacity: isEditMode ? 1 : 0,
                    }}
                  >
                    <form
                      onSubmit={(event) =>
                        handleUpdateExpense(expense.id, event)
                      }
                      className={`${entryBackgroundColorClass} p-10 rounded relative flex flex-col gap-5`}
                    >
                      <label>
                        Amount:
                        <input
                          type="number"
                          value={expenseAmount}
                          onChange={(e) => setExpenseAmount(e.target.value)}
                          className="min-w-[500px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset"
                        />
                      </label>
                      <label>
                        Category:
                        <select
                          id="category"
                          name="category"
                          value={selectedExpenseCategoryId}
                          onChange={(e) =>
                            setSelectedExpenseCategoryId(e.target.value)
                          }
                          className="min-w-[500px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset"
                        >
                          {expenseCategories &&
                            expenseCategories.map((entryCat) => {
                              return (
                                <option key={entryCat.id} value={entryCat.id}>
                                  {entryCat.icon}
                                  {entryCat.name}
                                </option>
                              );
                            })}
                        </select>
                      </label>
                      <label>
                        Details:
                        <input
                          type="text"
                          value={expenseDetails}
                          onChange={(e) => setExpenseDetails(e.target.value)}
                          className="min-w-[500px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                        />
                      </label>
                      <label>
                        date:
                        <input
                          type="date"
                          value={expenseDate}
                          onChange={(e) => setExpenseDate(e.target.value)}
                          className="min-w-[500px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                        />
                      </label>
                      <button
                        type="submit"
                        className={`${secondButtonClass} text-white font-bold py-2 px-4 roundedbg-violet-200s hover:text-white border hover:border-transparent rounded align-right`}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditMode(false)}
                        className={`${firstButtonClass}font-bold py-2 px-4 roundedbg-violet-200s hover:text-white border hover:border-transparent rounded align-right`}
                      >
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
