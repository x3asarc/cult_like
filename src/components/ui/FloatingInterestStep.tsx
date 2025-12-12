'use client'

import { FloatingText } from '@/components/animations/FloatingText'

const interests = [
  { name: 'Opera', size: 'text-3xl md:text-5xl', delay: 0 },
  { name: 'Theater', size: 'text-2xl md:text-4xl', delay: 1.2 },
  { name: 'Classical Music', size: 'text-4xl md:text-6xl', delay: 2.4 },
  { name: 'Contemporary Art', size: 'text-2xl md:text-3xl', delay: 0.8 },
  { name: 'Dance', size: 'text-3xl md:text-4xl', delay: 1.8 },
  { name: 'Film', size: 'text-2xl md:text-4xl', delay: 0.4 },
]

interface FloatingInterestStepProps {
  onInterestSelect: (interest: string) => void
  selectedInterests: string[]
}

export function FloatingInterestStep({ onInterestSelect, selectedInterests }: FloatingInterestStepProps) {
  return (
    <div className="relative min-h-[500px] w-full flex items-center justify-center">
      <div className="relative w-full max-w-6xl h-[500px] flex items-center justify-center">
        
        {/* Top row */}
        <div className="absolute top-1/4 left-1/4">
          <div onClick={() => onInterestSelect(interests[0].name)}>
            <FloatingText 
              fontSize={`${interests[0].size} ${selectedInterests.includes(interests[0].name) ? 'text-blue-600' : ''}`} 
              delay={interests[0].delay}
              href=""
            >
              {interests[0].name}
            </FloatingText>
          </div>
        </div>
        
        <div className="absolute top-1/3 right-1/4">
          <div onClick={() => onInterestSelect(interests[1].name)}>
            <FloatingText 
              fontSize={`${interests[1].size} ${selectedInterests.includes(interests[1].name) ? 'text-blue-600' : ''}`} 
              delay={interests[1].delay}
              href=""
            >
              {interests[1].name}
            </FloatingText>
          </div>
        </div>
        
        {/* Center area */}
        <div className="absolute top-1/2 left-1/6 transform -translate-y-1/2">
          <div onClick={() => onInterestSelect(interests[2].name)}>
            <FloatingText 
              fontSize={`${interests[2].size} ${selectedInterests.includes(interests[2].name) ? 'text-blue-600' : ''}`} 
              delay={interests[2].delay}
              href=""
            >
              {interests[2].name}
            </FloatingText>
          </div>
        </div>
        
        <div className="absolute top-2/5 right-1/3">
          <div onClick={() => onInterestSelect(interests[3].name)}>
            <FloatingText 
              fontSize={`${interests[3].size} ${selectedInterests.includes(interests[3].name) ? 'text-blue-600' : ''}`} 
              delay={interests[3].delay}
              href=""
            >
              {interests[3].name}
            </FloatingText>
          </div>
        </div>
        
        {/* Bottom area */}
        <div className="absolute bottom-1/3 left-1/3">
          <div onClick={() => onInterestSelect(interests[4].name)}>
            <FloatingText 
              fontSize={`${interests[4].size} ${selectedInterests.includes(interests[4].name) ? 'text-blue-600' : ''}`} 
              delay={interests[4].delay}
              href=""
            >
              {interests[4].name}
            </FloatingText>
          </div>
        </div>
        
        <div className="absolute bottom-1/5 right-1/5">
          <div onClick={() => onInterestSelect(interests[5].name)}>
            <FloatingText 
              fontSize={`${interests[5].size} ${selectedInterests.includes(interests[5].name) ? 'text-blue-600' : ''}`} 
              delay={interests[5].delay}
              href=""
            >
              {interests[5].name}
            </FloatingText>
          </div>
        </div>
        
      </div>
    </div>
  )
}