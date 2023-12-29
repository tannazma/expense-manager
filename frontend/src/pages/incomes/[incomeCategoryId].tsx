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
        <div className="flex flex-1 flex-col gap-10 p-10 text-zinc-50 ">
          {getIncomes
            .sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1))
            .map((income) => (
              <div
                key={income.id}
                className=" bg-indigo-400 p-5 shadow-xl rounded-md"
              >
                <div className="flex ">
                  <span className="pr-2">{income.incomeCategory.icon}</span>
                  <p className="pr-2 pb-6">{income.incomeCategory.name}</p>
                  <p className="justify-between flex-1 text-right	">
                    {new Date(income.date).toUTCString()}
                  </p>
                </div>
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
