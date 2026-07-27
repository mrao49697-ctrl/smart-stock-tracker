"use client"

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Menu } from 'lucide-react'

export function StoreCategoryNav() {
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('category')

  const categories = [
    { name: 'Electronics', href: '/store?category=Electronics' },
    { name: 'Wearables', href: '/store?category=Wearables' },
    { name: 'Furniture', href: '/store?category=Furniture' },
    { name: 'Gaming', href: '/store?category=Gaming' },
    { name: 'Displays', href: '/store?category=Displays' },
  ]

  return (
    <nav className="flex items-center gap-6 text-sm font-medium py-2 overflow-x-auto whitespace-nowrap hide-scrollbar">
      <Link href="/store" className={`flex items-center gap-2 transition-colors ${!currentCategory ? 'text-orange-500 font-bold' : 'text-foreground/70 hover:text-orange-500'}`}>
        <Menu className="w-4 h-4"/> All Products
      </Link>
      
      {categories.map(cat => (
        <Link 
          key={cat.name} 
          href={cat.href} 
          className={`transition-colors ${currentCategory === cat.name ? 'text-orange-500 font-bold' : 'text-foreground/70 hover:text-orange-500'}`}
        >
          {cat.name}
        </Link>
      ))}
      
      <Link 
        href="/store?category=Flash Sale" 
        className={`transition-colors ${currentCategory === 'Flash Sale' ? 'text-orange-500 font-bold' : 'text-orange-500 hover:text-orange-600 font-bold'}`}
      >
        Flash Sale
      </Link>
    </nav>
  )
}
