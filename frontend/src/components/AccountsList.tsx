import { useContext, useState } from "react";
import { Account } from "../../types";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";
import ThemeContext from "./ThemeContext";

type Props = {
  accounts: Account[];
  refetchAccounts: () => Promise<void>;
  selectedAccountId: number;
  setSelectedAccount: (accountId: number) => void;
};

export default function AccountsList({
  accounts,
  refetchAccounts,
  selectedAccountId,
  setSelectedAccount,
}: Props) {
  const [editingAccountId, setEditingAccountId] = useState<number | null>(null);
  const [editingAccountName, setEditingAccountName] = useState("");

  function cancelEdit() {
    setEditingAccountId(null);
    setEditingAccountName("");
  }

  async function handleSaveEditAccount() {
    await fetch(`${process.env.NEXT_PUBLIC_SERVERURL}/accounts/${editingAccountId}/edit`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newName: editingAccountName }),
    });
    await refetchAccounts();
    cancelEdit();
  }

  async function handleDeleteAccount(accountId: number) {
    if (!Number.isInteger(accountId)) {
      console.error("Invalid accountId:", accountId);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVERURL}/accounts/${accountId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      await refetchAccounts();
    } catch (error) {
      console.error("There has been a problem with deleting account:", error);
    }
  }

  const { theme } = useContext(ThemeContext);
  let navbarTextColor = "text-purple-900 hover:text-violet-600 ";
  let accountBackgroundColor =
    "bg-white hover:text-violet-600 text-purple-600";

  if (theme === "red") {
    navbarTextColor = "text-red-900";
    accountBackgroundColor = "bg-red-100 hover:text-red-600  text-red-600";
  } else if (theme === "green") {
    navbarTextColor = "text-green-900";
    accountBackgroundColor =
      "bg-green-100 hover:text-green-600  text-green-600";
  } else if (theme === "blue") {
    navbarTextColor = " text-blue-900";
    accountBackgroundColor = "bg-blue-100 hover:text-blue-600 text-blue-600";
  } else if (theme === "dark") {
    navbarTextColor = "text-gray-900";
    accountBackgroundColor = "bg-gray-100 hover:text-gray-600 text-gray-600";
  }

  return (
    <>
      {accounts.map((account) => (
        <div
          key={account.id}
          className={`${navbarTextColor} text-xs font-semibold flex items-center`}
        >
          {editingAccountId === account.id ? (
            <>
              <input
                value={editingAccountName}
                onInput={(e) =>
                  setEditingAccountName((e.target as HTMLInputElement).value)
                }
                className="px-1 py-1"
              />
              <SecondaryButton onClick={handleSaveEditAccount}>
                Save
              </SecondaryButton>
              <SecondaryButton onClick={cancelEdit}>Cancel</SecondaryButton>
            </>
          ) : (
            <button
              onClick={() => {
                setSelectedAccount(account.id);
                setEditingAccountId(null);
              }}
              className={`bg  ${
                selectedAccountId !== account.id
                  ? "border-b-0"
                  : `${accountBackgroundColor} px-2 py-2 rounded font-semibold`
              }`}
            >
              {account.name}
            </button>
          )}
          {selectedAccountId === account.id && !editingAccountId ? (
            <>
              <button
                className={`${navbarTextColor} ml-2 text-xs font-medium`}
                onClick={() => {
                  setEditingAccountId(account.id);
                  setEditingAccountName(account.name);
                }}
              >
                Edit
              </button>
              <PrimaryButton onClick={() => handleDeleteAccount(account.id)}>
                Delete
              </PrimaryButton>
            </>
          ) : null}
        </div>
      ))}
    </>
  );
}
