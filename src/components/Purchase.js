import React, { useState, useEffect, useContext } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { DataContext } from "./Contexts/DataContext";
import { mirage } from 'ldrs'

mirage.register()
function Purchase() {
  var [inputs, setInputs] = useState({});
  var [file, setFile] = useState({});
  // const [submited, setSubmited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("OpenCV.js is loading...");
  const [isCvReady, setIsCvReady] = useState(false);
  const location = useLocation();
  const { productData } = location.state || {};
  const { users, isAuth, setIsAuth, open, setOpen } = useContext(DataContext);
  const navigat = useNavigate();
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  console.log(productData, "from buy scren ");

  useEffect(() => {
    const checkCvReady = setInterval(() => {
      if (window.cv && window.cv.imread) {
        setIsCvReady(true);
        setOutput("OpenCV.js is ready.");
        clearInterval(checkCvReady);
      }
    }, 100);

    return () => clearInterval(checkCvReady);
  }, []);

  const handleImageUpload = (e) => {
    setFile(e.target.files[0]);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("customer_Name", inputs.customer_Name);
    formData.append("email", inputs.email);
    formData.append("phone_No", inputs.phone_No);
    formData.append("address", inputs.address);
    formData.append("product_Name", productData.name);
    formData.append("quantity", productData.quantity);
    formData.append("price", productData.price);
    formData.append("Product_ID", productData.Product_ID);
    formData.append("Frame_Size", productData.Frame_Size);
    formData.append("User_ID", users.id);

    axios
      .post("https://epstudio-api.onrender.com/purchase/order", formData)
      .then((res) => {
        if (res) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Order Placed Successfully....!",
            showConfirmButton: false,
            timer: 3000,
          });
          setLoading(false);
          navigat("/");
        }
      })
      .catch((err) => {
        alert("Something went wrong");
      }).finally(()=>{
        setLoading(false)
      })
  };

  return (
    <>
      <Navbar />
      <div className="bg-gray-100 flex justify-center items-center py-32 relative ">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-6xl md:px-20">
          <div>
            <h2 className="text-2xl md:text-4xl font-semibold mb-6 text-center">
              Purchase Product
            </h2>
            <form
              className="md:grid grid-cols-1 md:grid-cols-2 gap-5"
              onSubmit={handleSubmit}
            >
              <div className="mb-1">
                <label
                  for="product-name"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Customer Name
                </label>
                <input
                  onChange={handleChange}
                  type="text"
                  id="product-name"
                  name="customer_Name"
                  className="outline-none  w-full px-3 py-2 border border-gray-300 rounded-md "
                />
              </div>
              <div className="mb-1">
                <label
                  for="quantity"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Email
                </label>
                <input
                  onChange={handleChange}
                  type="email"
                  id="quantity"
                  name="email"
                  className="outline-none  w-full px-3 py-2 border border-gray-300 rounded-md "
                />
              </div>
              <div className="mb-1">
                <label
                  for="card-number"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Phone No
                </label>
                <input
                  onChange={handleChange}
                  type="text"
                  id="card-number"
                  name="phone_No"
                  className="outline-none  w-full px-3 py-2 border border-gray-300 rounded-md "
                />
              </div>
              <div className="mb-1">
                <label
                  for="expiration-date"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Address
                </label>
                <input
                  onChange={handleChange}
                  type="text"
                  id="expiration-date"
                  name="address"
                  placeholder=""
                  className="outline-none  w-full px-3 py-2 border border-gray-300 rounded-md "
                />
              </div>

              <div className="mb-1">
                <label
                  for="cvv"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Product Name
                </label>
                <input
                  s
                  // onChange={handleChange}
                  type="text"
                  id="product"
                  name="product_Name"
                  value={productData.name}
                  readOnly
                  className="outline-none  w-full px-3 py-2 border border-gray-300 rounded-md "
                />
              </div>
              <div className="mb-1">
                <label
                  for="cvv"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Product Price
                </label>
                <input
                  // onChange={handleChange}
                  type="text"
                  id="cvv"
                  value={productData.price}
                  readOnly
                  name="price"
                  className="outline-none  w-full px-3 py-2 border border-gray-300 rounded-md "
                />
              </div>
              <div className="mb-1">
                <label
                  for="cvv"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Quantity
                </label>
                <input
                  // onChange={handleChange}
                  type="text"
                  id="cvv"
                  value={productData.quantity}
                  readOnly
                  name="quantity"
                  className="outline-none  w-full px-3 py-2 border border-gray-300 rounded-md "
                />
              </div>
              <div className="mb-1">
                <label
                  for="cvv"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Upload Image
                </label>
                <input
                  onChange={handleImageUpload}
                  type="file"
                  id="cvv"
                  name="image"
                  className="outline-none  w-full px-3 py-2 border border-gray-300 rounded-md "
                />
              </div>
              <button
                type="submit"
                className=" items-center justify-center h-10 flex  my-5 col-span-2 w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 "
              >
               {loading?<l-mirage
                size="90"
                speed="3.7"
                color="white"
              ></l-mirage>:"Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Purchase;
