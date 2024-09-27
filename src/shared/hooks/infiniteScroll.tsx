import { useLayoutEffect, useState } from 'react'
import { VISIBLE_ROWS } from '../../configuration'

export const useInfiniteScroll = (elementId: string, visibleRowsNum?: number) => {
  const [visibleRows, setVisibleRows] = useState(visibleRowsNum || VISIBLE_ROWS)
  const thresholdPercentage = 90
  const handleScroll = () => {
    const element = document.getElementById(elementId)
    if (element instanceof HTMLElement) {
      const { scrollTop, clientHeight, scrollHeight } = element
      const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100
      if ((scrollTop + clientHeight === scrollHeight) || (scrollPercentage >= thresholdPercentage)) {
        setVisibleRows((prevVisibleRows) => prevVisibleRows + 30)
      }
    }
  }
  useLayoutEffect(() => {
    const element = document.getElementById(elementId)
    if (element instanceof HTMLElement) {
      element.addEventListener('scroll', handleScroll, true)
    }
    return () => {
      if (element instanceof HTMLElement) {
        element.removeEventListener('scroll', handleScroll, true)
      }
    }
  }, [elementId])

  return visibleRows
}
