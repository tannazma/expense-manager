import { useContext, useState } from "react";
import { expenseSumData } from "../../types";
import SelectedAccountContext from "./SelectedAccountContext";
import FilterContext from "./FilterContext";
import { createContext } from "vm";
export const ExpenseDataContext = createContext();

const FilterDateComponent = () => {
  const [expenseSum, setExpenseSum] = useState<expenseSumData[]>([]);
  const selectedAccountId = useContext(SelectedAccountContext);
  const [expenseSumBasedOnDate, setExpenseSumBasedOnDate] = useState<
    expenseSumData[]
  >([]);
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const {setDateFilter}  = useContext(FilterContext);
  
  const getExpenseSumBasedOnDate = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {

    event.preventDefault();

    // Ensure fromDate and toDate are in 'YYYY-MM-DD' format
    const from = new Date(fromDate).toISOString().split("T")[0];
    const to = new Date(toDate).toISOString().split("T")[0];
    const convertDate = (dateString: string) => {
      const [year, month, day] = dateString.split("-");
      return `${day}/${month.padStart(2, "0")}/${year}`;
    };
    const fromConverted = convertDate(from);
    const toConverted = convertDate(to);
    console.log("from to", from, to);
    console.log("converted", fromConverted, toConverted);
    setDateFilter({from:fromConverted,to:toConverted})
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVERURL}/accounts/${selectedAccountId}/expenses-sum-filter?from=${fromConverted}&to=${toConverted}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    const responseData = await response.json();
    console.log("responsedate", responseData);
    const sumData = responseData.totalExpenses;
    console.log("sumdata", sumData);
    console.log("expensesume", expenseSum);
    console.log("totalexp", responseData.totalExpenses);
    if (Array.isArray(sumData)) {
      setExpenseSumBasedOnDate(sumData);
    } else {
      console.error("Unexpected response:", responseData);
    }
    
  };

  return (
    <div className="flex justify-end pr-8">
      <form onSubmit={getExpenseSumBasedOnDate}>
        <label>
          From
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </label>
        <label>
          To
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </label>
        <button type="submit">Submit</button>
      </form>

      <div>
        {expenseSumBasedOnDate.map((expense, index) => (
          <div key={index}>
            <p>Expense Category ID: {expense.expenseCategoryId}</p>
            <p>Expense Category Name: {expense.expenseCategoryName}</p>
            <p>Amount: {expense.amount}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default FilterDateComponent;
