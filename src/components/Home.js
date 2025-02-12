import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";

function Home() {
  return (
    <div>
      <Swiper
        className=" mySwiper "
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
          <div class="relative font-sans before:absolute before:w-full before:h-full before:inset-0 before:bg-black before:opacity-50 before:z-10">
            <img src="banner1.png" alt="Banner Image" class="absolute inset-0 w-full h-full object-cover" />

            <div class="min-h-[500px] relative z-50 h-full max-w-6xl mx-auto flex flex-col justify-center items-center text-center text-white p-6">
              <h2 class="sm:text-4xl text-2xl font-bold mb-6">Frame the Memories</h2>
              <p class="sm:text-lg text-base text-center text-gray-200">Professional Photo Editing & Framing Services to enhance and preserve your special moments.</p>

              <button
                type="button"
                class="mt-12 bg-transparent text-white text-base py-3 px-6 border border-white rounded-lg hover:bg-white hover:text-black transition duration-300">
                See More
              </button>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}

export default Home;
