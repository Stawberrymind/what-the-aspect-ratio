import { describe, expect, it } from 'vitest'
import { sampleDevices } from '../data/fixtures'
import { glassSize } from './DeviceFrame'

describe('glassSize', () => {
  const [, proM4, phone] = sampleDevices

  it('keeps the requested width and follows the physical aspect in landscape', () => {
    const g = glassSize(proM4, 'landscape', 400)
    expect(g.w).toBe(400)
    expect(g.h).toBeCloseTo(400 * (2064 / 2752), 5)
  })

  it('is taller than wide in portrait', () => {
    const g = glassSize(phone, 'portrait', 200)
    expect(g.w).toBe(200)
    expect(g.h).toBeCloseTo(200 * (2622 / 1206), 5)
  })

  it('scales linearly with glass width', () => {
    const a = glassSize(proM4, 'landscape', 100)
    const b = glassSize(proM4, 'landscape', 300)
    expect(b.h / a.h).toBeCloseTo(3, 5)
  })
})
