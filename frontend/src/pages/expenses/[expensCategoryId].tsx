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
          `http://localhost:3001/category/${idFromUrl}/expenses`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
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
        <div className="flex flex-1 flex-col gap-10 p-10 text-zinc-50 ">
          {getExpenses
            .sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1))
            .map((expense) => (
              <div
                key={expense.id}
                className="bg-violet-500 p-5 shadow-xl rounded-md"
              >
                <div className="flex ">
                  <span>{expense.expenseCategory.icon}</span>
                  <p className="pr-2 pb-6">{expense.expenseCategory.name}</p>
                  <p className="justify-between flex-1 text-right	">
                    {new Date(expense.date).toUTCString()}
                  </p>
                </div>
                <p>{expense.amount} €</p>
                <p>{expense.details}</p>
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
