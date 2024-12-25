import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";

function Home() {
  return (
    <div>
      <Swiper
        className="md:h-screen mySwiper "
        spaceBetween={0}
        slidesPerView={1}
        onSlideChange=""
        onSwiper={(swiper) => console.log(swiper)}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        modules={[Autoplay]}
      >
        <SwiperSlide>
          <img
            className="object-cover h-full w-full"
            src="banner1.jpg"
            alt=""
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            className="object-cover h-full w-full"
            src="banner1.jpg"
            alt=""
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            className="object-cover h-full w-full"
            src="banner1.jpg"
            alt=""
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            className="object-cover h-full w-full"
            src="banner1.jpg"
            alt=""
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
}

export default Home;
