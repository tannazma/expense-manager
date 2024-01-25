import { useEffect, useState } from "react";
import { User } from "../../types";
import { useRouter } from "next/router";

const useFetchUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    const getUser = async () => {
      console.log("getting user")
      const token = localStorage.getItem("token")
      if (!token) {
        if (router.pathname !== "/register") {
        router.push("/login");
        }
        return
      }
      else {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVERURL}/user`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        console.log(router.pathname)
        if (router.pathname !== "/register") {
          router.push("/login");
        }
      }
    }
    };
    getUser()
  //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return user;
};
export default useFetchUser;
