

import Hero from "../components/common/Hero";

// Dummy 
import getProducts from "../actions/getProducts";

// Card Component
import Card from '../components/common/Card';

// SVG's
import ShippingIcon from '../svgs/ShippingIcon';
import GuaranteeIcon from '../svgs/GuaranteeIcon';
import CustomerSupportIcon from '../svgs/CustomerSupportIcon';
import TrophyIcon from '../svgs/TrophyIcon';
import Service from "../components/about/Service";

export default function Shop() {

  const titles = ['Shop', 'Shop'];

  const services = [
    {
      icon: <TrophyIcon />,
      title: 'High Quality',
      description: 'crafted from top materials',
    },
    {
      icon: <GuaranteeIcon />,
      title: 'Warranty Protection',
      description: 'Over 2 years',
    },
    {
      icon: <ShippingIcon />,
      title: 'Free Shipping',
      description: 'Order over 150 $',
    },
    {
      icon: <CustomerSupportIcon />,
      title: '24 / 7 Support',
      description: 'Dedicated support',
    },
  ];

  return (
    <main id='page-2' className='mt-20'>
      <section className="w-full">
        <Hero titles={titles} />
      </section>
      <section style={{ background: 'rgba(252, 248, 243, 1)' }} className='w-full p-8 '>
      </section>
      <section className='py-10 px-28 grid gap-5'>
        <div className='grid grid-cols-4 gap-6'>
          {getProducts().map((item, index) => (
            <div key={index} className="group">
              <Card props={item} />
            </div>
          ))}
        </div>
      </section>
      <section style={{ background: 'rgba(252, 248, 243, 1)' }} className='w-full px-12 py-24 grid grid-cols-4 gap-4'>
        {services.map((item, idx) => {
            return (
              <div className="flex gap-4 justify-center items-center" key={idx}>
                <Service title={item.title} icon={item.icon} desc={item.description} />
              </div>
            );
          })}
      </section>
    </main>
  )
}
