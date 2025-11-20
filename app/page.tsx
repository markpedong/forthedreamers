import { TProduct } from '@/lib/types'
import LandingPage from './components'
import prisma from '@/lib/prisma'

const Page = async () => {
  const products = (await prisma.product.findMany({
    include: {
      variants: true,
      specs: true,
      category: true,
      seller: true
    }
  })) as TProduct[]

  return <LandingPage products={products} />
}

export default Page
