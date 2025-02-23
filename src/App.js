import "./App.css";
import BestSelling from "./components/BestSelling";
import Feedback from "./components/Feedback";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Product from "./components/Product";
import Spacial from "./components/Spacial";
import ClientChat from "./components/Chat/ClientChat";
import { useContext } from "react";
import { DataContext } from "./components/Contexts/DataContext";
import CustomerReview from "./components/CustomerReview";
import { generateToken } from "./messageing_int_in_sw.js";
import { onMessage } from "firebase/messaging";
import { messaging } from "./messageing_int_in_sw.js";
import { useEffect } from "react"
import { useLocation } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

function App() {
  const { users, isAuth, setIsAuth, open, setOpen } = useContext(DataContext);
  const isMobile = useMediaQuery({ maxWidth: 1024 });

  useEffect(() => {
    if (users) {
      generateToken(users.id)
    }
  }, [users])

  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);
  return (
    <div>
      <section>
        <Navbar />
      </section>
      <section id="Home">
        <Home />
      </section>
      <section className="bg-slate-100">
        <BestSelling />
        <section id="Collection">
          <Product />
        </section>
        <Spacial />
      </section>
      <section>
        {isMobile ? <Feedback /> : <CustomerReview />}
      </section>
      <section>
        <Footer />
      </section>
      {users.role == "Admin" ? null : <ClientChat />}
    </div>
  );
}

export default App;
