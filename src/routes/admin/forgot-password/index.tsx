import { useState } from "react";
import { useNavigate } from "react-router";

import logo from "@/assets/udeLogo.png";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({
    email: "",
  });

  function handleForget(e: React.FormEvent) {
    e.preventDefault();

    const newErrors = {
      email: "",
    };

    if (!email.trim()) {
      newErrors.email = "Email address is required.";
    }

    setErrors(newErrors);

    if (newErrors.email) return;

    navigate("/admin/verification");
  }

  return (
    <div className="min-h-screen bg-[#F5F7F5] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Udesport logo" className="w-24" />
        </div>

        {/* Header */}
        <h1 className="text-2xl font-bold text-center mb-2">Forgot Password</h1>

        <p className="text-sm text-gray-500 text-center mb-8">
          Enter your email for the verification proccess,we will send 4 digits
          code to your email.
        </p>

        <form onSubmit={handleForget} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev)=> ({
                    ...prev,
                    email: ""
                }))
              }}
              className={`w-full border rounded-lg px-4 py-3 focus:outline-none ${
                errors.email
                  ? "border-red-500"
                  : "border-gray-300 focus:border-green-500"
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition-colors"
          >
            Continue
          </button>

          <p className="text-center text-sm text-gray-600">
            Remember your password?{" "}
            <button
              type="button"
              onClick={() => navigate("/admin/login")}
              className="text-green-600 font-medium hover:underline"
            >
              Sign in
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
