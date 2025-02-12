import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import loginBanner from "../Assets/commenAssets/loginbanner.jpg"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Register() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    ConfirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Validation function
  const validate = () => {
    const newErrors = {};
    if (!data.name) newErrors.name = "Username is required.";
    if (!data.email) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      newErrors.email = "Please enter a valid email address.";
    if (!data.password) newErrors.password = "Password is required.";
    if (!data.ConfirmPassword)
      newErrors.ConfirmPassword = "Confirm password is required.";
    else if (data.password !== data.ConfirmPassword)
      newErrors.ConfirmPassword = "Passwords do not match.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      axios
        .post("https://epstudio-api.onrender.com/registeyr", data)
        .then((res) => {
          toast.success("Account Created..", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
          });
          setData({ name: "", email: "", password: "", ConfirmPassword: "" });
          setLoading(false);
          navigate("/login");
        })
        .catch((err) => {
          toast.error("Registration failed! try again.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <div className="min-h-screen bg-custom-gradient flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-none md:max-w-6xl flex flex-col md:flex-row items-center gap-8">
        <div className="hidden md:block w-1/2">
          <img
            src={loginBanner}
            alt="Illustration of a person in a green hoodie working at a desk with a laptop, plants, and a butterfly decoration"
            className="w-full h-auto object-contain"
          />
        </div>
        <div className="w-full md:w-1/2">
         
          <h1 className="font-roboto text-2xl font-bold text-gray-800 mb-2">
            Create Your Account
          </h1>
          <p className="text-gray-500 mb-6 font-roboto">
            Join Ep Studio Today
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Username"
                className={`w-full px-4 py-3 rounded-lg border ${errors.name ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-blue-500 font-roboto`}
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div>
              <input
                type="email"
                placeholder="Email Address"
                className={`w-full px-4 py-3 rounded-lg border ${errors.email ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-blue-500 font-roboto`}
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                className={`w-full px-4 py-3 rounded-lg border ${errors.password ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-blue-500 font-roboto`}
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
            <div>
              <input
                type="password"
                placeholder="Confirm Password"
                className={`w-full px-4 py-3 rounded-lg border ${errors.ConfirmPassword ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-blue-500 font-roboto`}
                value={data.ConfirmPassword}
                onChange={(e) => setData({ ...data, ConfirmPassword: e.target.value })}
              />
              {errors.ConfirmPassword && <p className="text-red-500 text-sm mt-1">{errors.ConfirmPassword}</p>}
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox text-blue-500"
                name="terms"
              />
              <span className="ml-2 text-sm text-gray-600 font-roboto">
                I agree to the Terms and Privacy Policy
              </span>
            </div>
            <button
              type="submit"
              className="w-full bg-custom-gradient text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-roboto"
              disabled={loading}
            >
              {loading ? (
                <l-mirage size="90" speed="3.7" color="white"></l-mirage>
              ) : (
                "Sign Up"
              )}
            </button>
            <div className="text-center">
              <span className="text-sm text-gray-600 font-roboto">
                Already have an account?{" "}
              </span>
              <Link
                to="/login"
                className="text-sm text-blue-500 hover:underline font-roboto"
              >
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;