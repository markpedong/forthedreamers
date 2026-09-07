import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { useIsMobile } from '@/hooks/useIsMobile'
import classNames from 'classnames'
import { Moon, Sun } from '../dynamic'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { setTheme } from '@/redux/reducers/appData'

const ThemeToggleButton = () => {
  const theme = useAppSelector(state => state.appData.theme)
  const dispatch = useAppDispatch()
  const isMobile = useIsMobile()

  const toggleTheme = () => {
    dispatch(setTheme(theme === 'light' ? 'dark' : 'light'))
  }

  return (
    <AnimatePresence mode='wait' initial={false}>
      <motion.div
        key={theme}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className={classNames('fixed bottom-5 right-5 z-50', {
          'bottom-28 ': isMobile
        })}
      >
        <Button
          variant='outline'
          size='icon'
          onClick={toggleTheme}
          className='rounded-full shadow-md border border-border bg-background hover:bg-accent'
        >
          {theme === 'light' ? <Moon className='h-[1.2rem] w-[1.2rem]' /> : <Sun className='h-[1.2rem] w-[1.2rem]' />}
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </motion.div>
    </AnimatePresence>
  )
}

export default ThemeToggleButton
