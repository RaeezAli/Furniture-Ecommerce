"use client";

import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { useFirestore } from "../../hooks/useFirestore";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// Import images
import Image1 from "../../Images/Home/Mask Group (1).png";
import Image2 from "../../Images/Home/Image-living room.png";
import Image3 from "../../Images/Home/Mask Group.png";
import hero from "../../Images/Home/home-background.png";

// Card Component
import { Button } from "../../components/common/Button";
import Card from "../../components/common/Card";

// Slider Image
import SliderImage1 from "../../Images/Slider/Slider1.png";
import SliderImage2 from "../../Images/Slider/Slider2.png";
import SliderImage3 from "../../Images/Slider/Slider3.png";
import SliderImage4 from "../../Images/Slider/Slider4.png";
import SliderImage5 from "../../Images/Slider/Slider5.png";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const { fetchCollection, loading } = useFirestore();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setIsMounted(true);
    const loadProducts = async () => {
      const data = await fetchCollection("products");
      setProducts(data.slice(0, 8));
    };
    loadProducts();
  }, [fetchCollection]);

  const range = [
    {
      image: Image1,
      title: "Dining",
    },
    {
      image: Image2,
      title: "Living",
    },
    {
      image: Image3,
      title: "Bedroom",
    },
  ];

  return (
    <main id="page-1" className="bg-white pt-8">
      {/* Hero Section */}
      <section
        style={{ backgroundImage: `url(${hero})` }}
        className="w-full min-h-screen bg-no-repeat bg-cover bg-center flex justify-end items-center px-4 sm:px-8 md:px-16 lg:px-24"
      >
        <article className="w-full sm:w-[90%] md:w-[70%] lg:max-w-[643px] px-6 sm:px-10 md:px-12 py-8 sm:py-12 md:py-8 rounded-xl bg-[#FFF3E3] shadow-lg flex flex-col gap-4 sm:gap-6">
          <div className="flex flex-col gap-2">
            <span className="font-bold text-[13px] sm:text-[14px] md:text-[16px] tracking-[2px] sm:tracking-[3px] text-[#333333] uppercase">
              New Arrival
            </span>
            <h1 className="text-[28px] sm:text-[36px] md:text-[42px] lg:text-[52px] font-bold text-[#B88E2F] leading-tight">
              Discover Our <br /> New Collection
            </h1>
            <p className="text-[14px] sm:text-[16px] md:text-[18px] text-[#333333] font-medium max-w-[450px]">
              Elegance in every corner. Our new collection brings handpicked
              furniture that blends comfort with contemporary design.
            </p>
          </div>
          <Link to="/shop">
            <Button className="w-full sm:w-[180px] md:w-[222px] h-[56px] sm:h-[64px] md:h-[74px] text-[14px] sm:text-[16px] font-bold uppercase transition-transform hover:scale-105 active:scale-95 bg-[#B88E2F] text-white rounded-xl">
              BUY NOW
            </Button>
          </Link>
        </article>
      </section>

      {/* Browse Range Section */}
      <section className="min-h-screen flex flex-col justify-center py-16 sm:py-20 px-4 sm:px-8 md:px-8 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-16 space-y-2">
          <h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-bold text-[#333333]">
            Browse The Range
          </h2>
          <p className="text-[#898989] mb-4 sm:mb-8 text-[14px] sm:text-[16px] md:text-[18px]">
            Looks like you haven&apos;t added anything to your cart yet.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {range.map((item, index) => (
            <aside
              className="grid gap-4 sm:gap-6 text-center group cursor-pointer"
              key={index}
            >
              <div className="overflow-hidden rounded-xl h-[300px] sm:h-[380px] md:h-[480px] shadow-sm">
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  src={item.image || "/placeholder.svg"}
                  alt={`${item.title}-Image`}
                />
              </div>
              <h3 className="font-bold text-[18px] sm:text-[20px] md:text-[24px] text-[#333333]">
                {item.title}
              </h3>
            </aside>
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section className="min-h-screen flex flex-col justify-center py-16 sm:py-20 px-4 sm:px-8 md:px-8 lg:px-8 bg-white max-w-7xl mx-auto border-t border-[#E5E7EB]">
        <h2 className="text-center font-bold text-[28px] sm:text-[32px] md:text-[40px] text-[#3A3A3A] mb-8 sm:mb-12 lg:mb-12">
          Our Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-[#F4F5F7] h-[300px] sm:h-[350px] md:h-[400px] rounded-xl animate-pulse"
                ></div>
              ))
            : products.slice(0, 4).map((item) => (
                <div key={item.id} className="group">
                  <Card props={item} />
                </div>
              ))}
        </div>
        <div className="flex justify-center mt-8 sm:mt-4">
          <Link to="/shop">
            <Button
              variant="outline"
              className="w-[200px] sm:w-[245px] h-[44px] sm:h-[48px] border-[#B88E2F] text-[#B88E2F] hover:bg-[#B88E2F] hover:text-white transition-all font-bold rounded-xl text-[14px] sm:text-[16px]"
            >
              Show More
            </Button>
          </Link>
        </div>
      </section>

      {/* Inspiration Section */}
      <section className="min-h-screen flex items-center py-16 sm:py-20 px-4 sm:px-8 md:px-8 lg:px-16 bg-[#FCF8F3] grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center w-full max-w-7xl mx-auto">
          <aside className="flex flex-col gap-4 sm:gap-6 max-w-[422px]">
            <div className="space-y-2">
              <h2 className="font-bold text-[28px] sm:text-[32px] md:text-[40px] text-[#3A3A3A] leading-tight">
                50+ Beautiful rooms inspiration
              </h2>
              <p className="text-[#616161] text-[14px] sm:text-[16px] font-medium leading-relaxed">
                Our designer already made a lot of beautiful prototype of rooms
                that inspire you
              </p>
            </div>
            <Link to="/shop">
              <Button className="w-[150px] sm:w-[176px] md:w-[250px] h-[44px] sm:h-[48px] font-bold bg-[#B88E2F] text-white text-[14px] sm:text-[16px]">
                Explore More
              </Button>
            </Link>
          </aside>
          <div className="w-full flex justify-center overflow-hidden h-[350px] sm:h-[450px] md:h-[500px] rounded-xl shadow-xl">
            {isMounted && (
              <Swiper
                pagination={{
                  dynamicBullets: true,
                  clickable: true,
                }}
                autoplay={{
                  delay: 3500,
                  disableOnInteraction: false,
                }}
                modules={[Pagination, Autoplay]}
                className="mySwiper w-full h-full"
              >
                <SwiperSlide>
                  <img
                    className="w-full h-full object-cover"
                    src={SliderImage1 || "/placeholder.svg"}
                    alt="Room inspiration 1"
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    className="w-full h-full object-cover"
                    src={SliderImage2 || "/placeholder.svg"}
                    alt="Room inspiration 2"
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    className="w-full h-full object-cover"
                    src={SliderImage3 || "/placeholder.svg"}
                    alt="Room inspiration 3"
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    className="w-full h-full object-cover"
                    src={SliderImage4 || "/placeholder.svg"}
                    alt="Room inspiration 4"
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    className="w-full h-full object-cover"
                    src={SliderImage5 || "/placeholder.svg"}
                    alt="Room inspiration 5"
                  />
                </SwiperSlide>
              </Swiper>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
