import React, { useState, useMemo, useEffect } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
} from "lucide-react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";

const PIE_COLORS = ["#B88E2F", "#2EC1AC", "#333333", "#D1D5DB", "#898989"];

// ── Calculate Percentage Change ───────────────────────────────────────
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

// ── KPI Card ───────────────────────────────────────────────────────────────
const KPICard = ({ title, value, icon, change, isPositive }) => (
  <div className="bg-[#F4F5F7] rounded-lg p-[14px]">
    <div className="flex justify-between items-start mb-[6px]">
      <span className="text-[11px] text-[#898989] font-medium">{title}</span>
      <div className="text-[#898989]">{icon}</div>
    </div>
    <div className="flex items-end gap-2">
      <h3 className="text-[22px] font-medium text-[#333333] leading-none">
        {value}
      </h3>
      <span
        className={`text-[11px] flex items-center ${
          isPositive === true ? "text-[#0F6E56]" : 
          isPositive === false ? "text-[#993C1D]" : "text-[#898989]"
        }`}
      >
        {isPositive === true ? (
          <TrendingUp size={12} className="mr-1" />
        ) : isPositive === false ? (
          <TrendingDown size={12} className="mr-1" />
        ) : null}
        {typeof change === 'string' ? change : change?.percentage}
      </span>
    </div>
  </div>
);

