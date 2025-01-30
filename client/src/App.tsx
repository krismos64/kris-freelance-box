import React from 'react'
    import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
    import Dashboard from './components/Dashboard'
    import Quotes from './components/Quotes'
    import Invoices from './components/Invoices'
    import Clients from './components/Clients'
    import Tasks from './components/Tasks'
    import Settings from './components/Settings'
    import Documents from './components/Documents'
    import Layout from './components/Layout'

    function App() {
      return (
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/quotes" element={<Quotes />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/documents" element={<Documents />} />
            </Routes>
          </Layout>
        </Router>
      )
    }

    export default App
