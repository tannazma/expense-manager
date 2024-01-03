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
      <div className="flex gap-6 bg-violet-200 p-4 pl-7 mb-7">
        {accounts?.map((account) => (
          <button
            key={account.id}
            onClick={() => setSelectedAccount(account.id)}
            className="hover:text-violet-600 font-semibold text-purple-900"
          >
            {account.name}
          </button>
        ))}
        <button
          onClick={() => setSelectedAccount(0)}
          className="hover:text-violet-600 font-semibold text-purple-900"
        >
          All
        </button>
      </div>
      {balance > 1000 && (
        <>
          <h2 className="text-lg pl-7">
            Balance: <span className="text-green-600">{balance}</span>
          </h2>
          <p className="bg-green-100 border rounded border-green-800  text-green-900 pl-7 pt-2 pb-2 w-[500px] ml-7 mt-3">
            <span>😍 </span>Great job! You&apos;re on track with your
            finances!
          </p>
        </>
      )}
      {balance <= 1000 && balance > 500 && (
        <>
          <h2 className="text-lg pl-7">
            Balance: <span className="text-yellow-600">{balance}</span>
          </h2>
          <p className="border-yellow-500 border rounded bg-yellow-50 text-yellow-700 pl-7 pt-2 pb-2 w-[500px] ml-7 mt-3">
            <span className="text-xl">🚧 </span>Watch out! Consider limiting
            your spendings!
          </p>
        </>
      )}
      {balance <= 500 && (
        <>
          <h2 className="text-lg pl-7">
            Balance: <span className="text-red-600">{balance}</span>
          </h2>
          <p className="bg-red-100 border rounded border-red-500 text-red-900 pl-7 pt-2 pb-2 w-[500px] ml-7 mt-3">
            <span>⛔ </span> Warning! You have low funds! Consider saving more.
          </p>
        </>
      )}
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
