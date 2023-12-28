import { useEffect, useState } from "react";
import { Expense } from "../../../types";
import { useRouter } from "next/router";

const ExpenseDetailPage = () => {
  const [getExpense, setExpense] = useState<Expense | null>(null);

  const router = useRouter();
  const idFromUrl = Number(router.query.expensCategoryId);
  console.log(idFromUrl);

  useEffect(() => {
    if (isNaN(idFromUrl)) {
      return;
    } else {
      const getExpensesFromCategories = async () => {
        const response = await fetch(
          `http://localhost:3001/expenses/${idFromUrl}`
        );
        const data = await response.json();
        setExpense(data);
      };
      getExpensesFromCategories();
    }
  }, [idFromUrl]);

  if (isNaN(idFromUrl)) {
    return <div>Expense not found</div>;
  }
  return <div>hi detail page</div>;
};
export default ExpenseDetailPage;
