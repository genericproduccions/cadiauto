import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { Upload, FileText, Download, Trash2 } from 'lucide-react'
import { deleteDocument, getDocumentBlobUrl, uploadDocument } from '../api/deliveries'
import { DOCUMENT_TYPES, labelFor } from '../constants'
import { Combobox } from '@/components/ui/combobox'
import { getErrorMessage } from '@/lib/utils'

export default function DocumentManager({ deliveryId, documents, onChange }) {
  const [type, setType] = useState('client_dni')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileSelected = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('document', file)
    formData.append('type', type)

    try {
      const res = await uploadDocument(deliveryId, formData)
      onChange([...documents, res.data])
      toast.success('Document pujat correctament.')
    } catch (err) {
      toast.error(getErrorMessage(err, 'No s\'ha pogut pujar el document.'))
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleDelete = async (documentId) => {
    try {
      await deleteDocument(deliveryId, documentId)
      onChange(documents.filter((d) => d.id !== documentId))
      toast.success('Document eliminat.')
    } catch (err) {
      toast.error(getErrorMessage(err, 'No s\'ha pogut eliminar el document.'))
    }
  }

  const handleDownload = async (documentId, filename) => {
    const url = await getDocumentBlobUrl(deliveryId, documentId)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-border bg-surface p-4">
        <div className="w-56">
          <label className="mb-1 block text-sm font-medium text-foreground">Tipus de document</label>
          <Combobox options={DOCUMENT_TYPES} value={type} onChange={setType} />
        </div>
        <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
          <Upload className="h-4 w-4" />
          {uploading ? 'Pujant…' : 'Pujar document'}
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,image/*"
            onChange={handleFileSelected}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border">
        {documents.map((doc) => (
          <div key={doc.id} className="flex items-center justify-between px-4 py-3 transition hover:bg-surface-elevated">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm text-foreground">{doc.original_name}</div>
                <div className="text-xs text-muted-foreground">{labelFor(DOCUMENT_TYPES, doc.type)}</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleDownload(doc.id, doc.original_name)}
                className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:underline"
              >
                <Download className="h-4 w-4" />
                Descarregar
              </button>
              <button onClick={() => handleDelete(doc.id)} className="text-red-400 hover:text-red-300">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {documents.length === 0 && (
          <p className="px-4 py-8 text-center text-muted-foreground">Encara no s'ha pujat cap document.</p>
        )}
      </div>
    </div>
  )
}
