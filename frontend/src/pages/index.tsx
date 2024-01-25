import useFetchUser from "../hooks/useFetchUser";
import Home from "../components/Home";
export default function Index() {
  const user = useFetchUser();
  if (!user) {
    
  }
  return <div>{user && <Home />}</div>;
}
