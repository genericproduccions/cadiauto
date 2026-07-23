import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import { createVehicle, getVehicle, updateVehicle } from '../../api/vehicles'
import { Combobox } from '@/components/ui/combobox'
import { getErrorMessage } from '@/lib/utils'

const ENVIRONMENTAL_LABEL_OPTIONS = [
  { value: '', label: 'Sense etiqueta' },
  { value: '0', label: '0' },
  { value: 'ECO', label: 'ECO' },
  { value: 'C', label: 'C' },
  { value: 'B', label: 'B' },
]

const STATUS_OPTIONS = [
  { value: 'available', label: 'Disponible' },
  { value: 'sold', label: 'Venut' },
  { value: 'delivered', label: 'Entregat' },
]

const emptyVehicle = {
  brand: '',
  model: '',
  version: '',
  plate: '',
  vin: '',
  color: '',
  fuel: '',
  environmental_label: '',
  previous_use: '',
  has_liens: false,
  mileage: 0,
  first_registration_date: '',
  last_itv_date: '',
  last_maintenance_date: '',
  last_maintenance_km: '',
  first_service_km: '',
  first_service_months: '',
  subsequent_service_km: '',
  subsequent_service_months: '',
  sale_price: '',
  new_value: '',
  used_value: '',
  warranty_months: 12,
  status: 'available',
}

const inputClass =
  'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none'

export default function VehicleForm() {
  const { id } = useParams()
  const isNew = id === 'nou'
  const navigate = useNavigate()

  const [vehicle, setVehicle] = useState(emptyVehicle)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isNew) {
      getVehicle(id).then((res) => {
        const data = res.data
        setVehicle({
          ...data,
          first_registration_date: data.first_registration_date?.substring(0, 10) ?? '',
          last_itv_date: data.last_itv_date?.substring(0, 10) ?? '',
          last_maintenance_date: data.last_maintenance_date?.substring(0, 10) ?? '',
        })
      })
    }
  }, [id, isNew])

  const handleChange = (field) => (e) => setVehicle({ ...vehicle, [field]: e.target.value })
  const handleCheckboxChange = (field) => (e) => setVehicle({ ...vehicle, [field]: e.target.checked })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setErrors({})
    try {
      if (isNew) {
        const res = await createVehicle(vehicle)
        toast.success('Vehicle creat correctament.')
        navigate(`/vehicles/${res.data.id}`)
      } else {
        await updateVehicle(id, vehicle)
        toast.success('Vehicle desat correctament.')
      }
    } catch (err) {
      setErrors(err.response?.data?.errors ?? {})
      toast.error(getErrorMessage(err, 'No s\'ha pogut desar el vehicle.'))
    } finally {
      setSaving(false)
    }
  }

  const field = (name, label, props = {}) => (
    <div>
      <label className="mb-1 block text-sm font-medium text-foreground">{label}</label>
      <input value={vehicle[name] ?? ''} onChange={handleChange(name)} className={inputClass} {...props} />
      {errors[name] && <p className="mt-1 text-xs text-red-400">{errors[name][0]}</p>}
    </div>
  )

  const depreciation =
    vehicle.new_value && vehicle.used_value ? (Number(vehicle.new_value) - Number(vehicle.used_value)).toFixed(2) : null

  return (
    <div className="space-y-8">
      <Link to="/vehicles" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Vehicles
      </Link>

      <h1 className="text-3xl font-bold text-foreground">
        {isNew ? 'Nou vehicle' : `${vehicle.brand} ${vehicle.model} · ${vehicle.plate}`}
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 rounded-2xl border border-border bg-surface p-6 sm:grid-cols-2">
        {field('brand', 'Marca', { required: true })}
        {field('model', 'Model', { required: true })}
        {field('version', 'Versió')}
        {field('plate', 'Matrícula', { required: true })}
        {field('vin', 'Número de bastidor', { required: true })}
        {field('color', 'Color')}
        {field('fuel', 'Combustible')}
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Etiqueta ambiental</label>
          <Combobox
            options={ENVIRONMENTAL_LABEL_OPTIONS}
            value={vehicle.environmental_label ?? ''}
            onChange={(value) => setVehicle({ ...vehicle, environmental_label: value })}
            placeholder="Sense etiqueta"
          />
        </div>
        {field('previous_use', 'Destí anterior (particular, empresa…)')}
        <label className="flex items-center gap-2 self-end pb-2 text-sm font-medium text-foreground">
          <input type="checkbox" checked={!!vehicle.has_liens} onChange={handleCheckboxChange('has_liens')} />
          El vehicle té càrregues
        </label>
        {field('mileage', 'Quilòmetres', { type: 'number' })}
        {field('first_registration_date', '1a data de matriculació', { type: 'date' })}
        {field('last_itv_date', 'Última ITV', { type: 'date' })}
        {field('last_maintenance_date', 'Últim manteniment', { type: 'date' })}
        {field('last_maintenance_km', 'Km últim manteniment', { type: 'number' })}
        {field('first_service_km', 'Pròxima revisió — km', { type: 'number' })}
        {field('first_service_months', 'Pròxima revisió — mesos', { type: 'number' })}
        {field('subsequent_service_km', 'Revisions successives — km', { type: 'number' })}
        {field('subsequent_service_months', 'Revisions successives — mesos', { type: 'number' })}
        {field('sale_price', 'Preu de venda', { type: 'number', step: '0.01' })}
        {field('new_value', 'Valor nou', { type: 'number', step: '0.01' })}
        {field('used_value', 'Valor usat', { type: 'number', step: '0.01' })}
        {field('warranty_months', 'Garantia (mesos)', { type: 'number' })}
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Estat</label>
          <Combobox
            options={STATUS_OPTIONS}
            value={vehicle.status}
            onChange={(value) => setVehicle({ ...vehicle, status: value })}
          />
        </div>

        {depreciation && (
          <div className="sm:col-span-2 rounded-lg bg-background px-3 py-2 text-sm text-muted-foreground">
            Depreciació calculada: <strong className="text-foreground">{depreciation} €</strong>
          </div>
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
    </div>
  )
}
