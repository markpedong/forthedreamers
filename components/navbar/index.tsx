'use client'

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
import SearchDrawer from '../searchDrawer'
import { NO_NAVBAR_PAGES } from '@/constants'

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
							<Link color="foreground" href="#">
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
					<SearchDrawer />
					<NavbarItem className="hidden md:flex">
						<Link color="foreground" href="/login">
							Login
						</Link>
					</NavbarItem>
				</NavbarContent>
				<NavbarMenu className="flex flex-col justify-between px-0">
					<div>
						{menuItems.map((item, index) => (
							<NavbarMenuItem
								key={`${item}-${index}`}
								className="py-5 uppercase border-[rgba(0,0,0,0.75)] border-b-1 px-3"
							>
								<Link className="w-full tracking-wide" color="foreground" href="#" size="lg">
									{item}
								</Link>
							</NavbarMenuItem>
						))}
					</div>
					<Link color="foreground" className='ml-2 mb-2 uppercase tracking-wide' href='/login'>Login</Link>
				</NavbarMenu>
			</Navbar>
		)
	)
}

export default NavBar
