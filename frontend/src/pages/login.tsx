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
      {user && <h1>You are logged in {user.username}</h1>}
      <div className="login-container">
        <form onSubmit={handleSubmit(handleLogin)} className="login">
          <h1>Login</h1>
          {justRegistered && (
            <p>you are registered successfully. now login please.</p>
          )}
          <label>
            Username
            <input type="text" id="username" {...register("username")}></input>
            {errors.username && (
              <span className="error-msg">{errors.username?.message}</span>
            )}
          </label>
          <label>
            password
            <input
              type="password"
              id="password"
              {...register("password")}
            ></input>
            {errors.password && (
              <span className="error-msg">{errors.password?.message}</span>
            )}
          </label>
          <button type="submit" id="submit-btn" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
