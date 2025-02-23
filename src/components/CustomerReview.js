"use client";
import React, { useEffect, useState } from "react";
import DraggablePaper from "./draggable-paper";
import pin from "../Assets/commenAssets/pin.png"
import bgBanner from "../Assets/commenAssets/wood.jpg"
import axios from "axios";
import { baseURL } from "../Utils/ServerUrl";
function CustomerReview() {
    const [positions, setPositions] = useState([
        { x: 30, y: 30 },
        { x: 30, y: 30 },
        { x: 30, y: 30 },
        { x: 30, y: 30 },
        { x: 30, y: 30 },
        { x: 35, y: 30 },
        { x: 30, y: 30 },
        { x: 30, y: 30 },
        { x: 30, y: 35 },
        { x: 30, y: 30 },
    ]);
    const [stackOrder, setStackOrder] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const [feedback, setFeedback] = useState([])
    const bringToFront = (index) => {
        setStackOrder((prevOrder) => {
            const newOrder = prevOrder.filter((i) => i !== index);
            return [...newOrder, index];
        });
    };

    useEffect(() => {
        const getRandomPosition = () => {
            const maxX = window.innerWidth - 250;
            const maxY = window.innerHeight - 500;
            return {
                x: Math.max(10, Math.floor(Math.random() * maxX)),
                y: Math.max(10, Math.floor(Math.random() * maxY)),
            };
        };

        setPositions([
            getRandomPosition(),
            getRandomPosition(),
            getRandomPosition(),
            getRandomPosition(),
            getRandomPosition(),
            getRandomPosition(),
            getRandomPosition(),
            getRandomPosition(),
            getRandomPosition(),
            getRandomPosition(),
        ]);
    }, []);

    const getZIndex = (index) => {
        return stackOrder.indexOf(index);
    };

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

    return (
        <div style={{ backgroundImage: `url(${bgBanner})` }} className="bg-cover bg-center bg-no-repeat min-h-screen overflow-hidden p-8">
            <h1 className="font-paint text-8xl text-center text-teal-500 bg-gradient-to-r from-blue-700 to-pink-800 bg-clip-text text-transparent">Customer Review</h1>
            {
                feedback.map((val, index) => {
                    return (
                        <div style={{ zIndex: getZIndex(9) }} onClick={() => bringToFront(9)}>
                            <DraggablePaper initialPosition={positions[index]}>
                                <div className="lg:w-[300px] sm:w-[100px] relative top-14 left-5 p-4">
                                    <div className="space-y-2">
                                        <div className="p-3rounded">
                                            <div className="text-gray-700 font-semibold flex justify-between">
                                                <div className="flex justify-center items-center gap-1">
                                                    <div className="h-6 w-6 bg-black rounded-full"><img src="" alt="" /></div>
                                                    <span>{val.CustomerName}</span>
                                                </div>
                                                <div>
                                                    {[...Array(5)].map((_, index) => (
                                                        <i class={`fa-solid fa-star ${index < val.Rating ? "text-yellow-400" : "text-gray-300"}`}></i>

                                                    ))}
                                                </div>
                                            </div>
                                            <div className="text-blue-800 text-sm mt-4 font-gloria">{val.Feedback}</div>
                                        </div>
                                    </div>
                                    <img className="h-10 w-10 absolute -top-1 left-[40%]" src={pin} alt="" />
                                </div>
                            </DraggablePaper>
                        </div>
                    )
                })
            }
        </div>
    );
}

export default CustomerReview;