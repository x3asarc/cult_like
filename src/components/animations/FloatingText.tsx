'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import Link from 'next/link'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface FloatingTextProps {
  children: React.ReactNode
  fontSize?: string
  href?: string
  delay?: number
  className?: string
}

export function FloatingText({ 
  children, 
  fontSize = 'text-4xl', 
  href = '/events',
  delay = 0,
  className = ''
}: FloatingTextProps) {
  const [isHovered, setIsHovered] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  const floatingVariants = {
    animate: prefersReducedMotion ? {} : {
      x: [0, 2, -1, 1, 0],
      y: [0, -1, 2, -2, 0],
      rotate: [0, 0.5, -0.3, 0.2, 0],
      scale: [1, 1.01, 0.99, 1.005, 1],
      transition: {
        duration: 8,
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut"
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }

  const TextComponent = (
    <motion.div
      variants={floatingVariants}
      animate={isHovered ? "hover" : "animate"}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`
        ${fontSize} 
        text-gray-900 
        cursor-pointer 
        select-none 
        transition-colors 
        hover:text-gray-600
        focus:outline-none
        focus:ring-2
        focus:ring-gray-500
        focus:ring-offset-2
        ${className}
      `}
      tabIndex={0}
      role="button"
      aria-label={`View events in ${children}`}
      style={{ willChange: 'transform' }}
    >
      {children}
    </motion.div>
  )

  if (href) {
    return (
      <Link href="/quiz">
        {TextComponent}
      </Link>
    )
  }

  return TextComponent
}