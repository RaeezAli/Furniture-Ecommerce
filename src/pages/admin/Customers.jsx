import React, { useState, useEffect, useMemo } from "react";
import { Users, UserPlus, Search, ShoppingBag, MapPin, ShieldAlert, AlertTriangle, Download } from "lucide-react";
import { collection, query, where, onSnapshot, getDocs } from "firebase/firestore";
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

const Customers = () => {
  const { loading, updateDocument } = useFirestore();
  const [allUsers, setAllUsers] = useState([]);
  const [ordersByUser, setOrdersByUser] = useState({});
  const [pageLoading, setPageLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  // Modals
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);

  const [toast, setToast] = useState(null);
  const showToast = (message, type = "success") => setToast({ message, type });

  useEffect(() => {
    // Initial parallel fetch of both collections
    const initialize = async () => {
      try {
        const [usersSnapshot, ordersSnapshot] = await Promise.all([
          getDocs(query(collection(db, "users"), where("role", "==", "customer"))),
          getDocs(collection(db, "orders"))
        ]);

        const allOrders = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const customers = usersSnapshot.docs.map(doc => {
          const user = { id: doc.id, ...doc.data() };

          // Match by userId (future orders) OR by customerEmail (existing guest orders)
          const userOrders = allOrders.filter(order =>
            order.userId === user.id ||
            (order.userId === "guest" && order.customerEmail === user.email)
          );

          const totalOrders = userOrders.length;

          const totalSpent = userOrders
            .filter(o => o.status !== "cancelled")
            .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

          const sortedOrders = [...userOrders].sort((a, b) => {
            const dateA = a.createdAt?.toDate?.() || new Date(0);
            const dateB = b.createdAt?.toDate?.() || new Date(0);
            return dateB - dateA;
          });

          const lastOrderDate = sortedOrders.length > 0
            ? sortedOrders[0].createdAt?.toDate?.()
            : null;

          return {
            ...user,
            totalOrders,
            totalSpent,
            lastOrderDate
          };
        });

        setAllUsers(customers);
        setOrdersByUser({});
        setPageLoading(false);
        setFetchError(null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setFetchError("Failed to load customers. Please try again.");
        setPageLoading(false);
      }
    };

    initialize();

    // Listen to customers in real-time and recalculate stats
    const usersQuery = query(collection(db, "users"), where("role", "==", "customer"));
    const unsubscribe = onSnapshot(
      usersQuery,
      async (snapshot) => {
        try {
          const ordersSnapshot = await getDocs(collection(db, "orders"));
          const allOrders = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

          const usersData = snapshot.docs.map(doc => {
            const user = { id: doc.id, ...doc.data() };

            const userOrders = allOrders.filter(order =>
              order.userId === user.id ||
              (order.userId === "guest" && order.customerEmail === user.email)
            );

            const totalOrders = userOrders.length;
            const totalSpent = userOrders
              .filter(o => o.status !== "cancelled")
              .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

            const sortedOrders = [...userOrders].sort((a, b) => {
              const dateA = a.createdAt?.toDate?.() || new Date(0);
              const dateB = b.createdAt?.toDate?.() || new Date(0);
              return dateB - dateA;
            });

            const lastOrderDate = sortedOrders.length > 0
              ? sortedOrders[0].createdAt?.toDate?.()
              : null;

            return {
              ...user,
              totalOrders,
              totalSpent,
              lastOrderDate
            };
          });

          setAllUsers(usersData);
        } catch (error) {
          console.error("Error updating customers:", error);
        }
      },
      (error) => {
        console.error("Error in customers listener:", error);
        setFetchError("Failed to load customers. Please try again.");
      }
    );

    return () => unsubscribe();
  }, []);

  // Since we now calculate stats in the initial fetch, enrichedCustomers = allUsers
  const enrichedCustomers = allUsers;

  const isThisMonth = (timestamp) => {
    if (!timestamp) return false;
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  };

  const stats = useMemo(() => ({
    total: enrichedCustomers.length,
    newThisMonth: enrichedCustomers.filter(c => isThisMonth(c.createdAt)).length,
    blocked: enrichedCustomers.filter(c => c.isBlocked).length,
  }), [enrichedCustomers]);

  const filteredCustomers = useMemo(() => {
    let list = enrichedCustomers.filter(c => {
      const name = c.name || "Anonymous";
      const email = c.email || "";
      const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            email.toLowerCase().includes(searchTerm.toLowerCase());
      let matchesStatus = true;
      if (statusFilter === "Active") matchesStatus = !c.isBlocked;
      else if (statusFilter === "Blocked") matchesStatus = c.isBlocked;
      return matchesSearch && matchesStatus;
    });

    if (sortBy === "newest") {
      list = [...list].sort((a, b) => {
        const aDate = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
        const bDate = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
        return bDate - aDate;
      });
    } else if (sortBy === "spent") {
      list = [...list].sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0));
    } else if (sortBy === "orders") {
      list = [...list].sort((a, b) => (b.totalOrders || 0) - (a.totalOrders || 0));
    }
    return list;
  }, [enrichedCustomers, searchTerm, statusFilter, sortBy]);

  const handleViewDetails = (customer) => {
    setSelectedCustomer(customer);
    setIsDetailModalOpen(true);
    const userOrders = (ordersByUser[customer.id] || [])
      .sort((a, b) => {
        const aTime = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
        const bTime = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
        return bTime - aTime;
      })
      .slice(0, 5);
    setCustomerOrders(userOrders);
  };

  const handleToggleBlock = (customer) => {
    setSelectedCustomer(customer);
    if (customer.isBlocked) {
      processBlockToggle(customer, false);
    } else {
      setIsBlockModalOpen(true);
    }
  };

  const processBlockToggle = async (customer, shouldBlock) => {
    const success = await updateDocument("users", customer.id, { isBlocked: shouldBlock });
    if (success) {
      showToast(shouldBlock ? "Customer blocked." : "Customer unblocked.");
      setIsBlockModalOpen(false);
      setIsDetailModalOpen(false);
    } else {
      showToast("Action failed.", "error");
    }
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
  };

  const formatDate = (ts) => {
    if (!ts) return "N/A";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const relativeDate = (date) => {
    if (!date) return "Never";
    const d = date instanceof Date ? date : (date.toDate ? date.toDate() : new Date(date));
    const diffMs = Date.now() - d.getTime();
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? "s" : ""} ago`;
    return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) > 1 ? "s" : ""} ago`;
  };

  const getStatusBadge = (status) => {
    const map = {
      delivered: "bg-[#E1F5EE] text-[#0F6E56]",
      processing: "bg-[#E6F1FB] text-[#185FA5]",
      pending: "bg-[#FAEEDA] text-[#854F0B]",
      cancelled: "bg-[#FCEBEB] text-[#A32D2D]",
    };
    const cls = map[status?.toLowerCase()] || "bg-[#F4F5F7] text-[#898989]";
    return <span className={`${cls} px-2 py-[2px] rounded-full text-[10px] font-medium capitalize`}>{status || "—"}</span>;
  };

  const handleExport = () => {
    const data = filteredCustomers.map(c => ({
      name: c.name || "Anonymous User",
      email: c.email || "",
      joinedFormatted: formatDate(c.createdAt),
      totalOrders: c.totalOrders || 0,
      totalSpent: (c.totalSpent || 0),
      lastOrderFormatted: c.lastOrderDate ? relativeDate(c.lastOrderDate) : "Never",
      accountStatus: c.isBlocked ? "Blocked" : "Active",
    }));
    exportToExcel(data, [
      { label: "Full Name", key: "name" },
      { label: "Email", key: "email" },
      { label: "Joined", key: "joinedFormatted" },
      { label: "Total Orders", key: "totalOrders" },
      { label: "Total Spent", key: "totalSpent" },
      { label: "Last Order", key: "lastOrderFormatted" },
      { label: "Status", key: "accountStatus" },
    ], "customers");
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-[#333333]">Customers</h1>
          <p className="text-[#898989] text-[13px]">{stats.total} total registered customers</p>
        </div>
        <button
          onClick={handleExport}
          disabled={filteredCustomers.length === 0}
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <KPICard title="Total Customers" value={stats.total} icon={<Users size={17} />} loading={pageLoading} />
        <KPICard title="New This Month" value={stats.newThisMonth} color="text-[#B88E2F]" icon={<UserPlus size={17} />} loading={pageLoading} />
        <KPICard title="Blocked" value={stats.blocked} color="text-[#A32D2D]" icon={<ShieldAlert size={17} />} loading={pageLoading} />
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border-[0.5px] border-[#E5E7EB] rounded-lg p-3 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#898989]" size={16} />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 h-[40px] border border-[#D1D5DB] rounded-[6px] text-[14px] font-['Poppins'] focus:outline-none focus:border-[#B88E2F] focus:ring-1 focus:ring-[#B88E2F]"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select
            className="h-[40px] px-3 border border-[#D1D5DB] rounded-[6px] text-[14px] font-['Poppins'] focus:outline-none focus:border-[#B88E2F] appearance-none bg-white"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Blocked">Blocked</option>
          </select>
          <select
            className="h-[40px] px-3 border border-[#D1D5DB] rounded-[6px] text-[14px] font-['Poppins'] focus:outline-none focus:border-[#B88E2F] appearance-none bg-white"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="newest">Sort: Newest</option>
            <option value="spent">Sort: Top Spenders</option>
            <option value="orders">Sort: Most Orders</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white border-[0.5px] border-[#E5E7EB] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F4F5F7]">
                <th className="px-3 py-3 text-[11px] font-[500] text-[#898989] uppercase tracking-wider w-[30%]">Customer</th>
                <th className="px-3 py-3 text-[11px] font-[500] text-[#898989] uppercase tracking-wider w-[12%]">Joined</th>
                <th className="px-3 py-3 text-[11px] font-[500] text-[#898989] uppercase tracking-wider w-[10%] text-center">Total Orders</th>
                <th className="px-3 py-3 text-[11px] font-[500] text-[#898989] uppercase tracking-wider w-[13%]">Total Spent</th>
                <th className="px-3 py-3 text-[11px] font-[500] text-[#898989] uppercase tracking-wider w-[12%]">Last Order</th>
                <th className="px-3 py-3 text-[11px] font-[500] text-[#898989] uppercase tracking-wider w-[10%]">Status</th>
                <th className="px-3 py-3 text-[11px] font-[500] text-[#898989] uppercase tracking-wider w-[13%]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-t border-[#E5E7EB]">
                    <td className="px-3 py-3"><div className="flex gap-3 items-center"><Shimmer className="w-9 h-9 rounded-full flex-shrink-0" /><div className="space-y-1.5"><Shimmer className="h-3 w-28" /><Shimmer className="h-2.5 w-36" /></div></div></td>
                    {[...Array(5)].map((_, j) => <td key={j} className="px-3 py-3"><Shimmer className="h-3 w-16" /></td>)}
                    <td className="px-3 py-3"><Shimmer className="h-5 w-20 rounded-full" /></td>
                  </tr>
                ))
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-16 text-center">
                    <Users size={40} className="mx-auto text-[#D1D5DB] mb-3" />
                    <p className="text-[14px] font-[500] text-[#898989]">No customers yet</p>
                    <p className="text-[12px] text-[#9F9F9F] mt-1">Customers will appear here once they sign up</p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(customer => (
                  <tr
                    key={customer.id}
                    className={`border-t border-[#E5E7EB] hover:bg-[#FCF8F3] transition-colors ${customer.isBlocked ? "opacity-[0.65] bg-[rgba(226,75,74,0.03)]" : ""}`}
                  >
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#FCF8F3] border border-[#E5E7EB] flex items-center justify-center text-[#B88E2F] text-[12px] font-bold flex-shrink-0">
                          {getInitials(customer.name)}
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-[#333333]" title={customer.internalId ? `Internal ID: ${customer.internalId}` : undefined}>{customer.name || "Anonymous User"}</p>
                          <p className="text-[11px] text-[#898989]">{customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-[12px] text-[#616161]">{formatDate(customer.createdAt)}</td>
                    <td className="px-3 py-3 text-[12px] text-[#333333] text-center">{customer.totalOrders || 0}</td>
                    <td className="px-3 py-3 text-[12px] font-medium text-[#333333]">Rs. {(customer.totalSpent || 0).toLocaleString()}</td>
                    <td className="px-3 py-3 text-[12px]">
                      {customer.lastOrderDate
                        ? <span className="text-[#616161]">{relativeDate(customer.lastOrderDate)}</span>
                        : <span className="text-[#9F9F9F]">Never</span>
                      }
                    </td>
                    <td className="px-3 py-3">
                      {customer.isBlocked
                        ? <span className="bg-[#FCEBEB] text-[#A32D2D] px-2 py-[2px] rounded-full text-[10px] font-medium">Blocked</span>
                        : <span className="bg-[#E1F5EE] text-[#0F6E56] px-2 py-[2px] rounded-full text-[10px] font-medium">Active</span>
                      }
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(customer)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-[#B88E2F] hover:bg-[#FCF8F3] rounded border border-[#B88E2F] transition-all"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleToggleBlock(customer)}
                          className={`text-[11px] font-semibold ${customer.isBlocked ? "text-[#0F6E56] hover:underline" : "text-[#A32D2D] hover:underline"}`}
                        >
                          {customer.isBlocked ? "Unblock" : "Block"}
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

      {/* MODAL: Customer Detail */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Customer Profile"
        width="600px"
        showFooter={false}
      >
        {selectedCustomer && (
          <div className="space-y-5">
            {/* Profile Header */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#FCF8F3] border border-[#E5E7EB] flex items-center justify-center text-[#B88E2F] text-[20px] font-bold flex-shrink-0">
                {getInitials(selectedCustomer.name)}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-[16px] font-[600] text-[#333333]">{selectedCustomer.name || "Anonymous User"}</h3>
                  {selectedCustomer.isBlocked
                    ? <span className="bg-[#FCEBEB] text-[#A32D2D] px-2 py-[2px] rounded-full text-[10px] font-medium">Blocked</span>
                    : <span className="bg-[#E1F5EE] text-[#0F6E56] px-2 py-[2px] rounded-full text-[10px] font-medium">Active</span>
                  }
                </div>
                <p className="text-[13px] text-[#898989] mt-0.5">{selectedCustomer.email}</p>
                {selectedCustomer.internalId && (
                  <p className="text-[10px] text-[#9F9F9F] font-mono mt-0.5">ID: {selectedCustomer.internalId}</p>
                )}
                <p className="text-[12px] text-[#898989] mt-0.5">Joined {formatDate(selectedCustomer.createdAt)}</p>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Total Orders", value: selectedCustomer.totalOrders || 0 },
                { label: "Total Spent", value: `Rs. ${(selectedCustomer.totalSpent || 0).toLocaleString()}` },
                { label: "Last Order", value: selectedCustomer.lastOrderDate ? relativeDate(selectedCustomer.lastOrderDate) : "Never" },
              ].map(s => (
                <div key={s.label} className="bg-[#F4F5F7] rounded-[8px] p-[10px] text-center">
                  <p className="text-[10px] text-[#898989] font-bold uppercase">{s.label}</p>
                  <p className="text-[15px] font-bold text-[#333333] mt-1">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Order History */}
            <div>
              <h4 className="text-[13px] font-[500] text-[#333333] flex items-center gap-2 mb-3">
                <ShoppingBag size={14} /> Order History
              </h4>
              <div className="border border-[#E5E7EB] rounded-lg overflow-hidden">
                <table className="w-full text-left text-[12px]">
                  <thead className="bg-[#F4F5F7] border-b border-[#E5E7EB]">
                    <tr>
                      <th className="p-2 font-[500] text-[#898989]">Order ID</th>
                      <th className="p-2 font-[500] text-[#898989]">Items</th>
                      <th className="p-2 font-[500] text-[#898989]">Amount</th>
                      <th className="p-2 font-[500] text-[#898989]">Status</th>
                      <th className="p-2 font-[500] text-[#898989]">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {customerOrders.length > 0 ? customerOrders.map(order => (
                      <tr key={order.id}>
                        <td className="p-2 font-medium text-[#333333]">#{(order.id || "").substring(0, 6)}</td>
                        <td className="p-2 text-[#616161]">{(order.items || []).length} items</td>
                        <td className="p-2 text-[#333333]">Rs. {(order.totalAmount || 0).toLocaleString()}</td>
                        <td className="p-2">{getStatusBadge(order.status)}</td>
                        <td className="p-2 text-[#898989]">{formatDate(order.createdAt)}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="5" className="p-6 text-center text-[#898989]">No orders yet</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Default Address */}
            {selectedCustomer.address && (
              <div>
                <h4 className="text-[13px] font-[500] text-[#333333] flex items-center gap-2 mb-2">
                  <MapPin size={14} /> Default Address
                </h4>
                <div className="p-[10px] bg-[#F4F5F7] rounded-[6px] text-[13px] text-[#333333]">
                  {selectedCustomer.address}
                </div>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E7EB]">
              <Button variant="outline" onClick={() => setIsDetailModalOpen(false)} className="py-2 px-6 rounded-xl text-[14px]">Cancel</Button>
              {selectedCustomer.isBlocked ? (
                <button
                  onClick={() => processBlockToggle(selectedCustomer, false)}
                  className="py-2 px-6 rounded-xl text-[14px] bg-[#B88E2F] hover:bg-[#A47E2A] text-white font-semibold transition-all"
                >
                  Unblock Customer
                </button>
              ) : (
                <button
                  onClick={() => { setIsDetailModalOpen(false); setIsBlockModalOpen(true); }}
                  className="py-2 px-6 rounded-xl text-[14px] bg-[#E24B4A] hover:bg-[#A32D2D] text-white font-semibold transition-all"
                >
                  Block Customer
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL: Block Confirmation */}
      <Modal
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        title="Block this customer?"
        width="360px"
        type="danger"
        confirmText="Block Customer"
        onConfirm={() => processBlockToggle(selectedCustomer, true)}
        loading={loading}
      >
        <div className="text-center space-y-4 py-2">
          <div className="w-12 h-12 mx-auto flex items-center justify-center">
            <AlertTriangle size={40} className="text-[#EF9F27]" />
          </div>
          <div>
            <h4 className="text-[16px] font-[600] text-[#333333] mb-2">Are you sure?</h4>
            <p className="text-[13px] text-[#616161]">
              <span className="font-bold text-[#333333]">{selectedCustomer?.name || "This customer"}</span> will no longer be able to log in or place orders. You can unblock them at any time.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Customers;
