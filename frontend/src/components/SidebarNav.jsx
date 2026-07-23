import { NavLink } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import Logo from './Logo'
import { useAuth } from '../context/AuthContext'

export default function SidebarNav({ sections, badge, onNavigate }) {
  const { user, logout } = useAuth()

  return (
    <div className="flex h-full flex-col">
      <div className="mb-8">
        <Logo />
      </div>

      {badge && (
        <div className="mb-6 flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2.5 text-sm font-medium text-primary">
          <badge.icon className="h-4 w-4" strokeWidth={1.75} />
          {badge.label}
        </div>
      )}

      <nav className="flex-1 space-y-8 overflow-y-auto">
        {sections.map((section) => (
          <div key={section.label}>
            <div className="mb-3 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {section.label}
            </div>
            <div className="space-y-1.5">
              {section.items.map((item) =>
                item.external ? (
                  <a
                    key={item.to}
                    href={item.to}
                    target="_blank"
                    rel="noreferrer"
                    onClick={onNavigate}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-surface-elevated hover:text-foreground"
                  >
                    <item.icon className="h-4 w-4" strokeWidth={1.75} />
                    {item.label}
                  </a>
                ) : (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                        isActive ? "bg-surface-elevated text-foreground" : "text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
                      }`
                    }
                  >
                    <item.icon className="h-4 w-4" strokeWidth={1.75} />
                    {item.label}
                  </NavLink>
                ),
              )}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-auto border-t border-border pt-6">
        <div className="truncate px-3 text-xs text-muted-foreground">{user?.email}</div>
        <button
          onClick={logout}
          className="mt-3 flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-surface-elevated hover:text-foreground"
        >
          <LogOut className="h-4 w-4" strokeWidth={1.75} />
          Sortir
        </button>
      </div>
    </div>
  )
}
