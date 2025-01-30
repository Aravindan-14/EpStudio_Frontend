import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;
    setEmailError("");
    setPasswordError("");

    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailError("Invalid email format");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 1) {
      setPasswordError("Password must be at least 6 characters long");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post(
        "https://epstudio-api.onrender.com/login",
        {
          email,
          password,
        }
      );
      if (response.data.code === 200) {
        console.log(response.data.data.token);
        localStorage.setItem("token", JSON.stringify(response.data.data));
        navigate("/");
      } else {
        setMessage("Login failed! Invalid credentials.");
      }
    } catch (error) {
      setMessage("Login failed! Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-custom-gradient">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring ${emailError ? "border-red-500" : "focus:border-blue-300"}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring ${passwordError ? "border-red-500" : "focus:border-blue-300"}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-custom-gradient text-white py-2 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
          >
            Login
          </button>
        </form>
        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
        <p className="text-center mt-10">
          Don&apos;t have an account?
          <Link to="/signUp">
            <span className="text-blue-500 cursor-pointer"> Register here</span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
