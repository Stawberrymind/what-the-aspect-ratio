import type { CSSProperties, KeyboardEvent, ReactNode } from 'react'
import type { Device, FitMode, Orientation } from '../types'
import { fitFilm, orientedCutout, orientedScreen } from '../lib/geometry'
import './DeviceFrame.css'

export interface FrameLine {
  ratio: number
  label: string
  active: boolean
}

export interface DeviceFrameProps {
  device: Device
  orientation: Orientation
  fit: FitMode
  /** CSS px width of the GLASS (screen). Height follows from the device's physical aspect in this orientation. */
  glassWidth: number
  /** Frame lines to draw (the active one is red; others blue hairlines with a small mono label tag). */
  frameLines?: FrameLine[]
  /** Content placed inside the ACTIVE frame's visible picture rect (normally a ScreenPlayer). */
  children?: ReactNode
  showCrosshair?: boolean
  showLabels?: boolean
  selected?: boolean
  onSelect?: () => void
  className?: string
}

/** Pixel size of the glass for a given glass width, using the device's physical aspect in this orientation. */
export function glassSize(device: Device, orientation: Orientation, glassWidth: number): { w: number; h: number } {
  const { inch } = orientedScreen(device, orientation)
  return { w: glassWidth, h: (glassWidth * inch.h) / inch.w }
}

const PHONE_CATEGORIES: ReadonlyArray<Device['category']> = ['iphone', 'galaxy-phone', 'oneplus-phone']

/** Bezel thickness in CSS px: thin and even on tablets, very thin on phones. */
export function bezelWidth(device: Device, glassWidth: number): number {
  const phone = PHONE_CATEGORIES.includes(device.category)
  const raw = glassWidth * (phone ? 0.014 : 0.032)
  return phone ? Math.min(6, Math.max(3, raw)) : Math.min(18, Math.max(6, raw))
}

const pct = (n: number) => `${Math.round(n * 10000) / 100}%`

function rectStyle(r: { x: number; y: number; w: number; h: number }): CSSProperties {
  return { left: pct(r.x), top: pct(r.y), width: pct(r.w), height: pct(r.h) }
}

