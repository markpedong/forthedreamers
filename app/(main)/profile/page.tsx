import Profile from './components'
import { getServerSession } from 'next-auth'
import authOptions from '../../api/auth/[...nextauth]/options'
import { getUserData } from '@/utils/request'

type Props = {}

const Page = async () => {
	const session = await getServerSession(authOptions)
	const res = await getUserData(`${session?.user?.id}`)

	return <Profile data={res?.data} />
}

export default Page
