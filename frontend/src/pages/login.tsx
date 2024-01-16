import React, { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useFetchUser from "../hooks/useFetchUser";
import NavBar from "@/components/NavBar";
import ThemeContext from "@/components/ThemeContext";
import Link from "next/link";
import { toast } from "react-hot-toast";

const formValuesSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(3),
});

type LoginFormInputs = z.infer<typeof formValuesSchema>;

const Login = () => {
  const router = useRouter();
  const justRegistered = router.query["just-registered"];
  const user = useFetchUser();
  const { theme } = useContext(ThemeContext);
  let loginButton = "bg-purple-500 hover:bg-purple-700";
  let loginBackgroundColor = "bg-violet-200";
  let loginBackgroundColor2 = "bg-violet-100";

  useEffect(() => {
    if (justRegistered) {
      toast("You are registered successfully. Now login please.", {
        icon: "🎉",
        style: {
          borderRadius: "10px",
          background: "#800000",
          color: "#fff",
          display: "flex",
        },
      });
    }
  }, [justRegistered]);

  if (theme === "red") {
    loginButton = "bg-red-500 hover:bg-red-700";
    loginBackgroundColor = "bg-red-200";
    loginBackgroundColor2 = "bg-red-100";
  } else if (theme === "green") {
    loginButton = "bg-green-500 hover:bg-green-700";
    loginBackgroundColor = "bg-green-200";
    loginBackgroundColor2 = "bg-green-100";
  } else if (theme === "blue") {
    loginButton = "bg-blue-500 hover:bg-blue-700";
    loginBackgroundColor = "bg-blue-200";
    loginBackgroundColor2 = "bg-blue-100";
  } else if (theme === "dark") {
    loginButton = "bg-gray-700 hover:bg-gray-400";
    loginBackgroundColor = "bg-gray-200";
    loginBackgroundColor2 = "bg-gray-100";
  }

  const handleLogin = async (data: LoginFormInputs) => {

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVERURL}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem("token", token);
        router.push("/");
      } else {
        // trigger toast for failed login
        toast("Login failed. Please try again.", {
          icon: "⚠️",
          style: {
            borderRadius: "10px",
            background: "#ff0000", // Red background
            color: "#fff",
            display: "flex",
          },
        });
      }
    } catch (error) {
      console.log("Something went wrong!", error);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(formValuesSchema),
  });

  let navbarBackgroundColor = "bg-violet-200";
  if (theme === "red") {
    navbarBackgroundColor = "bg-red-200";
  } else if (theme === "green") {
    navbarBackgroundColor = "bg-green-200";
  } else if (theme === "blue") {
    navbarBackgroundColor = "bg-blue-200";
  } else if (theme === "dark") {
    navbarBackgroundColor = "bg-gray";
  }

  return (
    <div>
      <NavBar />
      <div
        className={`${navbarBackgroundColor}  flex flex-col justify-center items-center`}
      >
        <h1 className="text-center text-xl text-black font-bold">
          Ready to explore? Log in and lets get started! <span>👇</span>
        </h1>
        <div className="flex flex-1 text-center text-l text-black font-semibold">
          Don&apos;t have an account yet?
          <div>
            <Link href={"/register"} className="text-purple-500 pl-2">
              Click Here to sign up
            </Link>
          </div>
        </div>
      </div>
      <div
        className={`${loginBackgroundColor} min-h-screen flex justify-center p-20 items-center align-top`}
      >
        <div
          className={`${loginBackgroundColor2} min-w-[500px] rounded-2xl shadow-xl p-10`}
        >
          {user && (
            <h1 className="flex items-center justify-center text-2xl font-bold text-center mb-4 cursor-pointer">
              You are logged in {user.username}
            </h1>
          )}
          <form
            onSubmit={handleSubmit(handleLogin)}
            className="flex flex-col gap-10"
          >
            <h1 className="flex justify-center text-3xl font-bold cursor-pointer">
              Login
            </h1>
            <label>
              Username
              <input
                type="text"
                id="username"
                {...register("username")}
                placeholder="Username"
                className=" text-sm py-3 px-4 rounded-lg w-full border outline-purple-500"
              ></input>
              {errors.username && (
                <span className="error-msg">{errors.username?.message}</span>
              )}
            </label>
            <label>
              password
              <input
                type="password"
                id="password"
                placeholder="Password"
                className=" text-sm py-3 px-4 rounded-lg w-full border outline-purple-500"
                {...register("password")}
              ></input>
              {errors.password && (
                <span className="error-msg">{errors.password?.message}</span>
              )}
            </label>
            <button
              type="submit"
              id="submit-btn"
              className={`${loginButton} text-white font-bold py-2 px-4 rounded`}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
