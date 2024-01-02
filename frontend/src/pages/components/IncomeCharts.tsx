import { useContext, useEffect, useState } from "react";
import { useIsRendered } from "../hooks/useIsRendered";
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
import { ChartDataType, incomeSumData } from "../../../types";
import { SelectedAccountContext } from "./SelectedAccountContext";
import barChartIcon from "./bar-chart-1-svgrepo-com.svg";
import pieChartIcon from "./pie-chart-svgrepo-com.svg";
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

const IncomeCharts = () => {
  const [chartType, setChartType] = useState("pie");
  const isRendered = useIsRendered();
  const [chartData, setChartData] = useState<ChartDataType[]>([]);
  const selectedAccountId = useContext(SelectedAccountContext);

  useEffect(() => {
    const getIncomeSum = async () => {
      const response = await fetch(
        `http://localhost:3001/accounts/${selectedAccountId}/incomes-sum`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      const sumData: incomeSumData[] = await response.json();
      // create chart data based on the response
      const chartData: ChartDataType[] = sumData.map((item) => ({
        amount: item.amount,
        name: item.incomeCategoryName,
      }));
      setChartData(chartData); // set chart data
    };
    getIncomeSum();
  }, [selectedAccountId]);

  return (
    <div>
      <div className="flex mb-10">
        <button
          className="flex gap-2 bg-transparent hover:bg-purple-500 text-purple-700 font-semibold hover:text-white py-2 px-4 border border-purple-500 hover:border-transparent rounded m-2"
          onClick={() => setChartType("pie")}
        >
          <Image src={pieChartIcon} width={20} alt={pieChartIcon} />
          Pie Chart
        </button>
        <button
          className="flex gap-2 bg-transparent hover:bg-purple-500 text-purple-700 font-semibold hover:text-white py-2 px-4 border border-purple-500 hover:border-transparent rounded m-2"
          onClick={() => setChartType("bar")}
        >
          <Image src={barChartIcon} width={20} alt={barChartIcon} />
          Bar Chart
        </button>
      </div>
      {isRendered && chartType === "pie" && (
        <div>
          <PieChart width={400} height={400}>
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
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      )}
      {isRendered && chartType === "bar" && (
        <BarChart width={400} height={400} data={chartData}>
          <CartesianGrid strokeDasharray="5 3" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            interval={0}
            tick={{ fontSize: 15 }}
            height={90}
          />
          <YAxis
            dataKey="amount"
            textAnchor="end"
            interval={0}
            tick={{ fontSize: 14 }}
            height={90}
          />
          <Tooltip />
          <Legend />
          <Bar dataKey="amount" animationDuration={1000}>
            {chartData.map((entry, index) => (
              <Cell
                fill={COLORS[index % COLORS.length]}
                key={`cell-${index}`}
              />
            ))}
          </Bar>
        </BarChart>
      )}
    </div>
  );
};
export default IncomeCharts;
