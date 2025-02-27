import { useSession } from 'next-auth/react'
import React, { FC } from 'react'
import PageLoader from '../page-loader'

type Props = {
	children: React.ReactNode
}

const AuthProvider: FC<Props> = ({ children }) => {
	const { status } = useSession()

	if (status === 'loading') {
		return <PageLoader />
	}

	return children
}

export default AuthProvider
