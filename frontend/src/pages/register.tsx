import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
    <>
      <main>
        <form onSubmit={handleSubmit(handleRegister)} className="contents">
          <label htmlFor="username">Username</label>
          <input id="username" type="text" {...register("username")} />
          {errors.username && (
            <span className="error-msg">{errors.username.message}</span>
          )}
          <label htmlFor="password">Password</label>
          <input id="password" type="password" {...register("password")} />
          {errors.password && (
            <span className="error-msg">{errors.password.message}</span>
          )}
          <label htmlFor="email">Email</label>
          <input id="email" type="email" {...register("email")} />
          {errors.email && (
            <span className="error-msg">{errors.email.message}</span>
          )}
          <button type="submit">Register</button>
        </form>
      </main>
    </>
  );
};

export default Register;
