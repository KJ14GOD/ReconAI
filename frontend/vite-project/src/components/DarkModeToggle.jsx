// src/components/DarkModeToggle.jsx
import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
    }
    return false
  })

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  return (
    <Button
      variant="outline"
      size="sm"
      className="w-full justify-start"
      onClick={() => setIsDark(prev => !prev)}
    >
      {isDark ? (
        <>
          <Sun className="mr-2 h-4 w-4" /> Light Mode
        </>
      ) : (
        <>
          <Moon className="mr-2 h-4 w-4" /> Dark Mode
        </>
      )}
    </Button>
  )
}
