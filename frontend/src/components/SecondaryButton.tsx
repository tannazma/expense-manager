import { useContext, ReactNode } from "react";
import ThemeContext from "./ThemeContext";

type SecondaryButtonProp = {
  onClick?: (...args: any) => any;
  children: ReactNode;
  type?: "submit";
};

const SecondaryButton = ({ type, children, onClick }: SecondaryButtonProp) => {
  const { theme } = useContext(ThemeContext);

  let secondaryBackgroundColorClass = `bg-purple-100 text-purple-700 hover:bg-purple-500 hover:bg-purple-500 border-purple-500`;

  if (theme === "red") {
    secondaryBackgroundColorClass =
      "bg-red-100 text-red-700 hover:bg-red-500 hover:bg-red-500 border-red-500";
  } else if (theme === "green") {
    secondaryBackgroundColorClass =
      "bg-green-100 text-green-700 hover:bg-green-500 hover:bg-green-500 border-green-500";
  } else if (theme === "blue") {
    secondaryBackgroundColorClass =
      "bg-blue-100 text-blue-700 hover:bg-blue-500 hover:bg-blue-500 border-blue-500";
  } else if (theme === "dark") {
    secondaryBackgroundColorClass =
      "bg-gray-100 text-gray-900 hover:bg-black hover:bg-gray-500 border-gray-500";
  }

  return (
    <button
      className={`${secondaryBackgroundColorClass} text-xs items-center flex gap-2 font-semibold hover:text-white py-1 px-2 border hover:border-transparent rounded m-2`}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
};
export default SecondaryButton;
