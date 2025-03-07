'use client'
import { Button } from '@heroui/react'
import { useRouter } from 'next/navigation'
import { Icon } from '@iconify/react'

const Page = () => {
	const navigate = useRouter()

	const handleRedirect = () => {
		navigate.push('/')
	}
	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
			<div className="flex flex-col items-center max-w-md text-center">
				<h1 className="text-8xl font-bold text-black mb-2">404</h1>
				<div className="w-16 h-1 bg-black my-6"></div>
				<h2 className="text-2xl font-medium text-black mb-4">Page Not Found</h2>
				<p className="text-gray-600 mb-8">The page you are looking for doesn't exist or has been moved.</p>
				<Button
					color="default"
					variant="solid"
					size="lg"
					onPress={handleRedirect}
					startContent={<Icon icon="lucide:arrow-left" />}
					className="bg-black text-white hover:bg-gray-800"
				>
					Back to Home
				</Button>
			</div>
		</div>
	)
}

export default Page
