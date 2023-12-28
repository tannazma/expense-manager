import { useEffect, useState } from "react";
import { Income } from "../../../types";
import { useRouter } from "next/router";

const IncomeDetailPage = () => {
  const [getIncomes, setIncomes] = useState<Income[]>([]);

  const router = useRouter();
  const idFromUrl = Number(router.query.incomeCategoryId);
  console.log(idFromUrl);

  useEffect(() => {
    if (isNaN(idFromUrl)) {
      return;
    } else {
      const getIncomesFromCategories = async () => {
        const response = await fetch(
          `http://localhost:3001/category/${idFromUrl}/incomes`
        );
        const data = await response.json();
        setIncomes(data);
      };
      getIncomesFromCategories();
    }
  }, [idFromUrl]);

  if (isNaN(idFromUrl)) {
    return <div>Income not found</div>;
  }
  return (
    <div>
      {getIncomes.length > 0 ? (
        <div>
          {getIncomes
            .sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1))
            .map((income) => (
              <div key={income.id}>
                <span>{income.incomeCategory.icon}</span>
                {income.incomeCategory.name}
                <p>{new Date(income.date).toUTCString()}</p>
                <p>{income.amount} €</p>
                <p>{income.details}</p>
              </div>
            ))}
        </div>
      ) : (
        <div>Url not found...</div>
      )}
    </div>
  );
};
export default IncomeDetailPage;
