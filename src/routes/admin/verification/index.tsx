import { useState } from "react";
import { useNavigate } from "react-router";

import logo from "@/assets/UDELOGO.png";

export default function Verification() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", ""]);
  const [error, setError] = useState("");

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      const next = document.getElementById(`otp-${index + 1}`);
      (next as HTMLInputElement)?.focus();
    }
  };

  function handleContinue(e: React.FormEvent) {
    e.preventDefault();

    if (otp.some((digit) => digit === "")) {
      setError("Please enter the complete verification code.");
      return;
    }

    setError("");

    navigate("/admin/new-password");
  }

  return (
    <div className="min-h-screen bg-[#F5F7F5] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Udesport logo" className="w-24" />
        </div>

        <h1 className="text-2xl font-bold text-center mb-2">Verification</h1>

        <p className="text-sm text-gray-500 text-center mb-8">
          Enter your 4 digits code that you received on your email.
        </p>

        <form onSubmit={handleContinue} className="space-y-6">
          <div className="flex justify-center gap-4">
            {otp.map((digit, index) => (
              <input
                type="text"
                key={index}
                id={`otp-${index}`}
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                className="w-14 h-14 text-center text-xl font-semibold border rounded-lg focus:outline-none focus:border-green-500"
              />
            ))}
            {error && (
              <p className="text-center text-sm text-red-500">{error}</p>
            )}
          </div>

          <p className="text-center text-sm text-gray-500">
            Didn't receive a code?{" "}
            <button type="button" className="text-green-600 hover:underline">
              Resend
            </button>
          </p>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition-colors"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
