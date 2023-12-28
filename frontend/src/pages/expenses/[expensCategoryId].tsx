import { useEffect, useState } from "react";
import { Expense } from "../../../types";
import { useRouter } from "next/router";

const ExpenseDetailPage = () => {
  const [getExpenses, setExpenses] = useState<Expense[]>([]);

  const router = useRouter();
  const idFromUrl = Number(router.query.expensCategoryId);
  console.log(idFromUrl);

  useEffect(() => {
    if (isNaN(idFromUrl)) {
      return;
    } else {
      const getExpensesFromCategories = async () => {
        const response = await fetch(
          `http://localhost:3001/category/${idFromUrl}/expenses`
        );
        const data = await response.json();
        setExpenses(data);
      };
      getExpensesFromCategories();
    }
  }, [idFromUrl]);

  if (isNaN(idFromUrl)) {
    return <div>Expense not found</div>;
  }
  return (
    <div>
      {getExpenses.length > 0 ? (
        <div>
          {getExpenses.map((expense) => (
            <div key={expense.id}>
              <span>{expense.expenseCategory.icon}</span>
              {expense.expenseCategory.name}
              <p>{new Date(expense.date).toUTCString()}</p>
              <p>{expense.amount} €</p>
              <p>{expense.details}</p>
            </div>
          ))}
        </div>
      ) : (
        <div>Url not found...</div>
      )}
    </div>
  );
};
export default ExpenseDetailPage;
