import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import NavBar from "../components/NavBar";

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

  return (
    <div>
      <NavBar />
      <div className="min-h-screen items-center flex justify-center p-20 align-top bg-violet-200">
        <main className="min-w-[500px] rounded-3xl shadow-xl p-10 bg-violet-100">
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
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mt-10"
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
