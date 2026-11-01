import { describe, expect, it } from 'vitest'
import { sampleDevices } from '../data/fixtures'
import type { Device } from '../types'
import { fitFilm } from './geometry'
import { bestByCategory, qualityScore, rankDevices, scoreDevice, verdict } from './rank'

describe('scores', () => {
  const ranked = rankDevices(sampleDevices, 2.39, 'landscape', 'fit', 'overall')

  it('stay in range', () => {
    for (const r of ranked) {
      for (const k of ['size', 'fill', 'quality'] as const) {
        expect(r.score[k]).toBeGreaterThanOrEqual(0)
        expect(r.score[k]).toBeLessThanOrEqual(1)
      }
      expect(r.score.overall).toBeGreaterThanOrEqual(0)
      expect(r.score.overall).toBeLessThanOrEqual(100)
    }
    expect(Math.max(...ranked.map((r) => r.score.size))).toBeCloseTo(1, 6)
  })

  it('are sorted descending with 1-based ranks', () => {
    expect(ranked.map((r) => r.rank)).toEqual([1, 2, 3, 4])
    for (let i = 1; i < ranked.length; i++) {
      expect(ranked[i - 1].score.overall).toBeGreaterThanOrEqual(ranked[i].score.overall)
    }
  })

  it('sort by the chosen lens', () => {
    const bySize = rankDevices(sampleDevices, 1.43, 'landscape', 'fit', 'size')
    for (let i = 1; i < bySize.length; i++) {
      expect(bySize[i - 1].score.size).toBeGreaterThanOrEqual(bySize[i].score.size)
    }
  })
})

describe('bestByCategory', () => {
  it('picks the top-ranked device per category', () => {
    const ranked = rankDevices(sampleDevices, 1.9, 'landscape', 'fit', 'overall')
    const best = bestByCategory(ranked)
    expect(best.ipad?.device.id).toBe('ipad-pro-13-m4')
    expect(best.iphone?.device.id).toBe('iphone-16-pro')
    expect(best['galaxy-tab']?.device.id).toBe('galaxy-tab-s10-ultra')
    expect(best['oneplus-pad']).toBeUndefined()
  })
})

describe('lenses', () => {
  it('a 13-inch iPad beats a phone on size', () => {
    const ranked = rankDevices(sampleDevices, 1.9, 'landscape', 'fit', 'size')
    const ipad = ranked.find((r) => r.device.id === 'ipad-pro-13-m4')!
    const phone = ranked.find((r) => r.device.id === 'iphone-16-pro')!
    expect(ipad.rank).toBeLessThan(phone.rank)
    expect(ipad.score.size).toBeGreaterThan(phone.score.size)
  })

  it('OLED beats LCD on quality at equal size', () => {
    const lcd: Device = sampleDevices.find((d) => d.id === 'ipad-10')!
    const oled: Device = { ...lcd, id: 'ipad-10-oled', panel: 'oled' }
    const ranked = rankDevices([lcd, oled], 2.39, 'landscape', 'fit', 'quality')
    expect(ranked[0].device.id).toBe('ipad-10-oled')
    const fit = fitFilm(lcd, 2.39, 'landscape', 'fit')
    expect(qualityScore(oled, fit)).toBeGreaterThan(qualityScore(lcd, fit))
  })

  it('scoreDevice size is relative to the largest picture', () => {
    const fit = fitFilm(sampleDevices[0], 1.9, 'landscape', 'fit')
    expect(scoreDevice(sampleDevices[0], fit, fit.pictureAreaSqIn).size).toBe(1)
    expect(scoreDevice(sampleDevices[0], fit, fit.pictureAreaSqIn * 2).size).toBeCloseTo(0.5, 6)
  })
})

describe('verdict', () => {
  it('quotes the real inches and percent of glass', () => {
    const ranked = rankDevices(sampleDevices, 2.39, 'landscape', 'fit', 'overall')
    const ipad = ranked.find((r) => r.device.id === 'ipad-pro-13-m4')!
    const text = verdict(ipad, '2.39:1')
    expect(text).toContain(ipad.fit.pictureIn.w.toFixed(1))
    expect(text).toContain(ipad.fit.pictureIn.h.toFixed(1))
    expect(text).toContain(`${Math.round(ipad.fit.screenUsed * 100)}%`)
    expect(text).toContain('13-inch tandem OLED')
    expect(text).toContain('true-black bars')
  })

  it('mentions grey bars on LCD and nothing on bar-less fits', () => {
    const lcd = rankDevices(sampleDevices, 2.39, 'landscape', 'fit', 'overall').find((r) => r.device.id === 'ipad-10')!
    expect(verdict(lcd, '2.39:1')).toMatch(/grey/)
    const fill = rankDevices(sampleDevices, 2.39, 'landscape', 'fill', 'overall')[0]
    expect(verdict(fill, '2.39:1')).not.toMatch(/bars/)
  })
})
