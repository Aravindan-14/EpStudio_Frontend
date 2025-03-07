import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useNavigate, useParams } from "react-router-dom";
import Product from "./Product";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseURL } from "../Utils/ServerUrl";

function Description() {
  const [data, setData] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const [framesize, setFramesize] = useState("");
  const { id } = useParams();
  const [selectedIndex, setSelectedIndex] = useState(null);
  const navigate = useNavigate();

  function handelQuantity(event) {
    let decision = event.target.textContent;
    if (decision === "+") {
      setQuantity(quantity + 1);
    } else {
      if (quantity > 0) {
        setQuantity(quantity - 1);
      }
    }
  }

  const handleSize = (size, index) => {
    setSelectedIndex(index);
    setFramesize(size);
  };

  useEffect(() => {
    axios
      .get(`${baseURL}/product/${id}`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const productData = {
    ...data[0],
    Product_ID: id,
    Frame_Size: framesize,
    quantity: quantity,
  };

  const handleNavigate = () => {
    if (quantity > 0 && framesize) {
      navigate("/Purchase", { state: { productData } });
    } else {
      toast.error("select a frame size and quantity!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  return (
    <div className="w-screen">
      <Navbar />
      {data.map((val) => {
        let image = JSON.parse(val.image);
        return (
          <div
            key={val.id}
            className="md:flex md:gap-10 overflow-hidden pt-24 py-5 px-5 container mx-auto"
            id="pageTwo"
          >
            <Swiper
              className="flex justify-center items-center md:h-[500px] md:w-1/2"
              spaceBetween={50}
              slidesPerView={1}
              modules={[Pagination]}
              pagination={{ clickable: true }}
            >
              {image.map((imgSrc, index) => (
                <SwiperSlide key={index} style={{ display: "flex", justifyContent: "center" }}>
                  <img
                    className="object-center lg:h-[500px] md:h[300px]"
                    src={`${baseURL}/public/Products/${imgSrc}`}
                    alt=""
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="md:w-1/2">
              <h1 className="font-bold lg:text-3xl text-2xl pt-5 lg:pt-0 uppercase pb-5">
                {val.name}
              </h1>
              <h3 className="font-semibold text-2xl mb-5">Rs.{val.price}</h3>
              <p className="lg:pr-5 md:text-justify mb-5">{val.description}</p>
              <div>
                <span className="font-semibold text-2xl">Size</span>
                <div className="flex gap-2 mt-2">
                  {["420 x 297", "594 x 420", "297 x 210"].map((size, index) => (
                    <div
                      key={index}
                      onClick={() => handleSize(size, index)}
                      className={`text-xs border-solid border-2 font-semibold p-1 px-2 rounded-lg cursor-pointer ${
                        selectedIndex === index
                          ? "bg-black text-white"
                          : "text-gray-400 hover:bg-black hover:text-white"
                      }`}
                    >
                      {size}
                    </div>
                  ))}
                </div>
                <div>
                  <h4 className="mt-5 mb-2 uppercase font-bold">Quantity</h4>
                  <div className="flex justify-between text-center items-center px-3 border py-1 rounded-lg w-20 text-xl">
                    <div onClick={handelQuantity} className="cursor-pointer">
                      -
                    </div>
                    <div>
                      <p>{quantity}</p>
                    </div>
                    <div onClick={handelQuantity} className="cursor-pointer">
                      +
                    </div>
                  </div>
                </div>
              </div>
              <div onClick={handleNavigate}>
                <button className="mt-16 lg:mt-16 md:mt-9 w-full text-center hover:bg-black border-2 border-solid border-black hover:text-white py-3 uppercase font-bold">
                  Buy it Now
                </button>
              </div>
            </div>
          </div>
        );
      })}
      <Product />
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default Description;
