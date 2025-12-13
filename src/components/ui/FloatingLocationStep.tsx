
'use client'

import { FloatingText } from '@/components/animations/FloatingText'

const viennaLocations = [
  { name: 'Innere Stadt', size: 'text-4xl md:text-6xl', delay: 0 },
  { name: 'Leopoldstadt', size: 'text-2xl md:text-4xl', delay: 1.2 },
  { name: 'Landstraße', size: 'text-3xl md:text-5xl', delay: 2.4 },
  { name: 'Wieden', size: 'text-xl md:text-3xl', delay: 0.8 },
  { name: 'Margareten', size: 'text-2xl md:text-4xl', delay: 1.8 },
  { name: 'Mariahilf', size: 'text-4xl md:text-5xl', delay: 0.4 },
  { name: 'Neubau', size: 'text-3xl md:text-5xl', delay: 3.2 },
  { name: 'Josefstadt', size: 'text-xl md:text-2xl', delay: 2.8 },
]

interface FloatingLocationStepProps {
  onLocationSelect: (location: string) => void
  selectedLocation?: string
}

export function FloatingLocationStep({ onLocationSelect, selectedLocation }: FloatingLocationStepProps) {
  return (
    <div className="relative min-h-[500px] w-full flex items-center justify-center">
      <div className="relative w-full max-w-6xl h-[500px] flex items-center justify-center">
        
        {/* Top row */}
        <div className="absolute top-1/4 left-1/4">
          <div onClick={() => onLocationSelect(viennaLocations[0].name)}>
            <FloatingText 
              fontSize={`${viennaLocations[0].size} ${selectedLocation === viennaLocations[0].name ? 'text-blue-600' : ''}`} 
              delay={viennaLocations[0].delay}
              href=""
            >
              {viennaLocations[0].name}
            </FloatingText>
          </div>
        </div>
        
        <div className="absolute top-1/3 right-1/4">
          <div onClick={() => onLocationSelect(viennaLocations[1].name)}>
            <FloatingText 
              fontSize={`${viennaLocations[1].size} ${selectedLocation === viennaLocations[1].name ? 'text-blue-600' : ''}`} 
              delay={viennaLocations[1].delay}
              href=""
            >
              {viennaLocations[1].name}
            </FloatingText>
          </div>
        </div>
        
        {/* Center area */}
        <div className="absolute top-1/2 left-1/6 transform -translate-y-1/2">
          <div onClick={() => onLocationSelect(viennaLocations[5].name)}>
            <FloatingText 
              fontSize={`${viennaLocations[5].size} ${selectedLocation === viennaLocations[5].name ? 'text-blue-600' : ''}`} 
              delay={viennaLocations[5].delay}
              href=""
            >
              {viennaLocations[5].name}
            </FloatingText>
          </div>
        </div>
        
        <div className="absolute top-1/2 right-1/3 transform -translate-y-1/2">
          <div onClick={() => onLocationSelect(viennaLocations[6].name)}>
            <FloatingText 
              fontSize={`${viennaLocations[6].size} ${selectedLocation === viennaLocations[6].name ? 'text-blue-600' : ''}`} 
              delay={viennaLocations[6].delay}
              href=""
            >
              {viennaLocations[6].name}
            </FloatingText>
          </div>
        </div>
        
        <div className="absolute top-2/5 left-1/2 transform -translate-x-1/2">
          <div onClick={() => onLocationSelect(viennaLocations[2].name)}>
            <FloatingText 
              fontSize={`${viennaLocations[2].size} ${selectedLocation === viennaLocations[2].name ? 'text-blue-600' : ''}`} 
              delay={viennaLocations[2].delay}
              href=""
            >
              {viennaLocations[2].name}
            </FloatingText>
          </div>
        </div>
        
        {/* Bottom area */}
        <div className="absolute bottom-1/3 left-1/3">
          <div onClick={() => onLocationSelect(viennaLocations[3].name)}>
            <FloatingText 
              fontSize={`${viennaLocations[3].size} ${selectedLocation === viennaLocations[3].name ? 'text-blue-600' : ''}`} 
              delay={viennaLocations[3].delay}
              href=""
            >
              {viennaLocations[3].name}
            </FloatingText>
          </div>
        </div>
        
        <div className="absolute bottom-1/4 right-1/5">
          <div onClick={() => onLocationSelect(viennaLocations[4].name)}>
            <FloatingText 
              fontSize={`${viennaLocations[4].size} ${selectedLocation === viennaLocations[4].name ? 'text-blue-600' : ''}`} 
              delay={viennaLocations[4].delay}
              href=""
            >
              {viennaLocations[4].name}
            </FloatingText>
          </div>
        </div>
        
        <div className="absolute bottom-1/5 left-1/5">
          <div onClick={() => onLocationSelect(viennaLocations[7].name)}>
            <FloatingText 
              fontSize={`${viennaLocations[7].size} ${selectedLocation === viennaLocations[7].name ? 'text-blue-600' : ''}`} 
              delay={viennaLocations[7].delay}
              href=""
            >
              {viennaLocations[7].name}
            </FloatingText>
          </div>
        </div>
        
      </div>
    </div>
  )
}