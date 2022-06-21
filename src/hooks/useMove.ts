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

        // 先頭に移動する場合は前のアイテムが存在しないので 0 を返す
        const prevPos = cloned[destIndex - 1]?.position || 0
        // 末尾に移動する場合は後のアイテムが存在しないので、末尾のPosition の 2 倍を返す
        // もとの要素数が 1 の場合は (0 + 2000) / 2 = 1000 となるように 2000 を返す
        const nextPos =
          cloned[destIndex]?.position ||
          (cloned[cloned.length - 1]?.position || 1000) * 2

        target.position = (prevPos + nextPos) / 2

        return target
      },
    }

    return a
  }, [])

  return actions
}
