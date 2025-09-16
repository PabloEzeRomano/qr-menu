'use client'

import { useEffect, useMemo, useState } from 'react'
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Category, Filter, MenuItem, DailyMenu } from '@/types'

type State<T> = { data: T; loading: boolean; error: string | null }

export function useMenuData() {
  const [categories, setCategories] = useState<State<Category[]>>({
    data: [],
    loading: true,
    error: null,
  })
  const [filters, setFilters] = useState<State<Filter[]>>({
    data: [],
    loading: true,
    error: null,
  })
  const [items, setItems] = useState<State<MenuItem[]>>({
    data: [],
    loading: true,
    error: null,
  })
  const [dailyMenu, setDailyMenu] = useState<State<DailyMenu | null>>({
    data: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    const unsubCats = onSnapshot(
      query(collection(db, 'categories'), orderBy('label')),
      (snap) => {
        setCategories({
          data: snap.docs.map((d) => ({
            ...(d.data() as Category),
            key: d.id,
          })),
          loading: false,
          error: null,
        })
      },
      (e) => setCategories((s) => ({ ...s, loading: false, error: e.message })),
    )

    const unsubFilters = onSnapshot(
      query(collection(db, 'filters'), orderBy('label')),
      (snap) => {
        setFilters({
          data: snap.docs.map((d) => ({ ...(d.data() as Filter), key: d.id })),
          loading: false,
          error: null,
        })
      },
      (e) => setFilters((s) => ({ ...s, loading: false, error: e.message })),
    )

    const unsubItems = onSnapshot(
      collection(db, 'items'),
      (snap) => {
        setItems({
          data: snap.docs.map((d) => ({
            ...(d.data() as Omit<MenuItem, 'id'>),
            id: d.id,
          })),
          loading: false,
          error: null,
        })
      },
      (e) => setItems((s) => ({ ...s, loading: false, error: e.message })),
    )

    const unsubDaily = onSnapshot(
      doc(db, 'dailyMenu', 'current'),
      (snap) => {
        setDailyMenu({
          data: snap.exists() ? (snap.data() as DailyMenu) : null,
          loading: false,
          error: null,
        })
      },
      (e) => setDailyMenu((s) => ({ ...s, loading: false, error: e.message })),
    )

    return () => {
      unsubCats()
      unsubFilters()
      unsubItems()
      unsubDaily()
    }
  }, [])

  const loading = useMemo(
    () => categories.loading || filters.loading || items.loading || dailyMenu.loading,
    [categories.loading, filters.loading, items.loading, dailyMenu.loading],
  )

  return {
    loading,
    categories: categories.data,
    filters: filters.data,
    items: items.data,
    dailyMenu: dailyMenu.data,
    errors: {
      categories: categories.error,
      filters: filters.error,
      items: items.error,
      dailyMenu: dailyMenu.error,
    },
  }
}
