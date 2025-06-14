import { useForm } from "react-hook-form";
import { useState } from "react";

export default function RegisterForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [success, setSuccess] = useState(false);

  const onSubmit = async (data: any) => {
    // TODO: Call your backend API to register user
    setSuccess(true);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input
        {...register("name", { required: true })}
        placeholder="Name"
        className="w-full border p-2 rounded"
      />
      {errors.name && <span className="text-red-500">Name required</span>}
      <input
        {...register("email", { required: true })}
        type="email"
        placeholder="Email"
        className="w-full border p-2 rounded"
      />
      {errors.email && <span className="text-red-500">Email required</span>}
      <input
        {...register("password", { required: true })}
        type="password"
        placeholder="Password"
        className="w-full border p-2 rounded"
      />
      {errors.password && <span className="text-red-500">Password required</span>}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-700 text-white py-2 rounded font-semibold shadow-lg border-2 border-white/30 hover:border-cyan-400 hover:shadow-cyan-400/40 transition"
      >
        Register
      </button>
      {success && <div className="text-green-600">Registration successful!</div>}
    </form>
  );
}