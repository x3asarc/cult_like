'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface FloatingOptionProps {
  children: React.ReactNode
  isSelected?: boolean
  onClick?: () => void
  delay?: number
  className?: string
}

export function FloatingOption({ 
  children, 
  isSelected = false,
  onClick,
  delay = 0,
  className = ''
}: FloatingOptionProps) {
  const [isHovered, setIsHovered] = useState(false)

  const floatingVariants = {
    animate: {
      x: [0, 3, -2, 1, 0],
      y: [0, -2, 3, -1, 0],
      rotate: [0, 1, -0.5, 0.3, 0],
      transition: {
        duration: 10,
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut"
      }
    },
    hover: {
      scale: 1.05,
      y: -5,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    selected: {
      scale: 1.1,
      y: -10,
      boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }

  return (
    <motion.button
      variants={floatingVariants}
      animate={isSelected ? "selected" : isHovered ? "hover" : "animate"}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      className={`
        px-8 py-4 
        bg-white 
        border-2 
        ${isSelected ? 'border-gray-900 bg-gray-50' : 'border-gray-200'} 
        rounded-full 
        text-lg 
        cursor-pointer 
        select-none 
        transition-colors 
        hover:border-gray-400
        text-gray-900
        ${className}
      `}
    >
      {children}
    </motion.button>
  )
}