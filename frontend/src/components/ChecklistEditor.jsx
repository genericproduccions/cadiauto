import { useState } from 'react'
import { toast } from 'sonner'
import { updateCheckItems } from '../api/deliveries'
import { CHECK_STATUS_OPTIONS } from '../constants'
import { getErrorMessage } from '@/lib/utils'

const STATUS_STYLES = {
  correct: 'border-emerald-400/30 bg-emerald-400/5',
  review: 'border-amber-400/30 bg-amber-400/5',
  not_applicable: 'border-border bg-background',
}

export default function ChecklistEditor({ deliveryId, groupedItems, onSaved }) {
  const [items, setItems] = useState(groupedItems)
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState(null)

  const updateItem = (category, itemId, changes) => {
    setItems((prev) => ({
      ...prev,
      [category]: prev[category].map((item) => (item.id === itemId ? { ...item, ...changes } : item)),
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    const flatItems = Object.values(items)
      .flat()
      .map((item) => ({ id: item.id, status: item.status || null, comment: item.comment || null }))

    try {
      const res = await updateCheckItems(deliveryId, flatItems)
      setItems(res.data)
      setSavedAt(new Date())
      onSaved?.(res.data)
      toast.success('Acta d\'estat desada correctament.')
    } catch (err) {
      toast.error(getErrorMessage(err, 'No s\'ha pogut desar l\'acta d\'estat.'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {Object.entries(items).map(([category, categoryItems]) => (
        <div key={category} className="rounded-2xl border border-border bg-surface p-4">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{category}</h3>
          <div className="space-y-3">
            {categoryItems.map((item) => (
              <div key={item.id} className={`rounded-lg border p-3 ${STATUS_STYLES[item.status] ?? 'border-border'}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="font-medium text-foreground">{item.item_name}</div>
                    <div className="text-xs text-muted-foreground">{item.comment || 'Sense observacions'}</div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {CHECK_STATUS_OPTIONS.filter((o) => o.value).map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => updateItem(category, item.id, { status: opt.value })}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                          item.status === opt.value ? 'bg-primary text-primary-foreground' : 'bg-white/5 text-muted-foreground hover:bg-white/10'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="Afegeix una observació…"
                  value={item.comment ?? ''}
                  onChange={(e) => updateItem(category, item.id, { comment: e.target.value })}
                  className="mt-2 w-full rounded-lg border border-border bg-background px-2 py-1 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex items-center justify-end gap-3">
        {savedAt && <span className="text-sm text-muted-foreground">Desat a les {savedAt.toLocaleTimeString('ca-ES')}</span>}
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          {saving ? 'Desant…' : 'Desar acta d\'estat'}
        </button>
      </div>
    </div>
  )
}
