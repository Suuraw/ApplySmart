"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LogIn, X, GraduationCap } from "lucide-react"
import { useAuthContext } from "@/hooks/authContext"
export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const [showAuthModal, setShowAuthModal] = useState(false)
  
  const router = useRouter()
  const pathname = usePathname()
  const {isLoggedIn,setIsLoggedIn}=useAuthContext();
  // Check if user is on login page or other auth pages
  const isAuthPage = pathname === "/login" || pathname === "/signup"

  useEffect(() => {
    // Check if user is logged in (in a real app, this would check cookies/localStorage/session)
    const checkAuth = () => {
      // For demo purposes, we'll just use localStorage
      const token = localStorage.getItem("auth-token")
      // setIsLoggedIn(!!token)
    }

    checkAuth()
  }, [])

  const handleCloseModal = () => {
    setShowAuthModal(false)
  }

  const handleTryFeature = () => {
    setShowAuthModal(true)
  }

  // If on auth page or logged in, just render children
  if (isAuthPage || isLoggedIn) {
    return <>{children}</>
  }

  return (
    <>
      <div onClick={handleTryFeature}>{children}</div>

      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md"
            >
              <Card className="border-primary/20">
                <CardHeader className="text-center">
                  <Button variant="ghost" size="icon" className="absolute right-2 top-2" onClick={handleCloseModal}>
                    <X className="h-4 w-4" />
                  </Button>

                  <div className="flex justify-center mb-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <GraduationCap className="h-10 w-10 text-primary" />
                    </div>
                  </div>

                  <CardTitle>Login Required</CardTitle>
                  <CardDescription>Please login or create an account to use this feature</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-muted-foreground">
                    Get access to all features including ATS score analysis, job form automation, and more.
                  </p>

                  <div className="bg-primary/5 p-4 rounded-lg">
                    <p className="text-sm font-medium flex items-center justify-center gap-2">
                      <GraduationCap className="h-4 w-4 text-primary" />
                      Students get 2 free attempts with college email!
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                  <Button
                    className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                    onClick={() => router.push("/login")}
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Login / Sign Up
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleCloseModal}>
                    Continue Browsing
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

