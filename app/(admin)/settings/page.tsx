"use client"
import { useState, useEffect } from 'react'
import { Save } from 'lucide-react'
import { supabase, StoreSetting } from '@/lib/supabase'

export default function Settings() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<StoreSetting>({
    id: 'default',
    store_name: 'StockSathi AI',
    currency: '$'
  })

  useEffect(() => {
    async function fetchSettings() {
      const { data, error } = await supabase.from('settings').select('*').eq('id', 'default').single()
      if (data) {
        setSettings(data)
      }
      setLoading(false)
    }
    fetchSettings()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('settings').upsert({
      id: 'default',
      store_name: settings.store_name,
      currency: settings.currency
    })
    
    setSaving(false)
    if (error) {
      alert("Error saving settings: " + error.message)
    } else {
      // Small feedback
      alert("Settings saved successfully! Refresh to see changes across the app.")
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-foreground/60">Manage your store preferences and localization.</p>
      </div>

      {loading ? (
        <div className="glass-panel p-6 rounded-2xl animate-pulse h-64 flex items-center justify-center">
          <p className="text-foreground/50">Loading settings...</p>
        </div>
      ) : (
        <div className="glass-panel p-6 md:p-8 rounded-2xl">
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-2">Store Name</label>
              <input 
                type="text" 
                value={settings.store_name}
                onChange={(e) => setSettings({...settings, store_name: e.target.value})}
                className="w-full bg-foreground/5 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                placeholder="Enter your store name"
                required
              />
              <p className="text-xs text-foreground/50 mt-2">This name will appear on the sidebar and invoices.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-2">Currency Symbol</label>
              <input 
                type="text" 
                value={settings.currency}
                onChange={(e) => setSettings({...settings, currency: e.target.value})}
                className="w-full bg-foreground/5 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                placeholder="e.g. $, Rs, €, £"
                required
              />
              <p className="text-xs text-foreground/50 mt-2">This symbol will be used for all financial metrics.</p>
            </div>

            <div className="pt-4 border-t border-border">
              <button 
                type="submit" 
                disabled={saving}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
