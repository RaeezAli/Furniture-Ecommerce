import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Star,
  Minus,
  Plus,
  Facebook,
  Linkedin,
  Twitter,
  ChevronRight,
  ShoppingCart,
  Check,
} from "lucide-react";
import { useFirestore } from "../../hooks/useFirestore";
import { useCart } from "../../context/CartContext";
import Card from "../../components/common/Card";
import { Toast } from "../../components/common/Toast";

const ProductDetail = () => {
  const { id } = useParams();
  const { fetchCollection, loading: firestoreLoading } = useFirestore();
  const { addToCart } = useCart();
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const clampOffset = (raw, currentZoom) => {
    if (!containerRef.current) return raw;
    const { width, height } = containerRef.current.getBoundingClientRect();
    const maxX = (width * (currentZoom - 1)) / 2;
    const maxY = (height * (currentZoom - 1)) / 2;
    return {
      x: Math.min(maxX, Math.max(-maxX, raw.x)),
      y: Math.min(maxY, Math.max(-maxY, raw.y)),
    };
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadProductData = async () => {
      setLoading(true);
      const allProducts = await fetchCollection("products");
      const foundProduct = allProducts.find((p) => p.id === id);

      if (foundProduct) {
        setProduct(foundProduct);
        const related = allProducts
          .filter((p) => p.category === foundProduct.category && p.id !== id)
          .slice(0, 4);
        setRelatedProducts(related);
      }
      setLoading(false);
    };
    loadProductData();
  }, [id, fetchCollection]);

  const showToast = (message) => setToast({ message });

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image: (product.images && product.images[0]) || product.image,
      },
      quantity,
    );
    showToast(`Added ${quantity} ${product.name} to cart!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#B88E2F]"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
        <p className="text-[#898989] mb-8">
          The product you are looking for does not exist or has been removed.
        </p>
        <Link
          to="/shop"
          className="bg-[#B88E2F] text-white px-8 py-3 rounded-xl font-bold"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  const images =
    product.images?.length > 0
      ? product.images
      : [product.image || "/placeholder.svg"];

  return (
    <div className="bg-white pt-20">
      {toast && (
        <Toast message={toast.message} onClose={() => setToast(null)} />
      )}

      {/* Breadcrumbs */}
      <div className="bg-[#F9F1E7] py-4 px-4 md:px-8 lg:px-16 flex items-center gap-4 text-[16px]">
        <Link to="/" className="text-[#9F9F9F] hover:text-[#B88E2F]">
          Home
        </Link>
        <ChevronRight size={16} className="text-black" />
        <Link to="/shop" className="text-[#9F9F9F] hover:text-[#B88E2F]">
          Shop
        </Link>
        <ChevronRight size={16} className="text-black" />
        <div className="h-8 w-[2px] bg-[#9F9F9F] mx-2"></div>
        <span className="font-medium text-black truncate">{product.name}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-8 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16">
          {/* LEFT: Thumbnails + Main Image */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Thumbnails */}
            <div className="flex md:flex-col order-2 md:order-1 gap-4 overflow-x-auto md:overflow-y-auto hide-scrollbar md:w-[80px]">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveImage(idx);
                    setZoom(1);
                    setOffset({ x: 0, y: 0 });
                  }}
                  className={`w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-[#F9F1E7] border-2 transition-all ${activeImage === idx ? "border-[#B88E2F]" : "border-transparent hover:border-[#D4B483]"}`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Main Stage */}
            <div className="flex-1 order-1 md:order-2 flex flex-col gap-3">
              {/* Image Container */}
              <div
                ref={containerRef}
                className="relative bg-[#F9F1E7] rounded-xl overflow-hidden h-[400px] sm:h-[500px] shadow-sm"
                style={{ cursor: zoom > 1 ? "grab" : "zoom-in" }}
                onWheel={(e) => {
                  e.preventDefault();
                  const newZoom = Math.min(
                    3,
                    Math.max(1, zoom - e.deltaY * 0.002),
                  );
                  const clamped = clampOffset(offset, newZoom);
                  setZoom(newZoom);
                  setOffset(clamped);
                }}
              >
                <img
                  src={images[activeImage]}
                  alt={product.name}
                  draggable={false}
                  className="w-full h-full object-cover transition-transform duration-200 select-none"
                  style={{
                    transform: `scale(${zoom}) translate(${offset.x / zoom}px, ${offset.y / zoom}px)`,
                    transformOrigin: "center center",
                  }}
                  onMouseDown={(e) => {
                    if (zoom === 1) return;
                    e.preventDefault();
                    const startX = e.clientX - offset.x;
                    const startY = e.clientY - offset.y;
                    const onMove = (ev) => {
                      const raw = {
                        x: ev.clientX - startX,
                        y: ev.clientY - startY,
                      };
                      setOffset(clampOffset(raw, zoom));
                    };
                    const onUp = () => {
                      window.removeEventListener("mousemove", onMove);
                      window.removeEventListener("mouseup", onUp);
                    };
                    window.addEventListener("mousemove", onMove);
                    window.addEventListener("mouseup", onUp);
                  }}
                />

                {/* Zoom Badge */}
                {zoom > 1 && (
                  <div className="absolute top-3 left-3 bg-black/50 text-white text-[11px] font-medium px-2 py-1 rounded-lg backdrop-blur-sm">
                    {Math.round(zoom * 100)}%
                  </div>
                )}
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center gap-3 self-end">
                <button
                  onClick={() => {
                    setZoom(1);
                    setOffset({ x: 0, y: 0 });
                  }}
                  disabled={zoom === 1}
                  className="h-[36px] px-4 rounded-lg text-[13px] font-medium bg-[#F9F1E7] text-[#333333] hover:bg-[#B88E2F] hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Reset
                </button>
                <button
                  onClick={() => {
                    const z = Math.max(1, zoom - 0.25);
                    setZoom(z);
                    setOffset(clampOffset(offset, z));
                  }}
                  disabled={zoom <= 1}
                  className="w-[36px] h-[36px] rounded-lg text-[18px] font-bold bg-[#F9F1E7] text-[#333333] hover:bg-[#B88E2F] hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  −
                </button>
                <div className="h-[36px] px-4 rounded-lg text-[13px] font-medium bg-[#F9F1E7] text-[#333333] flex items-center min-w-[60px] justify-center">
                  {Math.round(zoom * 100)}%
                </div>
                <button
                  onClick={() => {
                    const z = Math.min(3, zoom + 0.25);
                    setZoom(z);
                    setOffset(clampOffset(offset, z));
                  }}
                  disabled={zoom >= 3}
                  className="w-[36px] h-[36px] rounded-lg text-[18px] font-bold bg-[#F9F1E7] text-[#333333] hover:bg-[#B88E2F] hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Details Section */}
          <div className="flex flex-col">
            <h1 className="text-[32px] sm:text-[42px] font-bold text-black mb-1">
              {product.name}
            </h1>
            <p className="text-[24px] font-medium text-[#898989] mb-4">
              Rs. {Number(product.price).toLocaleString()}
            </p>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center text-[#FFC700]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={18} fill={i < 4 ? "#FFC700" : "none"} />
                ))}
              </div>
              <div className="h-6 w-[1px] bg-[#9F9F9F]"></div>
              <span className="text-[13px] text-[#9F9F9F]">
                5 Customer Reviews
              </span>
            </div>

            <p className="text-[14px] text-black leading-relaxed mb-8 max-w-[450px]">
              {product.description ||
                "Experience unmatched comfort and style with our premium furniture collection. Crafted with precision and built to last."}
            </p>

            {/* Size & Color */}
            <div className="space-y-6 mb-10">
              <div>
                <h4 className="text-[14px] text-[#9F9F9F] mb-3">Size</h4>
                <div className="flex gap-4">
                  {["L", "XL", "XS"].map((s) => (
                    <button
                      key={s}
                      className="w-[30px] h-[30px] rounded-[5px] bg-[#F9F1E7] hover:bg-[#B88E2F] hover:text-white text-[13px] transition-all flex items-center justify-center"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-[14px] text-[#9F9F9F] mb-3">Color</h4>
                <div className="flex gap-4">
                  <button className="w-[30px] h-[30px] rounded-full bg-[#816DFA] shadow-inner border border-gray-100"></button>
                  <button className="w-[30px] h-[30px] rounded-full bg-[#333333] shadow-inner border border-gray-100"></button>
                  <button className="w-[30px] h-[30px] rounded-full bg-[#B88E2F] shadow-inner border border-gray-100"></button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 pt-8 border-t border-[#D9D9D9]">
              <div className="flex items-center border border-[#9F9F9F] rounded-xl px-4 h-[64px]">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 hover:text-[#B88E2F]"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center font-bold text-[16px]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-2 hover:text-[#B88E2F]"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex-1 min-w-[200px] h-[64px] border border-black rounded-xl text-[20px] font-medium hover:bg-black hover:text-white transition-all flex items-center justify-center gap-3"
              >
                <ShoppingCart size={20} /> Add To Cart
              </button>
            </div>

            {/* Meta */}
            <div className="mt-10 pt-10 border-t border-[#D9D9D9] space-y-3">
              <div className="flex gap-4 text-[16px] text-[#9F9F9F]">
                <span className="w-20">SKU</span>
                <span>: SS00{product.id?.slice(-1) || "1"}</span>
              </div>
              <div className="flex gap-4 text-[16px] text-[#9F9F9F]">
                <span className="w-20">Category</span>
                <span className="capitalize">: {product.category}</span>
              </div>
              <div className="flex gap-4 text-[16px] text-[#9F9F9F]">
                <span className="w-20">Tags</span>
                <span>: Sofa, Chair, Home, Shop</span>
              </div>
              <div className="flex gap-4 text-[16px] items-center text-[#9F9F9F]">
                <span className="w-20 font-bold text-black">Share</span>
                <div className="flex gap-6 items-center text-black">
                  <span>:</span>
                  <Facebook
                    size={20}
                    className="hover:text-[#B88E2F] cursor-pointer"
                  />
                  <Linkedin
                    size={20}
                    className="hover:text-[#B88E2F] cursor-pointer"
                  />
                  <Twitter
                    size={20}
                    className="hover:text-[#B88E2F] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-16 px-4 sm:px-8 md:px-16 lg:px-24 max-w-7xl mx-auto border-t border-[#E5E7EB]">
          <h2 className="text-center font-bold text-[36px] text-black mb-12">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {relatedProducts.map((p) => (
              <Card key={p.id} props={p} />
            ))}
          </div>
          <div className="flex justify-center mt-12">
            <Link to="/shop">
              <button className="px-16 py-3 border border-[#B88E2F] text-[#B88E2F] hover:bg-[#B88E2F] hover:text-white transition-all font-bold rounded-lg shadow-sm">
                Show More
              </button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
