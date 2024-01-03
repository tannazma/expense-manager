import { useEffect, useState } from "react";
import ExpenseComponent from "./ExpenseComponent";
import IncomeComponent from "./IncomeComponent";
import SelectedAccountContext from "./SelectedAccountContext";
import useFetchAccounts from "../pages/hooks/useFetchAccounts";
import NavBar from "./NavBar";
import { expenseSumData, incomeSumData } from "../../types";

const Home = () => {
  const [selectedAccountId, setSelectedAccount] = useState(0);
  const accounts = useFetchAccounts();
  const [expenseSum, setExpenseSum] = useState<expenseSumData[]>([]);
  const [incomeSum, setIncomeSum] = useState<incomeSumData[]>([]);

  let incomeTotal = incomeSum.reduce(
    (acc, curr) => acc + Number(curr.amount),
    0
  );
  let expenseTotal = expenseSum.reduce(
    (acc, curr) => acc + Number(curr.amount),
    0
  );

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
      setIncomeSum(sumData);
    };
    getIncomeSum();
  }, [selectedAccountId]);

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
      setExpenseSum(sumData);
    };

    getExpenseSum();
  }, [selectedAccountId]);

  const balance = incomeTotal - expenseTotal;

  return (
    <div>
      <NavBar />
      <div className="flex gap-6">
        {accounts?.map((account) => (
          <button
            key={account.id}
            onClick={() => setSelectedAccount(account.id)}
          >
            {account.name}
          </button>
        ))}
        <button onClick={() => setSelectedAccount(0)}>All</button>
      </div>
      <h2>Current Balance: {balance}</h2>
      <div className="flex flex-wrap gap-20 p-7 mb-5">
        <SelectedAccountContext.Provider value={selectedAccountId}>
          <ExpenseComponent />
          <IncomeComponent />
        </SelectedAccountContext.Provider>
      </div>
    </div>
  );
};
export default Home;
