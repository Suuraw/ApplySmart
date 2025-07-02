"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FcGoogle } from "react-icons/fc";
import { ArrowLeft, Loader2, GraduationCap } from "lucide-react";
import MinimalFooter from "@/components/minimal-footer";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { useRouter } from "next/navigation";
import ErrorPopup from "@/components/ErrorTemplate";
import { useAuthContext } from "@/hooks/authContext";
import authenticateUsers from "@/services/auth";
import { Provider } from "@radix-ui/react-toast";
export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const router = useRouter();
  const { login } = useAuthContext();
  const authenticateUser = new authenticateUsers();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, redirect to home
        router.push("/");
      }
    });

    return () => unsubscribe();
  }, [router]);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    const userData = {
      email: loginEmail,
      password: loginPassword,
      photo: "https://img.icons8.com/color/48/neko-boy.png",
      provider: "local",
    };

    const response = await authenticateUser.localLogin(userData, "login");
    setTimeout(() => {
      setIsLoading(false);
      // Redirect or show success message
      router.push("/");
    }, 1500);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      const authProvider = await new GoogleAuthProvider();
      const result = await signInWithPopup(auth, authProvider);
      // const credentials = GoogleAuthProvider.credentialFromResult(result);
      const user = result.user;
      const idToken = await user.getIdToken();

      console.log(user);
      const userData = {
        email: user.email,
        name: user.displayName,
        photo: user.photoURL,
        token: idToken,
        provider: "google",
      };
      const endpoint = "login";
      login(userData);
      const responseData = await authenticateUser.loginFirebase(
        userData,
        endpoint
      );
      console.log("Backend data : ", responseData);
      console.log(userData.photo);
      router.replace("/");
    } catch (error) {
      setIsLoading(false);
      setErrorMessage("Error signing in with Google");
      setShowError(true);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <>
      {showError && (
        <ErrorPopup
          message={errorMessage}
          onClose={setShowError}
          isVisible={showError}
        />
      )}
      <div className="container mx-auto px-4 py-32 min-h-screen flex flex-col">
        <div className="flex-grow flex flex-col items-center justify-center relative">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
            <motion.div
              className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />
            <motion.div
              className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0.7, 0.5],
              }}
              transition={{
                duration: 10,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />
          </div>

          <div className="w-full max-w-md">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="mb-8"
            >
              <motion.div variants={itemVariants}>
                <Button variant="ghost" asChild className="mb-8 group">
                  <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Back to Home
                  </Link>
                </Button>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex justify-center mb-6"
              >
                <motion.div
                  className="bg-primary/10 p-3 rounded-full"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <GraduationCap className="h-12 w-12 text-primary" />
                </motion.div>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="text-3xl font-bold text-center mb-2"
              >
                Welcome to{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                  ATS Optimizer
                </span>
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="text-muted-foreground text-center"
              >
                Login or create an account to get started
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>

                  <TabsContent value="login">
                    <Card className="border-primary/20">
                      <CardHeader>
                        <CardTitle>Login</CardTitle>
                        <CardDescription>
                          Enter your credentials to access your account
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <form onSubmit={handleLogin} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="name@example.com"
                              value={loginEmail}
                              onChange={(e) => setLoginEmail(e.target.value)}
                              required
                              className="transition-all duration-300 focus:ring-2 focus:ring-primary"
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="password">Password</Label>
                              <Link
                                href="#"
                                className="text-sm text-primary hover:underline"
                              >
                                Forgot password?
                              </Link>
                            </div>
                            <Input
                              id="password"
                              type="password"
                              value={loginPassword}
                              onChange={(e) => setLoginPassword(e.target.value)}
                              required
                              className="transition-all duration-300 focus:ring-2 focus:ring-primary"
                            />
                          </div>
                          <motion.div
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              type="submit"
                              className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Logging in...
                                </>
                              ) : (
                                "Login"
                              )}
                            </Button>
                          </motion.div>
                        </form>

                        <div className="relative my-4">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                              Or continue with
                            </span>
                          </div>
                        </div>

                        <motion.div
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            variant="outline"
                            className="w-full border-2 hover:bg-muted/50 transition-all duration-300"
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                          >
                            <FcGoogle className="mr-2 h-5 w-5" />
                            Google
                          </Button>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="signup">
                    <Card className="border-primary/20">
                      <CardHeader>
                        <CardTitle>Create an account</CardTitle>
                        <CardDescription>
                          Enter your information to create an account
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <form onSubmit={handleSignup} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                              id="name"
                              placeholder="John Doe"
                              value={signupName}
                              onChange={(e) => setSignupName(e.target.value)}
                              required
                              className="transition-all duration-300 focus:ring-2 focus:ring-primary"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="signup-email">Email</Label>
                            <Input
                              id="signup-email"
                              type="email"
                              placeholder="name@example.com"
                              value={signupEmail}
                              onChange={(e) => setSignupEmail(e.target.value)}
                              required
                              className="transition-all duration-300 focus:ring-2 focus:ring-primary"
                            />
                            <motion.p
                              className="text-xs text-primary font-medium"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.5 }}
                            >
                              💡 Pro Tip: Use a college email for 2 free
                              attempts!
                            </motion.p>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="signup-password">Password</Label>
                            <Input
                              id="signup-password"
                              type="password"
                              value={signupPassword}
                              onChange={(e) =>
                                setSignupPassword(e.target.value)
                              }
                              required
                              className="transition-all duration-300 focus:ring-2 focus:ring-primary"
                            />
                          </div>
                          <motion.div
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              type="submit"
                              className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Creating account...
                                </>
                              ) : (
                                "Create Account"
                              )}
                            </Button>
                          </motion.div>
                        </form>

                        <div className="relative my-4">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                              Or continue with
                            </span>
                          </div>
                        </div>

                        <motion.div
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            variant="outline"
                            className="w-full border-2 hover:bg-muted/50 transition-all duration-300"
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                          >
                            <FcGoogle className="mr-2 h-5 w-5" />
                            Google
                          </Button>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <MinimalFooter />
      </div>
    </>
  );
}
