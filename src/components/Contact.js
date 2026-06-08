import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Swal from "sweetalert2";
import { User, Mail, BookOpen, MessageSquare, MapPin, Phone, Clock, Send, Sparkles, Instagram, Facebook, Twitter } from "lucide-react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation checks
    if (!formData.name.trim()) {
      Swal.fire({
        title: "Validation Error",
        text: "Please enter your name.",
        icon: "error",
        confirmButtonColor: "#EF4444"
      });
      return;
    }

    if (!formData.email.trim() || !validateEmail(formData.email)) {
      Swal.fire({
        title: "Validation Error",
        text: "Please enter a valid email address.",
        icon: "error",
        confirmButtonColor: "#EF4444"
      });
      return;
    }

    if (!formData.subject.trim()) {
      Swal.fire({
        title: "Validation Error",
        text: "Please select or write a subject.",
        icon: "error",
        confirmButtonColor: "#EF4444"
      });
      return;
    }

    if (formData.message.trim().length < 5) {
      Swal.fire({
        title: "Validation Error",
        text: "Message must be at least 5 characters long.",
        icon: "error",
        confirmButtonColor: "#EF4444"
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API delay
    setTimeout(() => {
      setIsSubmitting(false);
      Swal.fire({
        title: "Message Transmitted!",
        text: `Thank you, ${formData.name}. Eyam Poosu Studio has received your details and will follow up shortly.`,
        icon: "success",
        confirmButtonColor: "#4F46E5",
        confirmButtonText: "Done",
        background: "#FFFFFF",
        customClass: {
          popup: "rounded-3xl shadow-xl border border-slate-100",
          confirmButton: "px-6 py-2.5 rounded-xl font-semibold text-white",
        }
      });

      // Clear Form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    }, 1200);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-tr from-slate-50 via-white to-indigo-50/20 font-sans">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Main Card: Translucent Split Container */}
          <div className="bg-white/80 backdrop-blur-md rounded-[3rem] border border-slate-200/40 shadow-2xl grid lg:grid-cols-12 overflow-hidden min-h-[700px]">
            
            {/* Left Column (5 columns) - Studio Highlights & Info */}
            <div className="lg:col-span-5 bg-slate-950 text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden text-left">
              {/* Backlight elements */}
              <div className="absolute top-0 left-0 w-84 h-84 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none -translate-x-1/3 -translate-y-1/3"></div>
              <div className="absolute bottom-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-[100px] pointer-events-none translate-x-1/3 translate-y-1/3"></div>

              <div className="space-y-12 relative z-10">
                <div className="space-y-3">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest text-indigo-300 bg-indigo-950/80 border border-indigo-900/50">
                    <Sparkles size={10} className="animate-pulse" />
                    Studio Workshop
                  </span>
                  <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
                    Let's Create <br />
                    Something Beautiful
                  </h2>
                  <p className="text-xs text-slate-450 font-light leading-relaxed max-w-sm">
                    Connect with our designers for customized frames, resizing quotes, and digital restorations.
                  </p>
                </div>

                {/* Overlapping Mockup Artwork frames */}
                <div className="hidden sm:flex items-center justify-start gap-4 h-36 relative mt-4">
                  {/* Art frame 1 */}
                  <div className="w-24 h-32 rounded-2xl overflow-hidden border-2 border-slate-800 shadow-xl rotate-[-6deg] hover:rotate-0 transition-transform duration-300 cursor-pointer shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=300&auto=format&fit=crop" 
                      alt="Framed print on wall" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Art frame 2 */}
                  <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-slate-800 shadow-xl rotate-[8deg] hover:rotate-0 transition-transform duration-300 cursor-pointer shrink-0 translate-y-2">
                    <img 
                      src="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=300&auto=format&fit=crop" 
                      alt="Oak frame print" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Minimalism Coordinates strip */}
                <div className="space-y-5 pt-4 border-t border-slate-900">
                  <div className="flex items-center gap-3">
                    <MapPin size={14} className="text-indigo-400" />
                    <span className="text-xs font-light text-slate-300">Art District, TN, India</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={14} className="text-indigo-400" />
                    <a href="tel:+919876543210" className="text-xs font-light text-slate-300 hover:text-white transition-colors">
                      +91 98765 43210
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock size={14} className="text-indigo-400" />
                    <span className="text-xs font-light text-slate-300">Mon - Sat: 9am - 7pm</span>
                  </div>
                </div>
              </div>

              {/* Bottom Social strip */}
              <div className="flex items-center gap-4 relative z-10 pt-6">
                {[
                  { icon: <Instagram size={14} />, href: "https://instagram.com" },
                  { icon: <Facebook size={14} />, href: "https://facebook.com" },
                  { icon: <Twitter size={14} />, href: "https://twitter.com" }
                ].map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-white transition-colors duration-300"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Right Column (7 columns) - Minimalist Form */}
            <div className="lg:col-span-7 bg-white p-8 md:p-12 flex flex-col justify-center text-left">
              <div className="max-w-md w-full">
                <h3 className="text-2xl font-extrabold text-slate-850 tracking-tight mb-1">
                  Send a Message
                </h3>
                <p className="text-xs text-slate-400 mb-8 font-light">
                  Tell us about your print or framing idea, and we will handle the rest.
                </p>

                <form onSubmit={handleSubmit} className="space-y-8">
                  
                  {/* Input: Name (Designer bottom-border style) */}
                  <div className="space-y-1 relative group">
                    <label className="text-[9px] font-extrabold uppercase tracking-widest text-slate-450 block pl-0.5">
                      Your Name
                    </label>
                    <div className="flex items-center border-b border-slate-200 group-focus-within:border-indigo-600 transition-colors duration-300 py-1">
                      <User size={13} className="text-slate-400 mr-3 shrink-0" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="bg-transparent border-none outline-none text-xs text-slate-850 placeholder-slate-300 w-full focus:ring-0 p-0"
                        required
                      />
                    </div>
                  </div>

                  {/* Input: Email */}
                  <div className="space-y-1 relative group">
                    <label className="text-[9px] font-extrabold uppercase tracking-widest text-slate-455 block pl-0.5">
                      Email Address
                    </label>
                    <div className="flex items-center border-b border-slate-200 group-focus-within:border-indigo-600 transition-colors duration-300 py-1">
                      <Mail size={13} className="text-slate-400 mr-3 shrink-0" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="bg-transparent border-none outline-none text-xs text-slate-850 placeholder-slate-300 w-full focus:ring-0 p-0"
                        required
                      />
                    </div>
                  </div>

                  {/* Input: Subject */}
                  <div className="space-y-1 relative group">
                    <label className="text-[9px] font-extrabold uppercase tracking-widest text-slate-455 block pl-0.5">
                      Inquiry Type
                    </label>
                    <div className="flex items-center border-b border-slate-200 group-focus-within:border-indigo-600 transition-colors duration-300 py-1 relative">
                      <BookOpen size={13} className="text-slate-400 mr-3 shrink-0" />
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="bg-transparent border-none outline-none text-xs text-slate-850 placeholder-slate-300 w-full focus:ring-0 p-0 appearance-none cursor-pointer"
                        required
                      >
                        <option value="" disabled>Choose inquiry category</option>
                        <option value="Framing Quote">Custom Framing Quote</option>
                        <option value="Photo Editing">Photo Editing & Restoration</option>
                        <option value="Order Status">Order Tracking & Delivery</option>
                        <option value="General Inquiry">General Studio Inquiry</option>
                      </select>
                      <span className="absolute right-0 text-[8px] text-slate-400 pointer-events-none font-bold">
                        ▼
                      </span>
                    </div>
                  </div>

                  {/* Input: Message */}
                  <div className="space-y-1 relative group">
                    <label className="text-[9px] font-extrabold uppercase tracking-widest text-slate-455 block pl-0.5">
                      Message Details
                    </label>
                    <div className="flex items-start border-b border-slate-200 group-focus-within:border-indigo-600 transition-colors duration-300 py-1">
                      <MessageSquare size={13} className="text-slate-400 mr-3 mt-1 shrink-0" />
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Write your request details here..."
                        className="bg-transparent border-none outline-none text-xs text-slate-850 placeholder-slate-300 w-full focus:ring-0 p-0 resize-none"
                        required
                      ></textarea>
                    </div>
                  </div>

                  {/* Send Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-slate-900 hover:bg-indigo-600 disabled:bg-slate-400 text-white text-[11px] font-extrabold uppercase tracking-widest rounded-xl transition-all duration-300 shadow-sm hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-4"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        <span>Transmitting Inquiry...</span>
                      </>
                    ) : (
                      <>
                        <Send size={11} />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>

                </form>
              </div>
            </div>

          </div>



        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Contact;
