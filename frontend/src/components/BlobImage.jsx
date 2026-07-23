import { useEffect, useState } from 'react'

export default function BlobImage({ loader, alt, className }) {
  const [src, setSrc] = useState(null)

  useEffect(() => {
    let objectUrl
    let cancelled = false

    loader().then((url) => {
      if (cancelled) {
        URL.revokeObjectURL(url)
        return
      }
      objectUrl = url
      setSrc(url)
    })

    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!src) {
    return <div className={`animate-pulse bg-white/5 ${className}`} />
  }

  return <img src={src} alt={alt} className={className} />
}
