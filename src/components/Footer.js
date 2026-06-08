import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin, Heart } from "lucide-react";
import logo from "./../Assets/commenAssets/logo1.png";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="Footer" className="bg-slate-950 text-slate-400 pt-16 pb-8 border-t border-slate-900 relative overflow-hidden">
      {/* Subtle bottom glow */}
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[150px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-slate-900">
        
        {/* Column 1: Brand & Bio */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 bg-slate-900 p-1.5 rounded-lg border border-slate-800 shadow-inner">
              <img className="h-full w-full object-contain" src={logo} alt="EP Studio Logo" />
            </div>
            <span 
              className="font-extrabold tracking-wider text-white text-xs uppercase"
              style={{ fontFamily: "Cinzel, serif" }}
            >
              EP Studio
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-light">
            Preserving your cherished moments through premium photo editing and custom framing. Handcrafted memories made to last a lifetime.
          </p>
          
          {/* Social Icons */}
          <div className="flex items-center gap-3.5 pt-2">
            {[
              { icon: <Instagram size={16} />, href: "https://instagram.com", label: "Instagram" },
              { icon: <Facebook size={16} />, href: "https://facebook.com", label: "Facebook" },
              { icon: <Twitter size={16} />, href: "https://twitter.com", label: "Twitter" },
            ].map((social, idx) => (
              <a
                key={idx}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-slate-900/80 hover:bg-indigo-650 hover:text-white border border-slate-850 hover:border-indigo-500/50 rounded-xl transition-all duration-300"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 className="text-white font-extrabold uppercase text-[10px] tracking-[0.25em] mb-5">
            Quick Links
          </h4>
          <ul className="space-y-3 text-xs font-semibold">
            {[
              { label: "Home Base", path: "/#Home" },
              { label: "Our Collection", path: "/#Collection" },
              { label: "About Our Studio", path: "/ablutUs" },
              { label: "Contact Us", path: "/contact" },
              { label: "Shopping Cart", path: "/orderList" },
            ].map((link) => (
              <li key={link.label}>
                <Link
                  to={link.path}
                  className="hover:text-indigo-400 hover:translate-x-1 inline-block transition-all duration-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Services */}
        <div>
          <h4 className="text-white font-extrabold uppercase text-[10px] tracking-[0.25em] mb-5">
            Our Services
          </h4>
          <ul className="space-y-3 text-xs font-light">
            {[
              "Professional Photo Editing",
              "Custom Frame Matching",
              "Artistic Collage Designs",
              "Matte & Glossy Finishes",
              "Relic Photo Restoration",
            ].map((service) => (
              <li key={service} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                <span>{service}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Contact info */}
        <div className="space-y-4">
          <h4 className="text-white font-extrabold uppercase text-[10px] tracking-[0.25em] mb-5">
            Get In Touch
          </h4>
          <ul className="space-y-3 text-xs font-light">
            <li className="flex items-start gap-3">
              <MapPin size={16} className="text-indigo-500 shrink-0 mt-0.5" />
              <span>Eyam Poosu Studio, Art District, TN, India</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={16} className="text-indigo-500 shrink-0" />
              <a href="tel:+919876543210" className="hover:text-indigo-400 transition-colors">
                +91 98765 43210
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={16} className="text-indigo-500 shrink-0" />
              <a href="mailto:support@eyampoosustudio.com" className="hover:text-indigo-400 transition-colors">
                support@eyampoosu.com
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* Copyright area */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-light">
        <p>
          &copy; {currentYear} Eyam Poosu Studio. All rights reserved.
        </p>
        <p className="flex items-center gap-1.5 text-slate-500 text-[11px]">
          Crafted with <Heart size={10} className="text-rose-500 fill-rose-500" /> & passion for preserving memories.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
