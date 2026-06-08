import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseURL } from "../Utils/ServerUrl";
import { 
  UploadCloud, 
  CheckCircle2, 
  Plus, 
  FileText, 
  IndianRupee, 
  ShoppingBag, 
  FileCode,
  X 
} from "lucide-react";

function CreatePost() {
  const [inputs, setInputs] = useState({
    produc_Name: "",
    product_Price: "",
    description: ""
  });
  const [files, setFiles] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(true); // true = show form, false = show success screen
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handelFile = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const removeFile = (indexToRemove) => {
    setFiles((prevFiles) => prevFiles.filter((_, idx) => idx !== indexToRemove));
  };

  const resetForm = () => {
    setInputs({
      produc_Name: "",
      product_Price: "",
      description: ""
    });
    setFiles([]);
    setIsSubmitted(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!inputs.produc_Name || !inputs.product_Price || !inputs.description || files.length === 0) {
      toast.warn("Please fill in all fields and upload at least one image.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append("product_Name", inputs.produc_Name);
    formData.append("product_Price", inputs.product_Price);
    formData.append("description", inputs.description);
    
    for (let i = 0; i < files.length; i++) {
      formData.append("Product_img", files[i]);
    }

    try {
      setIsUploading(true);
      const res = await axios.post(
        `${baseURL}/product/creaditProduct`,
        formData
      );
      console.log(res.data);
      setIsSubmitted(false);
      toast.success("Product Item Added Successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
      });
    } catch (err) {
      toast.error(err.message || "Failed to create product card.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] w-full flex items-center justify-center p-4">
      {isSubmitted ? (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm w-full max-w-3xl">
          <div className="flex items-center gap-3.5 mb-6 border-b border-slate-100 pb-5">
            <div className="h-10 w-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <Plus size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Publish New Product
              </h2>
              <p className="text-slate-500 text-xs">Configure details and images to launch cards on main collection catalog</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div className="space-y-1.5">
                <label
                  htmlFor="produc_Name"
                  className="block text-xs font-bold text-slate-500 uppercase tracking-wider"
                >
                  Product Name
                </label>
                <div className="relative">
                  <ShoppingBag className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                  <input
                    onChange={handleChange}
                    type="text"
                    id="produc_Name"
                    name="produc_Name"
                    value={inputs.produc_Name}
                    placeholder="e.g. Silk Evening Dress"
                    className="pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 w-full bg-slate-50 transition-all font-medium text-slate-700"
                    required
                  />
                </div>
              </div>

              {/* Product Price */}
              <div className="space-y-1.5">
                <label
                  htmlFor="product_Price"
                  className="block text-xs font-bold text-slate-500 uppercase tracking-wider"
                >
                  Product Price (₹)
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                  <input
                    onChange={handleChange}
                    type="number"
                    step="0.01"
                    id="product_Price"
                    name="product_Price"
                    value={inputs.product_Price}
                    placeholder="250.00"
                    className="pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 w-full bg-slate-50 transition-all font-medium text-slate-700"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label
                htmlFor="description"
                className="block text-xs font-bold text-slate-500 uppercase tracking-wider"
              >
                Detailed Description
              </label>
              <div className="relative">
                <FileText className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                <textarea
                  onChange={handleChange}
                  id="description"
                  name="description"
                  rows={4}
                  value={inputs.description}
                  placeholder="Provide a comprehensive narrative about product style, fabrics, materials, and sizes..."
                  className="pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 w-full bg-slate-50 transition-all font-medium text-slate-700 resize-none"
                  required
                />
              </div>
            </div>

            {/* File Drag and Drop Zone */}
            <div className="space-y-3">
              <label
                className="block text-xs font-bold text-slate-500 uppercase tracking-wider"
              >
                Product Imagery
              </label>
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50/50 hover:bg-slate-50 hover:border-violet-500 transition-all relative flex flex-col items-center text-center cursor-pointer group">
                <input
                  multiple
                  onChange={handelFile}
                  type="file"
                  id="fileInput"
                  name="upload_File"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <UploadCloud size={32} className="text-slate-400 group-hover:text-violet-600 transition-colors mb-2.5 stroke-1.5" />
                <h4 className="text-xs font-bold text-slate-700">Click to upload product image files</h4>
                <p className="text-[10px] text-slate-400 mt-1">PNG, JPG, or WEBP formats accepted</p>
              </div>

              {/* Uploaded File Previews */}
              {files.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  {files.map((file, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-150 rounded-xl"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="h-9 w-9 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
                          <FileCode size={16} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-700 truncate max-w-44">
                            {file.name}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <button 
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-slate-400 hover:text-rose-500 p-1 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="border-t border-slate-100 pt-6 mt-4">
              <button
                type="submit"
                disabled={isUploading}
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold py-3.5 px-4 rounded-xl hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95 transition-all disabled:opacity-50 text-sm"
              >
                {isUploading ? "Uploading catalog item..." : "Deploy Product Card"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm max-w-md w-full">
          <div className="mx-auto w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 mb-5 animate-bounce shadow-inner">
            <CheckCircle2 size={32} className="stroke-1.5" />
          </div>
          <h3 className="text-slate-800 font-bold text-lg">Product Deployed!</h3>
          <p className="text-slate-500 text-xs max-w-xs mx-auto mt-2 leading-relaxed">
            The catalog entry has been successfully initialized and published to your customer pages.
          </p>
          <button
            onClick={resetForm}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-4 rounded-xl text-xs transition-colors mt-6 shadow-md"
          >
            Add Another Product
          </button>
        </div>
      )}
    </div>
  );
}

export default CreatePost;
