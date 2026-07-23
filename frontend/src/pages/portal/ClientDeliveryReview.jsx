import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import {
  getPublicDelivery,
  getPublicGeneratedDocumentBlobUrl,
  getPublicPhotoBlobUrl,
  signDelivery,
} from '../../api/publicDelivery'
import SignaturePad from '../../components/SignaturePad'
import BlobImage from '../../components/BlobImage'
import Logo from '../../components/Logo'
import { GENERATED_DOCUMENT_TYPES, PHOTO_TYPES, labelFor } from '../../constants'
import { getErrorMessage } from '@/lib/utils'

export default function ClientDeliveryReview() {
  const { token } = useParams()
  const [delivery, setDelivery] = useState(null)
  const [error, setError] = useState(null)
  const [accepted, setAccepted] = useState(false)
  const [signing, setSigning] = useState(false)
  const [signError, setSignError] = useState(null)
  const signaturePadRef = useRef(null)

  const load = () => {
    getPublicDelivery(token)
      .then((res) => setDelivery(res.data))
      .catch((err) => setError(err.response?.status === 410 ? 'expired' : 'not-found'))
  }

  useEffect(load, [token])

  if (error) {
    return (
      <PortalShell>
        <p className="text-center text-muted-foreground">
          {error === 'expired'
            ? 'Aquest enllaç ha caducat. Contacta amb el concessionari perquè te\'n generi un de nou.'
            : 'No hem trobat aquesta entrega. Comprova l\'enllaç rebut.'}
        </p>
      </PortalShell>
    )
  }

  if (!delivery) {
    return (
      <PortalShell>
        <p className="text-center text-muted-foreground">Carregant…</p>
      </PortalShell>
    )
  }

  if (delivery.status === 'completed' || delivery.signature) {
    return <SignedConfirmation delivery={delivery} token={token} />
  }

  const handleSign = async () => {
    setSignError(null)
    if (!accepted) {
      setSignError('Has d\'acceptar les condicions abans de signar.')
      return
    }
    if (signaturePadRef.current?.isEmpty()) {
      setSignError('Cal dibuixar la signatura.')
      return
    }

    setSigning(true)
    try {
      await signDelivery(token, signaturePadRef.current.toDataURL(), true)
      toast.success('Signatura registrada correctament.')
      load()
    } catch (err) {
      const message = getErrorMessage(err, 'No s\'ha pogut registrar la signatura.')
      setSignError(message)
      toast.error(message)
    } finally {
      setSigning(false)
    }
  }

  return (
    <PortalShell>
      <h1 className="text-xl font-bold text-foreground">Revisió d'entrega del vehicle</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {delivery.client?.full_name} — {delivery.vehicle?.brand} {delivery.vehicle?.model} ({delivery.vehicle?.plate})
      </p>

      <Section title="Dades del vehicle">
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <Item label="Marca / Model" value={`${delivery.vehicle?.brand} ${delivery.vehicle?.model} ${delivery.vehicle?.version ?? ''}`} />
          <Item label="Matrícula" value={delivery.vehicle?.plate} />
          <Item label="Quilòmetres" value={`${Number(delivery.vehicle?.mileage).toLocaleString('ca-ES')} km`} />
          <Item label="Garantia" value={`${delivery.vehicle?.warranty_months} mesos`} />
        </dl>
      </Section>

      {delivery.check_items?.length > 0 && (
        <Section title="Acta d'estat del vehicle">
          <div className="space-y-3">
            {Object.entries(
              delivery.check_items.reduce((acc, item) => {
                acc[item.category] = acc[item.category] ?? []
                acc[item.category].push(item)
                return acc
              }, {}),
            ).map(([category, items]) => (
              <div key={category}>
                <h4 className="text-sm font-semibold text-foreground">{category}</h4>
                <ul className="mt-1 space-y-1 text-sm">
                  {items.map((item) => (
                    <li key={item.id} className="flex justify-between border-b border-border py-1">
                      <span className="text-foreground">{item.item_name}</span>
                      <span className="text-muted-foreground">
                        {item.status === 'correct' ? 'Correcte' : item.status === 'review' ? 'Revisar' : item.status === 'not_applicable' ? 'Falta' : '—'}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      )}

      {delivery.photos?.length > 0 && (
        <Section title="Fotografies">
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {delivery.photos.map((photo) => (
              <div key={photo.id} className="overflow-hidden rounded-lg border border-border">
                <BlobImage
                  loader={() => getPublicPhotoBlobUrl(token, photo.id)}
                  alt={labelFor(PHOTO_TYPES, photo.type)}
                  className="h-24 w-full object-cover"
                />
              </div>
            ))}
          </div>
        </Section>
      )}

      {delivery.generated_documents?.length > 0 && (
        <Section title="Documentació">
          <ul className="space-y-1 text-sm">
            {delivery.generated_documents.map((doc) => (
              <li key={doc.id}>
                <button
                  className="text-foreground underline"
                  onClick={async () => window.open(await getPublicGeneratedDocumentBlobUrl(token, doc.id), '_blank')}
                >
                  {labelFor(GENERATED_DOCUMENT_TYPES, doc.type)}
                </button>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section title="Signatura">
        <label className="mb-3 flex items-start gap-2 text-sm text-foreground">
          <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} className="mt-0.5" />
          <span>
            He revisat l'estat del vehicle, la documentació i accepto les condicions de l'entrega descrites en aquest
            document.
          </span>
        </label>

        <SignaturePad ref={signaturePadRef} />
        <div className="mt-2 flex justify-end">
          <button
            type="button"
            onClick={() => signaturePadRef.current?.clear()}
            className="text-sm text-muted-foreground underline"
          >
            Esborrar signatura
          </button>
        </div>

        {signError && <p className="mt-2 text-sm text-red-400">{signError}</p>}

        <button
          type="button"
          onClick={handleSign}
          disabled={signing}
          className="mt-4 w-full rounded-lg bg-gradient-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition hover:opacity-90 disabled:opacity-50"
        >
          {signing ? 'Registrant signatura…' : 'Confirmar i signar'}
        </button>
      </Section>
    </PortalShell>
  )
}

function SignedConfirmation({ delivery, token }) {
  return (
    <PortalShell>
      <div className="py-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/10 text-3xl text-emerald-400 ring-1 ring-emerald-400/20">
          ✓
        </div>
        <h1 className="text-xl font-bold text-foreground">Entrega signada correctament</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Gràcies, {delivery.client?.full_name}. Rebràs una còpia de tota la documentació al teu correu electrònic.
        </p>

        {delivery.generated_documents?.length > 0 && (
          <div className="mt-6 text-left">
            <h4 className="mb-2 text-sm font-semibold text-foreground">Documentació</h4>
            <ul className="space-y-1 text-sm">
              {delivery.generated_documents.map((doc) => (
                <li key={doc.id}>
                  <button
                    className="text-foreground underline"
                    onClick={async () => window.open(await getPublicGeneratedDocumentBlobUrl(token, doc.id), '_blank')}
                  >
                    {labelFor(GENERATED_DOCUMENT_TYPES, doc.type)}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </PortalShell>
  )
}

function PortalShell({ children }) {
  return (
    <div className="min-h-screen bg-background px-4 py-6">
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="flex justify-center">
          <Logo />
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5">{children}</div>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="mt-6 border-t border-border pt-4 first:mt-4 first:border-0 first:pt-0">
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">{title}</h3>
      {children}
    </div>
  )
}

function Item({ label, value }) {
  return (
    <div>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  )
}
