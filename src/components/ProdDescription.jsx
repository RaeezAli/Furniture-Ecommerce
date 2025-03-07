import { useState } from "react";

const ProdDescription = () => {
  const [activeTab, setActiveTab] = useState("Description");

  const tabs = ["Description", "Additional Information", "Reviews (5)"];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`py-2 px-4 ${
              activeTab === tab
                ? "border-b-2 border-black font-medium"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Description" && (
        <div className="space-y-6 ">
        
          <p className="text-gray-600">
          Indulge in comfort and sophistication with this luxurious velvet sofa, designed to elevate your living space. Featuring plush, high-density foam cushions, this sofa provides exceptional support while maintaining a cozy feel. The soft velvet upholstery offers a rich texture, adding warmth and elegance to any room.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#F9F1E7] rounded-lg overflow-hidden">
              <img
                src="https://i0.wp.com/woodwoon.com/wp-content/uploads/2023/01/SOS0002-sofa-set-sofa-design-furniture-store-in-pakistan.webp?fit=1024%2C787&ssl=1"
                alt="White sofa front view"
                className="w-full h-64 object-cover"
              />
            </div>
            <div className="bg-[#F9F1E7] rounded-lg overflow-hidden">
              <img
                src="https://poshish.pk/cdn/shop/files/Greyson-2_1800x1800.webp?v=1716124195"
                alt="White sofa side view"
                className="w-full h-64 object-cover"
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === "Additional Information" && (
        <div className="text-gray-600">
          <p>Additional product information would go here.</p>
        </div>
      )}

      {activeTab === "Reviews (5)" && (
        <div className="text-gray-600">
          <p>Product reviews would be displayed here.</p>
        </div>
      )}
    </div>
  );
};

export default ProdDescription;
