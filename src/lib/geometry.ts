import type { Device, FitMode, FitResult, Orientation, Rect } from '../types'

/** Physical width and height (inches) of the screen, long side first. */
export function screenInches(d: Pick<Device, 'diagonalIn' | 'resW' | 'resH'>) {
  const diag = Math.hypot(d.resW, d.resH)
  return { w: (d.diagonalIn * d.resW) / diag, h: (d.diagonalIn * d.resH) / diag }
}

/** Screen in the requested orientation, in inches and pixels. */
export function orientedScreen(d: Device, orientation: Orientation) {
  const inch = screenInches(d)
  const landscape = orientation === 'landscape'
  return {
    inch: landscape ? inch : { w: inch.h, h: inch.w },
    px: landscape ? { w: d.resW, h: d.resH } : { w: d.resH, h: d.resW },
  }
}

/** Cutout rectangle (fractions of the screen) rotated into the requested orientation. */
export function orientedCutout(d: Device, orientation: Orientation): Rect | null {
  const c = d.cutout
  if (c.type === 'none') return null
  if (orientation === 'portrait') return { x: c.x, y: c.y, w: c.w, h: c.h }
  // Rotate the portrait frame 90° counter-clockwise: the top edge becomes the left edge.
  return { x: c.y, y: 1 - c.x - c.w, w: c.h, h: c.w }
}

function overlaps(a: Rect, b: Rect) {
  return a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h
}

/**
 * Place a film frame of aspect `ratio` (width / height) on the device screen.
 * fit: whole frame visible, bars where it doesn't match. fill: screen covered, frame cropped.
 */
export function fitFilm(d: Device, ratio: number, orientation: Orientation, mode: FitMode): FitResult {
  const { inch, px } = orientedScreen(d, orientation)
  const screenRatio = inch.w / inch.h
  const wider = ratio > screenRatio

  // Size of the full film frame on screen, in inches.
  let frameW: number
  let frameH: number
  if (mode === 'fit' ? wider : !wider) {
    frameW = inch.w
    frameH = inch.w / ratio
  } else {
    frameH = inch.h
    frameW = inch.h * ratio
  }

  // Visible part is the frame clipped to the screen.
  const visW = Math.min(frameW, inch.w)
  const visH = Math.min(frameH, inch.h)
  const pictureIn: Rect = { x: (inch.w - visW) / 2, y: (inch.h - visH) / 2, w: visW, h: visH }

  const sx = px.w / inch.w
  const sy = px.h / inch.h
  const picturePx: Rect = {
    x: Math.round(pictureIn.x * sx),
    y: Math.round(pictureIn.y * sy),
    w: Math.round(visW * sx),
    h: Math.round(visH * sy),
  }

  const area = visW * visH
  const cutout = orientedCutout(d, orientation)
  const pictureFrac: Rect = {
    x: pictureIn.x / inch.w,
    y: pictureIn.y / inch.h,
    w: visW / inch.w,
    h: visH / inch.h,
  }

  return {
    screenIn: inch,
    screenPx: px,
    frameIn: { w: frameW, h: frameH },
    pictureIn,
    picturePx,
    screenUsed: area / (inch.w * inch.h),
    pictureAreaSqIn: area,
    pictureDiagonalIn: Math.hypot(visW, visH),
    cropped: 1 - area / (frameW * frameH),
    barIn: { top: pictureIn.y, side: pictureIn.x },
    hitsCutout: cutout ? overlaps(pictureFrac, cutout) : false,
  }
}

/** Parse "1.43", "1.43:1", "16:9", "2.39 : 1" into a width/height ratio. */
export function parseRatio(input: string): number | null {
  const m = input.trim().match(/^(\d+(?:\.\d+)?)\s*(?::\s*(\d+(?:\.\d+)?))?$/)
  if (!m) return null
  const a = Number(m[1])
  const b = m[2] ? Number(m[2]) : 1
  const r = a / b
  return r > 0.2 && r < 5 ? r : null
}

export function formatRatio(r: number) {
  if (Math.abs(r - 16 / 9) < 0.005) return '16:9'
  if (Math.abs(r - 4 / 3) < 0.005) return '4:3'
  return `${r.toFixed(2)}:1`
}
