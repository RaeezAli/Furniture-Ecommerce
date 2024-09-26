import Hero from "../components/common/Hero";

export default function Shop() {

  const titles = ['Shop', 'Shop'];

  return (
    <main id='page-2' className='mt-20'>
      <section className="w-full">
        <Hero titles={titles} />
      </section>
      <section style={{ background: 'rgba(252, 248, 243, 1)' }} className='w-full p-8 '>
      </section>
    </main>
  )
}
