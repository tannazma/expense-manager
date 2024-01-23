import { useCallback, useEffect, useState } from "react";
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

  const getIncomeSum = useCallback(async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVERURL}/accounts/${selectedAccountId}/incomes-sum`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    const sumData: incomeSumData[] = await response.json();
    setIncomeSum(sumData);
  }, [selectedAccountId]);

  useEffect(() => {
    getIncomeSum();
  }, [getIncomeSum]);

  const getExpenseSum = useCallback(async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVERURL}/accounts/${selectedAccountId}/expenses-sum`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    const sumData: expenseSumData[] = await response.json();
    setExpenseSum(sumData);
  }, [selectedAccountId]);

  useEffect(() => {
    getExpenseSum();
  }, [getExpenseSum]);

  function refetchBalance() {
    getExpenseSum();
    getIncomeSum();
  }

  return { balance, selectedAccountId, setSelectedAccount, refetchBalance };
};
export default useBalance;
