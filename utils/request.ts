import { Users } from '@prisma/client'
import { get, post } from './http'

// const refreshToken = async (): Promise<string | null> => {
//   try {
//     const refreshToken = localStorage.getItem('refreshToken')
//     if (!refreshToken) return null

//     const response = await post<{ accessToken: string }>({
//       url: '/api/auth/refresh',
//       body: { refreshToken },
//       isJson: true,
//       isSecured: false
//     })

//     if (!response || !response.data?.accessToken) return null

//     localStorage.setItem('accessToken', response.data.accessToken)
//     return response.data.accessToken
//   } catch (error) {
//     console.error('Failed to refresh token:', error)
//     return null
//   }
// }

export const registerUser = async (body: any) =>
  post<Users>({ url: '/api/users', data: body, })

export const getUserData = async (id: string,) => get<Users>({ url: `/api/users/${id}` })
