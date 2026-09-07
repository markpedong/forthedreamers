import type {Address} from '@/generated/prisma'
import {Button} from '@/components/ui/button'
import prisma from '@/lib/prisma'
import {getSession} from '@/lib/server-actions'
import {Package} from 'lucide-react'
import {redirect} from 'next/navigation'
import Link from 'next/link'
import CartBackLink from './cart-back-link'
import PlaceOrderButton from './place-order-button'

const CheckoutPage = async () => {
  const session = await getSession()
  if (!session) redirect('/sign-in?next=/checkout')

  const addressesQuery = prisma.address.findMany({
    where: {userId: session.user.id},
    orderBy: {isDefault: 'desc'}
  })

  const [cartItems, addresses] = await Promise.all([
    prisma.cartItem.findMany({
      where: {userId: session.user.id},
      include: {
        variant: {
          include: {
            product: {
              include: {
                seller: true
              }
            }
          }
        },
        product: true
      }
    }),
    addressesQuery
  ])

  if (cartItems.length === 0) {
    return (
      <main className='max-w-4xl mx-auto py-12 px-4 text-center'>
        <Package className='w-16 h-16 mx-auto text-muted-foreground mb-4' />
        <h1 className='text-2xl font-bold mb-2'>Nothing to checkout</h1>
        <p className='text-muted-foreground mb-6'>Your cart is empty. Add some products and come back.</p>
        <Link href='/'>
          <Button>Continue Shopping</Button>
        </Link>
      </main>
    )
  }

  const total = cartItems.reduce((sum, item) => {
    const price = item.variant.discountedPrice ?? item.variant.price
    return sum + price * item.quantity
  }, 0)

  const sellerGroups = new Map<string, typeof cartItems>()
  for (const item of cartItems) {
    const sellerId = item.variant.product.sellerId
    if (!sellerGroups.has(sellerId)) sellerGroups.set(sellerId, [])
    sellerGroups.get(sellerId)!.push(item)
  }

  return (
    <main className='max-w-6xl mx-auto py-8 px-4'>
      <CartBackLink />

      <h1 className='text-3xl font-bold mb-8'>Checkout</h1>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <div className='lg:col-span-2 space-y-6'>
          <div className='border rounded-lg p-6 bg-card space-y-4'>
            <h2 className='text-xl font-bold mb-4'>Order Summary</h2>
            {cartItems.map(item => {
              const price = item.variant.discountedPrice ?? item.variant.price

              return (
                <div key={item.id} className='flex justify-between items-center py-2 border-b last:border-0'>
                  <div>
                    <p className='font-medium'>
                      {item.variant.product.name} — {item.variant.name}
                    </p>
                    <p className='text-sm text-muted-foreground'>Qty: {item.quantity}</p>
                  </div>
                  <p className='font-semibold'>${(price * item.quantity).toFixed(2)}</p>
                </div>
              )
            })}
          </div>

          <ShippingAddressForm addresses={addresses} />
          <PlaceOrderButton total={total} />
        </div>

        <div className='order-first lg:order-last'>
          <div className='p-6 border rounded-lg bg-card space-y-4'>
            <h2 className='text-xl font-bold'>Total</h2>
            <div className='space-y-2 text-sm'>
              {Array.from(sellerGroups.entries()).map(([sellerId, items]) => {
                const sellerTotal = items.reduce((sum, item) => {
                  const price = item.variant.discountedPrice ?? item.variant.price
                  return sum + price * item.quantity
                }, 0)

                return (
                  <div key={sellerId} className='flex justify-between'>
                    <span>{items[0].variant.product.seller?.storeName || 'Seller'}</span>
                    <span>${sellerTotal.toFixed(2)}</span>
                  </div>
                )
              })}
              <div className='border-t pt-2 flex justify-between font-bold text-lg'>
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

const ShippingAddressForm = ({addresses}: {addresses: Address[]}) => {
  const defaultAddress = addresses.find(address => address.isDefault)
  const selectedAddressId = defaultAddress?.id || addresses[0]?.id

  return (
    <div className='border rounded-lg p-6 bg-card space-y-4'>
      <h2 className='text-xl font-bold'>Shipping Address</h2>

      {addresses.length > 0 ? (
        <div className='space-y-3'>
          {addresses.map(address => (
            <label
              key={address.id}
              className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                address.id === selectedAddressId ? 'border-primary bg-primary/5' : 'hover:bg-muted'
              }`}
            >
              <input
                type='radio'
                name='address'
                value={address.id}
                defaultChecked={address.id === selectedAddressId}
                className='mt-1'
              />
              <div>
                <p className='font-medium'>{address.fullName}</p>
                <p className='text-sm text-muted-foreground'>
                  {address.street}, {address.city}, {address.region} {address.postalCode}
                </p>
                <p className='text-sm text-muted-foreground'>{address.phoneNumber}</p>
                {address.isDefault && <span className='text-xs text-primary font-medium ml-2'>Default</span>}
              </div>
            </label>
          ))}
        </div>
      ) : (
        <p className='text-muted-foreground'>No saved addresses. Please add one.</p>
      )}

      <Link href='/profile?tab=addresses'>
        <Button variant='outline' className='w-full'>
          {addresses.length > 0 ? 'Manage Addresses' : 'Add Address'}
        </Button>
      </Link>
    </div>
  )
}

export const dynamic = 'force-dynamic'

export default CheckoutPage
