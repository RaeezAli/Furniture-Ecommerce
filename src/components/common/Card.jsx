
export default function Card({ props }) {

    const { title, desc, price, oldprice, image, time } = props;

    return (
        <>
            <div className="relative overflow-hidden">
                <div>
                    <img className="h-72 w-full object-cover" src={image} alt="" />
                    <span style={{backgroundColor: 'rgba(46, 193, 172, 1)'}} className="text-white absolute top-3 right-3 px-2 py-3 rounded-full">{time}</span>
                </div>
                <article style={{ backgroundColor: 'rgba(244, 245, 247, 1)' }} className='w-full p-4'>
                    <h2 style={{ color: 'rgba(58, 58, 58, 1)' }} className="text-2xl font-semibold">{title}</h2>
                    <p style={{ color: 'rgba(137, 137, 137, 1)' }} className='font-medium text-base'>{desc}</p>
                    <p style={{ color: 'rgba(58, 58, 58, 1)' }} className='text-l font-semibold flex gap-2' >Rp {price} <del style={{ color: 'rgba(137, 137, 137, 1)' }} className='text-base font-normal'>Rp {oldprice}</del></p>
                </article>
                <div className="absolute h-full w-full bg-black/50 flex items-center justify-center -bottom-10 group-hover:bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button style={{ color: 'rgba(184, 142, 47, 1)', backgroundColor: 'rgba(255, 255, 255, 1)' }} className="font-semibold py-2 px-5">Add to cart</button>
                </div>
            </div>
        </>
    )
}
