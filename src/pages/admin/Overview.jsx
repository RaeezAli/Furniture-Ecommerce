import React, { useState, useEffect, useMemo } from "react";
import { AlertTriangle, TrendingUp, DollarSign, Package, ShoppingCart, Users, ArrowRight, BarChart2 } from "lucide-react";
import { useFirestore } from "../../hooks/useFirestore";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";

/* ── Calculate Percentage Change ── */
const calculatePercentageChange = (currentMonthValue, lastMonthValue) => {
  if (lastMonthValue === 0) {
    return currentMonthValue > 0 
      ? { percentage: "+100%", trend: "increase" }
      : { percentage: "0%", trend: "no change" };
  }
  
  const percentage = ((currentMonthValue - lastMonthValue) / lastMonthValue) * 100;
  const percentageStr = `${percentage >= 0 ? "+" : ""}${percentage.toFixed(1)}%`;
  
  let trend = "no change";
  if (percentage > 0) trend = "increase";
  else if (percentage < 0) trend = "decrease";
  
  return { percentage: percentageStr, trend };
};

/* ── KPI Card Component ── */
const KPICard = ({ title, value, icon, subValue, loading, color = "text-[#333333]" }) => (
  <div className="bg-[#F4F5F7] rounded-xl p-4 border border-transparent hover:border-[#E5E7EB] transition-all group">
    <div className="flex justify-between items-start mb-2">
      <span className="text-[11px] text-[#898989] font-bold uppercase tracking-wider">{title}</span>
      <div className="text-[#898989] group-hover:text-[#B88E2F] transition-colors">{icon}</div>
    </div>
    <div className="flex flex-col">
      {loading ? (
        <div className="h-7 w-24 bg-gray-200 animate-pulse rounded mt-1"></div>
      ) : (
        <>
          <h3 className={`text-[22px] font-bold leading-none mt-1 ${color}`}>{value}</h3>
          {subValue && (
            <span className={`text-[11px] font-medium mt-1 flex items-center gap-1 ${
              subValue.trend === "increase" ? "text-[#2EC1AC]" :
              subValue.trend === "decrease" ? "text-[#E24B4A]" : "text-[#898989]"
            }`}>
              <TrendingUp size={10} className={subValue.trend === "decrease" ? "rotate-180" : ""} />
              {subValue.percentage} this month
            </span>
          )}
        </>
      )}
    </div>
  </div>
);

