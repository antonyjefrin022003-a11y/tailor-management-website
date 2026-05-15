
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";
import { Home, Users, Calendar, FileText, CreditCard, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = (t: (k: string) => string) => [
  { path: "/", label: t("dashboard"), icon: Home },
  { path: "/employees", label: t("employees"), icon: Users },
  { path: "/tasks", label: t("tasks"), icon: Calendar },
  { path: "/reports", label: t("reports"), icon: FileText },
  { path: "/payments", label: t("payments"), icon: CreditCard },
  { path: "/settings", label: t("settings"), icon: Settings },
];

const sidebarVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 380, damping: 28 } },
};

const Sidebar: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const items = navItems(t);

  return (
    <aside className="bg-card w-64 shadow-md hidden lg:block border-r transition-theme">
      <div className="p-6 border-b">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="text-2xl font-bold text-tailor-800 dark:text-tailor-200"
        >
          Tailor Task
        </motion.h2>
      </div>
      <nav className="mt-4">
        <motion.ul variants={sidebarVariants} initial="hidden" animate="show">
          {items.map((item) => {
            const active = location.pathname === item.path ||
              (item.path !== "/" && location.pathname.startsWith(item.path));
            const Icon = item.icon;
            return (
              <motion.li key={item.path} variants={itemVariants}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center px-6 py-3 text-sm font-medium transition-all duration-150 relative group",
                    active
                      ? "bg-tailor-50 text-tailor-700 dark:bg-tailor-950/60 dark:text-tailor-300"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="activeIndicator"
                      className="absolute right-0 top-0 bottom-0 w-1 rounded-l-full bg-tailor-500"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <motion.span
                    whileHover={{ scale: 1.15 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="mr-3"
                  >
                    <Icon className="h-5 w-5" />
                  </motion.span>
                  <span>{item.label}</span>
                </Link>
              </motion.li>
            );
          })}
        </motion.ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
