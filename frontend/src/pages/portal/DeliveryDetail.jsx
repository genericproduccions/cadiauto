import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Calendar, Gauge, FileText, Download, PenLine, CheckCircle2 } from 'lucide-react'
import {
  getMyDelivery,
  getMyDocumentBlobUrl,
  getMyGeneratedDocumentBlobUrl,
  getMyPhotoBlobUrl,
} from '../../api/myDeliveries'
import BlobImage from '../../components/BlobImage'
import { DOCUMENT_TYPES, GENERATED_DOCUMENT_TYPES, labelFor } from '../../constants'

async function triggerDownload(loader, filename) {
  const url = await loader()
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
}

export default function DeliveryDetail() {
  const { id } = useParams()
  const [delivery, setDelivery] = useState(null)

  useEffect(() => {
    getMyDelivery(id).then((res) => setDelivery(res.data))
  }, [id])

  if (!delivery) {
    return <p className="text-muted-foreground">Carregant…</p>
  }

  const vehicle = delivery.vehicle
  const isSigned = delivery.status === 'completed' || !!delivery.signature

  return (
    <div className="space-y-8">
      <Link to="/portal" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Totes les entregues
      </Link>

      {/* Hero */}
      <div className="rounded-2xl bg-primary p-8 text-primary-foreground shadow-glow sm:p-10">
        <div className="text-sm opacity-80">{vehicle.plate}</div>
        <h1 className="mt-2 text-2xl font-extrabold uppercase tracking-tight sm:text-3xl">
          {vehicle.brand} {vehicle.model} {vehicle.version}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm opacity-90">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {delivery.delivery_datetime ? new Date(delivery.delivery_datetime).toLocaleDateString('ca-ES') : '—'}
          </span>
          <span className="flex items-center gap-1.5">
            <Gauge className="h-4 w-4" />
            {Number(vehicle.mileage).toLocaleString('ca-ES')} km
          </span>
          <span>{vehicle.color}</span>
          <span>VIN: {vehicle.vin}</span>
          {vehicle.environmental_label && (
            <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-medium">
              Etiqueta {vehicle.environmental_label}
            </span>
          )}
        </div>
      </div>

      {/* Fitxa tècnica */}
      <Section title="Fitxa tècnica">
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-3">
          <Item label="Combustible" value={vehicle.fuel} />
          <Item label="Etiqueta" value={vehicle.environmental_label} />
          <Item
            label="1a matriculació"
            value={vehicle.first_registration_date?.substring(0, 10)}
          />
          <Item label="Última ITV" value={vehicle.last_itv_date?.substring(0, 10)} />
          <Item label="Destí anterior" value={vehicle.previous_use} />
          <Item label="Càrregues" value={vehicle.has_liens ? 'Amb càrregues' : 'Lliure de càrregues'} />
          <Item label="Garantia" value={vehicle.warranty_months ? `${vehicle.warranty_months} mesos` : null} />
          <Item label="Comercial" value={delivery.salesperson?.name} />
          <Item
            label="1a revisió"
            value={
              vehicle.first_service_km || vehicle.first_service_months
                ? `${Number(vehicle.first_service_km ?? 0).toLocaleString('ca-ES')} km / ${vehicle.first_service_months ?? '—'} mesos`
                : null
            }
          />
          <Item
            label="Successives"
            value={
              vehicle.subsequent_service_km || vehicle.subsequent_service_months
                ? `${Number(vehicle.subsequent_service_km ?? 0).toLocaleString('ca-ES')} km / ${vehicle.subsequent_service_months ?? '—'} mesos`
                : null
            }
          />
        </div>
      </Section>

      {/* Vehicle lliurat a canvi */}
      <Section title="Vehicle lliurat a canvi">
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-3">
          <Item label="Vehicle" value={null} />
          <Item label="Matrícula" value={null} />
          <Item label="Km" value={null} />
          <Item label="Combustible" value={null} />
          <Item label="1a matriculació" value={null} />
          <Item label="Taxació" value={null} />
        </div>
      </Section>

      {/* Fotografies */}
      {delivery.photos?.length > 0 && (
        <Section title="Fotografies de l'estat del vehicle">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {delivery.photos.map((photo) => (
              <div key={photo.id} className="overflow-hidden rounded-xl border border-border">
                <BlobImage
                  loader={() => getMyPhotoBlobUrl(delivery.id, photo.id)}
                  alt={photo.type}
                  className="h-40 w-full object-cover"
                />
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Documentació */}
      <Section title="Documentació">
        <div className="divide-y divide-border overflow-hidden rounded-xl border border-border">
          {delivery.generated_documents?.map((doc) => (
            <DocRow
              key={`gen-${doc.id}`}
              label={labelFor(GENERATED_DOCUMENT_TYPES, doc.type)}
              onDownload={() =>
                triggerDownload(() => getMyGeneratedDocumentBlobUrl(delivery.id, doc.id), `${doc.type}.pdf`)
              }
            />
          ))}
          {delivery.documents?.map((doc) => (
            <DocRow
              key={`doc-${doc.id}`}
              label={doc.original_name ?? labelFor(DOCUMENT_TYPES, doc.type)}
              onDownload={() =>
                triggerDownload(() => getMyDocumentBlobUrl(delivery.id, doc.id), doc.original_name ?? `${doc.type}.pdf`)
              }
            />
          ))}
          {(!delivery.generated_documents || delivery.generated_documents.length === 0) &&
            (!delivery.documents || delivery.documents.length === 0) && (
              <p className="px-4 py-6 text-center text-muted-foreground">Encara no hi ha documents disponibles.</p>
            )}
        </div>
      </Section>

      {/* Contracte de compravenda */}
      <Section title="Contracte de compravenda">
        <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3.5">
          <div>
            <div className="font-medium text-foreground">
              {delivery.client?.full_name} — {Number(vehicle.sale_price).toLocaleString('ca-ES')} €
            </div>
            <div className="text-sm text-muted-foreground">Estat: {isSigned ? 'Signat' : 'Sent'}</div>
          </div>
          {isSigned ? (
            <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              Signat
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-sm font-medium text-primary">
              <PenLine className="h-4 w-4" />
              Pendent de signar (revisa el teu correu)
            </span>
          )}
        </div>
      </Section>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <h2 className="mb-4 text-lg font-bold text-foreground">{title}</h2>
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

function DocRow({ label, onDownload }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 transition hover:bg-surface-elevated">
      <span className="flex items-center gap-2 text-foreground">
        <FileText className="h-4 w-4 text-muted-foreground" />
        {label}
      </span>
      <button onClick={onDownload} className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
        <Download className="h-4 w-4" />
        Descarregar
      </button>
    </div>
  )
}
