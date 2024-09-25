import '../App.css';

import Image1 from '../Images/Home/Mask Group (1).png';
import Image2 from '../Images/Home/Image-living room.png';
import Image3 from '../Images/Home/Mask Group.png';

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
      <section className='py-10 px-32 grid gap-10'>
        <h3
          style={{ color: 'rgba(58, 58, 58, 1)' }}
          className='text-center font-bold text-4xl'
        >Our Products</h3>
        <div className='grid grid-cols-4 gap-6'>
          <div>
            <img src="" alt="" />
            <article>
              <h6>Syltherine</h6>
              <p>Stylish cafe chair</p>
              <p>Rp 2.500.000 <span>Rp 3.500.000</span></p>
            </article>
          </div>
          <div>
            <img src="" alt="" />
            <article>
              <h6>Syltherine</h6>
              <p>Stylish cafe chair</p>
              <p>Rp 2.500.000 <span>Rp 3.500.000</span></p>
            </article>
          </div>
        </div>
      </section>
    </main>
  )
}
