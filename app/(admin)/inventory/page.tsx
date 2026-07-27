"use client"
import { useState, useEffect } from 'react'
import { Plus, Search, Edit2, Trash2, X } from 'lucide-react'
import { supabase, Product } from '@/lib/supabase'

export default function Inventory() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Form State
  const [formData, setFormData] = useState({
    name: '', sku: '', category: '', price: 0, quantity: 0, image_url: ''
  })

  const fetchProducts = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    if (error) {
      console.error(error)
    } else if (data) {
      setProducts(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const status = formData.quantity === 0 ? 'Out of Stock' : formData.quantity < 10 ? 'Low Stock' : 'In Stock'
    
    const { error } = await supabase.from('products').insert([{ ...formData, status }])
    
    if (error) {
      alert("Error adding product: " + error.message)
    } else {
      setIsModalOpen(false)
      setFormData({ name: '', sku: '', category: '', price: 0, quantity: 0, image_url: '' })
      fetchProducts()
    }
  }

  const handleDelete = async (id: string) => {
    if(confirm("Are you sure you want to delete this product?")) {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) {
        alert("Error deleting product")
      } else {
        fetchProducts()
      }
    }
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.sku.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-foreground/60">Manage your store's products and stock levels.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium flex items-center gap-2 hover:opacity-90 transition-opacity w-fit"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
            <input 
              type="text" 
              placeholder="Search products by name or SKU..." 
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
                <th className="p-4 font-medium">SKU</th>
                <th className="p-4 font-medium">Product Name</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">Stock</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={7} className="p-8 text-center text-foreground/50">Loading inventory...</td></tr>
              ) : filteredProducts.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-foreground/50">No products found.</td></tr>
              ) : (
                filteredProducts.map(product => (
                  <tr key={product.id} className="hover:bg-foreground/5 transition-colors">
                    <td className="p-4 font-mono text-xs text-foreground/60">{product.sku}</td>
                    <td className="p-4 font-medium">{product.name}</td>
                    <td className="p-4"><span className="bg-foreground/10 px-2 py-1 rounded-md text-xs">{product.category}</span></td>
                    <td className="p-4 font-medium text-primary">${product.price.toFixed(2)}</td>
                    <td className="p-4">{product.quantity}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                        product.status === 'In Stock' ? 'bg-green-500/10 text-green-500' :
                        product.status === 'Low Stock' ? 'bg-orange-500/10 text-orange-500' :
                        'bg-red-500/10 text-red-500'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 hover:bg-blue-500/10 text-blue-500 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(product.id)} className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold">Add New Product</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-foreground/10 rounded-full transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-foreground/70 mb-1">Product Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-foreground/5 border border-border rounded-xl px-3 py-2 outline-none focus:border-primary" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-foreground/70 mb-1">SKU</label>
                  <input required type="text" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className="w-full bg-foreground/5 border border-border rounded-xl px-3 py-2 outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground/70 mb-1">Category</label>
                  <input required type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-foreground/5 border border-border rounded-xl px-3 py-2 outline-none focus:border-primary" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-foreground/70 mb-1">Price ($)</label>
                  <input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} className="w-full bg-foreground/5 border border-border rounded-xl px-3 py-2 outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground/70 mb-1">Initial Quantity</label>
                  <input required type="number" value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})} className="w-full bg-foreground/5 border border-border rounded-xl px-3 py-2 outline-none focus:border-primary" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground/70 mb-1">Image URL (Optional)</label>
                <input type="url" placeholder="https://picsum.photos/400" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} className="w-full bg-foreground/5 border border-border rounded-xl px-3 py-2 outline-none focus:border-primary" />
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl hover:bg-foreground/5 font-medium transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
