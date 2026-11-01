import { useEffect, useId, useMemo, useRef, useState } from 'react'
import type { Category, Device } from '../types'
import { CATEGORY_LABEL, CATEGORY_ORDER } from '../data/devices'
import './DevicePicker.css'

export interface DevicePickerProps {
  devices: Device[]
  selectedIds: string[]
  max?: number
  onChange: (ids: string[]) => void
  label?: string
}

function groupByCategory(devices: Device[]) {
  const groups: { category: Category; items: Device[] }[] = []
  for (const category of CATEGORY_ORDER) {
    const items = devices.filter((d) => d.category === category)
    if (items.length) groups.push({ category, items })
  }
  return groups
}

function CloseIcon() {
  return (
    <svg className="dpick__icon" viewBox="0 0 12 12" width="10" height="10" aria-hidden="true" focusable="false">
      <path d="M2 2l8 8M10 2l-8 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  )
}

export function DevicePicker({ devices, selectedIds, max = 6, onChange, label = 'Add device' }: DevicePickerProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const popId = useId()
  const hintId = useId()

  const byId = useMemo(() => new Map(devices.map((d) => [d.id, d])), [devices])
  const selected = selectedIds.map((id) => byId.get(id)).filter((d): d is Device => !!d)
  const atMax = selectedIds.length >= max

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase()
    const matches = q
      ? devices.filter((d) =>
          `${d.name} ${d.brand} ${CATEGORY_LABEL[d.category]}`.toLowerCase().includes(q),
        )
      : devices
    return groupByCategory(matches)
  }, [devices, query])

  function close(returnFocus: boolean) {
    setOpen(false)
    setQuery('')
    if (returnFocus) buttonRef.current?.focus()
  }

  useEffect(() => {
    if (!open) return
    searchRef.current?.focus()
    function onPointerDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) close(false)
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.stopPropagation()
        close(true)
      }
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  function toggle(id: string) {
    if (selectedIds.includes(id)) onChange(selectedIds.filter((x) => x !== id))
    else if (!atMax) onChange([...selectedIds, id])
  }

  return (
    <div
      className="dpick"
      ref={rootRef}
      onBlur={(e) => {
        // Tab leaving the popover closes it without stealing focus back.
        if (open && e.relatedTarget && !rootRef.current?.contains(e.relatedTarget as Node)) close(false)
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        className="dpick__button"
        aria-expanded={open}
        aria-controls={open ? popId : undefined}
        aria-haspopup="dialog"
        onClick={() => (open ? close(true) : setOpen(true))}
      >
        {label} <span className="measure">({selectedIds.length}/{max})</span>
      </button>

      {selected.length > 0 && (
        <ul className="dpick__chips" aria-label="Selected devices">
          {selected.map((d) => (
            <li key={d.id} className="dpick__chip">
              <span className="dpick__chipname">{d.name}</span>
              <button
                type="button"
                className="dpick__chipx"
                aria-label={`Remove ${d.name}`}
                onClick={() => onChange(selectedIds.filter((x) => x !== d.id))}
              >
                <CloseIcon />
              </button>
            </li>
          ))}
        </ul>
      )}

      {open && (
        <div className="dpick__pop" id={popId} role="dialog" aria-label={label}>
          <input
            ref={searchRef}
            type="search"
            className="dpick__search"
            placeholder="Search iPad, Galaxy, OnePlus…"
            aria-label="Search devices"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <p className={`dpick__hint${atMax ? ' dpick__hint--full' : ''}`} id={hintId} role="status">
            {atMax ? `Limit reached: remove a device to add another (max ${max}).` : `Choose up to ${max} devices.`}
          </p>
          <div className="dpick__list">
            {groups.length === 0 && <p className="dpick__empty">No device matches “{query}”.</p>}
            {groups.map((g) => (
              <fieldset className="dpick__group" key={g.category}>
                <legend className="dpick__legend label">{CATEGORY_LABEL[g.category]}</legend>
                {g.items.map((d) => {
                  const checked = selectedIds.includes(d.id)
                  const disabled = !checked && atMax
                  return (
                    <label className={`dpick__item${disabled ? ' dpick__item--disabled' : ''}`} key={d.id}>
                      <input
                        type="checkbox"
                        className="dpick__check"
                        checked={checked}
                        disabled={disabled}
                        aria-describedby={disabled ? hintId : undefined}
                        onChange={() => toggle(d.id)}
                      />
                      <span className="dpick__name">{d.name}</span>
                      <span className="dpick__meta measure">{d.diagonalIn}&Prime;</span>
                    </label>
                  )
                })}
              </fieldset>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function DeviceSelect({
  devices,
  value,
  onChange,
  label,
}: {
  devices: Device[]
  value: string
  onChange: (id: string) => void
  label: string
}) {
  const id = useId()
  const groups = useMemo(() => groupByCategory(devices), [devices])
  return (
    <div className="dsel">
      <label className="dsel__label label" htmlFor={id}>
        {label}
      </label>
      <select id={id} className="dsel__select" value={value} onChange={(e) => onChange(e.target.value)}>
        {groups.map((g) => (
          <optgroup key={g.category} label={CATEGORY_LABEL[g.category]}>
            {g.items.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  )
}
