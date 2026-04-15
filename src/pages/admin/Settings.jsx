import React, { useState, useEffect } from "react";
import { Settings as SettingsIcon, Truck, User, Bell, Upload, Save, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "../../components/common/Button";
import { Toast } from "../../components/common/Toast";
import { useAuth } from "../../hooks/useAuth";
import { db } from "../../firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getAuth, updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";

const CLOUD_NAME = "dabzehltj";
const UPLOAD_PRESET = "furniro_preset";

const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", "store_assets");
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  if (!data.secure_url) throw new Error("Upload failed");
  return data.secure_url;
};

const uploadProfilePhoto = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", "admin_profiles");
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  if (!data.secure_url) throw new Error("Upload failed");
  return data.secure_url;
};

const Settings = () => {
  const { currentUser } = useAuth();
  const auth = getAuth();
  const [activeTab, setActiveTab] = useState("General");
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Loading states for each tab
  const [generalLoading, setGeneralLoading] = useState(false);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Tab 1: General (Store Info)
  const [storeInfo, setStoreInfo] = useState({
    logoUrl: "",
    storeName: "",
    tagline: "",
    contactEmail: "",
    contactPhone: "",
    storeAddress: "",
    currency: "PKR",
  });
  const [logoUploading, setLogoUploading] = useState(false);

  // Tab 2: Shipping
  const [shipping, setShipping] = useState({
    freeShippingEnabled: false,
    freeShippingThreshold: 5000,
    standardShippingFee: 250,
    estimatedDelivery: "",
    codEnabled: true,
    onlinePaymentEnabled: false,
  });

  // Tab 3: Account (Profile & Password)
  const [profileData, setProfileData] = useState({
    fullName: currentUser?.displayName || "",
    profilePhotoUrl: currentUser?.photoURL || "",
  });
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [profilePhotoUploading, setProfilePhotoUploading] = useState(false);

  // Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "settings", "store");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setStoreInfo({
            logoUrl: data.logoUrl || "",
            storeName: data.storeName || "",
            tagline: data.tagline || "",
            contactEmail: data.contactEmail || "",
            contactPhone: data.contactPhone || "",
            storeAddress: data.storeAddress || "",
            currency: data.currency || "PKR",
          });
          setShipping({
            freeShippingEnabled: data.freeShippingEnabled || false,
            freeShippingThreshold: data.freeShippingThreshold || 5000,
            standardShippingFee: data.standardShippingFee || 250,
            estimatedDelivery: data.estimatedDelivery || "",
            codEnabled: data.codEnabled ?? true,
            onlinePaymentEnabled: data.onlinePaymentEnabled || false,
          });
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
      }
    };
    fetchSettings();
  }, [currentUser]);

  // Handle logo upload
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogoUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setStoreInfo((prev) => ({ ...prev, logoUrl: url }));
    } catch (err) {
      showToast("Logo upload failed. Please try again.", "error");
    } finally {
      setLogoUploading(false);
    }
  };

  // Save Store Info
  const saveStoreInfo = async () => {
    setGeneralLoading(true);
    try {
      await setDoc(
        doc(db, "settings", "store"),
        {
          logoUrl: storeInfo.logoUrl,
          storeName: storeInfo.storeName,
          tagline: storeInfo.tagline,
          contactEmail: storeInfo.contactEmail,
          contactPhone: storeInfo.contactPhone,
          storeAddress: storeInfo.storeAddress,
          currency: storeInfo.currency,
          updatedAt: new Date(),
        },
        { merge: true }
      );
      showToast("Store information saved.");
    } catch (err) {
      showToast("Failed to save. Try again.", "error");
    } finally {
      setGeneralLoading(false);
    }
  };

  // Save Shipping
  const saveShipping = async () => {
    setShippingLoading(true);
    try {
      await setDoc(
        doc(db, "settings", "store"),
        {
          freeShippingEnabled: shipping.freeShippingEnabled,
          freeShippingThreshold: Number(shipping.freeShippingThreshold),
          standardShippingFee: Number(shipping.standardShippingFee),
          estimatedDelivery: shipping.estimatedDelivery,
          codEnabled: shipping.codEnabled,
          onlinePaymentEnabled: shipping.onlinePaymentEnabled,
          updatedAt: new Date(),
        },
        { merge: true }
      );
      showToast("Shipping & payment settings saved.");
    } catch (err) {
      showToast("Failed to save. Try again.", "error");
    } finally {
      setShippingLoading(false);
    }
  };

  // Save Profile
  const saveProfile = async () => {
    setProfileLoading(true);
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: profileData.fullName });
        await setDoc(
          doc(db, "users", auth.currentUser.uid),
          {
            name: profileData.fullName,
            ...(profileData.profilePhotoUrl && { photoUrl: profileData.profilePhotoUrl }),
            updatedAt: new Date(),
          },
          { merge: true }
        );
      }
      showToast("Profile saved.");
    } catch (err) {
      showToast("Failed to save profile.", "error");
    } finally {
      setProfileLoading(false);
    }
  };

  // Change Password
  const changePassword = async () => {
    if (passwordData.new !== passwordData.confirm) {
      setPasswordError("Passwords do not match");
      return;
    }
    if (passwordData.new.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }
    setPasswordLoading(true);
    setPasswordError("");
    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        passwordData.current
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, passwordData.new);
      setPasswordData({ current: "", new: "", confirm: "" });
      showToast("Password changed successfully.");
    } catch (err) {
      if (err.code === "auth/wrong-password") {
        setPasswordError("Current password is incorrect");
      } else {
        setPasswordError("Failed to change password. Try again.");
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  // Handle profile photo upload
  const handleProfilePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfilePhotoUploading(true);
    try {
      const url = await uploadProfilePhoto(file);
      setProfileData((prev) => ({ ...prev, profilePhotoUrl: url }));
    } catch (err) {
      showToast("Photo upload failed. Please try again.", "error");
    } finally {
      setProfilePhotoUploading(false);
    }
  };

  const tabs = [
    { id: "General", label: "Store Information", icon: <SettingsIcon size={18} /> },
    { id: "Shipping", label: "Shipping & Payment", icon: <Truck size={18} /> },
    { id: "Account", label: "Account Settings", icon: <User size={18} /> },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div>
        <h1 className="text-[28px] font-bold text-[#333333]">Store Settings</h1>
        <p className="text-[#898989] text-[14px]">Manage your store preferences and account settings.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-[250px] bg-white border-[0.5px] border-[#E5E7EB] rounded-xl overflow-hidden flex-shrink-0">
          <div className="flex flex-col py-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-5 py-3 text-[14px] font-medium transition-colors text-left ${
                  activeTab === tab.id
                    ? "text-[#B88E2F] bg-[#FCF8F3] border-r-[3px] border-[#B88E2F]"
                    : "text-[#616161] hover:bg-[#F4F5F7] border-r-[3px] border-transparent"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white border-[0.5px] border-[#E5E7EB] rounded-xl p-6 w-full">
          
          {/* 1. GENERAL TAB */}
          {activeTab === "General" && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-[18px] font-bold text-[#333333] border-b border-[#E5E7EB] pb-3">Store Information</h2>
              
              <div className="flex items-center gap-6 pb-2">
                {storeInfo.logoUrl ? (
                  <div className="w-[80px] h-[80px] rounded-lg overflow-hidden border border-[#E5E7EB] relative">
                    <img src={storeInfo.logoUrl} alt="Store Logo" className="w-full h-full object-cover" />
                    {logoUploading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-[80px] h-[80px] bg-[#F4F5F7] border border-dashed border-[#D1D5DB] rounded-lg flex flex-col items-center justify-center text-[#898989]">
                    <SettingsIcon size={24} className="mb-1 text-[#D1D5DB]" />
                  </div>
                )}
                <div>
                  <h3 className="text-[14px] font-semibold text-[#333333] mb-1">Store Logo</h3>
                  <p className="text-[12px] text-[#898989] mb-3">Recommended size 512x512px (PNG, JPG).</p>
                  <label className={`inline-flex cursor-pointer ${logoUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                    <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={logoUploading} />
                    <Button variant="outline" className="py-1.5 px-4 text-[12px] font-medium flex items-center gap-2 cursor-pointer">
                      <Upload size={14} /> {logoUploading ? "Uploading..." : "Upload Logo"}
                    </Button>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label className="text-[12px] font-semibold text-[#616161]">Store Name</label>
                  <input 
                    type="text" 
                    value={storeInfo.storeName}
                    onChange={(e) => setStoreInfo({...storeInfo, storeName: e.target.value})}
                    className="w-full h-10 px-3 border border-[#D1D5DB] rounded-lg text-[14px] focus:outline-none focus:border-[#B88E2F]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[12px] font-semibold text-[#616161]">Tagline</label>
                  <input 
                    type="text" 
                    value={storeInfo.tagline}
                    onChange={(e) => setStoreInfo({...storeInfo, tagline: e.target.value})}
                    className="w-full h-10 px-3 border border-[#D1D5DB] rounded-lg text-[14px] focus:outline-none focus:border-[#B88E2F]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[12px] font-semibold text-[#616161]">Contact Email</label>
                  <input 
                    type="email" 
                    value={storeInfo.contactEmail}
                    onChange={(e) => setStoreInfo({...storeInfo, contactEmail: e.target.value})}
                    className="w-full h-10 px-3 border border-[#D1D5DB] rounded-lg text-[14px] focus:outline-none focus:border-[#B88E2F]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[12px] font-semibold text-[#616161]">Contact Phone</label>
                  <input 
                    type="text" 
                    value={storeInfo.contactPhone}
                    onChange={(e) => setStoreInfo({...storeInfo, contactPhone: e.target.value})}
                    className="w-full h-10 px-3 border border-[#D1D5DB] rounded-lg text-[14px] focus:outline-none focus:border-[#B88E2F]"
                  />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[12px] font-semibold text-[#616161]">Store Address</label>
                  <textarea 
                    value={storeInfo.storeAddress}
                    onChange={(e) => setStoreInfo({...storeInfo, storeAddress: e.target.value})}
                    className="w-full p-3 border border-[#D1D5DB] rounded-lg text-[14px] focus:outline-none focus:border-[#B88E2F] h-24 resize-none"
                  ></textarea>
                </div>
                <div className="space-y-1">
                  <label className="text-[12px] font-semibold text-[#616161]">Currency</label>
                  <select 
                    value={storeInfo.currency}
                    onChange={(e) => setStoreInfo({...storeInfo, currency: e.target.value})}
                    className="w-full h-10 px-3 border border-[#D1D5DB] rounded-lg text-[14px] focus:outline-none focus:border-[#B88E2F] bg-white appearance-none"
                  >
                    <option value="PKR">PKR (Rs.)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5E7EB] flex justify-end">
                <Button 
                  onClick={saveStoreInfo} 
                  disabled={generalLoading}
                  className={`py-2 px-4 rounded-lg text-[14px] font-semibold flex items-center gap-2 ${generalLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  {generalLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Save Store Information
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* 2. SHIPPING TAB */}
          {activeTab === "Shipping" && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-[18px] font-bold text-[#333333] border-b border-[#E5E7EB] pb-3">Shipping & Payment</h2>
              
              <div className="space-y-5 max-w-2xl">
                <div className="flex items-start justify-between p-4 bg-[#F4F5F7] rounded-xl border border-[#E5E7EB]">
                  <div>
                    <h3 className="text-[14px] font-semibold text-[#333333]">Free Shipping</h3>
                    <p className="text-[12px] text-[#616161] mt-1">Enable free shipping above a certain order amount.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 mt-1">
                    <input 
                      type="checkbox" 
                      checked={shipping.freeShippingEnabled}
                      onChange={(e) => setShipping({...shipping, freeShippingEnabled: e.target.checked})}
                      className="sr-only peer" 
                    />
                    <div className="w-10 h-5 bg-[#D1D5DB] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#B88E2F]"></div>
                  </label>
                </div>

                {shipping.freeShippingEnabled && (
                  <div className="space-y-1 ml-4 border-l-2 border-[#B88E2F] pl-4">
                    <label className="text-[12px] font-semibold text-[#616161]">Free Shipping Threshold (Rs.)</label>
                    <input 
                      type="number" 
                      value={shipping.freeShippingThreshold}
                      onChange={(e) => setShipping({...shipping, freeShippingThreshold: e.target.value})}
                      className="w-[200px] h-10 px-3 border border-[#D1D5DB] rounded-lg text-[14px] focus:outline-none focus:border-[#B88E2F]"
                    />
                    <p className="text-[11px] text-[#898989]">Orders above this amount will have 0 shipping fee.</p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-[12px] font-semibold text-[#616161]">Standard Shipping Fee (Rs.)</label>
                    <input 
                      type="number" 
                      value={shipping.standardShippingFee}
                      onChange={(e) => setShipping({...shipping, standardShippingFee: e.target.value})}
                      className="w-full h-10 px-3 border border-[#D1D5DB] rounded-lg text-[14px] focus:outline-none focus:border-[#B88E2F]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[12px] font-semibold text-[#616161]">Estimated Delivery Time</label>
                    <input 
                      type="text" 
                      value={shipping.estimatedDelivery}
                      onChange={(e) => setShipping({...shipping, estimatedDelivery: e.target.value})}
                      className="w-full h-10 px-3 border border-[#D1D5DB] rounded-lg text-[14px] focus:outline-none focus:border-[#B88E2F]"
                      placeholder="e.g. 3-5 Business Days"
                    />
                  </div>
                </div>

                <div className="pt-4 pb-2 border-t border-[#E5E7EB]">
<h3 className="text-[15px] font-bold text-[#333333] mb-4">Payment Methods</h3>
                   
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center w-5 h-5">
                        <input 
                          type="radio" 
                          name="paymentMethod"
                          checked={shipping.codEnabled && !shipping.onlinePaymentEnabled}
                          onChange={() => {
                            setShipping({...shipping, codEnabled: true, onlinePaymentEnabled: false});
                          }}
                          className="peer appearance-none w-5 h-5 border-2 border-[#D1D5DB] rounded-full bg-white checked:border-[#B88E2F] transition-all cursor-pointer" 
                        />
                        <div className="absolute w-2.5 h-2.5 bg-[#B88E2F] rounded-full opacity-0 peer-checked:opacity-100 pointer-events-none"></div>
                      </div>
                      <span className="text-[14px] font-medium text-[#333333] group-hover:text-[#B88E2F] transition-colors">Cash on Delivery (COD)</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center w-5 h-5">
                        <input 
                          type="radio" 
                          name="paymentMethod"
                          checked={!shipping.codEnabled && shipping.onlinePaymentEnabled}
                          onChange={() => {
                            setShipping({...shipping, codEnabled: false, onlinePaymentEnabled: true});
                          }}
                          className="peer appearance-none w-5 h-5 border-2 border-[#D1D5DB] rounded-full bg-white checked:border-[#B88E2F] transition-all cursor-pointer" 
                        />
                        <div className="absolute w-2.5 h-2.5 bg-[#B88E2F] rounded-full opacity-0 peer-checked:opacity-100 pointer-events-none"></div>
                      </div>
                      <span className="text-[14px] font-medium text-[#333333] group-hover:text-[#B88E2F] transition-colors">Online Payment (Credit/Debit Card via Stripe/Payfast)</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center w-5 h-5">
                        <input 
                          type="radio" 
                          name="paymentMethod"
                          checked={shipping.codEnabled && shipping.onlinePaymentEnabled}
                          onChange={() => {
                            setShipping({...shipping, codEnabled: true, onlinePaymentEnabled: true});
                          }}
                          className="peer appearance-none w-5 h-5 border-2 border-[#D1D5DB] rounded-full bg-white checked:border-[#B88E2F] transition-all cursor-pointer" 
                        />
                        <div className="absolute w-2.5 h-2.5 bg-[#B88E2F] rounded-full opacity-0 peer-checked:opacity-100 pointer-events-none"></div>
                      </div>
                      <span className="text-[14px] font-medium text-[#333333] group-hover:text-[#B88E2F] transition-colors">Both (COD + Online Payment)</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5E7EB] flex justify-end">
                <Button 
                  onClick={saveShipping} 
                  disabled={shippingLoading}
                  className={`py-2 px-4 rounded-lg text-[14px] font-semibold flex items-center gap-2 ${shippingLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  {shippingLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Save Shipping Settings
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* 3. ACCOUNT TAB */}
          {activeTab === "Account" && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-[18px] font-bold text-[#333333] border-b border-[#E5E7EB] pb-3">Admin Profile</h2>
              
              <div className="flex items-center gap-6 pb-2">
                {profileData.profilePhotoUrl ? (
                  <div className="w-[80px] h-[80px] rounded-full overflow-hidden border border-[#E5E7EB]">
                    <img src={profileData.profilePhotoUrl} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-[80px] h-[80px] bg-[#B88E2F] text-white rounded-full flex flex-col items-center justify-center shadow-md">
                    <span className="text-[28px] font-bold">{(profileData.fullName || currentUser?.displayName || "A").charAt(0).toUpperCase()}</span>
                  </div>
                )}
                <div>
                  <h3 className="text-[14px] font-semibold text-[#333333] mb-1">Profile Picture</h3>
                  <label className={`inline-flex cursor-pointer ${profilePhotoUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                    <input type="file" accept="image/*" className="hidden" onChange={handleProfilePhotoUpload} disabled={profilePhotoUploading} />
                    <Button variant="outline" className="py-1.5 px-4 text-[12px] font-medium flex items-center gap-2 cursor-pointer">
                      <Upload size={14} /> {profilePhotoUploading ? "Uploading..." : "Upload New"}
                    </Button>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl">
                <div className="space-y-1">
                  <label className="text-[12px] font-semibold text-[#616161]">Full Name</label>
                  <input 
                    type="text" 
                    value={profileData.fullName}
                    onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                    className="w-full h-10 px-3 border border-[#D1D5DB] rounded-lg text-[14px] focus:outline-none focus:border-[#B88E2F]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[12px] font-semibold text-[#616161]">Email Address (Read-Only)</label>
                  <input 
                    type="email" 
                    value={currentUser?.email || ""}
                    disabled
                    className="w-full h-10 px-3 border border-[#E5E7EB] bg-[#F4F5F7] text-[#898989] rounded-lg text-[14px] cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button 
                  onClick={saveProfile} 
                  disabled={profileLoading}
                  className={`py-2 px-4 rounded-lg text-[13px] font-semibold ${profileLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  {profileLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </span>
                  ) : "Save Profile"}
                </Button>
              </div>

              <div className="pt-6 border-t border-[#E5E7EB]">
                <h3 className="text-[16px] font-bold text-[#333333] mb-4 flex items-center gap-2">
                  <Lock size={16} /> Change Password
                </h3>
                
                <div className="space-y-4 max-w-md">
                  <div className="space-y-1">
                    <label className="text-[12px] font-semibold text-[#616161]">Current Password</label>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        value={passwordData.current}
                        onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                        className="w-full h-10 pl-3 pr-10 border border-[#D1D5DB] rounded-lg text-[14px] focus:outline-none focus:border-[#B88E2F]"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#898989] hover:text-[#333333]"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[12px] font-semibold text-[#616161]">New Password</label>
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={passwordData.new}
                      onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                      className="w-full h-10 px-3 border border-[#D1D5DB] rounded-lg text-[14px] focus:outline-none focus:border-[#B88E2F]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[12px] font-semibold text-[#616161]">Confirm New Password</label>
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={passwordData.confirm}
                      onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                      className="w-full h-10 px-3 border border-[#D1D5DB] rounded-lg text-[14px] focus:outline-none focus:border-[#B88E2F]"
                    />
                  </div>
                  {passwordError && (
                    <p className="text-[12px] text-[#E24B4A]">{passwordError}</p>
                  )}
                  <Button 
                    variant="outline"
                    onClick={changePassword} 
                    disabled={passwordLoading || !passwordData.current || !passwordData.new}
                    className={`py-2 px-4 rounded-lg text-[13px] font-semibold border-[#333333] text-[#333333] hover:bg-[#333333] hover:text-white ${passwordLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    {passwordLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-[#333333] border-t-transparent rounded-full animate-spin" />
                        Updating...
                      </span>
                    ) : "Update Password"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
