import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import ClientLayout from './components/ClientLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ClientList from './pages/clients/ClientList'
import ClientForm from './pages/clients/ClientForm'
import VehicleList from './pages/vehicles/VehicleList'
import VehicleForm from './pages/vehicles/VehicleForm'
import DeliveryList from './pages/deliveries/DeliveryList'
import DeliveryForm from './pages/deliveries/DeliveryForm'
import DeliveryDetail from './pages/deliveries/DeliveryDetail'
import ClientDeliveryReview from './pages/portal/ClientDeliveryReview'
import MyDeliveries from './pages/portal/MyDeliveries'
import PortalDeliveryDetail from './pages/portal/DeliveryDetail'

const STAFF_ROLES = ['admin', 'comercial']

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" richColors />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/entrega/:token" element={<ClientDeliveryReview />} />

          <Route
            path="/portal"
            element={
              <ProtectedRoute allow={['client']}>
                <ClientLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<MyDeliveries />} />
            <Route path=":id" element={<PortalDeliveryDetail />} />
          </Route>

          <Route
            path="/"
            element={
              <ProtectedRoute allow={STAFF_ROLES}>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="clients" element={<ClientList />} />
            <Route path="clients/:id" element={<ClientForm />} />
            <Route path="vehicles" element={<VehicleList />} />
            <Route path="vehicles/:id" element={<VehicleForm />} />
            <Route path="entregues" element={<DeliveryList />} />
            <Route path="entregues/nova" element={<DeliveryForm />} />
            <Route path="entregues/:id" element={<DeliveryDetail />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
