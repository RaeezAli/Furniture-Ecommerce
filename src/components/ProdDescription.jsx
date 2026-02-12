"use client"

import { useState } from "react"

const ProdDescription = () => {
  const [activeTab, setActiveTab] = useState("Description")

  const tabs = ["Description", "Additional Information", "Reviews (5)"]

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6">
      {/* Tab Navigation - Scrollable on very small screens */}
      <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-200 mb-4 sm:mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`whitespace-nowrap py-2 px-2 xs:px-3 sm:px-4 text-xs sm:text-sm md:text-base ${
              activeTab === tab ? "border-b-2 border-black font-medium" : "text-gray-500"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "Description" && (
        <div className="space-y-4 sm:space-y-6">
          <p className="text-xs sm:text-sm md:text-base text-gray-600">
            Indulge in comfort and sophistication with this luxurious velvet sofa, designed to elevate your living
            space. Featuring plush, high-density foam cushions, this sofa provides exceptional support while maintaining
            a cozy feel. The soft velvet upholstery offers a rich texture, adding warmth and elegance to any room.
          </p>

          {/* Responsive Grid - 1 column on small screens, 2 columns on medium and up */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            <div className="bg-[#F9F1E7] rounded-lg overflow-hidden">
              <img
                src="https://i0.wp.com/woodwoon.com/wp-content/uploads/2023/01/SOS0002-sofa-set-sofa-design-furniture-store-in-pakistan.webp?fit=1024%2C787&ssl=1"
                alt="White sofa front view"
                className="w-full h-40 xs:h-48 sm:h-56 md:h-64 object-cover"
              />
            </div>
            <div className="bg-[#F9F1E7] rounded-lg overflow-hidden">
              <img
                src="https://poshish.pk/cdn/shop/files/Greyson-2_1800x1800.webp?v=1716124195"
                alt="White sofa side view"
                className="w-full h-40 xs:h-48 sm:h-56 md:h-64 object-cover"
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === "Additional Information" && (
        <div className="text-xs sm:text-sm md:text-base text-gray-600">
          <div className="space-y-3 sm:space-y-4">
            <h3 className="font-medium text-sm sm:text-base">Product Specifications</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="font-medium text-xs sm:text-sm">Dimensions</p>
                <p className="text-xs sm:text-sm">W: 220cm × D: 95cm × H: 85cm</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="font-medium text-xs sm:text-sm">Material</p>
                <p className="text-xs sm:text-sm">Velvet, Solid Wood, High-Density Foam</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="font-medium text-xs sm:text-sm">Weight Capacity</p>
                <p className="text-xs sm:text-sm">350 kg</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="font-medium text-xs sm:text-sm">Assembly</p>
                <p className="text-xs sm:text-sm">Minimal assembly required</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Reviews (5)" && (
        <div className="text-xs sm:text-sm md:text-base text-gray-600">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((review) => (
              <div key={review} className="border-b border-gray-100 pb-3 sm:pb-4 last:border-0">
                <div className="flex justify-between items-start mb-1 sm:mb-2">
                  <div>
                    <p className="font-medium text-xs sm:text-sm">Customer {review}</p>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">2 weeks ago</span>
                </div>
                <p className="text-xs sm:text-sm">
                  This sofa exceeded my expectations! The quality is outstanding and it looks even better in person than
                  in the photos.
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProdDescription

