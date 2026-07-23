import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import { listClients } from '../../api/clients'
import { listVehicles } from '../../api/vehicles'
import { createDelivery } from '../../api/deliveries'
import { useAuth } from '../../context/AuthContext'
import { Combobox } from '@/components/ui/combobox'
import { getErrorMessage } from '@/lib/utils'

const inputClass =
  'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none'

export default function DeliveryForm() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [clients, setClients] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [form, setForm] = useState({
    client_id: '',
    vehicle_id: '',
    delivery_datetime: '',
    location: '',
    observations: '',
  })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    listClients({ per_page: 200 }).then((res) => setClients(res.data.data))
    listVehicles({ status: 'available', per_page: 200 }).then((res) => setVehicles(res.data.data))
  }, [])

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value })
  const handleSelectChange = (field) => (value) => setForm({ ...form, [field]: value })

  const clientOptions = clients.map((c) => ({ value: String(c.id), label: `${c.full_name} (${c.nif})` }))
  const vehicleOptions = vehicles.map((v) => ({ value: String(v.id), label: `${v.brand} ${v.model} · ${v.plate}` }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setErrors({})
    try {
      const res = await createDelivery({ ...form, salesperson_id: user.id })
      toast.success('Entrega creada correctament.')
      navigate(`/entregues/${res.data.id}`)
    } catch (err) {
      setErrors(err.response?.data?.errors ?? {})
      toast.error(getErrorMessage(err, 'No s\'ha pogut crear l\'entrega.'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <Link to="/entregues" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Entregues
      </Link>

      <h1 className="text-3xl font-bold text-foreground">Nova entrega</h1>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-surface p-6">
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Client</label>
          <Combobox
            options={clientOptions}
            value={form.client_id}
            onChange={handleSelectChange('client_id')}
            placeholder="Selecciona un client…"
            searchPlaceholder="Cerca per nom o DNI…"
          />
          {errors.client_id && <p className="mt-1 text-xs text-red-400">{errors.client_id[0]}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Vehicle</label>
          <Combobox
            options={vehicleOptions}
            value={form.vehicle_id}
            onChange={handleSelectChange('vehicle_id')}
            placeholder="Selecciona un vehicle…"
            searchPlaceholder="Cerca per marca, model o matrícula…"
          />
          {errors.vehicle_id && <p className="mt-1 text-xs text-red-400">{errors.vehicle_id[0]}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Data i hora d'entrega</label>
          <input
            type="datetime-local"
            value={form.delivery_datetime}
            onChange={handleChange('delivery_datetime')}
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Lloc</label>
          <input value={form.location} onChange={handleChange('location')} className={inputClass} />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Observacions generals</label>
          <textarea value={form.observations} onChange={handleChange('observations')} rows={3} className={inputClass} />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {saving ? 'Creant…' : 'Crear entrega'}
          </button>
        </div>
      </form>
    </div>
  )
}
