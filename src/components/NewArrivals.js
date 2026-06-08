import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import axios from "axios";
import { Link } from "react-router-dom";
import { ArrowUpRight, Star } from "lucide-react";
import { baseURL } from "../Utils/ServerUrl";

const fallbackNewArrivals = [
  {
    id: "na1",
    name: "Classic Cotton Linen Shirt",
    price: "3,299",
    imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=600&auto=format&fit=crop",
    imageUrl2: "https://images.unsplash.com/photo-1554568218-0f1715e72254?q=80&w=600&auto=format&fit=crop",
    description: "Breathable cotton linen blend shirt designed for maximum comfort and style.",
    tag: "New",
    isFallback: true
  },
  {
    id: "na2",
    name: "Aviator Gold Sunglasses",
    price: "2,499",
    imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=600&auto=format&fit=crop",
    imageUrl2: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=600&auto=format&fit=crop",
    description: "Classic gold-framed aviators with polarized 100% UV protection lenses.",
    tag: "Hot",
    isFallback: true
  },
  {
    id: "na3",
    name: "Signature Eau De Parfum",
    price: "5,899",
    imageUrl: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=600&auto=format&fit=crop",
    imageUrl2: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=600&auto=format&fit=crop",
    description: "An elegant, long-lasting fragrance with fresh woody and citrus accents.",
    tag: "Exclusive",
    isFallback: true
  },
  {
    id: "na4",
    name: "Urban Suede Chelsea Boots",
    price: "7,499",
    imageUrl: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=600&auto=format&fit=crop",
    imageUrl2: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=600&auto=format&fit=crop",
    description: "Water-resistant suede boots with flexible goring and lightweight crepe soles.",
    tag: "Fresh",
    isFallback: true
  },
  {
    id: "na5",
    name: "Handcrafted Oak Art Frame",
    price: "1,899",
    imageUrl: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=600&auto=format&fit=crop",
    imageUrl2: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=600&auto=format&fit=crop",
    description: "Minimalist oak wood poster and photo frame, handcrafted with high-clarity acrylic glass.",
    tag: "New",
    isFallback: true
  }
];

// Dynamically categorize products based on name and description keywords
const getProductCategory = (product) => {
  const name = (product.name || "").toLowerCase();
  const desc = (product.description || "").toLowerCase();
  
  if (
    name.includes("shirt") || name.includes("blazer") || name.includes("tuxedo") || 
    name.includes("jacket") || name.includes("suit") || name.includes("coat") || 
    name.includes("wear") || name.includes("apparel") || name.includes("tee") || 
    name.includes("t-shirt") || name.includes("denim") || desc.includes("shirt") || desc.includes("clothing")
  ) {
    return "Apparel";
  }
  if (
    name.includes("boot") || name.includes("shoes") || name.includes("sneaker") || 
    name.includes("footwear") || name.includes("loafer") || name.includes("heel") || 
    name.includes("sandal") || desc.includes("shoes")
  ) {
    return "Footwear";
  }
  if (
    name.includes("watch") || name.includes("glasses") || name.includes("sunglasses") || 
    name.includes("bag") || name.includes("wallet") || name.includes("belt") || 
    name.includes("perfume") || name.includes("parfum") || name.includes("accessories") || 
    desc.includes("fragrance") || desc.includes("watch")
  ) {
    return "Accessories";
  }
  if (
    name.includes("frame") || name.includes("print") || name.includes("canvas") || 
    name.includes("art") || name.includes("painting") || name.includes("photo") || 
    desc.includes("frame") || desc.includes("poster")
  ) {
    return "Frames";
  }
  return "Apparel"; // Default fallback category
};

