import { useEffect, useState } from "react";
import { User } from "../../types";
import { useRouter } from "next/router";

const useFetchUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      console.log("HELLLLLLLLOOOOOOOOOO")
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
      } else {
        console.log(router.pathname)
        if (router.pathname !== "/register") {
          router.push("/login");
        }
      }
    };
    if (localStorage.getItem("token")) {getUser()}
    
  }, [router]);
  return user;
};
export default useFetchUser;
