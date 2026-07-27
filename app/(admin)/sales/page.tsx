"use client"
import { useState, useEffect } from 'react'
import { Plus, Search, ShoppingCart, X, Package } from 'lucide-react'
import { supabase, Sale, Product } from '@/lib/supabase'

export default function Sales() {
  const [sales, setSales] = useState<Sale[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Form State
  const [selectedProductId, setSelectedProductId] = useState('')
  const [quantity, setQuantity] = useState(1)

  const fetchData = async () => {
    setLoading(true)
    
    // Fetch Sales with joined Products
    const { data: salesData, error: salesError } = await supabase
      .from('sales')
      .select('*, products(name, sku)')
      .order('created_at', { ascending: false })
      
    // Fetch active products for the dropdown
    const { data: productsData } = await supabase
      .from('products')
      .select('*')
      .gt('quantity', 0) // only products in stock

    if (salesData) setSales(salesData as any)
    if (productsData) {
      setProducts(productsData)
      if (productsData.length > 0) setSelectedProductId(productsData[0].id)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const selectedProduct = products.find(p => p.id === selectedProductId)
  const totalPrice = selectedProduct ? selectedProduct.price * quantity : 0

  const handleRecordSale = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProduct) return
    
    if (quantity > selectedProduct.quantity) {
      alert(`Cannot sell ${quantity}. Only ${selectedProduct.quantity} in stock!`)
      return
    }

    // 1. Record Sale
    const { error: saleError } = await supabase.from('sales').insert([{
      product_id: selectedProductId,
      quantity,
      total_price: totalPrice
    }])
    
    if (saleError) {
      alert("Error recording sale: " + saleError.message)
      return
    }

    // 2. Deduct from Inventory
    const newQuantity = selectedProduct.quantity - quantity
    const status = newQuantity === 0 ? 'Out of Stock' : newQuantity < 10 ? 'Low Stock' : 'In Stock'
    
    await supabase.from('products').update({ 
      quantity: newQuantity,
      status
    }).eq('id', selectedProductId)

    setIsModalOpen(false)
    setQuantity(1)
    fetchData() // refresh data
  }

  const handleDelete = async (id: string) => {
    if(confirm("Are you sure you want to delete this sale record? (Inventory won't be restored)")) {
      await supabase.from('sales').delete().eq('id', id)
      fetchData()
    }
  }

  const filteredSales = sales.filter(s => 
    s.products?.name.toLowerCase().includes(search.toLowerCase()) || 
    s.products?.sku.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales History</h1>
          <p className="text-foreground/60">Record new sales and track revenue.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium flex items-center gap-2 hover:opacity-90 transition-opacity w-fit"
        >
          <ShoppingCart className="w-5 h-5" />
          Record Sale
        </button>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
            <input 
              type="text" 
              placeholder="Search sales by product name or SKU..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-foreground/5 border border-transparent focus:border-primary/50 focus:bg-background outline-none rounded-xl py-2 pl-10 pr-4 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-foreground/5 text-foreground/70">
              <tr>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Product</th>
                <th className="p-4 font-medium">SKU</th>
                <th className="p-4 font-medium text-center">Quantity Sold</th>
                <th className="p-4 font-medium text-right">Total Revenue</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-foreground/50">Loading sales...</td></tr>
              ) : filteredSales.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-foreground/50">No sales recorded yet.</td></tr>
              ) : (
                filteredSales.map(sale => (
                  <tr key={sale.id} className="hover:bg-foreground/5 transition-colors">
                    <td className="p-4 text-foreground/60">{new Date(sale.created_at).toLocaleDateString()} {new Date(sale.created_at).toLocaleTimeString()}</td>
                    <td className="p-4 font-medium">{sale.products?.name || 'Unknown'}</td>
                    <td className="p-4 font-mono text-xs text-foreground/60">{sale.products?.sku}</td>
                    <td className="p-4 text-center">
                      <span className="bg-blue-500/10 text-blue-500 px-2 py-1 rounded-md font-bold">{sale.quantity}</span>
                    </td>
                    <td className="p-4 text-right font-bold text-green-500">${sale.total_price.toFixed(2)}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleDelete(sale.id)} className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors text-xs">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Sale Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold">Record New Sale</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-foreground/10 rounded-full transition-colors"><X className="w-5 h-5" /></button>
            </div>
            
            {products.length === 0 ? (
              <div className="p-8 text-center text-foreground/50 flex flex-col items-center gap-2">
                <Package className="w-8 h-8 opacity-50" />
                <p>No products available in stock to sell.</p>
              </div>
            ) : (
              <form onSubmit={handleRecordSale} className="p-4 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-foreground/70 mb-1">Select Product</label>
                  <select 
                    value={selectedProductId} 
                    onChange={e => setSelectedProductId(e.target.value)} 
                    className="w-full bg-foreground/5 border border-border rounded-xl px-3 py-2 outline-none focus:border-primary appearance-none"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.sku}) - ${p.price}</option>
                    ))}
                  </select>
                </div>
                
                {selectedProduct && (
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-sm flex justify-between items-center text-blue-500">
                    <span>Currently in stock: <strong>{selectedProduct.quantity}</strong></span>
                    <span>Price per unit: <strong>${selectedProduct.price.toFixed(2)}</strong></span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-foreground/70 mb-1">Quantity Sold</label>
                  <input 
                    required 
                    type="number" 
                    min="1" 
                    max={selectedProduct?.quantity || 1}
                    value={quantity} 
                    onChange={e => setQuantity(parseInt(e.target.value) || 1)} 
                    className="w-full bg-foreground/5 border border-border rounded-xl px-3 py-2 outline-none focus:border-primary" 
                  />
                </div>
                
                <div className="pt-4 flex items-center justify-between border-t border-border mt-4">
                  <div>
                    <p className="text-xs text-foreground/60">Total Revenue</p>
                    <p className="text-2xl font-bold text-green-500">${totalPrice.toFixed(2)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl hover:bg-foreground/5 font-medium transition-colors">Cancel</button>
                    <button type="submit" className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4" />
                      Checkout
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
