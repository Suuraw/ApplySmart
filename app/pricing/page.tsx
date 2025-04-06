"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, ArrowRight, Zap, Star, GraduationCap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import MinimalFooter from "@/components/minimal-footer"

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  }

  // Define base plans
  const basePlans = [
    {
      name: "Free",
      description: "For college students and new users",
      monthlyPrice: "Free",
      yearlyPrice: "Free",
      features: [
        "2 free attempts with college email",
        "Basic ATS score analysis",
        "Resume keyword suggestions",
        "Limited chat assistant",
      ],
      icon: <GraduationCap className="h-5 w-5 text-blue-500" />,
      color: "blue",
      popular: false,
    },
    {
      name: "Standard",
      description: "For job seekers with multiple applications",
      monthlyPrice: "₹10",
      yearlyPrice: "₹96",
      monthlyPriceDetail: "per request",
      yearlyPriceDetail: "per year",
      features: [
        "Unlimited resume analyses",
        "Detailed ATS compatibility score",
        "Advanced keyword optimization",
        "Full chat assistant access",
        "Job form automation",
        "Email support",
      ],
      icon: <Zap className="h-5 w-5 text-primary" />,
      color: "primary",
      popular: true,
    },
    {
      name: "Premium",
      description: "For professionals seeking the best results",
      monthlyPrice: "₹50",
      yearlyPrice: "₹480",
      monthlyPriceDetail: "per request",
      yearlyPriceDetail: "per year",
      features: [
        "Everything in Standard",
        "Priority processing",
        "Industry-specific optimization",
        "Custom cover letter generation",
        "Interview preparation tips",
        "Priority email & chat support",
      ],
      icon: <Star className="h-5 w-5 text-amber-500" />,
      color: "amber",
      popular: false,
    },
  ]

  // Get current plans based on billing cycle
  const plans = basePlans.map((plan) => ({
    ...plan,
    price: billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice,
    priceDetail: billingCycle === "monthly" ? plan.monthlyPriceDetail : plan.yearlyPriceDetail,
  }))

  return (
    <div className="container mx-auto px-4 py-32 min-h-screen flex flex-col">
      <div className="flex-grow">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.div variants={itemVariants} className="flex justify-center mb-6">
            <motion.div
              className="bg-primary/10 p-3 rounded-full"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <GraduationCap className="h-12 w-12 text-primary" />
            </motion.div>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-4xl font-bold mb-4">
            Student-Friendly{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">Pricing</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="text-xl text-muted-foreground mb-8">
            Choose the plan that works best for your college and career needs
          </motion.p>

          <motion.div variants={itemVariants} className="inline-flex items-center p-1 bg-muted rounded-lg">
            <Button
              variant={billingCycle === "monthly" ? "default" : "ghost"}
              size="sm"
              onClick={() => setBillingCycle("monthly")}
              className="relative"
            >
              Monthly
              {billingCycle === "monthly" && (
                <motion.div
                  layoutId="billingTabHighlight"
                  className="absolute inset-0 bg-primary rounded-md -z-10"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
            </Button>
            <Button
              variant={billingCycle === "yearly" ? "default" : "ghost"}
              size="sm"
              onClick={() => setBillingCycle("yearly")}
              className="relative"
            >
              Yearly
              {billingCycle === "yearly" && (
                <motion.div
                  layoutId="billingTabHighlight"
                  className="absolute inset-0 bg-primary rounded-md -z-10"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
              <Badge className="ml-2 bg-primary text-white border-none">Save 20%</Badge>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              variants={itemVariants}
              className="flex"
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{
                y: -10,
                transition: { duration: 0.3 },
              }}
            >
              <Card
                className={`flex flex-col w-full relative ${plan.popular ? "border-primary shadow-lg" : ""} transition-all duration-300 hover:shadow-xl`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                    <Badge className="bg-primary text-white">Most Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    {plan.icon}
                    <CardTitle>{plan.name}</CardTitle>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="mb-6">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    {plan.priceDetail && <span className="text-muted-foreground ml-1">{plan.priceDetail}</span>}
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <Check className={`h-5 w-5 text-${plan.color}-500 mr-2 shrink-0`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full">
                    <Button
                      className={`w-full ${plan.popular ? "bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90" : "bg-muted-foreground/80 hover:bg-muted-foreground"}`}
                      asChild
                    >
                      <Link href="/login">
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </motion.div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <h2 className="text-2xl font-bold mb-4">Special Discounts for Student Groups</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Are you part of a student organization or placement cell? Contact us for special group rates and campus-wide
            solutions.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button asChild variant="outline" className="border-2 hover:bg-primary/10 transition-all duration-300">
              <Link href="/feedback">Contact for Group Rates</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      <MinimalFooter />
    </div>
  )
}