function NewArrivals() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${baseURL}/product/allProducts`)
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          // Sort descending to show latest additions
          const sorted = [...res.data].sort((a, b) => b.id - a.id);
          const dbProducts = sorted.map((item, idx) => {
            const reviewsCount = 10 + (item.id * 17) % 90;
            const ratingValue = (4.5 + (item.id % 5) * 0.1).toFixed(1);
            return {
              ...item,
              rating: ratingValue,
              reviews: reviewsCount,
              category: getProductCategory(item),
              tag: idx === 0 ? "New" : idx === 1 ? "Limit" : "Fresh"
            };
          });
          setProducts(dbProducts);
        } else {
          // Add default categories and ratings to fallbacks
          const updatedFallbacks = fallbackNewArrivals.map((item) => ({
            ...item,
            rating: (4.7 + (item.id.charCodeAt(2) % 3) * 0.1).toFixed(1),
            reviews: 20 + (item.id.charCodeAt(2) * 12) % 150,
            category: getProductCategory(item)
          }));
          setProducts(updatedFallbacks);
        }
      })
      .catch((err) => {
        console.error("Failed to load products for NewArrivals:", err);
        const updatedFallbacks = fallbackNewArrivals.map((item) => ({
          ...item,
          rating: "4.8",
          reviews: 45,
          category: getProductCategory(item)
        }));
        setProducts(updatedFallbacks);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const displayProducts = products.length >= 3 ? products : [...products, ...fallbackNewArrivals].slice(0, 6);

  // Filter products by selected category
  const filteredProducts = displayProducts.filter((product) => {
    if (selectedCategory === "All") return true;
    return product.category === selectedCategory;
  });

  // Count products by category
  const getCategoryCounts = () => {
    const counts = { All: displayProducts.length, Apparel: 0, Footwear: 0, Accessories: 0, Frames: 0 };
    displayProducts.forEach((p) => {
      const cat = p.category || "Apparel";
      if (counts[cat] !== undefined) {
        counts[cat]++;
      }
    });
    return counts;
  };

  const counts = getCategoryCounts();

  const getProductImageSrc = (product, isSecondary = false) => {
    if (product.isFallback) {
      return isSecondary ? (product.imageUrl2 || product.imageUrl) : product.imageUrl;
    }
    try {
      const images = JSON.parse(product.image);
      if (Array.isArray(images) && images.length > 0) {
        if (isSecondary && images.length > 1) {
          return `${baseURL}/public/Products/${images[0]}`; // Cross-fade to primary/secondary
        }
        const imgName = images[1] || images[0];
        return `${baseURL}/public/Products/${imgName}`;
      }
    } catch (e) {}
    return "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=600&auto=format&fit=crop";
  };

  return (
    <div className="py-20 relative bg-gradient-to-tr from-slate-50/50 via-white to-indigo-50/30 container mx-auto px-6 rounded-[3rem] mt-16 border border-slate-100/80 shadow-sm overflow-hidden">
      {/* Decorative Blur Blobs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-200/20 rounded-full blur-3xl -z-10 -translate-x-1/3 translate-y-1/3"></div>

      <div className="max-w-2xl mx-auto text-center mb-10 relative">
        <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-indigo-600 bg-indigo-50/80 px-4 py-1.5 rounded-full border border-indigo-100/50 backdrop-blur-sm">
          Fresh Releases
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-800 tracking-tight mt-4">
          Fresh New Arrivals
        </h2>
        <div className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-sky-500 mx-auto my-5 rounded-full"></div>
        <p className="text-slate-500 text-xs md:text-sm leading-relaxed max-w-lg mx-auto">
          Explore our newest releases, fresh off the design studio. Handcrafted with modern styles and limited batches for the trendsetters.
        </p>
      </div>

      {/* Category Navigation Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12 max-w-3xl mx-auto">
        {["All", "Apparel", "Footwear", "Accessories", "Frames"].map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-1.5 ${
                isActive
                  ? "bg-slate-900 text-white shadow-md border-transparent scale-105"
                  : "bg-white/80 hover:bg-slate-50 text-slate-600 border border-slate-200/60 hover:border-slate-300 backdrop-blur-sm"
              }`}
            >
              <span>{cat}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400 font-extrabold"
              }`}>
                {counts[cat]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        // Skeleton Loader
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 pt-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="aspect-[3/4] w-full rounded-3xl bg-slate-50 border border-slate-100/50 p-6 flex flex-col justify-end relative animate-pulse shadow-sm">
              <div className="absolute top-6 left-6 w-12 h-5 bg-slate-200 rounded-full"></div>
              <div className="space-y-3">
                <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                <div className="flex justify-between items-center pt-2">
                  <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                  <div className="h-8 w-8 bg-slate-200 rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        // Empty State
        <div className="py-20 text-center border border-dashed border-slate-200 rounded-3xl bg-slate-50/50 max-w-md mx-auto mb-10">
          <p className="text-slate-400 text-sm font-semibold">No new arrivals found in this category.</p>
          <button 
            onClick={() => setSelectedCategory("All")}
            className="mt-4 text-xs font-bold text-indigo-600 hover:text-indigo-700 underline"
          >
            Show All Products
          </button>
        </div>
      ) : (
        // Product Slider
        <Swiper
          className="mx-auto"
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          slidesPerView={1}
          breakpoints={{
            640: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
        >
          {filteredProducts.map((val) => {
            const mainImg = getProductImageSrc(val, false);
            const hoverImg = getProductImageSrc(val, true);

            return (
              <SwiperSlide key={val.id} className="pb-16 pt-4">
                <Link
                  to={val.isFallback ? "#" : `/Description/${val.id}`}
                  className="block group relative aspect-[3/4] w-full overflow-hidden rounded-3xl bg-slate-50 shadow-md hover:shadow-2xl transition-all duration-500 border border-slate-100"
                >
                  {/* Tag Badge */}
                  <span className="absolute top-4 left-4 z-20 px-3.5 py-1 bg-indigo-600 text-white text-[9px] font-extrabold uppercase tracking-wider rounded-full shadow-md">
                    {val.tag || "New"}
                  </span>

                  {/* Rating Stars Overlay */}
                  <div className="absolute top-4 right-4 z-20 flex items-center gap-1 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-slate-800 text-[10px] font-extrabold shadow-sm border border-slate-100/50">
                    <Star size={10} fill="#f59e0b" className="stroke-none" />
                    <span>{val.rating || "4.9"}</span>
                  </div>

                  {/* Primary Product Image */}
                  <img
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    src={mainImg}
                    alt={val.name}
                    loading="lazy"
                  />

                  {/* Secondary Product Image (Cross-fade on Hover) */}
                  {hoverImg && hoverImg !== mainImg && (
                    <img
                      className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-1000 ease-in-out group-hover:scale-105"
                      src={hoverImg}
                      alt={`${val.name} alternate view`}
                      loading="lazy"
                    />
                  )}

                  {/* Gradient Bottom Shadow Cover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent z-10 transition-opacity duration-500 group-hover:from-slate-950/90"></div>

                  {/* Floating Glassmorphism details box */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-between shadow-lg text-white z-20 transform transition-all duration-500 group-hover:-translate-y-1 group-hover:bg-white/15">
                    <div className="flex flex-col max-w-[75%]">
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-indigo-300 mb-0.5">
                        {val.category}
                      </span>
                      <h3 className="text-sm font-bold truncate leading-none mb-1.5 pr-1">
                        {val.name}
                      </h3>
                      <span className="text-xs font-extrabold text-indigo-300">
                        Rs. {val.price}
                      </span>
                    </div>
                    <div className="p-2.5 bg-white text-slate-950 rounded-full shadow-md transform transition-all duration-300 group-hover:rotate-45 group-hover:bg-indigo-600 group-hover:text-white">
                      <ArrowUpRight size={15} />
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </div>
  );
}

export default NewArrivals;