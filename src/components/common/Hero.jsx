
export default function Hero({ titles }) {

    return (
        <div style={{ backdropFilter: 'blur(6px)' }} className="h-[340px] flex justify-center items-center flex-col text-black bg-common-background bg-center gap-2">
            <h1 className="text-5xl font-medium">{titles[0]}</h1>
            <p className="text-base font-medium">Home {'>'} <span className="font-light">{titles[1]}</span></p>
        </div>
    )
}
