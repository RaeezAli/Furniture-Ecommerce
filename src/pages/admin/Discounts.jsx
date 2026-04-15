import React, { useState, useEffect, useMemo } from "react";
import { Tag, Plus, Search, Edit2, Trash2, Copy, Calendar, Percent, Banknote, HelpCircle, Download } from "lucide-react";
import { nanoid } from "nanoid";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useFirestore } from "../../hooks/useFirestore";
import { Modal } from "../../components/common/Modal";
import { Toast } from "../../components/common/Toast";
import { Button } from "../../components/common/Button";
import { exportToExcel } from "../../utils/exportToExcel";

const KPICard = ({ title, value, icon, color = "text-[#333333]", loading }) => (
  <div className="bg-[#F4F5F7] rounded-lg p-[14px] flex flex-col gap-1">
    <div className="flex justify-between items-start">
      <span className="text-[11px] text-[#898989] font-medium uppercase tracking-wider">{title}</span>
      <div className="text-[#898989]">{icon}</div>
    </div>
    {loading ? (
      <div className="animate-pulse bg-gray-200 h-7 w-16 mt-1 rounded"></div>
    ) : (
      <h3 className={`text-[22px] font-semibold leading-none mt-1 ${color}`}>{value}</h3>
    )}
  </div>
);

const Shimmer = ({ className }) => (
  <div
    className={`animate-pulse rounded ${className}`}
    style={{ background: "linear-gradient(90deg,#F4F5F7 25%,#E5E7EB 50%,#F4F5F7 75%)", backgroundSize: "200% 100%" }}
  />
);

