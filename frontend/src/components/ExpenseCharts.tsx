import { useContext, useEffect, useState } from "react";
import useIsRendered from "../pages/hooks/useIsRendered";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { ChartDataType, expenseSumData } from "../../types";
import SelectedAccountContext from "./SelectedAccountContext";
import barChartIcon from "../../public/bar-chart-1-svgrepo-com.svg";
import pieChartIcon from "../../public/pie-chart-svgrepo-com.svg";
import Image from "next/image";

const COLORS = [
  "#6a0dad",
  "#9370DB",
  "#9932CC",
  "#BA55D3",
  "#DA70D6",
  "#EE82EE",
  "#DDA0DD",
];

const ExpenseCharts = () => {
  const [chartType, setChartType] = useState("pie");
  const isRendered = useIsRendered();
  const [chartData, setChartData] = useState<ChartDataType[]>([]);
  const selectedAccountId = useContext(SelectedAccountContext);

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
      // create chart data based on the response
      const chartData: ChartDataType[] = sumData.map((item) => ({
        name: item.expenseCategoryName,
        amount: item.amount,
      }));

      setChartData(chartData); // set chart data
    };

    getExpenseSum();
  }, [selectedAccountId]);

  return (
    <div>
      <div className="flex">
        <button
          className="text-xs items-center flex gap-2 bg-transparent hover:bg-purple-500 text-purple-700 font-semibold hover:text-white py-1 px-2 border border-purple-500 hover:border-transparent rounded m-2"
          onClick={() => setChartType("pie")}
        >
          <Image src={pieChartIcon} width={20} alt={pieChartIcon} />
          Pie Chart
        </button>
        <button
          className="text-xs items-center flex gap-2 bg-transparent hover:bg-purple-500 text-purple-700 font-semibold hover:text-white py-1 px-2 border border-purple-500 hover:border-transparent rounded m-2"
          onClick={() => setChartType("bar")}
        >
          <Image src={barChartIcon} width={20} alt={barChartIcon} />
          Bar Chart
        </button>
      </div>
      {isRendered && chartType === "pie" && (
        <div>
          <PieChart width={500} height={300}>
            <Pie
              dataKey="amount"
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={110}
              fill="#00008"
              label={true}
              paddingAngle={2}
              animationDuration={1000}
              fontSize={12}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  fontSize={12}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend layout="vertical" align="left" verticalAlign="middle" />
          </PieChart>
        </div>
      )}
      {isRendered && chartType === "bar" && (
        <div className="flex items-center h-[300px]">
          <BarChart width={500} height={300} data={chartData}>
            <CartesianGrid strokeDasharray="5 3" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              interval={0}
              tick={{ fontSize: 12 }}
              height={90}
            />
            <YAxis
              dataKey="amount"
              textAnchor="end"
              interval={0}
              tick={{ fontSize: 12 }}
              height={90}
            />
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
      )}
    </div>
  );
};
export default ExpenseCharts;
