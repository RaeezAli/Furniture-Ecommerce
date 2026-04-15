import React, { useState, useEffect, useMemo } from "react";
import { Package, AlertTriangle, Search, Edit2, Settings, Download } from "lucide-react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useFirestore } from "../../hooks/useFirestore";
import { Modal } from "../../components/common/Modal";
import { Toast } from "../../components/common/Toast";
import { Button } from "../../components/common/Button";
import { exportToExcel } from "../../utils/exportToExcel";

/* ── Skeleton shimmer ── */
const Shimmer = ({ className }) => (
  <div
    className={`animate-pulse rounded ${className}`}
    style={{ background: "linear-gradient(90deg,#F4F5F7 25%,#E5E7EB 50%,#F4F5F7 75%)", backgroundSize: "200% 100%" }}
  />
);

/* ── KPI Card ── */
const KPICard = ({ title, value, icon, color = "text-[#333333]", loading }) => (
  <div className="bg-[#F4F5F7] rounded-lg p-[14px] flex flex-col gap-1">
    <div className="flex justify-between items-start">
      <span className="text-[11px] text-[#898989] font-medium uppercase tracking-wider">{title}</span>
      <div className="text-[#898989]">{icon}</div>
    </div>
    {loading
      ? <Shimmer className="h-7 w-16 mt-1" />
      : <h3 className={`text-[22px] font-[500] leading-none mt-1 ${color}`}>{value}</h3>}
  </div>
);

/* ── Toggle Switch ── */
const Toggle = ({ checked, onChange, label, helper }) => (
  <div className="flex items-center justify-between p-4 bg-[#F4F5F7] rounded-lg">
    <div>
      <p className="text-[13px] font-medium text-[#333333]">{label}</p>
      {helper && <p className="text-[12px] text-[#898989] mt-0.5">{helper}</p>}
    </div>
    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-4">
      <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} />
      <div className="w-[40px] h-[22px] bg-[#D1D5DB] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-[18px] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#D1D5DB] after:border after:rounded-full after:h-[18px] after:w-[18px] after:transition-all peer-checked:bg-[#B88E2F]" />
    </label>
  </div>
);

