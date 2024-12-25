import React from "react";
import Navbar from "./Navbar"
import Footer from "./Footer"

function Profile() {
  return (
    <>
<Navbar/>
    <div className=" bg-slate-100 md:h-screen py-20 md:py-0 w-screen flex justify-center items-center ">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border">
        <center className="py-5">
          <div className="h-40 w-40 rounded-full bg-gray-200 overflow-hidden">
            <img src="p.jpg" alt="" />
          </div>
        </center>
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Edit Profile
        </h2>
        <form>
          <div className="mb-4">
            <label
              for="username"
              className="block text-gray-700 font-medium mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label for="email" className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-5000"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
    <Footer/>
    </>
  );
}

export default Profile;
