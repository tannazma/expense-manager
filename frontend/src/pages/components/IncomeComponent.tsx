import { useContext, useEffect, useState } from "react";
import { IncomeCategory } from "../../../types";
// import { Income } from "../../../types";
import CreateIncome from "../components/CreateIncome";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { PieChart, Pie, Cell, Tooltip, Legend, LabelList } from "recharts";
import Link from "next/link";
import { SelectedAccountContext } from "./SelectedAccountContext";

interface incomeSumData {
  amount: number;
  incomeCategoryId: number;
}
interface ChartDataType {
  name: string;
  amount: number;
}

const IncomeComponent = () => {
  const selectedAccountId = useContext(SelectedAccountContext);
  // const [allIncomes, setAllIncomes] = useState<Income[]>([]);
  const [incomeSum, setIncomeSum] = useState<incomeSumData[]>([]);

  const [incomeCategories, setIncomeCategories] = useState<IncomeCategory[]>(
    []
  );
  const [showCreateIncomeDialog, setShowCreateIncomeDialog] = useState(false);
  const [chartData, setChartData] = useState<ChartDataType[]>([]);
  const [chartType, setChartType] = useState("pie");
  const [isRendered, setIsRendered] = useState(false);

  const toggleShowIncomeDialog = () => {
    setShowCreateIncomeDialog(!showCreateIncomeDialog);
  };
  const COLORS = [
    "#6a0dad",
    "#9370DB",
    "#9932CC",
    "#BA55D3",
    "#DA70D6",
    "#EE82EE",
    "#DDA0DD",
  ];

  useEffect(() => {
    setIsRendered(true);
  }, []);

  // useEffect(() => {
  //   const getAllIncomes = async () => {
  //     const response = await fetch("http://localhost:3001/incomes");
  //     const data = await response.json();
  //     setAllIncomes(data);
  //   };
  //   getAllIncomes();
  // }, []);

  useEffect(() => {
    const getIncomeSum = async () => {
      const response = await fetch(
        `http://localhost:3001/accounts/${selectedAccountId}/incomes-sum`
      );
      const data = await response.json();
      setIncomeSum(data);
    };
    getIncomeSum();
  }, [selectedAccountId]);

  useEffect(() => {
    const getIncomesCategories = async () => {
      const response = await fetch("http://localhost:3001/income-categories");
      const data = await response.json();
      setIncomeCategories(data);
    };
    getIncomesCategories();
  }, []);

  // const sumAllIncomesAmount = allIncomes.reduce(
  //   (accumulator, currentValue) => accumulator + currentValue.amount,
  //   0
  // );

  // console.log(sumAllIncomesAmount);

  useEffect(() => {
    const getIncomesCategories = async () => {
      const response = await fetch("http://localhost:3001/income-categories");
      const categories: IncomeCategory[] = await response.json();

      setIncomeCategories(categories);

      const getIncomeSum = async () => {
        const response = await fetch(
          `http://localhost:3001/accounts/${selectedAccountId}/incomes-sum`
        );
        const sumData: incomeSumData[] = await response.json();
        // create chart data based on the response
        const chartData: ChartDataType[] = sumData.map((item) => ({
          name:
            categories.find((cat) => cat.id === item.incomeCategoryId)?.name ||
            "Unknown",
          amount: item.amount,
        }));
        setIncomeSum(sumData);
        setChartData(chartData); // set chart data
      };
      getIncomeSum();
    };
    getIncomesCategories();
  }, [selectedAccountId]);

  return (
    <div className="income-container">
      <div>
        <h2>Incomes</h2>
        <button
          className="bg-transparent hover:bg-purple-500 text-purple-700 font-semibold hover:text-white py-2 px-4 border border-purple-500 hover:border-transparent rounded m-2"
          onClick={() => setChartType("pie")}
        >
          Pie Chart
        </button>
        <button
          className="bg-transparent hover:bg-purple-500 text-purple-700 font-semibold hover:text-white py-2 px-4 border border-purple-500 hover:border-transparent rounded m-2"
          onClick={() => setChartType("bar")}
        >
          s Bar Chart
        </button>
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
        <div className="flex justify-end">
          <button
            className="bg-transparent hover:bg-purple-500 text-purple-700 font-semibold hover:text-white py-2 px-4 border border-purple-500 hover:border-transparent rounded m-2"
            onClick={toggleShowIncomeDialog}
          >
            +
          </button>
        </div>
        {showCreateIncomeDialog && (
          <CreateIncome
            showDialog={showCreateIncomeDialog}
            setShowDialog={setShowCreateIncomeDialog}
          />
        )}
      </div>
      <div className="income-container">
        {isRendered && chartType === "bar" && (
          <BarChart
            width={400}
            height={400}
            data={chartData}
            // margin={{
            //   top: 5,
            //   right: 30,
            //   left: 20,
            //   bottom: 5,
            // }}
          >
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
        {incomeSum
          .sort((a, b) => (a.amount > b.amount ? -1 : 1))
          .map((summary) => {
            const incCategory = incomeCategories.find(
              (cat) => cat.id === summary.incomeCategoryId
            );
            return (
              <Link
                key={summary.incomeCategoryId}
                href={`/incomes/${incCategory?.id}`}
              >
                <div key={summary.incomeCategoryId} className="income-content">
                  <div className="income-icon-name">
                    {incCategory && (
                      <div className="income-icon-name">
                        <p className="income-icon">{incCategory.icon}</p>
                        <p className="income-name">{incCategory.name}</p>
                      </div>
                    )}
                  </div>
                  <p className="income-amount">{summary.amount} €</p>
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
};
export default IncomeComponent;
