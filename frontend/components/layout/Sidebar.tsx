'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  History,
  Plug,
  Settings,
  Bell,
  UserCog,
  Cpu,
  Leaf,
  X
} from 'lucide-react'

interface SidebarProps {
  open: boolean
  onClose: () => void
}

const menuItems = [
  { icon: LayoutDashboard, label: 'داشبورد', href: '/dashboard' },
  { icon: History, label: 'تاریخچه', href: '/history' },
  { icon: Plug, label: 'رله‌ها', href: '/relays' },
  { icon: Settings, label: 'قوانین', href: '/rules' },
  { icon: Bell, label: 'هشدارها', href: '/alerts' },
  { icon: UserCog, label: 'تنظیمات', href: '/settings' },
  { icon: Cpu, label: 'دستگاه', href: '/device' },
]

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname()
  
  return (
    <>
      {/* Overlay - فقط وقتی باز باشه نمایش داده بشه */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar - وقتی بسته است، کاملاً از صفحه خارج بشه */}
      <aside className={`
        fixed top-0 right-0 h-full w-72 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md 
        border-l border-gray-100 dark:border-gray-800
        transition-transform duration-300 ease-in-out z-50
        ${open ? 'translate-x-0' : 'translate-x-full'}
        overflow-y-auto
      `}>
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="w-6 h-6 text-emerald-600" />
            <span className="text-xl font-bold text-emerald-700 dark:text-emerald-400">کشت‌یار</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onClose()}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                  ${isActive 
                    ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : ''}`} />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>
        
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400 dark:text-gray-500">
          v2.0.0 • هوشمندسازی مزرعه
        </div>
      </aside>
    </>
  )
}
