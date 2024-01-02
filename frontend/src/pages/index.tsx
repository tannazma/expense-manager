import { useState } from "react";
import ExpenseComponent from "./components/ExpenseComponent";
import IncomeComponent from "./components/IncomeComponent";
import { SelectedAccountContext } from "./components/SelectedAccountContext";
import { useFetchAccounts } from "./hooks/useFetchAccounts";
import { useFetchUser } from "./hooks/useFetchUser";
import NavBar from "./components/NavBar";

export default function Home() {
  const user = useFetchUser();
  const [selectedAccountId, setSelectedAccount] = useState(0);
  const accounts = useFetchAccounts();

  return (
    <div>
      <NavBar />
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
      <div className="flex flex-wrap gap-20 p-7 mb-5">
        <SelectedAccountContext.Provider value={selectedAccountId}>
          <ExpenseComponent />
          <IncomeComponent />
        </SelectedAccountContext.Provider>
      </div>
    </div>
  );
}
