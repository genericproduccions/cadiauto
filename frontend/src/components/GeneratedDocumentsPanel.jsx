import { useState } from 'react'
import { toast } from 'sonner'
import { generateDocuments, getGeneratedDocumentBlobUrl } from '../api/deliveries'
import { GENERATED_DOCUMENT_TYPES, labelFor } from '../constants'
import { getErrorMessage } from '@/lib/utils'

export default function GeneratedDocumentsPanel({ deliveryId, documents, onChange, accessToken }) {
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  const clientUrl = `${window.location.origin}/entrega/${accessToken}`

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const res = await generateDocuments(deliveryId)
      onChange(res.data)
      toast.success('Documents PDF generats correctament.')
    } catch (err) {
      toast.error(getErrorMessage(err, 'No s\'han pogut generar els documents.'))
    } finally {
      setGenerating(false)
    }
  }

  const handleView = async (documentId) => {
    const url = await getGeneratedDocumentBlobUrl(deliveryId, documentId)
    window.open(url, '_blank')
  }

  const copyLink = () => {
    navigator.clipboard.writeText(clientUrl)
    setCopied(true)
    toast.success('Enllaç copiat al porta-retalls.')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-surface p-4">
        <h3 className="mb-2 font-semibold text-foreground">Enllaç privat per al client</h3>
        <div className="flex flex-wrap items-center gap-2">
          <code className="flex-1 truncate rounded-lg bg-background px-3 py-2 text-xs text-muted-foreground">{clientUrl}</code>
          <button
            type="button"
            onClick={copyLink}
            className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            {copied ? 'Copiat!' : 'Copiar'}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Documents PDF</h3>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {generating ? 'Generant…' : 'Generar tots els documents'}
          </button>
        </div>

        <table className="w-full text-sm">
          <tbody className="divide-y divide-border">
            {documents.map((doc) => (
              <tr key={doc.id}>
                <td className="px-2 py-2 text-foreground">{labelFor(GENERATED_DOCUMENT_TYPES, doc.type)}</td>
                <td className="px-2 py-2 text-muted-foreground">v{doc.version}</td>
                <td className="px-2 py-2 text-right">
                  <button onClick={() => handleView(doc.id)} className="text-foreground hover:underline">
                    Veure PDF
                  </button>
                </td>
              </tr>
            ))}
            {documents.length === 0 && (
              <tr>
                <td colSpan={3} className="px-2 py-8 text-center text-muted-foreground">
                  Encara no s'ha generat cap document.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
