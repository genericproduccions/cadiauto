import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import { createClient, getClient, updateClient } from '../../api/clients'
import StatusBadge from '../../components/StatusBadge'
import { Combobox } from '@/components/ui/combobox'
import { getErrorMessage } from '@/lib/utils'

const TYPE_OPTIONS = [
  { value: 'particular', label: 'Particular' },
  { value: 'empresa', label: 'Empresa' },
]

const emptyClient = {
  full_name: '',
  company_name: '',
  nif: '',
  phone: '',
  email: '',
  address: '',
  municipality: '',
  postal_code: '',
  province: '',
  type: 'particular',
  notes: '',
}

const inputClass =
  'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none'

export default function ClientForm() {
  const { id } = useParams()
  const isNew = id === 'nou'
  const navigate = useNavigate()

  const [client, setClient] = useState(emptyClient)
  const [deliveries, setDeliveries] = useState([])
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isNew) {
      getClient(id).then((res) => {
        setClient(res.data)
        setDeliveries(res.data.deliveries ?? [])
      })
    }
  }, [id, isNew])

  const handleChange = (field) => (e) => setClient({ ...client, [field]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setErrors({})
    try {
      if (isNew) {
        const res = await createClient(client)
        toast.success('Client creat correctament.')
        navigate(`/clients/${res.data.id}`)
      } else {
        await updateClient(id, client)
        toast.success('Client desat correctament.')
      }
    } catch (err) {
      setErrors(err.response?.data?.errors ?? {})
      toast.error(getErrorMessage(err, 'No s\'ha pogut desar el client.'))
    } finally {
      setSaving(false)
    }
  }

  const field = (name, label, props = {}) => (
    <div>
      <label className="mb-1 block text-sm font-medium text-foreground">{label}</label>
      <input value={client[name] ?? ''} onChange={handleChange(name)} className={inputClass} {...props} />
      {errors[name] && <p className="mt-1 text-xs text-red-400">{errors[name][0]}</p>}
    </div>
  )

  return (
    <div className="space-y-8">
      <Link to="/clients" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Clients
      </Link>

      <h1 className="text-3xl font-bold text-foreground">{isNew ? 'Nou client' : client.full_name}</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 rounded-2xl border border-border bg-surface p-6 sm:grid-cols-2">
        {field('full_name', 'Nom i cognoms / Raó social', { required: true })}
        {field('company_name', 'Nom de l\'empresa (opcional)')}
        {field('nif', 'DNI / NIF / NIE', { required: true })}
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Tipus</label>
          <Combobox options={TYPE_OPTIONS} value={client.type} onChange={(value) => setClient({ ...client, type: value })} />
        </div>
        {field('phone', 'Telèfon')}
        {field('email', 'Email', { type: 'email' })}
        {field('address', 'Adreça')}
        {field('municipality', 'Municipi')}
        {field('postal_code', 'Codi postal')}
        {field('province', 'Província')}
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-foreground">Notes</label>
          <textarea value={client.notes ?? ''} onChange={handleChange('notes')} rows={3} className={inputClass} />
        </div>

        {!isNew && client.email && (
          <p className="sm:col-span-2 rounded-lg bg-background px-3 py-2 text-xs text-muted-foreground">
            Accés a l'àrea de client: <span className="text-foreground">{client.email}</span> · contrasenya per defecte: el
            DNI/NIF en majúscules i sense espais.
          </p>
        )}

        <div className="sm:col-span-2 flex justify-end gap-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {saving ? 'Desant…' : 'Desar'}
          </button>
        </div>
      </form>

      {!isNew && (
        <div className="rounded-2xl border border-border bg-surface">
          <div className="border-b border-border px-5 py-3.5 font-semibold text-foreground">Entregues d'aquest client</div>
          <div className="divide-y divide-border">
            {deliveries.map((delivery) => (
              <Link
                key={delivery.id}
                to={`/entregues/${delivery.id}`}
                className="flex items-center justify-between px-5 py-3.5 text-sm transition hover:bg-surface-elevated"
              >
                <span className="text-foreground">
                  {delivery.vehicle?.brand} {delivery.vehicle?.model} · {delivery.vehicle?.plate}
                </span>
                <StatusBadge status={delivery.status} />
              </Link>
            ))}
            {deliveries.length === 0 && <p className="px-5 py-8 text-center text-muted-foreground">Sense entregues.</p>}
          </div>
        </div>
      )}
    </div>
  )
}
