import { LayoutDashboard, Truck, Users, Car, ShieldCheck } from 'lucide-react'
import AppShell from './AppShell'

const sections = [
  {
    label: 'Administració',
    items: [
      { to: '/', label: 'Dashboard', end: true, icon: LayoutDashboard },
      { to: '/entregues', label: 'Entregues', icon: Truck },
      { to: '/clients', label: 'Clients', icon: Users },
      { to: '/vehicles', label: 'Vehicles', icon: Car },
    ],
  },
]

const badge = { icon: ShieldCheck, label: 'Mode administrador' }

export default function Layout() {
  return <AppShell sections={sections} badge={badge} />
}
