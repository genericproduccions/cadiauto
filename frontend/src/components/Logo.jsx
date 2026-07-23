import logoBlanc from '../assets/logo_blanc.avif'

export default function Logo({ label = 'Àrea de Clients' }) {
  return (
    <div className="flex items-center gap-3">
      <img src={logoBlanc} alt="Cadí Auto" className="h-9 w-auto" />
    </div>
  )
}
