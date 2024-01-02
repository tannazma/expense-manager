import { useContext, useEffect, useState } from "react";
import { IncomeCategory, incomeSumData } from "../../../types";
import CreateIncome from "../components/CreateIncome";
import Link from "next/link";
import { SelectedAccountContext } from "./SelectedAccountContext";
import IncomeCharts from "./IncomeCharts";

const IncomeComponent = () => {
  const selectedAccountId = useContext(SelectedAccountContext);
  const [incomeSum, setIncomeSum] = useState<incomeSumData[]>([]);
  const [incomeCategories, setIncomeCategories] = useState<IncomeCategory[]>(
    []
  );
  const [showCreateIncomeDialog, setShowCreateIncomeDialog] = useState(false);

  const toggleShowIncomeDialog = () => {
    setShowCreateIncomeDialog(!showCreateIncomeDialog);
  };

  useEffect(() => {
    const getIncomesCategories = async () => {
      const response = await fetch("http://localhost:3001/income-categories");
      const categories: IncomeCategory[] = await response.json();
      setIncomeCategories(categories);
    };
    getIncomesCategories();
  }, []);

  useEffect(() => {
    const getIncomeSum = async () => {
      const response = await fetch(
        `http://localhost:3001/accounts/${selectedAccountId}/incomes-sum`
      );
      const sumData: incomeSumData[] = await response.json();
      setIncomeSum(sumData);
    };
    getIncomeSum();
  }, [selectedAccountId]);

  return (
    <div className="income-container">
      <div>
        <h2>Incomes</h2>
        <IncomeCharts />
        <div className="flex justify-end">
          <button
            className="bg-transparent hover:bg-purple-500 text-purple-700 font-semibold hover:text-white py-2 px-4 border border-purple-500 hover:border-transparent rounded m-2"
            onClick={toggleShowIncomeDialog}
          >
            +
          </button>
        </div>
        {showCreateIncomeDialog && (
          <CreateIncome
            showDialog={showCreateIncomeDialog}
            setShowDialog={setShowCreateIncomeDialog}
          />
        )}
      </div>
      <div className="income-container">
        {incomeSum
          .sort((a, b) => (a.amount > b.amount ? -1 : 1))
          .map((summary) => {
            const incCategory = incomeCategories.find(
              (cat) => cat.id === summary.incomeCategoryId
            );
            return (
              <Link
                key={summary.incomeCategoryId}
                href={`/incomes/${incCategory?.id}`}
              >
                <div key={summary.incomeCategoryId} className="income-content">
                  <div className="income-icon-name">
                    {incCategory && (
                      <div className="income-icon-name">
                        <p className="income-icon">{incCategory.icon}</p>
                        <p className="income-name">{incCategory.name}</p>
                      </div>
                    )}
                  </div>
                  <p className="income-amount">{summary.amount} €</p>
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
};
export default IncomeComponent;
