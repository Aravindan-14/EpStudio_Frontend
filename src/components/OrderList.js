import React, { useContext, useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { DataContext } from "./Contexts/DataContext";
import axios from "axios";
import { Link } from "react-router-dom";
import { baseURL } from "../Utils/ServerUrl";
import { 
  Search, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  Eye, 
  X,
  ShoppingBag
} from "lucide-react";
import Swal from "sweetalert2";

function OrderList({ show }) {
  const { users } = useContext(DataContext);
  const [order, setOrder] = useState([]);
  const [filter, setFilter] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1); // Fixed initial page from 12 to 1
  const rowsPerPage = 6;

  // Filtered data based on role and text search
  const displayOrders = users?.role === "Admin" 
    ? order 
    : order.filter((item) => item.User_ID === users?.id);

  const filteredData = displayOrders.filter((item) => {
    const term = filter.toLowerCase();
    return (
      (item.product_Name && item.product_Name.toLowerCase().includes(term)) ||
      (item.id && item.id.toString().includes(term)) ||
      (item.Product_ID && item.Product_ID.toString().includes(term))
    );
  });

  // Sorting logic
  const sortedData = [...filteredData].sort((a, b) => {
    if (sortConfig.key) {
      const valA = a[sortConfig.key] ? a[sortConfig.key].toString() : "";
      const valB = b[sortConfig.key] ? b[sortConfig.key].toString() : "";
      if (sortConfig.direction === "asc") {
        return valA.localeCompare(valB, undefined, { numeric: true });
      } else {
        return valB.localeCompare(valA, undefined, { numeric: true });
      }
    }
    return 0;
  });

  // Pagination calculations
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = sortedData.slice(indexOfFirstRow, indexOfLastRow);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Local state status change handler
  const handleStatusChange = (orderId, newStatus) => {
    setOrder((prevOrders) =>
      prevOrders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: `Order #${orderId} status changed to ${newStatus}`,
      showConfirmButton: false,
      timer: 2500,
    });
  };

  // Get orders on mount
  useEffect(() => {
    const getUserOrders = async () => {
      try {
        const res = await axios.get(`${baseURL}/purchase/getUserOrders`);
        if (res.status === 200 && res.data?.orders) {
          setOrder(res.data.orders);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };
    getUserOrders();
  }, []);

  // Reset pagination on search filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [img, setImg] = useState("");

  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

  // Helper function to return beautiful styling for status options
  const getStatusColorClass = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 focus:ring-emerald-500/20";
      case "Processing":
        return "bg-amber-50 text-amber-700 border-amber-200 focus:ring-amber-500/20";
      case "Out of Delivery":
        return "bg-rose-50 text-rose-700 border-rose-200 focus:ring-rose-500/20";
      default: // Accepted / other
        return "bg-blue-50 text-blue-700 border-blue-200 focus:ring-blue-500/20";
    }
  };

  const tableHeaderCell = (label, sortKey) => (
    <th 
      className={`py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-center ${sortKey ? "cursor-pointer select-none hover:text-slate-800" : ""}`}
      onClick={sortKey ? () => requestSort(sortKey) : undefined}
    >
      <div className="flex items-center justify-center gap-1.5 mx-auto">
        <span>{label}</span>
        {sortKey && <ArrowUpDown size={14} className="text-slate-400" />}
      </div>
    </th>
  );

  return (
    <div className={`min-h-screen ${show ? "bg-transparent p-0" : "bg-slate-50 flex flex-col justify-between"}`}>
      {!show && <Navbar />}
      
      <div className={`container mx-auto ${show ? "p-0" : "p-8 max-w-7xl"}`}>
        {!show && (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Your Order Book</h2>
              <p className="text-slate-500 text-sm">Track your studio product deliveries and purchase status</p>
            </div>
          </div>
        )}

        {/* Filter & Controls Panel */}
        <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm mb-6 gap-4 flex-col sm:flex-row">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Order ID or Product Name..."
              className="pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 w-full bg-slate-50 transition-all"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <div className="text-xs font-semibold text-slate-400">
            Found {filteredData.length} records
          </div>
        </div>

        {/* Orders Table Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  {tableHeaderCell("S No")}
                  {tableHeaderCell("Order ID", "id")}
                  {tableHeaderCell("Product ID", "Product_ID")}
                  {tableHeaderCell("Customer File")}
                  {tableHeaderCell("Product Name", "product_Name")}
                  {tableHeaderCell("Price", "price")}
                  {tableHeaderCell("Quantity", "quantity")}
                  {tableHeaderCell("Status", "status")}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100 text-slate-600 text-sm">
                {currentRows.length > 0 ? (
                  currentRows.map((item, index) => (
                    <tr key={item.id || index} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 text-center font-semibold text-slate-400">
                        {indexOfFirstRow + index + 1}
                      </td>
                      <td className="py-4 px-6 text-center font-bold text-slate-800">
                        #{item.id}
                      </td>
                      <td className="py-4 px-6 text-center text-xs font-medium text-slate-400">
                        #{item.Product_ID}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex justify-center">
                          <div className="relative group/img h-12 w-12 rounded-xl overflow-hidden cursor-pointer border border-slate-200 shadow-sm bg-slate-50 flex items-center justify-center">
                            <img
                              className="h-full w-full object-cover group-hover/img:scale-110 transition-transform duration-300"
                              src={`${baseURL}/public/Customer/${item.image}`}
                              alt=""
                              onClick={() => {
                                setImg(item.image);
                                setIsFullscreen(true);
                              }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200&auto=format&fit=crop";
                              }}
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                              <Eye size={16} className="text-white" />
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center font-bold text-violet-600 hover:text-violet-800 transition-colors">
                        <Link to={`/Description/${item.Product_ID}`}>
                          {item.product_Name}
                        </Link>
                      </td>
                      <td className="py-4 px-6 text-center font-semibold text-slate-800">
                        ₹{item.price}
                      </td>
                      <td className="py-4 px-6 text-center font-semibold text-slate-500">
                        {item.quantity}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex justify-center">
                          <select
                            className={`rounded-xl px-3 py-1.5 text-xs font-bold border outline-none transition-all focus:ring-2 cursor-pointer ${getStatusColorClass(
                              item.status
                            )}`}
                            value={item.status || "Accepted"}
                            onChange={(e) => handleStatusChange(item.id, e.target.value)}
                            disabled={users?.role !== "Admin"}
                          >
                            <option value="Accepted">Accepted</option>
                            <option value="Processing">Processing</option>
                            <option value="Out of Delivery">Out of Delivery</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <ShoppingBag size={36} className="mb-3 stroke-1" />
                        <h4 className="font-bold text-slate-700">No Orders Found</h4>
                        <p className="text-slate-500 text-xs mt-1">There are no matching entries in the registry.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
              <div className="text-xs text-slate-500 font-semibold">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => paginate(1)}
                  disabled={currentPage === 1}
                  className="p-1.5 border border-slate-200 rounded-lg hover:bg-white text-slate-500 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronsLeft size={16} />
                </button>
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-1.5 border border-slate-200 rounded-lg hover:bg-white text-slate-500 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                      currentPage === number
                        ? "bg-violet-600 border-violet-600 text-white shadow-sm"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {number}
                  </button>
                ))}

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-1.5 border border-slate-200 rounded-lg hover:bg-white text-slate-500 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
                <button
                  onClick={() => paginate(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-1.5 border border-slate-200 rounded-lg hover:bg-white text-slate-500 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronsRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Image Preview Modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeFullscreen}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl p-2 border border-white/10">
            <button
              onClick={closeFullscreen}
              className="absolute top-4 right-4 bg-slate-950/60 hover:bg-slate-950/80 p-2 rounded-full text-white backdrop-blur-sm transition-all"
            >
              <X size={20} />
            </button>
            <img
              src={`${baseURL}/public/Customer/${img}`}
              alt=""
              className="w-full h-full max-h-[85vh] object-contain rounded-2xl"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop";
              }}
            />
          </div>
        </div>
      )}

      {!show && <Footer />}
    </div>
  );
}

export default OrderList;
