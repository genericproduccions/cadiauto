import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listClients } from '../../api/clients'

export default function ClientList() {
  const [clients, setClients] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const load = (params) => {
    setLoading(true)
    listClients(params)
      .then((res) => setClients(res.data.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    const timeout = setTimeout(() => load(search ? { search } : {}), 300)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Clients</h1>
        <Link to="/clients/nou" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
          + Nou client
        </Link>
      </div>

      <input
        type="text"
        placeholder="Cerca per nom, DNI, email o telèfon…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none"
      />

      <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full text-sm">
          <thead className="text-left text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Nom</th>
              <th className="px-4 py-3 font-medium">DNI/NIF</th>
              <th className="px-4 py-3 font-medium">Telèfon</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Tipus</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {clients.map((client) => (
              <tr key={client.id} className="transition hover:bg-surface-elevated">
                <td className="px-4 py-3">
                  <Link to={`/clients/${client.id}`} className="font-medium text-foreground hover:underline">
                    {client.full_name}
                  </Link>
                  {client.company_name && <span className="ml-1 text-muted-foreground">({client.company_name})</span>}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{client.nif}</td>
                <td className="px-4 py-3 text-muted-foreground">{client.phone}</td>
                <td className="px-4 py-3 text-muted-foreground">{client.email}</td>
                <td className="px-4 py-3 capitalize text-muted-foreground">{client.type}</td>
              </tr>
            ))}
            {!loading && clients.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No s'ha trobat cap client.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
