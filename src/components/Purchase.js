import React, { useState, useEffect, useContext } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { DataContext } from "./Contexts/DataContext";

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
    if (!isCvReady) {
      setOutput("OpenCV.js is still loading. Please wait.");
      return;
    }

    let file = e.target.files[0];
    if (!file) return;

    let img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = function () {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      let src = window.cv.imread(canvas);
      let gray = new window.cv.Mat();
      window.cv.cvtColor(src, gray, window.cv.COLOR_RGBA2GRAY);

      let laplacian = new window.cv.Mat();
      window.cv.Laplacian(gray, laplacian, window.cv.CV_64F);

      let mean = new window.cv.Mat();
      let stddev = new window.cv.Mat();
      window.cv.meanStdDev(laplacian, mean, stddev);

      let variance = stddev.doubleAt(0, 0) ** 2;
      let threshold = 100.0;

      if (variance < threshold) {
        setOutput("The image is blurry.");

        Swal.fire({
          title: "This Picture is Blurry !",
          text: "Please provide clear Picture",
          icon: "warning",
          // showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Okay",
        });
        // .then((result) => {
        //   if (result.isConfirmed) {
        //     Swal.fire({
        //       title: "Deleted!",
        //       text: "Your file has been deleted.",
        //       icon: "success",
        //     });
        //   }
        // });
      } else {
        setOutput("The image is not blurry.");
        setFile(e.target.files[0]);
      }

      src.delete();
      gray.delete();
      laplacian.delete();
      mean.delete();
      stddev.delete();
    };
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
      });
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
                {loading ? (
                  <div className="" role="status">
                    <svg
                      aria-hidden="true"
                      class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span class="sr-only">Loading...</span>
                  </div>
                ) : (
                  "Buy Now"
                )}
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
