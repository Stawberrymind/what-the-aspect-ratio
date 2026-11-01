import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { DeviceFrame, type FrameLine } from '../components/DeviceFrame'
import { ScreenPlayer } from '../components/ScreenPlayer'
import { fitFilm, orientedScreen } from '../lib/geometry'
import type { Device, FilmFormat, FitMode, Orientation } from '../types'
import './ViewerView.css'

interface ViewerViewProps {
  device: Device
  /** Frame lines drawn on the glass: the film's release formats (plus the active one if it is extra). */
  formats: FilmFormat[]
  format: FilmFormat
  orientation: Orientation
  fit: FitMode
  youtubeId: string
  filmTitle: string
  /** On phones the controls sit under the device instead of in the top bar. */
  controls?: ReactNode
}

const PANEL_LABEL = { 'tandem-oled': 'Tandem OLED', oled: 'OLED', 'mini-led': 'Mini-LED', lcd: 'LCD' } as const

/** Largest glass width that fits the device cell, leaving a margin for the frame-line tags. */
function useGlassWidth(device: Device, orientation: Orientation) {
  const ref = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState({ w: 0, h: 0 })

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setBox({ w: e.contentRect.width, h: e.contentRect.height }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const { inch } = orientedScreen(device, orientation)
  const aspect = inch.w / inch.h
  const narrow = box.w < 560
  const w = Math.max(0, Math.min(box.w * (narrow ? 0.92 : 0.82), box.h * (narrow ? 0.94 : 0.9) * aspect))
  return [ref, Math.floor(w)] as const
}

export function ViewerView(props: ViewerViewProps) {
  const { device, formats, format, orientation, fit, youtubeId, filmTitle, controls } = props
  const [cellRef, glassWidth] = useGlassWidth(device, orientation)
  const [paused, setPaused] = useState(false)
  const [muted, setMuted] = useState(true)
  const result = fitFilm(device, format.ratio, orientation, fit)
  const { inch, px } = orientedScreen(device, orientation)

  const lines: FrameLine[] = formats.map((f) => ({
    ratio: f.ratio,
    label: `${ratioText(f.ratio)}${f.id === format.id ? ` · ${f.label}` : ''}`,
    active: f.id === format.id,
  }))

  return (
    <section className="viewer" aria-label="Viewer">
      <div className="viewer__stage">
        <header className="viewer__title">
          <h1 className="viewer__device">{device.name}</h1>
          <p className="viewer__spec measure">
            {device.diagonalIn}″ · {px.w} × {px.h} · {device.ppi} ppi
          </p>
        </header>

        <ul className="viewer__legend" aria-label="Legend">
          <li>
            <span className="viewer__swatch viewer__swatch--red" aria-hidden="true" />
            Showing {ratioText(format.ratio)}
          </li>
          {fit === 'fit' && formats.length > 1 && (
            <li>
              <span className="viewer__swatch viewer__swatch--blue" aria-hidden="true" />
              Other formats
            </li>
          )}
        </ul>

        <div className="viewer__cell" ref={cellRef}>
          {glassWidth > 0 && (
            <DeviceFrame
              device={device}
              orientation={orientation}
              fit={fit}
              glassWidth={glassWidth}
              frameLines={lines}
              showCrosshair
              showLabels={glassWidth > 300}
            >
              <ScreenPlayer
                youtubeId={youtubeId}
                title={`${filmTitle} trailer on ${device.name}`}
                fit={result}
                live
                paused={paused}
                muted={muted}
              />
            </DeviceFrame>
          )}
        </div>

        <p className="viewer__note">
          {result.hitsCutout && <strong>The camera cutout overlaps the picture here. </strong>}
          Framing simulated from the trailer's 16:9 master. In cinemas, taller IMAX frames show more image, not less.
          {!device.verified && ' Some specs for this device are unverified.'}{' '}
          <a href={device.source} target="_blank" rel="noreferrer">
            Spec source
          </a>
        </p>

        {youtubeId && (
          <div className="viewer__transport" role="group" aria-label="Trailer playback">
            <button type="button" onClick={() => setPaused((p) => !p)} aria-pressed={paused}>
              {paused ? <PlayIcon /> : <PauseIcon />}
              {paused ? 'Play' : 'Pause'}
            </button>
            <button type="button" onClick={() => setMuted((m) => !m)} aria-pressed={!muted}>
              {muted ? <MutedIcon /> : <SoundIcon />}
              {muted ? 'Sound off' : 'Sound on'}
            </button>
          </div>
        )}
      </div>

      {controls && <div className="viewer__controls">{controls}</div>}

      <dl className="viewer__stats">
        <div>
          <dt className="label">Picture</dt>
          <dd className="measure viewer__figure">
            {result.pictureIn.w.toFixed(1)} × {result.pictureIn.h.toFixed(1)} <small>in</small>
          </dd>
          <dd className="viewer__sub">{result.pictureDiagonalIn.toFixed(1)}″ diagonal</dd>
        </div>
        <div>
          <dt className="label">Screen used</dt>
          <dd className="measure viewer__figure">
            {Math.round(result.screenUsed * 100)}
            <small>%</small>
          </dd>
          <dd className="viewer__sub">
            {fit === 'fill' ? `${Math.round(result.cropped * 100)}% of the frame cropped` : barsText(result.barIn, inch)}
          </dd>
        </div>
        <div>
          <dt className="label">Picture pixels</dt>
          <dd className="measure viewer__figure">
            {result.picturePx.w} × {result.picturePx.h}
          </dd>
          <dd className="viewer__sub">{((result.picturePx.w * result.picturePx.h) / 1e6).toFixed(1)} megapixels</dd>
        </div>
        <div>
          <dt className="label">Panel</dt>
          <dd className="viewer__panel">{PANEL_LABEL[device.panel]}</dd>
          <dd className="viewer__sub">
            {device.peakNits} nits{device.hdr.length ? ` · ${device.hdr.join(', ')}` : ''}
          </dd>
        </div>
      </dl>
    </section>
  )
}

const iconProps = { viewBox: '0 0 16 16', width: 16, height: 16, 'aria-hidden': true } as const
const PlayIcon = () => (
  <svg {...iconProps}>
    <path d="M4.5 2.5v11l9-5.5z" fill="currentColor" />
  </svg>
)
const PauseIcon = () => (
  <svg {...iconProps}>
    <path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" fill="currentColor" />
  </svg>
)
const MutedIcon = () => (
  <svg {...iconProps} fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M2 6h3l4-3v10l-4-3H2z" fill="currentColor" stroke="none" />
    <path d="M11 6l4 4M15 6l-4 4" />
  </svg>
)
const SoundIcon = () => (
  <svg {...iconProps} fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M2 6h3l4-3v10l-4-3H2z" fill="currentColor" stroke="none" />
    <path d="M11.5 5.5a3.5 3.5 0 010 5M13.5 3.5a6.5 6.5 0 010 9" />
  </svg>
)

function barsText(bar: { top: number; side: number }, inch: { w: number; h: number }) {
  if (bar.top > 0.01) return `${bar.top.toFixed(2)} in bars top and bottom`
  if (bar.side > 0.01) return `${bar.side.toFixed(2)} in bars each side`
  return inch.w > 0 ? 'No bars' : ''
}

function ratioText(r: number) {
  if (Math.abs(r - 16 / 9) < 0.005) return '16:9'
  if (Math.abs(r - 4 / 3) < 0.005) return '4:3'
  return r.toFixed(2)
}
