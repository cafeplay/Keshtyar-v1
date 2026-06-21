'use client'

import { useState, useEffect } from 'react'
import { Menu, Moon, Sun, Circle, Wifi } from 'lucide-react'

interface NavbarProps {
  onMenuClick: () => void
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const [isDark, setIsDark] = useState(false)
  
  useEffect(() => {
    if (localStorage.getItem('darkMode') === 'true') {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    }
  }, [])
  
  const toggleDark = () => {
    const newDark = !isDark
    setIsDark(newDark)
    document.documentElement.classList.toggle('dark')
    localStorage.setItem('darkMode', String(newDark))
  }
  
  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 md:px-6 py-3">
        <div className="flex items-center gap-3">
          <button 
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <span className="text-sm text-gray-400 dark:text-gray-500 hidden md:inline">
            🌱 داشبورد مدیریت مزرعه
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleDark}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Circle className="w-2 h-2 text-emerald-500 fill-emerald-500" />
            <span>دستگاه آنلاین</span>
          </div>
        </div>
      </div>
    </header>
  )
}
