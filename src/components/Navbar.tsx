
import React from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Settings, Sun, Moon } from "lucide-react";
import { toast } from "sonner";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();

  const initials = user?.email ? user.email[0].toUpperCase() : "U";
  const isDark = theme === "dark";

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch {
      toast.error("Failed to sign out");
    }
  };

  return (
    <div className="border-b bg-card transition-theme">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        <div className="hidden md:block">
          <h2 className="text-lg font-semibold text-foreground">Tailor Task Track</h2>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-sm text-muted-foreground hidden sm:block">
            {user?.email}
          </div>

          {/* Dark mode toggle */}
          <motion.div whileTap={{ scale: 0.88 }} whileHover={{ scale: 1.08 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="relative overflow-hidden rounded-full w-9 h-9"
              aria-label="Toggle dark mode"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isDark ? (
                  <motion.span
                    key="sun"
                    initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.22, ease: "easeInOut" }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Sun className="h-5 w-5 text-amber-400" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="moon"
                    initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.22, ease: "easeInOut" }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Moon className="h-5 w-5 text-tailor-600" />
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}>
                <Avatar className="cursor-pointer h-9 w-9">
                  <AvatarFallback className="bg-tailor-100 text-tailor-700 font-semibold dark:bg-tailor-900 dark:text-tailor-300">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="text-xs text-muted-foreground font-normal truncate">
                {user?.email}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-red-600 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
