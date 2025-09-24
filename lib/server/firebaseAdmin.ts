import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth as getAdminAuth } from 'firebase-admin/auth'
import { FieldValue, getFirestore as getAdminDB } from 'firebase-admin/firestore'

const sa = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : null

if (!sa) {
  throw new Error('Missing FIREBASE_SERVICE_ACCOUNT env')
}

if (sa.private_key?.includes('\\n')) {
  sa.private_key = sa.private_key.replace(/\\n/g, '\n')
}

export const adminApp = getApps().length ? getApps()[0] : initializeApp({ credential: cert(sa) })

export const adminAuth = getAdminAuth(adminApp)
export const adminDB = getAdminDB(adminApp)
export const serverTimestamp = FieldValue.serverTimestamp
export { FieldValue }
