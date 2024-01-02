import Link from "next/link";
import { useRouter } from "next/router";
import { useToken } from "../hooks/useToken";
import { useFetchUser } from "../hooks/useFetchUser";

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
    <nav className="flex flex-row justify-between items-center bg-violet-300 p-5">
      <Link href="/" className="">
        <h1 className="text-purple-700 text-3xl font-bold cursor-pointer">
          Expense Manager
        </h1>
      </Link>
      <div className="pr-8">
        {token && user ? (
          <div>
            <div className="mb-3">Hello {user.username}</div>
            <Link
              href="/logout"
              className=" bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 roundedbg-violet-200s  hover:text-white border border-purple-500 hover:border-transparent rounded align-right"
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
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
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
