import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// import required modules
import { Pagination } from 'swiper/modules';

import '../App.css';

import Image1 from '../Images/Home/Mask Group (1).png';
import Image2 from '../Images/Home/Image-living room.png';
import Image3 from '../Images/Home/Mask Group.png';

// Card Component
import Card from '../components/common/Card';

// Dummy Data 
import getProducts from '../actions/getProducts';

// Slider Image
import SliderImage1 from '../Images/Slider/Slider1.png';
import SliderImage2 from '../Images/Slider/Slider2.png';
import SliderImage3 from '../Images/Slider/Slider3.png';
import SliderImage4 from '../Images/Slider/Slider4.png';
import SliderImage5 from '../Images/Slider/Slider5.png';

export default function Home() {

  const range = [
    {
      image: Image1,
      title: 'Dining',
    },
    {
      image: Image2,
      title: 'Living',
    },
    {
      image: Image3,
      title: 'Bedroom',
    }
  ];


  return (
    <main id='page-1' className='mt-20'>
      <section className='w-full h-screen bg-hero-pattern bg-no-repeat bg-cover bg-center flex justify-end items-center px-16'>
        <article style={{ backgroundColor: 'rgba(255, 243, 227, 1)' }} className='w-[500px] px-9 py-10 rounded-xl grid gap-10'>
          <div className='grid gap-1'>
            <span className='font-semibold text-2xl'>New Arrival</span>
            <h3 style={{ color: 'rgba(184, 142, 47, 1)' }} className='text-5xl font-bold'>Discover Our New Collection</h3>
            <p className='text-lg font-medium'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis.</p>
          </div>
          <button style={{ backgroundColor: 'rgba(184, 142, 47, 1)' }} className='text-white rounded-xl py-6 px-16 text-base font-bold'>BUY NOW</button>
        </article>
      </section>
      <section className='py-10 px-32 grid gap-10'>
        <article className='grid gap-3'>
          <h3
            style={{ color: 'rgba(51, 51, 51, 1)' }}
            className='text-center font-bold text-3xl'
          >Browse The Range</h3>
          <p
            style={{ color: 'rgba(102, 102, 102, 1)' }}
            className='text-center font-normal text-xl'
          >Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </article>
        <div className='grid grid-cols-3 gap-5'>
          {range.map((item, index) => (
            <aside className='grid gap-4 text-center' key={index}>
              <img className='w-full' src={item.image} alt={`${item.title}-Image`} />
              <h6 style={{ color: 'rgba(51, 51, 51, 1)' }} className='font-semibold text-2xl'>{item.title}</h6>
            </aside>
          ))}
        </div>
      </section>
      <section className='py-10 px-32 grid gap-5'>
        <h3
          style={{ color: 'rgba(58, 58, 58, 1)' }}
          className='text-center font-bold text-4xl'
        >Our Products</h3>
        <div className='grid grid-cols-4 gap-6'>
          {getProducts().map((item, index) => (
            <div key={index} className="group">
              <Card props={item} />
            </div>
          ))}
        </div>
        <div className='flex justify-center'>
          <button
            style={{ color: 'rgba(184, 142, 47, 1)', border: '1px solid rgba(184, 142, 47,1)' }}
            className='w-max bg-white py-2 px-6 text-base font-semibold'
          >View All Products</button>
        </div>
      </section>
      <section style={{ background: 'rgba(252, 248, 243, 1)' }} className='py-10 pl-32 flex gap-5'>
        <aside className='flex flex-col gap-4 justify-center'>
          <article className='grid gap-2'>
            <h3 style={{ color: "rgba(58, 58, 58, 1)" }} className='font-bold text-4xl'>50+ Beautiful rooms inspiration</h3>
            <p style={{ color: 'rgba(97, 97, 97, 1)' }} className='font-medium text-base'>Our designer already made a lot of beautiful prototipe of rooms that inspire you</p>
          </article>
          <button
            style={{ backgroundColor: 'rgba(184, 142, 47,1)' }}
            className='w-max text-white py-2 px-6 text-base font-semibold'
          >Explore More</button>
        </aside>
        <div className="w-full flex justify-center overflow-hidden">
          <Swiper
            pagination={{
              dynamicBullets: true,
            }}
            modules={[Pagination]}
            className="mySwiper"
          >
            <SwiperSlide><img className='h-[450px] w-full' src={SliderImage1} alt="" /></SwiperSlide>
            <SwiperSlide><img className='h-[450px] w-full' src={SliderImage2} alt="" /></SwiperSlide>
            <SwiperSlide><img className='h-[450px] w-full' src={SliderImage3} alt="" /></SwiperSlide>
            <SwiperSlide><img className='h-[450px] w-full' src={SliderImage4} alt="" /></SwiperSlide>
            <SwiperSlide><img className='h-[450px] w-full' src={SliderImage5} alt="" /></SwiperSlide>
          </Swiper>
        </div>

      </section>
      <section className='py-10 px-32 grid gap-10'>
        <article className='grid gap-1'>
          <p
            style={{ color: 'rgba(102, 102, 102, 1)' }}
            className='text-center font-semibold text-xl'
          >Share your setup with</p>
          <h3
            style={{ color: 'rgba(51, 51, 51, 1)' }}
            className='text-center font-bold text-4xl'
          >#FuniroFurniture</h3>
        </article>
        <div>

        </div>
      </section>
    </main>
  )
}
