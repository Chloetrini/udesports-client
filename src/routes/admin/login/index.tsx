import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import logo from "@/assets/green udeLogo.png";
import { useLogin } from "@/hooks/useApi";

export default function Login() {
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberPassword, setRememberPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    form: "",
  });

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const newErrors = {
      email: "",
      password: "",
      form: "",
    };

    if (!email.trim()) {
      newErrors.email = "Email is required";
    }
    if (!password.trim()) {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);

    if (newErrors.email || newErrors.password) {
      return;
    }

    try {
      await loginMutation.mutateAsync({ email: email.trim(), password });
      navigate("/admin/dashboard");
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        form: err instanceof Error ? err.message : "Something went wrong. Please try again.",
      }));
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F7F5] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Udesport Logo" className="w-24" />
        </div>

        <h1 className="text-2xl font-bold text-center mb-2">
          Login to Account
        </h1>

        <p className="text-gray-500 text-center mb-8">
          Please enter your email and password to continue
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-sm font-medium"> Email Address</label>

            <input
              type="email"
              placeholder="Input email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({
                    ...prev,
                    email: ""
                }))
              }}
              className={`w-full mt-2 border rounded-lg px-4 py-3 focus:outline-none ${
                errors.email ? "border-red-500" : "focus:border-green-500"
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium"> Password</label>

            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Input password"
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({
                        ...prev,
                        password: ""
                    }))
                }}
                className={`w-full border rounded-lg px-4 py-3 pr-12 focus:outline-none ${
                  errors.password ? "border-red-500" : "focus:border-green-500"
                }`}
              />

              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap2 text-sm">
              <input
                type="checkbox"
                checked={rememberPassword}
                onChange={() => setRememberPassword(!rememberPassword)}
              />
              Remember Password
            </label>

            <button
              type="button"
              onClick={() => navigate("/admin/forgot-password")}
              className="text-green-600 text-sm"
            >
              Forgot Password
            </button>
          </div>

          {errors.form && (
            <p className="text-sm text-red-500 text-center">{errors.form}</p>
          )}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loginMutation.isPending ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
