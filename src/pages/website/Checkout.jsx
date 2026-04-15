import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  Loader2,
  CheckCircle,
  XCircle,
  ShoppingBag,
  Tag,
  Check,
  X,
} from "lucide-react";
import { nanoid } from "nanoid";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../../firebase/config";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

// SVG's
import ServicesRibbon from "../../components/common/ServicesRibbon";

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [paymentSettings, setPaymentSettings] = useState({
    codEnabled: true,
    onlinePaymentEnabled: true,
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null); // 'success' | 'error' | null
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    streetAddress: "",
    townCity: "",
    province: "Punjab",
    zipCode: "",
    phone: "",
    email: user?.email || "",
  });

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(cartTotal);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  useEffect(() => {
    setFinalTotal(cartTotal - discountAmount);
  }, [cartTotal, discountAmount]);

  // Auto-hide success/error message after 2 seconds
  useEffect(() => {
    if (orderStatus) {
      const timer = setTimeout(() => {
        setOrderStatus(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [orderStatus]);

  // Fetch payment settings from Firestore
  useEffect(() => {
    const fetchPaymentSettings = async () => {
      try {
        const docRef = doc(db, "settings", "store");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const codEnabled = data.codEnabled ?? true;
          const onlinePaymentEnabled = data.onlinePaymentEnabled || false;
          setPaymentSettings({ codEnabled, onlinePaymentEnabled });

          // Set default payment method based on settings
          if (codEnabled && !onlinePaymentEnabled) {
            setPaymentMethod("cod");
          } else if (!codEnabled && onlinePaymentEnabled) {
            setPaymentMethod("bank-transfer");
          } else if (codEnabled && onlinePaymentEnabled) {
            setPaymentMethod("cod");
          }
        }
      } catch (err) {
        console.error("Error fetching payment settings:", err);
      }
    };
    fetchPaymentSettings();
  }, []);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setCouponLoading(true);
    setCouponError("");

    try {
      const snapshot = await getDocs(collection(db, "discounts"));
      const discounts = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

      const coupon = discounts.find(
        (d) => d.code.toLowerCase() === couponCode.trim().toLowerCase(),
      );

      if (!coupon) {
        setCouponError("Invalid coupon code");
        setAppliedCoupon(null);
        setDiscountAmount(0);
        return;
      }

      if (!coupon.isActive) {
        setCouponError("This coupon is not active");
        setAppliedCoupon(null);
        setDiscountAmount(0);
        return;
      }

      const now = new Date();
      if (coupon.expiryDate && new Date(coupon.expiryDate) < now) {
        setCouponError("This coupon has expired");
        setAppliedCoupon(null);
        setDiscountAmount(0);
        return;
      }

      if (coupon.startDate && new Date(coupon.startDate) > now) {
        setCouponError("This coupon is not yet active");
        setAppliedCoupon(null);
        setDiscountAmount(0);
        return;
      }

      if (coupon.minOrder && cartTotal < coupon.minOrder) {
        setCouponError(
          `Minimum order amount is Rs. ${coupon.minOrder.toLocaleString()}`,
        );
        setAppliedCoupon(null);
        setDiscountAmount(0);
        return;
      }

      if (coupon.usageLimit && (coupon.usedCount || 0) >= coupon.usageLimit) {
        setCouponError("This coupon has reached its usage limit");
        setAppliedCoupon(null);
        setDiscountAmount(0);
        return;
      }

      let discount = 0;
      if (coupon.type === "percentage") {
        discount = (cartTotal * coupon.value) / 100;
      } else {
        discount = coupon.value;
      }

      setAppliedCoupon(coupon);
      setDiscountAmount(discount);
      setCouponError("");
    } catch (err) {
      console.error("Error validating coupon:", err);
      setCouponError("Failed to validate coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setDiscountAmount(0);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!formData.firstName || !formData.streetAddress || !formData.phone) {
      alert("Please fill in required fields (First Name, Address, Phone)");
      return;
    }

    setIsProcessing(true);

    const internalId = nanoid(8).toUpperCase();

    let orderId = "ORD-0001";
    try {
      const snapshot = await getDocs(collection(db, "orders"));
      const orderNumber = snapshot.size + 1;
      orderId = `ORD-${String(orderNumber).padStart(4, "0")}`;
    } catch (err) {
      console.error("Error fetching order count:", err);
    }

    const orderPayload = {
      orderId,
      internalId,
      userId: user?.uid || (auth.currentUser ? auth.currentUser.uid : "guest"),
      customerName: `${formData.firstName} ${formData.lastName}`,
      customerEmail: formData.email,
      items: cart,
      subtotal: cartTotal,
      discountAmount: discountAmount,
      totalAmount: finalTotal,
      couponCode: appliedCoupon ? appliedCoupon.code : null,
      couponId: appliedCoupon ? appliedCoupon.id : null,
      status: paymentMethod === "online" ? "pending_payment" : "pending",
      paymentMethod,
      shippingAddress: {
        fullName: `${formData.firstName} ${formData.lastName}`,
        street: formData.streetAddress,
        city: formData.townCity,
        zip: formData.zipCode,
        province: formData.province,
        phone: formData.phone,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      if (paymentMethod === "online") {
        const docRef = await addDoc(collection(db, "orders"), orderPayload);
        
        if (docRef.id) {
          if (appliedCoupon) {
            try {
              const couponRef = doc(db, "discounts", appliedCoupon.id);
              const couponSnap = await getDoc(couponRef);
              const currentUsedCount = couponSnap.data()?.usedCount || 0;
              await updateDoc(couponRef, {
                usedCount: currentUsedCount + 1,
              });
            } catch (err) {
              console.error("Error updating coupon usage:", err);
            }
          }
          
          clearCart();
          const orderDocId = docRef.id;
          
          const payfastMode = import.meta.env.VITE_PAYFAST_MODE || "sandbox";
          const payfastBaseUrl = payfastMode === "production" 
            ? "https://www.payfast.co.za/pay/onsite" 
            : "https://sandbox.payfast.co.za/pay/onsite";
          const payfastUrl = `${payfastBaseUrl}?req_token=${orderDocId}`;
          
          window.location.href = payfastUrl;
        } else {
          setOrderStatus("error");
        }
      } else {
        const docRef = await addDoc(collection(db, "orders"), orderPayload);

        if (docRef.id) {
          if (appliedCoupon) {
            try {
              const couponRef = doc(db, "discounts", appliedCoupon.id);
              const couponSnap = await getDoc(couponRef);
              const currentUsedCount = couponSnap.data()?.usedCount || 0;
              await updateDoc(couponRef, {
                usedCount: currentUsedCount + 1,
              });
            } catch (err) {
              console.error("Error updating coupon usage:", err);
            }
          }
          setOrderStatus("success");
          clearCart();
        } else {
          setOrderStatus("error");
        }
      }
    } catch (err) {
      console.error("Error placing order:", err);
      setOrderStatus("error");
    } finally {
      setIsProcessing(false);
    }
  };

  const inputStyles =
    "w-full p-4 border border-[#9F9F9F] rounded-xl focus:border-[#B88E2F] outline-none transition-all text-[16px] bg-white";
  const labelStyles = "block text-[16px] font-bold text-black mb-4 mt-6";

  if (cart.length === 0 && !orderStatus) {
    return (
      <div className="pt-40 pb-24 text-center">
        <ShoppingBag
          size={64}
          className="mx-auto text-[#D1D5DB] mb-6 opacity-20"
        />
        <h2 className="text-[32px] font-bold text-black mb-4">
          Cannot Checkout
        </h2>
        <p className="text-[#898989] mb-8">
          Your cart is empty. Add products to proceed.
        </p>
        <Link
          to="/shop"
          className="bg-[#B88E2F] text-white px-12 py-3 rounded-xl font-bold"
        >
          Back To Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Page Header Banner */}
      <div className="bg-[#F9F1E7] relative h-[316px] flex flex-col items-center justify-center bg-[url('/src/Images/Shop/shop-banner.png')] bg-cover bg-center">
        <div className="absolute inset-0 bg-white/20"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-[48px] font-bold text-black">Checkout</h1>
          <div className="flex items-center gap-2 justify-center text-[16px]">
            <span className="font-bold">Home</span>
            <span className="font-bold">{">"}</span>
            <span className="font-medium text-[#333333]">Checkout</span>
          </div>
        </div>
      </div>

      <div className="pt-20 pb-24 max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32">
          {/* Form Side */}
          <div className="space-y-4">
            <h2 className="text-[36px] font-bold mb-8 text-black">
              Billing Details
            </h2>
            <form
              id="checkout-form"
              className="space-y-2"
              onSubmit={handlePlaceOrder}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label htmlFor="firstName" className={labelStyles}>
                    First Name *
                  </label>
                  <input
                    required
                    type="text"
                    id="firstName"
                    className={inputStyles}
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className={labelStyles}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    className={inputStyles}
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="companyName" className={labelStyles}>
                  Company Name (Optional)
                </label>
                <input
                  type="text"
                  id="companyName"
                  className={inputStyles}
                  value={formData.companyName}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="streetAddress" className={labelStyles}>
                  Street Address *
                </label>
                <input
                  required
                  type="text"
                  id="streetAddress"
                  className={inputStyles}
                  value={formData.streetAddress}
                  onChange={handleInputChange}
                  placeholder="House number and street name"
                />
              </div>

              <div>
                <label htmlFor="townCity" className={labelStyles}>
                  Town / City *
                </label>
                <input
                  required
                  type="text"
                  id="townCity"
                  className={inputStyles}
                  value={formData.townCity}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="province" className={labelStyles}>
                  Province *
                </label>
                <div className="relative">
                  <select
                    id="province"
                    className={`${inputStyles} appearance-none bg-transparent`}
                    value={formData.province}
                    onChange={handleInputChange}
                  >
                    <option value="Sindh">Sindh</option>
                    <option value="Punjab">Punjab</option>
                    <option value="KPK">KPK</option>
                    <option value="Balochistan">Balochistan</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label htmlFor="zipCode" className={labelStyles}>
                  ZIP Code
                </label>
                <input
                  type="text"
                  id="zipCode"
                  className={inputStyles}
                  value={formData.zipCode}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="phone" className={labelStyles}>
                  Phone *
                </label>
                <input
                  required
                  type="tel"
                  id="phone"
                  className={inputStyles}
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="email" className={labelStyles}>
                  Email Address *
                </label>
                <input
                  required
                  type="email"
                  id="email"
                  className={inputStyles}
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </form>
          </div>

          {/* Summary Side */}
          <div className="flex flex-col pt-12">
            <div className="space-y-6 pb-8 border-b border-[#D9D9D9]">
              <div className="flex justify-between items-center text-[24px] font-bold">
                <span className="text-black">Product</span>
                <span className="text-black">Subtotal</span>
              </div>

              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center text-[16px]"
                >
                  <span className="text-[#9F9F9F]">
                    {item.name}{" "}
                    <span className="text-black text-[12px] ml-2 font-bold">
                      x {item.quantity}
                    </span>
                  </span>
                  <span className="text-black font-medium">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}

              <div className="flex justify-between items-center text-[16px] pt-4 border-t border-[#D9D9D9]">
                <span className="text-black font-bold">Subtotal</span>
                <span className="text-black font-medium">
                  Rs. {cartTotal.toLocaleString()}
                </span>
              </div>

              {/* Coupon Section */}
              <div className="bg-[#F9F1E7] p-4 rounded-lg">
                <label className="block text-[14px] font-bold text-black mb-2">
                  <Tag size={14} className="inline mr-1" /> Have a coupon?
                </label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-[#B88E2F]">
                    <div>
                      <span className="text-[14px] font-bold text-[#B88E2F]">
                        {appliedCoupon.code}
                      </span>
                      <span className="text-[12px] text-[#0F6E56] ml-2">
                        (
                        {appliedCoupon.type === "percentage"
                          ? `${appliedCoupon.value}% off`
                          : `Rs. ${appliedCoupon.value} off`}
                        )
                      </span>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-[12px] text-[#A32D2D] hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) =>
                        setCouponCode(e.target.value.toUpperCase())
                      }
                      className="flex-1 p-3 border border-[#D1D5DB] rounded-lg text-[14px] focus:outline-none focus:border-[#B88E2F]"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={couponLoading}
                      className="px-4 py-2 bg-[#B88E2F] text-white rounded-lg text-[14px] font-medium hover:bg-[#A47E2A] transition-all disabled:opacity-50"
                    >
                      {couponLoading ? "..." : "Apply"}
                    </button>
                  </div>
                )}
                {couponError && (
                  <p className="text-[12px] text-[#E24B4A] mt-2">
                    {couponError}
                  </p>
                )}
                {appliedCoupon && (
                  <p className="text-[12px] text-[#0F6E56] mt-2 flex items-center">
                    <Check size={12} className="mr-1" /> Coupon applied! You
                    save Rs. {discountAmount.toLocaleString()}
                  </p>
                )}
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between items-center text-[16px]">
                  <span className="text-black font-bold">Discount</span>
                  <span className="text-[#0F6E56] font-medium">
                    -Rs. {discountAmount.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center text-[24px] font-bold">
                <span className="text-black">Total</span>
                <span className="text-[#B88E2F]">
                  Rs. {finalTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Payment Section */}
            <div className="mt-8 space-y-6">
              <div className="flex flex-col gap-3">
                {paymentSettings.codEnabled && (
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="accent-[#B88E2F] w-4 h-4 shadow-sm"
                    />
                    <span className="text-[14px] text-[#333333] font-medium">
                      Cash On Delivery
                    </span>
                  </label>
                )}

                {paymentSettings.onlinePaymentEnabled && (
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={paymentMethod === "online"}
                      onChange={() => setPaymentMethod("online")}
                      className="accent-[#B88E2F] w-4 h-4 shadow-sm"
                    />
                    <span className="text-[14px] text-[#333333] font-medium">
                      Online Payment (PayFast)
                    </span>
                  </label>
                )}
              </div>

              {paymentMethod === "online" && (
                <div className="mt-3 border border-[#E5E7EB] rounded-xl p-4 animate-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[13px] font-medium text-[#333333]">
                      🔒 Secure Payment via PayFast
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 mb-3">
                    {['Credit / Debit Card', 'JazzCash', 'Easypaisa'].map(method => (
                      <div key={method} className="flex items-center gap-2">
                        <span className="text-[#2EC1AC] text-[12px]">✓</span>
                        <span className="text-[13px] text-[#616161]">{method}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-[12px] text-[#9F9F9F] border-t border-[#E5E7EB] pt-3">
                    You will be redirected to PayFast's secure page after clicking Place Order.
                  </p>
                </div>
              )}

              <p className="text-[14px] font-medium text-black leading-[24px] pt-4">
                Your personal data will be used to support your experience
                throughout this website, to manage access to your account, and
                for other purposes described in our{" "}
                <span className="font-bold underline cursor-pointer">
                  privacy policy
                </span>
                .
              </p>

              <button
                form="checkout-form"
                type="submit"
                disabled={isProcessing}
                className="w-full mt-4 py-6 border border-black rounded-2xl text-[20px] font-medium hover:bg-black hover:text-white transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-3"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Place Order"
                )}
              </button>

              {/* Success/Error Message */}
              {orderStatus && (
                <div
                  className={`mt-4 p-4 rounded-xl text-center ${orderStatus === "success" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
                >
                  {orderStatus === "success" ? (
                    <div className="flex flex-col items-center">
                      <CheckCircle className="h-8 w-8 text-green-600 mb-2" />
                      <p className="text-green-700 font-medium">
                        Order placed successfully!
                      </p>
                      <p className="text-green-600 text-sm mt-1">
                        Your order will be delivered within 3-5 business days.
                      </p>
                      <button
                        onClick={() => navigate("/shop")}
                        className="mt-3 text-green-700 font-semibold text-sm hover:underline"
                      >
                        Continue Shopping
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <XCircle className="h-8 w-8 text-red-600 mb-2" />
                      <p className="text-red-700 font-medium">
                        Order failed. Please try again.
                      </p>
                      <button
                        onClick={() => setOrderStatus(null)}
                        className="mt-3 text-red-700 font-semibold text-sm hover:underline"
                      >
                        Try Again
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Services Ribbon */}
      <ServicesRibbon />
    </div>
  );
}
