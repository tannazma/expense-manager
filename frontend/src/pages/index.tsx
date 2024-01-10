import useFetchUser from "../hooks/useFetchUser";
import Login from "./login";
import Home from "../components/Home";
import Link from "next/link";
import { useContext } from "react";
import ThemeContext from "@/components/ThemeContext";

export default function Index() {
  const user = useFetchUser();
  const { theme } = useContext(ThemeContext);

  let navbarBackgroundColor = "bg-violet-200";
  if (theme === "red") {
    navbarBackgroundColor = "bg-red-200";
  } else if (theme === "green") {
    navbarBackgroundColor = "bg-green-200";
  } else if (theme === "blue") {
    navbarBackgroundColor = "bg-blue-200";
  } else if (theme === "dark") {
    navbarBackgroundColor = "bg-gray";
  }

  return (
      <div>
        {user ? (
          <>
            <Home />
          </>
        ) : (
          <div
            //does nothing
            className={`${navbarBackgroundColor}  min-h-screen flex flex-col justify-center items-center`}
          >
            <h1 className="text-center text-xl text-black font-bold">
              Ready to explore? Log in and lets get started! <span>👇</span>
            </h1>
            <div className="flex flex-1 text-center text-l text-black font-semibold">
              Don&apos;t have an account yet?
              <div>
                <Link href={"/register"} className="text-purple-500 pl-2">
                  Click Here to sign up
                </Link>
              </div>
            </div>
            <Login />
          </div>
        )}
      </div>
  );
}
