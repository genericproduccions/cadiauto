import api from './client'

export const listMyDeliveries = () => api.get('/my/deliveries')
export const getMyDelivery = (id) => api.get(`/my/deliveries/${id}`)

export const getMyPhotoBlobUrl = (deliveryId, photoId) =>
  api.get(`/my/deliveries/${deliveryId}/photos/${photoId}`, { responseType: 'blob' }).then((res) => URL.createObjectURL(res.data))

export const getMyDocumentBlobUrl = (deliveryId, documentId) =>
  api
    .get(`/my/deliveries/${deliveryId}/documents/${documentId}`, { responseType: 'blob' })
    .then((res) => URL.createObjectURL(res.data))

export const getMyGeneratedDocumentBlobUrl = (deliveryId, documentId) =>
  api
    .get(`/my/deliveries/${deliveryId}/generated-documents/${documentId}`, { responseType: 'blob' })
    .then((res) => URL.createObjectURL(res.data))
