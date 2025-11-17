import prisma from '@/lib/prisma'
import LandingPage from './components'
import { TProduct } from '@/lib/types'

type Props = {}

const Page = async (props: Props) => {
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
