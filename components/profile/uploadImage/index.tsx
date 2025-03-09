import { Spinner } from '@heroui/react'
import Image from 'next/image'
import React, { FC } from 'react'
import { Icon } from '@iconify/react'

type Props = {
	handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void
	isPending: boolean
	image: string
}

const UploadImage: FC<Props> = ({ handleFileChange, image, isPending }) => {
	return !['undefined', 'null', ''].includes(image) ? (
		<Image alt="profile-image" src={image} width="50" height="50" className="rounded-full" />
	) : isPending ? (
		<div className="flex justify-start items-center p-3">
			<Spinner size="md" />
		</div>
	) : (
		<label className="w-12 h-12 flex flex-col items-center justify-center bg-gray-400 text-white rounded-full cursor-pointer relative">
			<Icon icon="ic:outline-plus" className="text-lg absolute top-2" />
			<span className="text-xs mt-4">Upload</span>
			<input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
		</label>
	)
}

export default UploadImage
