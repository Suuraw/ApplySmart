"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, FileText, CheckCircle, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/hooks/authContext";
import { auth } from "@/firebase/firebase";
export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const { setIsLoggedIn,login } = useAuthContext();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async(user) => {
      setIsVisible(true);
          if (user) {
            await setIsLoggedIn(true);
            const idToken = await user.getIdToken();
            const userData={
              email:user.email,
              name:user.displayName,
              photo:user.photoURL,
              token:idToken,
              provider:"google"
            }
           login(userData);
          }
        });
      return () => unsubscribe();
  }, []);

  return (
    <section className="pt-24 pb-12 md:pt-32 md:pb-24 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm"
            >
              Optimize your job application process
            </motion.div>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
            >
              <span className="block">Get Past the ATS and</span>{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                Land Your Dream Job
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-lg text-muted-foreground max-w-xl"
            >
              Our AI-powered tools analyze your resume against job descriptions,
              provide personalized suggestions, and automate job application
              forms to save you time and increase your chances of success.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="#ats-score">
                <Button size="lg" className="group">
                  Check ATS Score
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="#job-form">
                <Button size="lg" variant="outline">
                  Automate Job Forms
                </Button>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="flex items-center gap-6 pt-4"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span className="text-sm">ATS Friendly</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <span className="text-sm">Resume Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <span className="text-sm">Time Saving</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative"
          >
            <div className="relative z-10 bg-gradient-to-br from-background via-background/90 to-background/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-border">
              <div className="absolute -z-10 top-0 right-0 h-72 w-72 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute -z-10 bottom-0 left-0 h-72 w-72 bg-purple-500/20 rounded-full blur-3xl" />

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                  </div>
                  <div className="text-sm font-medium">ATS Score Analysis</div>
                </div>

                <div className="space-y-4">
                  <div className="h-8 w-full bg-muted/50 rounded-md animate-pulse" />
                  <div className="h-8 w-3/4 bg-muted/50 rounded-md animate-pulse" />

                  <div className="flex items-center gap-4 mt-8">
                    <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                      <FileText className="h-8 w-8 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-muted/50 rounded-md animate-pulse" />
                      <div className="h-4 w-24 bg-muted/50 rounded-md animate-pulse" />
                    </div>
                  </div>

                  <div className="mt-6 space-y-2">
                    <div className="h-4 w-full bg-muted/50 rounded-md animate-pulse" />
                    <div className="h-4 w-full bg-muted/50 rounded-md animate-pulse" />
                    <div className="h-4 w-3/4 bg-muted/50 rounded-md animate-pulse" />
                  </div>

                  <div className="mt-6">
                    <div className="h-10 w-full bg-primary/20 rounded-md flex items-center justify-center text-primary font-medium">
                      Analyzing Resume...
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-6 h-24 w-24 bg-primary/30 rounded-full blur-2xl" />
            <div className="absolute -top-6 -left-6 h-24 w-24 bg-purple-500/30 rounded-full blur-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
