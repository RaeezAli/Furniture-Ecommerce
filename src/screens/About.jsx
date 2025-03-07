import { FaSearch } from "react-icons/fa"; // Install react-icons if not already installed
import img1 from '../Images/about/68 (1).png'

export default function About() {
  const titles = ["About", "About"];

  return (
    <>
      <main id="page-3" className="mt-36 ml-7 ">
        <section className="w-full">
          <div className="md:flex-row sm:flex-col-reverse flex-col-reverse flex justify-center w-full">
            {/* Image and Paragraph Section */}
            <div className="flex flex-col items-center md:items-start w-full mt-4">
              <img
                className="h-auto max-w-[350px] md:w-[500px] lg:max-w-[600px] xl:max-w-[800px] md:ml-5 xs:items-center object-cover lg:ml-4"
                src={img1}
                alt="Responsive Image"
                style={{ width: "100%" }}
              />
            
              <div className="mt-4 grid gap-5 text-center md:text-left">
                <h1 className="ml-4">Going all-in with millennial design</h1>
                <p className="px-4 text-center md:text-left max-w-[300px] md:max-w-[500px] lg:max-w-[800px]">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Mus mauris vitae ultricies leo integer malesuada nunc. In
                  nulla posuere sollicitudin aliquam ultrices. Morbi blandit
                  cursus risus at ultrices mi tempus imperdiet. Libero enim sed
                  faucibus turpis in. Cursus mattis molestie a iaculis at erat.
                  Nibh cras pulvinar mattis nunc sed blandit libero.
                  Pellentesque elit ullamcorper dignissim cras tincidunt.
                  Pharetra et ultrices neque ornare aenean euismod elementum.
                </p>
              </div>
            </div>

            <div className="flex justify-center items-center md:flex flex-col md:justify-start sm:justify-center md:mr-9 md:ml-7 mt-4">
              <div className="flex items-center w-[311px] h-[58px] border-2 border-gray-300 rounded-lg overflow-hidden">
                <input
                  type="text"
                  className="flex-1 h-full focus:outline-none text-gray-700 px-2"
                />
                <div className="ml-auto px-4 text-gray-500">
                  <FaSearch />
                </div>
              </div>

              <div className="md:mt-6 mt-4 w-[270px] flex flex-col gap-7">
                <h1 className="text-lg font-semibold">Categories</h1>
                <div className="md:grid md:gap-5 gap-2">
                  {[
                    { name: "Craft", count: 2 },
                    { name: "Design", count: 8 },
                    { name: "Handmade", count: 7 },
                    { name: "Interior", count: 1 },
                    { name: "Wood", count: 6 },
                  ].map((category) => (
                    <div
                      key={category.name}
                      className="flex justify-between w-full text-sm"
                    >
                      <p>{category.name}</p>
                      <p>{category.count}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 w-[270px] flex flex-col gap-3">
                <h1 className="text-lg font-semibold md:mt-44">Recent Posts</h1>
                {[
                  {
                    imgSrc: "src/Images/About/Rectangle 69 (1).png",
                    date: "03 Aug 2022",
                    title: "Going all-in with millennial design",
                  },
                  {
                    imgSrc: "src/Images/About/Rectangle 69 (2).png",
                    date: "03 Aug 2022",
                    title: "Going all-in with millennial design",
                  },
                  {
                    imgSrc: "src/Images/About/Rectangle 69 (3).png",
                    date: "03 Aug 2022",
                    title: "Going all-in with millennial design",
                  },
                  {
                    imgSrc: "src/Images/About/Rectangle 69 (4).png",
                    date: "03 Aug 2022",
                    title: "Going all-in with millennial design",
                  },
                  {
                    imgSrc: "src/Images/About/Rectangle 69.png",
                    date: "03 Aug 2022",
                    title: "Going all-in with millennial design",
                  },
                ].map((post, index) => (
                  <div key={index} className="flex flex-row gap-3">
                    <img className="w-[80px]" src={post.imgSrc} alt="" />
                    <h1>
                      {post.title}
                      <div className="text-[#9F9F9F]">{post.date}</div>
                    </h1>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Duplicate of Image and Paragraph Section */}
          <div className="flex md:items-start items-center flex-col w-full xl:mt-[-200px] md:mt-[-350px]">
            <img
              className="h-auto max-w-[300px] md:w-[500px] lg:max-w-[600px] xl:max-w-[800px] md:ml-5 xs:items-center object-cover lg:ml-4"
              src="src/Images/About/Rectangle 68.png"
              alt="Responsive Image"
              style={{ width: "100%" }}
            />
     
            <div className="mt-4 grid gap-5 text-center md:text-left">
              <h1 className="ml-4">Going all-in with millennial design</h1>
              <p className="px-4 text-center md:text-left max-w-[300px] md:max-w-[400px] lg:max-w-[800px] ">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Mus
                mauris vitae ultricies leo integer malesuada nunc. In nulla
                posuere sollicitudin aliquam ultrices. Morbi blandit cursus
                risus at ultrices mi tempus imperdiet. Libero enim sed faucibus
                turpis in. Cursus mattis molestie a iaculis at erat. Nibh cras
                pulvinar mattis nunc sed blandit libero. Pellentesque elit
                ullamcorper dignissim cras tincidunt. Pharetra et ultrices neque
                ornare aenean euismod elementum.
              </p>
            </div>
          </div>

          {/* Another Image and Paragraph Section */}
          <div className="flex md:items-start items-center flex-col w-full mt-4">
            <img
              className="h-auto max-w-[300px] md:w-[500px] lg:max-w-[600px] xl:max-w-[800px] md:ml-5 xs:items-center object-cover lg:ml-4"
              src="src/Images/About/Rectangle 68 (1).png"
              alt="Responsive Image"
              style={{ width: "100%" }}
            />
          
            <div className="mt-4 grid gap-5 text-center md:text-left">
              <h1 className="ml-4">Going all-in with millennial design</h1>
              <p className="px-4 text-center md:text-left max-w-[300px] md:max-w-[400px] lg:max-w-[800px]">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Mus
                mauris vitae ultricies leo integer malesuada nunc. In nulla
                posuere sollicitudin aliquam ultrices. Morbi blandit cursus
                risus at ultrices mi tempus imperdiet. Libero enim sed faucibus
                turpis in. Cursus mattis molestie a iaculis at erat. Nibh cras
                pulvinar mattis nunc sed blandit libero. Pellentesque elit
                ullamcorper dignissim cras tincidunt. Pharetra et ultrices neque
                ornare aenean euismod elementum.
              </p>
            </div>
          </div>
          <div className="w-362px flex flex-row items-center justify-center gap-4 mt-12 md:mt-24">
            <div className=" bg-[#B88E2F] w-[60px] h-[60px] rounded-2xl flex justify-center items-center">
              <div className="">1</div>
              
            </div>
            <div className=" bg-[#F9F1E7] w-[60px] h-[60px] rounded-2xl flex justify-center items-center">
              <div className="">2</div>
              
            </div>  <div className=" bg-[#F9F1E7] w-[60px] h-[60px] rounded-2xl flex justify-center items-center">
              <div className="">3</div>

              </div>  <div className=" bg-[#F9F1E7] w-[98px] h-[60px] rounded-2xl flex justify-center items-center">
              <div className="">Next</div>
              
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
