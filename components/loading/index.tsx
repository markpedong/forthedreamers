import { Spinner } from '@heroui/react'
import React, { FC } from 'react'

const Loading: FC = () => (
	<div className="flex items-center justify-center">
		<Spinner size="md" />
	</div>
)

export default Loading
