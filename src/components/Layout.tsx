import React, { useState, useEffect } from 'react'
    import { NavLink, useLocation } from 'react-router-dom'
    import {
      Layout as LayoutIcon,
      FileText,
      File,
      Users,
      ListChecks,
      Settings as SettingsIcon,
      Folder,
      Menu,
      X,
      Wallet,
      Plus,
      Trash2,
      Calendar,
    } from 'lucide-react'
    import RevenueModal from './RevenueModal'

    interface Revenue {
      id: string
      date: string
      amount: number
    }

    const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
      const [isSidebarOpen, setIsSidebarOpen] = useState(false)
      const location = useLocation()
      const [companyInfo, setCompanyInfo] = useState<{
        companyName: string
        logoUrl: string
        address: string
        postalCode: string
        city: string
        phone: string
        email: string
      } | null>(null)
      const [revenues, setRevenues] = useState<Revenue[]>([])
      const [isRevenueModalOpen, setIsRevenueModalOpen] = useState(false)
      const [selectedRevenue, setSelectedRevenue] = useState<Revenue | null>(
        null,
      )
      const [selectedRevenuesToDelete, setSelectedRevenuesToDelete] = useState<
        string[]
      >([])
      const [filterOption, setFilterOption] = useState<'month' | 'week' | 'year' | 'custom'>('month')
      const [startDate, setStartDate] = useState<string | null>(null)
      const [endDate, setEndDate] = useState<string | null>(null)

      useEffect(() => {
        const storedSettings = localStorage.getItem('companySettings')
        if (storedSettings) {
          const settings = JSON.parse(storedSettings)
          setCompanyInfo({
            companyName: settings.companyName,
            logoUrl: settings.logoUrl,
            address: settings.address,
            postalCode: settings.postalCode,
            city: settings.city,
            phone: settings.phone,
            email: settings.email,
          })
        }
        const storedRevenues = localStorage.getItem('revenues')
        if (storedRevenues) {
          setRevenues(JSON.parse(storedRevenues))
        }
      }, [])

      useEffect(() => {
        localStorage.setItem('revenues', JSON.stringify(revenues))
      }, [revenues])

      const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen)
      }

      const closeSidebar = () => {
        setIsSidebarOpen(false)
      }

      const handleAddRevenue = () => {
        setSelectedRevenue(null)
        setIsRevenueModalOpen(true)
      }

      const handleCloseRevenueModal = () => {
        setIsRevenueModalOpen(false)
        setSelectedRevenue(null)
      }

      const handleSaveRevenue = (revenue: Revenue) => {
        if (selectedRevenue) {
          setRevenues(
            revenues.map((r) => (r.id === selectedRevenue.id ? revenue : r)),
          )
        } else {
          setRevenues([...revenues, revenue])
        }
        setIsRevenueModalOpen(false)
      }

      const handleToggleSelectRevenueToDelete = (id: string) => {
        if (selectedRevenuesToDelete.includes(id)) {
          setSelectedRevenuesToDelete(
            selectedRevenuesToDelete.filter((revenueId) => revenueId !== id),
          )
        } else {
          setSelectedRevenuesToDelete([...selectedRevenuesToDelete, id])
        }
      }

      const handleDeleteSelectedRevenues = () => {
        const confirmDelete = window.confirm(
          'Êtes-vous sûr de vouloir supprimer les recettes sélectionnées ?',
        )
        if (confirmDelete) {
          setRevenues(
            revenues.filter(
              (revenue) => !selectedRevenuesToDelete.includes(revenue.id),
            ),
          )
          setSelectedRevenuesToDelete([])
        }
      }

      const handleFilterChange = (option: 'month' | 'week' | 'year' | 'custom') => {
        setFilterOption(option)
        setStartDate(null)
        setEndDate(null)
      }

      const handleCustomDateChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'start' | 'end') => {
        if (type === 'start') {
          setStartDate(e.target.value)
        } else {
          setEndDate(e.target.value)
        }
      }

      const filterRevenues = (): Revenue[] => {
        let filtered = [...revenues]
        if (filterOption === 'month') {
          filtered = filtered.filter(
            (revenue) =>
              new Date(revenue.date).getMonth() === new Date().getMonth() &&
              new Date(revenue.date).getFullYear() === new Date().getFullYear(),
          )
        } else if (filterOption === 'week') {
          const now = new Date()
          const startOfWeek = new Date(
            now.setDate(now.getDate() - now.getDay()),
          )
          const endOfWeek = new Date(
            now.setDate(now.getDate() + 6),
          )
          filtered = filtered.filter(
            (revenue) =>
              new Date(revenue.date) >= startOfWeek &&
              new Date(revenue.date) <= endOfWeek,
          )
        } else if (filterOption === 'year') {
          filtered = filtered.filter(
            (revenue) =>
              new Date(revenue.date).getFullYear() === new Date().getFullYear(),
          )
        } else if (filterOption === 'custom' && startDate && endDate) {
          filtered = filtered.filter(
            (revenue) =>
              new Date(revenue.date) >= new Date(startDate) &&
              new Date(revenue.date) <= new Date(endDate),
          )
        }
        return filtered
      }

      const totalRevenue = filterRevenues().reduce(
        (acc, revenue) => acc + revenue.amount,
        0,
      )

      return (
        <div className="min-h-screen bg-gray-100">
          <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="lg:hidden focus:outline-none mr-4"
              >
                {isSidebarOpen ? <X /> : <Menu />}
              </button>
              <span className="font-bold text-xl">
                <LayoutIcon className="inline-block mr-2" />
                Kris Freelance Box
              </span>
            </div>
          </nav>

          <div className="flex">
            <aside
              className={`bg-gray-700 text-white w-64 min-h-screen p-4 space-y-4 fixed top-0 left-0 transition-transform transform lg:translate-x-0 ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
              } lg:relative lg:block z-10 flex flex-col`}
            >
              <nav>
                <NavLink
                  to="/"
                  className={`block p-2 rounded hover:bg-gray-600 ${
                    location.pathname === '/' ? 'bg-gray-600' : ''
                  }`}
                  onClick={closeSidebar}
                >
                  <LayoutIcon className="inline-block mr-2" />
                  Tableau de bord
                </NavLink>
                <NavLink
                  to="/quotes"
                  className={`block p-2 rounded hover:bg-gray-600 ${
                    location.pathname === '/quotes' ? 'bg-gray-600' : ''
                  }`}
                  onClick={closeSidebar}
                >
                  <FileText className="inline-block mr-2" />
                  Devis
                </NavLink>
                <NavLink
                  to="/invoices"
                  className={`block p-2 rounded hover:bg-gray-600 ${
                    location.pathname === '/invoices' ? 'bg-gray-600' : ''
                  }`}
                  onClick={closeSidebar}
                >
                  <File className="inline-block mr-2" />
                  Factures
                </NavLink>
                <NavLink
                  to="/clients"
                  className={`block p-2 rounded hover:bg-gray-600 ${
                    location.pathname === '/clients' ? 'bg-gray-600' : ''
                  }`}
                  onClick={closeSidebar}
                >
                  <Users className="inline-block mr-2" />
                  Clients
                </NavLink>
                <NavLink
                  to="/tasks"
                  className={`block p-2 rounded hover:bg-gray-600 ${
                    location.pathname === '/tasks' ? 'bg-gray-600' : ''
                  }`}
                  onClick={closeSidebar}
                >
                  <ListChecks className="inline-block mr-2" />
                  Tâches
                </NavLink>
                <NavLink
                  to="/documents"
                  className={`block p-2 rounded hover:bg-gray-600 ${
                    location.pathname === '/documents' ? 'bg-gray-600' : ''
                  }`}
                  onClick={closeSidebar}
                >
                  <Folder className="inline-block mr-2" />
                  Documents
                </NavLink>
                <NavLink
                  to="/settings"
                  className={`block p-2 rounded hover:bg-gray-600 ${
                    location.pathname === '/settings' ? 'bg-gray-600' : ''
                  }`}
                  onClick={closeSidebar}
                >
                  <SettingsIcon className="inline-block mr-2" />
                  Paramètres
                </NavLink>
              </nav>
              {companyInfo && (
                <div className="mt-auto p-2 border-t border-gray-600">
                  {companyInfo.logoUrl && (
                    <img
                      src={companyInfo.logoUrl}
                      alt="Company Logo"
                      className="w-16 h-16 rounded-full object-cover mb-2"
                    />
                  )}
                  <p className="text-sm font-bold">{companyInfo.companyName}</p>
                  <p className="text-xs">{companyInfo.address}</p>
                  <p className="text-xs">
                    {companyInfo.postalCode} {companyInfo.city}
                  </p>
                  <p className="text-xs">{companyInfo.phone}</p>
                  <p className="text-xs">{companyInfo.email}</p>
                </div>
              )}
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">Chiffre d'affaires</h3>
                  <button
                    onClick={handleAddRevenue}
                    className="text-green-500 hover:text-green-700"
                  >
                    <Plus />
                  </button>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <button
                    onClick={() => handleFilterChange('month')}
                    className={`text-sm ${filterOption === 'month' ? 'font-bold' : ''}`}
                  >
                    Mois
                  </button>
                  <button
                    onClick={() => handleFilterChange('week')}
                    className={`text-sm ${filterOption === 'week' ? 'font-bold' : ''}`}
                  >
                    Semaine
                  </button>
                  <button
                    onClick={() => handleFilterChange('year')}
                    className={`text-sm ${filterOption === 'year' ? 'font-bold' : ''}`}
                  >
                    Année
                  </button>
                  <button
                    onClick={() => handleFilterChange('custom')}
                    className={`text-sm ${filterOption === 'custom' ? 'font-bold' : ''}`}
                  >
                    Période
                  </button>
                </div>
                {filterOption === 'custom' && (
                  <div className="flex items-center space-x-2 mb-2">
                    <input
                      type="date"
                      className="text-sm border rounded p-1 text-gray-700"
                      onChange={(e) => handleCustomDateChange(e, 'start')}
                    />
                    <input
                      type="date"
                      className="text-sm border rounded p-1 text-gray-700"
                      onChange={(e) => handleCustomDateChange(e, 'end')}
                    />
                  </div>
                )}
                <p className="text-xl font-bold">{totalRevenue} €</p>
                {selectedRevenuesToDelete.length > 0 && (
                  <button
                    onClick={handleDeleteSelectedRevenues}
                    className="text-red-500 hover:text-red-700 flex items-center mt-2"
                  >
                    <Trash2 className="mr-1" />
                    Supprimer
                  </button>
                )}
                <ul className="space-y-1">
                  {filterRevenues().map((revenue) => (
                    <li
                      key={revenue.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={selectedRevenuesToDelete.includes(revenue.id)}
                          onChange={() =>
                            handleToggleSelectRevenueToDelete(revenue.id)
                          }
                        />
                        <span className="text-sm">
                          {new Date(revenue.date).toLocaleDateString()} -{' '}
                          {revenue.amount}€
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            <main className="flex-1 p-4 lg:ml-64">
              {children}
            </main>
          </div>
          {isRevenueModalOpen && (
            <RevenueModal
              isOpen={isRevenueModalOpen}
              onClose={handleCloseRevenueModal}
              onSave={handleSaveRevenue}
              revenue={selectedRevenue}
            />
          )}
        </div>
      )
    }

    export default Layout
