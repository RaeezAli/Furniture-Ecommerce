
export default function Service(props) {
    
    const { icon, title, desc } = {...props};

    return (
        <>
            {icon}
            <article className="flex flex-col justify-center">
                <h6 style={{ color: 'rgba(36, 36, 36, 1)' }} className="font-semibold text-xl">{title}</h6>
                <p style={{ color: 'rgba(137, 137, 137, 1)' }} className="font-medium text-sm">{desc}</p>
            </article>
        </>
    )
}
