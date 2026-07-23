import api from './client'

export const listDeliveries = (params) => api.get('/deliveries', { params })
export const getDelivery = (id) => api.get(`/deliveries/${id}`)
export const createDelivery = (data) => api.post('/deliveries', data)
export const updateDelivery = (id, data) => api.put(`/deliveries/${id}`, data)
export const deleteDelivery = (id) => api.delete(`/deliveries/${id}`)

export const getCheckItems = (deliveryId) => api.get(`/deliveries/${deliveryId}/check-items`)
export const updateCheckItems = (deliveryId, items) => api.put(`/deliveries/${deliveryId}/check-items`, { items })

export const listPhotos = (deliveryId) => api.get(`/deliveries/${deliveryId}/photos`)
export const uploadPhoto = (deliveryId, formData) =>
  api.post(`/deliveries/${deliveryId}/photos`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
export const deletePhoto = (deliveryId, photoId) => api.delete(`/deliveries/${deliveryId}/photos/${photoId}`)
export const getPhotoBlobUrl = (deliveryId, photoId) =>
  api.get(`/deliveries/${deliveryId}/photos/${photoId}`, { responseType: 'blob' }).then((res) => URL.createObjectURL(res.data))

export const listDocuments = (deliveryId) => api.get(`/deliveries/${deliveryId}/documents`)
export const uploadDocument = (deliveryId, formData) =>
  api.post(`/deliveries/${deliveryId}/documents`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
export const deleteDocument = (deliveryId, documentId) => api.delete(`/deliveries/${deliveryId}/documents/${documentId}`)

export const listGeneratedDocuments = (deliveryId) => api.get(`/deliveries/${deliveryId}/generated-documents`)
export const generateDocuments = (deliveryId, type) =>
  api.post(`/deliveries/${deliveryId}/generated-documents`, type ? { type } : {})
export const getGeneratedDocumentBlobUrl = (deliveryId, documentId) =>
  api
    .get(`/deliveries/${deliveryId}/generated-documents/${documentId}`, { responseType: 'blob' })
    .then((res) => URL.createObjectURL(res.data))

export const getDocumentBlobUrl = (deliveryId, documentId) =>
  api.get(`/deliveries/${deliveryId}/documents/${documentId}`, { responseType: 'blob' }).then((res) => URL.createObjectURL(res.data))
