import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Eye, EyeOff } from "lucide-react";

import logo from "@/assets/udeLogo.png";
import { useSetPassword } from "@/hooks/useApi";

export default function NewPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const setPasswordMutation = useSetPassword();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
    form: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const newErrors = {
      password: "",
      confirmPassword: "",
      form: "",
    };

    if (!token) {
      newErrors.form = "This link is invalid or has expired. Please request a new invite.";
    }

    if (!password.trim()) {
      newErrors.password = "New password is required.";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    setErrors(newErrors);

    if (newErrors.password || newErrors.confirmPassword || newErrors.form) return;

    try {
      await setPasswordMutation.mutateAsync({ token: token as string, password, confirmPassword });
      navigate("/admin/login");
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
        {/* logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Udesport Logo" className="w-24" />
        </div>

        {/* Header */}
        <h1 className="text-2xl font-bold text-center mb-2">New Password</h1>

        <p className="text-sm text-gray-500 text-center mb-8">
          Create a new password for your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* New password */}

          <div>
            <label className="block text-sm font-medium mb-2">
              New Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({
                    ...prev,
                    password: "",
                    form: "",
                  }));
                }}
                className={`w-full border rounded-lg px-4 py-3 pr-12 focus:outline-none ${
                  errors.password
                    ? "border-red-500"
                    : "border-gray-300 focus:border-green-500"
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

          {/* Confirm password */}

          <div>
            <label className="block text-sm font-medium">
              Confirm Password
            </label>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="confirm password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrors((prev) => ({
                    ...prev,
                    confirmPassword: "",
                    form: "",
                  }));
                }}
                className={`w-full border rounded-lg px-4 py-3 pr-12 focus:outline-none ${
                  errors.confirmPassword
                    ? "border-red-500"
                    : "border-gray-300 focus:border-green-500"
                }`}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.confirmPassword}
                </p>
              )}

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </div>

          {errors.form && (
            <p className="text-sm text-red-500 text-center">{errors.form}</p>
          )}

          <button
            type="submit"
            disabled={setPasswordMutation.isPending}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {setPasswordMutation.isPending ? "Saving..." : "Continue"}
          </button>

          <p className="text-center text-sm text-gray-600">
            Remember your password?{" "}
            <button
              type="button"
              onClick={() => navigate("/admin/login")}
              className="text-green-600 font-medium hover:underline"
            >
              Sign In
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
