import * as React from 'react'
import { useList } from 'react-use'

type Link = {
  from: string | null
  to: string | null
}
export type LinkedEvent = {
  id: string
  extendedProps: Link
}

export interface LinkedEventsActions<T extends LinkedEvent> {
  push: (newItem: T) => void
  get: (index: number) => T | null
  getFirst: () => T | null
  getLast: () => T | null
  insert: (newItem: T, prevId: string) => void
  remove: (removedId: string) => void
  update: (newItem: T) => void
  clear: () => void
  next: (current: T) => T | null
  prev: (current: T) => T | null
}

type UseLinkedList<T extends LinkedEvent> = readonly [
  Array<T>,
  LinkedEventsActions<T>
]

export const useLinkedEvents = <T extends LinkedEvent>(): UseLinkedList<T> => {
  const [items, setItemsActions] = useList<T>()
  const itemsRef = React.useRef<T[]>([])
  itemsRef.current = items

  const getFirst = React.useCallback(() => {
    return (
      itemsRef.current.find((item) => item.extendedProps.from === null) || null
    )
  }, [])

  const getLast = React.useCallback(() => {
    return (
      itemsRef.current.find((item) => item.extendedProps.to === null) || null
    )
  }, [])

  const update = React.useCallback(
    (newItem: T): void => {
      setItemsActions.update((item) => item.id === newItem.id, newItem)
    },
    [setItemsActions]
  )

  const push = React.useCallback(
    (newItem: T): void => {
      const last = getLast()
      if (last) {
        // 末尾の要素にリンクを追加する
        last.extendedProps.to = newItem.id
        update({ ...last })

        setItemsActions.push({
          ...newItem,
          extendedProps: {
            ...newItem.extendedProps,
            from: last.id,
            to: null,
          },
        })
      } else {
        setItemsActions.push(newItem)
      }
    },
    [getLast, setItemsActions, update]
  )

  const get = React.useCallback((index: number): T | null => {
    return itemsRef.current[index] ?? null
  }, [])

  const next = React.useCallback((current: T): T | null => {
    return (
      itemsRef.current.find((item) => item.id === current.extendedProps.to) ||
      null
    )
  }, [])

  const prev = React.useCallback((current: T): T | null => {
    return (
      itemsRef.current.find((item) => item.id === current.extendedProps.from) ||
      null
    )
  }, [])

  const insert = React.useCallback(
    (newItem: T, targetId: string): void => {
      const currentItem = itemsRef.current.find((item) => item.id === targetId)

      const cloned = Object.create(newItem)

      if (currentItem) {
        currentItem.extendedProps.from = newItem.id
        setItemsActions.update((item) => item.id === currentItem.id, {
          ...currentItem,
        })

        cloned.extendedProps.from = currentItem.extendedProps.from
        cloned.extendedProps.to = currentItem.id
        setItemsActions.push({ ...cloned })
      } else {
        console.error('fail to insert')
      }
    },
    [setItemsActions]
  )

  const remove = React.useCallback(
    (removedId: string): void => {
      setItemsActions.filter((item) => item.id !== removedId)
    },
    [setItemsActions]
  )

  const clear = React.useCallback((): void => {
    setItemsActions.clear()
  }, [setItemsActions])

  const actions = React.useMemo<LinkedEventsActions<T>>(
    () => ({
      push,
      get,
      getFirst,
      getLast,
      insert,
      remove,
      update,
      clear,
      next,
      prev,
    }),
    [clear, get, getFirst, getLast, insert, next, prev, push, remove, update]
  )

  return [items, actions]
}
