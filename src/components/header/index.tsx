'use client'
import classNames from 'classnames'
import React, { FC } from 'react'
import { Roboto_Condensed } from 'next/font/google'

const roboto = Roboto_Condensed({ weight: ['300', '800'], subsets: ['latin'] })

const Header: FC<{ arr: string[] }> = ({ arr }) => {
	return (
		<div className={classNames('flex gap-3', roboto.className)}>
			{arr?.map((q, i) => (
				<div className="flex gap-4" key={`${q}${i}`}>
					<span className="underline underline-offset-4 text-[1rem] last:no-underline">{q}</span>
					{i !== arr.length - 1 && <span className="no-underline">/</span>}
				</div>
			))}
		</div>
	)
}

export default Header
