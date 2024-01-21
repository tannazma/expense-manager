import { useContext, useEffect, useState } from "react";
import { IncomeCategory, incomeSumData } from "../../types";
import Link from "next/link";
import SelectedAccountContext from "./SelectedAccountContext";
import IncomeCharts from "./IncomeCharts";
import CreateIncome from "./CreateEntry";
import PrimaryButton from "./PrimaryButton";
import ThemeContext from "./ThemeContext";
import FilterContext from "./FilterContext";

interface incomeProps {
  refetchBalance: () => void;
}

const IncomeComponent = ({ refetchBalance }: incomeProps) => {
  const { dateFilter } = useContext(FilterContext);
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
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVERURL}/income-categories`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch income categories");
        }
        const categories: IncomeCategory[] = await response.json();
        setIncomeCategories(categories);
      } catch (error) {
        console.error(error);
      }
    };
    getIncomesCategories();
  }, []);

  const getIncomeSum = async () => {
    if (dateFilter) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVERURL}/accounts/${selectedAccountId}/incomes-sum-filter?from=${dateFilter.from}&to=${dateFilter.to}`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch income sum");
        }
        const sumData: incomeSumData[] = await response.json();
        //sum data with filtering data
        setIncomeSum(sumData);
      } catch (error) {
        console.error(error);
      }
    } else {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVERURL}/accounts/${selectedAccountId}/incomes-sum`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      const sumData: incomeSumData[] = await response.json();
      //all sumdata before filtering date
      setIncomeSum(sumData);
    }
  };

  useEffect(() => {
    getIncomeSum();
  }, [selectedAccountId, dateFilter]);

  const { theme } = useContext(ThemeContext);
  let entryBackgroundColorClass =
    "border-purple-500 bg-violet-100 hover:bg-purple-500 text-purple-700";

  if (theme === "red") {
    entryBackgroundColorClass =
      "border-red-500 bg-red-100 hover:bg-red-500 text-red-700 ";
  } else if (theme === "green") {
    entryBackgroundColorClass =
      "border-green-500 bg-green-100 hover:bg-green-500 text-green-700";
  } else if (theme === "blue") {
    entryBackgroundColorClass =
      "border-blue-500 bg-blue-100 hover:bg-blue-500 text-blue-700";
  } else if (theme === "dark") {
    entryBackgroundColorClass =
      "border-gray-500 bg-gray-500 hover:bg-gray-300 text-gray-300";
  }

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
                href={`/accounts/${selectedAccountId}/incomes/category/${incCategory?.id}`}
                className="text-xs"
              >
                <div
                  key={summary.incomeCategoryId}
                  className={`${entryBackgroundColorClass} flex pl-3 items-center bg-transparent font-semibold hover:text-white border hover:border-transparent rounded m-2 px-2 py-2`}
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
