import { useEffect, useState } from "react";
import { expenseSumData, incomeSumData } from "../../types";

const useBalance = () => {
  const [expenseSum, setExpenseSum] = useState<expenseSumData[]>([]);
  const [incomeSum, setIncomeSum] = useState<incomeSumData[]>([]);
  const [selectedAccountId, setSelectedAccount] = useState(0);

  let incomeTotal = incomeSum.reduce(
    (acc, curr) => acc + Number(curr.amount),
    0
  );
  let expenseTotal = expenseSum.reduce(
    (acc, curr) => acc + Number(curr.amount),
    0
  );
  const balance = incomeTotal - expenseTotal;

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

  useEffect(() => {
    getIncomeSum();
  }, [selectedAccountId]);

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

  useEffect(() => {
    getExpenseSum();
  }, [selectedAccountId]);

  function refetchBalance() {
    getExpenseSum();
    getIncomeSum();
  }

  return { balance, selectedAccountId, setSelectedAccount, refetchBalance };
};
export default useBalance;
