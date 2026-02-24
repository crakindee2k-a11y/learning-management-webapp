import './App.css'
import { useEffect, useRef } from 'react'
import Navbar from './components/layout/Navbar'
import Sidebar from './components/layout/Sidebar'
import AppRouter from './router/AppRouter'

function App() {
  const doodleRef = useRef(null)
  const tintRef = useRef(null)

  useEffect(() => {
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    if (reduceMotion) return

    let rafId = 0

    const update = () => {
      const y = window.scrollY || 0
      const doodleY = y * 0.06
      const tintY = y * 0.03

      if (doodleRef.current) {
        doodleRef.current.style.backgroundPosition = `50% calc(50% + ${doodleY}px)`
      }
      if (tintRef.current) {
        tintRef.current.style.backgroundPosition = `50% calc(50% + ${tintY}px)`
      }

      rafId = 0
    }

    const onScroll = () => {
      if (rafId) return
      rafId = window.requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    update()

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafId) window.cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div className="relative min-h-screen bg-slate-50 transition-colors dark:bg-zinc-900">
      <div ref={doodleRef} className="pointer-events-none fixed inset-0 hidden dark:block bg-[url('/doodle.jpg')] bg-center bg-[length:820px_auto] bg-repeat opacity-[0.62] brightness-[0.54] contrast-[1.06]" />
      <div ref={tintRef} className="pointer-events-none fixed inset-0 hidden dark:block bg-[radial-gradient(1000px_circle_at_15%_10%,rgba(255,83,73,0.10),transparent_55%),radial-gradient(900px_circle_at_85%_80%,rgba(255,122,109,0.06),transparent_60%)] bg-center" />
      <div className="pointer-events-none fixed inset-0 hidden dark:block bg-black/25" />
      <div className="pointer-events-none fixed inset-0 hidden dark:block bg-gradient-to-b from-zinc-900/20 via-zinc-900/45 to-zinc-950/75" />

      <div className="relative z-10">
        <Navbar />
        <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 relative">
          <div className="pointer-events-none absolute -inset-8 -z-10 hidden dark:block rounded-[28px] bg-[radial-gradient(ellipse_at_center,rgba(9,9,11,0.84)_0%,rgba(9,9,11,0.44)_45%,transparent_72%)]" />
          <Sidebar />
          <main className="flex-1">
            <AppRouter />
          </main>
        </div>
      </div>
    </div>
  )
}

export default App
