"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "react-router-dom"
import { ArrowRight, Mail, Lock, CircleUser, Loader2, Eye, EyeOff, Menu, X } from 'lucide-react'
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/[0.1]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <CircleUser className="h-6 w-6 text-white" />
            <span className="text-xl font-bold text-white">ReconAI</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/features" className="text-zinc-400 hover:text-white transition-colors">
              Features
            </Link>
            <Link to="/pricing" className="text-zinc-400 hover:text-white transition-colors">
              Pricing
            </Link>
            <Link to="/about" className="text-zinc-400 hover:text-white transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-zinc-400 hover:text-white transition-colors">
              Contact
            </Link>
          </div>

          <button
            className="md:hidden text-zinc-400 hover:text-white transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <motion.div
          initial={false}
          animate={{ height: isMenuOpen ? "auto" : 0 }}
          className="md:hidden overflow-hidden"
        >
          <div className="py-4 space-y-4">
            <Link to="/features" className="block text-zinc-400 hover:text-white transition-colors">
              Features
            </Link>
            <Link to="/pricing" className="block text-zinc-400 hover:text-white transition-colors">
              Pricing
            </Link>
            <Link to="/about" className="block text-zinc-400 hover:text-white transition-colors">
              About
            </Link>
            <Link to="/contact" className="block text-zinc-400 hover:text-white transition-colors">
              Contact
            </Link>
          </div>
        </motion.div>
      </div>
    </nav>
  )
}

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1500)
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-black">
      <Navbar />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/[0.02] via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMCAwdjZoNnYtNmgtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-1/3 h-screen bg-gradient-to-b from-white/[0.03] to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-screen bg-gradient-to-t from-white/[0.03] to-transparent"></div>
      </div>

      <div className="container px-4 md:px-6 z-10 mt-16">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center max-w-6xl mx-auto">
          {/* Left side - Branding and illustration */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center space-y-4 text-center lg:text-left lg:pr-8"
          >
            <div className="space-y-2 mb-8">
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-block p-3 bg-white/[0.05] rounded-xl mb-4 backdrop-blur-sm border border-white/[0.1]"
              >
                <CircleUser className="h-8 w-8 text-white" />
              </motion.div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-white">
                Welcome <span className="inline-block border-b-2 border-white pb-1">Back</span>
              </h1>
              <p className="max-w-[600px] text-zinc-400 md:text-xl">
                Sign in to continue your journey with our platform.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              {[
                { title: "AI-Powered Matching", description: "Automatically reconcile transactions" },
                { title: "Real-Time Insights", description: "Instantly view matched, unmatched, and flagged entries" },
                { title: "Interactive Dashboard", description: "Visualize trends, anomalies, and metrics in one place" },
                { title: "Secure Audit Logs", description: "Track every change with robust logging and version control" },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-4 rounded-lg bg-white/[0.02] backdrop-blur-sm border border-white/[0.1] transition-all duration-300 hover:bg-white/[0.05] hover:scale-[1.02] hover:shadow-lg hover:shadow-white/[0.05]"
                >
                  <h3 className="font-medium text-white mb-1">{feature.title}</h3>
                  <p className="text-sm text-zinc-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right side - Login form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto bg-black/50 backdrop-blur-md border-white/[0.1] shadow-2xl hover:shadow-white/[0.05] transition-all duration-300">
              <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-2xl font-bold text-white">Sign In</CardTitle>
                <CardDescription className="text-zinc-400">Enter your credentials to access your account</CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-zinc-300">
                      Email
                    </Label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-27/100 text-zinc-500 h-[18px] w-[18px] transition-colors group-focus-within:text-white" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        className="pl-10 bg-black/50 border-zinc-800 text-white placeholder:text-zinc-500 focus-visible:ring-1 focus-visible:ring-white transition-all duration-200"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-zinc-300">
                        Password
                      </Label>
                      <Link to="/forgot-password" className="text-sm text-zinc-400 hover:text-white transition-colors duration-300">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-27/100 translate-y-[-50%] text-zinc-500 h-4 w-4 transition-colors group-focus-within:text-white" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="enter your password"
                        className="pl-10 pr-10 bg-black/50 border-zinc-800 text-white placeholder:text-zinc-500 focus-visible:ring-1 focus-visible:ring-white transition-all duration-200"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-27/100 translate-y-[-50%] text-zinc-500 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4 pt-4">
                  <Button
                    className="w-full bg-white text-black hover:bg-zinc-200 transition-all duration-300 group relative overflow-hidden"
                    type="submit"
                    disabled={isLoading}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Signing in...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        Sign in
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    )}
                  </Button>
                  <div className="relative my-2">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-zinc-800"></span>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-black/50 px-2 text-zinc-500">Or continue with</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      variant="outline" 
                      className="bg-transparent border-zinc-800 hover:bg-zinc-800/50 text-white transition-all duration-300 group"
                    >
                      <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:scale-110" aria-hidden="true">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                        <path d="M1 1h22v22H1z" fill="none" />
                      </svg>
                      Google
                    </Button>
                    <Button 
                      variant="outline" 
                      className="bg-transparent border-zinc-800 hover:bg-zinc-800/50 text-white transition-all duration-300 group"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="h-5 w-5 mr-2 fill-current transition-transform duration-300 group-hover:scale-110">
                        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                      </svg>
                      Apple
                    </Button>
                  </div>
                  <div className="text-center text-sm text-zinc-500 mt-4">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-white hover:underline font-medium transition-colors duration-300">
                      Sign up
                    </Link>
                  </div>
                </CardFooter>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}