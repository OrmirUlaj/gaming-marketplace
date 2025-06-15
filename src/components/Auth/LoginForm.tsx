import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

interface LoginFormInputs {
  email: string;
  password: string;
}

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false); // <-- Add loading state
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  useEffect(() => {
    if (router.query.registered) {
      setSuccess("Registration successful! Please log in.");
      // Optionally remove the query param after showing the message
      router.replace("/auth/login", undefined, { shallow: true });
    }
  }, [router]);

  const onSubmit = async (data: LoginFormInputs) => {
    setError("");
    setSuccess("");
    setLoading(true); // <-- Start loading
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess("Login successful! Redirecting...");
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      }
    } catch {
      setError("An error occurred during login");
    } finally {
      setLoading(false); // <-- Stop loading
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <input
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
          type="email"
          placeholder="Email"
          className="w-full p-2 rounded border bg-white/10 border-white/20 text-white"
        />
        {errors.email && (
          <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <input
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          type="password"
          placeholder="Password"
          className="w-full p-2 rounded border bg-white/10 border-white/20 text-white"
        />
        {errors.password && (
          <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      {success && (
        <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-3 rounded">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded">
          {error}
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-700 text-white py-2 rounded font-semibold shadow-lg border-2 border-white/30 hover:border-cyan-400 hover:shadow-cyan-400/40 transition"
        disabled={loading} // <-- Disable while loading
      >
        {loading ? "Signing in..." : "Sign In"} {/* <-- Show loading text */}
      </button>
    </form>
  );
}
