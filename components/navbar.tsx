"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./mode-toggle";
import { useTheme } from "next-themes";
import {
  Menu,
  X,
  LogIn,
  CreditCard,
  MessageSquare,
  Home,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthContext } from "@/hooks/authContext";
import { AnimatedTooltip } from "./ui/animatedToolTip";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/firebase";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const { isLoggedIn, user, logout, setIsLoggedIn, login } = useAuthContext();
  const { theme } = useTheme();
  const router = useRouter();

  const navigation = (route: string) => {
    if (route === "/logout") {
      logout();
      router.push("/login");
      return;
    }
    router.push(route);
  };
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        await setIsLoggedIn(true);
        const idToken = await user.getIdToken();
        const userData = {
          email: user.email,
          name: user.displayName,
          photo: user.photoURL,
          token: idToken,
          provider: "google",
        };
        login(userData);
      } else {
        setIsLoggedIn(false);
      }
      setIsAuthLoading(false);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      unsubscribe();
    };
  }, []);

  const navLinks = [
    ...(isHomePage
      ? []
      : [{ name: "Home", href: "/", icon: <Home className="h-4 w-4 mr-1" /> }]),
    {
      name: "Pricing",
      href: "/pricing",
      icon: <CreditCard className="h-4 w-4 mr-1" />,
    },
    {
      name: "Feedback",
      href: "/feedback",
      icon: <MessageSquare className="h-4 w-4 mr-1" />,
    },
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled
          ? "bg-background/90 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigation("/")} className="text-2xl font-bold">
          <motion.span
            className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
          >
            ATS Optimizer
          </motion.span>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <AnimatePresence mode="wait">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, delay: 0.1 * (index + 1) }}
              >
                <button
                  onClick={() => navigation(link.href)}
                  className="text-foreground/80 hover:text-primary transition-colors flex items-center group"
                >
                  <motion.span
                    className="flex items-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    {link.icon}
                    {link.name}
                    <motion.div
                      className="h-0.5 w-0 bg-primary absolute bottom-0 left-0 right-0 mx-auto"
                      initial={{ width: 0 }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.span>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {!isAuthLoading && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              <Button
                asChild
                variant="outline"
                size="sm"
                className={`flex items-center hover:cursor-pointer gap-1 hover:bg-grey-700 hover:text-white ${
                  theme !== "dark" && "hover:text-primary"
                } transition-all duration-300`}
                onClick={() => navigation(isLoggedIn ? "/logout" : "/login")}
              >
                {isLoggedIn ? (
                  <span>
                    <AnimatedTooltip id={1} name="Logout">
                      <img
                        src={user?.photo}
                        alt="User Profile"
                        className="h-7 w-7 mr-1 rounded-full"
                      />
                    </AnimatedTooltip>
                  </span>
                ) : (
                  <span>
                    <LogIn className="h-4 w-4 mr-1" />
                    Login / Signup
                  </span>
                )}
              </Button>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
          >
            <ModeToggle />
          </motion.div>
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <ModeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-background/95 backdrop-blur-md shadow-md"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-foreground/80 hover:text-primary py-2 transition-colors flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.icon}
                  <span className="ml-2">{link.name}</span>
                </Link>
              ))}
              {!isAuthLoading && (
                <Link
                  href={isLoggedIn ? "/logout" : "/login"}
                  className="text-foreground/80 hover:text-primary py-2 transition-colors flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {isLoggedIn ? (
                    <>
                      <LogOut className="h-4 w-4" />
                      <span className="ml-4">Logout</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="h-4 w-4" />
                      <span className="ml-2">Login / Signup</span>
                    </>
                  )}
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
