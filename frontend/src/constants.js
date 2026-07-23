export const PHOTO_TYPES = [
  { value: 'front', label: 'Vista frontal' },
  { value: 'rear', label: 'Vista posterior' },
  { value: 'left_side', label: 'Lateral esquerre' },
  { value: 'right_side', label: 'Lateral dret' },
  { value: 'interior', label: 'Interior' },
  { value: 'dashboard', label: 'Quadre/salpicader' },
  { value: 'mileage', label: 'Quilometratge' },
  { value: 'wheels', label: 'Rodes' },
  { value: 'damage', label: 'Danys concrets' },
  { value: 'other', label: 'Altres' },
]

export const DOCUMENT_TYPES = [
  { value: 'client_dni', label: 'DNI client' },
  { value: 'technical_sheet', label: 'Fitxa tècnica' },
  { value: 'circulation_permit', label: 'Permís de circulació' },
  { value: 'itv', label: 'ITV' },
  { value: 'external_warranty', label: 'Contracte garantia extern' },
  { value: 'other', label: 'Altres documents' },
]

export const GENERATED_DOCUMENT_TYPES = [
  { value: 'sale_contract', label: 'Contracte de compravenda' },
  { value: 'conformity_declaration', label: 'Declaració de conformitat' },
  { value: 'warranty_annex', label: 'Annex de garantia' },
  { value: 'used_vehicle_order', label: 'Comanda de vehicle usat' },
  { value: 'vehicle_status_report', label: "Acta d'estat del vehicle" },
]

export const CHECK_STATUS_OPTIONS = [
  { value: '', label: 'Sense revisar' },
  { value: 'correct', label: 'Correcte' },
  { value: 'review', label: 'Revisar' },
  { value: 'not_applicable', label: 'Falta' },
]

export const labelFor = (list, value) => list.find((item) => item.value === value)?.label ?? value
