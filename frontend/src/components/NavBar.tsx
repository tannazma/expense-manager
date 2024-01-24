import Link from "next/link";
import { useRouter } from "next/router";
import useToken from "../hooks/useToken";
import useFetchUser from "../hooks/useFetchUser";
import PrimaryButton from "./PrimaryButton";
import { useContext } from "react";
import ThemeContext from "./ThemeContext";
import SecondaryButton from "./SecondaryButton";
import { ThemeSwitcher } from "./ThemeSwitcher";

const NavBar = () => {
  const user = useFetchUser();
  const token = useToken();
  const router = useRouter();

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem("token");
    router.push("/login");
  };

  let headerColor = "text-purple-700 bg-violet-300";
  const { theme } = useContext(ThemeContext);

  if (theme === "red") {
    headerColor = "text-red-700 bg-red-300";
  } else if (theme === "green") {
    headerColor = "text-green-700 bg-green-300";
  } else if (theme === "blue") {
    headerColor = "text-blue-700 bg-blue-300";
  } else if (theme === "dark") {
    headerColor = "text-gray-700 bg-gray-300";
  }

  return (
    <nav
      className={`${headerColor} flex flex-row justify-between items-center pl-6`}
    >
      <Link href="/" className="">
        <h1 className={`${headerColor} text-l font-semibold cursor-pointer`}>
          Expense Manager
        </h1>
      </Link>
      <div className="pr-8 flex items-center">
        <ThemeSwitcher />
        {token && user ? (
          <div className="flex px-2 py-2">
            <div className="flex flex-row items-center text-xs mr-3">
              Hello {user.username}
            </div>
            <Link href="/logout" id="logout-btn" className="pr-2">
              <div className="pr-0">

              <PrimaryButton onClick={handleLogout}>Logout</PrimaryButton>
              </div>
            </Link>
          </div>
        ) : (
          <div className=" flex flex-row justify-between items-center gap-3 ">
            <PrimaryButton>
              <Link href="/login">Login</Link>
            </PrimaryButton>
            <SecondaryButton>
              <Link href="/register">Register</Link>
            </SecondaryButton>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
