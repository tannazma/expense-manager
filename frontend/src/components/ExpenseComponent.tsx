import { useCallback, useContext, useEffect, useState } from "react";
import CreateEntry from "./CreateEntry";
import { ExpenseCategory, expenseSumData } from "../../types";
import Link from "next/link";
import SelectedAccountContext from "./SelectedAccountContext";
import ExpenseCharts from "./ExpenseCharts";
import ThemeContext from "./ThemeContext";
import PrimaryButton from "./PrimaryButton";
import FilterContext from "./FilterContext";

interface expenseProps {
  refetchBalance: () => void;
}

const ExpenseComponent = ({ refetchBalance }: expenseProps) => {
  const { dateFilter } = useContext(FilterContext);
  const selectedAccountId = useContext(SelectedAccountContext);
  const { theme } = useContext(ThemeContext);
  const [expenseSum, setExpenseSum] = useState<expenseSumData[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>(
    []
  );
  const [showCreateExpenseDialog, setShowCreateExpenseDialog] = useState(false);

  const toggleShowExpenseDialog = () => {
    setShowCreateExpenseDialog(!showCreateExpenseDialog);
  };

  useEffect(() => {
    const getExpensesCategories = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVERURL}/expense-categories`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch expense categories");
        }
        const categories: ExpenseCategory[] = await response.json();
        setExpenseCategories(categories);
      } catch (error) {
        console.error(error);
      }
    };
    getExpensesCategories();
  }, []);

  const getExpenseSum = useCallback(async () => {
    if (dateFilter) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVERURL}/accounts/${selectedAccountId}/expenses-sum-filter?from=${dateFilter.from}&to=${dateFilter.to}`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch expense sum");
        }
        const sumData: expenseSumData[] = await response.json();
        //sum data with filtering data
        setExpenseSum(sumData);
      } catch (error) {
        console.error(error);
      }
    } else {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVERURL}/accounts/${selectedAccountId}/expenses-sum`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      const sumData: expenseSumData[] = await response.json();
      //all sumdata before filtering date
      setExpenseSum(sumData);
    }
  }, [selectedAccountId, dateFilter]);

  useEffect(() => {
    getExpenseSum();
  }, [getExpenseSum]);

  // Code to set the background color class based on the theme
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

  // The component renders a list of expense categories and their sums, and a button to create a new expense
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
                href={`/accounts/${selectedAccountId}/expenses/category/${expCategory?.id}`}
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
