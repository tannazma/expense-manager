import useBalance from "@/hooks/useBalance";
import AccountsList from "./AccountsList";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";
import useFetchAccounts from "../hooks/useFetchAccounts";
import { useContext, useState } from "react";
import ThemeContext from "./ThemeContext";

const AccountComponent = () => {
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

    setAccountName("")
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
          <SecondaryButton >Cancel</SecondaryButton>
        </form>
      )}
    </div>
  );
};
export default AccountComponent;
