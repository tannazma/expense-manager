import { useEffect, useState } from "react";
import CreateExpense from "../components/CreateExpense";
import { Expense, ExpenseCategory } from "../../../types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { PieChart, Pie, Cell, Tooltip, Legend, LabelList } from "recharts";

const ExpenseComponent = () => {
  const [allExpenses, setAllExpenses] = useState<Expense[]>([]);
  const [expenseSum, setExpenseSum] = useState<Expense[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>(
    []
  );
  const [showCreateExpenseDialog, setShowCreateExpenseDialog] = useState(false);
  const [chartData, setChartData] = useState([]);
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
    const getAllExpenses = async () => {
      const response = await fetch("http://localhost:3001/expenses");
      const data = await response.json();
      setAllExpenses(data);
    };
    getAllExpenses();
  }, []);

  useEffect(() => {
    const getExpenseSum = async () => {
      const response = await fetch("http://localhost:3001/expenses-sum");
      const data = await response.json();
      setExpenseSum(data);
    };
    getExpenseSum();
  }, []);

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
      const data = await response.json();

      setExpenseCategories(data);

      const getExpenseSum = async () => {
        const response = await fetch("http://localhost:3001/expenses-sum");
        const sumData = await response.json();

        // create chart data based on the response
        const chartData = sumData.map((item) => ({
          name:
            data.find((cat) => cat.id === item.expenseCategoryId)?.name ||
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
        <button onClick={toggleShowExpenseDialog}> + </button>
        <div>
          <PieChart width={400} height={450}>
            <Pie
              dataKey="amount"
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={110}
              fill="#00008"
              label={true}
              paddingAngle={2}
              animationDuration={500}
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
        {showCreateExpenseDialog && (
          <CreateExpense
            showDialog={showCreateExpenseDialog}
            setShowDialog={setShowCreateExpenseDialog}
          />
        )}
      </div>
      <div className="expense-container">
        {expenseSum.map((summary) => {
          const expCategory = expenseCategories.find(
            (cat) => cat.id === summary.expenseCategoryId
          );
          return (
            <div key={summary.expenseCategoryId} className="expense-content">
              <p className="expense-icon-name">
                {expCategory && (
                  <p className="expense-icon-name">
                    <p className="expense-icon">{expCategory.icon}</p>
                    <p className="expense-name">{expCategory.name}</p>
                  </p>
                )}
              </p>
              <p className="expense-amount">{summary.amount} €</p>
            </div>
          );
        })}
        <BarChart
          width={600}
          height={300}
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="5 3" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            interval={0}
            tick={{ fontSize: 15 }}
            height={60}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="amount" fill="#8884d8" animationDuration={2000}></Bar>
        </BarChart>
      </div>
    </div>
  );
};
export default ExpenseComponent;
