import { useEffect, useState } from "react";
import { Income, IncomeCategory } from "../../../types";
import CreateIncome from "../components/CreateIncome";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { PieChart, Pie, Cell, Tooltip, Legend, LabelList } from "recharts";

interface incomeSumData {
  amount: number;
  incomeCategoryId: number;
}
interface ChartDataType {
  name: string;
  amount: number;
}

const IncomeComponent = () => {
  const [allIncomes, setAllIncomes] = useState<Income[]>([]);
  const [incomeSum, setIncomeSum] = useState<incomeSumData[]>([]);

  const [incomeCategories, setIncomeCategories] = useState<IncomeCategory[]>(
    []
  );
  const [showCreateIncomeDialog, setShowCreateIncomeDialog] = useState(false);
  const [chartData, setChartData] = useState<ChartDataType[]>([]);
  const [chartType, setChartType] = useState("pie");

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
    const getAllIncomes = async () => {
      const response = await fetch("http://localhost:3001/incomes");
      const data = await response.json();
      setAllIncomes(data);
    };
    getAllIncomes();
  }, []);

  useEffect(() => {
    const getIncomeSum = async () => {
      const response = await fetch("http://localhost:3001/incomes-sum");
      const data = await response.json();
      setIncomeSum(data);
    };
    getIncomeSum();
  }, []);

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
        const response = await fetch("http://localhost:3001/incomes-sum");
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
  }, []);

  return (
    <div className="income-container">
      <div>
        <h2>Incomes</h2>
        <button onClick={toggleShowIncomeDialog}> + </button>
        <button onClick={() => setChartType("pie")}> Pie Chart </button>
        <button onClick={() => setChartType("bar")}>s Bar Chart </button>
        {chartType === "pie" && (
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
        {showCreateIncomeDialog && (
          <CreateIncome
            showDialog={showCreateIncomeDialog}
            setShowDialog={setShowCreateIncomeDialog}
          />
        )}
      </div>
      <div className="income-container">
        {chartType === "bar" && (
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
        {incomeSum.map((summary) => {
          const incCategory = incomeCategories.find(
            (cat) => cat.id === summary.incomeCategoryId
          );
          return (
            <div key={summary.incomeCategoryId} className="income-content">
              <p className="income-icon-name">
                {incCategory && (
                  <p className="income-icon-name">
                    <p className="income-icon">{incCategory.icon}</p>
                    <p className="income-name">{incCategory.name}</p>
                  </p>
                )}
              </p>
              <p className="income-amount">{summary.amount} €</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default IncomeComponent;
