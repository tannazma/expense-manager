import Link from "next/link";
import { useRouter } from "next/router";
import useToken from "../hooks/useToken";
import useFetchUser from "../hooks/useFetchUser";

const NavBar = () => {
  const user = useFetchUser();
  const token = useToken();
  const router = useRouter();

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <nav className="flex flex-row justify-between items-center bg-violet-300 pl-6">
      <Link href="/" className="">
        <h1 className="text-purple-700 text-l font-semibold cursor-pointer">
          Expense Manager
        </h1>
      </Link>
      <div className="pr-8">
        {token && user ? (
          <div className="flex px-2 py-2">
            <div className="flex flex-row items-center text-xs mr-3">Hello {user.username}</div>
            <Link
              href="/logout"
              className="flex items-center bg-purple-500 text-xs hover:bg-purple-700 text-white font-semibold py-1 px-1 roundedbg-violet-200s  hover:text-white border border-purple-500 hover:border-transparent rounded align-center"
              id="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </Link>
          </div>
        ) : (
          <div className=" flex flex-row justify-between items-center gap-3 ">
            <Link
              href="/login"
              className="bg-violet-200 hover:bg-purple-500 text-purple-700 font-semibold hover:text-white py-2 px-4 border border-purple-500 hover:border-transparent rounded m-2 align-right"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-purple-500 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
