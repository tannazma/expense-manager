import { useContext } from "react";
import ThemeContext from "./ThemeContext";

const PrimaryButton = ({ onClick, children }) => {
  const { theme } = useContext(ThemeContext);
  let primaryBackgroundColorClass = `bg-purple-500`;
  let borderColorClass = `bg-purple-800`;
  let secondaryBackgroundColorClass = `bg-purple-700`;
  if (theme === "red") {
    primaryBackgroundColorClass = "bg-red-500";
    secondaryBackgroundColorClass = "bg-red-800";
    borderColorClass = `border-red-500`;
  }
  return (
    <button
      className={`${primaryBackgroundColorClass} text-xs hover:${secondaryBackgroundColorClass} text-white font-semibold hover:text-white py-2 px-4 border ${borderColorClass} hover:border-transparent rounded m-2 align-right`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
export default PrimaryButton;
