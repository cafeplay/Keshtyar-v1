'use client'

import { useState } from 'react'
import DatePicker from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'
import { Calendar, Search } from 'lucide-react'

// اضافه کردن استایل به صورت دستی
import 'react-multi-date-picker/styles/layouts/mobile.css'

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
    <div className="flex flex-wrap items-end gap-4 p-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-card border border-white/40 dark:border-gray-700/40">
      <div>
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">از تاریخ</label>
        <DatePicker
          calendar={persian}
          locale={persian_fa}
          value={fromDate}
          onChange={setFromDate}
          format="YYYY/MM/DD"
          className="w-40 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm text-gray-800 dark:text-white"
          containerClassName="w-auto"
        />
      </div>
      
      <div>
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">تا تاریخ</label>
        <DatePicker
          calendar={persian}
          locale={persian_fa}
          value={toDate}
          onChange={setToDate}
          format="YYYY/MM/DD"
          className="w-40 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm text-gray-800 dark:text-white"
          containerClassName="w-auto"
        />
      </div>
      
      <button
        onClick={handleApply}
        className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-emerald-700 transition"
      >
        <Search className="w-4 h-4" />
        نمایش
      </button>
    </div>
  )
}
