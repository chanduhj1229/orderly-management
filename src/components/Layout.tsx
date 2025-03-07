
import { useState, useEffect } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  ClipboardList,
  Package,
  LogOut,
  MenuIcon,
  X
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  
  // Handle sidebar on resize
  useEffect(() => {
    setIsSidebarOpen(!isMobile);
  }, [isMobile]);
  
  // Navigation items with their routes and icons
  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Logs", path: "/logs", icon: ClipboardList },
  ];
  
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Top header */}
      <header className="h-16 flex items-center justify-between px-4 border-b glassmorphism z-20">
        <div className="flex items-center">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="mr-2"
            >
              {isSidebarOpen ? <X size={20} /> : <MenuIcon size={20} />}
            </Button>
          )}
          <Link to="/dashboard" className="flex items-center">
            <Package className="h-6 w-6 text-primary mr-2" />
            <span className="font-bold text-lg">OMS</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-2">
          {user && (
            <div className="text-sm text-muted-foreground mr-2">
              {user.name}
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="text-muted-foreground hover:text-destructive"
          >
            <LogOut size={18} />
          </Button>
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.aside
              initial={{ x: isMobile ? -240 : 0, opacity: isMobile ? 0 : 1 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: isMobile ? -240 : 0, opacity: isMobile ? 0 : 1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={`w-60 border-r glassmorphism flex flex-col z-10 ${
                isMobile ? "absolute h-[calc(100%-4rem)] top-16 left-0" : "relative"
              }`}
            >
              <nav className="flex-1 py-6 px-3">
                <div className="space-y-1">
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <Link 
                        key={item.path} 
                        to={item.path}
                        className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-all group ${
                          isActive 
                            ? "bg-primary text-white" 
                            : "text-muted-foreground hover:bg-secondary"
                        }`}
                      >
                        <item.icon className={`mr-2 h-4 w-4 ${
                          isActive ? "text-white" : "text-muted-foreground group-hover:text-foreground"
                        }`} />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </nav>
              
              <div className="p-4 border-t">
                <div className="text-xs text-muted-foreground">
                  Order Management System v1.0
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
        
        {/* Main content */}
        <main className="flex-1 overflow-auto bg-gradient-to-b from-background to-secondary/30">
          <div className="container py-6 px-4 md:px-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
