import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* Future routes — add when ready */}
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        {/* <Route path="/health-score" element={<HealthScore />} /> */}
        {/* <Route path="/fire-planner" element={<FirePlanner />} /> */}
        {/* <Route path="/tax-wizard" element={<TaxWizard />} /> */}
        {/* <Route path="/portfolio" element={<Portfolio />} /> */}
        {/* <Route path="/couples" element={<CouplesPlanner />} /> */}
      </Routes>
    </BrowserRouter>
  )
}