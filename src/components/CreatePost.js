import React, { useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function CreatePost() {
  var [inputs, setInputs] = useState({});
  var [files, setFiles] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(true);
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };
  const handelFile = (event) => {
    setFiles(event.target.files);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("product_Name", inputs.produc_Name);
    formData.append("product_Price", inputs.product_Price);
    formData.append("description", inputs.description);
    for (let i = 0; i < files.length; i++) {
      formData.append("Product_img", files[i]);
    }
    try {
      setIsSubmitted(false);
      const res = await axios.post(
        "https://epstudio-api.onrender.com/product/creaditProduct",
        formData
      );
      console.log(res.data);
      toast.success("Product Item Added...!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } catch (err) {
      toast.error(err.message, {
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
    <>
      {/* <Navbar /> */}
      <div className="bg-gray-100 flex items-center justify-center h-screen">
        {isSubmitted ? (
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
            <h2 className="text-center text-2xl font-bold mb-6 text-gray-800">
              Create Product
            </h2>
            <form
              onSubmit={handleSubmit}
              className="md:grid md:grid-cols-2 md:gap-5 md:px-10"
            >
              <div className="mb-4">
                <label
                  for="input1"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Product Name
                </label>
                <input
                  onChange={handleChange}
                  type="text"
                  id="input1"
                  name="produc_Name"
                  className="outline-none  w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div className="mb-4">
                <label
                  for="input2"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Product Price
                </label>
                <input
                  onChange={handleChange}
                  type="text"
                  id="input2"
                  name="product_Price"
                  className="outline-none  w-full px-4 py-2 border rounded-lg "
                />
              </div>

              <div className="mb-4">
                <label
                  for="input3"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Description
                </label>
                <input
                  onChange={handleChange}
                  type="text"
                  id="input3"
                  name="description"
                  className="outline-none  w-full px-4 py-2 border rounded-lg "
                />
              </div>

              <div className="mb-6">
                <label
                  for="fileInput"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Upload File{" "}
                </label>
                <input
                  multiple
                  onChange={handelFile}
                  type="file"
                  id="fileInput"
                  name="upload_File"
                  className="outline-none  w-full px-4 py-2 border rounded-lg "
                />
              </div>
              <button
                type="submit"
                className="col-span-2 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 "
              >
                Create Card
              </button>
            </form>
          </div>
        ) : (
          <div>
            <FontAwesomeIcon
              icon={faCheckCircle}
              style={{ color: "green", marginRight: "10px" }}
            />
            Product Created successfully!
          </div>
        )}
      </div>
      {/* <Footer /> */}
    </>
  );
}

export default CreatePost;
