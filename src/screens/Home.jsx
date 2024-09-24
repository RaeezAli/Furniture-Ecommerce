import '../App.css';

export default function Home() {
  return (
    <main id='page-1'>
      <section className='w-full h-screen bg-hero-pattern bg-no-repeat bg-cover bg-center flex justify-end items-center px-16'>
        <article style={{backgroundColor: 'rgba(255, 243, 227, 1)'}} className='w-[600px] px-9 py-14 rounded-xl grid gap-10'>
          <div className='grid gap-1'>
            <span className='font-semibold text-2xl'>New Arrival</span>
            <h3 style={{color: 'rgba(184, 142, 47, 1)'}} className='text-6xl font-bold'>Discover Our New Collection</h3>
            <p className='text-lg font-medium'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis.</p>
          </div>
          <button style={{backgroundColor: 'rgba(184, 142, 47, 1)'}} className='text-white rounded-xl py-6 px-16 text-base font-bold'>BUY NOW</button>
        </article>
      </section>
    </main>
  )
}