// ── Custom Tooltip ─────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-lg p-3 text-[12px]">
        <p className="font-semibold text-[#333333] mb-1">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} style={{ color: entry.color }}>
            {entry.name}:{" "}
            {entry.name === "Revenue" || entry.name === "Amount"
              ? `Rs. ${entry.value.toLocaleString()}`
              : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ── Helper Functions ───────────────────────────────────────────────────────
const getRangeStartDate = (range) => {
  const now = new Date();
  switch (range) {
    case "Today":
      return new Date(now.toDateString());
    case "This Week": {
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      return weekAgo;
    }
    case "This Month":
      return new Date(now.getFullYear(), now.getMonth(), 1);
    case "Last 3 Months": {
      const threeMonthsAgo = new Date(now);
      threeMonthsAgo.setMonth(now.getMonth() - 3);
      return threeMonthsAgo;
    }
    case "This Year":
      return new Date(now.getFullYear(), 0, 1);
    default:
      return new Date(0);
  }
};

const filterOrdersByRange = (orders, range) => {
  const now = new Date();
  return orders.filter((order) => {
    const orderDate = order.createdAt?.toDate?.();
    if (!orderDate) return false;
    switch (range) {
      case "Today":
        return orderDate.toDateString() === now.toDateString();
      case "This Week": {
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        return orderDate >= weekAgo;
      }
      case "This Month":
        return (
          orderDate.getMonth() === now.getMonth() &&
          orderDate.getFullYear() === now.getFullYear()
        );
      case "Last 3 Months": {
        const threeMonthsAgo = new Date(now);
        threeMonthsAgo.setMonth(now.getMonth() - 3);
        return orderDate >= threeMonthsAgo;
      }
      case "This Year":
        return orderDate.getFullYear() === now.getFullYear();
      default:
        return true;
    }
  });
};

const buildRevenueChartData = (filteredOrders, range) => {
  const groups = {};

  filteredOrders.forEach((order) => {
    if (order.status === "cancelled") return;
    const date = order.createdAt?.toDate?.();
    if (!date) return;

    let key, sortValue;
    if (range === "Today") {
      key = `${date.getHours()}:00`;
      sortValue = date.getHours();
    } else if (range === "This Week") {
      key = date.toLocaleDateString("en", { weekday: "short" });
      sortValue = date.getDay();
    } else if (range === "This Month") {
      key = `Week ${Math.ceil(date.getDate() / 7)}`;
      sortValue = Math.ceil(date.getDate() / 7);
    } else if (range === "Last 3 Months") {
      key = date.toLocaleDateString("en", { month: "short" });
      sortValue = date.getMonth();
    } else if (range === "This Year") {
      key = date.toLocaleDateString("en", { month: "short" });
      sortValue = date.getMonth();
    }

    groups[key] = { revenue: (groups[key]?.revenue || 0) + (order.totalAmount || 0), sortValue };
  });

  const chartData = Object.entries(groups).map(([name, data]) => ({ name, revenue: data.revenue, sortValue: data.sortValue }));
  
  // Sort by sortValue in ascending order
  chartData.sort((a, b) => a.sortValue - b.sortValue);
  
  return chartData;
};

const buildBestSellers = (filteredOrders) => {
  const productSales = {};

  filteredOrders.forEach((order) => {
    if (order.status === "cancelled") return;
    (order.items || []).forEach((item) => {
      if (!productSales[item.name]) productSales[item.name] = 0;
      productSales[item.name] += item.quantity || 1;
    });
  });

  return Object.entries(productSales)
    .map(([name, sales]) => ({ name, sales }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);
};

const buildCategoryData = (filteredOrders, products) => {
  const categoryMap = {};
  products.forEach((p) => {
    categoryMap[p.id] = p.category;
  });

  const categoryRevenue = {};
  filteredOrders.forEach((order) => {
    if (order.status === "cancelled") return;
    (order.items || []).forEach((item) => {
      const category = categoryMap[item.id] || "Other";
      categoryRevenue[category] =
        (categoryRevenue[category] || 0) + item.price * item.quantity;
    });
  });

  const total = Object.values(categoryRevenue).reduce((a, b) => a + b, 0);
  return Object.entries(categoryRevenue).map(([name, value]) => ({
    name,
    value: total > 0 ? Math.round((value / total) * 100) : 0,
  }));
};

const buildCustomerAcquisition = (users, filteredOrders) => {
  const monthGroups = {};

  users.forEach((user) => {
    const date = user.createdAt?.toDate?.();
    if (!date) return;
    const key = date.toLocaleDateString("en", { month: "short" });
    if (!monthGroups[key])
      monthGroups[key] = { name: key, newCustomers: 0, returning: 0 };
    monthGroups[key].newCustomers += 1;
  });

  const orderCountByUser = {};
  filteredOrders.forEach((o) => {
    if (o.userId && o.userId !== "guest") {
      orderCountByUser[o.userId] = (orderCountByUser[o.userId] || 0) + 1;
    }
  });
  const returningCount = Object.values(orderCountByUser).filter(
    (c) => c > 1,
  ).length;

  const months = Object.keys(monthGroups);
  months.forEach((m) => {
    monthGroups[m].returning = Math.floor(returningCount / months.length) || 0;
  });

  return Object.values(monthGroups);
};

const buildRecentTopOrders = (filteredOrders) => {
  return [...filteredOrders]
    .filter((o) => o.status !== "cancelled")
    .sort((a, b) => (b.totalAmount || 0) - (a.totalAmount || 0))
    .slice(0, 5)
    .map((o) => ({
      id: o.orderId || o.id,
      customer: o.customerName || o.customerEmail || "Unknown",
      items: (o.items || []).length,
      amount: o.totalAmount || 0,
      status: o.status,
      date:
        o.createdAt?.toDate?.()?.toLocaleDateString("en", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }) || "—",
    }));
};

// ── Analytics Page ─────────────────────────────────────────────────────────
const Analytics = () => {
  const [timeRange, setTimeRange] = useState("This Month");
  const [loading, setLoading] = useState(true);
  const [allOrders, setAllOrders] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true);
      try {
        const [ordersSnap, usersSnap, productsSnap] = await Promise.all([
          getDocs(collection(db, "orders")),
          getDocs(
            query(collection(db, "users"), where("role", "==", "customer")),
          ),
          getDocs(collection(db, "products")),
        ]);

        const orders = ordersSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        const users = usersSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        const products = productsSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        setAllOrders(orders);
        setAllUsers(users);
        setAllProducts(products);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      }
      setLoading(false);
    };

    fetchAnalyticsData();
  }, []);

  const filteredOrders = filterOrdersByRange(allOrders, timeRange);
  const revenueData = buildRevenueChartData(filteredOrders, timeRange);
  const bestSellers = buildBestSellers(filteredOrders);
  const categoryData = buildCategoryData(filteredOrders, allProducts);
  const customerAcquisition = buildCustomerAcquisition(
    allUsers,
    filteredOrders,
  );
  const recentOrders = buildRecentTopOrders(filteredOrders);

  const totals = useMemo(() => {
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
    
    const { current: currentOrders, last: lastOrders } = filterByMonth(allOrders, "createdAt");
    
    const currentRevenue = currentOrders
      .filter(o => o.status !== "cancelled")
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    
    const lastRevenue = lastOrders
      .filter(o => o.status !== "cancelled")
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    
    const currentOrdersCount = currentOrders.filter(o => o.status !== "cancelled").length;
    const lastOrdersCount = lastOrders.filter(o => o.status !== "cancelled").length;
    
    const currentAvgOrder = currentOrdersCount > 0 ? Math.round(currentRevenue / currentOrdersCount) : 0;
    const lastAvgOrder = lastOrdersCount > 0 ? Math.round(lastRevenue / lastOrdersCount) : 0;
    
    const { current: currentCustomers, last: lastCustomers } = filterByMonth(allUsers, "createdAt");
    
    const validOrders = filteredOrders.filter((o) => o.status !== "cancelled");
    const revenue = validOrders.reduce(
      (sum, o) => sum + (o.totalAmount || 0),
      0,
    );
    const orderCount = validOrders.length;
    const avgOrder = orderCount > 0 ? Math.round(revenue / orderCount) : 0;

    const rangeStart = getRangeStartDate(timeRange);
    const newCustomers = allUsers.filter((u) => {
      const joined = u.createdAt?.toDate?.();
      return joined && joined >= rangeStart;
    }).length;

    return { 
      revenue, 
      orders: orderCount, 
      avgOrder, 
      newCustomers,
      revenueChange: calculatePercentageChange(currentRevenue, lastRevenue),
      ordersChange: calculatePercentageChange(currentOrdersCount, lastOrdersCount),
      avgOrderChange: calculatePercentageChange(currentAvgOrder, lastAvgOrder),
      customersChange: calculatePercentageChange(currentCustomers.length, lastCustomers.length),
    };
  }, [allOrders, allUsers, timeRange]);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return (
          <span className="bg-[#E1F5EE] text-[#0F6E56] px-2 py-1 rounded-full text-[10px] font-medium">
            Delivered
          </span>
        );
      case "processing":
        return (
          <span className="bg-[#E6F1FB] text-[#185FA5] px-2 py-1 rounded-full text-[10px] font-medium">
            Processing
          </span>
        );
      case "pending":
        return (
          <span className="bg-[#FAEEDA] text-[#854F0B] px-2 py-1 rounded-full text-[10px] font-medium">
            Pending
          </span>
        );
      case "cancelled":
        return (
          <span className="bg-[#FCEBEB] text-[#E24B4A] px-2 py-1 rounded-full text-[10px] font-medium">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="bg-[#F4F5F7] text-[#898989] px-2 py-1 rounded-full text-[10px] font-medium">
            {status || "—"}
          </span>
        );
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#B88E2F] border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-[#333333]">Analytics</h1>
          <p className="text-[#898989] text-[14px]">
            Detailed performance metrics and reports.
          </p>
        </div>

        {/* Time Range Switcher */}
        <div className="flex bg-[#F4F5F7] border border-[#E5E7EB] rounded-lg p-1 overflow-x-auto">
          {[
            "Today",
            "This Week",
            "This Month",
            "Last 3 Months",
            "This Year",
          ].map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-4 py-2 rounded-md text-[13px] font-medium transition-all whitespace-nowrap ${
                timeRange === r
                  ? "bg-white text-[#B88E2F] shadow-sm"
                  : "text-[#616161] hover:text-[#333333]"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard
          title="Total Revenue"
          value={`Rs. ${(totals.revenue / 1000).toFixed(0)}K`}
          icon={<DollarSign size={16} />}
          change={totals.revenueChange}
          isPositive={totals.revenueChange?.trend === "increase" ? true : totals.revenueChange?.trend === "decrease" ? false : null}
        />
        <KPICard
          title="Total Orders"
          value={totals.orders.toLocaleString()}
          icon={<ShoppingCart size={16} />}
          change={totals.ordersChange}
          isPositive={totals.ordersChange?.trend === "increase" ? true : totals.ordersChange?.trend === "decrease" ? false : null}
        />
        <KPICard
          title="Avg. Order Value"
          value={`Rs. ${totals.avgOrder.toLocaleString()}`}
          icon={<Package size={16} />}
          change={totals.avgOrderChange}
          isPositive={totals.avgOrderChange?.trend === "increase" ? true : totals.avgOrderChange?.trend === "decrease" ? false : null}
        />
        <KPICard
          title="New Customers"
          value={totals.newCustomers.toLocaleString()}
          icon={<Users size={16} />}
          change={null}
          isPositive={null}
        />
      </div>

      {/* Chart 1: Revenue Trend (Full Width) */}
      <div className="bg-white border-[0.5px] border-[#E5E7EB] rounded-xl p-6">
        <h2 className="text-[15px] font-semibold text-[#333333] mb-5">
          Revenue Trend
        </h2>
        {revenueData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-[14px] text-[#9F9F9F]">
              No data for this period
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={revenueData}
              margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#B88E2F" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#B88E2F" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#F4F5F7"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#898989" }}
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#898989" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                dx={-10}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#B88E2F"
                strokeWidth={3}
                fill="url(#revenueGrad)"
                dot={{ r: 4, fill: "#B88E2F", strokeWidth: 2, stroke: "#FFF" }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Charts 2 & 3: Best Selling & Categories (Half Width) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Best Selling Products */}
        <div className="bg-white border-[0.5px] border-[#E5E7EB] rounded-xl p-6">
          <h2 className="text-[15px] font-semibold text-[#333333] mb-5">
            Best Selling Products
          </h2>
          {bestSellers.length === 0 ? (
            <div className="h-[260px] flex items-center justify-center">
              <p className="text-[14px] text-[#9F9F9F]">
                No data for this period
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={bestSellers}
                layout="vertical"
                margin={{ top: 0, right: 30, left: 40, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#F4F5F7"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: "#898989" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: 11, fill: "#333333" }}
                  axisLine={false}
                  tickLine={false}
                  width={100}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "#F4F5F7" }}
                />
                <Bar
                  dataKey="sales"
                  name="Units Sold"
                  fill="#2EC1AC"
                  radius={[0, 4, 4, 0]}
                  barSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Revenue by Category (Donut) */}
        <div className="bg-white border-[0.5px] border-[#E5E7EB] rounded-xl p-6">
          <h2 className="text-[15px] font-semibold text-[#333333] mb-5">
            Revenue by Category
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 h-[260px]">
            {categoryData.length === 0 ? (
              <p className="text-[14px] text-[#9F9F9F]">
                No data for this period
              </p>
            ) : (
              <>
                <div className="w-[200px] h-[200px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="none"
                      >
                        {categoryData.map((_, i) => (
                          <Cell
                            key={i}
                            fill={PIE_COLORS[i % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => `${v}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[11px] text-[#898989] font-medium uppercase tracking-wider">
                      Total
                    </span>
                    <span className="text-[18px] font-bold text-[#333333]">
                      100%
                    </span>
                  </div>
                </div>

                {/* Custom Legend */}
                <div className="flex flex-col gap-3 w-full sm:w-[150px]">
                  {categoryData.map((c, i) => (
                    <div
                      key={c.name}
                      className="flex items-center justify-between text-[13px]"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-sm"
                          style={{ background: PIE_COLORS[i] }}
                        />
                        <span className="text-[#616161]">{c.name}</span>
                      </div>
                      <span className="font-semibold text-[#333333]">
                        {c.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Chart 4: Customer Acquisition (Full Width) */}
      <div className="bg-white border-[0.5px] border-[#E5E7EB] rounded-xl p-6">
        <h2 className="text-[15px] font-semibold text-[#333333] mb-5">
          Customer Acquisition
        </h2>
        {customerAcquisition.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-[14px] text-[#9F9F9F]">
              No data for this period
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={customerAcquisition}
              margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
              barGap={8}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#F4F5F7"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#898989" }}
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#898989" }}
                axisLine={false}
                tickLine={false}
                dx={-10}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "#F4F5F7" }}
              />
              <Legend
                wrapperStyle={{ fontSize: "12px", paddingTop: "20px" }}
                iconType="circle"
              />
              <Bar
                dataKey="newCustomers"
                name="New Customers"
                fill="#2EC1AC"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
              <Bar
                dataKey="returning"
                name="Returning Customers"
                fill="#B88E2F"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Table 1: Recent Top Orders */}
      <div className="bg-white border-[0.5px] border-[#E5E7EB] rounded-xl overflow-hidden">
        <div className="p-5 border-b border-[#E5E7EB] flex justify-between items-center">
          <h2 className="text-[15px] font-semibold text-[#333333]">
            Recent Top Orders
          </h2>
          <button className="text-[13px] text-[#B88E2F] font-semibold hover:underline">
            View All Orders
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F4F5F7] border-b border-[#E5E7EB]">
                <th className="p-4 text-[12px] font-semibold text-[#898989] uppercase tracking-wider">
                  Order ID
                </th>
                <th className="p-4 text-[12px] font-semibold text-[#898989] uppercase tracking-wider">
                  Customer
                </th>
                <th className="p-4 text-[12px] font-semibold text-[#898989] uppercase tracking-wider">
                  Date
                </th>
                <th className="p-4 text-[12px] font-semibold text-[#898989] uppercase tracking-wider text-right">
                  Items
                </th>
                <th className="p-4 text-[12px] font-semibold text-[#898989] uppercase tracking-wider text-right">
                  Amount
                </th>
                <th className="p-4 text-[12px] font-semibold text-[#898989] uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {recentOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="p-8 text-center text-[14px] text-[#9F9F9F]"
                  >
                    No orders for this period
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-[#FCF8F3] transition-colors"
                  >
                    <td className="p-4 text-[13px] font-bold text-[#333333]">
                      {order.id}
                    </td>
                    <td className="p-4 text-[14px] font-medium text-[#616161]">
                      {order.customer}
                    </td>
                    <td className="p-4 text-[13px] text-[#898989]">
                      {order.date}
                    </td>
                    <td className="p-4 text-[13px] text-[#333333] text-right font-medium">
                      {order.items}
                    </td>
                    <td className="p-4 text-[13px] font-bold text-[#333333] text-right">
                      Rs. {order.amount.toLocaleString()}
                    </td>
                    <td className="p-4">{getStatusBadge(order.status)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
