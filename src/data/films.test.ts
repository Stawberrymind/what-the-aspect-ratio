import { describe, expect, it } from 'vitest'
import { films, genericFormats } from './films'

describe('films catalog', () => {
  it('starts with The Odyssey, with the IMAX and 70mm formats', () => {
    expect(films[0].id).toBe('odyssey')
    const ids = films[0].formats.map((f) => f.id)
    expect(ids).toContain('imax-143')
    expect(ids).toContain('imax-190')
    expect(ids).toContain('70mm-220')
  })

  it('gives every film at least two formats', () => {
    for (const film of films) {
      expect(film.formats.length, film.id).toBeGreaterThanOrEqual(2)
    }
  })

  it('keeps every format ratio between 1.2 and 2.8', () => {
    for (const film of films) {
      for (const format of film.formats) {
        expect(format.ratio, `${film.id}/${format.id}`).toBeGreaterThanOrEqual(1.2)
        expect(format.ratio, `${film.id}/${format.id}`).toBeLessThanOrEqual(2.8)
      }
    }
  })

  it('points defaultFormatId at one of the film formats', () => {
    for (const film of films) {
      const ids = film.formats.map((f) => f.id)
      expect(ids, film.id).toContain(film.defaultFormatId)
    }
  })

  it('has unique film ids and unique format ids within each film', () => {
    const filmIds = films.map((f) => f.id)
    expect(new Set(filmIds).size).toBe(filmIds.length)
    for (const film of films) {
      const formatIds = film.formats.map((f) => f.id)
      expect(new Set(formatIds).size, film.id).toBe(formatIds.length)
    }
  })

  it('uses 11-character YouTube ids', () => {
    for (const film of films) {
      expect(film.youtubeId, film.id).toMatch(/^[\w-]{11}$/)
    }
  })

  it('keeps generic format presets with valid ratios', () => {
    expect(genericFormats.length).toBeGreaterThan(0)
    for (const format of genericFormats) {
      expect(format.ratio).toBeGreaterThanOrEqual(1.2)
      expect(format.ratio).toBeLessThanOrEqual(2.8)
    }
  })
})
