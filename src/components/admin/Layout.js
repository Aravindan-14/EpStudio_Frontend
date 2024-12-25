import { useEffect, useState } from "react";
import Message from "./Message";
import AllProduct from "./AllProduct";
import OrderList from "../OrderList";
import CreatePost from "../CreatePost";

const Layout = () => {
  const [view, setView] = useState(""); // State to handle view switching

  const renderView = () => {
    switch (view) {
      case "orders":
        return <OrderList show={true} />;
      case "create":
        return <CreatePost />;
      case "chats":
        return <Message />;
      default:
        return <AllProduct />;
    }
  };

  return (
    <div className="flex bg-slate-500 h-screen w-screen">
      {/* Sidebar Navigation */}
      <nav className="bg-blue-900 w-72 flex justify-start items-center flex-col p-5">
        <h1 className="text-2xl font-semibold uppercase text-white mb-10">
          Admin
        </h1>
        <ul className="space-y-4">
          <li
            onClick={() => setView("qwerty")}
            className="cursor-pointer text-white"
          >
            <h3>All Products</h3>
          </li>
          <li
            onClick={() => setView("orders")}
            className="cursor-pointer text-white"
          >
            <h3>Total Orders</h3>
          </li>
          <li
            onClick={() => setView("chats")}
            className="cursor-pointer text-white"
          >
            <h3>Chat</h3>
          </li>
          <li
            onClick={() => setView("create")}
            className="cursor-pointer text-white"
          >
            <h3>Create Post</h3>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="w-full h-full p-5 bg-white overflow-auto">
        {renderView()}
      </div>
    </div>
  );
};

export default Layout;
