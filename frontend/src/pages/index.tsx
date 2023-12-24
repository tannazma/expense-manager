import expenses from "../../../backend/prisma/data/expenses.json";
import expensesCategory from "../../../backend/prisma/data/expenseCategories.json";

export default function Home() {
  return (
    <div>
      <h1>Expenses</h1>
      <div>
        {expenses.map((expense) => (
          <span key={expense.id}>{expense.amount}</span>
        ))}
      </div>
    </div>
  );
}
