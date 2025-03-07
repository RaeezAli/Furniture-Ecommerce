import { useState } from "react";
import { Star, Minus, Plus, Facebook, Linkedin, Twitter } from "lucide-react";
import Description from "./ProdDescription";
import { Link } from "react-router-dom";

const Product = () => {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="pt-24 mt-16 max-w-7xl mx-auto p-8"> {/* Added pt-16 for spacing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex">
          <div className="w-1/5 mr-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="mb-4 bg-[#F9F1E7] rounded-lg overflow-hidden"
              >
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1z29_NI5zg0tIyY8RGaJ-uLSkjYq7eP7E7A&s"
                  alt={`Thumbnail ${i}`}
                  className="w-full h-20 object-cover"
                />
              </div>
            ))}
          </div>
          <div className="w-4/5 h-[370px] bg-[#F9F1E7] rounded-lg overflow-hidden">
            <img
              src="https://iwood.pk/wp-content/uploads/2019/03/iwjfsdbjfnsd.jpg"
              alt="Asgaard Sofa"
              className="w-full h-96 object-cover"
            />
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-bold mb-2">Asgaard Sofa</h1>
          <p className="text-2xl text-gray-600 mb-4">Rs. 250,000.00</p>
          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400 mr-2">
              {[1, 2, 3, 4].map((i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
              <Star className="w-5 h-5" />
            </div>
            <span className="text-gray-600">5 Customer Review</span>
          </div>
          <p className="text-gray-700 mb-6">
            Setting the bar as one of the loudest speakers in its class, the
            Kilburn is a compact, stout-hearted hero with a well-balanced audio
            which boasts a clear midrange and extended highs for a sound.
          </p>
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Size</h3>
            <div className="flex gap-4">
              {["L", "XL", "XS"].map((size) => (
                <button
                  key={size}
                  className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Color</h3>
            <div className="flex gap-4">
              {["bg-purple-600", "bg-black", "bg-yellow-600"].map((color) => (
                <button
                  key={color}
                  className={`w-6 h-6 rounded-full ${color}`}
                ></button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 hover:bg-gray-100"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 hover:bg-gray-100"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <Link to='/billing'>

            <button className="bg-[#B88E2F] text-white px-6 py-2 rounded-md hover:bg-[#A47E2A]">
               Checkout
            </button>
            </Link>
            <button className="border border-gray-300 px-6 py-2 rounded-md hover:bg-gray-100">
              + Compare
            </button>
          </div>
          <div className="border-t border-gray-200 pt-6">
            <p className="mb-2">
              <span className="font-semibold">SKU:</span> SS001
            </p>
            <p className="mb-2">
              <span className="font-semibold">Category:</span> Sofas
            </p>
            <p className="mb-2">
              <span className="font-semibold">Tags:</span> Sofa, Chair, Home,
              Shop
            </p>
            <div className="flex items-center mt-4">
              <span className="font-semibold mr-2">Share:</span>
              <button className="mr-2">
                <Facebook className="w-5 h-5" />
              </button>
              <button className="mr-2">
                <Linkedin className="w-5 h-5" />
              </button>
              <button>
                <Twitter className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <Description />
    </div>
  );
};

export default Product;
