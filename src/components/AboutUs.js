import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import ep from "../Assets/commenAssets/EPLogo.png"

function AboutUs() {
  return (
    <div>
      <Navbar />
      <div class="font-sans bg-white px-4 py-12">
        <div class="grid lg:grid-cols-2 gap-12 lg:max-w-6xl max-w-2xl mx-auto">
          <div class="text-left">
            <h2 class="text-gray-800 text-3xl font-bold mb-6">About Us</h2>
            <p class="mb-2 text-sm text-gray-500">Welcome to Eyam Poosu Studio, where creativity meets craftsmanship!</p>
            <p class="mb-2 text-sm text-gray-500">At Eyam Poosu Studio, we are passionate about turning your special moments into lasting memories. With expertise in photo editing and framing services, we bring life to your pictures, ensuring every detail is enhanced to perfection. Whether it's a cherished family portrait or a milestone celebration, we strive to create stunning visuals that tell your story beautifully.</p>
            <p class=" mb-2 text-sm text-gray-500">Founded with love and dedication, Eyam Poosu Studio is more than just a business—it’s a dream brought to life by two individuals who believe in the power of photography. Every image holds emotions, and our goal is to preserve those emotions through expert editing and elegant framing. With a keen eye for detail and a commitment to quality, we ensure that every project we undertake is handled with care and precision.</p>
            <p class=" mb-2 text-sm text-gray-500">Our mission is simple: to provide high-quality photo enhancements and custom framing solutions that exceed expectations. We take pride in delivering exceptional craftsmanship, ensuring that your photos are not just pictures but treasured keepsakes. Let Eyam Poosu Studio help you relive your best moments through artfully edited and beautifully framed memories.</p>
            {/* <p class="mb-3 text-sm text-gray-500">Thank you for being a part of our journey. We look forward to creating something beautiful for you!</p> */}
          </div>
          <div className='flex justify-center items-center'>
            <img src={ep} alt="Placeholder Image" class="rounded-lg object-contain w-96 h-full" />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default AboutUs