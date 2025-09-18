import { adminAuth, adminDB } from './firebaseAdmin'

export async function requireAdmin(req: Request) {
  const auth = req.headers.get('authorization') || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null
  if (!token) throw new Error('Unauthorized')

  const decoded = await adminAuth.verifyIdToken(token)
  const uid = decoded.uid

  const doc = await adminDB.doc(`admins/${uid}`).get()
  if (!doc.exists) throw new Error('Forbidden')
  return { uid }
}
