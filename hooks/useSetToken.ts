import { getSession } from "next-auth/react"
import { useEffect, useState } from "react"

export const useSetToken = () => {
  const [accessToken, setAccessToken] = useState(
    typeof window !== 'undefined' ? localStorage.getItem('accessToken') : ''
  )

  
  useEffect(() => {
    if (!accessToken) {
      const handleNoAccessToken = async () => {
        const session = await getSession()
        const newToken = session?.accessToken || ''
        console.log("hello from useSetToken")

        localStorage.setItem('accessToken', newToken)
        setAccessToken(newToken) // Update state to reflect the new token
      }

      handleNoAccessToken()
    }
  }, [accessToken])

  return accessToken
}
