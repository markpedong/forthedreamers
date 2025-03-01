import { getServerSession } from 'next-auth'
import Profile from './components'
import authOptions from '@/app/api/auth/[...nextauth]/options'
import { getUserData } from '@/utils/request'

const Page = async () => {
	const res = await getServerSession(authOptions)
	const data = await getUserData(`${res?.user?.id}`, res?.accessToken)

return <Profile data={data?.data} />
}

export default Page
