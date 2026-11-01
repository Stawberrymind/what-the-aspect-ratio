import { describe, expect, it } from 'vitest'
import type { Device } from '../types'
import { fitFilm, orientedCutout, parseRatio, screenInches } from './geometry'

const ipad10: Device = {
  id: 'ipad-10',
  brand: 'Apple',
  category: 'ipad',
  name: 'iPad (10th generation)',
  year: 2022,
  diagonalIn: 10.9,
  resW: 2360,
  resH: 1640,
  ppi: 264,
  panel: 'lcd',
  peakNits: 500,
  hdr: [],
  cornerRadius: 0.06,
  cutout: { type: 'none', x: 0, y: 0, w: 0, h: 0 },
  source: 'https://support.apple.com/kb/SP901',
  verified: true,
}

const phone: Device = {
  ...ipad10,
  id: 'phone',
  category: 'iphone',
  diagonalIn: 6.3,
  resW: 2622,
  resH: 1206,
  panel: 'oled',
  // Dynamic Island, portrait: centred, near the top.
  cutout: { type: 'dynamic-island', x: 0.36, y: 0.012, w: 0.28, h: 0.04 },
}

describe('screenInches', () => {
  it('splits the diagonal by the pixel ratio', () => {
    const s = screenInches(ipad10)
    expect(s.w).toBeCloseTo(8.95, 2)
    expect(s.h).toBeCloseTo(6.22, 2)
    expect(Math.hypot(s.w, s.h)).toBeCloseTo(10.9, 5)
  })
})

describe('fitFilm', () => {
  it('letterboxes 2.39 on an iPad 10 in landscape', () => {
    const r = fitFilm(ipad10, 2.39, 'landscape', 'fit')
    expect(r.pictureIn.w).toBeCloseTo(8.95, 2)
    expect(r.pictureIn.h).toBeCloseTo(3.75, 2)
    expect(r.screenUsed).toBeCloseTo(0.602, 2)
    expect(r.barIn.side).toBe(0)
    expect(r.barIn.top).toBeGreaterThan(1.2)
    expect(r.cropped).toBe(0)
  })

  it('pillarboxes 1.43 on an iPad 10 in landscape', () => {
    const r = fitFilm(ipad10, 1.43, 'landscape', 'fit')
    expect(r.pictureIn.h).toBeCloseTo(6.22, 2)
    expect(r.barIn.top).toBe(0)
    expect(r.barIn.side).toBeGreaterThan(0)
    expect(r.screenUsed).toBeCloseTo(1.43 / (2360 / 1640), 3)
  })

  it('fill covers the screen and reports the crop', () => {
    const r = fitFilm(ipad10, 2.39, 'landscape', 'fill')
    expect(r.screenUsed).toBeCloseTo(1, 6)
    expect(r.cropped).toBeCloseTo(1 - 1.439 / 2.39, 2)
  })

  it('portrait swaps the axes', () => {
    const r = fitFilm(ipad10, 16 / 9, 'portrait', 'fit')
    expect(r.screenIn.w).toBeLessThan(r.screenIn.h)
    expect(r.pictureIn.w).toBeCloseTo(r.screenIn.w, 6)
  })

  it('pixel rect matches native resolution scale', () => {
    const r = fitFilm(ipad10, 2.39, 'landscape', 'fit')
    expect(r.picturePx.w).toBe(2360)
    expect(r.picturePx.h).toBeCloseTo(2360 / 2.39, -1)
  })

  it('flags the cutout only when the picture reaches it', () => {
    // 1.43 is pillarboxed well clear of the island; 2.39 runs edge to edge across it.
    expect(fitFilm(phone, 1.43, 'landscape', 'fit').hitsCutout).toBe(false)
    expect(fitFilm(phone, 2.39, 'landscape', 'fit').hitsCutout).toBe(true)
  })
})

describe('orientedCutout', () => {
  it('moves a top cutout to the left edge in landscape', () => {
    const c = orientedCutout(phone, 'landscape')!
    expect(c.x).toBeCloseTo(0.012, 6)
    expect(c.y).toBeCloseTo(0.36, 6)
  })
})

describe('parseRatio', () => {
  it.each([
    ['1.43', 1.43],
    ['2.39:1', 2.39],
    ['16:9', 16 / 9],
    [' 2.20 : 1 ', 2.2],
  ])('%s', (input, expected) => {
    expect(parseRatio(input)).toBeCloseTo(expected, 6)
  })
  it('rejects junk', () => {
    expect(parseRatio('wide')).toBeNull()
    expect(parseRatio('0:1')).toBeNull()
  })
})
