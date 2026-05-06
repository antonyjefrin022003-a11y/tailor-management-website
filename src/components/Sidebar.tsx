
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { Home, Users, Calendar, FileText, CreditCard, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const Sidebar: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();

  const navItems = [
    { path: "/", label: t("dashboard"), icon: <Home className="mr-3 h-5 w-5" /> },
    { path: "/employees", label: t("employees"), icon: <Users className="mr-3 h-5 w-5" /> },
    { path: "/tasks", label: t("tasks"), icon: <Calendar className="mr-3 h-5 w-5" /> },
    { path: "/reports", label: t("reports"), icon: <FileText className="mr-3 h-5 w-5" /> },
    { path: "/payments", label: t("payments"), icon: <CreditCard className="mr-3 h-5 w-5" /> },
    { path: "/settings", label: t("settings"), icon: <Settings className="mr-3 h-5 w-5" /> },
  ];

  return (
    <aside className="bg-white w-64 shadow-md hidden lg:block">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-tailor-800">
          Tailor Task
        </h2>
      </div>
      <nav className="mt-6">
        <ul>
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center px-6 py-3 text-gray-600 hover:bg-tailor-50 hover:text-tailor-700",
                  location.pathname === item.path && "bg-tailor-50 text-tailor-700 border-r-4 border-tailor-500"
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
