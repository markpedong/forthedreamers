import Profile from './components'
import { getServerSession } from 'next-auth'
import authOptions from '@/app/api/auth/[...nextauth]/options'
import { getAddress } from '@/utils/request'

const Page = async () => {
	const session = await getServerSession(authOptions)
	const addresses = await getAddress(session?.accessToken)

	console.log('addresses', addresses)
	return <Profile />
}

export default Page
