import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navigation from './components/Layout/Navigation'
import Header from './components/Layout/Header'
import { Menu } from 'lucide-react'

// Pages
import DashboardPage from './pages/Dashboard'
import ClientsPage from './pages/ClientsPage'
import ClientDetailsPage from './pages/ClientDetailsPage'
import TasksPage from './pages/TasksPage'
import InvoicesPage from './pages/InvoicesPage'
import QuotesPage from './pages/QuotesPage'
import StatisticsPage from './pages/StatisticsPage'
import DocumentsPage from './pages/DocumentsPage'
import CompanyPage from './pages/CompanyPage'
import PaymentsPage from './pages/PaymentsPage'
import SearchPage from './pages/SearchPage'

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155]">
      <div className="flex min-h-screen">
        {/* Menu burger pour mobile */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-blue-600 text-white"
        >
          <Menu />
        </button>

        {/* Sidebar */}
        <div 
          className={`fixed lg:relative w-64 z-40 transition-transform duration-300
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        >
          <div className="h-full m-4 glass-morphism rounded-xl">
            <div className="p-6">
              <h1 className="text-2xl font-bold text-white mb-6">
                FreelanceBox
              </h1>
              <Navigation />
            </div>
          </div>
        </div>

        {/* Overlay mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Contenu principal */}
        <div className="flex-1 flex flex-col min-h-screen p-4">
          <div className="glass-morphism rounded-xl mb-4">
            <Header />
          </div>

          <div className="flex-1 glass-morphism rounded-xl p-6 overflow-auto">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/clients" element={<ClientsPage />} />
              <Route path="/clients/:id" element={<ClientDetailsPage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/invoices" element={<InvoicesPage />} />
              <Route path="/quotes" element={<QuotesPage />} />
              <Route path="/stats" element={<StatisticsPage />} />
              <Route path="/documents" element={<DocumentsPage />} />
              <Route path="/company" element={<CompanyPage />} />
              <Route path="/payments" element={<PaymentsPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
