const isLocalhost = 
  typeof window !== "undefined" && 
  (window.location.hostname === "localhost" || 
   window.location.hostname === "127.0.0.1" || 
   window.location.hostname.startsWith("192.168."));

export const baseURL = isLocalhost 
  ? "http://localhost:8081" 
  : "https://epstudio-api.onrender.com";