
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";

const Layout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <div className="flex items-center bg-white shadow-sm lg:hidden">
          <MobileNav />
          <h1 className="text-xl font-bold text-tailor-700 p-4 flex-1 text-center">
            Tailor Task Track
          </h1>
        </div>
        <Navbar />
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
