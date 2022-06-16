import * as React from 'react'

type OrderedItem = {
  position: number
}

export const useMove = () => {
  const actions = React.useMemo(() => {
    const a = {
      updatePosition: <T extends OrderedItem>(
        items: T[],
        startIndex: number,
        destIndex: number
      ): T => {
        const cloned = Array.from(items)
        const [target] = cloned.splice(startIndex, 1)

        const prevPos = cloned[destIndex - 1]?.position || 0
        const nextPos =
          cloned[destIndex]?.position || cloned[cloned.length - 1].position * 2

        target.position = (prevPos + nextPos) / 2

        return target
      },
    }

    return a
  }, [])

  return actions
}
