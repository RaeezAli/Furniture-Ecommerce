import { useState, useMemo } from "react"
import "../App.css"
import getProducts from "../actions/getProducts"
import Card from "../components/common/Card"

// SVG's
import ShippingIcon from "../svgs/ShippingIcon"
import GuaranteeIcon from "../svgs/GuaranteeIcon"
import CustomerSupportIcon from "../svgs/CustomerSupportIcon"
import TrophyIcon from "../svgs/TrophyIcon"
import FilterIcon from "../svgs/FilterIcon"
import GridBigRoundIcon from "../svgs/GridBigRoundIcon"
import ViewList from "../svgs/ViewList"
import { Link } from "react-router-dom"

export default function Shop() {
  const products = getProducts()
  const [sortBy, setSortBy] = useState("default")

  const sortedProducts = useMemo(() => {
    let result = [...products]
    
    // Sort logic
    if (sortBy === "price-asc") {
      result.sort((a, b) => {
        const priceA = parseFloat(a.price.replace(/,/g, ""))
        const priceB = parseFloat(b.price.replace(/,/g, ""))
        return priceA - priceB
      })
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => {
        const priceA = parseFloat(a.price.replace(/,/g, ""))
        const priceB = parseFloat(b.price.replace(/,/g, ""))
        return priceB - priceA
      })
    } else if (sortBy === "name-asc") {
      result.sort((a, b) => a.title.localeCompare(b.title))
    }
    
    return result
  }, [products, sortBy])

  const services = [
    {
      icon: <TrophyIcon />,
      title: "High Quality",
      description: "crafted from top materials",
    },
    {
      icon: <GuaranteeIcon />,
      title: "Warranty Protection",
      description: "Over 2 years",
    },
    {
      icon: <ShippingIcon />,
      title: "Free Shipping",
      description: "Order over 150 $",
    },
    {
      icon: <CustomerSupportIcon />,
      title: "24 / 7 Support",
      description: "Dedicated support",
    },
  ]

  return (
    <main id="page-2" className="mt-20">
      {/* Hero Section */}
 

      {/* Filter Section */}
      <section className="w-full bg-[#FCF8F3] p-4 md:p-6 lg:p-8 flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 md:gap-6 font-normal text-base md:text-xl">
          <button className="flex items-center gap-2 hover:text-amber-700 transition-colors">
            <FilterIcon />
            <span>Filter</span>
          </button>
          <div className="flex items-center gap-3 ml-2">
            <button className="p-1.5 rounded-md hover:bg-amber-100 transition-all">
              <GridBigRoundIcon />
            </button>
            <button className="p-1.5 rounded-md hover:bg-amber-100 transition-all">
              <ViewList />
            </button>
          </div>
          <span className="hidden md:flex text-sm md:text-base border-l-2 border-gray-300 items-center pl-4 md:pl-6 text-gray-600">
            Showing 1–{sortedProducts.length} of {products.length} results
          </span>
        </div>
        <div className="flex flex-wrap gap-3 md:gap-4 items-center">
          <span className="text-gray-700">Show</span>
          <select className="py-2 px-3 w-16 border border-gray-200 rounded-md bg-white outline-none focus:border-amber-500 transition-colors">
            <option value="8">8</option>
            <option value="16">16</option>
            <option value="24">24</option>
          </select>
          <span className="text-gray-700">Sort By</span>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="py-2 px-3 border border-gray-200 rounded-md bg-white outline-none focus:border-amber-500 transition-colors"
          >
            <option value="default">Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
          </select>
        </div>
      </section>

      {/* Products Grid */}
      <Link to='/product'>
      <section className="py-8 md:py-10 px-4 md:px-8 lg:px-16 xl:px-28">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        

          {sortedProducts.map((item, index) => (
            <div key={index} className="group transform transition-transform duration-300 hover:-translate-y-1">
              <Card props={item} />
            </div>
          ))}
        </div>
      </section>
      </Link>

      {/* Services Section */}
      <section className="w-full bg-[#FCF8F3] px-4 md:px-8 lg:px-12 py-12 md:py-16 lg:py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((item, idx) => (
            <div
              className="flex gap-4 justify-center items-center bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              key={idx}
            >
              <div className="text-amber-800">{item.icon}</div>
              <div>
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

