import React from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
// Import Swiper styles
import "swiper/css";
function Spacial() {
  return (
    <div className="py-10 container mx-auto px-5">
    <h1 className="text-center text-[50px]  font-bold">Best Selling</h1>
    <p className="text-center pt-5 pb-10">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus fugiat
      consequa
    </p>
    <Swiper
      className="grid grid-cols-1 md:grid-cols-3 gap-5  mx-auto"
      modules={[Pagination]}
      spaceBetween={50}
      pagination={{
        clickable: true,
      }}
      slidesPerView={1}
      onSlideChange={() => console.log("slide change")}
      onSwiper={(swiper) => console.log(swiper)}
      breakpoints={{
        640: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 40,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 50,
        },
      }}
    >
      <SwiperSlide className="bg-white hover:shadow-xl">
        <img className="" src="p6.jpg" alt="" />
      </SwiperSlide>
      <SwiperSlide className="bg-white hover:shadow-xl">
        <img className="" src="p2.jpg" alt="" />
      </SwiperSlide>
      <SwiperSlide className="bg-white hover:shadow-xl">
        <img className="" src="p3.jpg" alt="" />
      </SwiperSlide>
    </Swiper>
  </div>
  )
}

export default Spacial