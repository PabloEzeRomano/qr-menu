import { adminAuth, adminDB } from './firebaseAdmin'

interface UserData {
  bypassOnboarding: boolean
}

export async function requireAdmin(req: Request) {
  const auth = req.headers.get('authorization') || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null
  if (!token) throw new Error('Unauthorized')

  const { uid } = await adminAuth.verifyIdToken(token)

  const rootDoc = await adminDB.doc(`root/${uid}`).get()
  const adminDoc = await adminDB.doc(`admins/${uid}`).get()

  // Check root collection for root users
  if (rootDoc.exists) {
    const { bypassOnboarding } = rootDoc.data() as UserData
    return { uid, role: 'root', canBypass: !!bypassOnboarding }
    // Check admins collection for regular admins
  } else if (adminDoc.exists) {
    const { bypassOnboarding } = adminDoc.data() as UserData
    return { uid, role: 'admin', canBypass: !!bypassOnboarding }
  }

  throw new Error('Forbidden')
}
