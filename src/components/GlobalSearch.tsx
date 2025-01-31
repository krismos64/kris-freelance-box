import React from 'react'
import { Search } from 'lucide-react'
import { Link } from 'react-router-dom'

const GlobalSearch: React.FC = () => {
  return (
    <div className="relative z-50">
      <Link
        to="/search"
        className="flex items-center bg-white/10 hover:bg-white/20 text-white rounded-full 
        px-4 py-2 text-sm transition-all duration-300 w-64 justify-start"
      >
        <Search className="w-5 h-5 mr-2" />
        <span className="opacity-70">Rechercher...</span>
      </Link>
    </div>
  )
}

export default GlobalSearch
