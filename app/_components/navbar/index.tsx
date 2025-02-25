'use client'

import { NO_NAVBAR_PAGES } from '@/app/_constants'
import {
	Link,
	Navbar,
	NavbarContent,
	NavbarItem,
	NavbarMenu,
	NavbarMenuItem,
	NavbarMenuToggle
} from '@heroui/react'
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
						<NavbarItem className="bg-red-500">
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
					<p className="font-bold text-inherit">For the Dreamers</p>
				</NavbarContent>
				<NavbarContent justify="end">
					<FaSearch />
					<NavbarItem className="hidden md:flex">
						<Link href="/login">Login</Link>
					</NavbarItem>
				</NavbarContent>
				<NavbarMenu>
					{menuItems.map((item, index) => (
						<NavbarMenuItem key={`${item}-${index}`}>
							<Link
								className="w-full"
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
