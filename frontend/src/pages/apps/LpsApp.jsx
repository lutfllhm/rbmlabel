import { Routes, Route, Navigate } from 'react-router-dom'
import ModernLayout from '../../components/layout/ModernLayout'
import LpsDashboard from './lps/LpsDashboard'
import LpsList from './lps/LpsList'
import LpsCreate from './lps/LpsCreate'
import LpsFinish from './lps/LpsFinish'
import LpsReports from './lps/LpsReports'
import LpsUsers from './lps/LpsUsers'
import LpsSettings from './lps/LpsSettings'

const LpsApp = () => {
  return (
    <ModernLayout app="lps">
      <Routes>
        <Route path="/" element={<Navigate to="/apps/lps/dashboard" replace />} />
        <Route path="/dashboard" element={<LpsDashboard />} />
        <Route path="/list" element={<LpsList />} />
        <Route path="/create" element={<LpsCreate />} />
        <Route path="/finish" element={<LpsFinish />} />
        <Route path="/reports" element={<LpsReports />} />
        <Route path="/users" element={<LpsUsers />} />
        <Route path="/settings" element={<LpsSettings />} />
        <Route path="*" element={<Navigate to="/apps/lps/dashboard" replace />} />
      </Routes>
    </ModernLayout>
  )
}

export default LpsApp