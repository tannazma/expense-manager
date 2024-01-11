import useFetchUser from "../hooks/useFetchUser";
import Home from "../components/Home";
export default function Index() {
  const user = useFetchUser();

  console.log(user);

  return <div>{user && <Home />}</div>;
}
