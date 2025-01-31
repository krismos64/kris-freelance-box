import React, { createContext, useState, useContext, useEffect } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {}
})

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Récupérer le thème du localStorage ou utiliser le thème sombre par défaut
    const savedTheme = localStorage.getItem('theme') as Theme
    return savedTheme || 'dark'
  })

  useEffect(() => {
    // Ajouter la classe de thème au body
    document.body.classList.remove('light', 'dark')
    document.body.classList.add(theme)
    
    // Sauvegarder le thème dans localStorage
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Hook personnalisé pour utiliser le thème
export const useTheme = () => useContext(ThemeContext)
