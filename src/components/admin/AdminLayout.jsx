import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  BarChart,
  Settings,
  LogOut,
  Mail,
  Newspaper,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { logoutUser } from "../../firebase/auth";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/config";

const AdminLayout = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const q = query(
      collection(db, "contacts"),
      where("status", "==", "unread"),
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUnreadCount(snapshot.size);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem("furniro_demo_admin");
    await logoutUser();
    navigate("/auth/login");
  };

  const navLinks = [
    {
      name: "Overview",
      path: "/admin",
      icon: <LayoutDashboard size={18} />,
      exact: true,
    },
    { name: "Products", path: "/admin/products", icon: <Package size={18} /> },
    {
      name: "Inventory",
      path: "/admin/inventory",
      icon: <Package size={18} />,
    },
    { name: "Orders", path: "/admin/orders", icon: <ShoppingCart size={18} /> },
    { name: "Customers", path: "/admin/customers", icon: <Users size={18} /> },
    { name: "Discounts", path: "/admin/discounts", icon: <Tag size={18} /> },
    {
      name: "Analytics",
      path: "/admin/analytics",
      icon: <BarChart size={18} />,
    },
    { name: "Settings", path: "/admin/settings", icon: <Settings size={18} /> },
  ];

  const supportLinks = [
    {
      name: "Contacts",
      path: "/admin/contacts",
      icon: <Mail size={18} />,
      badge: unreadCount > 0 ? unreadCount : null,
    },
    {
      name: "Newsletter",
      path: "/admin/newsletter",
      icon: <Newspaper size={18} />,
    },
  ];

  return (
    <div className="flex h-screen bg-[#F4F5F7] font-['Poppins']">
      {/* Sidebar - 200px fixed width, White bg, Right border */}
      <aside className="w-[200px] bg-white border-r-[0.5px] border-[#E5E7EB] flex flex-col hidden md:flex">
        {/* Logo Area */}
        <div className="p-4 pt-4 pb-4 border-b-[0.5px] border-[#E5E7EB]">
          <h1 className="text-xl font-bold text-[#333333]">Funiro.</h1>
          <p className="text-[10px] text-[#898989] uppercase tracking-wider mt-1">
            Admin Panel
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 no-scrollbar">
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.name}>
                <NavLink
                  to={link.path}
                  end={link.exact}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 text-[13px] transition-colors duration-200 ${
                      isActive
                        ? "text-[#333333] bg-[#F4F5F7] font-medium border-l-2 border-[#B88E2F]"
                        : "text-[#898989] hover:bg-[#F4F5F7] border-l-2 border-transparent"
                    }`
                  }
                >
                  {link.icon}
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Support Section */}
          <div className="mt-4 pt-4 border-t-[0.5px] border-[#E5E7EB]">
            <p className="px-4 pb-2 text-[10px] font-bold text-[#898989] uppercase tracking-wider">
              Support
            </p>
            <ul className="flex flex-col gap-1">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2 text-[13px] transition-colors duration-200 ${
                        isActive
                          ? "text-[#333333] bg-[#F4F5F7] font-medium border-l-2 border-[#B88E2F]"
                          : "text-[#898989] hover:bg-[#F4F5F7] border-l-2 border-transparent"
                      }`
                    }
                  >
                    {link.icon}
                    <span className="flex-1">{link.name}</span>
                    {link.badge && (
                      <span className="bg-[#A32D2D] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                        {link.badge > 99 ? "99+" : link.badge}
                      </span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Bottom Profile / Logout */}
        <div className="p-4 border-t-[0.5px] border-[#E5E7EB]">
          <div className="mb-4">
            <p className="text-[12px] font-medium text-[#333333] truncate">
              {currentUser?.displayName || "Admin User"}
            </p>
            <p className="text-[10px] text-[#898989] truncate">
              {currentUser?.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-[13px] text-red-600 hover:text-red-700 transition-colors w-full"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header (Hidden on Desktop) */}
        <header className="md:hidden bg-white h-14 border-b-[0.5px] border-[#E5E7EB] flex items-center justify-between px-4">
          <h1 className="font-bold text-[#333333]">Funiro Admin</h1>
          {/* Mobile menu toggle would go here */}
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {" "}
          {/* 20px padding as per guidelines */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
