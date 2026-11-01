// Shared contracts. Data files, components and views all build against these.

export type Brand = 'Apple' | 'Samsung' | 'OnePlus'

/** Ranking groups shown as "Best iPad", "Best Galaxy Tab", … */
export type Category = 'ipad' | 'iphone' | 'galaxy-tab' | 'galaxy-phone' | 'oneplus-phone' | 'oneplus-pad'

export type Panel = 'tandem-oled' | 'oled' | 'mini-led' | 'lcd'

export type CutoutType = 'none' | 'notch' | 'dynamic-island' | 'punch-hole'

/**
 * Camera cutout, in portrait orientation, as fractions of the screen
 * (x, y = top-left corner; w, h = size). 0..1.
 */
export interface Cutout {
  type: CutoutType
  x: number
  y: number
  w: number
  h: number
}

export interface Device {
  id: string // kebab-case, stable, used in URLs: 'ipad-pro-13-m5'
  brand: Brand
  category: Category
  name: string // 'iPad Pro 13-inch (M5)'
  year: number
  diagonalIn: number // marketed diagonal of the active area, inches
  /** Native resolution with the LONG side first: resW >= resH. */
  resW: number
  resH: number
  ppi: number
  panel: Panel
  peakNits: number // peak HDR brightness (fall back to typical if HDR unknown)
  hdr: string[] // e.g. ['HDR10', 'Dolby Vision']
  /** Screen corner radius as a fraction of the SHORT side (0..0.5). */
  cornerRadius: number
  cutout: Cutout
  /** Inner/cover screens of foldables are separate entries; note it here. */
  note?: string
  source: string // URL of the spec sheet used
  verified: boolean // false when any field could not be confirmed
}

export interface FilmFormat {
  id: string // 'imax-143'
  label: string // 'IMAX 70mm'
  ratio: number // 1.43
  note?: string // 'Full-height IMAX frame for the entire film'
  source?: string
}

export interface Film {
  id: string // 'odyssey'
  title: string // 'The Odyssey'
  year: number
  director: string
  youtubeId: string // official trailer, verified via oEmbed
  formats: FilmFormat[]
  defaultFormatId: string
  source?: string
}

export type Orientation = 'landscape' | 'portrait'
export type FitMode = 'fit' | 'fill'

/** Size in inches (physical) and pixels (native). */
export interface Rect {
  x: number
  y: number
  w: number
  h: number
}

export interface FitResult {
  /** Screen in the requested orientation. */
  screenIn: { w: number; h: number }
  screenPx: { w: number; h: number }
  /** Full film frame size on screen (inches). Equals the picture in Fit; larger than the screen in Fill. */
  frameIn: { w: number; h: number }
  /** Visible picture rectangle, relative to the screen's top-left. */
  pictureIn: Rect
  picturePx: Rect
  /** Visible picture area / screen area, 0..1. */
  screenUsed: number
  /** Visible picture area, square inches. */
  pictureAreaSqIn: number
  /** Diagonal of the visible picture, inches. */
  pictureDiagonalIn: number
  /** Fraction of the film frame that is cropped away (Fill mode), 0..1. */
  cropped: number
  /** Thickness of each bar in inches: top/bottom (letterbox) or left/right (pillarbox). */
  barIn: { top: number; side: number }
  /** True when the picture overlaps the camera cutout. */
  hitsCutout: boolean
}

export interface ScoreBreakdown {
  size: number // 0..1, biggest picture lens
  fill: number // 0..1, fills-the-screen lens
  quality: number // 0..1, panel + sharpness + brightness lens
  overall: number // 0..100, weighted
}

export interface RankedDevice {
  device: Device
  fit: FitResult
  score: ScoreBreakdown
  rank: number // 1-based within the ranked set
}

export type Lens = 'overall' | 'size' | 'fill' | 'quality'

export interface AppState {
  filmId: string
  formatId: string
  /** Custom YouTube id overriding the film's trailer, when pasted. */
  customYoutubeId?: string
  deviceId: string // focused device in Viewer
  compareIds: string[] // 2–6 devices in Compare
  orientation: Orientation
  fit: FitMode
  lens: Lens
  view: 'viewer' | 'compare' | 'rankings'
  trueScale: boolean
}
