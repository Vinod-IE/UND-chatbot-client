import { useEffect } from 'react'
import { scrollToTop } from '../utility'

const useScrollToTop = () => {
  useEffect(() => {
    scrollToTop()
  }, [])
}

export default useScrollToTop
