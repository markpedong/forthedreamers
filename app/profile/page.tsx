import { getUserData } from '@/utils/request'
import { authOptions } from '../api/auth/[...nextauth]/route'
import Profile from './components'
import { getServerSession } from 'next-auth'

type Props = {}

const Page = async (props: Props) => {
  const session = await getServerSession(authOptions)
  const res = await getUserData(session?.user?.id as string)

  console.log('res', res)
  return <Profile />
}

export default Page
