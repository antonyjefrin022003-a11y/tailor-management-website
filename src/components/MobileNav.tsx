
import React, { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useLanguage } from "../contexts/LanguageContext";
import { Home, Users, Calendar, FileText, CreditCard, Settings } from "lucide-react";

const MobileNav: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const navItems = [
    { path: "/", label: t("dashboard"), icon: <Home className="mr-3 h-5 w-5" /> },
    { path: "/employees", label: t("employees"), icon: <Users className="mr-3 h-5 w-5" /> },
    { path: "/tasks", label: t("tasks"), icon: <Calendar className="mr-3 h-5 w-5" /> },
    { path: "/reports", label: t("reports"), icon: <FileText className="mr-3 h-5 w-5" /> },
    { path: "/payments", label: t("payments"), icon: <CreditCard className="mr-3 h-5 w-5" /> },
    { path: "/settings", label: t("settings"), icon: <Settings className="mr-3 h-5 w-5" /> },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="mr-2">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <div className="px-2 py-6">
          <h2 className="text-lg font-bold text-tailor-800 dark:text-tailor-200 mb-6">Tailor Task Track</h2>
          <nav>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center px-4 py-2 text-muted-foreground hover:bg-tailor-50 dark:hover:bg-tailor-950/60 hover:text-tailor-700 dark:hover:text-tailor-300 rounded-md transition-colors",
                      location.pathname === item.path &&
                        "bg-tailor-50 dark:bg-tailor-950/60 text-tailor-700 dark:text-tailor-300 font-medium"
                    )}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
