import React, { useState, useEffect, useContext } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import { DataContext } from "./Contexts/DataContext";
import { mirage } from 'ldrs';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  UploadCloud, 
  CreditCard, 
  Star
} from "lucide-react";

import { baseURL } from "../Utils/ServerUrl";
mirage.register();

function Purchase() {
  const [inputs, setInputs] = useState({});
  const [file, setFile] = useState({});
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { productData } = location.state || {};
  const { users } = useContext(DataContext);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const navigat = useNavigate();

  // Redirect to home if accessed directly without product data
  useEffect(() => {
    if (!productData) {
      navigat("/");
    }
  }, [productData, navigat]);

  if (!productData) return null;

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!file.name) {
      toast.warning("Please upload an image for custom framing", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
      });
      return;
    }
    
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
      .post(`${baseURL}/purchase/order`, formData)
      .then((res) => {
        if (res) {
          setLoading(false);
          setIsOpen(true);
          toast.success("Order placed successfully...", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            theme: "light",
          });
        }
      })
      .catch((err) => {
        console.error("Order submit error:", err);
        toast.error("Something went wrong placing the order", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          theme: "light",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSubmitFeedback = async () => {
    try {
      const res = await axios.post(`${baseURL}/purchase/feedback`, { 
        rating, 
        feedback, 
        CustomerId: users.id, 
        CustomerName: users.name 
      });

      if (res.data.code === 200) {
        Swal.fire({
          title: "Order Placed Successfully",
          text: "Thank You For Your Feedback..",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        setIsOpen(false);
        navigat("/");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  // Safe pricing calculation
  const unitPrice = parseFloat(String(productData.price).replace(/,/g, "")) || 0;
  const quantity = parseInt(productData.quantity) || 1;
  const subtotal = unitPrice * quantity;
  const deliveryFee = 0; // FREE Shipping
  const total = subtotal + deliveryFee;

  let productImages = [];
  try {
    productImages = JSON.parse(productData.image);
  } catch (e) {}
  const displayThumbnail = Array.isArray(productImages) && productImages.length > 0 
    ? `${baseURL}/public/Products/${productImages[0]}`
    : "";

  return (
    <>
      <Navbar />
      <div className="bg-slate-50 min-h-screen flex justify-center items-center py-24 relative px-4 sm:px-6">
        <div className="w-full max-w-6xl mt-8">
          <div className="text-center mb-10">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100/50">
              Secure Checkout
            </span>
            <h2 className="text-3xl font-extrabold text-slate-800 mt-2">
              Complete Your Purchase
            </h2>
            <div className="w-12 h-1 bg-indigo-500 mx-auto my-3 rounded-full"></div>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Checkout Inputs */}
            <div className="lg:col-span-7 space-y-5 bg-white border border-slate-100 rounded-3xl p-6 lg:p-8 shadow-sm">
              <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 mb-5">
                Shipping & Customer Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Customer Name */}
                <div className="flex flex-col">
                  <label className="block text-slate-700 font-semibold mb-2 text-xs">
                    Customer Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                      <User size={15} />
                    </span>
                    <input
                      onChange={handleChange}
                      type="text"
                      name="customer_Name"
                      required
                      placeholder="John Doe"
                      className="outline-none w-full pl-10 pr-4 py-2.5 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl transition-all text-xs text-slate-700 placeholder-slate-400"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="flex flex-col">
                  <label className="block text-slate-700 font-semibold mb-2 text-xs">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                      <Mail size={15} />
                    </span>
                    <input
                      onChange={handleChange}
                      type="email"
                      name="email"
                      required
                      placeholder="john@example.com"
                      className="outline-none w-full pl-10 pr-4 py-2.5 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl transition-all text-xs text-slate-700 placeholder-slate-400"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Phone No */}
                <div className="flex flex-col">
                  <label className="block text-slate-700 font-semibold mb-2 text-xs">
                    Phone Number
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                      <Phone size={15} />
                    </span>
                    <input
                      onChange={handleChange}
                      type="tel"
                      name="phone_No"
                      required
                      placeholder="9876543210"
                      className="outline-none w-full pl-10 pr-4 py-2.5 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl transition-all text-xs text-slate-700 placeholder-slate-400"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="flex flex-col">
                  <label className="block text-slate-700 font-semibold mb-2 text-xs">
                    Delivery Address
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                      <MapPin size={15} />
                    </span>
                    <input
                      onChange={handleChange}
                      type="text"
                      name="address"
                      required
                      placeholder="123 Street Name, City"
                      className="outline-none w-full pl-10 pr-4 py-2.5 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl transition-all text-xs text-slate-700 placeholder-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* Upload Frame Image */}
              <div className="flex flex-col pt-2">
                <label className="block text-slate-700 font-semibold mb-2 text-xs">
                  Upload Photo for Framing
                </label>
                <div 
                  onClick={() => document.getElementById("file-upload").click()}
                  className="border-2 border-dashed border-slate-200 hover:border-indigo-500 rounded-2xl p-6 bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer flex flex-col items-center justify-center text-center group"
                >
                  <input
                    type="file"
                    id="file-upload"
                    name="image"
                    onChange={handleImageUpload}
                    className="hidden"
                    required
                  />
                  <div className="p-3 bg-white rounded-full shadow-sm text-slate-400 group-hover:text-indigo-600 transition-colors mb-3">
                    <UploadCloud size={20} />
                  </div>
                  <span className="text-xs font-bold text-slate-700 block mb-1">
                    {file.name ? file.name : "Choose a file or drag it here"}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Supports high-resolution PNG, JPG, or JPEG (Max 10MB)
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Checkout Invoice Card */}
            <div className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl p-6 lg:p-8 shadow-sm flex flex-col h-fit sticky top-28">
              <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 mb-5">
                Order Invoice
              </h3>

              {/* Product preview card */}
              <div className="flex gap-4 items-center mb-6 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-slate-200/80 shadow-sm flex-shrink-0">
                  <img
                    className="w-full h-full object-cover"
                    src={displayThumbnail}
                    alt={productData.name}
                  />
                </div>
                <div className="flex-1 overflow-hidden">
                  <h4 className="text-xs font-bold text-slate-800 truncate">
                    {productData.name}
                  </h4>
                  <div className="flex gap-2 mt-1.5 flex-wrap">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[8px] font-bold uppercase rounded-md border border-slate-200/50">
                      Size: {productData.Frame_Size || "Standard"}
                    </span>
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[8px] font-bold uppercase rounded-md border border-indigo-100/50">
                      Qty: {productData.quantity}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-3 border-b border-slate-100 pb-4 mb-4 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Price per item</span>
                  <span className="font-semibold text-slate-700">Rs. {unitPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-700">Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Shipping Fee</span>
                  <span className="text-emerald-600 font-bold">FREE</span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="flex justify-between items-baseline mb-6 px-1">
                <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Total</span>
                <span className="text-2xl font-black text-slate-900">
                  Rs. {total.toLocaleString()}
                </span>
              </div>

              {/* Submit Checkout Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 flex items-center justify-center bg-slate-950 hover:bg-indigo-600 disabled:bg-slate-400 text-white font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg gap-2 text-xs uppercase tracking-wider"
              >
                {loading ? (
                  <l-mirage size="90" speed="3.7" color="white"></l-mirage>
                ) : (
                  <>
                    <CreditCard size={14} />
                    <span>Place Order</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Feedback Modal */}
        {isOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm z-[999999]">
            <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm border border-slate-100 flex flex-col items-center text-center m-4">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-4 shadow-sm border border-indigo-100/30">
                <Star size={22} fill="currentColor" className="stroke-none" />
              </div>
              <h2 className="text-base font-extrabold text-slate-800">Share Your Experience</h2>
              <p className="text-[11px] text-slate-400 mt-2 mb-6 max-w-xs leading-relaxed">
                Your feedback helps us refine our collections and deliver better studio designs.
              </p>

              {/* Stars selection */}
              <div className="flex justify-center gap-1.5 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-4xl cursor-pointer transition-all duration-200 hover:scale-110 select-none ${rating >= star ? "text-amber-400" : "text-slate-200 hover:text-amber-200"}`}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </span>
                ))}
              </div>

              <textarea
                className="w-full p-3.5 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-2xl outline-none text-xs text-slate-700 placeholder-slate-400 min-h-24 resize-none mb-6 shadow-inner"
                placeholder="Write a brief review..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />

              <div className="flex gap-3 w-full">
                <button 
                  type="button"
                  className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-500 rounded-xl transition-all" 
                  onClick={() => {
                    setIsOpen(false);
                    navigat("/");
                  }}
                >
                  Skip
                </button>
                <button 
                  type="button"
                  className="flex-1 py-2.5 bg-slate-950 hover:bg-indigo-600 disabled:bg-slate-200 disabled:text-slate-400 text-xs font-bold text-white rounded-xl transition-all shadow-sm" 
                  onClick={handleSubmitFeedback} 
                  disabled={!rating && !feedback}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
        toastContainerClassName="z-[9999]"
      />
    </>
  );
}

export default Purchase;