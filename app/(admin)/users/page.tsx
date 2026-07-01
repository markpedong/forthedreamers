import { getSession, listUsers, permissionListUsers } from '@/lib/server-actions'
import Users from './index'
import { redirect } from 'next/navigation'

const Page = async () => {
  const session = await getSession()

  if (!(await permissionListUsers()).success) {
    redirect('/')
  }

  try {
    const users = await listUsers()
    const filteredUsers = users.filter(u => u.id !== session?.user.id)

    return <Users users={filteredUsers} />
  } catch (err) {
    if (err instanceof Error && err.message.includes('not allowed')) {
      redirect('/products')
    }

    redirect('/')
  }
}

export default Page
