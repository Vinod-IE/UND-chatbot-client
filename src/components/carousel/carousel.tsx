/* eslint-disable prefer-const */
import React, { useEffect, useState, useRef } from 'react'
import './carousel.css'

const Carousel = (props: any) => {
  let { children, show, prevIcon, nextIcon } = props
  const [windowSize, setWindowSize] = useState(getWindowSize())
  const [currentIndex, setCurrentIndex] = useState(0)
  const [length, setLength] = useState(children && children.length)
  const [touchPosition, setTouchPosition] = useState(null)
  const intervalRef = useRef<any>(null)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')

  useEffect(() => {
    setLength(children && children.length)
    function handleWindowResize() {
      setWindowSize(getWindowSize())
    }

    window.addEventListener('resize', handleWindowResize)
    return () => {
      window.removeEventListener('resize', handleWindowResize)
      clearInterval(intervalRef.current)
    }
  }, [children])

  useEffect(() => {
    {props?.autoslide && startAutoSlide()}
    return () => {
      clearInterval(intervalRef.current)
    }
  }, [currentIndex, direction])

  const startAutoSlide = () => {
    clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      if (direction === 'forward') {
        next()
      } else {
        prev()
      }
    }, Math.floor(Math.random() * (7000 - 5000 + 1)) + 5000)
  }

  const next = () => {
    if (currentIndex < length - show) {
      setCurrentIndex(prevState => prevState + 1)
    } else {
      setDirection('backward')
    }
  }

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prevState => prevState - 1)
    } else {
      setDirection('forward')
    }
  }

  const handleTouchStart = (e: any) => {
    const touchDown = e.touches[0].clientX
    setTouchPosition(touchDown)
  }

  const handleTouchMove = (e: any) => {
    const touchDown = touchPosition
    if (touchDown === null) {
      return
    }
    const currentTouch = e.touches[0].clientX
    const diff = touchDown - currentTouch
    if (diff > 5) {
      next()
    }
    if (diff < -5) {
      prev()
    }
    setTouchPosition(null)
  }

  let carouselCountDisplay
  if (windowSize.innerWidth <= 700 && windowSize.innerWidth > 480) {
    show = 1
    carouselCountDisplay = `show-${show}`
  } else if (windowSize.innerWidth <= 480 && windowSize.innerWidth > 0) {
    show = 1
    carouselCountDisplay = `show-${show}`
  } else {
    carouselCountDisplay = `show-${show}`
  }

  return (
    <div className={`carousel-container ${props?.position === 'bottom' && 'bottom-arrow'}`}>
      <div className="carousel-wrapper">
        {length >= 2 && currentIndex > 0 && (
          <span onClick={prev} className={prevIcon}></span>
        )}
        <div
          className="carousel-content-wrapper p-relative overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          <div
            className={`carousel-content ${carouselCountDisplay} ${props?.className}`}
            style={{
              transform: `translateX(-${currentIndex * (100 / show)}%)`
            }}
          >
            {children}
          </div>
        </div>
        {length >= 2 && currentIndex < length - show && (
          <span onClick={next} className={nextIcon}></span>
        )}
      </div>
    </div>
  )
}

export default Carousel

export function getWindowSize() {
  const { innerWidth, innerHeight } = window
  return { innerWidth, innerHeight }
}
