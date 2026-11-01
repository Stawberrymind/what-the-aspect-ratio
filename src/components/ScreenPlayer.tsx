import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { FitResult } from '../types'
import './ScreenPlayer.css'

export interface ScreenPlayerProps {
  youtubeId: string
  title: string
  fit: FitResult
  /** true: YouTube iframe; false: thumbnail image. */
  live: boolean
  /** Thumbnail click: parent makes this one live. */
  onActivate?: () => void
  /** Used for the accessible label of the play button. */
  deviceName?: string
  /** Playback state driven by the app's own controls (YouTube's chrome is hidden). */
  paused?: boolean
  muted?: boolean
}

/** YouTube refuses to play in embeds smaller than this (CSS px) in either dimension. */
const MIN_EMBED = 200

/** Send an IFrame API command to an embed loaded with enablejsapi=1. */
function command(frame: HTMLIFrameElement | null, func: string) {
  frame?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func, args: [] }), '*')
}

export function ScreenPlayer({
  youtubeId,
  title,
  fit,
  live,
  onActivate,
  deviceName,
  paused = false,
  muted = true,
}: ScreenPlayerProps) {
  const frameRef = useRef<HTMLIFrameElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState({ w: 0, h: 0 })
  const [failedThumb, setFailedThumb] = useState<{ id: string; level: number }>({ id: '', level: 0 })

  useLayoutEffect(() => {
    const el = boxRef.current
    if (!el) return
    const measure = () => {
      const w = Math.round(el.clientWidth)
      const h = Math.round(el.clientHeight)
      setBox((prev) => (prev.w === w && prev.h === h ? prev : { w, h }))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const fw = fit.pictureIn.w > 0 ? fit.frameIn.w / fit.pictureIn.w : 1
  const fh = fit.pictureIn.h > 0 ? fit.frameIn.h / fit.pictureIn.h : 1
  const frameStyle = { width: `${fw * 100}%`, height: `${fh * 100}%` }

  // Size the 16:9 media element ends up with once it covers the film frame.
  const frameW = box.w * fw
  const frameH = box.h * fh
  const mediaW = Math.max(frameW, (frameH * 16) / 9)
  const mediaH = Math.max(frameH, (frameW * 9) / 16)
  // Small screens still play: render the embed at YouTube's minimum and scale it down to fit.
  const embedScale = box.w === 0 ? 1 : Math.max(1, MIN_EMBED / Math.max(1, Math.min(mediaW, mediaH)))
  const embedStyle =
    embedScale > 1
      ? {
          width: `${embedScale * 100}%`,
          height: `${embedScale * 100}%`,
          transform: `scale(${1 / embedScale})`,
          transformOrigin: '0 0',
        }
      : undefined

  const hasVideo = youtubeId.length > 0
  const showIframe = live && hasVideo && box.w > 0

  // The embed paints black while it boots; keep the poster over it until playback has had a moment to start.
  const [readyId, setReadyId] = useState('')
  const ready = showIframe && readyId === youtubeId
  const onFrameLoad = () => {
    sync()
    window.setTimeout(() => setReadyId(youtubeId), 1200)
  }

  const sync = () => {
    command(frameRef.current, paused ? 'pauseVideo' : 'playVideo')
    command(frameRef.current, muted ? 'mute' : 'unMute')
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(sync, [paused, muted, showIframe])
  const thumbLevel = failedThumb.id === youtubeId ? failedThumb.level : 0
  const thumbSrc =
    thumbLevel === 0
      ? `https://i.ytimg.com/vi/${encodeURIComponent(youtubeId)}/maxresdefault.jpg`
      : `https://i.ytimg.com/vi/${encodeURIComponent(youtubeId)}/hqdefault.jpg`

  const embedId = encodeURIComponent(youtubeId)
  const embedSrc =
    `https://www.youtube-nocookie.com/embed/${embedId}` +
    `?autoplay=1&mute=1&playsinline=1&loop=1&playlist=${embedId}&controls=0&disablekb=1&fs=0` +
    `&iv_load_policy=3&modestbranding=1&rel=0&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`

  return (
    <div className="splayer" ref={boxRef}>
      <div className="splayer__frame" style={frameStyle}>
        <div className="splayer__media">
          {!hasVideo ? (
            <div className="splayer__empty">
              <span className="label">No trailer</span>
            </div>
          ) : showIframe ? (
            <>
              <iframe
                ref={frameRef}
                className="splayer__embed"
                style={embedStyle}
                src={embedSrc}
                title={title}
                allow="autoplay; encrypted-media; picture-in-picture"
                tabIndex={-1}
                onLoad={onFrameLoad}
                referrerPolicy="strict-origin-when-cross-origin"
              />
              {thumbLevel < 2 && (
                <img
                  className={`splayer__thumb splayer__poster${ready ? ' splayer__poster--gone' : ''}`}
                  src={thumbSrc}
                  alt=""
                  draggable={false}
                  onError={() => setFailedThumb({ id: youtubeId, level: thumbLevel + 1 })}
                />
              )}
              {!ready && (
                <span className="splayer__loading label" role="status">
                  Loading trailer
                </span>
              )}
            </>
          ) : (
            thumbLevel < 2 && (
              <img
                className="splayer__thumb"
                src={thumbSrc}
                alt=""
                draggable={false}
                onError={() => setFailedThumb({ id: youtubeId, level: thumbLevel + 1 })}
              />
            )
          )}
        </div>
      </div>

      {hasVideo && !live && onActivate && (
        <button
          type="button"
          className="splayer__play"
          onClick={onActivate}
          aria-label={deviceName ? `Play trailer on ${deviceName}` : `Play trailer: ${title}`}
        >
          <svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <circle cx="24" cy="24" r="22" />
            <path d="M20 16.5 33 24 20 31.5Z" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </div>
  )
}
