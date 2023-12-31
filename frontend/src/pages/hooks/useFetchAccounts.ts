import { useEffect, useState } from "react";
import { Account } from "../../../types";

export const useFetchAccounts = () => {
  const [accounts, setAccounts] = useState<Account[] | null>(null);

  useEffect(() => {
    const getAllAccounts = async () => {
      const response = await fetch("http://localhost:3001/accounts");
      const data = await response.json();
      setAccounts(data);
    };
    getAllAccounts();
  }, []);
  return accounts;
};
