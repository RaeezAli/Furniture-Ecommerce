"use client"

import { useState } from "react"
import { Star, Minus, Plus, Facebook, Linkedin, Twitter } from "lucide-react"
import Description from "./ProdDescription"
import { Link } from "react-router-dom"

const Product = () => {
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)

  const thumbnails = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1z29_NI5zg0tIyY8RGaJ-uLSkjYq7eP7E7A&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1z29_NI5zg0tIyY8RGaJ-uLSkjYq7eP7E7A&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1z29_NI5zg0tIyY8RGaJ-uLSkjYq7eP7E7A&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1z29_NI5zg0tIyY8RGaJ-uLSkjYq7eP7E7A&s",
  ]

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-16 mt-8 sm:mt-12 md:mt-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
        {/* Product Images Section */}
        <div className="flex flex-col sm:flex-row w-full">
          {/* Thumbnails - Hidden on very small screens */}
          <div className="hidden sm:flex flex-row sm:flex-col sm:w-1/5 sm:mr-3 md:mr-4 order-2 sm:order-1 gap-2 sm:gap-0">
            {thumbnails.map((thumb, i) => (
              <div
                key={i}
                className={`mb-0 sm:mb-3 bg-[#F9F1E7] rounded-lg overflow-hidden cursor-pointer ${
                  activeImage === i ? "ring-2 ring-[#B88E2F]" : ""
                }`}
                onClick={() => setActiveImage(i)}
              >
                <img
                  src={thumb || "/placeholder.svg"}
                  alt={`Thumbnail ${i + 1}`}
                  className="w-full h-12 sm:h-16 md:h-20 object-cover"
                />
              </div>
            ))}
          </div>

          {/* Main Image */}
          <div className="w-full sm:w-4/5 h-[250px] xs:h-[300px] sm:h-[350px] md:h-[370px] bg-[#F9F1E7] rounded-lg overflow-hidden order-1 sm:order-2">
            <img
              src="https://iwood.pk/wp-content/uploads/2019/03/iwjfsdbjfnsd.jpg"
              alt="Asgaard Sofa"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Mobile Thumbnails - Horizontal scroll for very small screens */}
          <div className="flex sm:hidden overflow-x-auto gap-2 mt-2 order-2">
            {thumbnails.map((thumb, i) => (
              <div
                key={i}
                className={`flex-shrink-0 bg-[#F9F1E7] rounded-lg overflow-hidden cursor-pointer ${
                  activeImage === i ? "ring-2 ring-[#B88E2F]" : ""
                }`}
                onClick={() => setActiveImage(i)}
              >
                <img src={thumb || "/placeholder.svg"} alt={`Thumbnail ${i + 1}`} className="w-16 h-12 object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Details Section */}
        <div className="mt-4 md:mt-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">Asgaard Sofa</h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-2 sm:mb-4">Rs. 250,000.00</p>

          <div className="flex items-center mb-3 sm:mb-4">
            <div className="flex text-yellow-400 mr-2">
              {[1, 2, 3, 4].map((i) => (
                <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
              ))}
              <Star className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-xs sm:text-sm text-gray-600">5 Customer Review</span>
          </div>

          <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6">
            Setting the bar as one of the loudest speakers in its class, the Kilburn is a compact, stout-hearted hero
            with a well-balanced audio which boasts a clear midrange and extended highs for a sound.
          </p>

          <div className="mb-4 sm:mb-6">
            <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Size</h3>
            <div className="flex gap-2 sm:gap-4">
              {["L", "XL", "XS"].map((size) => (
                <button
                  key={size}
                  className="w-8 h-8 sm:w-10 sm:h-10 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100 text-xs sm:text-sm"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4 sm:mb-6">
            <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Color</h3>
            <div className="flex gap-2 sm:gap-4">
              {["bg-purple-600", "bg-black", "bg-yellow-600"].map((color) => (
                <button key={color} className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full ${color}`}></button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-1 sm:p-2 hover:bg-gray-100"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
              <span className="px-2 sm:px-4 text-sm sm:text-base">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-1 sm:p-2 hover:bg-gray-100"
                aria-label="Increase quantity"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>

            <Link to="/billing" className="w-full xs:w-auto mt-2 xs:mt-0">
              <button className="w-full xs:w-auto bg-[#B88E2F] text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-md hover:bg-[#A47E2A] text-sm sm:text-base">
                Checkout
              </button>
            </Link>

            <button className="w-full xs:w-auto mt-2 xs:mt-0 border border-gray-300 px-4 sm:px-6 py-1.5 sm:py-2 rounded-md hover:bg-gray-100 text-sm sm:text-base">
              + Compare
            </button>
          </div>

          <div className="border-t border-gray-200 pt-4 sm:pt-6">
            <p className="mb-1 sm:mb-2 text-xs sm:text-sm">
              <span className="font-semibold">SKU:</span> SS001
            </p>
            <p className="mb-1 sm:mb-2 text-xs sm:text-sm">
              <span className="font-semibold">Category:</span> Sofas
            </p>
            <p className="mb-1 sm:mb-2 text-xs sm:text-sm">
              <span className="font-semibold">Tags:</span> Sofa, Chair, Home, Shop
            </p>
            <div className="flex items-center mt-2 sm:mt-4">
              <span className="font-semibold mr-2 text-xs sm:text-sm">Share:</span>
              <button className="mr-2" aria-label="Share on Facebook">
                <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button className="mr-2" aria-label="Share on LinkedIn">
                <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button aria-label="Share on Twitter">
                <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <Description />
    </div>
  )
}

export default Product

