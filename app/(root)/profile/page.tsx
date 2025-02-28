import { getUserData } from '@/utils/request'
import Profile from './components'
import { getServerSession } from 'next-auth'
import authOptions from '@/app/api/auth/[...nextauth]/options'

type Props = {}

const Page = async (props: Props) => {
	const session = await getServerSession(authOptions)
	const res = await getUserData(session?.user?.id!, session?.accessToken)

	console.log('res', res)
	return <Profile />
}

export default Page
