import authOptions from '@/app/api/auth/[...nextauth]/options'
import { getCartItems } from '@/lib/server'
import { getUserData } from '@/utils/request'
import { USER_ROLE } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { unauthorized } from 'next/navigation'
import Profile from './components'

const Page = async () => {
	const session = await getServerSession(authOptions)

	if (session?.user.role === USER_ROLE.SELLER) {
		unauthorized()
	}

	const [userInfo, carts] = await Promise.all([
		getUserData(`${session?.user.id}`),
		getCartItems(`${session?.user?.id}`)
	])

	return <Profile userInfo={userInfo.data} carts={carts.data} />
}

export default Page
