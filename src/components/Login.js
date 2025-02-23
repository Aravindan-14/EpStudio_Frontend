import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import loginbanner from "../Assets/commenAssets/loginbanner.jpg"
import { baseURL } from "../Utils/ServerUrl";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Form validation logic
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
    }
    // else if (password.length < 6) {
    //   setPasswordError("Password must be at least 6 characters long");
    //   isValid = false;
    // }

    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await axios.post(
        `${baseURL}/login`,
        {
          email, // Changed from `username` to `email`
          password,
        }
      );

      if (response.data.code === 200) {
        localStorage.setItem("token", JSON.stringify(response.data.data));
        setLoading(false);
        navigate("/"); // Redirect to the home page or dashboard
      } else {
        setLoading(false);
        setMessage("Login failed! Invalid credentials.");
      }
    } catch (error) {
      setMessage("Login failed! Please try again.");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-custom-gradient flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-none md:max-w-6xl flex flex-col md:flex-row items-center gap-8">
        <div className="hidden md:block w-1/2">
          <img
            src={loginbanner}
            alt="Illustration of a person in a green hoodie working at a desk with a laptop, plants, and a butterfly decoration"
            className="w-full h-auto object-contain"
          />
        </div>
        <div className="w-full md:w-1/2">
          <h1 className="font-roboto text-2xl font-bold text-gray-800 mb-2">
            Welcome to EP Studio
          </h1>
          <p className="text-gray-500 mb-6 font-roboto">Preserving Smiles for a Lifetime</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email" // Changed to `email` type
                placeholder="Email"
                className={`w-full px-4 py-3 rounded-lg border ${emailError ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-blue-500 font-roboto`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                name="email"
              />
              {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                className={`w-full px-4 py-3 rounded-lg border ${passwordError ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-blue-500 font-roboto`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                name="password"
              />
              {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox text-blue-500"
                  name="remember"
                />
                <span className="ml-2 text-sm text-gray-600 font-roboto">
                  Remember this Device
                </span>
              </label>
              <a
                href="#"
                className="text-sm text-blue-500 hover:underline font-roboto"
              >
                Forgot Password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full bg-custom-gradient text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-roboto"
              disabled={loading}
            >
              {loading ? (
                <l-mirage size="90" speed="3.7" color="white"></l-mirage>
              ) : (
                "Sign in"
              )}
            </button>
            {message && <p className="text-center text-red-500">{message}</p>}
            <div className="text-center">
              <span className="text-sm text-gray-600 font-roboto">
                New to Ep Studio?{" "}
              </span>
              <Link to="/signUp">
                <span
                  className="text-sm text-blue-500 hover:underline font-roboto"
                >
                  Create an account
                </span>
              </Link>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;