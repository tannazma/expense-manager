import { useEffect, useState } from "react";
import CreateExpense from "../components/CreateExpense";
import { Expense, ExpenseCategory } from "../../../types";

const ExpenseComponent = () => {
  const [allExpenses, setAllExpenses] = useState<Expense[]>([]);
  const [expenseSum, setExpenseSum] = useState<Expense[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>(
    []
  );
  const [showCreateExpenseDialog, setShowCreateExpenseDialog] = useState(false);

  const toggleShowExpenseDialog = () => {
    setShowCreateExpenseDialog(!showCreateExpenseDialog);
  };
  useEffect(() => {
    const getAllExpenses = async () => {
      const response = await fetch("http://localhost:3001/expenses");
      const data = await response.json();
      setAllExpenses(data);
    };
    getAllExpenses();
  }, []);

  useEffect(() => {
    const getExpenseSum = async () => {
      const response = await fetch("http://localhost:3001/expenses-sum");
      const data = await response.json();
      setExpenseSum(data);
    };
    getExpenseSum();
  }, []);

  // const sumAllExpensesAmount = allExpenses.reduce(
  //   (accumulator, currentValue) => accumulator + currentValue.amount,
  //   0
  // );
  // console.log(sumAllExpensesAmount);

  useEffect(() => {
    const getExpensesCategories = async () => {
      const response = await fetch("http://localhost:3001/expense-categories");
      const data = await response.json();
      setExpenseCategories(data);
    };
    getExpensesCategories();
  }, []);

  return (
    <div className="expense-container">
      <div>
        <h2>Expenses</h2>
        <button onClick={toggleShowExpenseDialog}> + </button>
        {showCreateExpenseDialog && (
          <CreateExpense
            showDialog={showCreateExpenseDialog}
            setShowDialog={setShowCreateExpenseDialog}
          />
        )}
      </div>
      <div className="expense-container">
        {expenseSum.map((summary) => {
          const expCategory = expenseCategories.find(
            (cat) => cat.id === summary.expenseCategoryId
          );
          return (
            <div key={summary.expenseCategoryId} className="expense-content">
              <p className="expense-icon-name">
                {expCategory && (
                  <p className="expense-icon-name">
                    <p className="expense-icon">{expCategory.icon}</p>
                    <p className="expense-name">{expCategory.name}</p>
                  </p>
                )}
              </p>
              <p className="expense-amount">{summary.amount} €</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default ExpenseComponent;
