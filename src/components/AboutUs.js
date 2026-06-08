import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ep from "../Assets/commenAssets/EPLogo.png";
import { Sparkles, Frame, Heart, Award, Camera, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

function AboutUs() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50/30">
      <Navbar />

      {/* Hero Section */}
      <main className="flex-1">
        <div className="py-20 relative overflow-hidden">
          {/* Background Decorative elements */}
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-200/10 rounded-full blur-3xl -z-10 -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-sky-200/10 rounded-full blur-3xl -z-10 translate-x-1/3 translate-y-1/3"></div>

          <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left: About Text Details */}
            <div className="text-left space-y-6">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-100/50 backdrop-blur-sm">
                <Sparkles size={10} className="animate-spin-slow" />
                Craftsmanship & Passion
              </span>
              
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight leading-tight">
                Turning Moments Into <br />
                <span className="bg-gradient-to-r from-indigo-600 to-sky-500 bg-clip-text text-transparent">
                  Lasting Memories
                </span>
              </h1>
              
              <div className="w-16 h-1.5 bg-gradient-to-r from-indigo-500 to-sky-500 rounded-full"></div>
              
              <div className="space-y-4 text-slate-600 text-sm leading-relaxed font-light">
                <p className="font-semibold text-slate-800 text-base leading-snug">
                  Welcome to Eyam Poosu Studio, where creativity meets master craftsmanship!
                </p>
                <p>
                  At Eyam Poosu Studio, we are deeply passionate about turning your special moments into permanent works of art. With professional expertise in high-end photo editing and customized framing services, we breathe new life into your pictures, ensuring every detail is enhanced to absolute perfection.
                </p>
                <p>
                  Founded with love and dedication, Eyam Poosu Studio is more than just a business—it’s a dream brought to life by two creative partners who believe in the power of preserving memories. Every image holds deep emotions, and our goal is to protect those emotions through elegant, premium frames and expert touch-ups.
                </p>
                <p>
                  Our mission is simple: to provide high-quality photo enhancements and customized framing solutions that exceed expectations. We handle every single project with absolute care and precision, turning simple photos into treasured keepsakes.
                </p>
              </div>

              {/* Call to action */}
              <div className="pt-4 flex flex-wrap gap-4">
                <Link
                  to="/#Collection"
                  className="px-6 py-3 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2"
                >
                  <span>Explore Collection</span>
                  <ArrowRight size={13} />
                </Link>
                <button
                  onClick={() => {
                    const section = document.getElementById("Pillars");
                    if (section) section.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-xl transition-all border border-slate-200/80 duration-300"
                >
                  Learn More
                </button>
              </div>
            </div>

            {/* Right: Immersive Logo/Visual Frame */}
            <div className="flex justify-center items-center relative">
              {/* Overlay glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-sky-500/10 rounded-[3rem] filter blur-xl scale-95 -z-10"></div>
              
              {/* Border Ring container */}
              <div className="relative p-6 bg-white rounded-[3rem] border border-slate-200/50 shadow-xl group hover:shadow-2xl transition-all duration-500 max-w-sm">
                
                {/* Custom watermark badge */}
                <div className="absolute -top-4 -right-4 z-20 bg-indigo-600 text-white p-3 rounded-2xl shadow-lg rotate-12 group-hover:rotate-6 transition-transform duration-300">
                  <Camera size={20} />
                </div>

                {/* Logo Frame */}
                <div className="bg-slate-50/50 rounded-[2rem] overflow-hidden p-8 border border-slate-100 flex items-center justify-center">
                  <img 
                    src={ep} 
                    alt="Eyam Poosu Studio Logo" 
                    className="w-full object-contain rounded-xl transform transition-transform duration-700 group-hover:scale-105" 
                  />
                </div>

                {/* Overlapping Info Card */}
                <div className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-3 max-w-[200px] z-10 transform group-hover:translate-y-1 transition-transform duration-300">
                  <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                    <Award size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider">Premium Quality</span>
                    <span className="text-xs font-bold text-slate-800">4.9★ Rated Studio</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Stats Row */}
        <section className="py-12 bg-slate-900 text-white">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-800">
            {[
              { val: "5,000+", label: "Frames Crafted" },
              { val: "100%", label: "Satisfaction Rate" },
              { val: "2", label: "Founders, 1 Dream" },
              { val: "4.9★", label: "Google Rating" },
            ].map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <span className="block text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-300 to-sky-400 bg-clip-text text-transparent">
                  {stat.val}
                </span>
                <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Core Values / Pillars Section */}
        <section id="Pillars" className="py-20 max-w-6xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-indigo-600 bg-indigo-50 px-3.5 py-1 rounded-full border border-indigo-100/50">
              Our Core Pillars
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight mt-3">
              How We Create Magic
            </h2>
            <div className="w-12 h-1 bg-gradient-to-r from-indigo-500 to-sky-500 mx-auto my-4 rounded-full"></div>
            <p className="text-slate-500 text-xs md:text-sm">
              We stand by our commitment to elite standards in photo design, frame engineering, and client memories.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Sparkles size={20} />,
                title: "Expert Photo Editing",
                desc: "We analyze lighting, contrast, and color balances to ensure your photographic records look flawless and vibrant.",
                color: "bg-indigo-50 text-indigo-600 border-indigo-100",
              },
              {
                icon: <Frame size={20} />,
                title: "Elegant Custom Framing",
                desc: "Custom sizing, premium wood panel materials, and clean framing templates designed to fit your unique spaces.",
                color: "bg-sky-50 text-sky-600 border-sky-100",
              },
              {
                icon: <Heart size={20} />,
                title: "Memories Preserved",
                desc: "Every project is handled with high dedication. We treat your memories as valuable assets meant to stand the test of time.",
                color: "bg-rose-50 text-rose-600 border-rose-100",
              },
            ].map((pillar, idx) => (
              <div 
                key={idx} 
                className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left space-y-4"
              >
                <div className={`inline-flex p-3 rounded-2xl border ${pillar.color}`}>
                  {pillar.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-800 tracking-tight">
                  {pillar.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-light">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default AboutUs;