'use client'

import { poppins } from '@/public/fonts'
import { Link, Navbar, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from '@heroui/react'
import classNames from 'classnames'
import { usePathname, useRouter } from 'next/navigation'
import { FC, useState } from 'react'
import SearchDrawer from '../search-drawer'
import { NO_NAVBAR_PAGES } from '@/constants'
import { IoMoon } from 'react-icons/io5'
import { FaSun } from 'react-icons/fa'
import { useTheme } from 'next-themes'
import { useSession } from 'next-auth/react'

const NavBar: FC = () => {
	const pathname = usePathname()
	const { push } = useRouter()
	const { data: session } = useSession()
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const menuItems = ['Home', 'Shop', 'Collection', 'Support']
	const { theme, setTheme } = useTheme()
	const isDarkMode = theme === 'dark'
	const toggle = () => setTheme(isDarkMode ? 'light' : 'dark')
	const p = (name: string) => push(`/${name === 'home' ? '' : name}`)

	return (
		!NO_NAVBAR_PAGES.includes(pathname) && (
			<Navbar onMenuOpenChange={setIsMenuOpen} isBordered>
				<NavbarContent>
					<NavbarMenuToggle aria-label={isMenuOpen ? 'Close menu' : 'Open menu'} className="md:hidden" />
					<NavbarContent className="hidden md:flex gap-4" justify="center">
						{menuItems?.map(w => (
							<NavbarItem className="cursor-pointer" onClick={() => p(w?.toLowerCase())}>
								{w}
							</NavbarItem>
						))}
					</NavbarContent>
				</NavbarContent>
				<NavbarContent justify="center">
					<p className={classNames('font-bold text-inherit tracking-wider', poppins.className)}>For the Dreamers</p>
				</NavbarContent>
				<NavbarContent justify="end">
					<SearchDrawer />
					{isDarkMode ? (
						<IoMoon className="cursor-pointer" onClick={toggle} />
					) : (
						<FaSun className="cursor-pointer" onClick={toggle} />
					)}
					{session?.user?.id && pathname !== '/profile' && (
						<Link color="foreground" href="/profile">
							Profile
						</Link>
					)}
					{!session?.user?.id && (
						<Link color="foreground" href="/login">
							Login
						</Link>
					)}
				</NavbarContent>
				<NavbarMenu className="flex flex-col justify-between px-0">
					<div>
						{menuItems.map((item, index) => (
							<NavbarMenuItem
								key={`${item}-${index}`}
								className="py-5 uppercase border-[rgba(0,0,0,0.75)] border-b-1 px-3"
								onClick={() => p(item?.toLowerCase())}
							>
								<Link className="w-full tracking-wide" color="foreground" href="#" size="lg">
									{item}
								</Link>
							</NavbarMenuItem>
						))}
					</div>
					<Link color="foreground" className="ml-2 mb-2 uppercase tracking-wide" href="/login">
						Login
					</Link>
				</NavbarMenu>
			</Navbar>
		)
	)
}

export default NavBar