export function DeviceFrame({
  device,
  orientation,
  fit,
  glassWidth,
  frameLines = [],
  children,
  showCrosshair = false,
  showLabels = true,
  selected = false,
  onSelect,
  className,
}: DeviceFrameProps) {
  const glass = glassSize(device, orientation, glassWidth)
  const bezel = bezelWidth(device, glassWidth)
  const glassRadius = Math.min(0.5, device.cornerRadius) * Math.min(glass.w, glass.h)

  const toFractions = (ratio: number) => {
    const r = fitFilm(device, ratio, orientation, fit)
    return {
      rect: {
        x: r.pictureIn.x / r.screenIn.w,
        y: r.pictureIn.y / r.screenIn.h,
        w: r.pictureIn.w / r.screenIn.w,
        h: r.pictureIn.h / r.screenIn.h,
      },
      cropped: r.cropped,
    }
  }

  const activeLine = frameLines.find((l) => l.active)
  const active = activeLine ? toFractions(activeLine.ratio) : null
  const blueLines = fit === 'fit' ? frameLines.filter((l) => !l.active) : []

  const cutoutRect = orientedCutout(device, orientation)
  const cutoutStyle: CSSProperties | null = cutoutRect
    ? (() => {
        const wPx = cutoutRect.w * glass.w
        const hPx = cutoutRect.h * glass.h
        const style: CSSProperties = { ...rectStyle(cutoutRect) }
        const type = device.cutout.type
        if (type === 'dynamic-island') style.borderRadius = 9999
        else if (type === 'punch-hole') style.borderRadius = '50%'
        else if (type === 'notch') {
          const r = Math.min(wPx, hPx) / 2
          const eps = 0.002
          if (cutoutRect.y <= eps) style.borderRadius = `0 0 ${r}px ${r}px`
          else if (cutoutRect.y + cutoutRect.h >= 1 - eps) style.borderRadius = `${r}px ${r}px 0 0`
          else if (cutoutRect.x <= eps) style.borderRadius = `0 ${r}px ${r}px 0`
          else if (cutoutRect.x + cutoutRect.w >= 1 - eps) style.borderRadius = `${r}px 0 0 ${r}px`
          else style.borderRadius = r
        }
        return style
      })()
    : null

  const interactive = Boolean(onSelect)
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!onSelect || e.target !== e.currentTarget) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect()
    }
  }

  const classes = [
    'dframe',
    interactive && 'dframe--interactive',
    selected && 'dframe--selected',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const outerStyle: CSSProperties = {
    padding: bezel,
    borderRadius: glassRadius + bezel + 1,
  }
  const glassStyle: CSSProperties = {
    width: glass.w,
    height: glass.h,
    borderRadius: glassRadius,
  }

  return (
    <div
      className={classes}
      style={outerStyle}
      {...(interactive
        ? {
            role: 'button',
            tabIndex: 0,
            onClick: onSelect,
            onKeyDown,
            'aria-label': device.name,
            'aria-pressed': selected,
          }
        : {})}
    >
      <div className="dframe__glass" style={glassStyle}>
        {/* Active picture rect: one stable element, so its geometry transitions when the ratio changes. */}
        <div className="dframe__pic" style={active ? rectStyle(active.rect) : { inset: 0 }}>
          <div className="dframe__content">{children}</div>
          {active && activeLine && (
            <div className="dframe__line dframe__line--active" aria-hidden="true">
              <i className="dframe__tick dframe__tick--tl" />
              <i className="dframe__tick dframe__tick--tr" />
              <i className="dframe__tick dframe__tick--bl" />
              <i className="dframe__tick dframe__tick--br" />
              {showLabels && <span className="dframe__tag dframe__tag--active label">{activeLine.label}</span>}
              {showLabels && fit === 'fill' && (
                <span className="dframe__tag dframe__tag--crop label">
                  cropped {Math.round(active.cropped * 100)}%
                </span>
              )}
            </div>
          )}
        </div>

        {blueLines.map((l) => (
          <div
            key={`${l.ratio}-${l.label}`}
            className="dframe__line dframe__line--blue"
            style={rectStyle(toFractions(l.ratio).rect)}
            aria-hidden="true"
          />
        ))}

        {showCrosshair && (
          <div className="dframe__cross" aria-hidden="true">
            <i className="dframe__cross-h" />
            <i className="dframe__cross-v" />
            <i className="dframe__cross-ring" />
          </div>
        )}

        {cutoutStyle && <i className={`dframe__cutout dframe__cutout--${device.cutout.type}`} style={cutoutStyle} aria-hidden="true" />}
      </div>

      {/* Blue tags sit outside the device, at the end of each line, with a leader across the bezel —
          like the ratio marks printed in a framing chart's margin. Below ~420px of glass they collide,
          and the legend carries the meaning instead. */}
      {showLabels && glass.w > 420 &&
        blueLines.map((l, i) => {
          const tag = marginTag(toFractions(l.ratio).rect, i, glass, bezel)
          return (
            <span
              key={`tag-${l.ratio}-${l.label}`}
              className={`dframe__tag dframe__tag--blue dframe__tag--margin dframe__tag--from-${tag.leader} label`}
              style={tag.style}
              aria-hidden="true"
            >
              {l.label}
            </span>
          )
        })}
    </div>
  )
}

type Rect = { x: number; y: number; w: number; h: number }

/** Place a tag in the margin at one end of a frame line, cycling corners so neighbours never stack. */
function marginTag(rect: Rect, i: number, glass: { w: number; h: number }, bezel: number) {
  const slot = i % 4 // 0 bottom-right, 1 top-right, 2 bottom-left, 3 top-left
  const right = slot < 2
  const top = slot % 2 === 1
  const style = { '--leader': `${bezel + 10}px` } as CSSProperties
  let leader: 'left' | 'right' | 'top' | 'bottom'

  if (rect.w > 0.995) {
    // Letterbox: the line's ends are its horizontal edges, so the tag sits beside the device.
    style.top = bezel + (top ? rect.y : rect.y + rect.h) * glass.h
    style.transform = 'translateY(-50%)'
    if (right) style.left = 'calc(100% + 10px)'
    else style.right = 'calc(100% + 10px)'
    leader = right ? 'left' : 'right'
  } else {
    // Pillarbox: the line's ends are its vertical edges, so the tag sits above or below the device.
    style.left = bezel + (right ? rect.x + rect.w : rect.x) * glass.w
    style.transform = 'translateX(-50%)'
    if (top) style.bottom = 'calc(100% + 10px)'
    else style.top = 'calc(100% + 10px)'
    leader = top ? 'bottom' : 'top'
  }
  return { style, leader }
}
