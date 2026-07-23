import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { ArrowLeft, Info, ClipboardCheck, Image, FileText, Link2, Car, Wallet, Pencil, Plus, Save } from 'lucide-react'
import { getDelivery, updateDelivery } from '../../api/deliveries'
import StatusBadge from '../../components/StatusBadge'
import ChecklistEditor from '../../components/ChecklistEditor'
import PhotoManager from '../../components/PhotoManager'
import DocumentManager from '../../components/DocumentManager'
import GeneratedDocumentsPanel from '../../components/GeneratedDocumentsPanel'
import { getErrorMessage } from '@/lib/utils'

const TABS = [
  { key: 'info', label: 'Informació', icon: Info },
  { key: 'checklist', label: "Acta d'estat", icon: ClipboardCheck },
  { key: 'photos', label: 'Fotos', icon: Image },
  { key: 'documents', label: 'Documents', icon: FileText },
  { key: 'pdfs', label: 'PDFs i enllaç', icon: Link2 },
]

export default function DeliveryDetail() {
  const { id } = useParams()
  const [delivery, setDelivery] = useState(null)
  const [tab, setTab] = useState('info')
  const [observations, setObservations] = useState('')
  const [savingInfo, setSavingInfo] = useState(false)

  const reload = () =>
    getDelivery(id).then((res) => {
      setDelivery(res.data)
      setObservations(res.data.observations ?? '')
    })

  useEffect(() => {
    reload()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  if (!delivery) {
    return <p className="text-muted-foreground">Carregant…</p>
  }

  const vehicle = delivery.vehicle

  const handleSaveObservations = async () => {
    setSavingInfo(true)
    try {
      await updateDelivery(id, {
        client_id: delivery.client_id,
        vehicle_id: delivery.vehicle_id,
        salesperson_id: delivery.salesperson_id,
        delivery_datetime: delivery.delivery_datetime,
        location: delivery.location,
        observations,
      })
      toast.success('Observacions desades correctament.')
    } catch (err) {
      toast.error(getErrorMessage(err, 'No s\'han pogut desar les observacions.'))
    } finally {
      setSavingInfo(false)
    }
  }

  const groupedItems = (delivery.check_items ?? []).reduce((acc, item) => {
    acc[item.category] = acc[item.category] ?? []
    acc[item.category].push(item)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <Link to="/entregues" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Entregues
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {delivery.client?.full_name} — {vehicle?.brand} {vehicle?.model}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">Matrícula {vehicle?.plate}</p>
        </div>
        <StatusBadge status={delivery.status} />
      </div>

      <div className="flex gap-1 overflow-x-auto border-b border-border">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 whitespace-nowrap px-4 py-2 text-sm font-medium ${
              tab === t.key ? 'border-b-2 border-primary text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <t.icon className="h-4 w-4" strokeWidth={1.75} />
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'info' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-muted-foreground">Client</dt>
                <dd className="font-medium text-foreground">{delivery.client?.full_name}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">DNI/NIF</dt>
                <dd className="font-medium text-foreground">{delivery.client?.nif}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Vehicle</dt>
                <dd className="font-medium text-foreground">
                  {vehicle?.brand} {vehicle?.model} {vehicle?.version}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Matrícula / Bastidor</dt>
                <dd className="font-medium text-foreground">
                  {vehicle?.plate} · {vehicle?.vin}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Data i lloc</dt>
                <dd className="font-medium text-foreground">
                  {delivery.delivery_datetime ? new Date(delivery.delivery_datetime).toLocaleString('ca-ES') : '—'} ·{' '}
                  {delivery.location}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Estat</dt>
                <dd>
                  <StatusBadge status={delivery.status} />
                </dd>
              </div>
            </dl>

            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium text-foreground">Observacions generals</label>
              <textarea
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                rows={3}
                placeholder="Anotacions internes sobre l'entrega…"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none"
              />
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveObservations}
                  disabled={savingInfo}
                  className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {savingInfo ? 'Desant…' : 'Desar'}
                </button>
              </div>
            </div>
          </div>

          <SectionCard
            icon={Car}
            title="Dades del vehicle"
            action={
              <Link
                to={`/vehicles/${vehicle?.id}`}
                className="flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                <Pencil className="h-3.5 w-3.5" />
                Editar
              </Link>
            }
          >
            <div className="grid grid-cols-1 gap-x-6 gap-y-4 text-sm sm:grid-cols-3">
              <Item label="Comercial" value={delivery.salesperson?.name} />
              <Item label="Versió" value={vehicle?.version} />
              <Item label="Color" value={vehicle?.color} />
              <Item label="VIN" value={vehicle?.vin} />
              <Item label="Km" value={vehicle?.mileage ? `${Number(vehicle.mileage).toLocaleString('ca-ES')} km` : null} />
              <Item label="Combustible" value={vehicle?.fuel} />
              <Item label="Etiqueta" value={vehicle?.environmental_label} />
              <Item label="Lloc d'entrega" value={delivery.location} />
              <Item label="1a matriculació" value={vehicle?.first_registration_date?.substring(0, 10)} />
              <Item label="Última ITV" value={vehicle?.last_itv_date?.substring(0, 10)} />
              <Item label="Destí anterior" value={vehicle?.previous_use} />
              <Item label="Càrregues" value={vehicle?.has_liens ? 'Amb càrregues' : 'Lliure de càrregues'} />
              <Item label="Garantia" value={vehicle?.warranty_months ? `${vehicle.warranty_months} mesos` : null} />
              <Item
                label="1a revisió"
                value={
                  vehicle?.first_service_km || vehicle?.first_service_months
                    ? `${Number(vehicle.first_service_km ?? 0).toLocaleString('ca-ES')} km / ${vehicle.first_service_months ?? '—'} mesos`
                    : null
                }
              />
              <Item
                label="Successives"
                value={
                  vehicle?.subsequent_service_km || vehicle?.subsequent_service_months
                    ? `${Number(vehicle.subsequent_service_km ?? 0).toLocaleString('ca-ES')} km / ${vehicle.subsequent_service_months ?? '—'} mesos`
                    : null
                }
              />
            </div>
          </SectionCard>

          <SectionCard
            icon={Car}
            title="Vehicle usat lliurat pel client"
            action={
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                <Plus className="h-3.5 w-3.5" />
                Afegir
              </button>
            }
          >
            <p className="text-sm text-muted-foreground">El client no lliura cap vehicle a canvi.</p>
          </SectionCard>

          <SectionCard
            icon={Wallet}
            title="Resum econòmic"
            action={
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                <Pencil className="h-3.5 w-3.5" />
                Editar
              </button>
            }
          >
            <div className="grid grid-cols-1 gap-x-6 gap-y-4 text-sm sm:grid-cols-3">
              <Item label="Base imp." value={null} />
              <Item label="IVA" value={null} />
              <Item label="PVP" value={null} />
              <Item label="Lliurament a compte" value={null} />
              <Item label="Valor taxació" value={null} />
              <Item label="Resta" value={null} />
              <Item label="Canvi nom" value={null} />
              <Item label="Baixa temp." value={null} />
              <Item label="Rematriculació" value={null} />
              <Item label="Forma de pagament" value={null} />
              <Item label="Finançat per" value={null} />
              <Item label="Finançament" value={null} />
              <Item label="Total" value={null} />
            </div>
          </SectionCard>
        </div>
      )}

      {tab === 'checklist' && (
        <ChecklistEditor deliveryId={id} groupedItems={groupedItems} />
      )}

      {tab === 'photos' && (
        <PhotoManager
          deliveryId={id}
          photos={delivery.photos ?? []}
          onChange={(photos) => setDelivery({ ...delivery, photos })}
        />
      )}

      {tab === 'documents' && (
        <DocumentManager
          deliveryId={id}
          documents={delivery.documents ?? []}
          onChange={(documents) => setDelivery({ ...delivery, documents })}
        />
      )}

      {tab === 'pdfs' && (
        <GeneratedDocumentsPanel
          deliveryId={id}
          documents={delivery.generated_documents ?? []}
          accessToken={delivery.access_token}
          onChange={(generated_documents) => setDelivery({ ...delivery, generated_documents })}
        />
      )}
    </div>
  )
}

function SectionCard({ icon: Icon, title, action, children }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
          <Icon className="h-5 w-5" strokeWidth={1.75} />
          {title}
        </h2>
        {action}
      </div>
      {children}
    </div>
  )
}

function Item({ label, value }) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-medium text-foreground">{value ?? '—'}</div>
    </div>
  )
}
