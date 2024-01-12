import { useContext, useEffect, useState } from "react";
import CreateEntry from "./CreateEntry";
import { ExpenseCategory, expenseSumData } from "../../types";
import Link from "next/link";
import SelectedAccountContext from "./SelectedAccountContext";
import ExpenseCharts from "./ExpenseCharts";
import ThemeContext from "./ThemeContext";
import PrimaryButton from "./PrimaryButton";

interface expenseProps {
  refetchBalance: () => void;
}

const ExpenseComponent = ({ refetchBalance }: expenseProps) => {
  const selectedAccountId = useContext(SelectedAccountContext);
  const [expenseSum, setExpenseSum] = useState<expenseSumData[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>(
    []
  );
  const [showCreateExpenseDialog, setShowCreateExpenseDialog] = useState(false);
  const [expenseSumBasedOnDate, setExpenseSumBasedOnDate] = useState<
    expenseSumData[]
  >([]);
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  const getExpenseSumBasedOnDate = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    // Ensure fromDate and toDate are in 'YYYY-MM-DD' format
    const from = new Date(fromDate).toISOString().split("T")[0];
    const to = new Date(toDate).toISOString().split("T")[0];

    const convertDate = (dateString: string) => {
      const [year, month, day] = dateString.split("-");
      return `${day}/${month.padStart(2, "0")}/${year}`;
    };

    const fromConverted = convertDate(from);
    const toConverted = convertDate(to);
    console.log("from to", from, to);
    console.log("converted", fromConverted, toConverted);
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVERURL}/accounts/${selectedAccountId}/expenses-sum-filter?from=${fromConverted}&to=${toConverted}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );

    const responseData = await response.json();
    console.log("responsedate", responseData);

    const sumData = responseData.totalExpenses;
    console.log("sumdata", sumData);
    console.log("expensesume", expenseSum);
    console.log("totalexp", responseData.totalExpenses);

    if (Array.isArray(sumData)) {
      setExpenseSumBasedOnDate(sumData);
    } else {
      console.error("Unexpected response:", responseData);
    }
  };

  const toggleShowExpenseDialog = () => {
    setShowCreateExpenseDialog(!showCreateExpenseDialog);
  };

  useEffect(() => {
    const getExpensesCategories = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVERURL}/expense-categories`
      );
      const categories: ExpenseCategory[] = await response.json();

      setExpenseCategories(categories);
    };
    getExpensesCategories();
  }, []);

  const getExpenseSum = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVERURL}/accounts/${selectedAccountId}/expenses-sum`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    const sumData: expenseSumData[] = await response.json();
    setExpenseSum(sumData);
  };

  useEffect(() => {
    getExpenseSum();
  }, [selectedAccountId]);

  const { theme } = useContext(ThemeContext);
  let entryBackgroundColorClass =
    "border-purple-500 bg-violet-100 hover:bg-purple-500 text-purple-700";

  if (theme === "red") {
    entryBackgroundColorClass =
      "border-red-500 bg-red-100 hover:bg-red-500 text-red-700";
  } else if (theme === "green") {
    entryBackgroundColorClass =
      "border-green-500 bg-green-100 hover:bg-green-500 text-green-700";
  } else if (theme === "blue") {
    entryBackgroundColorClass =
      "border-blue-500 bg-blue-100 hover:bg-blue-500 text-blue-700";
  } else if (theme === "dark") {
    entryBackgroundColorClass =
      "border-gray-500 bg-gray-500 hover:bg-gray-300 text-gray-300";
  }

  return (
    <div className="flex-1 pr-10 pl-10">
      <div>
        <h2 className="text-lg font-semibold">Expenses</h2>
        <ExpenseCharts />
        <div className="flex justify-end pr-8">
          <PrimaryButton onClick={toggleShowExpenseDialog}>+</PrimaryButton>
        </div>
        {showCreateExpenseDialog && (
          <CreateEntry
            showDialog={showCreateExpenseDialog}
            type="expense"
            setShowDialog={setShowCreateExpenseDialog}
            onCreated={getExpenseSum}
            refetchBalance={refetchBalance}
          />
        )}
      </div>
      <div className="flex justify-end pr-8">
        <form onSubmit={getExpenseSumBasedOnDate}>
          <label>
            From
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </label>
          <label>
            To
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </label>
          <button type="submit">Submit</button>
        </form>

        <div>
          {expenseSumBasedOnDate.map((expense, index) => (
            <div key={index}>
              <p>Expense Category ID: {expense.expenseCategoryId}</p>
              <p>Expense Category Name: {expense.expenseCategoryName}</p>
              <p>Amount: {expense.amount}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col pr-10 pl-10">
        {expenseSum
          .sort((a, b) => (a.amount > b.amount ? -1 : 1))
          .map((summary) => {
            const expCategory = expenseCategories.find(
              (cat) => cat.id === summary.expenseCategoryId
            );
            return (
              <Link
                key={summary.expenseCategoryId}
                href={`/expenses/${expCategory?.id}`}
                className="text-xs"
              >
                <div
                  className={`${entryBackgroundColorClass} flex pl-3 items-center font-semibold hover:text-white border hover:border-transparent rounded m-2 px-2 py-2`}
                >
                  <div className="flex justify-between gap-2 items-center">
                    {expCategory && (
                      <div className="flex justify-between gap-2 items-center">
                        <p className="text-xs">{expCategory.icon}</p>
                        <p className="text-xs">{expCategory.name}</p>
                      </div>
                    )}
                  </div>
                  <p className="flex flex-1 justify-end pr-6">
                    {summary.amount} €
                  </p>
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
};
export default ExpenseComponent;
