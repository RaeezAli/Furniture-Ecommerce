import React, { useState, useEffect, useMemo } from "react";
import { Search, Eye, ShoppingBag, User, MapPin, Clock, CheckCircle, XCircle, AlertCircle, ChevronRight, Download, AlertTriangle } from "lucide-react";
import { collection, query, orderBy, onSnapshot, doc, getDoc, writeBatch } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useFirestore } from "../../hooks/useFirestore";
import { Modal } from "../../components/common/Modal";
import { Toast } from "../../components/common/Toast";
import { Button } from "../../components/common/Button";
import { exportToExcel } from "../../utils/exportToExcel";
import { useNavigate } from "react-router-dom";

/* ── Skeleton shimmer ── */
const Shimmer = ({ className }) => (
  <div
    className={`animate-pulse rounded ${className}`}
    style={{ background: "linear-gradient(90deg,#F4F5F7 25%,#E5E7EB 50%,#F4F5F7 75%)", backgroundSize: "200% 100%" }}
  />
);

const Orders = () => {
  const { loading, updateDocument } = useFirestore();
  const [orders, setOrders] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // Modals state
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [showStockErrorModal, setShowStockErrorModal] = useState(false);
  const [stockErrors, setStockErrors] = useState([]);

  const navigate = useNavigate();

  const [toast, setToast] = useState(null);
  const showToast = (message, type = "success") => setToast({ message, type });

  const validateAndDeductStock = async (order) => {
    const batch = writeBatch(db);
    const stockErrors = [];

    for (const item of order.items) {
      const productRef = doc(db, 'products', item.id);
      const productSnap = await getDoc(productRef);

      if (!productSnap.exists()) {
        stockErrors.push(`Product "${item.name}" no longer exists`);
        continue;
      }

      const currentStock = productSnap.data().stock || 0;

      if (currentStock < item.quantity) {
        if (currentStock === 0) {
          stockErrors.push(`"${item.name}" — out of stock, need ${item.quantity}`);
        } else {
          stockErrors.push(`"${item.name}" — only ${currentStock} in stock, need ${item.quantity}`);
        }
      }
    }

    if (stockErrors.length > 0) {
      return { success: false, errors: stockErrors };
    }

    for (const item of order.items) {
      const productRef = doc(db, 'products', item.id);
      const productSnap = await getDoc(productRef);
      const currentStock = productSnap.data().stock || 0;

      batch.update(productRef, {
        stock: currentStock - item.quantity
      });
    }

    const orderRef = doc(db, 'orders', order.id);
    batch.update(orderRef, {
      status: 'delivered',
      updatedAt: new Date()
    });

    await batch.commit();
    return { success: true };
  };

  const handleStatusChange = async (order, newStatus) => {
    if (newStatus === 'delivered') {
      setUpdatingOrderId(order.id);

      const result = await validateAndDeductStock(order);

      if (!result.success) {
        setStockErrors(result.errors);
        setShowStockErrorModal(true);
        setUpdatingOrderId(null);
        return;
      }

      showToast('Order marked as delivered. Stock updated.');
      setUpdatingOrderId(null);
      setIsDetailModalOpen(false);

    } else {
      await updateDocument("orders", order.id, {
        status: newStatus,
        updatedAt: new Date()
      });
      showToast(`Order status updated to ${newStatus}.`);
      setIsDetailModalOpen(false);
    }
  };

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(data);
        setPageLoading(false);
        setFetchError(null);
      },
      (error) => {
        console.error("Error fetching orders:", error);
        setFetchError("Failed to load orders. Please try again.");
        setPageLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const displayName = o.customerName || o.customerEmail || "Anonymous";
      const matchesSearch = (o.orderId || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (o.internalId || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                            displayName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTab = activeTab === "All" || o.status?.toLowerCase() === activeTab.toLowerCase();
      return matchesSearch && matchesTab;
    });
  }, [orders, searchTerm, activeTab]);

  const handleOpenDetail = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status || "pending");
    setIsDetailModalOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    await handleStatusChange(selectedOrder, newStatus);
  };

  const getStatusBadge = (status) => {
    const map = {
      delivered: "bg-[#E1F5EE] text-[#0F6E56]",
      processing: "bg-[#E6F1FB] text-[#185FA5]",
      pending: "bg-[#FAEEDA] text-[#854F0B]",
      cancelled: "bg-[#FCEBEB] text-[#A32D2D]",
    };
    const cls = map[status?.toLowerCase()] || "bg-[#F4F5F7] text-[#898989]";
    return (
      <span className={`${cls} px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider`}>
        {status || "Unknown"}
      </span>
    );
  };

  const formatDate = (ts) => {
    if (!ts) return "N/A";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const handleExport = () => {
    const data = filteredOrders.map(o => ({
      orderId: o.orderId || "",
      internalId: o.internalId || "",
      createdAtFormatted: formatDate(o.createdAt),
      customerName: o.customerName || o.customerEmail || "Anonymous",
      customerEmail: o.customerEmail || "",
      itemCount: `${(o.items || []).length} items`,
      totalAmount: (o.totalAmount || 0),
      status: o.status || "",
    }));
    exportToExcel(data, [
      { label: "Order ID", key: "orderId" },
      { label: "Internal ID", key: "internalId" },
      { label: "Date", key: "createdAtFormatted" },
      { label: "Customer", key: "customerName" },
      { label: "Email", key: "customerEmail" },
      { label: "Items", key: "itemCount" },
      { label: "Amount", key: "totalAmount" },
      { label: "Status", key: "status" },
    ], "orders");
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-[#333333]">Orders</h1>
          <p className="text-[#898989] text-[13px]">Monitor and manage customer transactions.</p>
        </div>
        <button
          onClick={handleExport}
          disabled={filteredOrders.length === 0}
          className="border border-[#B88E2F] text-[#B88E2F] hover:bg-[#B88E2F] hover:text-white font-semibold py-2 px-4 rounded-xl text-sm transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={14} />
          Export Excel
        </button>
      </div>

      {fetchError && (
        <div className="bg-[#FCEBEB] border border-[#E24B4A] rounded-lg p-4 text-[13px] text-[#A32D2D]">
          {fetchError}
        </div>
      )}

      {/* Main Content Card */}
      <div className="bg-white border-[0.5px] border-[#E5E7EB] rounded-lg shadow-sm overflow-hidden">
        
        {/* Tabs */}
        <div className="border-b-[0.5px] border-[#E5E7EB] flex px-4 overflow-x-auto hide-scrollbar">
          {['All', 'Pending', 'Processing', 'Delivered', 'Cancelled'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-4 text-[13px] font-medium transition-all border-b-2 whitespace-nowrap ${
                activeTab === tab 
                ? 'border-[#B88E2F] text-[#B88E2F]' 
                : 'border-transparent text-[#898989] hover:text-[#333333]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        {/* Search Bar */}
        <div className="p-4 border-b-[0.5px] border-[#E5E7EB]">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9F9F9F]" size={16} />
            <input 
              type="text" 
              placeholder="Search by Order ID or Customer Name..." 
              className="w-full pl-9 pr-4 h-[40px] border border-[#d1d5db] rounded-[6px] text-[14px] font-['Poppins'] focus:outline-none focus:border-[#B88E2F] focus:ring-1 focus:ring-[#B88E2F]"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F4F5F7]">
                <th className="p-4 text-[11px] font-bold text-[#898989] uppercase tracking-wider">Order ID</th>
                <th className="p-4 text-[11px] font-bold text-[#898989] uppercase tracking-wider">Date</th>
                <th className="p-4 text-[11px] font-bold text-[#898989] uppercase tracking-wider">Customer</th>
                <th className="p-4 text-[11px] font-bold text-[#898989] uppercase tracking-wider">Items</th>
                <th className="p-4 text-[11px] font-bold text-[#898989] uppercase tracking-wider">Amount</th>
                <th className="p-4 text-[11px] font-bold text-[#898989] uppercase tracking-wider">Status</th>
                <th className="p-4 text-[11px] font-bold text-[#898989] uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {pageLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="p-4"><Shimmer className="h-4 w-16" /></td>
                    <td className="p-4"><Shimmer className="h-4 w-24" /></td>
                    <td className="p-4"><div className="space-y-2"><Shimmer className="h-4 w-32" /><Shimmer className="h-3 w-40" /></div></td>
                    <td className="p-4"><Shimmer className="h-4 w-12" /></td>
                    <td className="p-4"><Shimmer className="h-4 w-20" /></td>
                    <td className="p-4"><Shimmer className="h-5 w-24 rounded-full" /></td>
                    <td className="p-4 text-right"><Shimmer className="h-8 w-20 rounded-lg ml-auto" /></td>
                  </tr>
                ))
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-20 text-center">
                    <ShoppingBag size={48} className="mx-auto text-[#D1D5DB] mb-3 opacity-20" />
                    <p className="text-[14px] font-medium text-[#898989]">No orders found</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-[#FCF8F3] transition-colors group cursor-pointer" onClick={() => handleOpenDetail(order)}>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-[13px] font-bold text-[#333333]">{order.orderId || `#${(order.id || "").substring(0, 8).toUpperCase()}`}</span>
                        {order.internalId && <span className="text-[10px] text-[#9F9F9F] font-mono" title={`Internal ID: ${order.internalId}`}>{order.internalId}</span>}
                      </div>
                    </td>
                    <td className="p-4 text-[13px] text-[#616161]">{formatDate(order.createdAt)}</td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-[13px] text-[#333333] font-semibold">{order.customerName || order.customerEmail || "Anonymous User"}</span>
                        {order.customerName && order.customerEmail && <span className="text-[11px] text-[#898989]">{order.customerEmail}</span>}
                      </div>
                    </td>
                    <td className="p-4 text-[13px] text-[#616161]">{(order.items || []).length} items</td>
                    <td className="p-4 text-[13px] text-[#333333] font-bold">Rs. {(order.totalAmount || 0).toLocaleString()}</td>
                    <td className="p-4">{getStatusBadge(order.status)}</td>
                    <td className="p-4 text-right">
                      <button className="text-[#B88E2F] hover:text-[#A47E2A] text-[12px] font-bold flex justify-end items-center gap-1 w-full uppercase tracking-tight">
                        <Eye size={14} /> Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Order Detail */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={`Order Details - ${selectedOrder?.orderId || `#${(selectedOrder?.id || "").substring(0, 8).toUpperCase()}`}`}
        width="650px"
        confirmText="Update Status"
        onConfirm={handleUpdateStatus}
        loading={loading}
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Top Row: Customer info & Status selector */}
            <div className="flex flex-col md:flex-row justify-between gap-4 p-4 bg-[#F4F5F7] rounded-xl border border-[#E5E7EB]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#B88E2F] border border-[#D1D5DB]">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-[#333333]">{selectedOrder.customerName || selectedOrder.customerEmail || "Anonymous"}</p>
                  <p className="text-[12px] text-[#898989]">{selectedOrder.customerName && selectedOrder.customerEmail ? selectedOrder.customerEmail : ""}</p>
                  {selectedOrder.internalId && (
                    <p className="text-[10px] text-[#9F9F9F] font-mono mt-0.5">Internal: {selectedOrder.internalId}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-[12px] font-bold text-[#616161] uppercase tracking-wider">Status</label>
                <select 
                  className="h-[36px] px-3 border border-[#D1D5DB] rounded-lg text-[13px] font-bold bg-white focus:outline-none focus:border-[#B88E2F]"
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Middle: Items & Address grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Items List */}
              <div className="space-y-3">
                <h3 className="text-[13px] font-bold text-[#333333] flex items-center gap-2 border-b border-[#E5E7EB] pb-2 uppercase tracking-wider">
                  <ShoppingBag size={14} /> Order Items
                </h3>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {(selectedOrder.items || []).map((item, idx) => (
                    <div key={idx} className="flex gap-3 bg-white p-2 rounded-lg border border-[#E5E7EB]">
                      <div className="w-14 h-14 bg-[#F4F5F7] rounded-md overflow-hidden flex-shrink-0 border border-[#D1D5DB]">
                        <img src={item.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-bold text-[#333333] truncate">{item.name}</p>
                        <p className="text-[12px] text-[#898989]">{item.quantity} x Rs. {item.price?.toLocaleString()}</p>
                        <p className="text-[12px] font-bold text-[#B88E2F] mt-1">Rs. {(item.quantity * item.price).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                  {(!selectedOrder.items || selectedOrder.items.length === 0) && (
                    <p className="text-[12px] text-[#898989] italic">No items listed.</p>
                  )}
                </div>
                <div className="pt-3 border-t border-[#E5E7EB] flex justify-between items-center">
                  <span className="text-[14px] font-bold text-[#333333]">Total Amount</span>
                  <span className="text-[18px] font-bold text-[#B88E2F]">Rs. {(selectedOrder.totalAmount || 0).toLocaleString()}</span>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="space-y-3">
                <h3 className="text-[13px] font-bold text-[#333333] flex items-center gap-2 border-b border-[#E5E7EB] pb-2 uppercase tracking-wider">
                  <MapPin size={14} /> Shipping Details
                </h3>
                <div className="p-4 bg-[#FCF8F3] rounded-xl border border-[#FAEEDA] space-y-2">
                  <p className="text-[13px] font-bold text-[#333333]">{selectedOrder.shippingAddress?.fullName}</p>
                  <p className="text-[13px] text-[#616161] leading-relaxed">
                    {selectedOrder.shippingAddress?.street}<br />
                    {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.zip}<br />
                    {selectedOrder.shippingAddress?.province || ""}
                  </p>
                  <div className="pt-2">
                    <p className="text-[11px] font-bold text-[#898989] uppercase tracking-tighter">Phone Number</p>
                    <p className="text-[13px] text-[#333333] font-medium">{selectedOrder.shippingAddress?.phone || "N/A"}</p>
                  </div>
                </div>

                <div className="p-4 bg-[#F4F5F7] rounded-xl border border-[#E5E7EB] space-y-2">
                   <div className="flex items-center gap-2 text-[#898989]">
                      <Clock size={14} />
                      <span className="text-[12px] font-medium">Placed on {formatDate(selectedOrder.createdAt)}</span>
                   </div>
                   <div className="flex items-center gap-2 text-[#898989]">
                      <AlertCircle size={14} />
                      <span className="text-[12px] font-medium">Payment via {selectedOrder.paymentMethod || "Cash on Delivery"}</span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL: Stock Error */}
      <Modal
        isOpen={showStockErrorModal}
        onClose={() => setShowStockErrorModal(false)}
        title="Cannot Mark as Delivered"
        width="480px"
        showFooter={false}
      >
        <div className="space-y-5 py-2">
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-full bg-[#FCEBEB] flex items-center justify-center">
              <AlertTriangle size={32} className="text-[#E24B4A]" />
            </div>
          </div>

          <div className="text-center">
            <p className="text-[14px] text-[#333333] font-medium">
              The following items don't have enough stock to fulfill this order:
            </p>
          </div>

          <div className="bg-[#FCEBEB] rounded-lg p-4 space-y-2">
            {stockErrors.map((error, idx) => (
              <div key={idx} className="flex items-start gap-2 text-[13px] text-[#A32D2D]">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-[#E24B4A] flex-shrink-0" />
                <span>{error}</span>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-[13px] text-[#616161]">
              Please restock these items in the Inventory page before marking this order as delivered.
            </p>
            <button
              onClick={() => {
                setShowStockErrorModal(false);
                navigate('/admin/inventory');
              }}
              className="text-[#B88E2F] text-[13px] font-semibold hover:underline mt-2"
            >
              Go to Inventory →
            </button>
          </div>

          <div className="flex justify-center pt-2">
            <Button
              variant="outline"
              onClick={() => setShowStockErrorModal(false)}
              className="px-8 py-2.5 rounded-xl text-[14px]"
            >
              OK, I'll Restock First
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Orders;
