import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { DataContext } from "./Contexts/DataContext";
import "@fontsource/roboto";
import logo from "./../Assets/commenAssets/logo1.png";
import { MessageSquare, ShoppingCart, Menu, X, ChevronRight, LogOut } from "lucide-react";

function Navbar() {
  const { users, isAuth, setIsAuth, open, setOpen } = useContext(DataContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    setIsAuth(false);
    // Clear tokens/user sessions if applicable
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <>
      {/* Sticky Glassmorphic Navbar */}
      <header className="sticky top-0 z-50 w-full bg-white/75 backdrop-blur-lg border-b border-slate-100 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Left: Brand & Links */}
            <div className="flex items-center gap-8">
              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors focus:outline-none"
                aria-label="Toggle Menu"
              >
                <Menu size={22} />
              </button>

              {/* Logo */}
              <Link to="/#Home" className="flex items-center gap-2 group">
                <div className="h-10 w-10 overflow-hidden bg-slate-50 rounded-xl p-1 border border-slate-100 shadow-inner group-hover:scale-105 transition-transform duration-300">
                  <img className="h-full w-full object-contain" src={logo} alt="EP Studio Logo" />
                </div>
                <span 
                  className="font-extrabold tracking-wider text-slate-800 text-sm hidden sm:block uppercase"
                  style={{ fontFamily: "Cinzel, serif" }}
                >
                  EP Studio
                </span>
              </Link>

              {/* Desktop Navigation Links */}
              <nav className="hidden lg:flex items-center gap-1">
                {[
                  { label: "Home", path: "/#Home" },
                  { label: "Collection", path: "/#Collection" },
                  { label: "About Us", path: "/ablutUs" },
                  { label: "Contact", path: "/contact" }
                ].map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    className="relative px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-600 hover:text-indigo-600 transition-colors duration-300 group"
                  >
                    <span>{item.label}</span>
                    {/* Animated Underline */}
                    <span className="absolute bottom-1 left-4 right-4 h-[2px] bg-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center rounded-full"></span>
                  </Link>
                ))}
                {users?.role === "Admin" && (
                  <Link
                    to="/admin"
                    className="relative px-4 py-2 text-xs font-semibold uppercase tracking-wider text-rose-500 hover:text-rose-600 transition-colors duration-300 group"
                  >
                    <span>Admin Panel</span>
                    <span className="absolute bottom-1 left-4 right-4 h-[2px] bg-rose-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center rounded-full"></span>
                  </Link>
                )}
              </nav>
            </div>

            {/* Right: Actions & Profile */}
            <div className="flex items-center gap-4">
              
              {/* Chat Button (Only for Customer) */}
              {users?.role !== "Admin" && (
                <button
                  onClick={() => setOpen(!open)}
                  className={`p-2.5 rounded-xl border transition-all duration-300 relative ${
                    open 
                      ? "bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm" 
                      : "bg-white/80 border-slate-200/60 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 hover:border-slate-300"
                  }`}
                  title="Chat with Support"
                >
                  <MessageSquare size={18} />
                  {/* Pulsing indicator */}
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full animate-ping"></span>
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full"></span>
                </button>
              )}

              {/* Cart Button (Only for Customer) */}
              {users?.role !== "Admin" && (
                <Link
                  to="/orderList"
                  className="p-2.5 bg-white/80 border border-slate-200/60 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 hover:border-slate-300 rounded-xl transition-all duration-300"
                  title="View Shopping Cart"
                >
                  <ShoppingCart size={18} />
                </Link>
              )}

              {/* Auth / Profile Area */}
              {isAuth ? (
                <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
                  <div className="hidden md:flex flex-col text-right">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none mb-1">
                      Welcome back
                    </span>
                    <span 
                      className="text-xs font-bold text-slate-700 max-w-[120px] truncate"
                      style={{ fontFamily: "Cinzel, serif" }}
                    >
                      {users?.name}
                    </span>
                  </div>
                  
                  {/* Profile Dropdown trigger */}
                  <Link 
                    to="/profile" 
                    className="h-9 w-9 rounded-xl bg-slate-900 border border-indigo-500/20 text-white flex justify-center items-center shadow-md hover:scale-105 transition-transform duration-300"
                  >
                    <span className="text-sm font-extrabold tracking-tight">
                      {users?.name?.charAt(0).toUpperCase()}
                    </span>
                  </Link>
                </div>
              ) : (
                <Link to="/login" className="pl-2">
                  <button className="px-5 py-2 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 shadow-sm hover:shadow-md">
                    Login
                  </button>
                </Link>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Slide-out Mobile Menu Drawer Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Mobile Drawer Panel */}
      <div 
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-white shadow-2xl transition-transform duration-300 ease-in-out transform flex flex-col ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img className="h-8 w-8 object-contain" src={logo} alt="EP Studio Logo" />
            <span 
              className="font-extrabold tracking-wider text-slate-800 text-xs uppercase"
              style={{ fontFamily: "Cinzel, serif" }}
            >
              EP Studio
            </span>
          </div>
          <button 
            onClick={toggleMobileMenu}
            className="p-2 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Navigation Links */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {[
            { label: "Home", path: "/#Home" },
            { label: "Collection", path: "/#Collection" },
            { label: "About Us", path: "/ablutUs" },
            { label: "Contact", path: "/contact" }
          ].map((item) => (
            <Link
              key={item.label}
              to={item.path}
              onClick={toggleMobileMenu}
              className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all"
            >
              <span>{item.label}</span>
              <ChevronRight size={14} className="opacity-40" />
            </Link>
          ))}

          {users?.role === "Admin" && (
            <Link
              to="/admin"
              onClick={toggleMobileMenu}
              className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-50/50 transition-all border border-dashed border-rose-100 mt-4"
            >
              <span>Admin Panel</span>
              <ChevronRight size={14} className="text-rose-400" />
            </Link>
          )}
        </div>

        {/* Drawer Footer / Account actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          {isAuth ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-slate-900 text-white flex justify-center items-center font-bold">
                  {users?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-700 truncate max-w-[150px]">
                    {users?.name}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate max-w-[150px]">
                    {users?.email || "customer@epstudio.com"}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link 
                  to="/profile"
                  onClick={toggleMobileMenu}
                  className="py-2 px-3 text-center bg-white border border-slate-200 text-slate-600 text-[10px] font-bold uppercase rounded-lg hover:bg-slate-50 transition-all"
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMobileMenu();
                  }}
                  className="py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-600 text-[10px] font-bold uppercase rounded-lg transition-all flex items-center justify-center gap-1"
                >
                  <LogOut size={10} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <Link 
              to="/login"
              onClick={toggleMobileMenu}
              className="block w-full py-2.5 text-center bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm"
            >
              Login to Account
            </Link>
          )}
        </div>
      </div>
    </>
  );
}

export default Navbar;
