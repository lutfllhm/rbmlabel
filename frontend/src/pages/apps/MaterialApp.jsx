import { Routes, Route, Navigate } from 'react-router-dom'
import ModernLayout from '../../components/layout/ModernLayout'
import MaterialDashboard from './material/MaterialDashboard'
import MaterialStock from './material/MaterialStock'
import MaterialCategories from './material/MaterialCategories'
import MaterialLabels from './material/MaterialLabels'
import MaterialSPK from './material/MaterialSPK'
import MaterialReports from './material/MaterialReports'
import MaterialUsers from './material/MaterialUsers'
import MaterialSettings from './material/MaterialSettings'

const MaterialApp = () => {
  return (
    <ModernLayout app="material">
      <Routes>
        <Route path="/" element={<Navigate to="/apps/material/dashboard" replace />} />
        <Route path="/dashboard" element={<MaterialDashboard />} />
        <Route path="/stock" element={<MaterialStock />} />
        <Route path="/categories" element={<MaterialCategories />} />
        <Route path="/labels" element={<MaterialLabels />} />
        <Route path="/spk" element={<MaterialSPK />} />
        <Route path="/reports" element={<MaterialReports />} />
        <Route path="/users" element={<MaterialUsers />} />
        <Route path="/settings" element={<MaterialSettings />} />
        <Route path="*" element={<Navigate to="/apps/material/dashboard" replace />} />
      </Routes>
    </ModernLayout>
  )
}

export default MaterialApp