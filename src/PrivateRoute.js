import React, { useEffect, useState, useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import axios from "axios";
import { DataContext } from "./components/Contexts/DataContext";
import { jellyTriangle } from 'ldrs'
import { baseURL } from "./Utils/ServerUrl";
jellyTriangle.register()

// Default values shown

const PrivateRoutes = () => {
  const [loading, setLoading] = useState(true);
  const { setUsers, isAuth, setIsAuth } = useContext(DataContext);

  useEffect(() => {
    ValidToken();
  }, []);

  async function ValidToken() {
    const token = localStorage.getItem("token");
    const authdata = JSON.parse(token);

    if (!authdata || !authdata.token) {
      setIsAuth(false);
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${baseURL}/register/validtoken`,
        {},
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authdata.token}`,
          },
        }
      );

      if (res.data.message === "Token Valid") {
        setIsAuth(true);
        setUsers(authdata);
      } else {
        setIsAuth(false);
      }
    } catch (error) {
      console.error("Error validating token", error);
      setIsAuth(false);
    } finally {
      setLoading(false); // stop loading after the check completes
    }
  }

  if (loading) {
    return <div className="h-screen w-screen flex justify-center items-center">
      <l-jelly-triangle
        size="90"
        speed="1.75"
        // color="black"
      ></l-jelly-triangle>

    </div>; // Optional: add a loading spinner or message
  }

  return isAuth ? <Outlet /> : <Navigate to={"/login"} />;
};

export default PrivateRoutes;
