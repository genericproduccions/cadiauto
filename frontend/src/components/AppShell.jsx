import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu } from 'lucide-react'
import SidebarNav from './SidebarNav'
import Logo from './Logo'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'

export default function AppShell({ sections, badge }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-72 lg:flex-col lg:border-r lg:border-border lg:bg-surface lg:p-6">
        <SidebarNav sections={sections} badge={badge} />
      </aside>

      <div className="flex min-h-screen flex-col lg:pl-72">
        <div className="flex items-center justify-between border-b border-border px-4 py-3 lg:hidden">
          <Logo />
          <button
            onClick={() => setOpen(true)}
            className="rounded-lg p-2 text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="left" className="w-72 bg-surface p-6">
            <SheetTitle className="sr-only">Menú</SheetTitle>
            <SidebarNav sections={sections} badge={badge} onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