const Discounts = () => {
  const { fetchCollection, addDocument, setDocument, deleteDocument, updateDocument } = useFirestore();
  const [discounts, setDiscounts] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    code: "",
    type: "percentage",
    value: "",
    minOrder: "",
    usageLimit: "",
    expiryDate: "",
    startDate: "",
    isActive: true
  });
  
  // Toast state
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setPageLoading(true);

    const discountsRef = collection(db, "discounts");

    const unsubscribe = onSnapshot(
      query(discountsRef),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        data.sort((a, b) => {
          const aTime = a.createdAt?.toMillis?.() ?? a.createdAt?.seconds ?? 0;
          const bTime = b.createdAt?.toMillis?.() ?? b.createdAt?.seconds ?? 0;
          return bTime - aTime;
        });
        setDiscounts(data);
        setPageLoading(false);
      },
      (error) => {
        console.error("Error in discounts listener:", error);
        setPageLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const filteredDiscounts = useMemo(() => {
    return discounts.filter(d => {
      const matchesSearch = (d.code || "").toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesTab = true;
      const now = new Date();
      now.setHours(0,0,0,0);
      
      const expiry = d.expiryDate ? new Date(d.expiryDate) : null;
      const start = d.startDate ? new Date(d.startDate) : null;
      
      const isExpired = expiry && expiry < now;
      const isScheduled = start && start > now;
      
      if (activeTab === "Active") matchesTab = d.isActive && !isExpired && !isScheduled;
      else if (activeTab === "Expired") matchesTab = isExpired;
      else if (activeTab === "Scheduled") matchesTab = isScheduled;

      return matchesSearch && matchesTab;
    });
  }, [discounts, searchTerm, activeTab]);

  const stats = useMemo(() => {
    let active = 0;
    let expired = 0;
    let scheduled = 0;
    let used = 0;

    const now = new Date();
    now.setHours(0,0,0,0);

    discounts.forEach(d => {
      const expiry = d.expiryDate ? new Date(d.expiryDate) : null;
      const start = d.startDate ? new Date(d.startDate) : null;
      const isExpired = expiry && expiry < now;
      const isScheduled = start && start > now;

      if (isExpired) {
        expired++;
      } else if (isScheduled) {
        scheduled++;
      } else if (d.isActive) {
        active++;
      }
      used += (d.usedCount || 0);
    });

    return { total: discounts.length, active, expired, scheduled, used };
  }, [discounts]);

  const handleOpenModal = (discount = null) => {
    if (discount) {
      setEditingDiscount(discount);
      setFormData({
        ...discount,
        value: discount.value || "",
        minOrder: discount.minOrder || "",
        usageLimit: discount.usageLimit || "",
        expiryDate: discount.expiryDate || "",
        startDate: discount.startDate || "",
      });
    } else {
      setEditingDiscount(null);
      setFormData({
        code: "",
        type: "percentage",
        value: "",
        minOrder: "",
        usageLimit: "",
        expiryDate: "",
        startDate: "",
        isActive: true,
        usedCount: 0
      });
    }
    setIsModalOpen(true);
  };

  const handleGenerateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(chars.length * Math.random()));
    }
    setFormData({ ...formData, code });
  };

  const handleSave = async () => {
    if (!formData.code || formData.value === "") {
      setToast({ message: "Please fill the required fields: Code and Value.", type: "error" });
      return;
    }
    
    const valueNum = Number(formData.value);
    if (valueNum <= 0) {
      setToast({ message: "Discount value must be greater than 0.", type: "error" });
      return;
    }
    if (formData.type === "percentage" && (valueNum < 1 || valueNum > 100)) {
      setToast({ message: "Percentage must be between 1 and 100.", type: "error" });
      return;
    }

    setSaving(true);
    try {
      const finalData = {
        ...formData,
        value: valueNum,
        minOrder: formData.minOrder ? Number(formData.minOrder) : null,
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
      };

      if (editingDiscount) {
        // Can't change code string in edit mode
        const { code, ...updatePayload } = finalData;
        await setDocument("discounts", editingDiscount.id, updatePayload);
        setToast({ message: "Discount code updated.", type: "success" });
      } else {
        await setDocument("discounts", formData.code, { ...finalData, internalId: nanoid(8).toUpperCase() });
        setToast({ message: "Discount code created.", type: "success" });
      }
      setIsModalOpen(false);
    } catch (err) {
      setToast({ message: "Failed to save discount code.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (discount) => {
    setEditingDiscount(discount);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    setSaving(true);
    await deleteDocument("discounts", editingDiscount.id);
    setToast({ message: "Discount code deleted.", type: "success" });
    setIsDeleteModalOpen(false);
    setSaving(false);
  };

  const handleToggleStatus = async (discount) => {
    const newStatus = !discount.isActive;
    await updateDocument("discounts", discount.id, { isActive: newStatus });
    setToast({ message: `Discount ${newStatus ? 'activated' : 'deactivated'}.`, type: "success" });
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setToast({ message: "Code copied to clipboard!", type: "success" });
  };

  const getStatusBadge = (discount) => {
    const now = new Date();
    now.setHours(0,0,0,0);
    
    const expiry = discount.expiryDate ? new Date(discount.expiryDate) : null;
    const start = discount.startDate ? new Date(discount.startDate) : null;
    
    if (expiry && expiry < now) {
      return <span className="bg-[#F4F5F7] text-[#898989] px-2 py-1 rounded-full text-[10px] font-medium">Expired</span>;
    }
    if (start && start > now) {
      return <span className="bg-[#E6F1FB] text-[#185FA5] px-2 py-1 rounded-full text-[10px] font-medium">Scheduled</span>;
    }
    if (!discount.isActive) {
      return <span className="bg-[#FAEEDA] text-[#854F0B] px-2 py-1 rounded-full text-[10px] font-medium">Inactive</span>;
    }
    return <span className="bg-[#E1F5EE] text-[#0F6E56] px-2 py-1 rounded-full text-[10px] font-medium">Active</span>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No expiry";
    const [year, month, day] = dateString.split("-");
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const handleExport = () => {
    const data = filteredDiscounts.map(d => {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const expiry = d.expiryDate ? new Date(d.expiryDate) : null;
      const start = d.startDate ? new Date(d.startDate) : null;
      const isExpired = expiry && expiry < now;
      const isScheduled = start && start > now;
      let status = "Active";
      if (isExpired) status = "Expired";
      else if (isScheduled) status = "Scheduled";
      else if (!d.isActive) status = "Inactive";

      return {
        code: d.code || "",
        type: d.type || "",
        value: d.value || 0,
        minOrder: d.minOrder || null,
        usageLimit: d.usageLimit || null,
        usedCount: d.usedCount || 0,
        expiresAtFormatted: formatDate(d.expiryDate),
        status,
      };
    });
    exportToExcel(data, [
      { label: "Code", key: "code" },
      { label: "Type", key: "type" },
      { label: "Value", key: "value" },
      { label: "Min. Order", key: "minOrder" },
      { label: "Usage Limit", key: "usageLimit" },
      { label: "Used Count", key: "usedCount" },
      { label: "Expires", key: "expiresAtFormatted" },
      { label: "Status", key: "status" },
    ], "discounts");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-[#333333]">Discounts</h1>
          <p className="text-[#898989] text-[13px]">{stats.active} active codes</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            disabled={filteredDiscounts.length === 0}
            className="border border-[#B88E2F] text-[#B88E2F] hover:bg-[#B88E2F] hover:text-white font-semibold py-2 px-4 rounded-xl text-sm transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={14} />
            Export Excel
          </button>
          <Button 
            variant="outline" 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Create Discount Code
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <KPICard title="Active Codes" value={stats.active} icon={<Tag size={17} />} loading={pageLoading} />
        <KPICard title="Total Uses" value={stats.used} color="text-[#B88E2F]" icon={<Copy size={17} />} loading={pageLoading} />
        <KPICard title="Expired" value={stats.expired} color="text-[#898989]" icon={<Calendar size={17} />} loading={pageLoading} />
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-[#E5E7EB] mb-4">
        {["All", "Active", "Expired", "Scheduled"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-[13px] transition-all border-b-2 bg-transparent ${
              activeTab === tab 
              ? "text-[#B88E2F] border-[#B88E2F] font-medium" 
              : "text-[#898989] border-transparent hover:text-[#333333]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative mb-4 hidden"> {/* Based on spec, search bar might not be needed or we can keep it */}
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#898989]" size={16} />
        <input 
          type="text" 
          placeholder="Search by code..."
          className="w-full pl-9 pr-4 py-2 border border-[#D1D5DB] rounded-lg text-[14px] focus:outline-none focus:border-[#B88E2F] h-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Discounts Table */}
      <div className="bg-white border-[0.5px] border-[#E5E7EB] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border-spacing-0">
            <thead>
              <tr className="bg-[#F4F5F7]">
                <th className="p-3 text-[11px] font-medium text-[#898989] uppercase tracking-wider w-[18%]">Code</th>
                <th className="p-3 text-[11px] font-medium text-[#898989] uppercase tracking-wider w-[10%]">Type</th>
                <th className="p-3 text-[11px] font-medium text-[#898989] uppercase tracking-wider w-[10%]">Value</th>
                <th className="p-3 text-[11px] font-medium text-[#898989] uppercase tracking-wider w-[12%]">Min. Order</th>
                <th className="p-3 text-[11px] font-medium text-[#898989] uppercase tracking-wider w-[12%]">Usage</th>
                <th className="p-3 text-[11px] font-medium text-[#898989] uppercase tracking-wider w-[12%]">Expires</th>
                <th className="p-3 text-[11px] font-medium text-[#898989] uppercase tracking-wider w-[10%]">Status</th>
                <th className="p-3 text-[11px] font-medium text-[#898989] uppercase tracking-wider w-[16%]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-t border-[#E5E7EB]">
                    {[...Array(8)].map((_, j) => (
                      <td key={j} className="p-3">
                        <Shimmer className="h-4 w-16" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filteredDiscounts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-16 text-center">
                    <Tag size={40} className="mx-auto text-[#D1D5DB] mb-3" />
                    <p className="text-[14px] font-[500] text-[#898989]">No discount codes</p>
                    <p className="text-[12px] text-[#9F9F9F] mt-1 mb-4">Create your first discount to reward customers</p>
                    <Button variant="outline" onClick={() => handleOpenModal()} className="mx-auto text-[13px] py-2">
                       Create Code
                    </Button>
                  </td>
                </tr>
              ) : (
                filteredDiscounts.map((discount) => (
                  <tr key={discount.id} className="border-t border-[#E5E7EB] hover:bg-[#FCF8F3] transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[#333333] tracking-wider uppercase text-[12px] font-bold" title={discount.internalId ? `Internal ID: ${discount.internalId}` : undefined}>
                          {discount.code}
                        </span>
                        <button 
                          onClick={() => handleCopy(discount.code)}
                          className="text-[#898989] hover:text-[#B88E2F]"
                          title="Copy Code"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    </td>
                    <td className="p-3">
                      {discount.type === "percentage" ? (
                        <span className="bg-[#E1F5EE] text-[#0F6E56] px-2 py-1 rounded-full text-[10px] font-medium">% Off</span>
                      ) : (
                        <span className="bg-[#FCF8F3] text-[#B88E2F] px-2 py-1 rounded-full text-[10px] font-medium">Fixed</span>
                      )}
                    </td>
                    <td className="p-3 text-[13px] text-[#616161]">
                      {discount.type === "percentage" ? `${discount.value}%` : `Rs. ${discount.value.toLocaleString()}`}
                    </td>
                    <td className="p-3 text-[13px] text-[#616161]">
                      {discount.minOrder ? `Rs. ${discount.minOrder.toLocaleString()}` : "None"}
                    </td>
                    <td className="p-3">
                      <div className="w-[80px] flex flex-col gap-1">
                        <div className="text-[12px] text-[#616161]">
                          <span>{discount.usedCount || 0}{discount.usageLimit ? ` / ${discount.usageLimit}` : ""}</span>
                        </div>
                        {discount.usageLimit && (
                          <div className="h-1 bg-[#E5E7EB] rounded-full overflow-hidden">
                            <div 
                              className="bg-[#B88E2F] h-full rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(100, ((discount.usedCount || 0) / discount.usageLimit) * 100)}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-[13px] text-[#616161]">{formatDate(discount.expiryDate)}</td>
                    <td className="p-3">
                      {getStatusBadge(discount)}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleOpenModal(discount)}
                          className="p-1 text-[#898989] hover:text-[#B88E2F] rounded hover:bg-[#FCF8F3]"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button 
                          onClick={() => handleToggleStatus(discount)}
                          className="text-[11px] font-semibold text-[#B88E2F] hover:underline"
                        >
                          {discount.isActive ? "Deactivate" : "Activate"}
                        </button>
                        <button 
                          onClick={() => handleDelete(discount)}
                          className="p-1 text-[#898989] hover:text-[#E24B4A] rounded hover:bg-[#FCEBEB] ml-2"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Create / Edit Discount */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDiscount ? "Edit Discount Code" : "Create Discount Code"}
        width="600px"
        confirmText={editingDiscount ? "Save Changes" : "Create Code"}
        onConfirm={handleSave}
        loading={saving}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 space-y-1">
            <label className="text-[12px] font-medium text-[#616161] block mb-1">Discount Code *</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                disabled={!!editingDiscount}
                className="flex-1 h-[40px] px-2 border border-[#D1D5DB] rounded-[6px] text-[14px] focus:outline-none focus:border-[#B88E2F] font-mono tracking-wider disabled:bg-[#F4F5F7] disabled:text-[#898989]"
                placeholder="e.g. SUMMER20"
              />
              {!editingDiscount && (
                <Button 
                  onClick={handleGenerateCode}
                  variant="outline"
                  className="px-4 h-[40px] text-[12px] font-semibold"
                >
                  Generate Random
                </Button>
              )}
            </div>
            <p className="text-[11px] text-[#898989] mt-1">Customers enter this at checkout</p>
          </div>

          <div className="md:col-span-2 space-y-1 mt-2">
            <label className="text-[12px] font-medium text-[#616161] block mb-1">Discount Type *</label>
            <div className="flex gap-1 h-[40px]">
              <button 
                onClick={() => setFormData({...formData, type: "percentage"})}
                className={`flex-1 flex items-center justify-center rounded-l-[20px] rounded-r-[4px] text-[13px] font-medium transition-all ${formData.type === "percentage" ? "bg-[#B88E2F] text-white" : "bg-[#F4F5F7] text-[#616161]"}`}
              >
                Percentage (%)
              </button>
              <button 
                onClick={() => setFormData({...formData, type: "fixed"})}
                className={`flex-1 flex items-center justify-center rounded-r-[20px] rounded-l-[4px] text-[13px] font-medium transition-all ${formData.type === "fixed" ? "bg-[#B88E2F] text-white" : "bg-[#F4F5F7] text-[#616161]"}`}
              >
                Fixed Amount (Rs.)
              </button>
            </div>
          </div>

          <div className="space-y-1 mt-2">
            <label className="text-[12px] font-medium text-[#616161] block mb-1">Discount Value *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[14px] text-[#898989]">
                {formData.type === "percentage" ? "%" : "Rs."}
              </span>
              <input 
                type="number" 
                value={formData.value}
                onChange={(e) => setFormData({...formData, value: e.target.value})}
                placeholder={formData.type === "percentage" ? "e.g. 20" : "e.g. 500"}
                className="w-full h-[40px] pl-[32px] pr-2 border border-[#D1D5DB] rounded-[6px] text-[14px] focus:outline-none focus:border-[#B88E2F]"
              />
            </div>
          </div>

          <div className="space-y-1 mt-2">
            <label className="text-[12px] font-medium text-[#616161] block mb-1">Minimum Order Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[14px] text-[#898989]">Rs.</span>
              <input 
                type="number" 
                value={formData.minOrder}
                onChange={(e) => setFormData({...formData, minOrder: e.target.value})}
                className="w-full h-[40px] pl-[32px] pr-2 border border-[#D1D5DB] rounded-[6px] text-[14px] focus:outline-none focus:border-[#B88E2F]"
                placeholder="e.g. 1000"
              />
            </div>
            <p className="text-[11px] text-[#898989] mt-1 leading-tight">Customer&apos;s cart must be at least this value to apply the code</p>
          </div>

          <div className="space-y-1 mt-2">
            <label className="text-[12px] font-medium text-[#616161] block mb-1">Usage Limit</label>
            <input 
              type="number" 
              value={formData.usageLimit}
              onChange={(e) => setFormData({...formData, usageLimit: e.target.value})}
              className="w-full h-[40px] px-2 border border-[#D1D5DB] rounded-[6px] text-[14px] focus:outline-none focus:border-[#B88E2F]"
              placeholder="e.g. 100 (leave blank for unlimited)"
            />
          </div>

          <div className="space-y-1 mt-2">
            <label className="text-[12px] font-medium text-[#616161] block mb-1">Expiry Date</label>
            <input 
              type="date" 
              value={formData.expiryDate}
              onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
              className="w-full h-[40px] px-2 border border-[#D1D5DB] rounded-[6px] text-[14px] focus:outline-none focus:border-[#B88E2F]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[12px] font-medium text-[#616161] block mb-1">Start Date (Scheduled)</label>
            <input 
              type="date" 
              value={formData.startDate}
              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
              className="w-full h-[40px] px-2 border border-[#D1D5DB] rounded-[6px] text-[14px] focus:outline-none focus:border-[#B88E2F]"
            />
            <p className="text-[11px] text-[#898989] mt-1">Leave blank to activate immediately</p>
          </div>

          <div className="md:col-span-2 flex items-center justify-between p-4 bg-[#F4F5F7] rounded-[8px] mt-2">
            <label className="text-[13px] font-medium text-[#333333]">Active — customers can use this code immediately</label>
            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
              <input 
                type="checkbox" 
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                className="sr-only peer" 
              />
              <div className="w-[40px] h-[22px] bg-[#D1D5DB] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-[18px] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[18px] after:w-[18px] after:transition-all peer-checked:bg-[#B88E2F]"></div>
            </label>
          </div>
        </div>
      </Modal>

      {/* MODAL: Delete Confirmation */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title=""
        width="360px"
        type="danger"
        showFooter={false}
      >
        <div className="text-center space-y-4 py-2">
          <div className="w-12 h-12 mx-auto flex items-center justify-center">
             <AlertTriangle size={40} className="text-[#EF9F27]" />
          </div>
          <div>
            <h4 className="text-[16px] font-[600] text-[#333333] mb-2">Delete this code?</h4>
            <p className="text-[13px] text-[#616161]">
              <span className="font-bold text-[#333333]">{editingDiscount?.code}</span> will be permanently deleted and can no longer be used at checkout.
            </p>
          </div>
          <div className="flex justify-center gap-3 pt-6 mt-6 border-t border-[#E5E7EB]">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} className="py-2 px-6 rounded-[12px] text-[14px]">Cancel</Button>
            <Button 
               variant="danger" 
               onClick={confirmDelete} 
               disabled={saving}
               className="bg-[#E24B4A] hover:bg-[#A32D2D] text-white py-2 px-6 rounded-[12px] text-[14px]"
            >
              {saving ? "Deleting..." : "Delete Code"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
  
const AlertTriangle = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
);

export default Discounts;
