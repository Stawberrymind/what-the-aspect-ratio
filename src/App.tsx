import { useEffect, useMemo, useState } from 'react'
import { Controls, TopNav } from './components/TopBar'
import { RankRail } from './components/RankRail'
import { DevicePicker, DeviceSelect } from './components/DevicePicker'
import { ViewerView } from './views/ViewerView'
import { CompareView } from './views/CompareView'
import { RankingsView } from './views/RankingsView'
import { deviceById, devices } from './data/devices'
import { films, genericFormats } from './data/films'
import { useHashState } from './lib/state'
import { bestByCategory, rankDevices } from './lib/rank'
import { formatRatio } from './lib/geometry'
import type { FilmFormat } from './types'
import './App.css'

/** Screen shapes offered with every film, so "how does it look in plain 16:9" is always one click away. */
const COMMON_FORMAT_IDS = ['r-178', 'r-185']

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setMatches(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return matches
}

export default function App() {
  const [state, update] = useHashState()
  const phone = useMediaQuery('(max-width: 720px)')

  const film = films.find((f) => f.id === state.filmId) ?? films[0]
  // A pasted trailer can be any film, so it gets the generic presets as its formats.
  const releaseFormats: FilmFormat[] = state.customYoutubeId ? genericFormats : film.formats
  const extraFormats = state.customYoutubeId
    ? []
    : genericFormats.filter(
        (g) => COMMON_FORMAT_IDS.includes(g.id) && !releaseFormats.some((f) => Math.abs(f.ratio - g.ratio) < 0.01),
      )
  const allFormats = [...releaseFormats, ...extraFormats]
  const format =
    allFormats.find((f) => f.id === state.formatId) ??
    allFormats.find((f) => f.id === film.defaultFormatId) ??
    allFormats[0]
  const isExtra = extraFormats.includes(format)
  const ratioLabel = `${formatRatio(format.ratio)} ${format.label}`
  const youtubeId = state.customYoutubeId ?? film.youtubeId
  const filmTitle = state.customYoutubeId ? 'Custom trailer' : film.title

  const device = deviceById.get(state.deviceId) ?? devices[0]
  const compareDevices = state.compareIds.map((id) => deviceById.get(id)).filter((d) => d !== undefined)

  const ranked = useMemo(
    () => rankDevices(devices, format.ratio, state.orientation, state.fit, state.lens),
    [format.ratio, state.orientation, state.fit, state.lens],
  )
  const best = useMemo(() => bestByCategory(ranked), [ranked])

  const open = (id: string) => update({ deviceId: id, view: 'viewer' })

  const controls = (
    <Controls
      state={state}
      films={films}
      formats={releaseFormats}
      extraFormats={extraFormats}
      onChange={update}
      device={
        state.view === 'viewer' ? (
          <DeviceSelect devices={devices} value={device.id} onChange={(deviceId) => update({ deviceId })} label="Device" />
        ) : undefined
      }
    />
  )
  // On phones the Viewer shows the device first and the controls under it.
  const controlsInViewer = phone && state.view === 'viewer'

  return (
    <div className="app">
      <header className="topbar">
        <TopNav
          view={state.view}
          customYoutubeId={state.customYoutubeId}
          onChange={update}
          onCustomYoutube={(customYoutubeId) =>
            update({ customYoutubeId, formatId: customYoutubeId ? 'r-178' : film.defaultFormatId })
          }
        />
        {!controlsInViewer && controls}
      </header>

      {state.view === 'viewer' && (
        <main className="app__viewer">
          <ViewerView
            device={device}
            formats={isExtra ? [...releaseFormats, format] : releaseFormats}
            format={format}
            orientation={state.orientation}
            fit={state.fit}
            youtubeId={youtubeId}
            filmTitle={filmTitle}
            controls={controlsInViewer ? controls : undefined}
          />
          <RankRail
            ranked={ranked}
            ratioLabel={ratioLabel}
            lens={state.lens}
            onLens={(lens) => update({ lens })}
            focusedId={device.id}
            onFocus={(deviceId) => update({ deviceId })}
          />
        </main>
      )}

      {state.view === 'compare' && (
        <main className="app__page">
          <CompareView
            devices={compareDevices}
            youtubeId={youtubeId}
            filmTitle={filmTitle}
            ratio={format.ratio}
            ratioLabel={ratioLabel}
            orientation={state.orientation}
            fit={state.fit}
            trueScale={state.trueScale}
            onTrueScale={(trueScale) => update({ trueScale })}
            liveId={state.compareIds.includes(state.deviceId) ? state.deviceId : (state.compareIds[0] ?? null)}
            onLive={(deviceId) => update({ deviceId })}
            onRemove={(id) => update({ compareIds: state.compareIds.filter((x) => x !== id) })}
            onOpen={open}
            picker={
              <DevicePicker
                devices={devices}
                selectedIds={state.compareIds}
                max={6}
                onChange={(compareIds) => update({ compareIds })}
                label="Devices to compare"
              />
            }
          />
        </main>
      )}

      {state.view === 'rankings' && (
        <main className="app__page">
          <RankingsView
            ranked={ranked}
            best={best}
            filmTitle={filmTitle}
            ratioLabel={ratioLabel}
            lens={state.lens}
            onLens={(lens) => update({ lens })}
            onOpen={open}
            onCompare={(compareIds) => update({ compareIds: compareIds.slice(0, 6), view: 'compare' })}
          />
        </main>
      )}
    </div>
  )
}
