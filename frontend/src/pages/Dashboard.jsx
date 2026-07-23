import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, UserPlus, FileEdit, Users, ChevronRight } from 'lucide-react'
import { getStats } from '../api/dashboard'
import StatusBadge from '../components/StatusBadge'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 13) return 'Bon dia'
  if (hour < 20) return 'Bona tarda'
  return 'Bona nit'
}

export default function Dashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    getStats().then((res) => setStats(res.data))
  }, [])

  const quickActions = [
    {
      to: '/entregues/nova',
      icon: Plus,
      title: 'Nova entrega',
      subtitle: 'Crear un vehicle per lliurar',
      primary: true,
    },
    {
      to: '/clients/nou',
      icon: UserPlus,
      title: 'Nou client',
      subtitle: "Donar d'alta un client nou",
    },
    {
      to: '/entregues',
      icon: FileEdit,
      title: 'Contractes pendents',
      subtitle: `${stats?.pending_signature_deliveries ?? 0} pendents de signar`,
    },
    {
      to: '/clients',
      icon: Users,
      title: 'Clients',
      subtitle: `${stats?.total_clients ?? 0} totals`,
    },
  ]

  return (
    <div className="space-y-10">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wide text-primary">Panell d'administracióooo</div>
        <h1 className="mt-2 text-3xl font-bold text-foreground">{getGreeting()}</h1>
        <p className="mt-2 text-muted-foreground">Resum de l'activitat i accessos ràpids.</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {quickActions.map((action) => (
          <Link
            key={action.to + action.title}
            to={action.to}
            className={`flex items-center gap-3 rounded-2xl border p-4 transition ${
              action.primary
                ? 'border-transparent bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90'
                : 'border-border bg-surface hover:border-white/20'
            }`}
          >
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                action.primary ? 'bg-white/15' : 'bg-primary/10 text-primary'
              }`}
            >
              <action.icon className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <div>
              <div className="font-semibold">{action.title}</div>
              <div className={`text-sm ${action.primary ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                {action.subtitle}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {stats?.pending_deliveries?.length > 0 && (
        <ListSection title={`Pendents de signar (${stats.pending_deliveries.length})`} items={stats.pending_deliveries}>
          {stats.pending_deliveries.map((delivery) => (
            <DeliveryRow key={delivery.id} delivery={delivery} showVehicle />
          ))}
        </ListSection>
      )}
    </div>
  )
}

function DeliveryRow({ delivery, showVehicle = false }) {
  return (
    <Link
      to={`/entregues/${delivery.id}`}
      className="flex items-center justify-between gap-3 px-5 py-3.5 text-sm transition hover:bg-surface-elevated"
    >
      <div>
        <div className="font-medium text-foreground">
          {showVehicle ? delivery.client?.full_name : `${delivery.vehicle?.brand} ${delivery.vehicle?.model}`}
        </div>
        <div className="text-muted-foreground">
          {showVehicle
            ? `${delivery.vehicle?.brand} ${delivery.vehicle?.model} · ${new Date(delivery.delivery_datetime ?? delivery.created_at).toLocaleDateString('ca-ES')}`
            : `${delivery.vehicle?.plate} · ${delivery.client?.full_name}`}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <StatusBadge status={delivery.status} />
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </div>
    </Link>
  )
}

function ListSection({ title, children }) {
  return (
    <div className="rounded-2xl border border-border bg-surface">
      <div className="border-b border-border px-5 py-3.5">
        <h2 className="font-bold text-foreground">{title}</h2>
      </div>
      <div className="divide-y divide-border">{children}</div>
    </div>
  )
}
