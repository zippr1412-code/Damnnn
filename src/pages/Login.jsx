import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const { user, sendOTP, verifyOTP, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("email"); // email → otp
  const [error, setError] = useState("");

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email.endsWith(".edu") && !email.endsWith(".ac.in")) {
      setError("Only college emails allowed");
      return;
    }
    const success = await sendOTP(email);
    if (success) setStep("otp");
    else setError("Failed to send OTP. Try again.");
  };

const handleOtpSubmit = async (e) => {
  e.preventDefault();
  const success = await verifyOTP(email, otp);
  if (success) {
    navigate('/setup'); // Redirect to profile setup
  } else {
    setError("Invalid or expired OTP.");
  }
};

  if (user) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Welcome, {user.email}</h1>
        <button
          onClick={logout}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      {step === "email" && (
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <h1 className="text-xl font-bold">Login</h1>
          <input
            type="email"
            placeholder="Enter college email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
            Send OTP
          </button>
        </form>
      )}
      {step === "otp" && (
        <form onSubmit={handleOtpSubmit} className="space-y-4">
          <h1 className="text-xl font-bold">Enter OTP</h1>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <button type="submit" className="w-full bg-green-500 text-white py-2 rounded">
            Verify OTP
          </button>
        </form>
      )}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}

export default Login;
