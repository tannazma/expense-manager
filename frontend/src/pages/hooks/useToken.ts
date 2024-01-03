import { useEffect, useState } from "react";

function useToken() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Retrieve the JWT token from localStorage and set it in the component's state
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  return token;
}
export default useToken;
