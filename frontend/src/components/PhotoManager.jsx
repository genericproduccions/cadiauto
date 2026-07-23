import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { Upload, Trash2 } from 'lucide-react'
import { deletePhoto, getPhotoBlobUrl, uploadPhoto } from '../api/deliveries'
import { PHOTO_TYPES, labelFor } from '../constants'
import BlobImage from './BlobImage'
import { Combobox } from '@/components/ui/combobox'
import { getErrorMessage } from '@/lib/utils'

export default function PhotoManager({ deliveryId, photos, onChange }) {
  const [type, setType] = useState('front')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileSelected = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('photo', file)
    formData.append('type', type)

    try {
      const res = await uploadPhoto(deliveryId, formData)
      onChange([...photos, res.data])
      toast.success('Foto pujada correctament.')
    } catch (err) {
      toast.error(getErrorMessage(err, 'No s\'ha pogut pujar la foto.'))
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleDelete = async (photoId) => {
    try {
      await deletePhoto(deliveryId, photoId)
      onChange(photos.filter((p) => p.id !== photoId))
      toast.success('Foto eliminada.')
    } catch (err) {
      toast.error(getErrorMessage(err, 'No s\'ha pogut eliminar la foto.'))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-border bg-surface p-4">
        <div className="w-56">
          <label className="mb-1 block text-sm font-medium text-foreground">Tipus de foto</label>
          <Combobox options={PHOTO_TYPES} value={type} onChange={setType} />
        </div>
        <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
          <Upload className="h-4 w-4" />
          {uploading ? 'Pujant…' : 'Pujar foto'}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelected}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {photos.length === 0 && <p className="text-sm text-muted-foreground">Encara no s'ha pujat cap foto.</p>}

      {Object.entries(groupByType(photos)).map(([type, typePhotos]) => (
        <div key={type}>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {labelFor(PHOTO_TYPES, type)} ({typePhotos.length})
          </h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {typePhotos.map((photo) => (
              <div key={photo.id} className="group relative overflow-hidden rounded-xl border border-border bg-surface">
                <BlobImage
                  loader={() => getPhotoBlobUrl(deliveryId, photo.id)}
                  alt={labelFor(PHOTO_TYPES, photo.type)}
                  className="h-32 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleDelete(photo.id)}
                  className="absolute right-1 top-1 hidden items-center gap-1 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white group-hover:flex"
                >
                  <Trash2 className="h-3 w-3" />
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function groupByType(photos) {
  return photos.reduce((acc, photo) => {
    acc[photo.type] = acc[photo.type] ?? []
    acc[photo.type].push(photo)
    return acc
  }, {})
}
