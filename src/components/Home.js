import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Autoplay, Navigation, Pagination, EffectFade } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, Image as ImageIcon, Camera } from "lucide-react";

function Home() {
  const navigate = useNavigate();

  const handleScrollToCollection = () => {
    const element = document.getElementById("Collection");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.hash = "#Collection";
    }
  };

  const slides = [
    {
      image: "banner1.png",
      tagline: "Exquisite Craftsmanship",
      icon: <Sparkles size={12} className="text-indigo-400" />,
      title: "Frame the Memories",
      highlight: "Memories",
      description: "Preserve your most cherished moments in custom, hand-crafted luxury frames designed to last generations.",
      primaryText: "Explore Collections",
      primaryAction: handleScrollToCollection,
      secondaryText: "Custom Framing",
      secondaryAction: () => navigate("/contact"),
    },
    {
      image: "banner2.png",
      tagline: "Professional Restoration",
      icon: <ImageIcon size={12} className="text-cyan-400" />,
      title: "Precision Photo Retouching",
      highlight: "Retouching",
      description: "Enhance your photographs with expert color correction, restoration, and digital artistry tailored for flawless prints.",
      primaryText: "View Products",
      primaryAction: handleScrollToCollection,
      secondaryText: "Get In Touch",
      secondaryAction: () => navigate("/contact"),
    },
    {
      image: "banner3.png",
      tagline: "Museum Quality Printing",
      icon: <Camera size={12} className="text-emerald-400" />,
      title: "Vibrant Fine Art Prints",
      highlight: "Prints",
      description: "Museum-quality giclée canvas printing and high-definition photo papers for stunning gallery displays.",
      primaryText: "Browse Prints",
      primaryAction: handleScrollToCollection,
      secondaryText: "Contact Us",
      secondaryAction: () => navigate("/contact"),
    },
  ];

  return (
    <div className="relative w-full">
      <Swiper
        spaceBetween={0}
        effect={"fade"}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 5500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          el: ".custom-swiper-pagination",
        }}
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        className="w-full min-h-[520px] md:min-h-[650px] lg:min-h-[720px]"
      >
        {slides.map((slide, idx) => {
          const parts = slide.title.split(slide.highlight);
          return (
            <SwiperSlide key={idx}>
              <div className="relative w-full min-h-[520px] md:min-h-[650px] lg:min-h-[720px] flex items-center justify-start overflow-hidden">
                {/* Background Image with Slow Ambient Zoom */}
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="absolute inset-0 w-full h-full object-cover object-center scale-105 animate-zoom-slow"
                />

                {/* Dark Luxury Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent z-10" />
                <div className="absolute inset-0 bg-black/25 z-10 pointer-events-none" />

                {/* Content Container */}
                <div className="relative z-20 w-full max-w-6xl mx-auto px-6 md:px-12 lg:px-20 text-left text-white flex flex-col gap-5 py-24 select-none">
                  {/* Tagline Badge */}
                  <span className="w-fit text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-indigo-300 bg-indigo-500/10 px-4 py-2 rounded-full border border-indigo-500/20 shadow-sm backdrop-blur-md flex items-center gap-1.5 animate-fade-in-up-1">
                    {slide.icon}
                    {slide.tagline}
                  </span>

                  {/* Title */}
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight max-w-2xl animate-fade-in-up-2">
                    {parts[0]}
                    <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-sm">
                      {slide.highlight}
                    </span>
                    {parts[1]}
                  </h2>

                  {/* Description */}
                  <p className="text-slate-300 text-sm md:text-base leading-relaxed tracking-wide max-w-lg animate-fade-in-up-3">
                    {slide.description}
                  </p>

                  {/* Button Action Rows */}
                  <div className="flex flex-wrap items-center gap-4 mt-4 animate-fade-in-up-4">
                    <button
                      onClick={slide.primaryAction}
                      className="group flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs tracking-wider uppercase px-7 py-4 rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                    >
                      <span>{slide.primaryText}</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button
                      onClick={slide.secondaryAction}
                      className="bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs tracking-wider uppercase px-7 py-4 rounded-xl backdrop-blur-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                    >
                      {slide.secondaryText}
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}

        {/* Custom Navigation Buttons */}
        <button className="swiper-button-prev-custom absolute left-6 top-1/2 -translate-y-1/2 z-30 h-11 w-11 rounded-full bg-black/30 hover:bg-black/50 border border-white/10 backdrop-blur-sm flex items-center justify-center text-white transition-all hidden md:flex hover:scale-105 active:scale-95">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button className="swiper-button-next-custom absolute right-6 top-1/2 -translate-y-1/2 z-30 h-11 w-11 rounded-full bg-black/30 hover:bg-black/50 border border-white/10 backdrop-blur-sm flex items-center justify-center text-white transition-all hidden md:flex hover:scale-105 active:scale-95">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Custom Pagination Container */}
        <div className="custom-swiper-pagination absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2 select-none" />
      </Swiper>
    </div>
  );
}

export default Home;