const Inventory = () => {
  const { loading, updateDocument } = useFirestore();
  const [products, setProducts] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newStock, setNewStock] = useState(0);
  const [restockReason, setRestockReason] = useState("Regular Restock");
  const [notes, setNotes] = useState("");

  // Settings modal state
  const [lowStockThreshold, setLowStockThreshold] = useState(5);
  const [emailAlertsOn, setEmailAlertsOn] = useState(false);
  const [alertEmail, setAlertEmail] = useState("");

  const [toast, setToast] = useState(null);
  const showToast = (message, type = "success") => setToast({ message, type });

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "products"),
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(data);
        setPageLoading(false);
        setFetchError(null);
      },
      (error) => {
        console.error("Error fetching products:", error);
        setFetchError("Failed to load products. Please try again.");
        setPageLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const categories = ["All", ...new Set(products.map(p => p.category).filter(Boolean))];

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const name = p.name || "";
      const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (p.id || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;
      let matchesStock = true;
      if (stockFilter === "Out of Stock") matchesStock = p.stock === 0;
      else if (stockFilter === "Low Stock") matchesStock = p.stock > 0 && p.stock <= lowStockThreshold;
      else if (stockFilter === "In Stock") matchesStock = p.stock > lowStockThreshold;
      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, searchTerm, categoryFilter, stockFilter, lowStockThreshold]);

  const stats = useMemo(() => ({
    total: products.length,
    lowStock: products.filter(p => p.stock > 0 && p.stock <= lowStockThreshold).length,
    outOfStock: products.filter(p => p.stock === 0).length,
  }), [products, lowStockThreshold]);

  const handleEditStock = (product) => {
    setSelectedProduct(product);
    setNewStock(product.stock ?? 0);
    setRestockReason("Regular Restock");
    setNotes("");
    setIsEditModalOpen(true);
  };

  const handleSaveStock = async () => {
    if (!selectedProduct) return;
    const success = await updateDocument("products", selectedProduct.id, {
      stock: parseInt(newStock, 10),
      lastRestockReason: restockReason,
      restockNotes: notes,
    });
    if (success) {
      showToast("Stock updated successfully.");
      setIsEditModalOpen(false);
    } else {
      showToast("Failed to update stock.", "error");
    }
  };

  const handleSaveSettings = async () => {
    showToast("Alert settings saved.");
    setIsSettingsModalOpen(false);
  };

  const getStockColor = (stock) => {
    if (stock === 0) return "text-[#A32D2D] font-bold";
    if (stock <= 4) return "text-[#854F0B] font-medium";
    if (stock <= 10) return "text-[#B88E2F] font-medium";
    return "text-[#0F6E56] font-medium";
  };

  const getStatusBadge = (stock) => {
    if (stock === 0) return <span className="bg-[#FCEBEB] text-[#A32D2D] px-2 py-[2px] rounded-full text-[10px] font-medium">Out of Stock</span>;
    if (stock <= lowStockThreshold) return <span className="bg-[#FAEEDA] text-[#854F0B] px-2 py-[2px] rounded-full text-[10px] font-medium">Low Stock</span>;
    return <span className="bg-[#E1F5EE] text-[#0F6E56] px-2 py-[2px] rounded-full text-[10px] font-medium">In Stock</span>;
  };

  const getRowBg = (stock) => {
    if (stock === 0) return "bg-[rgba(226,75,74,0.04)]";
    if (stock <= lowStockThreshold) return "bg-[rgba(239,159,39,0.05)]";
    return "";
  };

  const getProductImage = (product) =>
    product ? (product.images && product.images[0]) || product.image || null : null;

  const handleExport = () => {
    const getStockLabel = (stock) => {
      if (stock === 0) return "Out of Stock";
      if (stock <= lowStockThreshold) return "Low Stock";
      return "In Stock";
    };
    const data = filteredProducts.map(p => ({
      name: p.name || "",
      sku: p.internalId || (p.id || "").substring(0, 8),
      category: p.category || "",
      price: (p.price || 0),
      stock: p.stock ?? 0,
      stockStatus: getStockLabel(p.stock ?? 0),
    }));
    exportToExcel(data, [
      { label: "Product Name", key: "name" },
      { label: "SKU", key: "sku" },
      { label: "Category", key: "category" },
      { label: "Price", key: "price" },
      { label: "Stock Qty", key: "stock" },
      { label: "Status", key: "stockStatus" },
    ], "inventory");
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-[#333333]">Inventory</h1>
          <p className="text-[#898989] text-[13px]">Manage stock levels across all products.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            disabled={filteredProducts.length === 0}
            className="border border-[#B88E2F] text-[#B88E2F] hover:bg-[#B88E2F] hover:text-white font-semibold py-2 px-4 rounded-xl text-sm transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={14} />
            Export Excel
          </button>
          <Button
            variant="outline"
            onClick={() => setIsSettingsModalOpen(true)}
            className="flex items-center gap-2 text-[13px] py-2 px-4"
          >
            <Settings size={15} />
            Restock Alert Settings
          </Button>
        </div>
      </div>

      {fetchError && (
        <div className="bg-[#FCEBEB] border border-[#E24B4A] rounded-lg p-4 text-[13px] text-[#A32D2D]">
          {fetchError}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <KPICard title="Total Products" value={stats.total} icon={<Package size={17} />} loading={pageLoading} />
        <KPICard title="Low Stock Items" value={stats.lowStock} color="text-[#854F0B]" icon={<AlertTriangle size={17} />} loading={pageLoading} />
        <KPICard title="Out of Stock" value={stats.outOfStock} color="text-[#A32D2D]" icon={<AlertTriangle size={17} />} loading={pageLoading} />
      </div>

      {/* Filter Bar */}
      <div className="bg-white border-[0.5px] border-[#E5E7EB] rounded-lg p-3 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#898989]" size={16} />
          <input
            type="text"
            placeholder="Search by product name..."
            className="w-full pl-9 pr-4 h-[40px] border border-[#D1D5DB] rounded-[6px] text-[14px] font-['Poppins'] focus:outline-none focus:border-[#B88E2F] focus:ring-1 focus:ring-[#B88E2F]"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select
            className="h-[40px] px-3 border border-[#D1D5DB] rounded-[6px] text-[14px] font-['Poppins'] focus:outline-none focus:border-[#B88E2F] appearance-none bg-white min-w-[130px]"
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
          >
            {categories.map(c => <option key={c} value={c}>{c === "All" ? "All Categories" : c}</option>)}
          </select>
          <select
            className="h-[40px] px-3 border border-[#D1D5DB] rounded-[6px] text-[14px] font-['Poppins'] focus:outline-none focus:border-[#B88E2F] appearance-none bg-white min-w-[130px]"
            value={stockFilter}
            onChange={e => setStockFilter(e.target.value)}
          >
            <option value="All">All Stock</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white border-[0.5px] border-[#E5E7EB] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F4F5F7]">
                <th className="px-3 py-3 text-[11px] font-[500] text-[#898989] uppercase tracking-wider w-[35%]">Product</th>
                <th className="px-3 py-3 text-[11px] font-[500] text-[#898989] uppercase tracking-wider w-[10%]">SKU / ID</th>
                <th className="px-3 py-3 text-[11px] font-[500] text-[#898989] uppercase tracking-wider w-[12%]">Category</th>
                <th className="px-3 py-3 text-[11px] font-[500] text-[#898989] uppercase tracking-wider w-[10%]">Price</th>
                <th className="px-3 py-3 text-[11px] font-[500] text-[#898989] uppercase tracking-wider w-[10%]">Stock Qty</th>
                <th className="px-3 py-3 text-[11px] font-[500] text-[#898989] uppercase tracking-wider w-[13%]">Status</th>
                <th className="px-3 py-3 text-[11px] font-[500] text-[#898989] uppercase tracking-wider w-[10%]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-t border-[#E5E7EB]">
                    <td className="px-3 py-3"><div className="flex gap-3 items-center"><Shimmer className="w-10 h-10 rounded-md flex-shrink-0" /><div className="space-y-1.5"><Shimmer className="h-3 w-32" /><Shimmer className="h-2.5 w-20" /></div></div></td>
                    <td className="px-3 py-3"><Shimmer className="h-3 w-16" /></td>
                    <td className="px-3 py-3"><Shimmer className="h-3 w-16" /></td>
                    <td className="px-3 py-3"><Shimmer className="h-3 w-14" /></td>
                    <td className="px-3 py-3"><Shimmer className="h-3 w-8" /></td>
                    <td className="px-3 py-3"><Shimmer className="h-5 w-20 rounded-full" /></td>
                    <td className="px-3 py-3"><Shimmer className="h-5 w-16" /></td>
                  </tr>
                ))
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-16 text-center">
                    <Package size={40} className="mx-auto text-[#D1D5DB] mb-3" />
                    <p className="text-[14px] font-[500] text-[#898989]">No products found</p>
                    <p className="text-[12px] text-[#9F9F9F] mt-1">Add your first product to start tracking stock</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map(product => (
                  <tr
                    key={product.id}
                    className={`border-t border-[#E5E7EB] hover:bg-[#FCF8F3] transition-colors ${getRowBg(product.stock)}`}
                  >
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-[6px] bg-[#F4F5F7] overflow-hidden flex-shrink-0 border border-[#E5E7EB]">
                          {getProductImage(product)
                            ? <img src={getProductImage(product)} alt={product.name} className="w-full h-full object-cover" onError={e => { e.target.style.display = "none"; }} />
                            : <div className="w-full h-full flex items-center justify-center text-[#D1D5DB]"><Package size={16} /></div>
                          }
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-[#333333]">{product.name}</p>
                          <p className="text-[11px] text-[#898989]">{product.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-[11px] font-mono text-[#616161]" title={product.internalId ? `Internal ID: ${product.internalId}` : undefined}>
                        {product.internalId || (product.id || "").substring(0, 8)}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-[12px] text-[#616161]">{product.category}</td>
                    <td className="px-3 py-3 text-[12px] font-medium text-[#333333]">Rs. {product.price?.toLocaleString()}</td>
                    <td className={`px-3 py-3 text-[13px] ${getStockColor(product.stock)}`}>{product.stock ?? 0}</td>
                    <td className="px-3 py-3">{getStatusBadge(product.stock ?? 0)}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditStock(product)}
                          className="p-1.5 text-[#898989] hover:text-[#B88E2F] hover:bg-[#FCF8F3] rounded-lg transition-all"
                          title="Edit Stock"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleEditStock(product)}
                          className="text-[11px] font-semibold text-[#B88E2F] hover:underline"
                        >
                          Restock
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

      {/* MODAL: Update Stock */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Update Product Stock"
        confirmText="Save Changes"
        onConfirm={handleSaveStock}
        loading={loading}
        width="480px"
      >
        <div className="space-y-4">
          {/* Product info header */}
          <div className="flex items-center gap-4 p-3 bg-[#F4F5F7] rounded-lg mb-2">
            <div className="w-12 h-12 rounded-[6px] bg-white overflow-hidden border border-[#D1D5DB] flex-shrink-0">
              {getProductImage(selectedProduct)
                ? <img src={getProductImage(selectedProduct)} alt="" className="w-full h-full object-cover" onError={e => { e.target.style.display = "none"; }} />
                : <div className="w-full h-full flex items-center justify-center text-[#D1D5DB]"><Package size={16} /></div>
              }
            </div>
            <div>
              <p className="text-[14px] font-semibold text-[#333333]">{selectedProduct?.name}</p>
              <p className="text-[12px] text-[#898989]">{selectedProduct?.category}</p>
            </div>
          </div>

          {/* Current Stock (read-only) */}
          <div>
            <label className="block text-[12px] font-[500] text-[#616161] mb-1">Current Stock</label>
            <input
              type="number"
              value={selectedProduct?.stock ?? 0}
              readOnly
              className="w-full h-[40px] px-3 border border-[#D1D5DB] rounded-[6px] text-[14px] font-['Poppins'] bg-[#F4F5F7] text-[#898989] cursor-not-allowed"
            />
          </div>

          {/* New Stock Quantity */}
          <div>
            <label className="block text-[12px] font-[500] text-[#616161] mb-1">New Stock Quantity *</label>
            <input
              type="number"
              min="0"
              max="9999"
              value={newStock}
              onChange={e => setNewStock(e.target.value)}
              placeholder="Enter new stock quantity"
              className="w-full h-[40px] px-3 border border-[#D1D5DB] rounded-[6px] text-[14px] font-['Poppins'] focus:outline-none focus:border-[#B88E2F] focus:ring-1 focus:ring-[#B88E2F]"
            />
            <p className="text-[11px] text-[#898989] mt-1">Set to 0 to mark as Out of Stock</p>
          </div>

          {/* Restock Reason */}
          <div>
            <label className="block text-[12px] font-[500] text-[#616161] mb-1">Restock Reason</label>
            <select
              className="w-full h-[40px] px-3 border border-[#D1D5DB] rounded-[6px] text-[14px] font-['Poppins'] focus:outline-none focus:border-[#B88E2F] appearance-none bg-white"
              value={restockReason}
              onChange={e => setRestockReason(e.target.value)}
            >
              <option>Regular Restock</option>
              <option>New Shipment</option>
              <option>Manual Correction</option>
              <option>Return to Stock</option>
              <option>Other</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[12px] font-[500] text-[#616161] mb-1">Notes (Optional)</label>
            <textarea
              rows="3"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add any notes about this restock..."
              className="w-full p-2 border border-[#D1D5DB] rounded-[6px] text-[14px] font-['Poppins'] focus:outline-none focus:border-[#B88E2F] resize-vertical min-h-[80px]"
            />
          </div>
        </div>
      </Modal>

      {/* MODAL: Restock Alert Settings */}
      <Modal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        title="Restock Alert Settings"
        confirmText="Save Settings"
        onConfirm={handleSaveSettings}
        width="480px"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-[12px] font-[500] text-[#616161] mb-1">Mark as Low Stock when quantity falls below</label>
            <input
              type="number"
              min="1"
              value={lowStockThreshold}
              onChange={e => setLowStockThreshold(Number(e.target.value))}
              className="w-full h-[40px] px-3 border border-[#D1D5DB] rounded-[6px] text-[14px] font-['Poppins'] focus:outline-none focus:border-[#B88E2F] focus:ring-1 focus:ring-[#B88E2F]"
            />
            <p className="text-[11px] text-[#898989] mt-1">Currently set to {lowStockThreshold} units. Applies to all products.</p>
          </div>

          <Toggle
            checked={emailAlertsOn}
            onChange={e => setEmailAlertsOn(e.target.checked)}
            label="Enable Email Alerts"
            helper="Send email when any product hits low stock"
          />

          {emailAlertsOn && (
            <div>
              <label className="block text-[12px] font-[500] text-[#616161] mb-1">Alert Email Address</label>
              <input
                type="email"
                value={alertEmail}
                onChange={e => setAlertEmail(e.target.value)}
                placeholder="admin@woodcraft.com"
                className="w-full h-[40px] px-3 border border-[#D1D5DB] rounded-[6px] text-[14px] font-['Poppins'] focus:outline-none focus:border-[#B88E2F] focus:ring-1 focus:ring-[#B88E2F]"
              />
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Inventory;
