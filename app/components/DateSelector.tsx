'use client';

import { useState } from 'react';
import { Calendar } from '../utils/calendar';

interface DateSelectorProps {
  onDateChange: (date: Date) => void;
}

export default function DateSelector({ onDateChange }: DateSelectorProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    setCurrentDate(newDate);
    onDateChange(newDate);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <input
        type="date"
        value={currentDate.toISOString().split('T')[0]}
        onChange={handleDateChange}
        className="bg-black/30 text-white border border-white/20 rounded-lg px-4 py-2 
                 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent
                 hover:bg-black/40 transition-colors"
      />
    </div>
  );
}
