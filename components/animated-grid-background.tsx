"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export default function AnimatedGridBackground() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isDark = resolvedTheme === "dark"

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0 bg-grid-pattern animate-grid-movement opacity-[0.15] dark:opacity-[0.07]"
        style={{
          backgroundSize: "50px 50px",
          backgroundImage: `linear-gradient(to right, ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"} 1px, transparent 1px), 
                           linear-gradient(to bottom, ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"} 1px, transparent 1px)`,
        }}
      />

      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-primary/5 via-primary/[0.02] to-transparent dark:from-primary/10 dark:via-primary/[0.05]" />

      <div className="absolute -top-[40%] -left-[10%] w-[70%] h-[70%] rounded-full bg-primary/5 blur-[100px] dark:bg-primary/10" />
      <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-purple-500/5 blur-[100px] dark:bg-purple-500/10" />
    </div>
  )
}