const Overview = () => {
  const { fetchCollection } = useFirestore();
  const [data, setData] = useState({
    products: [],
    orders: [],
    customers: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      const [p, o, u] = await Promise.all([
        fetchCollection("products"),
        fetchCollection("orders", "createdAt", "desc"),
        fetchCollection("users")
      ]);
      setData({
        products: p,
        orders: o,
        customers: u.filter(user => user.role === "customer")
      });
      setLoading(false);
    };
    loadDashboardData();
  }, [fetchCollection]);

  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const getMonthBounds = (month, year) => {
      const start = new Date(year, month, 1);
      const end = new Date(year, month + 1, 0, 23, 59, 59, 999);
      return { start, end };
    };
    
    const currentMonthBounds = getMonthBounds(currentMonth, currentYear);
    const lastMonthBounds = getMonthBounds(currentMonth - 1, currentMonth === 0 ? currentYear - 1 : currentYear);
    
    const filterByMonth = (items, dateField) => {
      const currentMonthItems = items.filter(item => {
        const date = item[dateField]?.toDate ? item[dateField].toDate() : new Date(item[dateField]);
        return date >= currentMonthBounds.start && date <= currentMonthBounds.end;
      });
      
      const lastMonthItems = items.filter(item => {
        const date = item[dateField]?.toDate ? item[dateField].toDate() : new Date(item[dateField]);
        return date >= lastMonthBounds.start && date <= lastMonthBounds.end;
      });
      
      return { current: currentMonthItems, last: lastMonthItems };
    };
    
    const { current: currentOrders, last: lastOrders } = filterByMonth(data.orders, "createdAt");
    
    const currentRevenue = currentOrders
      .filter(o => o.status !== "cancelled")
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    
    const lastRevenue = lastOrders
      .filter(o => o.status !== "cancelled")
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    
    const currentProducts = data.products.filter(p => {
      const date = p.createdAt?.toDate ? p.createdAt.toDate() : new Date(p.createdAt);
      return date >= currentMonthBounds.start && date <= currentMonthBounds.end;
    });
    
    const lastProducts = data.products.filter(p => {
      const date = p.createdAt?.toDate ? p.createdAt.toDate() : new Date(p.createdAt);
      return date >= lastMonthBounds.start && date <= lastMonthBounds.end;
    });
    
    const currentCustomers = data.customers.filter(c => {
      const date = c.createdAt?.toDate ? c.createdAt.toDate() : new Date(c.createdAt);
      return date >= currentMonthBounds.start && date <= currentMonthBounds.end;
    });
    
    const lastCustomers = data.customers.filter(c => {
      const date = c.createdAt?.toDate ? c.createdAt.toDate() : new Date(c.createdAt);
      return date >= lastMonthBounds.start && date <= lastMonthBounds.end;
    });
    
    const totalRevenue = data.orders
      .filter(o => o.status !== "cancelled")
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    
    const lowStockCount = data.products.filter(p => p.stock > 0 && p.stock <= 5).length;
    const outOfStockCount = data.products.filter(p => p.stock === 0).length;

    const categoryMap = {};
    data.products.forEach(p => {
      categoryMap[p.category] = (categoryMap[p.category] || 0) + 1;
    });
    const categoryChartData = Object.entries(categoryMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    return {
      revenue: totalRevenue,
      orders: data.orders.length,
      products: data.products.length,
      customers: data.customers.length,
      lowStock: lowStockCount,
      outOfStock: outOfStockCount,
      categoryChartData,
      recentOrders: data.orders.slice(0, 5),
      revenueChange: calculatePercentageChange(currentRevenue, lastRevenue),
      ordersChange: calculatePercentageChange(currentOrders.length, lastOrders.length),
      productsChange: calculatePercentageChange(currentProducts.length, lastProducts.length),
      customersChange: calculatePercentageChange(currentCustomers.length, lastCustomers.length),
    };
  }, [data]);

  const COLORS = ["#B88E2F", "#2EC1AC", "#333333", "#898989", "#D1D5DB"];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-[28px] font-bold text-[#333333]">Dashboard Overview</h1>
          <p className="text-[#898989] text-[14px]">Quick insights into your furniture store's performance.</p>
        </div>
        <div className="hidden md:block">
           <span className="text-[12px] font-medium text-[#898989] bg-[#F4F5F7] px-3 py-1.5 rounded-full border border-[#E5E7EB]">
             Last updated: {new Date().toLocaleTimeString()}
           </span>
        </div>
      </div>

      {/* Alert Strip (Low Stock) */}
      {(stats.lowStock > 0 || stats.outOfStock > 0) && (
        <div className="bg-[#FCF8F3] border-[0.5px] border-[#FAC775] rounded-xl py-3 px-4 flex items-center justify-between shadow-sm animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#FAEEDA] flex items-center justify-center text-[#854F0B]">
              <AlertTriangle size={16} />
            </div>
            <div>
              <span className="text-[13px] text-[#854F0B] font-bold">Inventory Warning: </span>
              <span className="text-[13px] text-[#854F0B]">
                {stats.outOfStock > 0 && `${stats.outOfStock} items are out of stock. `}
                {stats.lowStock > 0 && `${stats.lowStock} items are running low.`}
              </span>
            </div>
          </div>
          <Link to="/admin/inventory" className="text-[12px] font-bold text-[#B88E2F] hover:underline flex items-center gap-1">
            Reorder Now <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Revenue" value={`Rs. ${stats.revenue.toLocaleString()}`} icon={<DollarSign size={18} />} subValue={stats.revenueChange} loading={loading} color="text-[#B88E2F]" />
        <KPICard title="Total Orders" value={stats.orders} icon={<ShoppingCart size={18} />} subValue={stats.ordersChange} loading={loading} />
        <KPICard title="Active Products" value={stats.products} icon={<Package size={18} />} loading={loading} />
        <KPICard title="Total Customers" value={stats.customers} icon={<Users size={18} />} subValue={stats.customersChange} loading={loading} />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-[#E5E7EB] flex justify-between items-center bg-[#F4F5F7]">
            <h2 className="text-[14px] font-bold text-[#333333] flex items-center gap-2">
              <ShoppingCart size={16} className="text-[#B88E2F]" /> Recent Orders
            </h2>
            <Link to="/admin/orders" className="text-[11px] font-bold text-[#B88E2F] uppercase hover:underline">
              View all
            </Link>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white text-[11px] text-[#898989] font-bold uppercase tracking-widest border-b border-[#E5E7EB]">
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}><td colSpan="4" className="p-4"><div className="h-8 bg-gray-100 animate-pulse rounded"></div></td></tr>
                  ))
                ) : stats.recentOrders.length === 0 ? (
                  <tr><td colSpan="4" className="p-10 text-center text-[#898989] text-[13px]">{"Don&apos;t have any products yet."}</td></tr>
                ) : (
                  stats.recentOrders.map(order => (
                    <tr key={order.id} className="hover:bg-[#FCF8F3] transition-all cursor-pointer group">
                      <td className="p-4 font-mono text-[12px] text-[#333333] font-bold uppercase">#{(order.id || "").substring(0, 8)}</td>
                      <td className="p-4 text-[13px] text-[#616161] font-medium">{order.customerName || order.shippingAddress?.fullName || "Guest"}</td>
                      <td className="p-4 text-[13px] text-[#333333] font-bold">Rs. {(order.totalAmount || 0).toLocaleString()}</td>
                      <td className="p-4 text-right">
                         <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                           order.status === 'delivered' ? 'bg-[#E1F5EE] text-[#0F6E56]' : 
                           order.status === 'cancelled' ? 'bg-[#FCEBEB] text-[#A32D2D]' :
                           'bg-[#FAEEDA] text-[#854F0B]'
                         }`}>
                           {order.status || 'pending'}
                         </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Charts Side Panel */}
        <div className="space-y-6">
          {/* Chart Card: Products by Category */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm p-4 h-full flex flex-col">
            <h2 className="text-[14px] font-bold text-[#333333] mb-6 flex items-center gap-2">
              <BarChart2 size={16} className="text-[#B88E2F]" /> Inventory Distribution
            </h2>
            
            <div className="flex-1 min-h-[250px] w-full">
              {loading ? (
                <div className="w-full h-full bg-[#F4F5F7] animate-pulse rounded-lg flex items-center justify-center">
                   <BarChart2 size={32} className="text-[#D1D5DB]" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={stats.categoryChartData} layout="vertical" margin={{ left: 10, right: 30 }}>
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      width={80} 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: "#616161", fontSize: 11, fontWeight: "500" }} 
                    />
                    <Tooltip 
                      cursor={{ fill: 'transparent' }} 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                      {stats.categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
               <div className="flex justify-between items-center text-[12px] text-[#898989]">
                 <span>Total Products Analyzed</span>
                 <span className="font-bold text-[#333333]">{stats.products} items</span>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Overview;
