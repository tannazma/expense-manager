import { useContext, useEffect, useState } from "react";
import CreateExpense from "../components/CreateExpense";
import { ChartDataType, ExpenseCategory, expenseSumData } from "../../../types";
// import { Expense } from "../../../types";

import Link from "next/link";
import { SelectedAccountContext } from "./SelectedAccountContext";
import { useIsRendered } from "../hooks/useIsRendered";
import ExpenseCharts from "./ExpenseCharts";

const ExpenseComponent = () => {
  const selectedAccountId = useContext(SelectedAccountContext);
  // const [allExpenses, setAllExpenses] = useState<Expense[]>([]);
  const [expenseSum, setExpenseSum] = useState<expenseSumData[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>(
    []
  );
  const [showCreateExpenseDialog, setShowCreateExpenseDialog] = useState(false);
  const [chartData, setChartData] = useState<ChartDataType[]>([]);

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
        `http://localhost:3001/accounts/${selectedAccountId}/expenses-sum`
      );
      const sumData: expenseSumData[] = await response.json();
      // create chart data based on the response
      const chartData: ChartDataType[] = sumData.map((item) => ({
        name: item.expenseCategoryName,
        amount: item.amount,
      }));

      setExpenseSum(sumData);
      setChartData(chartData); // set chart data
    };

    getExpenseSum();
  }, [selectedAccountId]);

  return (
    <div className="expense-container">
      <div>
        <h2>Expenses</h2>
        <ExpenseCharts />
        <div className="flex justify-end">
          <button
            className="bg-transparent hover:bg-purple-500 text-purple-700 font-semibold hover:text-white py-2 px-4 border border-purple-500 hover:border-transparent rounded m-2 align-right"
            onClick={toggleShowExpenseDialog}
          >
            +
          </button>
        </div>
        {showCreateExpenseDialog && (
          <CreateExpense
            showDialog={showCreateExpenseDialog}
            setShowDialog={setShowCreateExpenseDialog}
          />
        )}
      </div>
      <div className="expense-container">
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
                <div className="expense-content">
                  <div className="expense-icon-name">
                    {expCategory && (
                      <div className="expense-icon-name">
                        <p className="expense-icon">{expCategory.icon}</p>
                        <p className="expense-name">{expCategory.name}</p>
                      </div>
                    )}
                  </div>
                  <p className="expense-amount">{summary.amount} €</p>
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
};
export default ExpenseComponent;
