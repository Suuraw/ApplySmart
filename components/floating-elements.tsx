"use client"

import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  FileText,
  GraduationCap,
  Briefcase,
  User,
  Lock,
  CreditCard,
  Coins,
  MessageSquare,
  Award,
  BookOpen,
  Zap,
  Star,
} from "lucide-react"

export default function FloatingElements() {
  const pathname = usePathname()

  // Define different elements for different pages
  const getElements = () => {
    switch (pathname) {
      case "/":
        return [
          { icon: <FileText size={24} />, color: "text-primary", position: "top-[15%] left-[10%]", duration: 8 },
          {
            icon: <GraduationCap size={28} />,
            color: "text-purple-500",
            position: "top-[25%] right-[15%]",
            duration: 12,
          },
          { icon: <Briefcase size={20} />, color: "text-blue-400", position: "bottom-[30%] left-[20%]", duration: 10 },
          { icon: <Award size={22} />, color: "text-amber-500", position: "bottom-[20%] right-[10%]", duration: 9 },
          { icon: <BookOpen size={18} />, color: "text-green-500", position: "top-[40%] left-[25%]", duration: 11 },
          { icon: <Zap size={16} />, color: "text-yellow-500", position: "bottom-[40%] right-[25%]", duration: 7 },
        ]
      case "/login":
        return [
          { icon: <User size={24} />, color: "text-primary", position: "top-[20%] left-[15%]", duration: 9 },
          { icon: <Lock size={20} />, color: "text-blue-400", position: "top-[30%] right-[20%]", duration: 11 },
          {
            icon: <GraduationCap size={28} />,
            color: "text-purple-500",
            position: "bottom-[25%] left-[10%]",
            duration: 10,
          },
          { icon: <Star size={16} />, color: "text-yellow-500", position: "bottom-[35%] right-[15%]", duration: 8 },
        ]
      case "/pricing":
        return [
          { icon: <CreditCard size={24} />, color: "text-primary", position: "top-[15%] left-[10%]", duration: 10 },
          { icon: <Coins size={28} />, color: "text-amber-500", position: "top-[25%] right-[15%]", duration: 12 },
          {
            icon: <GraduationCap size={22} />,
            color: "text-purple-500",
            position: "bottom-[30%] left-[20%]",
            duration: 9,
          },
          { icon: <Star size={18} />, color: "text-yellow-500", position: "bottom-[20%] right-[10%]", duration: 11 },
        ]
      case "/feedback":
        return [
          { icon: <MessageSquare size={24} />, color: "text-primary", position: "top-[20%] left-[15%]", duration: 11 },
          { icon: <User size={20} />, color: "text-blue-400", position: "top-[30%] right-[20%]", duration: 9 },
          {
            icon: <GraduationCap size={26} />,
            color: "text-purple-500",
            position: "bottom-[25%] left-[10%]",
            duration: 12,
          },
          { icon: <Award size={18} />, color: "text-green-500", position: "bottom-[35%] right-[15%]", duration: 10 },
        ]
      default:
        return [
          { icon: <FileText size={24} />, color: "text-primary", position: "top-[15%] left-[10%]", duration: 8 },
          {
            icon: <GraduationCap size={28} />,
            color: "text-purple-500",
            position: "top-[25%] right-[15%]",
            duration: 12,
          },
        ]
    }
  }

  const elements = getElements()

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {elements.map((element, index) => (
        <motion.div
          key={index}
          className={`absolute ${element.position} ${element.color} opacity-20 dark:opacity-30`}
          animate={{
            y: ["0%", "100%", "0%"],
            x: ["0%", "50%", "0%"],
            rotate: [0, 360],
          }}
          transition={{
            duration: element.duration,
            ease: "easeInOut",
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        >
          {element.icon}
        </motion.div>
      ))}
    </div>
  )
}

