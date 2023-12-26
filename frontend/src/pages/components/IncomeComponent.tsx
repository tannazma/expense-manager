import { useEffect, useState } from "react";
import { Income, IncomeCategory } from "../../../types";
import CreateIncome from "../components/CreateIncome";

const IncomeComponent = () => {
  const [allIncomes, setAllIncomes] = useState<Income[]>([]);
  const [incomeSum, setIncomeSum] = useState<Income[]>([]);

  const [incomeCategories, setIncomeCategories] = useState<IncomeCategory[]>(
    []
  );
  const [showCreateIncomeDialog, setShowCreateIncomeDialog] = useState(false);

  const toggleShowIncomeDialog = () => {
    setShowCreateIncomeDialog(!showCreateIncomeDialog);
  };

  useEffect(() => {
    const getAllIncomes = async () => {
      const response = await fetch("http://localhost:3001/incomes");
      const data = await response.json();
      setAllIncomes(data);
    };
    getAllIncomes();
  }, []);

  useEffect(() => {
    const getIncomeSum = async () => {
      const response = await fetch("http://localhost:3001/incomes-sum");
      const data = await response.json();
      setIncomeSum(data);
    };
    getIncomeSum();
  }, []);

  useEffect(() => {
    const getIncomesCategories = async () => {
      const response = await fetch("http://localhost:3001/income-categories");
      const data = await response.json();
      setIncomeCategories(data);
    };
    getIncomesCategories();
  }, []);

  // const sumAllIncomesAmount = allIncomes.reduce(
  //   (accumulator, currentValue) => accumulator + currentValue.amount,
  //   0
  // );

  // console.log(sumAllIncomesAmount);

  return (
    <div className="income-container">
      <div>
        <h2>Incomes</h2>
        <button onClick={toggleShowIncomeDialog}> + </button>
        {showCreateIncomeDialog && (
          <CreateIncome
            showDialog={showCreateIncomeDialog}
            setShowDialog={setShowCreateIncomeDialog}
          />
        )}
      </div>
      <div className="income-container">
        {incomeSum.map((summary) => {
          const incCategory = incomeCategories.find(
            (cat) => cat.id === summary.incomeCategoryId
          );
          return (
            <div key={summary.incomeCategoryId} className="income-content">
              <p className="income-icon-name">
                {incCategory && (
                  <p className="income-icon-name">
                    <p className="income-icon">{incCategory.icon}</p>
                    <p className="income-name">{incCategory.name}</p>
                  </p>
                )}
              </p>
              <p className="income-amount">{summary.amount} €</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default IncomeComponent;
