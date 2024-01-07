import { useState } from "react";
import ExpenseComponent from "./ExpenseComponent";
import IncomeComponent from "./IncomeComponent";
import SelectedAccountContext from "./SelectedAccountContext";
import useFetchAccounts from "../pages/hooks/useFetchAccounts";
import NavBar from "./NavBar";
import useBalance from "@/pages/hooks/useBalance";
import AccountsList from "./AccountsList";

const Home = () => {
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
    await fetch("http://localhost:3001/accounts", {
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

  return (
    <div>
      <NavBar />
      <div className="flex gap-6 bg-violet-200 p-1 pl-7 mb-3 items-center px-2 py-2">
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
              ? " text-xs font-semibold"
              : " bg-purple-100 rounded text-purple-600 text-xs font-semibold "
          }`}
        >
          All
        </button>
        <button
          className="text-xs hover:text-violet-600 font-bold text-purple-900 bg-violet-100 border border-violet-800 px-1 py-1 rounded"
          onClick={toggleShowExpenseDialog}
        >
          Create New Account
        </button>
        {showCreateExpenseDialog && (
          <form onSubmit={handleCreateAccount}>
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
            <button
              className="hover:text-violet-600 font-semibold text-xs hover:bg-violet-300 text-white bg-violet-800 ml-3 px-1 py-1 rounded"
              type="submit"
            >
              Create
            </button>
            <button
              className="hover:text-white font-semibold text-xs hover:bg-violet-800 text-violet-600 bg-violet-100 ml-3 px-1 py-1 rounded"
              type="submit"
            >
              Cancel
            </button>
          </form>
        )}
      </div>
      {balance > 1000 && (
        <>
          <h2 className="text-l pl-6">
            Balance:
            <span className="text-green-600"> {balance}</span>
          </h2>
          <p className="bg-green-100 border rounded border-green-800 text-xs text-green-900 pl-7 pt-2 pb-2 w-[500px] ml-7 mt-3">
            <span className="text-xs mr-2">😍 </span>Great job! You&apos;re on
            track with your finances!
          </p>
        </>
      )}
      {balance <= 1000 && balance > 500 && (
        <>
          <h2 className=" text-l pl-7 ">
            Balance:
            <span className="text-yellow-600 font-semibold">{balance}</span>
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
            <span className="text-xs mr-2">⛔ </span> Warning! You have low
            funds! Consider saving more.
          </p>
        </>
      )}
      <div className="flex flex-wrap gap-20 p-7 mb-5">
        <SelectedAccountContext.Provider value={selectedAccountId}>
          <ExpenseComponent refetchBalance={refetchBalance} />
          <IncomeComponent refetchBalance={refetchBalance} />
        </SelectedAccountContext.Provider>
      </div>
    </div>
  );
};
export default Home;
