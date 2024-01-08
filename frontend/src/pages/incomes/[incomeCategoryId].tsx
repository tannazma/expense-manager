import { useEffect, useState } from "react";
import { Income } from "../../../types";
import { useRouter } from "next/router";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import NavBar from "@/components/NavBar";

interface ChartDataType {
  date: string;
  amount: number;
}

const COLORS = [
  "#6a0dad",
  "#9370DB",
  "#9932CC",
  "#BA55D3",
  "#DA70D6",
  "#EE82EE",
  "#DDA0DD",
];

const IncomeDetailPage = () => {
  const [getIncomes, setIncomes] = useState<Income[]>([]);

  const router = useRouter();
  const idFromUrl = Number(router.query.incomeCategoryId);
  const [chartData, setChartData] = useState<ChartDataType[]>([]);

  console.log(idFromUrl);

  useEffect(() => {
    if (isNaN(idFromUrl)) {
      return;
    } else {
      const getIncomesFromCategories = async () => {
        const response = await fetch(
          `http://localhost:3001/category/${idFromUrl}/incomes`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        const data = await response.json();
        setIncomes(data);

        const chartData: ChartDataType[] = data.map((income: Income) => ({
          // format the date as MM-DD
          date:
            new Date(income.date).getMonth() +
            1 +
            "/" +
            new Date(income.date).getDate(),
          amount: income.amount,
        }));

        setChartData(chartData);
      };
      getIncomesFromCategories();
    }
  }, [idFromUrl]);

  if (isNaN(idFromUrl)) {
    return <div>Income not found</div>;
  }
  return (
    <div>
      <NavBar />
      <div className="pt-10">
        <BarChart
          width={300}
          height={300}
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="5 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} height={90} />
          <YAxis tick={{ fontSize: 12 }} height={90} />
          <Tooltip />
          <Bar dataKey="amount" animationDuration={1000}>
            {chartData.map((entry, index) => (
              <Cell
                fill={COLORS[index % COLORS.length]}
                key={`cell-${index}`}
              />
            ))}
          </Bar>
        </BarChart>
      </div>
      {getIncomes.length > 0 ? (
        <div className="flex flex-1 flex-col gap-10 p-10 text-zinc-50 ">
          {getIncomes
            .sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1))
            .map((income) => (
              <div
                key={income.id}
                className=" bg-indigo-400 p-5 shadow-xl rounded-md"
              >
                <div className="flex">
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
        <div>Incomes with the categoryId not found...</div>
      )}
    </div>
  );
};
export default IncomeDetailPage;
