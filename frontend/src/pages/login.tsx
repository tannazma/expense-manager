import React from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useFetchUser } from "./hooks/useFetchUser";

const formValuesSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(3),
});

type LoginFormInputs = z.infer<typeof formValuesSchema>;

const Login = () => {
  const router = useRouter();
  const justRegistered = router.query["just-registered"];
  const user = useFetchUser();

  const handleLogin = async (data: LoginFormInputs) => {
    console.log(data);

    try {
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      router.push("/");
      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem("token", token);
        router.push("/");
      } else {
        console.log("Login failed");
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

  return (
    <div>
      {/* <NavBar /> */}
      <div className="min-h-screen flex justify-center p-20 items-center align-top bg-violet-200">
        <div className="min-w-[500px] rounded-2xl shadow-xl p-10 bg-violet-100">
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
            {justRegistered && (
              <p>you are registered successfully. now login please.</p>
            )}
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
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
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
