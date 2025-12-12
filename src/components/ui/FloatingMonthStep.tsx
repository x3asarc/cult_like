'use client'

import { FloatingText } from '@/components/animations/FloatingText'

const months = [
  { name: 'January', size: 'text-3xl md:text-5xl', delay: 0 },
  { name: 'February', size: 'text-2xl md:text-4xl', delay: 1.2 },
  { name: 'March', size: 'text-4xl md:text-6xl', delay: 2.4 },
  { name: 'April', size: 'text-2xl md:text-3xl', delay: 0.8 },
  { name: 'May', size: 'text-3xl md:text-4xl', delay: 1.8 },
  { name: 'June', size: 'text-2xl md:text-4xl', delay: 0.4 },
]

interface FloatingMonthStepProps {
  onMonthSelect: (month: string) => void
  selectedMonth?: string
}

export function FloatingMonthStep({ onMonthSelect, selectedMonth }: FloatingMonthStepProps) {
  return (
    <div className="relative min-h-[500px] w-full flex items-center justify-center">
      <div className="relative w-full max-w-6xl h-[500px] flex items-center justify-center">
        
        {/* Top row */}
        <div className="absolute top-1/4 left-1/4">
          <div onClick={() => onMonthSelect(months[0].name)}>
            <FloatingText 
              fontSize={`${months[0].size} ${selectedMonth === months[0].name ? 'text-blue-600' : ''}`} 
              delay={months[0].delay}
              href=""
            >
              {months[0].name}
            </FloatingText>
          </div>
        </div>
        
        <div className="absolute top-1/3 right-1/4">
          <div onClick={() => onMonthSelect(months[1].name)}>
            <FloatingText 
              fontSize={`${months[1].size} ${selectedMonth === months[1].name ? 'text-blue-600' : ''}`} 
              delay={months[1].delay}
              href=""
            >
              {months[1].name}
            </FloatingText>
          </div>
        </div>
        
        {/* Center area */}
        <div className="absolute top-1/2 left-1/6 transform -translate-y-1/2">
          <div onClick={() => onMonthSelect(months[2].name)}>
            <FloatingText 
              fontSize={`${months[2].size} ${selectedMonth === months[2].name ? 'text-blue-600' : ''}`} 
              delay={months[2].delay}
              href=""
            >
              {months[2].name}
            </FloatingText>
          </div>
        </div>
        
        <div className="absolute top-2/5 right-1/3">
          <div onClick={() => onMonthSelect(months[3].name)}>
            <FloatingText 
              fontSize={`${months[3].size} ${selectedMonth === months[3].name ? 'text-blue-600' : ''}`} 
              delay={months[3].delay}
              href=""
            >
              {months[3].name}
            </FloatingText>
          </div>
        </div>
        
        {/* Bottom area */}
        <div className="absolute bottom-1/3 left-1/3">
          <div onClick={() => onMonthSelect(months[4].name)}>
            <FloatingText 
              fontSize={`${months[4].size} ${selectedMonth === months[4].name ? 'text-blue-600' : ''}`} 
              delay={months[4].delay}
              href=""
            >
              {months[4].name}
            </FloatingText>
          </div>
        </div>
        
        <div className="absolute bottom-1/5 right-1/5">
          <div onClick={() => onMonthSelect(months[5].name)}>
            <FloatingText 
              fontSize={`${months[5].size} ${selectedMonth === months[5].name ? 'text-blue-600' : ''}`} 
              delay={months[5].delay}
              href=""
            >
              {months[5].name}
            </FloatingText>
          </div>
        </div>
        
      </div>
    </div>
  )
}