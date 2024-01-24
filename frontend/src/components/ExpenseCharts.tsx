import { useCallback, useContext, useEffect, useState } from "react";
import useIsRendered from "../hooks/useIsRendered";
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
import ThemeContext from "./ThemeContext";
import SecondaryButton from "./SecondaryButton";
import FilterContext from "./FilterContext";

const COLORS = [
  "#6a0dad",
  "#9370DB",
  "#9932CC",
  "#BA55D3",
  "#DA70D6",
  "#EE82EE",
  "#DDA0DD",
];

const COLORSDark = [
  "#181818", // very dark gray
  "#282828", // dark gray
  "#383838", // medium gray
  "#484848", // light gray
  "#FFFFFF", // white
];

const COLORSBlue = [
  "#0000FF",
  "#1E90FF",
  "#4169E1",
  "#4682B4",
  "#5F9EA0",
  "#87CEEB",
  "#B0E0E6",
];

const COLORSGreen = [
  "#008000",
  "#008B8B",
  "#20B2AA",
  "#32CD32",
  "#3CB371",
  "#66CDAA",
  "#7CFC00",
];

const COLORSRed = [
  "#B22222",
  "#CD5C5C",
  "#DC143C",
  "#FF0000",
  "#FF4500",
  "#FF6347",
  "#FF7F50",
];

const ExpenseCharts = () => {
  const [chartType, setChartType] = useState("pie");
  const isRendered = useIsRendered();
  const [chartData, setChartData] = useState<ChartDataType[]>([]);
  const selectedAccountId = useContext(SelectedAccountContext);
  const { isDarkMode, isGreen, isBlue, isRed } = useContext(ThemeContext);
  const { dateFilter } = useContext(FilterContext);
  let correctColors: string[];

  if (isDarkMode) {
    correctColors = COLORSDark;
  } else if (isGreen) {
    correctColors = COLORSGreen;
  } else if (isBlue) {
    correctColors = COLORSBlue;
  } else if (isRed) {
    correctColors = COLORSRed;
  } else {
    correctColors = COLORS; // default colors
  }

  const chartWidth =
    window.innerWidth < 768 ? window.innerWidth : window.innerWidth / 2 - 100;

  const getExpenseSum = useCallback(async () => {
    if (dateFilter) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVERURL}/accounts/${selectedAccountId}/expenses-sum-filter?from=${dateFilter.from}&to=${dateFilter.to}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch expense sum");
      }
      const sumData: expenseSumData[] = await response.json();
      // create chart data based on the response
      const chartData: ChartDataType[] = sumData.map((item) => ({
        name: item.expenseCategoryName,
        amount: item.amount,
      }));
      setChartData(chartData); // set chart data
    } else {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVERURL}/accounts/${selectedAccountId}/expenses-sum`,
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
    }
  }, [selectedAccountId, dateFilter]);

  useEffect(() => {
    getExpenseSum();
  }, [getExpenseSum]);

  useEffect(() => {
    const handleEntryEvent = () => {
      getExpenseSum();
    };
    window.addEventListener("CreatedEntryEvent", handleEntryEvent);
    return () => {
      window.removeEventListener("CreatedEntryEvent", handleEntryEvent);
    };
  }, [getExpenseSum]);

  return (
    <div>
      <div className="flex pl-7">
        <SecondaryButton onClick={() => setChartType("pie")}>
          <Image
            src={pieChartIcon}
            width={20}
            alt={pieChartIcon}
            className={isDarkMode ? "invert" : ""}
          />
          Pie Chart
        </SecondaryButton>
        <SecondaryButton onClick={() => setChartType("bar")}>
          <Image
            src={barChartIcon}
            width={20}
            alt={barChartIcon}
            className={isDarkMode ? "invert" : ""}
          />
          Bar Chart
        </SecondaryButton>
      </div>
      {isRendered && chartType === "pie" && (
        <div>
          <PieChart width={chartWidth} height={350}>
            <Pie
              dataKey="amount"
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={110}
              fill="#00008"
              label={true}
              paddingAngle={4}
              animationDuration={1000}
              fontSize={8}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={correctColors[index % correctColors.length]}
                  fontSize={12}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend layout="horizontal" align="left" verticalAlign="bottom" />
          </PieChart>
        </div>
      )}
      {isRendered && chartType === "bar" && (
        <div className="flex items-center h-[300px]">
          <BarChart width={chartWidth} height={350} data={chartData}>
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
                  fill={correctColors[index % correctColors.length]}
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
