import { useContext, useState } from "react";
import ExpenseComponent from "./ExpenseComponent";
import IncomeComponent from "./IncomeComponent";
import SelectedAccountContext from "./SelectedAccountContext";
import NavBar from "./NavBar";
import useBalance from "../hooks/useBalance";
import ThemeContext from "./ThemeContext";
import FilterContext from "./FilterContext";
import FilterDateComponent from "./FilterDateComponent";
import { Toaster } from "react-hot-toast";
import AccountComponent from "./AccountComponent";

const Home = () => {
  const [dateFilter, setDateFilter] = useState<{
    from: string;
    to: string;
  } | null>(null);
 
  const { balance, setSelectedAccount, selectedAccountId, refetchBalance } =
    useBalance();


  return (
    <FilterContext.Provider value={{ dateFilter, setDateFilter }}>
      <div>
        <NavBar />
        <AccountComponent />
        <div className="flex justify-between">
          <div className="flex flex-col">
            {balance > 1000 && (
              <>
                <h2 className="text-l pl-6">
                  Balance:
                  <span className="text-green-600"> {balance}</span>
                </h2>
                <p className="bg-green-100 border rounded border-green-800 text-xs text-green-900 pl-7 pt-2 pb-2 w-[500px] ml-7 mt-3">
                  <span className="text-xs mr-2">😍 </span>Great job!
                  You&apos;re on track with your finances!
                </p>
              </>
            )}
            {balance <= 1000 && balance > 500 && (
              <>
                <h2 className=" text-l pl-7 ">
                  Balance:
                  <span className="text-yellow-600 font-semibold">
                    {balance}
                  </span>
                </h2>
                <p className="border-yellow-500 border text-xs rounded bg-yellow-50 text-yellow-700 pl-7 pt-2 pb-2 w-[500px] ml-7 mt-3">
                  <span className="text-xs mr-2">🚧 </span>Watch out! Consider
                  limiting your spendings!
                </p>
              </>
            )}
            {balance <= 500 && (
              <>
                <h2 className="text-l pl-7">
                  Balance: <span className="text-red-600">{balance}</span>
                </h2>
                <p className="bg-red-100 border text-xs rounded border-red-500 text-red-900 pl-7 pt-2 pb-2 w-[500px] ml-7 mt-3">
                  <span className="text-xs mr-2">⛔ </span> Warning! You have
                  low funds! Consider saving more.
                </p>
              </>
            )}
          </div>
          <div className="flex items-end">
            <FilterDateComponent />
          </div>
        </div>
        <div className="flex flex-wrap gap-20 p-7 mb-5">
          <SelectedAccountContext.Provider value={selectedAccountId}>
            <ExpenseComponent refetchBalance={refetchBalance} />
            <IncomeComponent refetchBalance={refetchBalance} />
          </SelectedAccountContext.Provider>
        </div>
      </div>
      <Toaster />
    </FilterContext.Provider>
  );
};
export default Home;
