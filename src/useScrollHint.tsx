import React from 'react'
import ScrollHint from 'scroll-hint'

import 'scroll-hint/css/scroll-hint.css'

const useScrollHint = (targetIdentifier: string | null) => {
  const scrollHint = React.useRef<ScrollHint | null>(null)

  React.useEffect(() => {
    const scrollHintDisplayedAt = sessionStorage.getItem('scroll-hint-displayed-at')
    const isEnoughTimeFromLastHint = !scrollHintDisplayedAt || (+new Date()) - Number(scrollHintDisplayedAt) >= 1000 * 60 * 60 * 24
    if (isEnoughTimeFromLastHint && !scrollHint.current && targetIdentifier) {
      scrollHint.current = new ScrollHint(targetIdentifier, {
        enableOverflowScrolling: true,
        i18n: {
          scrollable: ''
        }
      })
      sessionStorage.setItem('scroll-hint-displayed-at', (+new Date()).toString())
    }
    return () => {
      scrollHint.current = null
    }
  }, [targetIdentifier])
}

export default useScrollHint
