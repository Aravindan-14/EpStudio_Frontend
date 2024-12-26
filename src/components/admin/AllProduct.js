import axios from "axios";
import React, { useEffect, useState } from "react";

function AllProduct() {
  const [allProduct, setAllProduct] = useState([]);
  useEffect(() => {
    axios
      .get("process.env.APIBASEURL/product/allProducts")
      .then((res) => setAllProduct(res.data))
      .catch((err) => {
        console.log(err);
      });
  }, [allProduct]);

  console.log(allProduct);

  const deleteProdectById = async (id) => {
    try {
      const response = await axios.post(
        "process.env.APIBASEURL/product/deleteById",
        { id }
      );
      console.log("Product deleted successfully:", response.data);
      setAllProduct((prevProducts) =>
        prevProducts.filter((val) => val.id !== id)
      );
    } catch (error) {
      console.error(
        "Error deleting product:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold uppercase py-5">All Products</h1>
      <div>
        <div className="bg-gray-200 p-5 w-full">
          {allProduct.map((product) => {
            let image = JSON.parse(product.image);
            return (
              <tr
                key={product.id} // Always include a unique key when mapping over lists
                className="text-left bg-white border-b dark:bg-gray-800 dark:border-gray-700 w-full flex justify-between items-center"
              >
                <td className="px-6 py-4 h-20 w-20 bg-red-200 m-2">
                  <img
                    className="h-full w-full object-cover"
                    src={`process.env.APIBASEURL/public/Products/` + image[1]}
                    alt={product.name}
                  />
                </td>
                <td className="px-6 py-4">{product.name}</td>
                <td className="px-6 py-4">${product.price}</td>
                <td className="px-6 py-4 max-w-96">
                  {product.description.substring(
                    0,
                    Math.min(product.description.length, 50)
                  ) + "..."}
                </td>
                <td className="px-6 py-4 text-right">
                  <a
                    href="#"
                    className="cursor-pointer font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    Edit
                  </a>
                  <span
                    onClick={() => {
                      deleteProdectById(product.id);
                    }}
                    className="pl-8 text-red-400 cursor-pointer"
                  >
                    <i class="fa-solid fa-trash"></i>
                  </span>
                </td>
              </tr>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default AllProduct;
