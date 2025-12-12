'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface FloatingCardProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export function FloatingCard({ 
  children, 
  delay = 0,
  className = ''
}: FloatingCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const floatingVariants = {
    animate: {
      x: [0, 1.5, -1, 0.8, 0],
      y: [0, -0.8, 1.2, -1.5, 0],
      rotate: [0, 0.3, -0.2, 0.1, 0],
      transition: {
        duration: 12,
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut"
      }
    },
    hover: {
      scale: 1.02,
      y: -8,
      boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }

  return (
    <motion.div
      variants={floatingVariants}
      animate={isHovered ? "hover" : "animate"}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`
        bg-white 
        border 
        border-gray-200 
        rounded-lg 
        overflow-hidden 
        cursor-pointer
        ${className}
      `}
    >
      {children}
    </motion.div>
  )
}