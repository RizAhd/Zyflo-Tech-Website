import { createContext, useContext, useEffect } from 'react'

/*
  Lets a page say "my content is on screen". The footer waits for it, so it
  never shows up under an empty gap while a page is still loading.
*/
export const ReadyContext = createContext<() => void>(() => {})

/** Render at the end of a page: mounts only once everything above it has. */
export function Ready() {
  const ready = useContext(ReadyContext)
  useEffect(() => {
    ready()
  }, [ready])
  return null
}
