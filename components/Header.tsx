"use client"
import { useTheme } from 'next-themes'
import { Sun, Moon, Bell } from 'lucide-react'
import { Sun, Moon, Bell, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { sidebarLinks } from './Sidebar'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Header() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  return (
    <>
      <header className="h-16 bg-card/50 backdrop-blur-md border-b border-border flex items-center justify-between px-6 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button 
            className="md:hidden p-2 -ml-2 rounded-lg hover:bg-foreground/5 text-foreground/70"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
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

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className="relative w-64 h-full bg-card border-r border-border flex flex-col shadow-2xl animate-in slide-in-from-left">
            <div className="h-16 flex items-center justify-between px-6 border-b border-border">
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">StockSathi AI</h1>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 -mr-2 rounded-lg hover:bg-foreground/5 text-foreground/70"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {sidebarLinks.map((link) => {
                const Icon = link.icon
                const isActive = pathname === link.href
                return (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive 
                      ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' 
                      : 'text-foreground/70 hover:bg-foreground/5 hover:text-foreground'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{link.name}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
