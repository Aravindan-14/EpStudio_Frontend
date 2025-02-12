import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { DataContext } from "./Contexts/DataContext";
import "@fontsource/roboto";
import logo from "./../Assets/commenAssets/logo1.png";
function Navbar() {
  const { users, isAuth, setIsAuth, open, setOpen } = useContext(DataContext);

  const [toggle, setToggle] = useState(false);
  const [image, setImage] = useState(false);

  function toggleHandler() {
    setToggle(!toggle);
  }

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <div className="">
      <div className=" shadow-lg  z-10 w-screen bg-white">
        <div className="flex justify-between items-center container mx-auto px-5 md:px-20 h-16 ">
          <div className="flex justify-between ">
            <div
              className="mr-4 lg:hidden flex items-center"
              onClick={toggleHandler}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </div>
            <div className="md:pr-10 pr-5 border-r border-r-gray-600 uppercase">
              <img className="h-11 w-11 bg-red-50 rounded" src={logo} alt="" />
            </div>
            <div className="flex justify-center items-center">
              <ul className=" gap-10 pl-10 hidden lg:flex">
                <li className="font-light hover:text-blue-500">
                  <a href="#Home">Home</a>{" "}
                </li>
                <li className="font-light hover:text-blue-500">
                  <a href="#Collection"> Collection</a>
                </li>
                <Link to="/ablutUs">
                  <li className="font-light hover:text-blue-500">About Us</li>
                </Link>
                <li className="font-light hover:text-blue-500">Contact</li>
                {users.role == "Admin" ? (
                  <Link to="/admin">
                    <li className="font-light hover:text-blue-500">Admin</li>
                  </Link>
                ) : null}
              </ul>
            </div>
          </div>
          <div className="flex justify-center items-center gap-5 md:gap-8">
            {users.role != "Admin" && (
              <button
                onClick={() => {
                  setOpen(!open);
                }}
              >
                <i class="fa-regular fa-message"></i>
              </button>
            )}
            {users.role != "Admin" && (
              <Link to="/orderList" className="cursor-pointer">
                <i class="fa-solid fa-cart-shopping"></i>
              </Link>
            )}
            {isAuth ? (
              <div className="flex justify-center items-center gap-3">
                <h1
                  className="text-xl font-semibold hover:text-blue-600 hidden md:block"
                  style={{ fontFamily: "Cinzel, serif" }}
                >
                  {users.name.toUpperCase()}
                </h1>
                <div className=" h-8 w-8 rounded-full overflow-hidden  cursor-pointer bg-blue-950 flex justify-center items-center border-blue-500 border">
                  <Link to="/profile">
                    {image ? (
                      <img src="p.jpg" alt="" />
                    ) : (
                      <h1
                        className="text-xl text-gray-100 pb-1"
                        style={{ fontFamily: "Libre Baskerville, serif " }}
                      >
                        {users.name.charAt(0).toUpperCase()}
                      </h1>
                    )}
                  </Link>
                </div>
              </div>
            ) : (
              <Link to="/login">
                <button>Login</button>
              </Link>
            )}

            {/* <Link to="/login">
              {" "}
              <button>Login</button>
            </Link> */}
          </div>
        </div>
      </div>
      <div className={toggle ? "py-5" : " py-5 hidden "}>
        <ul className="  px-auto  w-full flex flex-col items-center gap-3">
          <li className="font-light hover:text-blue-500 ">Home</li>
          <li className="font-light hover:text-blue-500 ">Collection</li>
          <li className="font-light hover:text-blue-500 ">About Us</li>
          <li className="font-light hover:text-blue-500 ">Contact</li>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
