import useBalance from "@/hooks/useBalance";
import AccountsList from "./AccountsList";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";
import useFetchAccounts from "../hooks/useFetchAccounts";
import { useContext, useState } from "react";
import ThemeContext from "./ThemeContext";
import { useRouter } from "next/router";

const AccountComponent = () => {
  const router = useRouter()
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

    setAccountName("");
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
      className={`${accountColor} flex flex-col gap-3 min-h-[80px] p-1 pl-7 mb-3 items-start px-1 py-1 md:flex-row md:items-center`}
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
        onClick={() => {
          setSelectedAccount(0);
          const path = {
            pathname: router.pathname, // keep the same page
            query: {
              ...router.query,
              accountName: 'all',
              accountId: 0,
            }, // keep existing query parameters and add/replace accountname
          };
          router.push(path, undefined, { shallow: true }); // change the URL without triggering data re-fetch
        }}
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
        New Account
      </SecondaryButton>
      {showCreateExpenseDialog && (
        <form
          onSubmit={handleCreateAccount}
          className="flex items-end md:items-center"
        >
          <label className="text-xs flex flex-col md:flex-row md:flex-row-reverse md:items-center md:h-[50px]">
            Account name
            <input
              id="accountName"
              name="accountName"
              value={accountName}
              className="mr-3 px-1 py-1"
              onChange={(e) => setAccountName(e.target.value)}
            />
          </label>

          <PrimaryButton type="submit">Create</PrimaryButton>
          <SecondaryButton>Cancel</SecondaryButton>
        </form>
      )}
    </div>
  );
};
export default AccountComponent;
