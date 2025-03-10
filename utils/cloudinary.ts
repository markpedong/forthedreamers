import { v2 as cloudinary } from 'cloudinary'
import { UploadApiResponse } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
})

export const uploadImageToCloudinary = async (file: File, folder?: string): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder ? `forthedreamers/${folder}` : 'forthedreamers',
        resource_type: 'image',
        format: 'webp',
        quality: 'auto:best',
        transformation: [
          { width: 500, height: 500, crop: 'fill', gravity: 'auto' },
          { fetch_format: 'webp' }
        ]
      },
      (error, result: UploadApiResponse | undefined) => {
        if (error || !result) {
          console.error('Cloudinary upload error:', error)
          reject(error?.message || 'Upload failed')
        } else {
          resolve(result.secure_url)
        }
      }
    )

    uploadStream.end(buffer)
  })
}


export default cloudinary
