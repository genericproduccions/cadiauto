import { Truck, Home } from 'lucide-react'
import AppShell from './AppShell'

const sections = [
  {
    label: 'Client',
    items: [
      { to: '/portal', label: 'Les meves entregues', end: true, icon: Truck },
      { to: 'https://cadiauto.net', label: 'Tornar al web', icon: Home, external: true },
    ],
  },
]

export default function ClientLayout() {
  return <AppShell sections={sections} />
}
