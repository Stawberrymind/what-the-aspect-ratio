import { useMemo, useState } from 'react'
import type { Category, Lens, RankedDevice } from '../types'
import { CATEGORY_LABEL, CATEGORY_ORDER } from '../data/devices'
import { LENS_LABEL, PANEL_LABEL } from '../lib/rank'
import './RankingsView.css'

export interface RankingsViewProps {
  ranked: RankedDevice[]
  best: Partial<Record<Category, RankedDevice>>
  filmTitle: string
  ratioLabel: string
  lens: Lens
  onLens: (l: Lens) => void
  onOpen: (id: string) => void
  onCompare: (ids: string[]) => void
}

type SortKey = 'rank' | 'name' | 'family' | 'size' | 'area' | 'used' | 'px' | 'panel' | 'score'
type SortDir = 'asc' | 'desc'

const LENSES: Lens[] = ['overall', 'size', 'fill', 'quality']

const COLUMNS: { key: SortKey; label: string; numeric: boolean }[] = [
  { key: 'rank', label: 'Rank', numeric: true },
  { key: 'name', label: 'Device', numeric: false },
  { key: 'family', label: 'Family', numeric: false },
  { key: 'size', label: 'Picture W×H in', numeric: true },
  { key: 'area', label: 'Picture in²', numeric: true },
  { key: 'used', label: 'Screen used', numeric: true },
  { key: 'px', label: 'Picture px', numeric: true },
  { key: 'panel', label: 'Panel', numeric: false },
  { key: 'score', label: 'Score', numeric: true },
]

function lensScore(r: RankedDevice, lens: Lens) {
  return lens === 'overall' ? r.score.overall : Math.round(r.score[lens] * 100)
}

function sortValue(r: RankedDevice, key: SortKey, lens: Lens): number | string {
  switch (key) {
    case 'rank':
      return r.rank
    case 'name':
      return r.device.name
    case 'family':
      return CATEGORY_ORDER.indexOf(r.device.category)
    case 'size':
      return r.fit.pictureIn.w
    case 'area':
      return r.fit.pictureAreaSqIn
    case 'used':
      return r.fit.screenUsed
    case 'px':
      return r.fit.picturePx.w * r.fit.picturePx.h
    case 'panel':
      return r.device.panel
    case 'score':
      return lensScore(r, lens)
  }
}

