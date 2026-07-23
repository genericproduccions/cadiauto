import axios from 'axios'

const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { Accept: 'application/json' },
})

export const getPublicDelivery = (token) => publicApi.get(`/public/deliveries/${token}`)

export const getPublicPhotoBlobUrl = (token, photoId) =>
  publicApi.get(`/public/deliveries/${token}/photos/${photoId}`, { responseType: 'blob' }).then((res) => URL.createObjectURL(res.data))

export const getPublicGeneratedDocumentBlobUrl = (token, documentId) =>
  publicApi
    .get(`/public/deliveries/${token}/generated-documents/${documentId}`, { responseType: 'blob' })
    .then((res) => URL.createObjectURL(res.data))

export const signDelivery = (token, signatureImage, legalAcceptance) =>
  publicApi.post(`/public/deliveries/${token}/sign`, {
    signature_image: signatureImage,
    legal_acceptance: legalAcceptance,
  })
