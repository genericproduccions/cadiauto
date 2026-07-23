import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listVehicles } from '../../api/vehicles'
import StatusBadge from '../../components/StatusBadge'

export default function VehicleList() {
  const [vehicles, setVehicles] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(true)
      listVehicles(search ? { search } : {})
        .then((res) => setVehicles(res.data.data))
        .finally(() => setLoading(false))
    }, 300)
    return () => clearTimeout(timeout)
  }, [search])

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Vehicles</h1>
        <Link to="/vehicles/nou" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
          + Nou vehicle
        </Link>
      </div>

      <input
        type="text"
        placeholder="Cerca per matrícula, bastidor, marca o model…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none"
      />

      <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full text-sm">
          <thead className="text-left text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Vehicle</th>
              <th className="px-4 py-3 font-medium">Matrícula</th>
              <th className="px-4 py-3 font-medium">Km</th>
              <th className="px-4 py-3 font-medium">Preu venda</th>
              <th className="px-4 py-3 font-medium">Estat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id} className="transition hover:bg-surface-elevated">
                <td className="px-4 py-3">
                  <Link to={`/vehicles/${vehicle.id}`} className="font-medium text-foreground hover:underline">
                    {vehicle.brand} {vehicle.model} {vehicle.version}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{vehicle.plate}</td>
                <td className="px-4 py-3 text-muted-foreground">{Number(vehicle.mileage).toLocaleString('ca-ES')}</td>
                <td className="px-4 py-3 text-muted-foreground">{Number(vehicle.sale_price).toLocaleString('ca-ES')} €</td>
                <td className="px-4 py-3">
                  <StatusBadge status={vehicle.status} />
                </td>
              </tr>
            ))}
            {!loading && vehicles.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No s'ha trobat cap vehicle.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
