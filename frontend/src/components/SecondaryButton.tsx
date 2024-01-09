import { useContext } from "react";
import ThemeContext from "./ThemeContext";

const SecondaryButton = ({ children, onClick }) => {
  const { theme } = useContext(ThemeContext);

  let secondaryBackgroundColorClass = `text-purple-700 hover:bg-purple-500 hover:bg-purple-500 border-purple-500`;

  if (theme === "red") {
    secondaryBackgroundColorClass =
      "text-red-700 hover:bg-red-500 hover:bg-red-500 border-red-500";
  } else if (theme === "green") {
    secondaryBackgroundColorClass =
      "text-green-700 hover:bg-green-500 hover:bg-green-500 border-green-500";
  } else if (theme === "blue") {
    secondaryBackgroundColorClass =
      "text-blue-700 hover:bg-blue-500 hover:bg-blue-500 border-blue-500";
  } else if (theme === "dark") {
    secondaryBackgroundColorClass =
      "text-white hover:bg-gray-500 hover:bg-gray-500 border-gray-500";
  }

  return (
    <button
      className={`${secondaryBackgroundColorClass} text-xs items-center flex gap-2 bg-transparent font-semibold hover:text-white py-1 px-2 border hover:border-transparent rounded m-2`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
export default SecondaryButton;
