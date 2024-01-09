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
    await fetch(`http://localhost:3001/accounts/${editingAccountId}/edit`, {
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
        `http://localhost:3001/accounts/${accountId}`,
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
  let navbarTextColor = "hover:text-violet-600 text-purple-900";

  if (theme === "red") {
    navbarTextColor = "hover:text-red-600 text-red-900";
  } else if (theme === "green") {
    navbarTextColor = "hover:text-green-600 text-green-900";
  } else if (theme === "blue") {
    navbarTextColor = "hover:text-blue-600 text-blue-900";
  } else if (theme === "dark") {
    navbarTextColor = "hover:text-gray-600 text-gray-900";
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
              className={`border-b bg  ${
                selectedAccountId !== account.id
                  ? "border-b-0 "
                  : "px-2 py-2 bg-purple-100 rounded text-purple-600 font-semibold"
              }`}
            >
              {account.name}
            </button>
          )}
          {selectedAccountId === account.id && !editingAccountId ? (
            <>
              <button
                className="ml-2 hover:text-violet-800 text-xs font-medium text-purple-900"
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
