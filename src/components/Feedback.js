import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { baseURL } from '../Utils/ServerUrl';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { Star, CheckCircle2, Quote } from "lucide-react";

function Feedback() {
    const [feedback, setFeedback] = useState([]);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const res = await axios.get(`${baseURL}/purchase/GetFeedback`);
                setFeedback(res.data.data || []);
            } catch (error) {
                console.error("Error fetching feedback:", error);
            }
        };

        fetchFeedback();
    }, []);

    const getAvatarColor = (name) => {
        const colors = [
            "from-pink-500 to-rose-500",
            "from-purple-500 to-indigo-500",
            "from-blue-500 to-cyan-500",
            "from-emerald-500 to-teal-500",
            "from-amber-500 to-orange-500"
        ];
        let sum = 0;
        const displayName = name || "User";
        for (let i = 0; i < displayName.length; i++) sum += displayName.charCodeAt(i);
        return colors[sum % colors.length];
    };

    return (
        <div className="container mx-auto px-4 py-12 flex flex-col items-center">
            {/* Header Content */}
            <div className="text-center mb-8 select-none">
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 font-sans">
                    Client Feedback
                </h1>
                <p className="text-slate-500 mt-2 text-xs font-semibold tracking-wide uppercase">
                    ★ What Our Members Say ★
                </p>
            </div>

            {/* Swiper Slider Wrapper */}
            <div className="w-full max-w-md px-2">
                <Swiper
                    modules={[Autoplay]}
                    autoplay={{ delay: 3500, disableOnInteraction: false }}
                    loop={feedback.length > 1}
                    spaceBetween={16}
                    slidesPerView={1}
                    className="w-full pb-6"
                >
                    {feedback.map((val, index) => {
                        return (
                            <SwiperSlide key={val.id || index}>
                                <div className="bg-white border border-slate-100 rounded-3xl shadow-[0_15px_30px_-10px_rgba(0,0,0,0.08)] p-6 relative flex flex-col justify-between overflow-hidden mx-1 my-3 min-h-[220px]">
                                    
                                    {/* Decorative Quote Icon in background */}
                                    <Quote size={50} className="absolute right-4 bottom-12 text-slate-100/60 pointer-events-none transform rotate-180 z-0" />

                                    <div className="relative z-10">
                                        {/* Card Header (User Avatar & Name) */}
                                        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`h-9 w-9 rounded-full bg-gradient-to-tr ${getAvatarColor(val.CustomerName)} flex items-center justify-center text-white text-xs font-extrabold shadow-sm`}>
                                                    {val.CustomerName ? val.CustomerName.charAt(0).toUpperCase() : "U"}
                                                </div>
                                                <div>
                                                    <h3 className="font-extrabold text-sm text-slate-800 tracking-wide">
                                                        {val.CustomerName || "Anonymous"}
                                                    </h3>
                                                    <span className="text-[10px] text-slate-400 font-medium">
                                                        Verified Customer
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Star Rating */}
                                            <div className="flex gap-0.5">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star 
                                                        key={star} 
                                                        size={13} 
                                                        fill={star <= (val.Rating || val.rating || 0) ? "currentColor" : "none"} 
                                                        className={star <= (val.Rating || val.rating || 0) ? "text-amber-500" : "text-slate-200"} 
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        {/* Feedback Text */}
                                        <p className="text-slate-700 text-xs font-semibold font-gloria leading-relaxed text-center px-2 py-1 min-h-[50px] flex items-center justify-center">
                                            "{val.Feedback || val.feedback}"
                                        </p>
                                    </div>

                                    {/* Verified Stamp / Footer */}
                                    <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-3 relative z-10 select-none">
                                        <div className="flex items-center gap-1 text-[9px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                                            <CheckCircle2 size={10} className="stroke-[3px]" />
                                            <span>Verified Purchase</span>
                                        </div>
                                        <span className="text-[9px] text-slate-400 font-bold">
                                            EpStudio Member
                                        </span>
                                    </div>

                                </div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </div>
        </div>
    );
}

export default Feedback;