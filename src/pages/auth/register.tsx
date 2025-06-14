import RegisterForm from '@/components/Auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white/10 backdrop-blur rounded-2xl shadow-xl p-8 border border-white/10">
        <h1 className="text-3xl font-bold text-white mb-6 text-center drop-shadow">Register</h1>
        <RegisterForm />
      </div>
    </div>
  );
}