"use client"

import { useRef, useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Autoplay } from "swiper/modules"

// Import Swiper styles
import "swiper/css"
import "swiper/css/pagination"

// Import images
import Image1 from "../Images/Home/Mask Group (1).png"
import Image2 from "../Images/Home/Image-living room.png"
import Image3 from "../Images/Home/Mask Group.png"
import hero from '../Images/Home/home-background.png'

// Card Component
import Card from "../components/common/Card"

// Dummy Data
import getProducts from "../actions/getProducts"

// Slider Image
import SliderImage1 from "../Images/Slider/Slider1.png"
import SliderImage2 from "../Images/Slider/Slider2.png"
import SliderImage3 from "../Images/Slider/Slider3.png"
import SliderImage4 from "../Images/Slider/Slider4.png"
import SliderImage5 from "../Images/Slider/Slider5.png"

export default function Home() {
  const [isMounted, setIsMounted] = useState(false)
  const navigationPrevRef = useRef(null)
  const navigationNextRef = useRef(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

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
  ]

  return (
    <main id="page-1" className="mt-20 overflow-x-hidden">
      {/* Hero Section */}
      <section  style={{ backgroundImage: `url(${hero})` }} className="w-full h-screen  bg-no-repeat bg-cover bg-center flex justify-end items-center px-4 sm:px-8 md:px-16">


        <article
          style={{ backgroundColor: "rgba(255, 243, 227, 1)" }}
          className="w-full max-w-[500px] px-6 sm:px-9 py-8 sm:py-10 rounded-xl grid gap-6 sm:gap-10"
        >
          <div className="grid gap-1">
            <span className="font-semibold text-xl sm:text-2xl">New Arrival</span>
            <h3 style={{ color: "rgba(184, 142, 47, 1)" }} className="text-3xl sm:text-4xl md:text-5xl font-bold">
              Discover Our New Collection
            </h3>
        
          </div>
          <Link to='/shop'>
          <button  
            style={{ backgroundColor: "rgba(184, 142, 47, 1)" }}
            className="text-white w-full rounded-xl py-4 sm:py-6 px-8 sm:px-16 text-base font-bold transition-transform hover:scale-105 active:scale-95"
          >
            BUY NOW
          </button>
          </Link>
         
        </article>
      </section>

      {/* Browse Range Section */}
      <section className="py-10 px-4 sm:px-8 md:px-16 lg:px-32 grid gap-10">
        <article className="grid gap-3">
          <h3 style={{ color: "rgba(51, 51, 51, 1)" }} className="text-center font-bold text-2xl sm:text-3xl">
            Browse The Range
          </h3>
     
        </article>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {range.map((item, index) => (
            <aside className="grid gap-4 text-center group" key={index}>
              <div className="overflow-hidden rounded-lg">
                <img
                  className="w-full transition-transform duration-500 group-hover:scale-105"
                  src={item.image || "/placeholder.svg"}
                  alt={`${item.title}-Image`}
                />
              </div>
              <h6 style={{ color: "rgba(51, 51, 51, 1)" }} className="font-semibold text-xl sm:text-2xl">
                {item.title}
              </h6>
            </aside>
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section className="py-10 px-4 sm:px-8 md:px-16 lg:px-32 grid gap-5">
        <h3 style={{ color: "rgba(58, 58, 58, 1)" }} className="text-center font-bold text-3xl sm:text-4xl">
          Our Products
        </h3>
        <Link to='/product'>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {getProducts().map((item, index) => (
            <div key={index} className="group">
              <Card props={item} />
            </div>
          ))}
        </div>
        </Link>
        <div className="flex justify-center mt-4">
          <Link
            to="/shop"
            style={{ color: "rgba(184, 142, 47, 1)", border: "1px solid rgba(184, 142, 47,1)" }}
            className="w-max bg-white py-2 px-6 text-base font-semibold transition-all  hover:text-white"
          >
            View All Products
          </Link>
        </div>
      </section>

      {/* Inspiration Section */}
      <section
        style={{ background: "rgba(252, 248, 243, 1)" }}
        className="py-10 px-4 sm:px-8 md:px-16 lg:pl-32 grid lg:grid-cols-2 gap-8"
      >
        <aside className="flex flex-col gap-4 justify-center">
          <article className="grid gap-2">
            <h3 style={{ color: "rgba(58, 58, 58, 1)" }} className="font-bold text-3xl sm:text-4xl">
              50+ Beautiful rooms inspiration
            </h3>
            <p style={{ color: "rgba(97, 97, 97, 1)" }} className="font-medium text-base">
              Our designer already made a lot of beautiful prototipe of rooms that inspire you
            </p>
          </article>
          <Link to='/shop'>
          <button
            style={{ backgroundColor: "rgba(184, 142, 47,1)" }}
            className="w-max text-white py-2 px-6 text-base font-semibold transition-transform hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            Explore More
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
          </Link>
        
        </aside>
        <div className="w-full flex justify-center overflow-hidden">
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
              className="mySwiper"
            >
              <SwiperSlide>
                <img className="w-full" src={SliderImage1 || "/placeholder.svg"} alt="Room inspiration 1" />
              </SwiperSlide>
              <SwiperSlide>
                <img className="w-full" src={SliderImage2 || "/placeholder.svg"} alt="Room inspiration 2" />
              </SwiperSlide>
              <SwiperSlide>
                <img className="w-full" src={SliderImage3 || "/placeholder.svg"} alt="Room inspiration 3" />
              </SwiperSlide>
              <SwiperSlide>
                <img className="w-full" src={SliderImage4 || "/placeholder.svg"} alt="Room inspiration 4" />
              </SwiperSlide>
              <SwiperSlide>
                <img className="w-full" src={SliderImage5 || "/placeholder.svg"} alt="Room inspiration 5" />
              </SwiperSlide>
            </Swiper>
          )}
        </div>
      </section>

    
    </main>
  )
}

