'use client'

import {
	Button,
	Link,
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	NavbarMenu,
	NavbarMenuItem,
	NavbarMenuToggle
} from '@heroui/react'
import { FC, useState } from 'react'
import { FaSearch } from 'react-icons/fa'

const NavBar: FC = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const menuItems = ['Home', 'Shop', 'Collection', 'Support']

	return (
		<Navbar onMenuOpenChange={setIsMenuOpen}>
			<NavbarContent>
				<NavbarMenuToggle
					aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
					className="sm:hidden"
				/>
				<NavbarContent className="hidden sm:flex gap-4" justify="center">
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
				<p className="font-bold text-inherit">For the Dreamers</p>
			</NavbarContent>
			<NavbarContent justify="end">
				<FaSearch />
				<NavbarItem className="hidden lg:flex">
					<Link href="#">Login</Link>
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
}

export default NavBar
