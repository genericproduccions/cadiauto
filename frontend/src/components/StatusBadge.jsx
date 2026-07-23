const STYLES = {
  draft: 'bg-white/5 text-muted-foreground ring-1 ring-white/10',
  pending_signature: 'bg-amber-400/10 text-amber-400 ring-1 ring-amber-400/20',
  signed: 'bg-blue-400/10 text-blue-400 ring-1 ring-blue-400/20',
  completed: 'bg-emerald-400/10 text-emerald-400 ring-1 ring-emerald-400/20',
  available: 'bg-emerald-400/10 text-emerald-400 ring-1 ring-emerald-400/20',
  sold: 'bg-amber-400/10 text-amber-400 ring-1 ring-amber-400/20',
  delivered: 'bg-blue-400/10 text-blue-400 ring-1 ring-blue-400/20',
  correct: 'bg-emerald-400/10 text-emerald-400 ring-1 ring-emerald-400/20',
  review: 'bg-amber-400/10 text-amber-400 ring-1 ring-amber-400/20',
  not_applicable: 'bg-white/5 text-muted-foreground ring-1 ring-white/10',
}

const LABELS = {
  draft: 'Draft',
  pending_signature: 'Pendent de signatura',
  signed: 'Signada',
  completed: 'Finalitzada',
  available: 'Disponible',
  sold: 'Venut',
  delivered: 'Entregat',
  correct: 'Correcte',
  review: 'Revisar',
  not_applicable: 'Falta',
}

export default function StatusBadge({ status }) {
  if (!status) return <span className="text-muted-foreground">—</span>

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${STYLES[status] ?? 'bg-white/5 text-muted-foreground ring-1 ring-white/10'}`}>
      {LABELS[status] ?? status}
    </span>
  )
}
