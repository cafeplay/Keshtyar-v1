'use client'

import { useState } from 'react'
import DatePicker from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'
import { Calendar, Search, ChevronLeft, ChevronRight } from 'lucide-react'

interface HistoryCalendarProps {
  onDateChange: (from: Date, to: Date) => void
}

export function HistoryCalendar({ onDateChange }: HistoryCalendarProps) {
  const [fromDate, setFromDate] = useState<any>(null)
  const [toDate, setToDate] = useState<any>(null)
  
  const handleApply = () => {
    if (fromDate && toDate) {
      onDateChange(fromDate.toDate(), toDate.toDate())
    }
  }
  
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-card p-4 shadow-sm border border-white/40 dark:border-gray-700/40">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
            از تاریخ
          </label>
          <DatePicker
            calendar={persian}
            locale={persian_fa}
            value={fromDate}
            onChange={setFromDate}
            format="YYYY/MM/DD"
            className="w-full bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2.5 text-sm font-medium text-gray-800 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
            containerClassName="w-full"
            render={(value, openCalendar) => (
              <div 
                className="w-full bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2.5 text-sm font-medium text-gray-800 dark:text-white flex items-center justify-between cursor-pointer"
                onClick={openCalendar}
              >
                <span>{value || 'انتخاب تاریخ'}</span>
                <Calendar className="w-4 h-4 text-gray-400" />
              </div>
            )}
          />
        </div>
        
        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
            تا تاریخ
          </label>
          <DatePicker
            calendar={persian}
            locale={persian_fa}
            value={toDate}
            onChange={setToDate}
            format="YYYY/MM/DD"
            className="w-full bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2.5 text-sm font-medium text-gray-800 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
            containerClassName="w-full"
            render={(value, openCalendar) => (
              <div 
                className="w-full bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2.5 text-sm font-medium text-gray-800 dark:text-white flex items-center justify-between cursor-pointer"
                onClick={openCalendar}
              >
                <span>{value || 'انتخاب تاریخ'}</span>
                <Calendar className="w-4 h-4 text-gray-400" />
              </div>
            )}
          />
        </div>
        
        <button
          onClick={handleApply}
          className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/30"
        >
          <Search className="w-4 h-4" />
          نمایش
        </button>
      </div>
    </div>
  )
}
