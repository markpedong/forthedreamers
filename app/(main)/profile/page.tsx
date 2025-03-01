import { getUserData } from '@/utils/request'
import { getServerSession } from 'next-auth'
import { Suspense } from 'react'
import authOptions from '../../api/auth/[...nextauth]/options'
import Profile from './components'

const ProfileLoader = async () => {
	const session = await getServerSession(authOptions)

	// Ensure we have a valid user ID before fetching data
	const userId = session?.user?.id
	if (!userId) return <div>Error: User not found</div>

	// Fetch user data
	const userData = await getUserData(userId)

	// Ensure we have valid user data before rendering
	if (!userData?.data) return <div>Loading profile...</div>

	return <Profile data={userData.data} />
}

const Page = async () => {
	return <ProfileLoader />
}

export default Page