function SortIcon({ dir }: { dir: SortDir | null }) {
  return (
    <svg className="rview__sorticon" viewBox="0 0 10 12" width="10" height="12" aria-hidden="true" focusable="false">
      <path
        d="M5 1.5L2 5h6z"
        fill={dir === 'asc' ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.2"
        opacity={dir === 'desc' ? 0.4 : 1}
      />
      <path
        d="M5 10.5L2 7h6z"
        fill={dir === 'desc' ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.2"
        opacity={dir === 'asc' ? 0.4 : 1}
      />
    </svg>
  )
}

export function RankingsView({ ranked, best, filmTitle, ratioLabel, lens, onLens, onOpen, onCompare }: RankingsViewProps) {
  const [sortKey, setSortKey] = useState<SortKey>('rank')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [filter, setFilter] = useState<Category | 'all'>('all')

  const winners = CATEGORY_ORDER.map((c) => best[c]).filter((r): r is RankedDevice => !!r)
  const presentCategories = CATEGORY_ORDER.filter((c) => ranked.some((r) => r.device.category === c))

  const rows = useMemo(() => {
    const list = filter === 'all' ? ranked : ranked.filter((r) => r.device.category === filter)
    const sign = sortDir === 'asc' ? 1 : -1
    return [...list].sort((a, b) => {
      const va = sortValue(a, sortKey, lens)
      const vb = sortValue(b, sortKey, lens)
      const cmp = typeof va === 'string' && typeof vb === 'string' ? va.localeCompare(vb) : Number(va) - Number(vb)
      return sign * cmp || a.rank - b.rank
    })
  }, [ranked, filter, sortKey, sortDir, lens])

  function sortBy(key: SortKey, numeric: boolean) {
    if (key === sortKey) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortKey(key)
      // Numbers start with the biggest first, except rank where 1 leads.
      setSortDir(numeric && key !== 'rank' ? 'desc' : 'asc')
    }
  }

  return (
    <div className="rview">
      <header className="rview__head">
        <h2 className="rview__title">
          Where {filmTitle} looks best · <span className="measure">{ratioLabel}</span>
        </h2>
        <div className="rview__lenses" role="group" aria-label="Ranking lens">
          {LENSES.map((l) => (
            <button key={l} type="button" className="rview__lens" aria-pressed={lens === l} onClick={() => onLens(l)}>
              {LENS_LABEL[l]}
            </button>
          ))}
        </div>
      </header>

      {winners.length > 0 && (
        <section className="rview__best" aria-labelledby="rview-best-h">
          <div className="rview__besthead">
            <h3 className="rview__h3" id="rview-best-h">
              Best in each family
            </h3>
            <button
              type="button"
              className="rview__compare"
              disabled={winners.length < 2}
              onClick={() => onCompare(winners.slice(0, 6).map((w) => w.device.id))}
            >
              Compare these
            </button>
          </div>
          <ul className="rview__strip">
            {winners.map((w) => (
              <li className="rview__cell" key={w.device.id}>
                <span className="label">Best {CATEGORY_LABEL[w.device.category]}</span>
                <span className="rview__cellname">{w.device.name}</span>
                <span className="rview__cellnums measure">
                  {lensScore(w, lens)} pts · {w.fit.pictureDiagonalIn.toFixed(1)} in
                </span>
                <button type="button" className="rview__open" onClick={() => onOpen(w.device.id)}>
                  Open
                  <span className="sr-only"> {w.device.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="rview__all" aria-labelledby="rview-all-h">
        <h3 className="rview__h3" id="rview-all-h">
          All devices
        </h3>
        <div className="rview__filters" role="group" aria-label="Filter by family">
          {(['all', ...presentCategories] as (Category | 'all')[]).map((c) => (
            <button key={c} type="button" className="rview__chip" aria-pressed={filter === c} onClick={() => setFilter(c)}>
              {c === 'all' ? 'All' : CATEGORY_LABEL[c]}
            </button>
          ))}
        </div>

        <div className="rview__scroll" tabIndex={0} role="region" aria-label="Rankings table, scrolls sideways on narrow screens">
          <table className="rview__table">
            <caption className="sr-only">
              {rows.length} devices ranked by {LENS_LABEL[lens].toLowerCase()} for {filmTitle} in the {ratioLabel} frame
            </caption>
            <thead>
              <tr>
                {COLUMNS.map((c) => {
                  const active = c.key === sortKey
                  return (
                    <th
                      key={c.key}
                      scope="col"
                      className={`rview__th${c.numeric ? ' rview__th--num' : ''}`}
                      aria-sort={active ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
                    >
                      <button type="button" className="rview__sort" onClick={() => sortBy(c.key, c.numeric)}>
                        {c.label}
                        <SortIcon dir={active ? sortDir : null} />
                      </button>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const score = lensScore(r, lens)
                return (
                  <tr key={r.device.id} className={`rview__row${r.rank === 1 ? ' rview__row--first' : ''}`}>
                    <td className="rview__td rview__rank measure">{r.rank}</td>
                    <td className="rview__td rview__devcell">
                      <button type="button" className="rview__dev" onClick={() => onOpen(r.device.id)}>
                        {r.device.name}
                      </button>
                      {!r.device.verified && <span className="label rview__unverified">unverified</span>}
                    </td>
                    <td className="rview__td">{CATEGORY_LABEL[r.device.category]}</td>
                    <td className="rview__td rview__num measure">
                      {r.fit.pictureIn.w.toFixed(1)} × {r.fit.pictureIn.h.toFixed(1)}
                    </td>
                    <td className="rview__td rview__num measure">{r.fit.pictureAreaSqIn.toFixed(1)}</td>
                    <td className="rview__td rview__num measure">{Math.round(r.fit.screenUsed * 100)}%</td>
                    <td className="rview__td rview__num measure">
                      {r.fit.picturePx.w} × {r.fit.picturePx.h}
                    </td>
                    <td className="rview__td">{PANEL_LABEL[r.device.panel]}</td>
                    <td className="rview__td rview__scorecell">
                      <span className="rview__score measure">{score}</span>
                      <span className="rview__bar" aria-hidden="true">
                        <span className="rview__barfill" style={{ width: `${Math.max(0, Math.min(100, score))}%` }} />
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      <p className="rview__note">
        Scores compare devices against each other for this film and format. Picture size is physical (inches); the
        trailer crop in each screen is a simulation from its 16:9 master.
      </p>
    </div>
  )
}
