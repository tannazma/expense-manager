import Link from "next/link";
import { useRouter } from "next/router";
import { useToken } from "../hooks/useToken";

const NavBar = () => {
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
        {token && <p className="mb-3">Hello</p>}
        <Link
          href="/register"
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          Register
        </Link>
        {token ? (
          <a
            href="/logout"
            className="bg-transparent hover:bg-purple-500 text-purple-700 font-semibold hover:text-white py-2 px-4 border border-purple-500 hover:border-transparent rounded m-2 align-right"
            id="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </a>
        ) : (
          <div className="bg-transparent hover:bg-purple-500 text-purple-700 font-semibold hover:text-white py-2 px-4 border border-purple-500 hover:border-transparent rounded m-2 align-right">
            <Link href="/login">Login</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
