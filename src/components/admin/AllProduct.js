import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { baseURL } from "../../Utils/ServerUrl";
import { DataContext } from "../Contexts/DataContext";
import Swal from "sweetalert2";
import {
  Package,
  ShoppingBag,
  IndianRupee,
  MessageSquare,
  Search,
  Trash2,
  Edit,
  Plus,
  X,
  UploadCloud,
  FileCode
} from "lucide-react";

function AllProduct() {
  const { users } = useContext(DataContext);
  const [allProduct, setAllProduct] = useState([]);
  const [orders, setOrders] = useState([]);
  const [chats, setChats] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Edit states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editInputs, setEditInputs] = useState({
    produc_Name: "",
    product_Price: "",
    description: ""
  });
  const [editRemainingImages, setEditRemainingImages] = useState([]);
  const [editFiles, setEditFiles] = useState([]);

  // Fetch all products, orders, and chats for statistics and data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Products
      const prodRes = await axios.get(`${baseURL}/product/allProducts`);
      setAllProduct(prodRes.data || []);

      // 2. Fetch Orders (for stats)
      const orderRes = await axios.get(`${baseURL}/purchase/getUserOrders`);
      if (orderRes.status === 200 && orderRes.data?.orders) {
        setOrders(orderRes.data.orders);
      }

      // 3. Fetch Chats (for stats)
      if (users?.id) {
        const chatRes = await axios.post(`${baseURL}/chat/getAllChatId`, {
          id: users.id,
        });
        if (chatRes.data?.data) {
          setChats(chatRes.data.data);
        }
      }
    } catch (err) {
      console.error("Error fetching admin dashboard data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [users?.id]); // Only refetch when user id resolves or initially

  const deleteProductById = async (id, name) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete "${name}". This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete it!",
      background: "#FFFFFF",
      customClass: {
        popup: "rounded-3xl shadow-xl border border-slate-100",
        confirmButton: "px-6 py-2.5 rounded-xl font-semibold text-white",
        cancelButton: "px-6 py-2.5 rounded-xl font-semibold text-white",
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.post(`${baseURL}/product/deleteById`, { id });
          console.log("Product deleted successfully:", response.data);
          
          setAllProduct((prevProducts) =>
            prevProducts.filter((val) => val.id !== id)
          );

          Swal.fire({
            title: "Deleted!",
            text: "The product has been removed from the catalog.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
        } catch (error) {
          console.error("Error deleting product:", error);
          Swal.fire({
            title: "Error!",
            text: "Something went wrong while deleting the product.",
            icon: "error",
          });
        }
      }
    });
  };

  // Edit Actions
  const handleEditClick = (product) => {
    setEditingProduct(product);
    setEditInputs({
      produc_Name: product.name,
      product_Price: product.price,
      description: product.description
    });
    setEditRemainingImages(parseImages(product.image));
    setEditFiles([]);
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditFile = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setEditFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeEditFile = (indexToRemove) => {
    setEditFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const removeCurrentImg = (imgName) => {
    setEditRemainingImages((prev) => prev.filter((img) => img !== imgName));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editInputs.produc_Name || !editInputs.product_Price || !editInputs.description) {
      Swal.fire({
        title: "Warning!",
        text: "Please fill in all text fields.",
        icon: "warning",
      });
      return;
    }

    if (editRemainingImages.length === 0 && editFiles.length === 0) {
      Swal.fire({
        title: "Warning!",
        text: "The product must contain at least one image.",
        icon: "warning",
      });
      return;
    }

    const formData = new FormData();
    formData.append("id", editingProduct.id);
    formData.append("product_Name", editInputs.produc_Name);
    formData.append("product_Price", editInputs.product_Price);
    formData.append("description", editInputs.description);
    formData.append("remaining_images", JSON.stringify(editRemainingImages));

    for (let i = 0; i < editFiles.length; i++) {
      formData.append("Product_img", editFiles[i]);
    }

    try {
      Swal.fire({
        title: "Updating Product...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const res = await axios.post(`${baseURL}/product/updateProduct`, formData);
      Swal.close();

      if (res.status === 200) {
        Swal.fire({
          title: "Success!",
          text: "Product updated successfully.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        setIsEditModalOpen(false);
        setEditingProduct(null);
        fetchData();
      }
    } catch (err) {
      console.error("Error updating product:", err);
      Swal.close();
      Swal.fire({
        title: "Error!",
        text: err.response?.data?.message || "Failed to update product.",
        icon: "error",
      });
    }
  };

  // Calculations for KPI Stats Cards
  const totalProductsCount = allProduct.length;
  const totalOrdersCount = orders.length;
  const activeChatsCount = chats.length;
  
  // Sum revenue
  const totalRevenue = orders.reduce((sum, order) => {
    const price = parseFloat(order.price) || 0;
    const qty = parseInt(order.quantity) || 1;
    return sum + (price * qty);
  }, 0);

  // Search filter
  const filteredProducts = allProduct.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Parse images helper
  const parseImages = (imgField) => {
    try {
      return JSON.parse(imgField) || [];
    } catch (e) {
      return [imgField];
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* 1. Dashboard KPI Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Products Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="h-12 w-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center border border-violet-100">
            <Package size={22} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500">Total Products</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-0.5">
              {isLoading ? "..." : totalProductsCount}
            </h3>
          </div>
        </div>

        {/* Total Orders Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
            <ShoppingBag size={22} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500">Total Orders</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-0.5">
              {isLoading ? "..." : totalOrdersCount}
            </h3>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <IndianRupee size={22} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500">Total Revenue</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-0.5">
              ₹{isLoading ? "..." : totalRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
          </div>
        </div>

        {/* Active Chats Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
            <MessageSquare size={22} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500">Active Chats</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-0.5">
              {isLoading ? "..." : activeChatsCount}
            </h3>
          </div>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search products by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 w-full bg-slate-50 transition-all"
          />
        </div>
        <p className="text-xs font-semibold text-slate-400">
          Showing {filteredProducts.length} of {allProduct.length} products
        </p>
      </div>

      {/* 3. Product Catalog Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-violet-500 border-t-transparent mb-4"></div>
          <p className="text-slate-500 font-medium text-sm">Loading product catalog...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center shadow-sm">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-4">
            <Package size={28} />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No Products Found</h3>
          <p className="text-slate-500 text-sm max-w-sm mx-auto mt-2">
            We couldn't find any products matching your criteria. Try adjusting your search query.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const images = parseImages(product.image);
            const displayImage = images[0] || images[1] || "";

            return (
              <div
                key={product.id}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                {/* Product Image Cover */}
                <div className="aspect-square w-full bg-slate-100 overflow-hidden relative">
                  <img
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={`${baseURL}/public/Products/${displayImage}`}
                    alt={product.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&auto=format&fit=crop&q=60";
                    }}
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-bold text-violet-700 shadow-sm border border-slate-100">
                    ₹{product.price}
                  </div>
                </div>

                {/* Info Area */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h4 className="font-bold text-slate-800 group-hover:text-violet-600 transition-colors line-clamp-1">
                      {product.name}
                    </h4>
                    <p className="text-xs text-slate-400 font-medium line-clamp-2 min-h-8">
                      {product.description || "No description provided."}
                    </p>
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-4">
                    <span className="text-xs text-slate-400 font-bold">
                      ID: #{product.id}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleEditClick(product)}
                        className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all"
                        title="Edit Product"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => deleteProductById(product.id, product.name)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                        title="Delete Product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Product Modal */}
      {isEditModalOpen && editingProduct && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-8 relative overflow-y-auto max-h-[90vh]">
            {/* Close Button */}
            <button
              onClick={() => {
                setIsEditModalOpen(false);
                setEditingProduct(null);
              }}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 p-2 rounded-xl transition-all"
            >
              <X size={20} />
            </button>

            {/* Modal Title */}
            <div className="flex items-center gap-3.5 mb-6 border-b border-slate-100 pb-5">
              <div className="h-10 w-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                <Edit size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Edit Catalog Item</h3>
                <p className="text-slate-500 text-xs">Modify the text details and upload new pictures to replace current files</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Product Name */}
                <div className="space-y-1.5">
                  <label htmlFor="edit_produc_Name" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Product Name
                  </label>
                  <input
                    type="text"
                    id="edit_produc_Name"
                    name="produc_Name"
                    value={editInputs.produc_Name}
                    onChange={handleEditChange}
                    className="w-full py-3 px-4 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-slate-50 transition-all font-medium text-slate-700"
                    required
                  />
                </div>

                {/* Product Price */}
                <div className="space-y-1.5">
                  <label htmlFor="edit_product_Price" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    id="edit_product_Price"
                    name="product_Price"
                    value={editInputs.product_Price}
                    onChange={handleEditChange}
                    className="w-full py-3 px-4 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-slate-50 transition-all font-medium text-slate-700"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label htmlFor="edit_description" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  id="edit_description"
                  name="description"
                  rows={4}
                  value={editInputs.description}
                  onChange={handleEditChange}
                  className="w-full py-3 px-4 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-slate-50 transition-all font-medium text-slate-700 resize-none"
                  required
                />
              </div>

              {/* Image Previews & Custom Upload */}
              <div className="space-y-4">
                {/* Current Images */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Current Images (Hover to remove)
                  </label>
                  <div className="flex gap-2.5 flex-wrap">
                    {editRemainingImages.map((imgName, index) => (
                      <div key={index} className="h-16 w-16 border border-slate-200 rounded-xl overflow-hidden shadow-sm relative group/currimg">
                        <img
                          src={`${baseURL}/public/Products/${imgName}`}
                          alt=""
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=100&auto=format&fit=crop";
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeCurrentImg(imgName)}
                          className="absolute -top-1.5 -right-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-1 opacity-0 group-hover/currimg:opacity-100 transition-opacity shadow-md border border-white"
                          title="Remove Image"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upload Zone */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Replace/Add Images (Optional)
                  </label>
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-5 bg-slate-50/50 hover:bg-slate-50 hover:border-violet-500 transition-all relative flex flex-col items-center text-center cursor-pointer group">
                    <input
                      multiple
                      onChange={handleEditFile}
                      type="file"
                      id="editFileInput"
                      name="upload_File"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <UploadCloud size={28} className="text-slate-400 group-hover:text-violet-600 transition-colors mb-2 stroke-1.5" />
                    <h4 className="text-xs font-bold text-slate-700">Select new files to add to pictures</h4>
                    <p className="text-[10px] text-slate-400 mt-1">PNG, JPG, or WEBP formats accepted</p>
                  </div>
                </div>

                {/* Selected Files List */}
                {editFiles.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    {editFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-150 rounded-xl">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="h-8 w-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center flex-shrink-0">
                            <FileCode size={14} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-700 truncate max-w-36">
                              {file.name}
                            </p>
                            <p className="text-[9px] text-slate-400">
                              {(file.size / 1024).toFixed(0)} KB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeEditFile(index)}
                          className="text-slate-400 hover:text-rose-500 p-1 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5 mt-5">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-xs font-bold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:shadow-md hover:shadow-indigo-500/10 text-white font-bold rounded-xl transition-all text-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllProduct;
