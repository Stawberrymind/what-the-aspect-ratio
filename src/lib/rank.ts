import type { Category, Device, FitMode, FitResult, Lens, Orientation, Panel, RankedDevice, ScoreBreakdown } from '../types'
import { fitFilm } from './geometry'

/** How well a panel renders letterbox bars: OLED switches pixels off, LCD glows grey. */
export const PANEL_SCORE: Record<Panel, number> = { 'tandem-oled': 1, oled: 0.92, 'mini-led': 0.8, lcd: 0.5 }

export const OVERALL_WEIGHTS = { size: 0.5, fill: 0.2, quality: 0.3 }

export const LENS_LABEL: Record<Lens, string> = {
  overall: 'Balanced',
  size: 'Biggest picture',
  fill: 'Fills the screen',
  quality: 'Image quality',
}

export const PANEL_LABEL: Record<Panel, string> = {
  'tandem-oled': 'Tandem OLED',
  oled: 'OLED',
  'mini-led': 'Mini-LED',
  lcd: 'LCD',
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))

/** 0..1: 50% panel, 30% sharpness (picture pixels + density), 20% brightness. */
export function qualityScore(device: Device, fit: FitResult): number {
  const shortSidePx = Math.min(fit.picturePx.w, fit.picturePx.h)
  const sharpness = 0.7 * Math.min(shortSidePx / 2160, 1) + 0.3 * Math.min(device.ppi / 460, 1)
  const brightness = Math.min(device.peakNits / 1600, 1)
  return clamp01(0.5 * PANEL_SCORE[device.panel] + 0.3 * sharpness + 0.2 * brightness)
}

export function scoreDevice(device: Device, fit: FitResult, maxArea: number): ScoreBreakdown {
  const size = maxArea > 0 ? clamp01(fit.pictureAreaSqIn / maxArea) : 0
  const fill = clamp01(fit.screenUsed)
  const quality = qualityScore(device, fit)
  const overall = Math.round(100 * (OVERALL_WEIGHTS.size * size + OVERALL_WEIGHTS.fill * fill + OVERALL_WEIGHTS.quality * quality))
  return { size, fill, quality, overall }
}

function lensValue(s: ScoreBreakdown, lens: Lens) {
  return lens === 'overall' ? s.overall : s[lens]
}

export function rankDevices(devices: Device[], ratio: number, orientation: Orientation, fit: FitMode, lens: Lens): RankedDevice[] {
  const fits = devices.map((device) => ({ device, fit: fitFilm(device, ratio, orientation, fit) }))
  const maxArea = fits.reduce((m, f) => Math.max(m, f.fit.pictureAreaSqIn), 0)
  const scored = fits.map((f) => ({ ...f, score: scoreDevice(f.device, f.fit, maxArea), rank: 0 }))
  scored.sort(
    (a, b) =>
      lensValue(b.score, lens) - lensValue(a.score, lens) ||
      b.score.overall - a.score.overall ||
      // Same screen, same score: the newer model is the one people can still buy.
      b.device.year - a.device.year ||
      a.device.name.localeCompare(b.device.name),
  )
  return scored.map((r, i) => ({ ...r, rank: i + 1 }))
}

/** First (best) device per category, in ranked order. */
export function bestByCategory(ranked: RankedDevice[]): Partial<Record<Category, RankedDevice>> {
  const out: Partial<Record<Category, RankedDevice>> = {}
  for (const r of ranked) {
    if (!out[r.device.category]) out[r.device.category] = r
  }
  return out
}

const fmtIn = (n: number) => n.toFixed(1)

/** One plain sentence on why this device shows the frame as it does. */
export function verdict(r: RankedDevice, ratioLabel: string): string {
  const { device, fit } = r
  const diag = Number.isInteger(device.diagonalIn) ? String(device.diagonalIn) : fmtIn(device.diagonalIn)
  const panel = PANEL_LABEL[device.panel].replace('Tandem OLED', 'tandem OLED').replace('Mini-LED', 'mini-LED')
  const size = `${fmtIn(fit.pictureIn.w)} × ${fmtIn(fit.pictureIn.h)} in`
  const used = `${Math.round(fit.screenUsed * 100)}%`
  const hasBars = fit.barIn.top > 0.05 || fit.barIn.side > 0.05
  const lead = `Its ${diag}-inch ${panel} shows the ${ratioLabel} frame ${size}, using ${used} of the glass`
  if (!hasBars) return `${lead}.`
  if (device.panel === 'tandem-oled' || device.panel === 'oled') return `${lead} with true-black bars.`
  if (device.panel === 'lcd') return `${lead}, though the bars show as grey on its LCD.`
  return `${lead}.`
}
