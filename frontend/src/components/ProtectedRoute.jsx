import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, allow }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">Carregant…</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allow && !allow.includes(user.role)) {
    return <Navigate to={user.role === 'client' ? '/portal' : '/'} replace />
  }

  return children
}
