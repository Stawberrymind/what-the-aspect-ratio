import { useEffect, useState, type ReactNode } from 'react'
import { parseYoutubeId } from '../lib/state'
import type { AppState, Film, FilmFormat, FitMode, Orientation } from '../types'
import './TopBar.css'

const VIEWS: { id: AppState['view']; label: string }[] = [
  { id: 'viewer', label: 'Viewer' },
  { id: 'compare', label: 'Compare' },
  { id: 'rankings', label: 'Rankings' },
]

function Mark() {
  return (
    <svg className="topbar__mark" viewBox="0 0 30 22" aria-hidden="true">
      <rect x="0.75" y="0.75" width="28.5" height="20.5" fill="none" stroke="var(--red)" strokeWidth="1.5" />
      <path d="M0.75 5.5h28.5M0.75 16.5h28.5" stroke="var(--blue)" strokeWidth="1" />
      <path d="M15 0v22" stroke="var(--ink)" strokeWidth="1" />
    </svg>
  )
}

/* ---------- Nav row: wordmark, views, trailer link, share ---------- */

interface TopNavProps {
  view: AppState['view']
  customYoutubeId?: string
  onChange: (patch: Partial<AppState>) => void
  onCustomYoutube: (id: string | undefined) => void
}

export function TopNav({ view, customYoutubeId, onChange, onCustomYoutube }: TopNavProps) {
  const [copied, setCopied] = useState(false)

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      window.prompt('Copy this link', window.location.href)
    }
  }

  return (
    <div className="topbar__row topbar__row--nav">
      <a className="topbar__brand" href="#" onClick={(e) => (e.preventDefault(), onChange({ view: 'viewer' }))}>
        <Mark />
        <span>What The Aspect Ratio</span>
      </a>
      <nav className="topbar__tabs" aria-label="Views">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            type="button"
            className="topbar__tab"
            aria-current={view === v.id ? 'page' : undefined}
            onClick={() => onChange({ view: v.id })}
          >
            {v.label}
          </button>
        ))}
      </nav>
      <TrailerInput current={customYoutubeId} onChange={onCustomYoutube} />
      <button type="button" className="topbar__share" onClick={share}>
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M6.5 9.5l3-3M5 7L3.5 8.5a2.5 2.5 0 003.5 3.5L8.5 10.5M11 9l1.5-1.5A2.5 2.5 0 009 4L7.5 5.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
        </svg>
        <span aria-live="polite">{copied ? 'Link copied' : 'Copy link'}</span>
      </button>
    </div>
  )
}

function TrailerInput({ current, onChange }: { current?: string; onChange: (id: string | undefined) => void }) {
  const [value, setValue] = useState(current ?? '')
  const [error, setError] = useState(false)
  useEffect(() => setValue(current ?? ''), [current])

  return (
    <form
      className="trailer"
      onSubmit={(e) => {
        e.preventDefault()
        if (!value.trim()) return onChange(undefined)
        const id = parseYoutubeId(value)
        setError(!id)
        if (id) onChange(id)
      }}
    >
      <label className="sr-only" htmlFor="trailer-url">
        Try another trailer
      </label>
      <input
        id="trailer-url"
        type="text"
        inputMode="url"
        placeholder="Paste any YouTube trailer link"
        value={value}
        aria-invalid={error}
        aria-describedby={error ? 'trailer-error' : undefined}
        onChange={(e) => (setValue(e.target.value), setError(false))}
      />
      <button type="submit">Load</button>
      {current && (
        <button type="button" onClick={() => (setValue(''), onChange(undefined))}>
          Reset
        </button>
      )}
      {error && (
        <p id="trailer-error" className="trailer__error" role="alert">
          That isn't a YouTube link. Try youtube.com/watch?v=… or youtu.be/…
        </p>
      )}
    </form>
  )
}

/* ---------- Controls row: film, device, format, orientation, scaling ---------- */

