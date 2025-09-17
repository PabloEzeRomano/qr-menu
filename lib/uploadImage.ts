export async function uploadItemImage(file: File, itemId: string): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('itemId', itemId)

  const res = await fetch('/api/upload/blob', {
    method: 'POST',
    body: formData,
  })

  const json = await res.json()
  if (!res.ok) throw new Error(json?.error || 'Upload failed')

  return json.url as string
}
