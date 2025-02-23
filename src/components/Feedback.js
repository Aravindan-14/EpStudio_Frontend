import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { baseURL } from '../Utils/ServerUrl';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

function Feedback() {
    const [feedback, setFeedback] = useState([])

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const res = await axios.get(`${baseURL}/purchase/GetFeedback`);

                console.log(res.data.data);

                setFeedback(res.data.data); // Assuming the response has a `data` field with the feedback

            } catch (error) {
                console.error("Error fetching feedback:", error);

            }
        };

        fetchFeedback();
    }, []);

    console.log(feedback);

    return (
        <div className='container mx-auto p-5 py-10'>
            <h1 className='text-[50px] font-bold text-center py-5'>Feedback</h1>
            <div class="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div class="flex flex-wrap gap-4">
                    <Swiper
                        modules={[Autoplay]}
                        autoplay={{ delay: 2000, disableOnInteraction: false }}
                        loop={true} 
                    >
                        {feedback.map((val, index) => {
                            return (
                                <SwiperSlide>
                                    <div className='bg-slate-200 p-2 rounded-xl'>
                                        <div className='flex  justify-between mb-2'>
                                            <div className='flex gap-2'>
                                                <div className='h-6 w-6 rounded-full bg-black'><img src="" alt="" /> </div><h3>Aravind</h3>
                                            </div>
                                            <div >
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <span
                                                        key={star}
                                                        className={`${star <= val.Rating ? "text-[#FFBA18]" : "text-gray-400"
                                                            }`}
                                                    >
                                                        <i class={`fa-sharp fa-solid fa-star`}></i>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <p className='text-sm pl-2'>{val.Feedback}</p>
                                    </div>
                                </SwiperSlide>
                            )
                        })}
                    </Swiper>
                </div>
            </div>
        </div>
    )
}

export default Feedback