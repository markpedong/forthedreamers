import { generateResponse } from "@/utils/helpers"

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file')

  if (!file) {
    return generateResponse({ error: 'No file uploaded', status: 400 })
  }

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: file
    })

    const data = await response.json()
    return generateResponse({ data })
  } catch (error) {
    return generateResponse({ error: 'Failed to upload file', status: 500 })
  }
}