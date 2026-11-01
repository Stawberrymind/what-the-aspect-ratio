import type { Lens, Panel, RankedDevice } from '../types'
import { LENS_LABEL, OVERALL_WEIGHTS, verdict } from '../lib/rank'
import './RankRail.css'

export interface RankRailProps {
  ranked: RankedDevice[]
  ratioLabel: string
  lens: Lens
  onLens: (l: Lens) => void
  focusedId: string
  onFocus: (id: string) => void
}

const LENSES: Lens[] = ['overall', 'size', 'fill', 'quality']

const PANEL_SHORT: Record<Panel, string> = {
  'tandem-oled': 'Tandem',
  oled: 'OLED',
  'mini-led': 'Mini-LED',
  lcd: 'LCD',
}

function lensScore(r: RankedDevice, lens: Lens) {
  return lens === 'overall' ? r.score.overall : Math.round(r.score[lens] * 100)
}

export function RankRail({ ranked, ratioLabel, lens, onLens, focusedId, onFocus }: RankRailProps) {
  const winner = ranked[0]
  const weights: { label: string; value: number }[] = [
    { label: 'Picture size', value: OVERALL_WEIGHTS.size },
    { label: 'Fills screen', value: OVERALL_WEIGHTS.fill },
    { label: 'Image quality', value: OVERALL_WEIGHTS.quality },
  ]

  return (
    <aside className="rrail" aria-label={`Device ranking for ${ratioLabel}`}>
      <header className="rrail__head">
        <div className="rrail__titlerow">
          <h2 className="rrail__title">
            Ranking · <span className="measure">{ratioLabel}</span>
          </h2>
          <span className="label">{ranked.length} devices</span>
        </div>
        <div className="rrail__lenses" role="group" aria-label="Ranking lens">
          {LENSES.map((l) => (
            <button
              key={l}
              type="button"
              className="rrail__lens"
              aria-pressed={lens === l}
              onClick={() => onLens(l)}
            >
              {LENS_LABEL[l]}
            </button>
          ))}
        </div>
      </header>

      <div className="rrail__body">
        {winner && (
          <section className="rrail__verdict" aria-labelledby="rrail-best">
            <h3 className="rrail__vtitle" id="rrail-best">
              Best for <span className="measure">{ratioLabel}</span>
            </h3>
            <p className="rrail__vname">{winner.device.name}</p>
            <p className="rrail__vtext">{verdict(winner, ratioLabel)}</p>
          </section>
        )}

        <table className="rrail__table">
          <caption className="sr-only">
            Devices ranked by {LENS_LABEL[lens].toLowerCase()} for the {ratioLabel} frame
          </caption>
          <thead>
            <tr>
              <th scope="col" className="rrail__th rrail__th--num">
                #
              </th>
              <th scope="col" className="rrail__th">
                Device
              </th>
              <th scope="col" className="rrail__th rrail__th--num">
                in²
              </th>
              <th scope="col" className="rrail__th rrail__th--num">
                Used
              </th>
              <th scope="col" className="rrail__th">
                Panel
              </th>
              <th scope="col" className="rrail__th rrail__th--num">
                Score
              </th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((r) => {
              const focused = r.device.id === focusedId
              const score = lensScore(r, lens)
              return (
                <tr
                  key={r.device.id}
                  className={[
                    'rrail__row',
                    r.rank === 1 ? 'rrail__row--first' : '',
                    focused ? 'rrail__row--focused' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <td className="rrail__cell rrail__rank measure">{r.rank}</td>
                  <td className="rrail__cell rrail__devcell">
                    <button
                      type="button"
                      className="rrail__dev"
                      aria-current={focused ? 'true' : undefined}
                      onClick={() => onFocus(r.device.id)}
                    >
                      {r.device.name}
                    </button>
                  </td>
                  <td className="rrail__cell rrail__num measure">{r.fit.pictureAreaSqIn.toFixed(1)}</td>
                  <td className="rrail__cell rrail__num measure">{Math.round(r.fit.screenUsed * 100)}%</td>
                  <td className="rrail__cell rrail__panel">{PANEL_SHORT[r.device.panel]}</td>
                  <td className="rrail__cell rrail__scorecell">
                    <span className="rrail__score measure">{score}</span>
                    <span className="rrail__bar" aria-hidden="true">
                      <span className="rrail__barfill" style={{ width: `${Math.max(0, Math.min(100, score))}%` }} />
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <section className="rrail__how" aria-labelledby="rrail-how">
          <h3 className="rrail__howtitle" id="rrail-how">
            How the score works
          </h3>
          <p className="rrail__howlead">The balanced score is a weighted sum of three measured things.</p>
          <dl className="rrail__weights">
            {weights.map((w) => (
              <div className="rrail__weight" key={w.label}>
                <dt>{w.label}</dt>
                <dd className="measure">{Math.round(w.value * 100)}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </aside>
  )
}
