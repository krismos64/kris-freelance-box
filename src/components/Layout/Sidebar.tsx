import React from 'react'
import { 
  Briefcase, 
  FileText, 
  Users, 
  BarChart, 
  CheckSquare, 
  Home 
} from 'lucide-react'

const Sidebar: React.FC = () => {
  const menuItems = [
    { icon: <Home />, label: 'Tableau de Bord', path: '/' },
    { icon: <Briefcase />, label: 'Devis', path: '/devis' },
    { icon: <FileText />, label: 'Factures', path: '/factures' },
    { icon: <Users />, label: 'Clients', path: '/clients' },
    { icon: <BarChart />, label: 'Chiffre d\'Affaires', path: '/stats' },
    { icon: <CheckSquare />, label: 'Checklist', path: '/checklist' }
  ]

  return (
    <div className="bg-gradient-to-br from-[#1e40af] to-[#3b82f6] h-screen w-64 p-4 shadow-2xl overflow-hidden">
      <div className="flex items-center mb-10 animate-[fadeIn_1s_ease-out]">
        <Briefcase className="mr-3 text-yellow-300 animate-pulse" size={40} />
        <h1 className="text-3xl font-bold text-white tracking-wide">
          FreelanceBox
        </h1>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item, index) => (
          <div 
            key={index} 
            className="flex items-center p-3 rounded-lg transition-all 
            duration-300 ease-in-out transform hover:scale-105 
            hover:bg-white/10 cursor-pointer group"
          >
            {React.cloneElement(item.icon, { 
              className: 'mr-3 text-white/80 group-hover:text-yellow-300 transition-colors' 
            })}
            <span className="text-white group-hover:text-yellow-300 transition-colors">
              {item.label}
            </span>
          </div>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar
