"use client"

import { useEffect, useState } from 'react'
import { ShoppingCart, Plus, Minus, CheckCircle, PackageSearch, Zap, ChevronRight, Star } from 'lucide-react'
import { supabase, Product, StoreSetting } from '@/lib/supabase'

export default function StorePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [settings, setSettings] = useState<StoreSetting>({ id: 'default', store_name: 'Store', currency: '$' })
  const [loading, setLoading] = useState(true)
  
  const [cart, setCart] = useState<Record<string, number>>({})
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const { data: pData } = await supabase.from('products').select('*').order('name')
      const { data: sData } = await supabase.from('settings').select('*').eq('id', 'default').single()
      
      if (pData) setProducts(pData)
      if (sData) setSettings(sData)
      setLoading(false)
    }
    loadData()
  }, [])

  const addToCart = (product: Product) => {
    setCart(prev => {
      const current = prev[product.id] || 0
      if (current >= product.quantity) return prev
      return { ...prev, [product.id]: current + 1 }
    })
  }

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const current = prev[productId] || 0
      if (current <= 1) {
        const newCart = { ...prev }
        delete newCart[productId]
        return newCart
      }
      return { ...prev, [productId]: current - 1 }
    })
  }

  const getCartTotal = () => {
    return Object.entries(cart).reduce((total, [id, qty]) => {
      const product = products.find(p => p.id === id)
      return total + (product ? product.price * qty : 0)
    }, 0)
  }
  
  const getCartItemCount = () => {
    return Object.values(cart).reduce((a, b) => a + b, 0)
  }

  const handleCheckout = async () => {
    if (getCartItemCount() === 0) return
    setIsCheckingOut(true)
    
    try {
      const salesInserts = []
      
      for (const [productId, qty] of Object.entries(cart)) {
        const product = products.find(p => p.id === productId)
        if (!product) continue
        
        salesInserts.push({
          product_id: productId,
          quantity: qty,
          total_price: product.price * qty
        })
        
        const newQuantity = product.quantity - qty
        const status = newQuantity === 0 ? 'Out of Stock' : newQuantity < 10 ? 'Low Stock' : 'In Stock'
        
        await supabase.from('products').update({
          quantity: newQuantity,
          status: status
        }).eq('id', productId)
      }
      
      if (salesInserts.length > 0) {
        await supabase.from('sales').insert(salesInserts)
      }
      
      setCart({})
      setOrderSuccess(true)
      
      const { data: pData } = await supabase.from('products').select('*').order('name')
      if (pData) setProducts(pData)
      
      setTimeout(() => setOrderSuccess(false), 5000)
      
    } catch (error) {
      console.error("Checkout failed:", error)
      alert("Checkout failed. Please try again.")
    } finally {
      setIsCheckingOut(false)
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
        <p className="text-foreground/50 font-medium">Loading {settings.store_name}...</p>
      </div>
    )
  }

  const activeProducts = products.filter(p => p.quantity > 0)
  const flashSaleProducts = activeProducts.slice(0, 4) // mock flash sale
  const justForYouProducts = products // all products

  return (
    <div className="bg-gray-50 dark:bg-background pb-12">
      
      {/* Hero Banner Carousel (Static for now) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="w-full h-48 md:h-80 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl overflow-hidden relative shadow-md">
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 text-white">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4">Mega Fashion Sale</h2>
            <p className="text-lg md:text-xl font-medium opacity-90 mb-6 max-w-lg">Up to 70% off on all electronics and wearables. Don't miss out on the biggest sale of the year.</p>
            <button className="bg-white text-orange-500 px-6 py-2 rounded-full font-bold w-fit hover:bg-orange-50 transition-colors">Shop Now</button>
          </div>
          {/* Decorative shapes */}
          <div className="absolute right-0 top-0 w-1/2 h-full bg-white/10 skew-x-12 translate-x-16"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-8">
          
          {orderSuccess && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-4 text-green-500 animate-in fade-in slide-in-from-top-4">
              <CheckCircle className="w-6 h-6" />
              <div>
                <h3 className="font-bold">Order Confirmed!</h3>
                <p className="text-sm opacity-90">Thank you for shopping with us.</p>
              </div>
            </div>
          )}

          {/* Flash Sale Section */}
          {flashSaleProducts.length > 0 && (
            <section className="bg-white dark:bg-card p-4 rounded-xl shadow-sm border border-border">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                <h2 className="text-xl font-bold flex items-center gap-2 text-orange-500">
                  <Zap className="w-6 h-6" />
                  Flash Sale
                </h2>
                <button className="text-sm font-bold text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10 px-3 py-1 rounded transition-colors uppercase border border-orange-500">Shop More</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {flashSaleProducts.map(product => {
                  const inCart = cart[product.id] || 0
                  return (
                    <div key={product.id} className="group cursor-pointer">
                      <div className="aspect-square bg-gray-100 dark:bg-foreground/5 rounded-lg mb-2 overflow-hidden relative">
                        <img src={product.image_url || 'https://placehold.co/400x400/png'} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">-20%</div>
                      </div>
                      <h3 className="text-sm font-medium line-clamp-2 leading-tight text-foreground/90 group-hover:text-orange-500 transition-colors">{product.name}</h3>
                      <p className="text-lg font-bold text-orange-500 mt-1">{settings.currency}{product.price.toFixed(2)}</p>
                      <div className="w-full bg-orange-500/20 rounded-full h-1.5 mt-2 overflow-hidden">
                        <div className="bg-orange-500 h-full" style={{ width: '80%' }}></div>
                      </div>
                      <p className="text-[10px] text-foreground/50 mt-1 text-right">{product.quantity} items left</p>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Just For You Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-foreground/80 pl-2">Just For You</h2>
            {products.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-card rounded-xl border border-border">
                <PackageSearch className="w-12 h-12 mx-auto text-foreground/20 mb-4" />
                <p className="text-foreground/50 font-medium">No products available at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {products.map(product => {
                  const inCart = cart[product.id] || 0
                  const isOutOfStock = product.quantity === 0
                  
                  return (
                    <div key={product.id} className={`bg-white dark:bg-card rounded-xl border border-border overflow-hidden flex flex-col hover:shadow-lg transition-all ${isOutOfStock ? 'opacity-60' : ''}`}>
                      <div className="aspect-square bg-gray-100 dark:bg-foreground/5 relative overflow-hidden">
                        <img src={product.image_url || 'https://placehold.co/400x400/png'} alt={product.name} className="w-full h-full object-cover" />
                        {isOutOfStock && (
                          <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                            <span className="bg-black text-white px-4 py-1 font-bold rounded-full text-sm">Sold Out</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-4 flex flex-col flex-1">
                        <h3 className="text-sm font-medium line-clamp-2 leading-snug mb-1 hover:text-orange-500 cursor-pointer transition-colors">{product.name}</h3>
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="w-3 h-3 text-orange-400 fill-orange-400" />
                          <Star className="w-3 h-3 text-orange-400 fill-orange-400" />
                          <Star className="w-3 h-3 text-orange-400 fill-orange-400" />
                          <Star className="w-3 h-3 text-orange-400 fill-orange-400" />
                          <Star className="w-3 h-3 text-foreground/20" />
                          <span className="text-[10px] text-foreground/50 ml-1">(42)</span>
                        </div>
                        <div className="mt-auto">
                          <span className="font-bold text-xl text-orange-500">{settings.currency}{product.price.toFixed(2)}</span>
                          
                          <div className="mt-4">
                            {!isOutOfStock && (
                              inCart > 0 ? (
                                <div className="flex items-center justify-between border border-orange-500 rounded-lg p-1">
                                  <button onClick={() => removeFromCart(product.id)} className="w-8 h-8 flex items-center justify-center text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-md transition-colors"><Minus className="w-4 h-4" /></button>
                                  <span className="font-bold text-sm w-4 text-center text-orange-500">{inCart}</span>
                                  <button onClick={() => addToCart(product.id)} disabled={inCart >= product.quantity} className="w-8 h-8 flex items-center justify-center text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-md transition-colors disabled:opacity-30"><Plus className="w-4 h-4" /></button>
                                </div>
                              ) : (
                                <button 
                                  onClick={() => addToCart(product.id)}
                                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg text-sm font-bold transition-colors"
                                >
                                  Add to Cart
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        </div>
        
        {/* Shopping Cart Sidebar (Right Column) */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-card border border-border p-5 rounded-xl sticky top-32 shadow-sm">
            <h2 className="text-lg font-bold tracking-tight mb-4 flex items-center gap-2 border-b border-border pb-3">
              <ShoppingCart className="w-5 h-5 text-orange-500" />
              Order Summary
            </h2>
            
            {getCartItemCount() === 0 ? (
              <div className="text-center py-8 text-foreground/40 text-sm">
                Your cart is empty.
              </div>
            ) : (
              <div className="space-y-4 flex flex-col h-full max-h-[50vh]">
                <div className="space-y-4 overflow-y-auto flex-1 pr-2 custom-scrollbar">
                  {Object.entries(cart).map(([id, qty]) => {
                    const product = products.find(p => p.id === id)
                    if (!product) return null
                    
                    return (
                      <div key={id} className="flex gap-3 text-sm">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-foreground/5 rounded flex-shrink-0 overflow-hidden">
                           <img src={product.image_url || 'https://placehold.co/400x400/png'} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-xs line-clamp-2 leading-tight mb-1">{product.name}</p>
                          <p className="font-bold text-orange-500">{settings.currency}{(product.price * qty).toFixed(2)}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-foreground/50">Qty: {qty}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                
                <div className="border-t border-border pt-4 mt-auto">
                  <div className="space-y-2 mb-4 text-sm text-foreground/70">
                    <div className="flex justify-between">
                      <span>Subtotal ({getCartItemCount()} items)</span>
                      <span>{settings.currency}{getCartTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping Fee</span>
                      <span className="text-green-500 font-medium">Free</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-medium text-foreground">Total</span>
                    <span className="text-xl font-bold text-orange-500">{settings.currency}{getCartTotal().toFixed(2)}</span>
                  </div>
                  
                  <button 
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-bold transition-colors disabled:opacity-50 flex justify-center items-center"
                  >
                    {isCheckingOut ? 'Processing...' : 'PROCEED TO CHECKOUT'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  )
}
