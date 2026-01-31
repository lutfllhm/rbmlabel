import { Routes, Route, Navigate } from 'react-router-dom'
import ModernLayout from '../../components/layout/ModernLayout'
import StoklabelDashboard from './stoklabel/StoklabelDashboard'
import StoklabelStock from './stoklabel/StoklabelStock'
import StoklabelMasuk from './stoklabel/StoklabelMasuk'
import StoklabelKeluar from './stoklabel/StoklabelKeluar'
import StoklabelSuratJalan from './stoklabel/StoklabelSuratJalan'
import StoklabelReports from './stoklabel/StoklabelReports'
import StoklabelUsers from './stoklabel/StoklabelUsers'
import StoklabelSettings from './stoklabel/StoklabelSettings'

const StoklabelApp = () => {
  return (
    <ModernLayout app="stoklabel">
      <Routes>
        <Route path="/" element={<Navigate to="/apps/stoklabel/dashboard" replace />} />
        <Route path="/dashboard" element={<StoklabelDashboard />} />
        <Route path="/stock" element={<StoklabelStock />} />
        <Route path="/masuk" element={<StoklabelMasuk />} />
        <Route path="/keluar" element={<StoklabelKeluar />} />
        <Route path="/surat-jalan" element={<StoklabelSuratJalan />} />
        <Route path="/reports" element={<StoklabelReports />} />
        <Route path="/users" element={<StoklabelUsers />} />
        <Route path="/settings" element={<StoklabelSettings />} />
        <Route path="*" element={<Navigate to="/apps/stoklabel/dashboard" replace />} />
      </Routes>
    </ModernLayout>
  )
}

export default StoklabelApp