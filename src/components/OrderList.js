import React, { useContext, useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { DataContext } from "./Contexts/DataContext";
import axios from "axios";
import { Link } from "react-router-dom";
function OrderList({ show }) {
  const { users, isAuth, setIsAuth } = useContext(DataContext);
  const [order, setOrder] = useState([]);
  console.log(order);
  

  // States for filter, sorting, and pagination
  const [filter, setFilter] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(12); // Start at page 12 for testing
  const rowsPerPage = 6;

  // Filtered and sorted data
  const filteredData = order.filter((item) => {
    return (
      item.product_Name.toLowerCase().includes(filter.toLowerCase()) ||
      item.id == filter
    );
  });

  // Sorting logic
  const sortedData = [...filteredData].sort((a, b) => {
    if (sortConfig.key) {
      if (sortConfig.direction === "asc") {
        return a[sortConfig.key].localeCompare(b[sortConfig.key]);
      } else {
        return b[sortConfig.key].localeCompare(a[sortConfig.key]);
      }
    }
    return 0;
  });

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = sortedData.slice(indexOfFirstRow, indexOfLastRow);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Sort handler
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Handle status change
  const handleStatusChange = (index, newStatus) => {
    // const updatedData = [...data];
    // updatedData[index].status = newStatus;
    // setData(updatedData);
  };

  // Calculate total pages
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  // Pagination buttons
  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-center items-center space-x-2 mt-4">
        <button
          onClick={() => paginate(1)}
          className={`px-2 py-1 ${
            currentPage === 1
              ? "text-gray-500 cursor-not-allowed"
              : "text-gray-700"
          }`}
          disabled={currentPage === 1}
        >
          <i className="fas fa-angle-double-left"></i>
        </button>
        <button
          onClick={() => paginate(currentPage - 1)}
          className={`px-2 py-1 ${
            currentPage === 1
              ? "text-gray-500 cursor-not-allowed"
              : "text-gray-700"
          }`}
          disabled={currentPage === 1}
        >
          <i className="fas fa-angle-left"></i>
        </button>
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`px-2 py-1 ${
              currentPage === number
                ? "bg-blue-500 text-white rounded-full"
                : "text-gray-700"
            }`}
          >
            {number}
          </button>
        ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          className={`px-2 py-1 ${
            currentPage === totalPages
              ? "text-gray-500 cursor-not-allowed"
              : "text-gray-700"
          }`}
          disabled={currentPage === totalPages}
        >
          <i className="fas fa-angle-right"></i>
        </button>
        <button
          onClick={() => paginate(totalPages)}
          className={`px-2 py-1 ${
            currentPage === totalPages
              ? "text-gray-500 cursor-not-allowed"
              : "text-gray-700"
          }`}
          disabled={currentPage === totalPages}
        >
          <i className="fas fa-angle-double-right"></i>
        </button>
      </div>
    );
  };

  //get total orders

  useEffect(() => {
    const getUserOrders = async () => {
      const res = await axios.get(
        "https://epstudio-api.onrender.com/purchase/getUserOrders"
      );
      console.log(res.data);
      if (res.status == 200) {
        setOrder(res.data.orders);
      }
    };

    getUserOrders();
  }, []);



  const filteredOrder = order.filter((item) => {
    return item.User_ID == users.id;
  });

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [img, setimg] = useState();

  const closeFullscreen = () => {
    setIsFullscreen(false);
  };
  return (
    <div>
      {show ? "" : <Navbar />}
      <div className="flex justify-center items-center md:w-full h-auto overflow-y-scroll md:mx-auto  overflow-x-scroll no-scrollbar">
        <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Total Orders
          </h2>

          {/* Filter Input (moved to the right) */}
          <div className="flex justify-end mb-4">
            <input
              type="text"
              placeholder="Search by Order ID"
              className="w-1/4 p-2 border border-gray-300 rounded-md"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-center">S No</th>
                  <th className="py-3 px-6 text-center">Order ID</th>
                  <th className="py-3 px-6 text-center">Product ID</th>
                  <th className="py-3 px-6 text-center">
                    {users.role == "Adimn" ? "Customer Image" : "Your Image"}
                  </th>
                  <th
                    className="py-3 px-6 text-center cursor-pointer"
                    onClick={() => requestSort("name")}
                  >
                    Product Name
                    {sortConfig.key === "name" &&
                    sortConfig.direction === "asc" ? (
                      <i className="fa fa-sort-up ml-2"></i>
                    ) : (
                      <i className="fa fa-sort-down ml-2"></i>
                    )}
                  </th>
                  <th
                    className="py-3 px-6 text-center cursor-pointer"
                    onClick={() => requestSort("email")}
                  >
                    Product Price
                    {sortConfig.key === "email" &&
                    sortConfig.direction === "asc" ? (
                      <i className="fa fa-sort-up ml-2"></i>
                    ) : (
                      <i className="fa fa-sort-down ml-2"></i>
                    )}
                  </th>
                  <th className="py-3 px-6 text-center">Qty</th>
                  <th className="py-3 px-6 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {currentRows.length > 0 ? (
                  (users.role == "Admin" ? order : filteredOrder).map(
                    (item, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-200 hover:bg-gray-100"
                      >
                        <td className="py-3 px-6  whitespace-nowrap text-center">
                          <span className="font-medium">{index + 1}</span>
                        </td>
                        <td className="py-3 px-6  whitespace-nowrap text-center">
                          <span className="font-medium">{item.id}</span>
                        </td>
                        <td className="py-3 px-6  whitespace-nowrap text-center">
                          <span className="font-medium">{item.Product_ID}</span>
                        </td>
                        <td className="py-3 px-6  whitespace-nowrap flex justify-center">
                          <img
                            className="h-10 w-10 object-cover"
                            src={`https://epstudio-api.onrender.com/public/Customer/${item.image}`}
                            alt=""
                            onClick={() => {
                              setimg(item.image);
                              setIsFullscreen(true);
                            }}
                          />
                        </td>
                        <td className="py-3 px-6 text-center whitespace-nowrap">
                          <Link to={`/Description/${item.Product_ID}`}>
                            <span className="font-medium text-blue-500">
                              {item.product_Name}
                            </span>
                          </Link>
                        </td>
                        <td className="py-3 px-6 text-center whitespace-nowrap">
                          <span className="font-medium">{item.price}</span>
                        </td>
                        <td className="py-3 px-6 text-center">
                          {item.quantity}
                        </td>
                        <td className="py-3 px-6 text-center">
                          <select
                            className="rounded-md p-2"
                            value={item.status}
                            onChange={(e) =>
                              handleStatusChange(index, e.target.value)
                            }
                            disabled={users.role != "Admin"}
                          >
                            <option value="Accepted" selected>
                              Accepted
                            </option>
                            <option value="Processing">Processing</option>
                            <option value="Out of Delivery">
                              Out of Delivery
                            </option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="py-3 px-6 text-center text-gray-500"
                    >
                      No matching records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {renderPagination()}
          {isFullscreen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center"
              onClick={closeFullscreen}
            >
              <img
                src={`https://epstudio-api.onrender.com/public/Customer/${img}`}
                alt={img}
                className="max-w-[90%] max-h-[90%]"
              />
            </div>
          )}
        </div>
      </div>

      {show ? "" : <Footer />}
    </div>
  );
}

export default OrderList;
