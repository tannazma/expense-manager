import useFetchUser from "./hooks/useFetchUser";
import Login from "./login";
import Home from "../components/Home";
import Link from "next/link";
import { ThemeProvider } from "../components/ThemeProvider";
import { ThemeSwitcher } from "../components/ThemeSwitcher";

export default function Index() {
  const user = useFetchUser();
  return (
    <ThemeProvider>
      <div>
        {user ? (
          <>
            <Home />
            <ThemeSwitcher />
          </>
        ) : (
          <div className="min-h-screen flex flex-col justify-center items-center bg-violet-200 pt-10 ">
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
    </ThemeProvider>
  );
}
