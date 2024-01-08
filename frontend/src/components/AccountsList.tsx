import { useState } from "react";
import { Account } from "../../types";

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

  return (
    <>
      {accounts.map((account) => (
        <div
          key={account.id}
          className="hover:text-violet-600 text-purple-900 text-xs font-semibold"
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
              <button
                onClick={handleSaveEditAccount}
                className="ml-2 hover:text-violet-800 text-xs font-medium text-purple-900"
              >
                Save
              </button>
              <button
                onClick={cancelEdit}
                className="ml-2 hover:text-violet-600 text-xs text-purple-900 bg-violet-100 border border-violet-800 px-1 py-1 rounded"
              >
                Cancel
              </button>
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
              <button
                className="ml-2 hover:text-violet-600 text-xs text-purple-900 bg-violet-100 border border-violet-800 px-1 py-1 rounded"
                onClick={() => handleDeleteAccount(account.id)}
              >
                Delete
              </button>
            </>
          ) : null}
        </div>
      ))}
    </>
  );
}
