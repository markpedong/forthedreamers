import { Drawer, DrawerContent, DrawerHeader, Input, useDisclosure } from '@heroui/react'
import { FC } from 'react'
import { FaSearch } from 'react-icons/fa'
import { IoClose } from 'react-icons/io5'

const SearchDrawer: FC = () => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure()

	return (
		<>
			<FaSearch onClick={onOpen} className="cursor-pointer" />
			<Drawer
				isOpen={isOpen}
				className="rounded-none"
				backdrop="blur"
				isDismissable={false}
				hideCloseButton
				motionProps={{
					variants: {
						enter: {
							opacity: 1,
							x: 0,
							//@ts-expect-error type error
							duration: 0.3
						},
						exit: {
							x: 100,
							opacity: 0,
							//@ts-expect-error type error
							duration: 0.3
						}
					}
				}}
				onOpenChange={onOpenChange}
			>
				<DrawerContent className="border-x-[rgba(0,0,0,0.5)] border">
					{onClose => (
						<>
							<DrawerHeader className="flex justify-between items-center gap-5">
								<Input label="Search for a product" />
								<IoClose onClick={onClose} />
							</DrawerHeader>
							{/* <DrawerBody>
								<p>This drawer has custom enter/exit animations.</p>
								<p>
									Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus non
									risus hendrerit venenatis. Pellentesque sit amet hendrerit risus, sed porttitor
									quam.
								</p>
							</DrawerBody> */}
							{/* <DrawerFooter>
								<Button color="danger" variant="light" onPress={onClose}>
									Close
								</Button>
								<Button color="primary" onPress={onClose}>
									Action
								</Button>
							</DrawerFooter> */}
						</>
					)}
				</DrawerContent>
			</Drawer>
		</>
	)
}

export default SearchDrawer
