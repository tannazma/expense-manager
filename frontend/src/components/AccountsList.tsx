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
          className="hover:text-violet-600 font-semibold text-purple-900"
        >
          {editingAccountId === account.id ? (
            <>
              <input
                value={editingAccountName}
                onInput={(e) =>
                  setEditingAccountName((e.target as HTMLInputElement).value)
                }
              />
              <button onClick={handleSaveEditAccount}>save</button>
              <button onClick={cancelEdit}>cancel</button>
            </>
          ) : (
            <button
              onClick={() => {
                setSelectedAccount(account.id);
                setEditingAccountId(null);
              }}
            >
              {account.name}
            </button>
          )}
          {selectedAccountId === account.id && !editingAccountId ? (
            <>
              <button
                className="ml-2"
                onClick={() => {
                  setEditingAccountId(account.id);
                  setEditingAccountName(account.name);
                }}
              >
                edit
              </button>
              <button
                className="ml-2"
                onClick={() => handleDeleteAccount(account.id)}
              >
                delete
              </button>
            </>
          ) : null}
        </div>
      ))}
    </>
  );
}
