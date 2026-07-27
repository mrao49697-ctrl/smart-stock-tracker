"use client"
import { Package, TrendingUp, AlertTriangle, DollarSign, ShoppingCart } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase, Sale } from '@/lib/supabase'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    lowStock: 0,
    totalSales: 0,
    salesCount: 0
  })
  
  const [recentSales, setRecentSales] = useState<Sale[]>([])
  const [topSelling, setTopSelling] = useState<{name: string, sold: number, percentage: number}[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch products
        const { data: productsData } = await supabase.from('products').select('*')
        
        // Fetch sales with product details
        const { data: salesData } = await supabase.from('sales').select('*, products(name)').order('created_at', { ascending: false })
        
        if (productsData && salesData) {
          const totalProducts = productsData.length
          const totalValue = productsData.reduce((acc, item) => acc + (item.price * item.quantity), 0)
          const lowStock = productsData.filter(item => item.quantity < 10).length
          const totalSales = salesData.reduce((acc, sale) => acc + sale.total_price, 0)
          const salesCount = salesData.length
          
          setStats({ totalProducts, totalValue, lowStock, totalSales, salesCount })
          
          // Get 5 recent sales
          setRecentSales(salesData.slice(0, 5) as any)
          
          // Calculate top selling products for chart
          const productSales: Record<string, number> = {}
          let maxSold = 0
          
          salesData.forEach(sale => {
            const name = (sale as any).products?.name || 'Unknown'
            productSales[name] = (productSales[name] || 0) + sale.quantity
            if (productSales[name] > maxSold) maxSold = productSales[name]
          })
          
          const sortedTopSelling = Object.entries(productSales)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, sold]) => ({
              name, 
              sold, 
              percentage: maxSold > 0 ? (sold / maxSold) * 100 : 0
            }))
            
          setTopSelling(sortedTopSelling)
        }
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-foreground/60">Overview of your store's inventory and performance.</p>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center glass-panel rounded-2xl animate-pulse">
          <p className="text-foreground/50">Loading metrics...</p>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <TrendingUp className="w-16 h-16 text-green-500" />
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-green-500/10 text-green-500 rounded-xl">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-foreground/80">Total Revenue</h3>
              </div>
              <p className="text-4xl font-bold">${stats.totalSales.toFixed(2)}</p>
              <p className="text-xs text-foreground/50 mt-2 font-medium">From {stats.salesCount} sales</p>
            </div>

            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <DollarSign className="w-16 h-16 text-blue-500" />
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
                  <DollarSign className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-foreground/80">Inventory Value</h3>
              </div>
              <p className="text-4xl font-bold">${stats.totalValue.toFixed(2)}</p>
              <p className="text-xs text-foreground/50 mt-2 font-medium">Capital currently in stock</p>
            </div>

            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Package className="w-16 h-16 text-purple-500" />
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl">
                  <Package className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-foreground/80">Total Products</h3>
              </div>
              <p className="text-4xl font-bold">{stats.totalProducts}</p>
              <p className="text-xs text-foreground/50 mt-2 font-medium">Unique SKUs in store</p>
            </div>

            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <AlertTriangle className="w-16 h-16 text-orange-500" />
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-orange-500/10 text-orange-500 rounded-xl">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-foreground/80">Low Stock Alerts</h3>
              </div>
              <p className="text-4xl font-bold">{stats.lowStock}</p>
              <p className="text-xs text-foreground/50 mt-2 font-medium">Requires attention</p>
            </div>
          </div>

          {/* Charts & Activity */}
          <div className="grid gap-6 lg:grid-cols-2 mt-8">
            
            {/* Top Selling Chart */}
            <div className="glass-panel p-6 rounded-2xl flex flex-col">
              <h3 className="text-xl font-bold tracking-tight mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Top Selling Products
              </h3>
              
              {topSelling.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-foreground/40 text-sm">
                  No sales data yet to display chart.
                </div>
              ) : (
                <div className="space-y-6 flex-1 flex flex-col justify-center">
                  {topSelling.map((item, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between text-sm font-medium">
                        <span>{item.name}</span>
                        <span className="text-foreground/60">{item.sold} sold</span>
                      </div>
                      <div className="w-full h-3 bg-foreground/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="glass-panel p-6 rounded-2xl flex flex-col">
              <h3 className="text-xl font-bold tracking-tight mb-6 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary" />
                Recent Sales
              </h3>
              
              {recentSales.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-foreground/40 text-sm">
                  No recent sales activity.
                </div>
              ) : (
                <div className="space-y-4">
                  {recentSales.map((sale) => (
                    <div key={sale.id} className="flex items-center justify-between p-4 rounded-xl bg-foreground/5 hover:bg-foreground/10 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center">
                          <DollarSign className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{sale.products?.name || 'Unknown Product'}</p>
                          <p className="text-xs text-foreground/50">Sold {sale.quantity} units</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-500">+${sale.total_price.toFixed(2)}</p>
                        <p className="text-xs text-foreground/40">{new Date(sale.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}