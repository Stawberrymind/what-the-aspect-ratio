import { useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { Device, FitMode, Orientation } from '../types'
import { fitFilm, orientedScreen } from '../lib/geometry'
import { DeviceFrame, bezelWidth, glassSize } from '../components/DeviceFrame'
import { ScreenPlayer } from '../components/ScreenPlayer'
import './CompareView.css'

export interface CompareViewProps {
  devices: Device[]
  youtubeId: string
  filmTitle: string
  ratio: number
  ratioLabel: string
  orientation: Orientation
  fit: FitMode
  trueScale: boolean
  onTrueScale: (v: boolean) => void
  liveId: string | null
  onLive: (id: string) => void
  onRemove: (id: string) => void
  onOpen: (id: string) => void
  picker: ReactNode
}

const MOBILE_STAGE = 720
const GAP = 32
const MAX_BEZEL = 18
const MIN_PX_PER_IN = 26
const MAX_PX_PER_IN = 120
const MAX_GLASS_H = 620
const EVEN_MIN = 150
const EVEN_MAX = 380
const LABEL_MIN_GLASS = 260

function useElementWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [width, setWidth] = useState(0)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => setWidth(Math.round(el.clientWidth))
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, width] as const
}

function tagFor(ratio: number, ratioLabel: string) {
  // App may pass a label that already carries the ratio ("1.43:1 IMAX 70mm"); otherwise prefix it.
  if (/\d\s*:\s*\d|\d\.\d\d/.test(ratioLabel)) return ratioLabel
  return `${ratio.toFixed(2)} : 1 · ${ratioLabel}`
}

const inFmt = (n: number) => n.toFixed(1)

export function CompareView({
  devices,
  youtubeId,
  filmTitle,
  ratio,
  ratioLabel,
  orientation,
  fit,
  trueScale,
  onTrueScale,
  liveId,
  onLive,
  onRemove,
  onOpen,
  picker,
}: CompareViewProps) {
  const [stageRef, stageWidth] = useElementWidth<HTMLDivElement>()
  const measured = stageWidth > 0 ? stageWidth : 960
  const stacked = measured < MOBILE_STAGE
  const pad = stacked ? 16 : 24
  const avail = Math.max(160, measured - pad * 2)

  const glassWidths = useMemo(() => {
    const n = devices.length
    if (n === 0) return []
    const widthsIn = devices.map((d) => orientedScreen(d, orientation).inch)
    if (!trueScale) {
      const perRow = stacked ? 1 : n
      const share = (avail - GAP * (perRow - 1) - 2 * MAX_BEZEL * perRow) / perRow
      const w = Math.min(EVEN_MAX, Math.max(EVEN_MIN, share))
      return devices.map(() => Math.min(w, avail - 2 * MAX_BEZEL))
    }
    // One shared px-per-inch for every device, so physical size differences stay honest.
    const maxW = Math.max(...widthsIn.map((s) => s.w))
    const sumW = widthsIn.reduce((a, s) => a + s.w, 0)
    const maxH = Math.max(...widthsIn.map((s) => s.h))
    const fitWidest = (avail - 2 * MAX_BEZEL) / maxW
    const fitRow = stacked ? fitWidest : (avail - GAP * (n - 1) - 2 * MAX_BEZEL * n) / sumW
    let s = Math.min(fitWidest, Math.max(fitRow, Math.min(MIN_PX_PER_IN, fitWidest)))
    s = Math.min(s, MAX_PX_PER_IN, MAX_GLASS_H / maxH)
    s = Math.max(s, 8)
    return widthsIn.map((i) => i.w * s)
  }, [devices, orientation, trueScale, stacked, avail])

  const cells = devices.map((device, i) => {
    const gw = glassWidths[i] ?? EVEN_MIN
    return { device, gw, result: fitFilm(device, ratio, orientation, fit) }
  })

  const tag = tagFor(ratio, ratioLabel)

  return (
    <section className="compare" aria-label="Compare devices">
      <div className="compare__toolbar">
        <h2 className="compare__title">
          Compare <span className="compare__dot" aria-hidden="true" />
          <span className="measure compare__fmt">{ratioLabel}</span>
        </h2>
        <div className="compare__picker">{picker}</div>
        <button
          type="button"
          className="compare__toggle"
          aria-pressed={trueScale}
          onClick={() => onTrueScale(!trueScale)}
        >
          <span className="compare__switch" aria-hidden="true" />
          True scale
        </button>
      </div>

      <div className="compare__stage" ref={stageRef} style={{ padding: pad }}>
        {devices.length === 0 ? (
          <div className="compare__empty">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M12 20V5M6 11l6-6 6 6" />
            </svg>
            <p className="compare__empty-title">Add up to six devices to compare</p>
            <p className="compare__empty-sub">Use the device picker above, then see {filmTitle} on each screen at {ratioLabel}.</p>
          </div>
        ) : (
          <ul className={`compare__row${stacked ? ' compare__row--stacked' : ''}`}>
            {cells.map(({ device, gw, result }) => {
              const bezel = bezelWidth(device, gw)
              const outerW = gw + 2 * bezel + 2
              const showLabels = gw >= LABEL_MIN_GLASS
              const h = glassSize(device, orientation, gw).h
              return (
                <li
                  key={device.id}
                  className="compare__item"
                  style={{ width: Math.max(outerW, EVEN_MIN) }}
                >
                  <div className="compare__device" style={{ minHeight: h + 2 * bezel + 2 }}>
                    <DeviceFrame
                      device={device}
                      orientation={orientation}
                      fit={fit}
                      glassWidth={gw}
                      frameLines={[{ ratio, label: tag, active: true }]}
                      showLabels={showLabels}
                    >
                      <ScreenPlayer
                        youtubeId={youtubeId}
                        title={`${filmTitle} trailer on ${device.name}`}
                        fit={result}
                        live={liveId === device.id}
                        onActivate={() => onLive(device.id)}
                        deviceName={device.name}
                      />
                    </DeviceFrame>
                  </div>
                  <div className="compare__caption">
                    <p className="compare__name">{device.name}</p>
                    <dl className="compare__stats measure">
                      <div>
                        <dt className="sr-only">Picture size</dt>
                        <dd>
                          {inFmt(result.pictureIn.w)} × {inFmt(result.pictureIn.h)} in
                        </dd>
                      </div>
                      <div>
                        <dt className="sr-only">Screen used</dt>
                        <dd>{Math.round(result.screenUsed * 100)}% screen used</dd>
                      </div>
                    </dl>
                    <div className="compare__actions">
                      <button
                        type="button"
                        className="compare__open"
                        onClick={() => onOpen(device.id)}
                        aria-label={`Open ${device.name} in Viewer`}
                      >
                        Open
                      </button>
                      <button
                        type="button"
                        className="compare__remove"
                        onClick={() => onRemove(device.id)}
                        aria-label={`Remove ${device.name}`}
                      >
                        <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                          <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </section>
  )
}
