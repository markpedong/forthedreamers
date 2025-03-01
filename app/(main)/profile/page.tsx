import { getServerSession } from 'next-auth'
import Profile from './components'
import authOptions from '@/app/api/auth/[...nextauth]/options'
import { getUserData } from '@/utils/request'

const Page = async () => {
	return <Profile />
}

export default Page
