import { useState } from "react";
import ExpenseComponent from "./components/ExpenseComponent";
import IncomeComponent from "./components/IncomeComponent";
import { SelectedAccountContext } from "./components/SelectedAccountContext";
import { useFetchAccounts } from "./hooks/useFetchAccounts";
import { useFetchUser } from "./hooks/useFetchUser";

export default function Home() {
  const user = useFetchUser();
  const [selectedAccountId, setSelectedAccount] = useState(0);
  const accounts = useFetchAccounts();

  return (
    <div>
      {user && <h1>Hello {user.username}</h1>}
      <div className="flex gap-6">
        {accounts?.map((account) => (
          <button
            key={account.id}
            onClick={() => setSelectedAccount(account.id)}
          >
            {account.name}
          </button>
        ))}
        <button onClick={() => setSelectedAccount(0)}>All</button>
      </div>
      <div className="expense-income-container">
        <SelectedAccountContext.Provider value={selectedAccountId}>
          <ExpenseComponent />
          <IncomeComponent />
        </SelectedAccountContext.Provider>
      </div>
    </div>
  );
}
