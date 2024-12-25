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

function App() {
  const { users, isAuth, setIsAuth, open, setOpen } = useContext(DataContext);

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
        <Feedback />
      </section>
      <section>
        <Footer />
      </section>

      {users.role == "Admin" ? null : <ClientChat />}
    </div>
  );
}

export default App;
