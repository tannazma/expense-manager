import { useContext, ReactNode } from "react";
import ThemeContext from "./ThemeContext";

type PrimaryButtonProp = {
  onClick?: (...args: any) => any;
  children: ReactNode;
  type?: "submit";
};

const PrimaryButton = ({ onClick, children, type }: PrimaryButtonProp) => {
  const { theme } = useContext(ThemeContext);
  let primaryBackgroundColorClass = `bg-purple-500 hover:bg-purple-800 bg-purple-700`;

  if (theme === "red") {
    primaryBackgroundColorClass = "bg-red-500 hover:bg-red-800";
  } else if (theme === "green") {
    primaryBackgroundColorClass = "bg-green-500 hoverbg-green-800";
  } else if (theme === "blue") {
    primaryBackgroundColorClass = "bg-blue-500 hover:bg-blue-800";
  } else if (theme === "dark") {
    primaryBackgroundColorClass =
      "bg-gray-800 hover:bg-gray-200 hover:text-black ";
  }

  return (
    <button
      className={`${primaryBackgroundColorClass} text-xs text-white font-semibold hover:text-white py-1 px-2 hover:border-transparent rounded ml-2 align-right`}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
};
export default PrimaryButton;
