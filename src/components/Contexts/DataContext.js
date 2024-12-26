import React, { createContext, useState } from "react";
import axios from "axios";

const DataContext = createContext();

const DataProvider = ({ children }) => {
  const [state, setState] = useState("default value");
  const [isAuth, setIsAuth] = useState(null);
  const [open, setOpen] = useState(false);
  // Functions
  const checkLoginStatus = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found");
      return;
    }

    axios
      .get("http://process.env.APIBASEURL/verify", {
        headers: { "Auth-token": token },
      })
      .then((response) => {
        console.log("User is logged in:", response.data);
      })
      .catch((error) => {
        console.error("User is not logged in:", error);

        localStorage.removeItem("token");
      });
  };

  const [users, setUsers] = useState();

  const getuser = () => {
    const token = localStorage.getItem("token");
    const authdata = JSON.parse(token);
    setUsers(authdata);
  };

  return (
    <DataContext.Provider
      value={{
        state,
        setState,
        checkLoginStatus,
        getuser,
        users,
        setUsers,
        isAuth,
        setIsAuth,
        open,
        setOpen,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export { DataProvider, DataContext };
