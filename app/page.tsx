import LandingPage, { type LandingProduct } from './components'
import prisma from '@/lib/prisma'

const Page = async () => {
  const products = (await prisma.product.findMany({
    include: {
      variants: true,
      seller: true
    },
    orderBy: { createdAt: 'desc' },
    take: 24
  })) satisfies LandingProduct[]

  return <LandingPage products={products} />
}

export default Page
