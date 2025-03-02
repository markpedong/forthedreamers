import prisma from "@/db"
import { generateResponse } from "@/utils/helpers"
import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react"
import authOptions from "../auth/[...nextauth]/options";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return generateResponse({ error: "User session not found", status: 401 });
    }

    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return generateResponse({ error: 'No file uploaded', status: 400 })
    }

    const cloudinaryFormData = new FormData()
    cloudinaryFormData.append("file", file)
    cloudinaryFormData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!)
    cloudinaryFormData.append("folder", "forthedreamers/profiles")
    cloudinaryFormData.append("upload_preset", "forthedreamers")

    const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: cloudinaryFormData
    })

    if (!response.ok) {
      console.error("Cloudinary upload failed", await response.text())
      throw new Error("Cloudinary upload failed")
    }

    const data = await response.json()
    const imageUrl = data.secure_url;


    const updatedUser = await prisma.users.update({
      where: { id: session?.user?.id },
      data: { image: imageUrl },
    });

    return generateResponse({ data })
  } catch (error) {
    console.log("error", error)
    return generateResponse({ error: 'Failed to upload file', status: 500 })
  }
}
