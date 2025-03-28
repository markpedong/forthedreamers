'use client'
import { useAppSelector } from '@/redux/store'
import React from 'react'

type Props = {}

const Page = (props: Props) => {
	const cartItem = useAppSelector(state => state.user.cartItems)

	return <div>Page</div>
}

export default Page
