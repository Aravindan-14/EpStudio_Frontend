import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Description from "./components/Description";
import Profile from "./components/Profile";
import Purchase from "./components/Purchase";
import CreatePost from "./components/CreatePost";
import Login from "./components/Login";
import Register from "./components/Register";
import OrderList from "./components/OrderList";
// import AdminPage from "./components/admin/AdiminPage";
import PrivateRoute from "./PrivateRoute";
import Layout from "./components/admin/Layout";
import AboutUs from "./components/AboutUs";

function Routers() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Login />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<Register />} />
        <Route path="/ablutUs" element={<AboutUs />} />

        <Route element={<PrivateRoute />}>
          <Route path="/" element={<App />} />
          <Route path="/Description/:id" element={<Description />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/Purchase" element={<Purchase />} />
          {/* <Route path="/AddProduct" element={<CreatePost />} /> */}
          <Route path="/orderList" element={<OrderList />} />
          <Route path="/admin" element={<Layout />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Routers;
