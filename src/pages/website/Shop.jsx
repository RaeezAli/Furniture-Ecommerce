import { useState, useEffect, useMemo } from "react"
import { useFirestore } from "../../hooks/useFirestore"
import Card from "../../components/common/Card"

// SVG's
import ServicesRibbon from "../../components/common/ServicesRibbon"
import FilterIcon from "../../svgs/FilterIcon"
import GridBigRoundIcon from "../../svgs/GridBigRoundIcon"
import ViewList from "../../svgs/ViewList"

export default function Shop() {
  const { fetchCollection, loading } = useFirestore()
  const [products, setProducts] = useState([])
  const [sortBy, setSortBy] = useState("default")
  const [showCount, setShowCount] = useState(4)
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchCollection("products")
      setProducts(data)
    }
    loadProducts()
  }, [fetchCollection])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [categoryFilter, sortBy, showCount])

  const categories = ["All", ...new Set(products.map(p => p.category).filter(Boolean))]

  const filteredAndSorted = useMemo(() => {
    let result = products.filter(p => categoryFilter === "All" || p.category === categoryFilter)

    if (sortBy === "price-asc") result.sort((a, b) => Number(a.price) - Number(b.price))
    else if (sortBy === "price-desc") result.sort((a, b) => Number(b.price) - Number(a.price))
    else if (sortBy === "name-asc") result.sort((a, b) => (a.name || "").localeCompare(b.name || ""))

    return result
  }, [products, sortBy, categoryFilter])

  const totalPages = Math.ceil(filteredAndSorted.length / showCount)

  const processedProducts = useMemo(() => {
    const start = (currentPage - 1) * showCount
    return filteredAndSorted.slice(start, start + showCount)
  }, [filteredAndSorted, currentPage, showCount])

  // Sliding window: always show 3 page numbers centered around currentPage
  const getPageNumbers = () => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    if (currentPage === 1) return [1, 2, 3]
    if (currentPage === totalPages) return [totalPages - 2, totalPages - 1, totalPages]
    return [currentPage - 1, currentPage, currentPage + 1]
  }


  return (
    <main id="page-2" className="bg-white pt-16">
      {/* Page Header */}
      <div className="bg-[#F9F1E7] relative h-[316px] flex flex-col items-center justify-center bg-[url('/src/Images/Common/bg.jpg')] bg-cover bg-center backdrop-blur-lg">
        <div className="absolute inset-0 bg-white/60"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-[48px] font-bold text-black">Shop</h1>
          <div className="flex items-center gap-2 justify-center text-[16px]">
            <span className="font-bold">Home</span>
            <span className="font-bold">{">"}</span>
            <span className="font-medium text-[#333333]">Shop</span>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <section className="w-full bg-[#F9F1E7] px-4 md:px-16 py-4 flex flex-col lg:flex-row justify-between items-center gap-6 sticky top-20 z-20 border-b border-[#E5E7EB] shadow-sm">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3 font-medium text-[20px]">
            <FilterIcon />
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="bg-transparent outline-none cursor-pointer hover:text-[#B88E2F] transition-colors"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-4 border-l-2 border-[#9F9F9F] pl-6">
            <button className="hover:scale-110 transition-transform"><GridBigRoundIcon /></button>
            <button className="hover:scale-110 transition-transform"><ViewList /></button>
          </div>
          <span className="text-[16px] text-[#333333] font-medium hidden lg:block">
            {loading
              ? "Loading..."
              : `Showing ${filteredAndSorted.length === 0 ? 0 : (currentPage - 1) * showCount + 1}–${Math.min(currentPage * showCount, filteredAndSorted.length)} of ${filteredAndSorted.length} results`
            }
          </span>
        </div>

        <div className="flex flex-wrap gap-6 items-center">
          <div className="flex items-center gap-4">
            <span className="text-[20px] text-black">Show</span>
            <select
              className="h-[55px] px-4 bg-white text-[#9F9F9F] outline-none rounded-lg"
              value={showCount}
              onChange={e => setShowCount(Number(e.target.value))}
            >
              <option value="4">4</option>
              <option value="8">8</option>
              <option value="12">12</option>
              <option value="16">16</option>
            </select>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[20px] text-black">Sort by</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="h-[55px] px-6 bg-white text-[#9F9F9F] outline-none min-w-[150px] rounded-lg"
            >
              <option value="default">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 px-4 md:px-16 lg:px-8 max-w-7xl mx-auto min-h-[600px]">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-[#F4F5F7] h-[400px] rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : processedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="text-[#D1D5DB] mb-4 scale-150"><GridBigRoundIcon /></div>
            <p className="text-[20px] font-bold text-[#333333]">No products found</p>
            <p className="text-[#898989]">Try adjusting your filters or category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {processedProducts.map((item) => (
              <div key={item.id} className="group h-full">
                <Card props={item} />
              </div>
            ))}
          </div>
        )}

        {/* Dynamic Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center gap-4 mt-20">

            {/* Prev button */}
            {currentPage > 1 && (
              <button
                onClick={() => setCurrentPage(p => p - 1)}
                className="px-8 h-[60px] bg-[#F9F1E7] text-black rounded-xl font-bold hover:bg-[#B88E2F] hover:text-white transition-all"
              >
                Prev
              </button>
            )}

            {/* Page number buttons */}
            {getPageNumbers().map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-[60px] h-[60px] rounded-xl font-bold transition-all
                  ${currentPage === page
                    ? "bg-[#B88E2F] text-white"
                    : "bg-[#F9F1E7] text-black hover:bg-[#B88E2F] hover:text-white"
                  }`}
              >
                {page}
              </button>
            ))}

            {/* Next button */}
            {currentPage < totalPages && (
              <button
                onClick={() => setCurrentPage(p => p + 1)}
                className="px-8 h-[60px] bg-[#F9F1E7] text-black rounded-xl font-bold hover:bg-[#B88E2F] hover:text-white transition-all"
              >
                Next
              </button>
            )}

          </div>
        )}
      </section>

      {/* Services Section */}
      <ServicesRibbon />
    </main>
  )
}