
export default function Footer() {
    return (
        <section className="w-full px-24 py-11 grid gap-10">
            <footer className="w-full flex gap-5">
                <div className="flex flex-col gap-8">
                    <h1 className="w-full text-2xl font-bold">Funiro.</h1>
                    <p style={{ color: 'rgba(159, 159, 159, 1)' }} className="w-full font-normal text-base">400 University Drive Suite 200 Coral Gables,<br />
                        FL 33134 USA</p>
                </div>
                <div className="grid grid-cols-3 px-8">
                    <div>
                        <ul className="grid gap-9">
                            <li style={{ color: 'rgba(159, 159, 159, 1)' }} className="font-medium text-base">Links</li>
                            <li>Home</li>
                            <li>Shop</li>
                            <li>About</li>
                            <li>Contact</li>
                        </ul>
                    </div>
                    <div>
                        <ul className="grid gap-9">
                            <li style={{ color: 'rgba(159, 159, 159, 1)' }} className="font-medium text-base">Help</li>
                            <li>Payment Options</li>
                            <li>Returns</li>
                            <li>Privacy Policy</li>
                        </ul>
                    </div>
                    <div className="w-full flex flex-col gap-9">
                        <p style={{ color: 'rgba(159, 159, 159, 1)' }} className="w-full font-medium text-base">Newsletter</p>
                        <form className="w-full flex gap-4">
                            <input style={{ borderBottom: '2px solid black' }} className="outline-none" type="email" name="" id="" placeholder="Enter Your Email" />
                            <button style={{ borderBottom: '2px solid black' }} className="font-medium" >SUBSCRIBE</button>
                        </form>
                    </div>
                </div>
            </footer>
            <hr />
            <article>2024 furino. All rights reverved</article>
        </section>
    )
}
