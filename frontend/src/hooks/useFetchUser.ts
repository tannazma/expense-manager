import { useEffect, useState } from "react";
import { User } from "../../types";

const useFetchUser = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVERURL}/user`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      }
    };
    getUser();
  }, []);
  return user;
};
export default useFetchUser;
