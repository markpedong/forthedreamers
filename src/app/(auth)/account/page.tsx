import { redirect } from 'next/navigation'
import React from 'react'
import AccountPage from './account'
import Navbar from '@/components/navbar'
import dynamic from 'next/dynamic'

const Footer = dynamic(() => import('@/components/footer'), {
	ssr: false
})

const Page = () => {
	const isAuthenticated = true

	if (!isAuthenticated) {
		redirect('/')
	} else {
		return (
			<>
				<Navbar />
				<AccountPage />
				<Footer />
			</>
		)
	}
}

export default Page