interface SegOption<T extends string> {
  id: T
  text: string
  measure?: string
  icon?: ReactNode
  /** Starts the secondary group (drawn after a divider). */
  secondary?: boolean
}

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
  tone = 'ink',
  className = '',
  note,
}: {
  label: string
  value: T
  options: SegOption<T>[]
  onChange: (v: T) => void
  tone?: 'ink' | 'red'
  className?: string
  note?: string
}) {
  const id = `seg-${label.toLowerCase()}`
  return (
    <div className={`topbar__field ${className}`}>
      <span className="label" id={id}>
        {label}
      </span>
      <div className={`seg seg--${tone}`} role="radiogroup" aria-labelledby={id}>
        {options.map((o, i) => (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={o.id === value}
            className={`seg__opt${o.secondary && !options[i - 1]?.secondary ? ' seg__opt--group' : ''}${o.secondary ? ' seg__opt--secondary' : ''}`}
            title={o.secondary ? note : undefined}
            onClick={() => onChange(o.id)}
          >
            {o.icon}
            <span className="seg__text">{o.text}</span>
            {o.measure && <span className="seg__measure measure">{o.measure}</span>}
          </button>
        ))}
      </div>
    </div>
  )
}

const OrientIcon = ({ portrait }: { portrait?: boolean }) => (
  <svg className="seg__icon" viewBox="0 0 18 18" aria-hidden="true">
    {portrait ? (
      <rect x="5" y="1.5" width="8" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" />
    ) : (
      <rect x="1.5" y="5" width="15" height="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
    )}
  </svg>
)

interface ControlsProps {
  state: AppState
  films: Film[]
  /** The film's own release formats. */
  formats: FilmFormat[]
  /** Common screen formats offered alongside, marked as not a release format. */
  extraFormats: FilmFormat[]
  onChange: (patch: Partial<AppState>) => void
  /** Device picker, shown in the Viewer only. */
  device?: ReactNode
}

export function Controls({ state, films, formats, extraFormats, onChange, device }: ControlsProps) {
  const changeFilm = (filmId: string) => {
    const film = films.find((f) => f.id === filmId)
    onChange({ filmId, formatId: film?.defaultFormatId ?? state.formatId, customYoutubeId: undefined })
  }

  return (
    <div className="topbar__row topbar__row--controls">
      <label className="topbar__field topbar__field--film">
        <span className="label">Film</span>
        <select
          className="topbar__select"
          value={state.customYoutubeId ? '' : state.filmId}
          onChange={(e) => changeFilm(e.target.value)}
        >
          {state.customYoutubeId && <option value="">Custom trailer</option>}
          {films.map((f) => (
            <option key={f.id} value={f.id}>
              {f.title} ({f.year})
            </option>
          ))}
        </select>
      </label>

      {device && <div className="topbar__field topbar__field--device">{device}</div>}

      <Segmented
        label="Format"
        tone="red"
        className="topbar__field--format"
        value={state.formatId}
        note="A common screen shape, not a release format of this film"
        options={[
          ...formats.map((f) => ({ id: f.id, text: f.label, measure: ratioText(f.ratio) })),
          ...extraFormats.map((f) => ({ id: f.id, text: f.label, measure: ratioText(f.ratio), secondary: true })),
        ]}
        onChange={(formatId) => onChange({ formatId })}
      />

      <div className="topbar__spacer" />

      <div className="topbar__pair">
        <Segmented<Orientation>
          label="Orientation"
          className="topbar__field--orient"
          value={state.orientation}
          options={[
            { id: 'landscape', text: 'Landscape', icon: <OrientIcon /> },
            { id: 'portrait', text: 'Portrait', icon: <OrientIcon portrait /> },
          ]}
          onChange={(orientation) => onChange({ orientation })}
        />
        <Segmented<FitMode>
          label="Scaling"
          value={state.fit}
          options={[
            { id: 'fit', text: 'Fit' },
            { id: 'fill', text: 'Fill' },
          ]}
          onChange={(fit) => onChange({ fit })}
        />
      </div>
    </div>
  )
}

function ratioText(r: number) {
  if (Math.abs(r - 16 / 9) < 0.005) return '16:9'
  if (Math.abs(r - 4 / 3) < 0.005) return '4:3'
  return r.toFixed(2)
}
