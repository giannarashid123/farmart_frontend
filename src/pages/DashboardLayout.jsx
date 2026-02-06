import React from "react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar />
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        {/* This is where the specific dashboard pages will render */}
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
