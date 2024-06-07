import { useState, useEffect } from 'react'

const useWindowWidth = () => {
	const [windowWidth, setWindowWidth] = useState(Number(typeof window !== 'undefined' && window.innerWidth))

	console.log(typeof window !== 'undefined' && window.innerWidth)

	useEffect(() => {
		const updateWindowWidth = () => {
			setWindowWidth(window.innerWidth)
		}

		updateWindowWidth()

		window.addEventListener('resize', updateWindowWidth)

		return () => {
			window.removeEventListener('resize', updateWindowWidth)
		}
	}, [])

	return windowWidth
}

export default useWindowWidth
