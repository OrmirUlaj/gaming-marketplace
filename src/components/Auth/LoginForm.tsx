import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState("");

  const onSubmit = async (data: any) => {
    setError("");
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });
    if (res?.error) setError("Invalid credentials");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input {...register("email", { required: true })} type="email" placeholder="Email" className="w-full border p-2 rounded" />
      {errors.email && <span className="text-red-500">Email required</span>}
      <input {...register("password", { required: true })} type="password" placeholder="Password" className="w-full border p-2 rounded" />
      {errors.password && <span className="text-red-500">Password required</span>}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-700 text-white py-2 rounded font-semibold shadow-lg border-2 border-white/30 hover:border-cyan-400 hover:shadow-cyan-400/40 transition"
      >
        Login
      </button>
      {error && <div className="text-red-500">{error}</div>}
    </form>
  );
}