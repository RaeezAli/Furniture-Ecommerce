import React from "react";
import { Link } from "react-router-dom";
import { Trash2, ChevronRight, ShoppingBag, Plus, Minus } from "lucide-react";
import { useCart } from "../../context/CartContext";

// SVG's
import ServicesRibbon from "../../components/common/ServicesRibbon";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();


  return (
    <div className="bg-white pt-16">
      {/* Page Header Banner */}
      <div className="bg-[#F9F1E7] relative h-[316px] flex flex-col items-center justify-center bg-[url('/src/Images/Common/bg.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-white/60"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-[48px] font-bold text-black">Cart</h1>
          <div className="flex items-center gap-2 justify-center text-[16px]">
            <span className="font-bold">Home</span>
            <span className="font-bold">{">"}</span>
            <span className="font-medium text-[#333333]">Cart</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-8 lg:px-8 py-16">
        {cart.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center">
            <div className="w-20 h-20 bg-[#F9F1E7] rounded-full flex items-center justify-center text-[#B88E2F] mb-6">
              <ShoppingBag size={40} />
            </div>
            <h2 className="text-[32px] font-bold text-black mb-4">
              Your cart is empty
            </h2>
            <p className="text-[#898989] mb-8 text-[18px]">
              Looks like you haven&apos;t added anything to your cart yet.
            </p>
            <Link
              to="/shop"
              className="bg-[#B88E2F] text-white px-12 py-3 rounded-xl font-bold hover:bg-[#A47E2A] transition-all"
            >
              Go To Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items Table */}
            <div className="lg:col-span-2 space-y-8">
              <div className="overflow-x-auto rounded-xl">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#F9F1E7] h-[55px]">
                    <tr>
                      <th className="px-4 py-3 text-[16px] font-bold text-black">
                        Product
                      </th>
                      <th className="px-4 py-3 text-[16px] font-bold text-black">
                        Price
                      </th>
                      <th className="px-4 py-3 text-[16px] font-bold text-black">
                        Quantity
                      </th>
                      <th className="px-4 py-3 text-[16px] font-bold text-black whitespace-nowrap">
                        Subtotal
                      </th>
                      <th className="px-4 py-3 text-[16px] font-bold text-black"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-transparent">
                    {cart.map((item) => (
                      <tr
                        key={item.id}
                        className="group border-b border-[#E5E7EB]"
                      >
                        <td className="py-8 px-2 min-w-[300px]">
                          <div className="flex items-center gap-4">
                            <div className="w-[105px] h-[105px] bg-[#F9F1E7] rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="text-[16px] text-[#9F9F9F] font-medium">
                              {item.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-8 px-4">
                          <span className="text-[16px] text-[#9F9F9F]">
                            Rs. {item.price?.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-8 px-4">
                          <div className="flex items-center gap-2 border border-[#9F9F9F] rounded-lg p-2 max-w-[100px] bg-white">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="hover:text-[#B88E2F] transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="flex-1 text-center text-[16px] font-bold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="hover:text-[#B88E2F] transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </td>
                        <td className="py-8 px-4">
                          <span className="text-[16px] text-black font-bold">
                            Rs. {(item.price * item.quantity).toLocaleString()}
                          </span>
                        </td>
                        <td className="py-8 px-4 text-right">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-[#B88E2F] hover:text-[#A47E2A] p-2 hover:bg-[#F9F1E7] rounded-lg transition-all"
                            title="Remove item"
                          >
                            <Trash2 size={24} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center pt-8 border-t border-[#D9D9D9]">
                <Link
                  to="/shop"
                  className="text-[#B88E2F] font-bold text-[16px] hover:underline flex items-center gap-2"
                >
                  <ChevronRight size={18} className="rotate-180" /> Continue
                  Shopping
                </Link>
              </div>
            </div>

            {/* Cart Totals Sidebar */}
            <div className="bg-[#F9F1E7] rounded-[15px] p-8 h-fit shadow-sm sticky top-32">
              <h2 className="text-[32px] font-bold text-black text-center mb-10">
                Cart Totals
              </h2>
              <div className="space-y-6">
                <div className="flex justify-between items-center text-[16px]">
                  <span className="font-bold">Subtotal</span>
                  <span className="text-[#9F9F9F]">
                    Rs. {cartTotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[16px] pb-10 border-b border-[#D9D9D9]">
                  <span className="font-bold">Total</span>
                  <span className="text-[20px] font-bold text-[#B88E2F]">
                    Rs. {cartTotal.toLocaleString()}
                  </span>
                </div>
                <Link to="/checkout" className="block w-full">
                  <button className="w-full h-[58px] border border-black rounded-[15px] text-[20px] font-medium hover:bg-black hover:text-white transition-all active:scale-95 shadow-lg">
                    Check Out
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Services Ribbon */}
      <ServicesRibbon />
    </div>
  );
};

export default Cart;
