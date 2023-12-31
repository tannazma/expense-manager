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

  useEffect(() => {
    getExpenseSum();
  }, [selectedAccountId]);

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
                href={`/expenses/${expCategory?.id}`}
                className="text-xs"
              >
                <div className="flex pl-3 items-center bg-violet-100 hover:bg-purple-500 text-purple-700 font-semibold hover:text-white border border-purple-500 hover:border-transparent rounded m-2 px-2 py-2">
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
