'use client'

import { db } from '@/lib/firebase'
import type { Category, DailyMenu, MenuItem } from '@/types'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore'
import { uploadItemImage } from './uploadImage'

export async function uploadImage(file: File, itemId: string) {
  try {
    const url = await uploadItemImage(file, itemId)
    await updateItem(itemId, { img: url })
    return url
  } catch (error) {
    console.error(error)
  }
}

// ---------- CATEGORIES ----------
export async function createCategory(input: Pick<Category, 'key' | 'label' | 'icon'>) {
  const id = input.key.trim()
  if (!id) throw new Error('Category key required')
  await setDoc(doc(db, 'categories', id), {
    label: input.label,
    icon: input.icon,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return id
}

export async function updateCategory(key: string, patch: Partial<Omit<Category, 'key'>>) {
  if (!key) throw new Error('Category key required')
  await updateDoc(doc(db, 'categories', key), {
    ...patch,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteCategory(key: string) {
  if (!key) return

  const q = query(collection(db, 'items'), where('category', '==', key))
  const snap = await getDocs(q)
  if (!snap.empty) {
    throw new Error(`No se puede borrar la categoría "${key}" porque tiene ${snap.size} ítems.`)
  }
  await deleteDoc(doc(db, 'categories', key))
}

// ---------- ITEMS ----------
export async function createItem(input: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>) {
  if (!input.name?.trim()) throw new Error('Item name required')
  if (!(input.price >= 0)) throw new Error('Item price required')
  const ref = await addDoc(collection(db, 'items'), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function updateItem(id: string, patch: Partial<Omit<MenuItem, 'id'>>) {
  if (!id) throw new Error('Item id required')
  await updateDoc(doc(db, 'items', id), {
    ...patch,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteItem(id: string) {
  if (!id) return
  await deleteDoc(doc(db, 'items', id))
}

export async function bulkMoveItems(oldKey: string, newKey: string) {
  const q = query(collection(db, 'items'), where('category', '==', oldKey))
  const snap = await getDocs(q)
  const batch = writeBatch(db)
  snap.forEach((d) => batch.update(d.ref, { category: newKey, updatedAt: serverTimestamp() }))
  await batch.commit()
}

// ---------- DAILY MENU ----------
export async function setDailyMenu(data: DailyMenu) {
  await setDoc(
    doc(db, 'dailyMenu', 'current'),
    {
      ...data,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    },
    { merge: true },
  )
}
