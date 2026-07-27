import Link from 'next/link'
import { ShoppingCart, UserCircle, Search } from 'lucide-react'
import { StoreCategoryNav } from '@/components/StoreCategoryNav'
import { Suspense } from 'react'

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background text-foreground flex flex-col">
      {/* Topmost Banner (Optional small text) */}
      <div className="bg-orange-500 text-white text-xs py-1 text-center font-medium">
        Welcome to StockSathi AI - Enjoy 50% Off on Flash Sales!
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          
          {/* Logo */}
          <Link href="/store" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="font-extrabold text-2xl tracking-tight text-orange-500">StockSathi<span className="text-foreground">Store</span></span>
          </Link>
          
          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4 min-w-[200px] flex">
            <input 
              type="text" 
              placeholder="Search in StockSathi..." 
              className="w-full bg-gray-100 dark:bg-foreground/5 border border-transparent focus:border-orange-500 focus:bg-white dark:focus:bg-background outline-none rounded-l-lg py-2 px-4 transition-all"
            />
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 rounded-r-lg transition-colors flex items-center justify-center">
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-foreground/70 hover:text-orange-500 transition-colors flex flex-col items-center gap-1">
              <UserCircle className="w-6 h-6" />
              <span className="hidden sm:inline text-xs">Login</span>
            </Link>
          </div>
        </div>

        {/* Secondary Category Nav */}
        <div className="border-t border-border bg-white dark:bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Suspense fallback={<div className="py-2 h-9" />}>
              <StoreCategoryNav />
            </Suspense>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-white dark:bg-card border-t border-border mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
          <div>
            <h4 className="font-bold mb-4 text-orange-500">Customer Care</h4>
            <ul className="space-y-2 text-foreground/60">
              <li>Help Center</li>
              <li>How to Buy</li>
              <li>Returns & Refunds</li>
              <li>Contact Us</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-orange-500">StockSathi Store</h4>
            <ul className="space-y-2 text-foreground/60">
              <li>About Us</li>
              <li>Careers</li>
              <li>Terms & Conditions</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <h4 className="font-bold mb-4 text-orange-500">Download Our App</h4>
            <div className="flex gap-4">
              <div className="w-32 h-10 bg-gray-200 dark:bg-foreground/10 rounded flex items-center justify-center text-xs font-bold text-foreground/40">App Store</div>
              <div className="w-32 h-10 bg-gray-200 dark:bg-foreground/10 rounded flex items-center justify-center text-xs font-bold text-foreground/40">Google Play</div>
            </div>
          </div>
        </div>
        <div className="bg-gray-100 dark:bg-foreground/5 py-4 text-center text-xs text-foreground/50">
          <p>© {new Date().getFullYear()} StockSathi AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
