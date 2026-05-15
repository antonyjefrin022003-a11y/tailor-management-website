
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import PageTransition from "./PageTransition";

const Layout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-muted/40 dark:bg-background transition-theme">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center bg-card shadow-sm lg:hidden border-b transition-theme">
          <MobileNav />
          <h1 className="text-xl font-bold text-tailor-700 dark:text-tailor-300 p-4 flex-1 text-center">
            Tailor Task Track
          </h1>
        </div>
        <Navbar />
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <AnimatePresence mode="wait">
            <PageTransition key={location.pathname}>
              <Outlet />
            </PageTransition>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Layout;
