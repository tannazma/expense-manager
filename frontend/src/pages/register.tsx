import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import NavBar from "../components/NavBar";
import { useContext } from "react";
import ThemeContext from "@/components/ThemeContext";
import { ThemeProvider } from "@/components/ThemeProvider";

const dataFromFormValidator = z.object({
  username: z.string().min(4),
  password: z.string().min(4),
  email: z.string().email(),
});

type DataFromForm = z.infer<typeof dataFromFormValidator>;

const Register = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DataFromForm>({
    resolver: zodResolver(dataFromFormValidator),
  });

  const handleRegister = async (data: DataFromForm) => {
    console.log(data);
    try {
      await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      router.push("/login?just-registered=true");
    } catch (error) {
      console.log("Something went wrong!");
    }
  };

  const { theme } = useContext(ThemeContext);
  let registerButton = "bg-purple-500 hover:bg-purple-700";
  let registerBackgroundColor = "bg-violet-200";
  let registerBackgroundColor2 = "bg-violet-100";
  if (theme === "red") {
    registerButton = "bg-red-500 hover:bg-red-700";
    registerBackgroundColor = "bg-red-200";
    registerBackgroundColor2 = "bg-red-100";
  } else if (theme === "green") {
    registerButton = "bg-green-500 hover:bg-green-700";
    registerBackgroundColor = "bg-green-200";
    registerBackgroundColor2 = "bg-green-100";
  } else if (theme === "blue") {
    registerButton = "bg-blue-500 hover:bg-blue-700";
    registerBackgroundColor = "bg-blue-200";
    registerBackgroundColor2 = "bg-blue-100";
  } else if (theme === "dark") {
    registerButton = "bg-gray-700 hover:bg-gray-400 hover:text-black";
    registerBackgroundColor = "bg-gray-200";
    registerBackgroundColor2 = "bg-gray-100";
  }

  return (
    <div>
      <NavBar />
      <div
        className={`${registerBackgroundColor} min-h-screen items-center flex justify-center p-20 align-top`}
      >
        <main
          className={`${registerBackgroundColor2} min-w-[500px] rounded-3xl shadow-xl p-10 `}
        >
          <div>
            <h1 className="text-2xl font-bold text-center mb-4 cursor-pointer">
              Register
            </h1>
          </div>
          <form
            onSubmit={handleSubmit(handleRegister)}
            className="flex flex-col gap-2"
          >
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Username"
              {...register("username")}
              className=" text-sm py-3 px-4 rounded-lg w-full border outline-purple-500"
            />
            {errors.username && (
              <span className="error-msg">{errors.username.message}</span>
            )}
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              {...register("password")}
              className=" text-sm py-3 px-4 rounded-lg w-full border outline-purple-500"
            />
            {errors.password && (
              <span className="error-msg">{errors.password.message}</span>
            )}
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              {...register("email")}
              className=" text-sm py-3 px-4 rounded-lg w-full border outline-purple-500"
            />
            {errors.email && (
              <span className="error-msg">{errors.email.message}</span>
            )}
            <button
              type="submit"
              className={`${registerButton} text-white font-bold py-2 px-4 rounded mt-10`}
            >
              Register
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default Register;
