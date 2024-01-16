import useFetchUser from "../hooks/useFetchUser";
import Home from "../components/Home";
export default function Index() {
  const user = useFetchUser();

  return <div>{user && <Home />}</div>;
}
