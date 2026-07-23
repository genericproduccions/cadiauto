import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Gauge, ChevronRight, User } from 'lucide-react'
import { listDeliveries } from '../../api/deliveries'
import StatusBadge from '../../components/StatusBadge'
import { Combobox } from '@/components/ui/combobox'

const STATUS_OPTIONS = [
  { value: '', label: 'Tots els estats' },
  { value: 'draft', label: 'Esborrany' },
  { value: 'pending_signature', label: 'Pendent de signatura' },
  { value: 'signed', label: 'Signada' },
  { value: 'completed', label: 'Finalitzada' },
]

export default function DeliveryList() {
  const [deliveries, setDeliveries] = useState([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(true)
      const params = {}
      if (search) params.search = search
      if (status) params.status = status
      listDeliveries(params)
        .then((res) => setDeliveries(res.data.data))
        .finally(() => setLoading(false))
    }, 300)
    return () => clearTimeout(timeout)
  }, [search, status])

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Entregues</h1>
        <Link to="/entregues/nova" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
          + Nova entrega
        </Link>
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Cerca per client, DNI o matrícula…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none"
        />
        <Combobox options={STATUS_OPTIONS} value={status} onChange={setStatus} className="w-56" />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {deliveries.map((delivery) => (
          <Link
            key={delivery.id}
            to={`/entregues/${delivery.id}`}
            className="group rounded-2xl border border-border bg-surface p-5 transition hover:border-white/20"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{delivery.vehicle?.plate}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
            </div>
            <h2 className="mt-2 text-lg font-bold text-foreground">
              {delivery.vehicle?.brand} {delivery.vehicle?.model}
            </h2>
            <p className="text-sm text-muted-foreground">{delivery.client?.full_name}</p>
            <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" strokeWidth={1.75} />
                {delivery.delivery_datetime ? new Date(delivery.delivery_datetime).toLocaleDateString('ca-ES') : '—'}
              </div>
              <div className="flex items-center gap-2">
                <Gauge className="h-4 w-4" strokeWidth={1.75} />
                {Number(delivery.vehicle?.mileage ?? 0).toLocaleString('ca-ES')} km
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" strokeWidth={1.75} />
                {delivery.salesperson?.name}
              </div>
            </div>
            <div className="mt-4">
              <StatusBadge status={delivery.status} />
            </div>
          </Link>
        ))}

        {!loading && deliveries.length === 0 && (
          <p className="col-span-full text-center text-muted-foreground">No s'ha trobat cap entrega.</p>
        )}
      </div>
    </div>
  )
}
