import React from 'react'
import { motion } from 'framer-motion'
import GlobalSearch from '../GlobalSearch'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="p-4 flex justify-between items-center">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1"
      >
        <GlobalSearch />
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center space-x-4"
      >
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
          aria-label="Changer de thème"
        >
          {theme === 'dark' ? (
            <Sun className="text-white w-5 h-5" />
          ) : (
            <Moon className="text-black w-5 h-5" />
          )}
        </button>
      </motion.div>
    </header>
  )
}

export default Header
