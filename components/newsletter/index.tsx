import { useAppSelector } from '@/redux/store'
import { Button, Input } from '@heroui/react'
import classNames from 'classnames'
import { useTheme } from 'next-themes'
import React from 'react'

type Props = {}

const NewsLetter = (props: Props) => {
	const { theme } = useTheme()

	return (
		<div className="my-40 max-w-5xl mx-auto font-[Sora]">
			<div className="flex justify-center flex-col items-center max-w-xl mx-auto gap-3">
				<div className="uppercase text-3xl tracking-wider font-bold">
					discover style just <br /> a button press away!
				</div>
				<Input placeholder="Your email address" className="mt-6" />
				<Button
					fullWidth
					radius="sm"
					className={classNames({
						'bg-white text-black': theme === 'dark',
						'bg-black text-white': theme === 'light'
					})}
				>
					Subscribe
				</Button>
				<span className="uppercase w-full text-xs text-center">
					Instantly access the latest fashion trends and exclusive deals on our site. Discover your perfect style in a
					few clicks!{' '}
				</span>
			</div>
		</div>
	)
}

export default NewsLetter
