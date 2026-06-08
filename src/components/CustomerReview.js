"use client";
import React, { useEffect, useState } from "react";
import DraggablePaper from "./draggable-paper";
import pin from "../Assets/commenAssets/pin.png";
import bgBanner from "../Assets/commenAssets/wood.jpg";
import axios from "axios";
import { baseURL } from "../Utils/ServerUrl";
import { Star, CheckCircle2 } from "lucide-react";

// Beautiful, harmonious pastel color palettes for the pinned sticky notes
const noteColors = [
    { bg: "bg-[#fffdf0]", border: "border-amber-200/60", text: "text-amber-900", star: "text-amber-500", ribbon: "bg-amber-100 text-amber-700" }, // Warm Cream
    { bg: "bg-[#f4faf6]", border: "border-emerald-200/60", text: "text-emerald-900", star: "text-emerald-500", ribbon: "bg-emerald-100 text-emerald-700" }, // Soft Sage
    { bg: "bg-[#f1f7fc]", border: "border-blue-200/60", text: "text-blue-900", star: "text-blue-500", ribbon: "bg-blue-100 text-blue-700" }, // Cool Azure
    { bg: "bg-[#faf5fc]", border: "border-purple-200/60", text: "text-purple-900", star: "text-purple-500", ribbon: "bg-purple-100 text-purple-700" }, // Lavender
    { bg: "bg-[#fff6f6]", border: "border-rose-200/60", text: "text-rose-900", star: "text-rose-500", ribbon: "bg-rose-100 text-rose-700" }, // Coral Blush
];

function CustomerReview() {
    const [positions, setPositions] = useState([]);
    const [stackOrder, setStackOrder] = useState([]);
    const [feedback, setFeedback] = useState([]);

    const bringToFront = (index) => {
        setStackOrder((prevOrder) => {
            const newOrder = prevOrder.filter((i) => i !== index);
            return [...newOrder, index];
        });
    };

    const getZIndex = (index) => {
        const orderIndex = stackOrder.indexOf(index);
        return orderIndex === -1 ? index : orderIndex;
    };

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const res = await axios.get(`${baseURL}/purchase/GetFeedback`);
                const data = res.data.data || [];
                setFeedback(data);
                setStackOrder(data.map((_, idx) => idx));

                const maxX = window.innerWidth - 320;
                const maxY = window.innerHeight - 380;
                
                const getRandomPosition = (idx) => {
                    // Spread elements across screen dynamically
                    const cols = 4;
                    const colWidth = maxX / cols;
                    const col = idx % cols;
                    const xOffset = col * colWidth + Math.floor(Math.random() * (colWidth - 280));
                    
                    return {
                        x: Math.max(40, Math.min(xOffset, maxX)),
                        y: Math.max(120, Math.floor(Math.random() * (maxY - 120)) + 60),
                    };
                };

                setPositions(data.map((_, idx) => getRandomPosition(idx)));
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
        <div 
            style={{ backgroundImage: `url(${bgBanner})` }} 
            className="bg-cover bg-center bg-no-repeat min-h-screen overflow-hidden p-8 relative flex flex-col"
        >
            {/* Ambient Lighting / Spotlight Board Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_20%,_rgba(0,0,0,0.45)_100%)] pointer-events-none z-0" />

            {/* Header Content */}
            <div className="relative z-10 flex flex-col items-center mb-6 mt-2 select-none">
                <h1 className="text-6xl font-extrabold tracking-tight text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)] font-sans">
                    Customer Stories
                </h1>
                <p className="text-slate-200 mt-3 text-xs font-semibold tracking-wide bg-black/45 backdrop-blur-md px-5 py-2 rounded-full border border-white/10 shadow-lg flex items-center gap-1.5">
                    <span>📌</span> Drag & organize the pinned notes to explore reviews
                </p>
            </div>

            {/* Sticky Notes Canvas */}
            <div className="flex-1 relative z-10 w-full">
                {feedback.map((val, index) => {
                    const color = noteColors[index % noteColors.length];
                    const rotation = (index * 7) % 10 - 5; // Organic rotation offset between -5deg and +4deg
                    const pos = positions[index] || { x: 80 + index * 50, y: 160 + (index % 3) * 85 };

                    return (
                        <div 
                            key={val.id || index}
                            style={{ zIndex: getZIndex(index) }} 
                            onClick={() => bringToFront(index)}
                        >
                            <DraggablePaper initialPosition={pos} rotation={rotation}>
                                <div className={`w-[260px] min-h-[220px] p-5 rounded-md shadow-[0_12px_24px_-10px_rgba(0,0,0,0.35)] border ${color.bg} ${color.border} flex flex-col justify-between relative transition-all duration-300 hover:shadow-[0_22px_40px_-12px_rgba(0,0,0,0.45)] hover:rotate-0`}>
                                    
                                    {/* 3D Pinned Pushpin */}
                                    <img 
                                        className="h-9 w-9 absolute -top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none select-none" 
                                        src={pin} 
                                        style={{ filter: "drop-shadow(2px 6px 3px rgba(0,0,0,0.38))" }}
                                        alt="Pin" 
                                    />

                                    <div>
                                        {/* Card Header (User Avatar & Name) */}
                                        <div className="flex items-center justify-between border-b border-dashed border-slate-200 pb-3 mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className={`h-8 w-8 rounded-full bg-gradient-to-tr ${getAvatarColor(val.CustomerName)} flex items-center justify-center text-white text-xs font-extrabold shadow-inner`}>
                                                    {val.CustomerName ? val.CustomerName.charAt(0).toUpperCase() : "U"}
                                                </div>
                                                <span className={`font-bold text-xs ${color.text} tracking-wide`}>
                                                    {val.CustomerName || "Anonymous"}
                                                </span>
                                            </div>

                                            {/* Star Rating */}
                                            <div className="flex gap-0.5 select-none">
                                                {[...Array(5)].map((_, sIdx) => (
                                                    <Star 
                                                        key={sIdx} 
                                                        size={12} 
                                                        fill={sIdx < (val.Rating || val.rating || 0) ? "currentColor" : "none"} 
                                                        className={sIdx < (val.Rating || val.rating || 0) ? color.star : "text-slate-300"} 
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        {/* Feedback Content */}
                                        <p className="text-slate-700 text-[11px] font-bold font-gloria leading-relaxed text-center px-1 my-2 min-h-[60px] flex items-center justify-center">
                                            "{val.Feedback || val.feedback}"
                                        </p>
                                    </div>

                                    {/* Verified Stamp / Footer Details */}
                                    <div className="flex items-center justify-between border-t border-slate-200/50 pt-3 mt-2 select-none">
                                        <div className={`flex items-center gap-1 text-[9px] font-extrabold px-2 py-0.5 rounded-full ${color.ribbon}`}>
                                            <CheckCircle2 size={10} className="stroke-[3px]" />
                                            <span>Verified</span>
                                        </div>
                                        <span className="text-[9px] text-slate-400 font-bold">
                                            EpStudio Member
                                        </span>
                                    </div>

                                </div>
                            </DraggablePaper>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default CustomerReview;