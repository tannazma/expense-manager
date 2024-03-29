import { useCallback, useContext, useEffect, useState } from "react";
import { Income, IncomeCategory } from "../../../../../../types";
import { useRouter } from "next/router";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
} from "recharts";
import NavBar from "@/components/NavBar";
import ThemeContext from "@/components/ThemeContext";
import { AlertDialogDemo } from "../../../../../components/AlertDialog";
import AccountComponent from "@/components/AccountComponent";
import PrimaryButton from "@/components/PrimaryButton";
import SecondaryButton from "@/components/SecondaryButton";

interface ChartDataType {
  date: string;
  amount: number;
}

const IncomesFromAcountFromCategory = () => {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const router = useRouter();
  const [incomeAmount, setIncomeAmount] = useState("");
  const [selectedIncomeCategoryId, setSelectedIncomeCategoryId] = useState("");
  const [incomeDetails, setIncomeDetails] = useState("");
  const [incomeDate, setIncomeDate] = useState("");
  const [incomeCategories, setIncomeCategories] = useState<
    IncomeCategory[] | null
  >(null);
  const [chartData, setChartData] = useState<ChartDataType[]>([]);
  const { theme } = useContext(ThemeContext);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // new state variable for controlling the dialog
  const accountIdFromUrl = Number(router.query.accountId);
  const categoryIdFromUrl = Number(router.query.incomeCategoryId);

  let firstButtonClass =
    "border-purple-500 bg-violet-100 hover:bg-purple-500 text-purple-700";
  let secondButtonClass =
    " bg-purple-500 hover:bg-purple-700 border-purple-500";
  let entryBackgroundColorClass = "bg-violet-300";
  if (theme === "red") {
    firstButtonClass =
      "border-red-500 bg-red-100 hover:bg-red-500 text-red-700 ";
    secondButtonClass = "bg-red-500 hover:bg-red-700 border-red-500";
    entryBackgroundColorClass = "bg-red-300";
  } else if (theme === "green") {
    firstButtonClass =
      "border-green-500 bg-green-100 hover:bg-green-500 text-green-700";
    secondButtonClass = "bg-green-500 hover:bg-green-700 border-green-500";
    entryBackgroundColorClass = "bg-green-300";
  } else if (theme === "blue") {
    firstButtonClass =
      "border-blue-500 bg-blue-100 hover:bg-blue-500 text-blue-700";
    secondButtonClass = "bg-blue-500 hover:bg-blue-700 border-blue-500";
    entryBackgroundColorClass = "bg-blue-300";
  } else if (theme === "dark") {
    firstButtonClass =
      "border-gray-500 bg-gray-500 hover:bg-gray-300 text-gray-300";
    secondButtonClass = "bg-gray-500 hover:bg-gray-700 border-gray-500";
    entryBackgroundColorClass = "bg-gray-300";
  }

  const fetchIncomesFromCategory = useCallback(async () => {
    // Check if accountId is not null
    if (accountIdFromUrl !== null && !isNaN(categoryIdFromUrl)) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVERURL}/accounts/${accountIdFromUrl}/category/${categoryIdFromUrl}/incomes`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      const data = await response.json();
      if (data[0]) {
        setSelectedIncomeCategoryId(data[0].id);
      }
      setIncomes(data);

      const chartData: ChartDataType[] = data.map((income: Income) => ({
        // format the date as MM-DD
        date:
          new Date(income.date).getMonth() +
          1 +
          "/" +
          new Date(income.date).getDate(),
        amount: income.amount,
      }));

      setChartData(chartData);
    }
  }, [accountIdFromUrl, categoryIdFromUrl]);

  useEffect(() => {
    const fetchAllIncomeCategories = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVERURL}/income-categories`
      );
      const data = await response.json();
      setIncomeCategories(data);
      if (data[0]) {
        setSelectedIncomeCategoryId(data[0].id);
      }
    };
    if (router.isReady) {
      fetchAllIncomeCategories();
      fetchIncomesFromCategory();
    }
  }, [router, categoryIdFromUrl, accountIdFromUrl, fetchIncomesFromCategory]);

  useEffect(() => {
    const getIncomesFromCategories = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVERURL}/category/${categoryIdFromUrl}/incomes`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      const data = await response.json();
      setIncomes(data);

      const chartData: ChartDataType[] = data.map((income: Income) => ({
        // format the date as MM-DD
        date:
          new Date(income.date).getMonth() +
          1 +
          "/" +
          new Date(income.date).getDate(),
        amount: income.amount,
      }));

      setChartData(chartData);
    };
    getIncomesFromCategories();
  }, [categoryIdFromUrl]);

  if (isNaN(categoryIdFromUrl)) {
    return <div>Income not found</div>;
  }

  const handleDeleteIncome = (incomeId: number) => {
    if (!Number.isInteger(incomeId)) {
      console.error("Invalid incomeCategoryId:", incomeId);
      return;
    }
    fetch(`${process.env.NEXT_PUBLIC_SERVERURL}/incomes/${incomeId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          // throw new Error("Network income was not ok");
          alert("nothing here");
          // fetchExpensesFromCategory();
          setIsDialogOpen(false);
        }
        // Refetch the incomes after successfully deleting an expense
        fetchIncomesFromCategory();
        setIsDialogOpen(false);
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch incomes:",
          error
        );
        // setIsEditMode(false);
      });
  };

  const handleEditIncome = (incomeId: number) => {
    const incomeToEdit = incomes.find((income) => income.id === incomeId);
    if (incomeToEdit) {
      setIncomeAmount(incomeToEdit.amount.toString());
      setSelectedIncomeCategoryId(incomeToEdit.incomeCategoryId.toString());
      setIncomeDetails(incomeToEdit.details);
      setIncomeDate(incomeToEdit.date.toString());
      setIsEditMode(true);
    }
  };

  const handleUpdateIncome = async (
    incomeId: number,
    event: React.FormEvent
  ) => {
    event.preventDefault();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVERURL}/incomes/${incomeId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number(incomeAmount),
          incomeCategoryId: Number(selectedIncomeCategoryId),
          details: incomeDetails,
          date: new Date(incomeDate).toISOString(),
        }),
      }
    );
    if (response.ok) {
      const updatedIncome = await response.json();
      setIncomes((prevIncomes) =>
        prevIncomes.map((income) =>
          income.id === incomeId ? updatedIncome : income
        )
      );
      setIsEditMode(false);
    }
  };

  return (
    <div>
      <NavBar />
      <AccountComponent />
      <div className="pt-10">
        <LineChart
          width={300}
          height={300}
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="5 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} height={90} />
          <YAxis tick={{ fontSize: 12 }} height={90} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#8884d8"
            animationDuration={1000}
          />
        </LineChart>
      </div>
      {incomes.length > 0 ? (
        <div className="flex flex-1 flex-col gap-3 text-xs p-3 pt-10">
          {incomes
            .sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1))
            .map((income) => (
              <div
                key={income.id}
                className={`${entryBackgroundColorClass} p-5 shadow-xl rounded-md`}
              >
                <div className="flex flex-col">
                  <div className="flex justify-between items-center pb-6">
                    <div className="flex">
                      <span className="mr-2">
                        {income.incomeCategory?.icon}
                      </span>
                      <p className="pr-2 font-bold">
                        {income.incomeCategory?.name}
                      </p>
                    </div>
                    <div>
                      <p>{new Date(income.date).toUTCString()}</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <p className="pb-2">
                      <span className="font-semibold">Amount:</span>
                      <span> {income.amount} €</span>
                    </p>
                    <div>
                      <span className="font-semibold">Details: </span>
                      <span>
                        {income.details ? income.details : "No details yet"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-5 pt-2">
                  <PrimaryButton onClick={() => setIsDialogOpen(true)}>
                    Delete
                  </PrimaryButton>
                  {isDialogOpen && (
                    <AlertDialogDemo
                      isOpen={isDialogOpen}
                      onContinue={() => handleDeleteIncome(income.id)}
                      onCancel={() => setIsDialogOpen(false)}
                    />
                  )}
                  <SecondaryButton onClick={() => handleEditIncome(income.id)}>
                    Edit
                  </SecondaryButton>
                </div>

                {isEditMode && (
                  <div
                    className="h-screen place-items-center w-screen modal transition-all-1s fixed top-0 left-0 right-0 bottom-0 z-50 gap-2 grid bg-black bg-opacity-30 items-center text-center justify-center"
                    style={{
                      display: isEditMode ? "grid" : "none",
                      opacity: isEditMode ? 1 : 0,
                    }}
                  >
                    <form
                      onSubmit={(event) => handleUpdateIncome(income.id, event)}
                      className={`${entryBackgroundColorClass} p-10 rounded relative flex flex-col gap-5`}
                    >
                      <label>
                        Amount:
                        <input
                          type="number"
                          value={incomeAmount}
                          onChange={(e) => setIncomeAmount(e.target.value)}
                          className="min-w-[500px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset"
                        />
                      </label>
                      <label>
                        Category:
                        <select
                          id="category"
                          name="category"
                          value={selectedIncomeCategoryId}
                          onChange={(e) =>
                            setSelectedIncomeCategoryId(e.target.value)
                          }
                          className="min-w-[500px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset"
                        >
                          {incomeCategories &&
                            incomeCategories.map((entryCat) => {
                              return (
                                <option key={entryCat.id} value={entryCat.id}>
                                  {entryCat.icon}
                                  {entryCat.name}
                                </option>
                              );
                            })}
                        </select>
                      </label>
                      <label>
                        Details:
                        <input
                          type="text"
                          value={incomeDetails}
                          onChange={(e) => setIncomeDetails(e.target.value)}
                          className="min-w-[500px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                        />
                      </label>
                      <label>
                        date:
                        <input
                          type="date"
                          value={incomeDate}
                          onChange={(e) => setIncomeDate(e.target.value)}
                          className="min-w-[500px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                        />
                      </label>
                      <button
                        type="submit"
                        className={`${secondButtonClass} text-white font-bold py-2 px-4 roundedbg-violet-200s hover:text-white border hover:border-transparent rounded align-right`}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditMode(false)}
                        className={`${firstButtonClass}font-bold py-2 px-4 roundedbg-violet-200s hover:text-white border hover:border-transparent rounded align-right`}
                      >
                        Close
                      </button>
                    </form>
                  </div>
                )}
              </div>
            ))}
        </div>
      ) : (
        <div>Incomes with the categoryId not found...</div>
      )}
    </div>
  );
};
export default IncomesFromAcountFromCategory;
