import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    ConfirmPassword: "",
  });
  const navigate = useNavigate();
  const handelSubmit = (e) => {
    e.preventDefault();
    axios
      .post("https://epstudio-api.onrender.com/register", data)
      .then((res) => {
        alert(res.data);
        setData("");
        navigate("/login");
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <form onSubmit={handelSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm  mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Username"
              onChange={(e) => {
                setData({ ...data, name: e.target.value });
              }}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm  mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Email"
              onChange={(e) => {
                setData({ ...data, email: e.target.value });
              }}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm  mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Password"
              onChange={(e) => {
                setData({ ...data, password: e.target.value });
              }}
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm  mb-2"
              htmlFor="confirm-password"
            >
              Confirm Password
            </label>
            <input
              id="confirm-password"
              type="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Confirm Password"
              onChange={(e) => {
                setData({ ...data, ConfirmPassword: e.target.value });
              }}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white  py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign Up
            </button>
            <Link to="/login">
              <a
                className="inline-block align-baseline  text-sm text-blue-500 hover:text-blue-800"
                href="#"
              >
                Already have an account?
              </a>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
