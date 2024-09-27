import React, { useState, useRef, useEffect } from 'react'
import './tooltip.css'

interface TooltipProps {
  content: React.ReactNode
  position?: 'top' | 'right' | 'bottom' | 'left'
  children?: React.ReactNode
  className?: any
}

const Tooltip: React.FC<TooltipProps> = ({ content, position = 'top', children, className }) => {
  const [visible, setVisible] = useState(false)
  const [adjustedPosition, setAdjustedPosition] = useState(position)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const showTooltip = () => {
    setVisible(true)
  }

  const hideTooltip = () => {
    setVisible(false)
  }

  useEffect(() => {
    if (visible && tooltipRef.current && wrapperRef.current) {
      const elementRect = wrapperRef.current.getBoundingClientRect()
      const { offsetWidth: tooltipWidth, offsetHeight: tooltipHeight } = tooltipRef.current
      const { offsetLeft: wrapperLeft, offsetTop: wrapperTop, offsetHeight: wrapperHeight, offsetWidth: wrapperWidth } = wrapperRef.current
      const { innerWidth, innerHeight } = window

      // Determine optimal position
      let newPosition = position
      if (position === 'top' && wrapperTop < tooltipHeight) {
        newPosition = 'bottom'
      } else if (position === 'bottom' && wrapperTop + wrapperHeight + tooltipHeight > innerHeight) {
        newPosition = 'top'
      } else if (position === 'left' && wrapperLeft < tooltipWidth) {
        newPosition = 'right'
      } else if (position === 'right' && wrapperLeft + wrapperWidth + tooltipWidth > innerWidth) {
        newPosition = 'left'
      }

      // Additional checks to avoid overflow in both axes
      if (newPosition === 'top' && elementRect.left + tooltipWidth > innerWidth) {
        newPosition = 'left'
      } else if (newPosition === 'top' && wrapperLeft - tooltipWidth / 2 < 0) {
        newPosition = 'right'
      } else if (newPosition === 'bottom' && elementRect.left + tooltipWidth > innerWidth) {
        newPosition = 'left'
      } else if (newPosition === 'bottom' && wrapperLeft - tooltipWidth / 2 < 0) {
        newPosition = 'right'
      }
      setAdjustedPosition(newPosition)
    }
  }, [visible, position])

  return (
    <div
      className="tooltip-wrapper"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      ref={wrapperRef}
    >
      {children}
      {visible && (
        <div className={`tooltip-box tooltip-${adjustedPosition}  ${className}`} ref={tooltipRef}>
          {content}
        </div>
      )}
    </div>
  )
}

export default Tooltip
