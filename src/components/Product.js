import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Lottie from "lottie-react";
import animationData from "../Assets/commenAssets/Animation - 1724343780432.json";
function Product() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [notFound, setNotFound] = useState(false);
  useEffect(() => {
    axios
      .get("https://epstudio-api.onrender.com/product/allProducts")
      .then((res) => setProducts(res.data))
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const filteredProducts = products.filter((item) => {
    return search.toLowerCase() === ""
      ? item
      : item.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="bg-white">
      <div className="p-5 flex justify-center">
        <div class=" flex items-center md:max-w-5xl max-w-sm w-full h-12 rounded-lg border focus-within:shadow-lg bg-white overflow-hidden">
          <div class="grid place-items-center h-full w-12 text-gray-300 ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <input
            class="peer h-full w-full outline-none text-sm text-gray-700 pr-2"
            type="text"
            id="search"
            placeholder="Search something.."
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </div>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 bg-white px-5 gap-1 md:px-10 py-5 md:py-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((val) => {
            let image = JSON.parse(val.image);

            return (
              <Link to={`/Description/${val.id}`} key={val.id}>
                <div className="border bg-white hover:scale-105 duration-500">
                  <img
                    className="hover:opacity-70 p-1 md:p-5"
                    src={
                      `https://epstudio-api.onrender.com/public/Products/` +
                      image[1]
                    }
                    alt=""
                  />
                  <div className="md:p-5 px-2 flex justify-center items-center flex-col">
                    <h1 className="md:text-2xl font-light md:tracking-[.15em]">
                      {val.name}
                    </h1>
                    <h2 className="text-blue-600 md:tracking-[.15em] py-[2px] md:py-1">
                      Rs {val.price}
                    </h2>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="lottie-container flex justify-center w-screen h-96">
            <Lottie animationData={animationData} loop={true} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Product;
