import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'

// Usa Node runtime (más seguro para tokens)
export const runtime = 'nodejs'

// Opcional: limita tamaño (MB) y tipos permitidos
const MAX_MB = 6
const ALLOWED = /^image\/(png|jpe?g|webp|gif)$/i

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const file = form.get('file') as File | null
    const itemId = (form.get('itemId') as string) || 'generic'

    if (!file) {
      return NextResponse.json({ error: 'No file' }, { status: 400 })
    }
    if (!ALLOWED.test(file.type)) {
      return NextResponse.json({ error: 'Tipo inválido' }, { status: 415 })
    }
    const mb = file.size / (1024 * 1024)
    if (mb > MAX_MB) {
      return NextResponse.json({ error: `Archivo > ${MAX_MB}MB` }, { status: 413 })
    }

    // Nombre único estable
    const key = `items/${itemId}/${Date.now()}-${file.name}`

    // Subida pública
    const blob = await put(key, file, {
      access: 'public', // URL pública
      contentType: file.type, // correcto mime
      addRandomSuffix: false, // ya es único por timestamp
      token: process.env.BLOB_READ_WRITE_TOKEN, // explícito por claridad
    })

    // blob.url = https://public.blob.vercel-storage.com/...
    return NextResponse.json({ url: blob.url })
  } catch (err: any) {
    console.error('Blob upload error', err)
    return NextResponse.json({ error: err?.message || 'Upload failed' }, { status: 500 })
  }
}
