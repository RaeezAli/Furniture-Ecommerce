import { Button } from "./Button";
import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

export default function Card({ props }) {
  const { addToCart } = useCart();
  
  // Handle both dummy data (title, desc) and Firestore data (name, description)
  const id = props.id;
  const name = props.name || props.title;
  const description = props.description || props.desc;
  const price = props.price;
  const oldPrice = props.oldPrice || props.oldprice || props.discountPrice;
  const image = (props.images && props.images[0]) || props.image;
  const badge = props.isNew ? "New" : (props.time || null);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id,
      name,
      price: Number(price.toString().replace(/[^0-9.]/g, "")),
      image
    });
  };

  return (
    <Link to={`/product/${id}`} className="group relative bg-[#F4F5F7] overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col h-full">
      {/* Image Container */}
      <div className="relative h-[288px] w-full overflow-hidden">
        <img 
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
          src={image} 
          alt={name} 
        />
        {/* Badge */}
        {badge && (
          <span className="absolute top-4 right-4 bg-[#2EC1AC] text-white text-[12px] font-bold px-4 py-2 rounded-full shadow-sm">
            {badge}
          </span>
        )}
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
          <button 
            onClick={handleAddToCart}
            className="bg-white border-white text-[#B88E2F] hover:bg-[#B88E2F] hover:text-white py-3 px-8 font-bold transition-all shadow-xl active:scale-95 flex items-center gap-2"
          >
            <ShoppingCart size={18} /> Add to cart
          </button>
        </div>
      </div>

      {/* Content Area */}
      <article className="p-4 flex flex-col flex-1 gap-2">
        <h2 className="text-[20px] font-bold text-[#333333] leading-tight truncate">
          {name}
        </h2>
        <p className="text-[14px] font-medium text-[#898989] line-clamp-2 min-h-[40px]">
          {description}
        </p>
        <div className="flex flex-wrap items-center gap-3 mt-auto pt-2">
          <span className="text-[18px] font-bold text-[#3A3A3A]">
            Rs. {Number(price.toString().replace(/[^0-9.]/g, "")).toLocaleString()}
          </span>
          {oldPrice && (
            <span className="text-[14px] font-medium text-[#B0B0B0] line-through">
              Rs. {Number(oldPrice.toString().replace(/[^0-9.]/g, "")).toLocaleString()}
            </span>
          )}
        </div>
      </article>
    </Link>
  );
}
