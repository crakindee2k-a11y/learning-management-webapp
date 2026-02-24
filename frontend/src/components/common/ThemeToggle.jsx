import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="group relative flex h-10 w-10 transform-gpu items-center justify-center rounded-md bg-zinc-100/85 shadow-[0_4px_16px_-8px_rgba(15,23,42,0.08)] transition-all motion-safe:active:translate-y-px motion-safe:active:scale-[0.98] hover:bg-zinc-200/90 dark:bg-zinc-900/75 dark:shadow-[0_6px_20px_-10px_rgba(0,0,0,0.40)] dark:hover:bg-zinc-900/80"
      aria-label="Toggle theme"
    >
      <div className="relative h-5 w-5">
        <Sun className={`absolute inset-0 h-5 w-5 text-zinc-700 transition-all duration-300 dark:text-zinc-200 ${
          theme === 'light' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'
        }`} />
        <Moon className={`absolute inset-0 h-5 w-5 text-zinc-700 transition-all duration-300 dark:text-zinc-200 ${
          theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
        }`} />
      </div>
    </button>
  )
}

export default ThemeToggle
