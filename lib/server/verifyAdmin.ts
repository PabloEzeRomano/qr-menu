import { adminAuth, adminDB } from './firebaseAdmin'

interface UserData {
  role: string
  bypassOnboarding: boolean
}

export async function requireAdmin(req: Request) {
  const auth = req.headers.get('authorization') || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null
  if (!token) throw new Error('Unauthorized')

  const { uid } = await adminAuth.verifyIdToken(token)

  // const rootDoc = await adminDB.doc(`root/${uid}`).get()
  const userDoc = await adminDB.doc(`users/${uid}`).get()

  // Check users collection for admin/root users
  if (userDoc.exists) {
    const userData = userDoc.data() as UserData
    const { role, bypassOnboarding } = userData
    const isAdmin = role === 'admin' || role === 'root'

    if (!isAdmin) {
      throw new Error('Forbidden')
    }

    return { uid, role, canBypass: !!bypassOnboarding }
  }

  throw new Error('Forbidden')
}
