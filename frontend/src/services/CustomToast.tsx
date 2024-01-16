import toast from "react-hot-toast";
import Image from "next/image";

type notifyType = {
  icon: string;
  text: string;
};

export const notify = ({ icon, text }: notifyType) => {
  toast(
    () => (
      <div className="flex items-center justify-center whitespace-nowrap mr-2">
        <Image src={icon} width={20} height={20} alt="toast" />
        <span className="pl-2">You just created an {text} successfully.</span>
      </div>
    ),
    {
      style: {
        width: "500px",
        borderRadius: "10px",
        background: "#F5F5F5",
        color: "#000000",
        display: "flex",
      },
    }
  );
};
