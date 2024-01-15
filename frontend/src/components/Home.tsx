import { useContext, useState } from "react";
import ExpenseComponent from "./ExpenseComponent";
import IncomeComponent from "./IncomeComponent";
import SelectedAccountContext from "./SelectedAccountContext";
import useFetchAccounts from "../hooks/useFetchAccounts";
import NavBar from "./NavBar";
import useBalance from "@/hooks/useBalance";
import AccountsList from "./AccountsList";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";
import ThemeContext from "./ThemeContext";
import FilterContext from "./FilterContext";
import FilterDateComponent from "./FilterDateComponent";

const Home = () => {
  const [dateFilter, setDateFilter] = useState<{
    from: string;
    to: string;
  } | null>(null);
  const { accounts, refetchAccounts } = useFetchAccounts();
  const [showCreateExpenseDialog, setShowCreateExpenseDialog] = useState(false);
  const [accountName, setAccountName] = useState("");
  const { balance, setSelectedAccount, selectedAccountId, refetchBalance } =
    useBalance();
  const toggleShowExpenseDialog = () => {
    setShowCreateExpenseDialog(!showCreateExpenseDialog);
    fetch;
  };
  const handleCreateAccount = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    console.log("gchvjbk");
    await fetch(`${process.env.NEXT_PUBLIC_SERVERURL}/accounts`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        name: accountName,
      }),
    });

    refetchAccounts();
    setShowCreateExpenseDialog(!showCreateExpenseDialog);
  };

  const { theme } = useContext(ThemeContext);
  let accountColor = "bg-purple-100 text-purple-600";

  if (theme === "red") {
    accountColor = "bg-red-200 text-red-600";
  } else if (theme === "green") {
    accountColor = "bg-green-200 text-green-600";
  } else if (theme === "blue") {
    accountColor = "bg-blue-200 text-blue-600";
  } else if (theme === "dark") {
    accountColor = "bg-gray-600 text-gray-600";
  }

  return (
    <FilterContext.Provider value={{ dateFilter, setDateFilter }}>
      <div>
        <NavBar />
        <div
          className={`${accountColor} flex gap-3 min-h-[80px] p-1 pl-7 mb-3 items-center px-1 py-1`}
        >
          {accounts && (
            <AccountsList
              accounts={accounts}
              refetchAccounts={refetchAccounts}
              selectedAccountId={selectedAccountId}
              setSelectedAccount={setSelectedAccount}
            />
          )}
          <button
            onClick={() => setSelectedAccount(0)}
            className={`text-xs px-2 py-2${
              selectedAccountId !== 0
                ? "text-xs font-semibold text-black"
                : `${accountColor} rounded px-1 py-1 text-xs font-semibold bg-white`
            }
          }`}
          >
            All
          </button>
          <SecondaryButton onClick={toggleShowExpenseDialog}>
            Create New Account
          </SecondaryButton>
          {showCreateExpenseDialog && (
            <form onSubmit={handleCreateAccount} className="flex items-center">
              <label className="text-xs">
                <input
                  id="accountName"
                  name="accountName"
                  value={accountName}
                  className="mr-3 px-1 py-1"
                  onChange={(e) => setAccountName(e.target.value)}
                />
                Account name
              </label>

              <PrimaryButton type="submit">Create</PrimaryButton>
              <SecondaryButton type="submit">Cancel</SecondaryButton>
            </form>
          )}
        </div>
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
    </FilterContext.Provider>
  );
};
export default Home;
