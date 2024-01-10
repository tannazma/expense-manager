import { useEffect, useState } from "react";
import { Account } from "../../types";

const useFetchAccounts = () => {
  const [accounts, setAccounts] = useState<Account[] | null>(null);

  async function refetchAccounts() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVERURL}/accounts`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    const data = await response.json();
    setAccounts(data);
  }

  useEffect(() => {
    refetchAccounts();
  }, []);

  return { accounts, refetchAccounts };
};
export default useFetchAccounts;
