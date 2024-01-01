import { useContext, useEffect, useState } from "react";
import CreateExpense from "../components/CreateExpense";
import { ExpenseCategory } from "../../../types";
// import { Expense } from "../../../types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import Link from "next/link";
import { SelectedAccountContext } from "./SelectedAccountContext";

interface expenseSumData {
  amount: number;
  expenseCategoryId: number;
}
interface ChartDataType {
  name: string;
  amount: number;
}
const ExpenseComponent = () => {
  const selectedAccountId = useContext(SelectedAccountContext);
  const [isRendered, setIsRendered] = useState(false);
  // const [allExpenses, setAllExpenses] = useState<Expense[]>([]);
  const [expenseSum, setExpenseSum] = useState<expenseSumData[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>(
    []
  );
  const [showCreateExpenseDialog, setShowCreateExpenseDialog] = useState(false);
  const [chartData, setChartData] = useState<ChartDataType[]>([]);
  const [chartType, setChartType] = useState("pie");
  const COLORS = [
    "#6a0dad",
    "#9370DB",
    "#9932CC",
    "#BA55D3",
    "#DA70D6",
    "#EE82EE",
    "#DDA0DD",
  ];
  const toggleShowExpenseDialog = () => {
    setShowCreateExpenseDialog(!showCreateExpenseDialog);
  };

  useEffect(() => {
    setIsRendered(true);
  }, []);

  // useEffect(() => {
  //   const getAllExpenses = async () => {
  //     const response = await fetch(
  //       selectedAccountId === 0
  //         ? "http://localhost:3001/expenses"
  //         : "http://localhost:3001/account/:accountId/expenses"
  //     );
  //     const data = await response.json();
  //     setAllExpenses(data);
  //   };
  //   getAllExpenses();
  // }, [selectedAccountId]);

  useEffect(() => {
    const getExpenseSum = async () => {
      const response = await fetch(
        `http://localhost:3001/accounts/${selectedAccountId}/expenses-sum`
      );
      const data = await response.json();
      setExpenseSum(data);
    };
    getExpenseSum();
  }, [selectedAccountId]);

  // const sumAllExpensesAmount = allExpenses.reduce(
  //   (accumulator, currentValue) => accumulator + currentValue.amount,
  //   0
  // );
  // console.log(sumAllExpensesAmount);

  useEffect(() => {
    const getExpensesCategories = async () => {
      const response = await fetch("http://localhost:3001/expense-categories");
      const data = await response.json();
      setExpenseCategories(data);
    };
    getExpensesCategories();
  }, []);

  useEffect(() => {
    const getExpensesCategories = async () => {
      const response = await fetch("http://localhost:3001/expense-categories");
      const categories: ExpenseCategory[] = await response.json();

      setExpenseCategories(categories);

      const getExpenseSum = async () => {
        const response = await fetch(
          `http://localhost:3001/accounts/${selectedAccountId}/expenses-sum`
        );
        const sumData: expenseSumData[] = await response.json();
        // create chart data based on the response
        const chartData: ChartDataType[] = sumData.map((item) => ({
          name:
            categories.find((cat) => cat.id === item.expenseCategoryId)?.name ||
            "Unknown",
          amount: item.amount,
        }));

        setExpenseSum(sumData);
        setChartData(chartData); // set chart data
      };

      getExpenseSum();
    };

    getExpensesCategories();
  }, []);
  return (
    <div className="expense-container">
      <div>
        <h2>Expenses</h2>

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
            className="bg-transparent hover:bg-purple-500 text-purple-700 font-semibold hover:text-white py-2 px-4 border border-purple-500 hover:border-transparent rounded m-2 align-right"
            onClick={toggleShowExpenseDialog}
          >
            +
          </button>
        </div>

        {showCreateExpenseDialog && (
          <CreateExpense
            showDialog={showCreateExpenseDialog}
            setShowDialog={setShowCreateExpenseDialog}
          />
        )}
      </div>
      <div className="expense-container">
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
        {expenseSum
          .sort((a, b) => (a.amount > b.amount ? -1 : 1))
          .map((summary) => {
            const expCategory = expenseCategories.find(
              (cat) => cat.id === summary.expenseCategoryId
            );
            return (
              <Link
                key={summary.expenseCategoryId}
                href={`/expenses/${expCategory?.id}`}
              >
                <div className="expense-content">
                  <div className="expense-icon-name">
                    {expCategory && (
                      <div className="expense-icon-name">
                        <p className="expense-icon">{expCategory.icon}</p>
                        <p className="expense-name">{expCategory.name}</p>
                      </div>
                    )}
                  </div>
                  <p className="expense-amount">{summary.amount} €</p>
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
};
export default ExpenseComponent;
