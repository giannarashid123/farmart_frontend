import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutGrid,
  Box,
  ShoppingBag,
  BarChart3,
  Plus,
  LogOut,
} from "lucide-react";

const FarmerDashboard = () => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/farmer-dashboard", icon: LayoutGrid },
    { name: "Inventory", path: "/farmer-dashboard/inventory", icon: Box },
    { name: "Order", path: "/farmer-dashboard/orders", icon: ShoppingBag },
    { name: "Analytic", path: "/farmer-dashboard/analytics", icon: BarChart3 },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar - Matching your first image */}
      <aside className="w-64 bg-white border-r border-slate-200 fixed h-full p-6 flex flex-col">
        <Link
          to="/farmer-dashboard/add"
          className="flex items-center justify-center gap-2 bg-[#34A832] hover:bg-[#2D8E2B] text-white py-3 rounded-lg font-bold mb-10 shadow-sm transition-all">
          <Plus size={18} /> Add Livestock
        </Link>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${isActive ? "bg-slate-50 text-slate-900 font-bold" : "text-slate-500 hover:text-slate-900"}`}>
                <Icon
                  size={22}
                  className={isActive ? "text-slate-900" : "text-slate-400"}
                />
                <span className="text-[15px]">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <button className="flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-red-500 mt-auto">
          <LogOut size={22} /> <span className="text-[15px]">Logout</span>
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default FarmerDashboard;
