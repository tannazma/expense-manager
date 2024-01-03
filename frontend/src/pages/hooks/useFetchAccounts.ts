import { useEffect, useState } from "react";
import { Account } from "../../../types";

const useFetchAccounts = () => {
  const [accounts, setAccounts] = useState<Account[] | null>(null);

  useEffect(() => {
    const getAllAccounts = async () => {
      const response = await fetch("http://localhost:3001/accounts", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const data = await response.json();
      setAccounts(data);
    };
    getAllAccounts();
  }, []);
  return accounts;
};
export default useFetchAccounts;
