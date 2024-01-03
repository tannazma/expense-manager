import { useState } from "react";
import ExpenseComponent from "./ExpenseComponent";
import IncomeComponent from "./IncomeComponent";
import SelectedAccountContext from "./SelectedAccountContext";
import useFetchAccounts from "../pages/hooks/useFetchAccounts";
import NavBar from "./NavBar";

const Home = () => {
  const [selectedAccountId, setSelectedAccount] = useState(0);
  const accounts = useFetchAccounts();
  return (
    <div>
      <NavBar />
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
};
export default Home;
