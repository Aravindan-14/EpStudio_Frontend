import React from "react";

function Footer() {
  return (
    <div className="bg-blue-950 text-white p-10">
      <div className="flex-col  items-center md:items-start  md:flex-row flex justify-around pb-1 gap-5">
        {/* <div>
          <ul className="md:flex gap-10 text-center">
            <li className="font-light py-1 hover:text-blue-500">Home</li>
            <li className="font-light py-1 hover:text-blue-500">Collection</li>
            <li className="font-light py-1 hover:text-blue-500">About Us</li>
            <li className="font-light py-1 hover:text-blue-500">Contact</li>
          </ul>
        </div> */}
      </div>
      <div className=" text-center container mx-auto md:px-10">
        <div className="flex justify-center  gap-7 py-5">
          <div>
            <i class="fa-brands fa-instagram"></i>
          </div>
          <div>
            <i class="fa-brands fa-facebook"></i>
          </div>
          <div>
            <i class="fa-brands fa-x-twitter"></i>
          </div>
        </div>
        <small>&copy; 2024 Derss. All rights reserved.</small>
      </div>
    </div>
  );
}

export default Footer;
