import { useContext, useEffect, useState } from "react";
import { IncomeCategory, incomeSumData } from "../../types";
import Link from "next/link";
import SelectedAccountContext from "./SelectedAccountContext";
import IncomeCharts from "./IncomeCharts";
import CreateIncome from "./CreateEntry";
import PrimaryButton from "./PrimaryButton";

interface incomeProps {
  refetchBalance: () => void;
}

const IncomeComponent = ({ refetchBalance }: incomeProps) => {
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

  return (
    <div className="flex-1 pr-10 pl-10">
      <div>
        <h2 className="text-lg font-semibold">Incomes</h2>
        <IncomeCharts />
        <div className="flex justify-end pr-8">
          <PrimaryButton onClick={toggleShowIncomeDialog}>+</PrimaryButton>
        </div>
        {showCreateIncomeDialog && (
          <CreateIncome
            showDialog={showCreateIncomeDialog}
            type="income"
            setShowDialog={setShowCreateIncomeDialog}
            onCreated={getIncomeSum}
            refetchBalance={refetchBalance}
          />
        )}
      </div>
      <div className="flex flex-col pr-10 pl-10">
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
                className="text-xs"
              >
                <div
                  key={summary.incomeCategoryId}
                  className="flex pl-3 items-center bg-transparent hover:bg-purple-500 text-purple-700 font-semibold hover:text-white border border-purple-500 hover:border-transparent rounded m-2 px-2 py-2"
                >
                  <div className="flex justify-between gap-2 items-center">
                    {incCategory && (
                      <div className="flex justify-between gap-2 items-center">
                        <p className="text-xs">{incCategory.icon}</p>
                        <p className="text-xs">{incCategory.name}</p>
                      </div>
                    )}
                  </div>
                  <p className="flex flex-1 justify-end pr-6">
                    {summary.amount} €
                  </p>
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
};
export default IncomeComponent;
