
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

const Auth = () => {
  const navigate = useNavigate();
  const { login, isLoading, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  
  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (authMode === 'signin') {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      }
    } else {
      // Just sign in for demo purposes
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left panel - illustration for desktop */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary/5 to-primary/20 items-center justify-center p-8"
      >
        <div className="text-center max-w-md">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <Package className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">Order Management System</h2>
            <p className="text-muted-foreground">
              A powerful solution for managing your product inventory, with detailed 
              logging and real-time updates.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-12 p-6 bg-white/80 backdrop-blur rounded-xl shadow-lg"
          >
            <div className="space-y-4">
              <div className="h-4 w-2/3 bg-gray-200 rounded mx-auto"></div>
              <div className="h-4 w-1/2 bg-gray-200 rounded mx-auto"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded mx-auto"></div>
              <div className="h-10 w-full bg-primary/20 rounded-md"></div>
            </div>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Right panel - auth form */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex-1 flex items-center justify-center p-8"
      >
        <div className="w-full max-w-md">
          <div className="md:hidden flex items-center justify-center mb-8">
            <Package className="h-10 w-10 text-primary mr-2" />
            <span className="font-bold text-2xl">OMS</span>
          </div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-center mb-8"
          >
            <h1 className="text-2xl font-bold">
              {authMode === 'signin' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-muted-foreground mt-2">
              {authMode === 'signin' 
                ? 'Enter your credentials to access your account' 
                : 'Fill in the details to get started'}
            </p>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              
              {authMode === 'signin' && (
                <div className="text-right">
                  <button
                    type="button"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              )}
              
              <Button
                type="submit"
                className="w-full h-11 mt-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="loader h-5 w-5 border-2 border-current border-t-background"></div>
                ) : (
                  <>
                    {authMode === 'signin' ? 'Sign In' : 'Sign Up'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {authMode === 'signin' 
                  ? "Don't have an account?" 
                  : "Already have an account?"}
                {' '}
                <button
                  type="button"
                  onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                  className="text-primary hover:underline font-medium"
                >
                  {authMode === 'signin' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-8 text-xs text-center text-muted-foreground"
          >
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
