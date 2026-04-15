import React from "react";
import ShippingIcon from "../../svgs/ShippingIcon";
import GuaranteeIcon from "../../svgs/GuaranteeIcon";
import CustomerSupportIcon from "../../svgs/CustomerSupportIcon";
import TrophyIcon from "../../svgs/TrophyIcon";

const ServicesRibbon = () => {
  const services = [
    {
      icon: <TrophyIcon />,
      title: "High Quality",
      description: "crafted from top materials",
    },
    {
      icon: <GuaranteeIcon />,
      title: "Warranty Protection",
      description: "Over 2 years",
    },
    {
      icon: <ShippingIcon />,
      title: "Free Shipping",
      description: "Order over 150 $",
    },
    {
      icon: <CustomerSupportIcon />,
      title: "24 / 7 Support",
      description: "Dedicated support",
    },
  ];

  return (
    <section className="w-full bg-[#FAF3EA] py-16 px-4 md:px-16 border-t border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {services.map((item, idx) => (
          <div
            className="flex gap-4 items-center group cursor-default"
            key={idx}
          >
            <div className="flex-shrink-0 transition-transform group-hover:scale-110 duration-300">
              {item.icon}
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-bold text-[20px] md:text-[18px] text-[#242424] leading-tight">
                {item.title}
              </h3>
              <p className="text-[#898989] text-[16px] md:text-[18px] font-medium leading-tight">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesRibbon;
