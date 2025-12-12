'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface FloatingFilterProps {
  children: React.ReactNode
  isActive?: boolean
  onClick?: () => void
  delay?: number
  className?: string
}

export function FloatingFilter({ 
  children, 
  isActive = false,
  onClick,
  delay = 0,
  className = ''
}: FloatingFilterProps) {
  const [isHovered, setIsHovered] = useState(false)

  const floatingVariants = {
    animate: {
      x: [0, 1, -1, 0.5, 0],
      y: [0, -1, 1, -0.5, 0],
      rotate: [0, 0.2, -0.2, 0.1, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut"
      }
    },
    hover: {
      scale: 1.03,
      y: -2,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    active: {
      scale: 1.05,
      y: -3,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  }

  return (
    <motion.button
      variants={floatingVariants}
      animate={isActive ? "active" : isHovered ? "hover" : "animate"}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      className={`
        px-4 py-2 
        ${isActive ? 'bg-gray-900 text-white' : 'bg-white text-gray-700'} 
        border 
        ${isActive ? 'border-gray-900' : 'border-gray-200'} 
        rounded-full 
        text-sm 
        font-light 
        cursor-pointer 
        select-none 
        transition-colors 
        hover:border-gray-400
        ${className}
      `}
    >
      {children}
    </motion.button>
  )
}