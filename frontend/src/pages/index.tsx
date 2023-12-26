import ExpenseComponent from "./components/ExpenseComponent";
import IncomeComponent from "./components/IncomeComponent";

export default function Home() {
 
  return (
    <div className="expense-income-container">
      <ExpenseComponent />
      <IncomeComponent />
    </div>
  );
}
