import Profile from './components'
import { getServerSession } from 'next-auth'
import { getUserData } from '@/utils/request'

type Props = {}

const Page = async (props: Props) => {
  const session = await getServerSession()
  const res = await getUserData(session?.user?.id as string)

  console.log("res", res)
  return <Profile />
}

export default Page
