'use client'

import { poppins } from '@/public/fonts'
import {
	Badge,
	Button,
	Link,
	Navbar,
	NavbarContent,
	NavbarItem,
	NavbarMenu,
	NavbarMenuItem,
	NavbarMenuToggle
} from '@heroui/react'
import classNames from 'classnames'
import { usePathname, useRouter } from 'next/navigation'
import { FC, useState } from 'react'
import SearchDrawer from './search-drawer'
import { NO_NAVBAR_FOOTER_PAGES } from '@/constants'
import { useTheme } from 'next-themes'
import { useSession } from 'next-auth/react'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { setCartOpen, setLoginFormState, toggleDarkMode } from '@/redux/slices/appSlice'
import { Icon } from '@iconify/react'
import { USER_ROLE } from '@prisma/client'
import { LOGINFORM_STATE } from '@/constants/types'
import CartDrawer from './cart-drawer'

const NavBar: FC = () => {
	const pathname = usePathname()
	const darkMode = useAppSelector(state => state.app)
	const cartItems = useAppSelector(state => state.user.cartItems)
	const { push } = useRouter()
	const { data: session } = useSession()
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const menuItems = ['Home', 'Shop', 'Collection', 'Support']
	const { setTheme } = useTheme()
	const dispatch = useAppDispatch()
	const toggle = () => {
		dispatch(toggleDarkMode())
		setTheme(darkMode ? 'light' : 'dark')
	}
	const p = (name: string) => push(`/${name === 'home' ? '' : name}`)
	const isUser = session?.user.role === USER_ROLE.USER

	return (
		!NO_NAVBAR_FOOTER_PAGES.includes(pathname) && (
			<Navbar onMenuOpenChange={setIsMenuOpen} isBordered>
				<NavbarContent>
					<NavbarMenuToggle aria-label={isMenuOpen ? 'Close menu' : 'Open menu'} className="md:hidden" />
					<NavbarContent className="hidden md:flex gap-4" justify="center">
						{menuItems?.map(w => (
							<NavbarItem key={w} className="cursor-pointer" onClick={() => p(w?.toLowerCase())}>
								{w}
							</NavbarItem>
						))}
					</NavbarContent>
				</NavbarContent>
				<NavbarContent justify="center">
					<p className={classNames('font-bold text-inherit tracking-wider', poppins.className)}>For the Dreamers</p>
				</NavbarContent>
				<NavbarContent justify="end">
					<CartDrawer />
					<SearchDrawer />
					{darkMode ? (
						<Icon icon="solar:sun-bold" className="cursor-pointer" onClick={toggle} />
					) : (
						<Icon icon="solar:moon-bold" className="cursor-pointer" onClick={toggle} />
					)}
					{session?.user.role === 'USER' && cartItems.length > 0 && (
						<Icon icon="lucide:shopping-cart" className="cursor-pointer" onClick={() => dispatch(setCartOpen(true))} />
					)}
					{session?.user?.id && !['/profile', '/seller/dashboard'].includes(pathname) && (
						<Link color="foreground" href={isUser ? '/profile' : '/seller/dashboard'}>
							{isUser ? 'Profile' : 'Dashboard'}
						</Link>
					)}

					{!session?.user?.id && (
						<Link
							color="foreground"
							href="/login"
							className="hidden md:block"
							onPress={() => dispatch(setLoginFormState(LOGINFORM_STATE.USER_LOGIN))}
						>
							Login
						</Link>
					)}
				</NavbarContent>
				<NavbarMenu className="flex flex-col justify-between p-6">
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
