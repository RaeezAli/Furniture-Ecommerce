import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { db } from "../../firebase/config";
import { useAuth } from "../../hooks/useAuth";

const Profile = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const auth = getAuth();

  const [activeTab, setActiveTab] = useState("orders");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Tab 1: Orders
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Tab 2: Personal Info
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    createdAt: null,
  });

  // Tab 3: Addresses
  const [addressData, setAddressData] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    province: "Punjab",
    zip: "",
  });

  // Tab 4: Change Password
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (activeTab === "orders") {
      fetchOrders();
    } else if (activeTab === "info") {
      fetchProfile();
    } else if (activeTab === "address") {
      fetchAddress();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    if (!currentUser) {
      console.log("No user logged in - cannot fetch orders");
      return;
    }
    setOrdersLoading(true);
    
    const ordersRef = collection(db, "orders");
    let ordersData = [];
    
    // Get current user info - MUST have these
    const userUid = currentUser.uid;
    const userEmail = currentUser.email?.toLowerCase();
    
    console.log("Fetching orders for userId:", userUid, "email:", userEmail);
    
    try {
      // Query 1: Filter by userId (the secure way)
      const userQ = query(ordersRef, where("userId", "==", userUid));
      const userSnapshot = await getDocs(userQ);
      
      userSnapshot.forEach(doc => {
        const data = doc.data();
        // Double verify this order belongs to this user
        if (data.userId === userUid || data.customerEmail?.toLowerCase() === userEmail) {
          ordersData.push({ id: doc.id, ...data });
        }
      });
    } catch (e) {
      console.log("userId query error:", e.message);
    }

    try {
      // Query 2: Also check by customerEmail for guest checkout orders
      if (userEmail) {
        const emailQ = query(ordersRef, where("customerEmail", "==", userEmail));
        const emailSnapshot = await getDocs(emailQ);
        
        emailSnapshot.forEach(doc => {
          const data = doc.data();
          // Only add if userId matches or is a guest order
          if (data.userId === userUid || data.userId === "guest" || !data.userId) {
            // Check if not already added
            if (!ordersData.find(o => o.id === doc.id)) {
              ordersData.push({ id: doc.id, ...data });
            }
          }
        });
      }
    } catch (e) {
      console.log("email query error:", e.message);
    }

    // Sort by date
    ordersData.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt || 0);
      const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt || 0);
      return dateB - dateA;
    });

    console.log("Final orders for user:", ordersData.length);
    setOrders(ordersData);
    setOrdersLoading(false);
  };

  const fetchProfile = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        console.log("User doc data:", data);
        console.log("createdAt value:", data.createdAt);
        console.log("createdAt type:", typeof data.createdAt);
        setProfileData({
          name: data.name || "",
          email: currentUser.email || "",
          phone: data.phone || "",
          createdAt: data.createdAt || null,
        });
      } else {
        setProfileData({
          name: currentUser.displayName || "",
          email: currentUser.email || "",
          phone: "",
          createdAt: null,
        });
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setProfileData(prev => ({ ...prev, createdAt: null }));
    } finally {
      setLoading(false);
    }
  };

  const fetchAddress = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (userDoc.exists() && userDoc.data().defaultAddress) {
        setAddressData(userDoc.data().defaultAddress);
      } else if (orders.length > 0) {
        // Use last order's shipping address as default
        const lastOrder = orders[0];
        if (lastOrder.shippingAddress) {
          setAddressData({
            fullName: lastOrder.shippingAddress.fullName || "",
            phone: lastOrder.shippingAddress.phone || "",
            street: lastOrder.shippingAddress.street || "",
            city: lastOrder.shippingAddress.city || "",
            province: lastOrder.shippingAddress.province || "Punjab",
            zip: lastOrder.shippingAddress.zip || "",
          });
        }
      }
    } catch (err) {
      console.error("Error fetching address:", err);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, "users", currentUser.uid), {
        name: profileData.name,
        phone: profileData.phone,
        updatedAt: new Date(),
      });
      showToast("Profile updated.");
    } catch (err) {
      console.error("Error saving profile:", err);
      showToast("Failed to save profile.", "error");
    } finally {
      setLoading(false);
    }
  };

  const saveAddress = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, "users", currentUser.uid), {
        defaultAddress: addressData,
        updatedAt: new Date(),
      });
      showToast("Address saved.");
    } catch (err) {
      console.error("Error saving address:", err);
      showToast("Failed to save address.", "error");
    } finally {
      setLoading(false);
    }
  };

  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const changePassword = async () => {
    if (!passwordData.current) {
      setPasswordError("Please enter current password");
      return;
    }
    if (passwordData.new !== passwordData.confirm) {
      setPasswordError("Passwords do not match");
      setPasswordSuccess(false);
      return;
    }
    if (passwordData.new.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      setPasswordSuccess(false);
      return;
    }
    setPasswordLoading(true);
    setPasswordError("");
    setPasswordSuccess(false);
    try {
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        passwordData.current
      );
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, passwordData.new);
      setPasswordData({ current: "", new: "", confirm: "" });
      setPasswordSuccess(true);
      showToast("Password changed successfully.");
    } catch (err) {
      setPasswordSuccess(false);
      if (err.code === "auth/wrong-password") {
        setPasswordError("Current password is incorrect");
      } else if (err.code === "auth/requires-recent-login") {
        setPasswordError("Please log out and log in again to change password");
      } else {
        setPasswordError("Failed to change password. Try again.");
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: "bg-[#FEF3C7] text-[#92400E]",
      processing: "bg-[#DBEAFE] text-[#1E40AF]",
      shipped: "bg-[#E0E7FF] text-[#3730A3]",
      'out-for-delivery': "bg-[#E0E7FF] text-[#3730A3]",
      delivered: "bg-[#D1FAE5] text-[#065F46]",
      cancelled: "bg-[#FEE2E2] text-[#991B1B]",
    };
    const color = statusColors[status?.toLowerCase()] || "bg-gray-100 text-gray-800";
    const statusLabel = {
      pending: "Pending",
      processing: "Processing",
      shipped: "Shipped",
      'out-for-delivery': "Out for Delivery",
      delivered: "Delivered",
      cancelled: "Cancelled",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-[11px] font-medium ${color}`}>
        {statusLabel[status?.toLowerCase()] || status || "Pending"}
      </span>
    );
  };

  const [expandedOrder, setExpandedOrder] = useState(null);

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const memberSince = (() => {
    console.log("profileData.createdAt:", profileData.createdAt);
    console.log("currentUser.metadata:", currentUser?.metadata);
    
    let dateToUse = null;
    
    // Priority 1: Firebase Auth metadata
    if (currentUser?.metadata?.createdAt) {
      const authDate = new Date(currentUser.metadata.createdAt);
      if (!isNaN(authDate.getTime())) {
        dateToUse = authDate;
      }
    }
    
    // Priority 2: Firestore createdAt
    if (!dateToUse && profileData.createdAt) {
      try {
        // Check if it's a Firestore Timestamp (has toDate function)
        if (typeof profileData.createdAt.toDate === 'function') {
          dateToUse = profileData.createdAt.toDate();
        } else if (profileData.createdAt instanceof Date) {
          dateToUse = profileData.createdAt;
        } else if (typeof profileData.createdAt === 'string') {
          dateToUse = new Date(profileData.createdAt);
        }
      } catch (e) {
        console.log("date parse error:", e);
      }
    }
    
    if (dateToUse && !isNaN(dateToUse.getTime())) {
      return dateToUse.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    }
    
    return "Just now";
  })();

  const tabs = [
    { id: "orders", label: "My Orders" },
    { id: "info", label: "Personal Info" },
    { id: "address", label: "Addresses" },
    { id: "password", label: "Change Password" },
  ];

  return (
    <div className="pt-24 pb-16 max-w-6xl mx-auto px-4">
      {toast && (
        <div
          className={`fixed top-20 right-5 z-50 bg-white border-l-4 ${
            toast.type === "success" ? "border-[#2EC1AC]" : "border-[#E24B4A]"
          } border border-[#E5E7EB] rounded-lg px-4 py-3 text-[13px] text-[#333333] shadow-md`}
        >
          {toast.message}
        </div>
      )}

      <h1 className="text-[28px] font-bold text-[#333333] mb-8">My Profile</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Panel - User Info */}
        <div className="md:w-64 flex-shrink-0">
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 text-center md:text-left">
            <div className="w-14 h-14 rounded-full bg-[#FCF8F3] border border-[#E5E7EB] flex items-center justify-center text-[#B88E2F] font-semibold text-lg mx-auto md:mx-0 mb-4">
              {getInitials(profileData.name || currentUser?.displayName)}
            </div>
            <h2 className="text-[16px] font-semibold text-[#333333]">
              {profileData.name || currentUser?.displayName || "User"}
            </h2>
            <p className="text-[13px] text-[#898989] mt-1">{currentUser?.email}</p>
            <p className="text-[12px] text-[#9F9F9F] mt-2">Member since {memberSince}</p>
          </div>
        </div>

        {/* Right Panel - Tabbed Content */}
        <div className="flex-1">
          {/* Tabs */}
          <div className="border-b border-[#E5E7EB] mb-6">
            <div className="flex overflow-x-auto no-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-[14px] px-4 py-2.5 font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "text-[#B88E2F] border-[#B88E2F]"
                      : "text-[#898989] border-transparent hover:text-[#333333]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
            {/* Tab 1: My Orders */}
            {activeTab === "orders" && (
              <div>
                {/* Order Summary */}
                {orders.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    <div className="bg-[#FEF3C7] rounded-lg p-3">
                      <p className="text-[11px] text-[#92400E]">Pending</p>
                      <p className="text-xl font-bold text-[#92400E]">{orders.filter(o => o.status === 'pending').length}</p>
                    </div>
                    <div className="bg-[#DBEAFE] rounded-lg p-3">
                      <p className="text-[11px] text-[#1E40AF]">Processing</p>
                      <p className="text-xl font-bold text-[#1E40AF]">{orders.filter(o => o.status === 'processing').length}</p>
                    </div>
                    <div className="bg-[#D1FAE5] rounded-lg p-3">
                      <p className="text-[11px] text-[#065F46]">Delivered</p>
                      <p className="text-xl font-bold text-[#065F46]">{orders.filter(o => o.status === 'delivered').length}</p>
                    </div>
                    <div className="bg-[#FEE2E2] rounded-lg p-3">
                      <p className="text-[11px] text-[#991B1B]">Cancelled</p>
                      <p className="text-xl font-bold text-[#991B1B]">{orders.filter(o => o.status === 'cancelled').length}</p>
                    </div>
                  </div>
                )}

                {ordersLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-[#B88E2F]" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-[#898989] text-[14px] mb-4">
                      You haven't placed any orders yet
                    </p>
                    <Link
                      to="/shop"
                      className="inline-block bg-[#B88E2F] text-white px-6 py-2 rounded-lg text-[14px] font-medium hover:bg-[#A47E2A]"
                    >
                      Shop Now
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#E5E7EB]">
                          <th className="text-left text-[12px] font-semibold text-[#616161] py-3">Order ID</th>
                          <th className="text-left text-[12px] font-semibold text-[#616161] py-3">Date</th>
                          <th className="text-left text-[12px] font-semibold text-[#616161] py-3">Items</th>
                          <th className="text-left text-[12px] font-semibold text-[#616161] py-3">Amount</th>
                          <th className="text-left text-[12px] font-semibold text-[#616161] py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <React.Fragment key={order.id}>
                            <tr 
                              onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                              className="border-b border-[#E5E7EB] cursor-pointer hover:bg-gray-50"
                            >
                              <td className="py-3 text-[14px] text-[#333333] font-medium">{order.orderId}</td>
                              <td className="py-3 text-[14px] text-[#616161]">{formatDate(order.createdAt)}</td>
                              <td className="py-3 text-[14px] text-[#616161]">{order.items?.length || 1} item(s)</td>
                              <td className="py-3 text-[14px] text-[#333333] font-medium">Rs. {order.totalAmount?.toLocaleString()}</td>
                              <td className="py-3">{getStatusBadge(order.status)}</td>
                            </tr>
                            {expandedOrder === order.id && (
                              <tr key={`${order.id}-details`}>
                                <td colSpan={5} className="bg-gray-50 p-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="text-[12px] font-semibold text-[#616161] mb-2">Order Items</h4>
                                      <div className="space-y-2">
                                        {order.items?.map((item, idx) => (
                                          <div key={idx} className="flex items-center gap-3">
                                            <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                                            <div>
                                              <p className="text-[13px] font-medium text-[#333333]">{item.name}</p>
                                              <p className="text-[12px] text-[#898989]">Qty: {item.quantity} × Rs. {item.price}</p>
                                            </div>
                                          </div>
                                        )) || <p className="text-[13px] text-[#898989]">No items data</p>}
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="text-[12px] font-semibold text-[#616161] mb-2">Shipping Address</h4>
                                      <p className="text-[13px] text-[#616161]">
                                        {order.shippingAddress?.fullName}<br />
                                        {order.shippingAddress?.street}<br />
                                        {order.shippingAddress?.city}, {order.shippingAddress?.province} {order.shippingAddress?.zip}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Personal Info */}
            {activeTab === "info" && (
              <div className="max-w-md">
                <div className="space-y-4">
                  <div>
                    <label className="text-[12px] font-medium text-[#616161] block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full h-10 px-3 border border-[#D1D5DB] rounded-lg text-[14px] focus:outline-none focus:border-[#B88E2F]"
                    />
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-[#616161] block mb-1">Email</label>
                    <input
                      type="email"
                      value={profileData.email}
                      disabled
                      className="w-full h-10 px-3 border border-[#E5E7EB] bg-[#F4F5F7] text-[#898989] rounded-lg text-[14px] cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-[#616161] block mb-1">Phone</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="w-full h-10 px-3 border border-[#D1D5DB] rounded-lg text-[14px] focus:outline-none focus:border-[#B88E2F]"
                    />
                  </div>
                  <button
                    onClick={saveProfile}
                    disabled={loading}
                    className="mt-4 bg-[#B88E2F] text-white px-6 py-2 rounded-lg text-[14px] font-medium hover:bg-[#A47E2A] disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            )}

            {/* Tab 3: Addresses */}
            {activeTab === "address" && (
              <div className="max-w-md">
                <div className="space-y-4">
                  <div>
                    <label className="text-[12px] font-medium text-[#616161] block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={addressData.fullName}
                      onChange={(e) => setAddressData({ ...addressData, fullName: e.target.value })}
                      className="w-full h-10 px-3 border border-[#D1D5DB] rounded-lg text-[14px] focus:outline-none focus:border-[#B88E2F]"
                    />
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-[#616161] block mb-1">Phone</label>
                    <input
                      type="tel"
                      value={addressData.phone}
                      onChange={(e) => setAddressData({ ...addressData, phone: e.target.value })}
                      className="w-full h-10 px-3 border border-[#D1D5DB] rounded-lg text-[14px] focus:outline-none focus:border-[#B88E2F]"
                    />
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-[#616161] block mb-1">Street Address</label>
                    <input
                      type="text"
                      value={addressData.street}
                      onChange={(e) => setAddressData({ ...addressData, street: e.target.value })}
                      className="w-full h-10 px-3 border border-[#D1D5DB] rounded-lg text-[14px] focus:outline-none focus:border-[#B88E2F]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[12px] font-medium text-[#616161] block mb-1">City</label>
                      <input
                        type="text"
                        value={addressData.city}
                        onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                        className="w-full h-10 px-3 border border-[#D1D5DB] rounded-lg text-[14px] focus:outline-none focus:border-[#B88E2F]"
                      />
                    </div>
                    <div>
                      <label className="text-[12px] font-medium text-[#616161] block mb-1">Province</label>
                      <select
                        value={addressData.province}
                        onChange={(e) => setAddressData({ ...addressData, province: e.target.value })}
                        className="w-full h-10 px-3 border border-[#D1D5DB] rounded-lg text-[14px] focus:outline-none focus:border-[#B88E2F] bg-white"
                      >
                        <option value="Punjab">Punjab</option>
                        <option value="Sindh">Sindh</option>
                        <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
                        <option value="Balochistan">Balochistan</option>
                        <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-[#616161] block mb-1">Zip Code</label>
                    <input
                      type="text"
                      value={addressData.zip}
                      onChange={(e) => setAddressData({ ...addressData, zip: e.target.value })}
                      className="w-full h-10 px-3 border border-[#D1D5DB] rounded-lg text-[14px] focus:outline-none focus:border-[#B88E2F]"
                    />
                  </div>
                  <button
                    onClick={saveAddress}
                    disabled={loading}
                    className="mt-4 bg-[#B88E2F] text-white px-6 py-2 rounded-lg text-[14px] font-medium hover:bg-[#A47E2A] disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Save Address"}
                  </button>
                </div>
              </div>
            )}

            {/* Tab 4: Change Password */}
            {activeTab === "password" && (
              <div className="max-w-md">
                <div className="space-y-4">
                  <div>
                    <label className="text-[12px] font-medium text-[#616161] block mb-1">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPassword.current ? "text" : "password"}
                        value={passwordData.current}
                        onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                        className="w-full h-10 px-3 pr-10 border border-[#D1D5DB] rounded-lg text-[14px] focus:outline-none focus:border-[#B88E2F]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#898989]"
                      >
                        {showPassword.current ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-[#616161] block mb-1">New Password</label>
                    <div className="relative">
                      <input
                        type={showPassword.new ? "text" : "password"}
                        value={passwordData.new}
                        onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                        className="w-full h-10 px-3 pr-10 border border-[#D1D5DB] rounded-lg text-[14px] focus:outline-none focus:border-[#B88E2F]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#898989]"
                      >
                        {showPassword.new ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-[#616161] block mb-1">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showPassword.confirm ? "text" : "password"}
                        value={passwordData.confirm}
                        onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                        className="w-full h-10 px-3 pr-10 border border-[#D1D5DB] rounded-lg text-[14px] focus:outline-none focus:border-[#B88E2F]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#898989]"
                      >
                        {showPassword.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={changePassword}
                    disabled={passwordLoading || !passwordData.current || !passwordData.new}
                    className="mt-4 bg-[#B88E2F] text-white px-6 py-2 rounded-lg text-[14px] font-medium hover:bg-[#A47E2A] disabled:opacity-50"
                  >
                    {passwordLoading ? "Changing..." : "Change Password"}
                  </button>
                  {passwordError && (
                    <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-100">
                      <p className="text-[12px] text-[#E24B4A]">{passwordError}</p>
                    </div>
                  )}
                  {passwordSuccess && (
                    <div className="mt-3 p-3 rounded-lg bg-green-50 border border-green-100">
                      <p className="text-[12px] text-[#2EC1AC]">Password changed successfully!</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;