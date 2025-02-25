'use client'

import { NO_NAVBAR_PAGES } from '@/app/_constants'
import { poppins } from '@/public/fonts'
import {
	Link,
	Navbar,
	NavbarContent,
	NavbarItem,
	NavbarMenu,
	NavbarMenuItem,
	NavbarMenuToggle
} from '@heroui/react'
import classNames from 'classnames'
import { usePathname } from 'next/navigation'
import { FC, useState } from 'react'
import { FaSearch } from 'react-icons/fa'

const NavBar: FC = () => {
	const pathname = usePathname()
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const menuItems = ['Home', 'Shop', 'Collection', 'Support']

	return (
		!NO_NAVBAR_PAGES.includes(pathname) && (
			<Navbar onMenuOpenChange={setIsMenuOpen} isBordered>
				<NavbarContent>
					<NavbarMenuToggle
						aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
						className="md:hidden"
					/>
					<NavbarContent className="hidden md:flex gap-4" justify="center">
						<NavbarItem>
							<Link color="foreground" href="#">
								Home
							</Link>
						</NavbarItem>
						<NavbarItem>
							<Link aria-current="page" href="#">
								Shop
							</Link>
						</NavbarItem>
						<NavbarItem>
							<Link color="foreground" href="#">
								Collection
							</Link>
						</NavbarItem>
						<NavbarItem>
							<Link color="foreground" href="#">
								Support
							</Link>
						</NavbarItem>
					</NavbarContent>
				</NavbarContent>
				<NavbarContent justify="center">
					<p className={classNames('font-bold text-inherit tracking-wider', poppins.className)}>
						For the Dreamers
					</p>
				</NavbarContent>
				<NavbarContent justify="end">
					<FaSearch />
					<NavbarItem className="hidden md:flex">
						<Link href="/login">Login</Link>
					</NavbarItem>
				</NavbarContent>
				<NavbarMenu className="px-0">
					{menuItems.map((item, index) => (
						<NavbarMenuItem
							key={`${item}-${index}`}
							className="py-5 uppercase border-[rgba(0,0,0,0.75)] border-b-2 px-5"
						>
							<Link
								className="w-full tracking-widest"
								color={
									index === 2 ? 'primary' : index === menuItems.length - 1 ? 'danger' : 'foreground'
								}
								href="#"
								size="lg"
							>
								{item}
							</Link>
						</NavbarMenuItem>
					))}
				</NavbarMenu>
			</Navbar>
		)
	)
}

export default NavBar
