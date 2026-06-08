import React, { useState, useEffect, useContext } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { DataContext } from "./Contexts/DataContext";
import axios from "axios";
import { baseURL } from "../Utils/ServerUrl";
import Swal from "sweetalert2";
import { User, Mail, Lock, Eye, EyeOff, Save, KeyRound, BadgeCheck } from "lucide-react";

function Profile() {
  const { users, setUsers } = useContext(DataContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form fields once the user context resolves
  useEffect(() => {
    if (users) {
      setName(users.name || "");
      setEmail(users.email || "");
    }
  }, [users]);

  const validateEmail = (emailStr) => {
    return String(emailStr)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      Swal.fire({
        title: "Validation Error",
        text: "Please enter your name.",
        icon: "error",
        confirmButtonColor: "#EF4444"
      });
      return;
    }

    if (!email.trim() || !validateEmail(email)) {
      Swal.fire({
        title: "Validation Error",
        text: "Please enter a valid email address.",
        icon: "error",
        confirmButtonColor: "#EF4444"
      });
      return;
    }

    if (showPasswordSection) {
      if (password.length < 6) {
        Swal.fire({
          title: "Validation Error",
          text: "Password must be at least 6 characters long.",
          icon: "error",
          confirmButtonColor: "#EF4444"
        });
        return;
      }
      if (password !== confirmPassword) {
        Swal.fire({
          title: "Validation Error",
          text: "Passwords do not match.",
          icon: "error",
          confirmButtonColor: "#EF4444"
        });
        return;
      }
    }

    setIsSaving(true);

    try {
      const payload = { name, email };
      if (showPasswordSection && password) {
        payload.password = password;
      }

      // Headers require JWT token from users context data
      const tokenObj = localStorage.getItem("token");
      const authdata = tokenObj ? JSON.parse(tokenObj) : null;
      const headers = authdata?.token ? { Authorization: `Bearer ${authdata.token}` } : {};

      const response = await axios.post(`${baseURL}/register/updateProfile`, payload, { headers });

      if (response.status === 200 && response.data.code === 200) {
        // Success: update both local storage and data context
        const updatedUserData = response.data.data;
        localStorage.setItem("token", JSON.stringify(updatedUserData));
        setUsers(updatedUserData);

        // Reset password fields
        setPassword("");
        setConfirmPassword("");
        setShowPasswordSection(false);

        Swal.fire({
          title: "Profile Updated!",
          text: "Your profile information has been saved successfully.",
          icon: "success",
          confirmButtonColor: "#4F46E5",
          confirmButtonText: "Done",
          background: "#FFFFFF",
          customClass: {
            popup: "rounded-3xl shadow-xl border border-slate-100",
            confirmButton: "px-6 py-2.5 rounded-xl font-semibold text-white",
          }
        });
      } else {
        Swal.fire({
          title: "Update Failed",
          text: response.data.message || "Failed to update profile.",
          icon: "error",
          confirmButtonColor: "#EF4444"
        });
      }
    } catch (err) {
      console.error("Profile update error:", err);
      Swal.fire({
        title: "Server Error",
        text: "Something went wrong while saving changes.",
        icon: "error",
        confirmButtonColor: "#EF4444"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-tr from-slate-50 via-white to-indigo-50/20 font-sans">
      <Navbar />

      <main className="flex-1 py-16 flex items-center justify-center px-4 sm:px-6">
        {/* Profile Card Container */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200/50 shadow-2xl p-8 md:p-10 w-full max-w-md relative overflow-hidden text-left">
          {/* Backlight element */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10 space-y-6">
            
            {/* Top Avatar section */}
            <div className="text-center space-y-3">
              <div className="relative inline-block">
                <div className="h-24 w-24 rounded-full bg-slate-900 border-2 border-indigo-500/20 shadow-md text-white flex justify-center items-center mx-auto text-3xl font-extrabold tracking-tight">
                  {name ? name.charAt(0).toUpperCase() : <User size={32} />}
                </div>
                <div className="absolute -bottom-1.5 -right-1.5 p-2 bg-indigo-600 text-white rounded-xl shadow-md border border-white">
                  <BadgeCheck size={14} />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
                  Account Profile
                </h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                  Role: {users?.role || "Customer"}
                </p>
              </div>
            </div>

            <div className="w-full h-[1px] bg-slate-100"></div>

            {/* Profile Form */}
            <form onSubmit={handleSaveChanges} className="space-y-5">
              
              {/* Field: Username */}
              <div className="space-y-1.5 relative group">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block pl-0.5">
                  Username
                </label>
                <div className="flex items-center border-b border-slate-200 group-focus-within:border-indigo-600 transition-colors duration-300 py-1">
                  <User size={14} className="text-slate-400 mr-3 shrink-0" />
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your username"
                    className="bg-transparent border-none outline-none text-xs text-slate-800 placeholder-slate-300 w-full focus:ring-0 p-0"
                    required
                  />
                </div>
              </div>

              {/* Field: Email */}
              <div className="space-y-1.5 relative group">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block pl-0.5">
                  Email Address
                </label>
                <div className="flex items-center border-b border-slate-200 group-focus-within:border-indigo-600 transition-colors duration-300 py-1">
                  <Mail size={14} className="text-slate-400 mr-3 shrink-0" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="bg-transparent border-none outline-none text-xs text-slate-800 placeholder-slate-300 w-full focus:ring-0 p-0"
                    required
                  />
                </div>
              </div>

              {/* Toggle: Password Section */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordSection(!showPasswordSection)}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 focus:outline-none transition-colors"
                >
                  <KeyRound size={12} />
                  <span>{showPasswordSection ? "Keep current password" : "Update account password"}</span>
                </button>
              </div>

              {/* Toggleable password editing panel */}
              {showPasswordSection && (
                <div className="space-y-5 pt-3 border-t border-slate-100 border-dashed animate-fade-in">
                  
                  {/* Field: Password */}
                  <div className="space-y-1.5 relative group">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block pl-0.5">
                      New Password
                    </label>
                    <div className="flex items-center border-b border-slate-200 group-focus-within:border-indigo-600 transition-colors duration-300 py-1 relative">
                      <Lock size={14} className="text-slate-400 mr-3 shrink-0" />
                      <input
                        type={showPwd ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="bg-transparent border-none outline-none text-xs text-slate-800 placeholder-slate-300 w-full focus:ring-0 p-0 pr-8"
                        required={showPasswordSection}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPwd(!showPwd)}
                        className="absolute right-0 text-slate-450 hover:text-slate-650"
                      >
                        {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* Field: Confirm Password */}
                  <div className="space-y-1.5 relative group">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block pl-0.5">
                      Confirm Password
                    </label>
                    <div className="flex items-center border-b border-slate-200 group-focus-within:border-indigo-600 transition-colors duration-300 py-1 relative">
                      <Lock size={14} className="text-slate-400 mr-3 shrink-0" />
                      <input
                        type={showConfirmPwd ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Retype password"
                        className="bg-transparent border-none outline-none text-xs text-slate-800 placeholder-slate-300 w-full focus:ring-0 p-0 pr-8"
                        required={showPasswordSection}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                        className="absolute right-0 text-slate-450 hover:text-slate-650"
                      >
                        {showConfirmPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                </div>
              )}

              {/* Submit trigger */}
              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-3.5 bg-slate-900 hover:bg-indigo-600 disabled:bg-slate-400 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 shadow-sm hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer pt-3"
              >
                {isSaving ? (
                  <>
                    <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Saving Profile Changes...</span>
                  </>
                ) : (
                  <>
                    <Save size={12} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>

            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Profile;
