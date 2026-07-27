"use client"
import { useTheme } from 'next-themes'
import { Sun, Moon, Bell } from 'lucide-react'
import { useEffect, useState } from 'react'

export function Header() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="h-16 bg-card/50 backdrop-blur-md border-b border-border flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle would go here */}
        <h2 className="text-lg font-semibold md:hidden">StockSathi AI</h2>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-foreground/5 text-foreground/70 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-card"></span>
        </button>
        
        {mounted && (
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full hover:bg-foreground/5 text-foreground/70 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        )}
        
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-blue-400 ml-2 shadow-sm border border-border"></div>
      </div>
    </header>
  )
}
