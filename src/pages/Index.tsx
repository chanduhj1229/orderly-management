
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/40 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center max-w-3xl mx-auto"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          className="mb-6"
        >
          <div className="mb-2 inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
            <span className="mr-1.5 h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            Enterprise Solution
          </div>
        </motion.div>
        
        <motion.h1 
          className="text-5xl md:text-6xl font-bold tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          Order Management
          <span className="text-primary"> System</span>
        </motion.h1>
        
        <motion.p 
          className="mt-6 text-lg md:text-xl text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          A powerful, intuitive platform for managing your product inventory with
          detailed logging and real-time updates.
        </motion.p>
        
        <motion.div 
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7 }}
        >
          <Button 
            size="lg" 
            onClick={() => navigate("/auth")}
            className="relative overflow-hidden group"
          >
            <span className="relative z-10">Get Started</span>
            <span className="absolute inset-0 bg-primary/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => window.open("https://github.com", "_blank")}
            className="bg-background/80 backdrop-blur-sm hover:bg-background/90"
          >
            Learn More
          </Button>
        </motion.div>
      </motion.div>
      
      <motion.div 
        className="mt-20 w-full max-w-5xl glassmorphism rounded-2xl overflow-hidden shadow-xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.8 }}
      >
        <div className="w-full h-[400px] bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center p-6">
          <div className="grid grid-cols-4 gap-6 w-full max-w-4xl">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + i * 0.1, duration: 0.5 }}
                className="h-24 rounded-lg bg-white dark:bg-gray-700 shadow-md flex items-center justify-center"
              >
                <div className="w-16 h-2 bg-gray-200 dark:bg-gray-600 rounded"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
      
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="mt-16 text-center text-sm text-muted-foreground"
      >
        © {new Date().getFullYear()} Order Management System. All rights reserved.
      </motion.footer>
    </div>
  );
};

export default Index;
