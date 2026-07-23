import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Gauge, ChevronRight } from 'lucide-react'
import { listMyDeliveries } from '../../api/myDeliveries'
import StatusBadge from '../../components/StatusBadge'

export default function MyDeliveries() {
  const [deliveries, setDeliveries] = useState(null)

  useEffect(() => {
    listMyDeliveries().then((res) => setDeliveries(res.data))
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Les meves entregues</h1>
        <p className="mt-2 text-muted-foreground">Consulta l'estat dels vehicles, fotografies, documentació i contractes.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {deliveries?.map((delivery) => (
          <Link
            key={delivery.id}
            to={`/portal/${delivery.id}`}
            className="group rounded-2xl border border-border bg-surface p-5 transition hover:border-white/20"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{delivery.vehicle?.plate}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
            </div>
            <h2 className="mt-2 text-lg font-bold text-foreground">
              {delivery.vehicle?.brand} {delivery.vehicle?.model}
            </h2>
            <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" strokeWidth={1.75} />
                {delivery.delivery_datetime ? new Date(delivery.delivery_datetime).toLocaleDateString('ca-ES') : '—'}
              </div>
              <div className="flex items-center gap-2">
                <Gauge className="h-4 w-4" strokeWidth={1.75} />
                {Number(delivery.vehicle?.mileage ?? 0).toLocaleString('ca-ES')} km
              </div>
            </div>
            <div className="mt-4">
              <StatusBadge status={delivery.status} />
            </div>
          </Link>
        ))}

        {deliveries?.length === 0 && (
          <p className="col-span-full text-muted-foreground">Encara no tens cap entrega registrada.</p>
        )}
      </div>
    </div>
  )
}
