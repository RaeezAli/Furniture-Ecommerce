import { FaSearch } from "react-icons/fa"
import img1 from "../Images/about/68 (1).png"
import img2 from "../Images/about/Rectangle 69 (1).png"
import img3 from "../Images/about/Rectangle 69 (2).png"
import img4 from "../Images/about/Rectangle 69 (3).png"
import img5 from "../Images/about/Rectangle 69 (4).png"
import img6 from "../Images/about/Rectangle 68 (1).png"
import img7 from "../Images/about/Rectangle 68.png"
import img8 from "../Images/about/Rectangle 69.png"

export default function About() {
  const categories = [
    { name: "Craft", count: 2 },
    { name: "Design", count: 8 },
    { name: "Handmade", count: 7 },
    { name: "Interior", count: 1 },
    { name: "Wood", count: 6 },
  ]

  const recentPosts = [
    {
      imgSrc: img2,
      date: "03 Aug 2022",
      title: "Going all-in with millennial design",
    },
    {
      imgSrc: img3,
      date: "03 Aug 2022",
      title: "Going all-in with millennial design",
    },
    {
      imgSrc: img4,
      date: "03 Aug 2022",
      title: "Going all-in with millennial design",
    },
    {
      imgSrc: img5,
      date: "03 Aug 2022",
      title: "Going all-in with millennial design",
    },
    {
      imgSrc: img8,
      date: "03 Aug 2022",
      title: "Going all-in with millennial design",
    },
  ]

  return (
    <main className="w-full max-w-[1440px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 mt-20 md:mt-28 lg:mt-36">
      <section className="w-full">
        {/* Main content and sidebar */}
        <div className="flex flex-col-reverse md:flex-row justify-between gap-6 md:gap-8 lg:gap-12">
          {/* Main content column */}
          <div className="w-full md:w-2/3 flex flex-col items-center md:items-start">
            {/* First article */}
            <article className="w-full mb-12">
              <div className="overflow-hidden rounded-lg">
                <img
                  className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105"
                  src={img1 || "/placeholder.svg"}
                  alt="Millennial design article"
                />
              </div>

              <div className="mt-6 space-y-4">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">Going all-in with millennial design</h2>
                <p className="text-sm sm:text-base text-gray-700">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua. Mus mauris vitae ultricies leo integer malesuada nunc. In nulla posuere
                  sollicitudin aliquam ultrices. Morbi blandit cursus risus at ultrices mi tempus imperdiet. Libero enim
                  sed faucibus turpis in. Cursus mattis molestie a iaculis at erat. Nibh cras pulvinar mattis nunc sed
                  blandit libero. Pellentesque elit ullamcorper dignissim cras tincidunt. Pharetra et ultrices neque
                  ornare aenean euismod elementum.
                </p>
              </div>
            </article>

            {/* Second article */}
            <article className="w-full mb-12">
              <div className="overflow-hidden rounded-lg" >
                <img
                  className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105"
                  src={img6 || "/placeholder.svg"}
                  alt="Millennial design article"
                />
              </div>

              <div className="mt-6 space-y-4">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">Going all-in with millennial design</h2>
                <p className="text-sm sm:text-base text-gray-700">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua. Mus mauris vitae ultricies leo integer malesuada nunc. In nulla posuere
                  sollicitudin aliquam ultrices. Morbi blandit cursus risus at ultrices mi tempus imperdiet. Libero enim
                  sed faucibus turpis in. Cursus mattis molestie a iaculis at erat. Nibh cras pulvinar mattis nunc sed
                  blandit libero. Pellentesque elit ullamcorper dignissim cras tincidunt. Pharetra et ultrices neque
                  ornare aenean euismod elementum.
                </p>
              </div>
            </article>

            {/* Third article */}
            <article className="w-full mb-12">
              <div className="overflow-hidden rounded-lg">
                <img
                  className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105"
                  src={img7 || "/placeholder.svg"}
                  alt="Millennial design article"
                />
              </div>

              <div className="mt-6 space-y-4">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">Going all-in with millennial design</h2>
                <p className="text-sm sm:text-base text-gray-700">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua. Mus mauris vitae ultricies leo integer malesuada nunc. In nulla posuere
                  sollicitudin aliquam ultrices. Morbi blandit cursus risus at ultrices mi tempus imperdiet. Libero enim
                  sed faucibus turpis in. Cursus mattis molestie a iaculis at erat. Nibh cras pulvinar mattis nunc sed
                  blandit libero. Pellentesque elit ullamcorper dignissim cras tincidunt. Pharetra et ultrices neque
                  ornare aenean euismod elementum.
                </p>
              </div>
            </article>

            {/* Pagination */}
            <div className="w-full flex justify-center mt-8 mb-12">
              <div className="flex items-center gap-2 sm:gap-4">
                <button className="bg-[#B88E2F] text-white w-10 h-10 sm:w-[60px] sm:h-[60px] rounded-xl sm:rounded-2xl flex justify-center items-center font-medium hover:opacity-90 transition-opacity">
                  1
                </button>
                <button className="bg-[#F9F1E7] text-gray-800 w-10 h-10 sm:w-[60px] sm:h-[60px] rounded-xl sm:rounded-2xl flex justify-center items-center font-medium hover:bg-[#F0E6D9] transition-colors">
                  2
                </button>
                <button className="bg-[#F9F1E7] text-gray-800 w-10 h-10 sm:w-[60px] sm:h-[60px] rounded-xl sm:rounded-2xl flex justify-center items-center font-medium hover:bg-[#F0E6D9] transition-colors">
                  3
                </button>
                <button className="bg-[#F9F1E7] text-gray-800 w-16 h-10 sm:w-[98px] sm:h-[60px] rounded-xl sm:rounded-2xl flex justify-center items-center font-medium hover:bg-[#F0E6D9] transition-colors">
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full md:w-1/3 md:max-w-[350px] mb-8 md:mb-0">
            <div className="sticky top-24 space-y-8">
              {/* Search */}
              <div className="w-full max-w-[350px] mx-auto mt-12 md:mt-0">
                <div className="flex items-center w-full h-[58px] border-2 border-gray-300 rounded-lg overflow-hidden focus-within:border-[#B88E2F] transition-colors">
                  <input
                    type="text"
                    placeholder="Search articles..."
                    className="flex-1 h-full focus:outline-none text-gray-700 px-4"
                  />
                  <button className="px-4 text-gray-500 hover:text-[#B88E2F] transition-colors">
                    <FaSearch />
                  </button>
                </div>
              </div>

              {/* Categories */}
              <div className="w-full max-w-[350px] mx-auto">
                <h3 className="text-xl font-semibold mb-6">Categories</h3>
                <div className="space-y-4">
                  {categories.map((category) => (
                    <div
                      key={category.name}
                      className="flex justify-between w-full text-base border-b border-gray-100 pb-3 hover:text-[#B88E2F] cursor-pointer transition-colors"
                    >
                      <p className="text-gray-500">{category.name}</p>
                      <p className="text-gray-400">{category.count}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Posts */}
              <div className="w-full max-w-[350px] mx-auto">
                <h3 className="text-xl font-semibold mb-6">Recent Posts</h3>
                <div className="space-y-6">
                  {recentPosts.map((post, index) => (
                    <div key={index} className="flex gap-4 group cursor-pointer">
                      <div className="w-[80px] h-[80px] overflow-hidden rounded-md flex-shrink-0">
                        <img
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          src={post.imgSrc || "/placeholder.svg"}
                          alt={post.title}
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h4 className="text-sm font-medium group-hover:text-[#B88E2F] transition-colors line-clamp-2 leading-relaxed">
                          {post.title}
                        </h4>
                        <p className="text-xs text-[#9F9F9F] mt-1">{post.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags Cloud */}
              <div className="w-full max-w-[350px] mx-auto">
                <h3 className="text-xl font-semibold mb-6">Popular Tags</h3>
                <div className="flex flex-wrap gap-2 text-[#9F9F9F]">
                  {[
                    "Design",
                    "Interior",
                    "Home",
                    "Furniture",
                    "Wood",
                    "Decor",
                    "Minimal",
                    "Modern",
                    "Craft",
                    "DIY",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-2 bg-gray-50 text-sm rounded-lg cursor-not-allowed hover:bg-[#B88E2F] hover:text-white transition-all"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
