'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SidebarProps {
  open: boolean
  onClose: () => void
}

const menuItems = [
  { icon: '📊', label: 'داشبورد', href: '/dashboard' },
  { icon: '📈', label: 'تاریخچه', href: '/history' },
  { icon: '⚡', label: 'رله‌ها', href: '/relays' },
  { icon: '⚙️', label: 'قوانین', href: '/rules' },
  { icon: '🔔', label: 'هشدارها', href: '/alerts' },
  { icon: '👤', label: 'تنظیمات', href: '/settings' },
  { icon: '📡', label: 'دستگاه', href: '/device' },
]

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname()
  
  return (
    <>
      {/* Overlay */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed top-0 right-0 h-full w-72 bg-white/95 backdrop-blur-md border-l border-gray-100
        transition-transform duration-300 z-50
        ${open ? 'translate-x-0' : 'translate-x-full'}
        md:translate-x-0 md:relative md:z-0
        flex flex-col
      `}>
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            <span className="text-xl font-bold text-emerald-700">Agrova</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                ${pathname === item.href 
                  ? 'bg-emerald-50 text-emerald-700' 
                  : 'text-gray-600 hover:bg-gray-50'
                }
              `}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        
        <div className="p-4 border-t border-gray-100 text-xs text-gray-400">
          v2.0.0 • هوشمندسازی مزرعه
        </div>
      </aside>
    </>
  )
}
