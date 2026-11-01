import { useCallback, useEffect, useState } from 'react'
import type { AppState, FitMode, Lens, Orientation } from '../types'

export const DEFAULT_STATE: AppState = {
  filmId: 'odyssey',
  formatId: 'imax-143',
  deviceId: 'ipad-pro-13-m5',
  compareIds: ['ipad-pro-13-m5', 'ipad-10', 'galaxy-tab-s10-ultra', 'iphone-17-pro-max'],
  orientation: 'landscape',
  fit: 'fit',
  lens: 'overall',
  view: 'viewer',
  trueScale: true,
}

const VIEWS = ['viewer', 'compare', 'rankings'] as const
const LENSES: Lens[] = ['overall', 'size', 'fill', 'quality']

/** Hash <-> state. Short keys keep shared links readable. */
export function parseHash(hash: string): AppState {
  const p = new URLSearchParams(hash.replace(/^#/, ''))
  const s: AppState = { ...DEFAULT_STATE }
  const view = p.get('view')
  if (view && (VIEWS as readonly string[]).includes(view)) s.view = view as AppState['view']
  if (p.get('film')) s.filmId = p.get('film')!
  if (p.get('fmt')) s.formatId = p.get('fmt')!
  if (p.get('yt')) s.customYoutubeId = p.get('yt')!
  if (p.get('d')) s.deviceId = p.get('d')!
  if (p.get('cmp')) s.compareIds = p.get('cmp')!.split(',').filter(Boolean).slice(0, 6)
  if (p.get('o') === 'portrait') s.orientation = 'portrait' as Orientation
  if (p.get('fit') === 'fill') s.fit = 'fill' as FitMode
  const lens = p.get('lens') as Lens | null
  if (lens && LENSES.includes(lens)) s.lens = lens
  if (p.get('scale') === '0') s.trueScale = false
  return s
}

export function toHash(s: AppState): string {
  const p = new URLSearchParams()
  p.set('view', s.view)
  p.set('film', s.filmId)
  p.set('fmt', s.formatId)
  if (s.customYoutubeId) p.set('yt', s.customYoutubeId)
  p.set('d', s.deviceId)
  p.set('cmp', s.compareIds.join(','))
  if (s.orientation === 'portrait') p.set('o', 'portrait')
  if (s.fit === 'fill') p.set('fit', 'fill')
  if (s.lens !== 'overall') p.set('lens', s.lens)
  if (!s.trueScale) p.set('scale', '0')
  return '#' + p.toString()
}

/** App state mirrored into location.hash (replaceState, so Back leaves the site rather than undoing toggles). */
export function useHashState() {
  const [state, setState] = useState<AppState>(() => parseHash(window.location.hash))

  useEffect(() => {
    const onHash = () => setState(parseHash(window.location.hash))
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const update = useCallback((patch: Partial<AppState>) => {
    setState((prev) => {
      const next = { ...prev, ...patch }
      history.replaceState(null, '', toHash(next))
      return next
    })
  }, [])

  return [state, update] as const
}

/** Pull a YouTube video id out of a pasted URL or bare id. */
export function parseYoutubeId(input: string): string | null {
  const s = input.trim()
  if (/^[\w-]{11}$/.test(s)) return s
  const m = s.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/|\/live\/)([\w-]{11})/)
  return m ? m[1] : null
}
