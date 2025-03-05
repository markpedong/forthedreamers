import Profile from './components'
import { getServerSession } from 'next-auth'
import authOptions from '@/app/api/auth/[...nextauth]/options'
import {
  getAddressesServer,
  getOrderServer,
  getPaymentMethodServer,
  getProfileServer,
  getReviewServer,
  getWishlistServer
} from '@/lib/server'
import { Users } from '@prisma/client'

const Page = async () => {
  const session = await getServerSession(authOptions)
  const [userInfo, addresses, paymentMethods, orders, reviews, wishlist] = await Promise.all([
    getProfileServer(session?.user?.id),
    getAddressesServer(session?.user?.id),
    getPaymentMethodServer(session?.user?.id),
    getOrderServer(session?.user?.id),
    getReviewServer(session?.user?.id),
    getWishlistServer(session?.user?.id)
  ])

  return (
    <Profile
      userInfo={userInfo as Users}
      addresses={addresses}
      paymentMethods={paymentMethods}
      orders={orders}
      reviews={reviews}
      wishlist={wishlist}
    />
  )
}

export default Page
