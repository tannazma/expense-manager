import { useContext, useEffect, useState } from "react";
import CreateExpense from "./CreateEntry";
import { ExpenseCategory, expenseSumData } from "../../types";
import Link from "next/link";
import SelectedAccountContext from "./SelectedAccountContext";
import ExpenseCharts from "./ExpenseCharts";

const ExpenseComponent = () => {
  const selectedAccountId = useContext(SelectedAccountContext);
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
      const response = await fetch("http://localhost:3001/expense-categories");
      const categories: ExpenseCategory[] = await response.json();

      setExpenseCategories(categories);
    };
    getExpensesCategories();
  }, []);

  useEffect(() => {
    const getExpenseSum = async () => {
      const response = await fetch(
        `http://localhost:3001/accounts/${selectedAccountId}/expenses-sum`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      const sumData: expenseSumData[] = await response.json();
      setExpenseSum(sumData);
    };

    getExpenseSum();
  }, [selectedAccountId]);

  return (
    <div className="pt-50 flex-1 pr-20 pl-20">
      <div>
        <h2>Expenses</h2>
        <ExpenseCharts />
        <div className="flex justify-end pr-8">
          <button
            className="bg-purple-500 hover:bg-purple-800 text-white font-semibold hover:text-white py-2 px-4 border border-purple-500 hover:border-transparent rounded m-2 align-right"
            onClick={toggleShowExpenseDialog}
          >
            +
          </button>
        </div>
        {showCreateExpenseDialog && (
          <CreateExpense
            showDialog={showCreateExpenseDialog}
            type="expense"
            setShowDialog={setShowCreateExpenseDialog}
          />
        )}
      </div>
      <div className="pt-10 flex flex-col pr-10 pl-10">
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
              >
                <div className="flex pl-3 items-center bg-violet-100 hover:bg-purple-500 text-purple-700 font-semibold hover:text-white border border-purple-500 hover:border-transparent rounded m-2">
                  <div className="m-3 flex justify-between gap-4 items-center">
                    {expCategory && (
                      <div className="m-0 flex justify-between gap-4 items-center">
                        <p>{expCategory.icon}</p>
                        <p>{expCategory.name}</p>
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
