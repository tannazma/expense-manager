import { useEffect, useState } from "react";

const useIsRendered = () => {
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    setIsRendered(true);
  }, []);

  return isRendered;
};
export default useIsRendered;
