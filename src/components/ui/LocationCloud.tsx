'use client'

import { FloatingText } from '@/components/animations/FloatingText'

const viennaLocations = [
  { name: 'Innere Stadt', size: 'text-6xl md:text-8xl', delay: 0 },
  { name: 'Leopoldstadt', size: 'text-3xl md:text-5xl', delay: 1.2 },
  { name: 'Landstraße', size: 'text-4xl md:text-6xl', delay: 2.4 },
  { name: 'Wieden', size: 'text-2xl md:text-4xl', delay: 0.8 },
  { name: 'Margareten', size: 'text-3xl md:text-5xl', delay: 1.8 },
  { name: 'Mariahilf', size: 'text-5xl md:text-7xl', delay: 0.4 },
  { name: 'Neubau', size: 'text-4xl md:text-6xl', delay: 3.2 },
  { name: 'Josefstadt', size: 'text-2xl md:text-3xl', delay: 2.8 },
  { name: 'Alsergrund', size: 'text-3xl md:text-4xl', delay: 1.6 },
  { name: 'Favoriten', size: 'text-2xl md:text-3xl', delay: 2.0 }
]

export function LocationCloud() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white overflow-hidden">
      <div className="relative w-full max-w-7xl h-screen flex items-center justify-center px-4 md:px-8">
        
        {/* Top row */}
        <div className="absolute top-1/4 left-1/4">
          <FloatingText 
            fontSize={viennaLocations[0].size} 
            delay={viennaLocations[0].delay}
          >
            {viennaLocations[0].name}
          </FloatingText>
        </div>
        
        <div className="absolute top-1/3 right-1/4">
          <FloatingText 
            fontSize={viennaLocations[1].size} 
            delay={viennaLocations[1].delay}
          >
            {viennaLocations[1].name}
          </FloatingText>
        </div>
        
        {/* Center area */}
        <div className="absolute top-1/2 left-1/6 transform -translate-y-1/2">
          <FloatingText 
            fontSize={viennaLocations[5].size} 
            delay={viennaLocations[5].delay}
          >
            {viennaLocations[5].name}
          </FloatingText>
        </div>
        
        <div className="absolute top-1/2 right-1/3 transform -translate-y-1/2">
          <FloatingText 
            fontSize={viennaLocations[6].size} 
            delay={viennaLocations[6].delay}
          >
            {viennaLocations[6].name}
          </FloatingText>
        </div>
        
        <div className="absolute top-2/5 left-1/2 transform -translate-x-1/2">
          <FloatingText 
            fontSize={viennaLocations[2].size} 
            delay={viennaLocations[2].delay}
          >
            {viennaLocations[2].name}
          </FloatingText>
        </div>
        
        {/* Bottom area */}
        <div className="absolute bottom-1/3 left-1/3">
          <FloatingText 
            fontSize={viennaLocations[3].size} 
            delay={viennaLocations[3].delay}
          >
            {viennaLocations[3].name}
          </FloatingText>
        </div>
        
        <div className="absolute bottom-1/4 right-1/5">
          <FloatingText 
            fontSize={viennaLocations[4].size} 
            delay={viennaLocations[4].delay}
          >
            {viennaLocations[4].name}
          </FloatingText>
        </div>
        
        <div className="absolute bottom-1/5 left-1/5">
          <FloatingText 
            fontSize={viennaLocations[7].size} 
            delay={viennaLocations[7].delay}
          >
            {viennaLocations[7].name}
          </FloatingText>
        </div>
        
        <div className="absolute top-3/5 right-1/6">
          <FloatingText 
            fontSize={viennaLocations[8].size} 
            delay={viennaLocations[8].delay}
          >
            {viennaLocations[8].name}
          </FloatingText>
        </div>
        
        <div className="absolute bottom-2/5 left-2/5">
          <FloatingText 
            fontSize={viennaLocations[9].size} 
            delay={viennaLocations[9].delay}
          >
            {viennaLocations[9].name}
          </FloatingText>
        </div>
        
      </div>
    </div>
  )
}