import type { Film, FilmFormat } from '../types'

/**
 * Film catalog. Every youtubeId was checked against YouTube oEmbed
 * (https://www.youtube.com/oembed?url=...&format=json) and the uploader
 * is a studio or distributor channel. Format ratios come from the sources
 * noted per film; IMAX expanded ratios are listed next to the standard frame.
 */
export const films: Film[] = [
  {
    id: 'odyssey',
    title: 'The Odyssey',
    year: 2026,
    director: 'Christopher Nolan',
    // "The Odyssey | Official Countdown Trailer" - author: Universal Pictures
    youtubeId: 'AyIZ9tiiN8I',
    formats: [
      {
        id: 'imax-143',
        label: 'IMAX 70mm',
        ratio: 1.43,
        note: 'Full-height IMAX 70mm frame, the taller native shooting ratio',
        source: 'https://www.odysseymovie.com/explore-formats/',
      },
      {
        id: 'imax-190',
        label: 'IMAX Digital',
        ratio: 1.9,
        note: 'Digital and laser IMAX frame, shorter than the 70mm picture',
        source: 'https://www.odysseymovie.com/explore-formats/',
      },
      {
        id: '70mm-220',
        label: '70mm',
        ratio: 2.2,
        note: 'Standard 70mm, which crops the top and bottom of the IMAX frame',
        source: 'https://www.odysseymovie.com/explore-formats/',
      },
      {
        id: 'scope-239',
        label: 'Standard 35mm',
        ratio: 2.39,
        note: 'Standard 35mm and digital widescreen; some screens show 1.85 Flat',
        source: 'https://www.odysseymovie.com/explore-formats/',
      },
    ],
    defaultFormatId: 'imax-143',
    source: 'https://www.odysseymovie.com/explore-formats/',
  },
  {
    id: 'oppenheimer',
    title: 'Oppenheimer',
    year: 2023,
    director: 'Christopher Nolan',
    // "OPPENHEIMER - Official Trailer (Universal Studios) - HD" - author: Universal Pictures UK
    youtubeId: 'keydELfWuMQ',
    formats: [
      {
        id: 'imax-143',
        label: 'IMAX 70mm',
        ratio: 1.43,
        note: 'IMAX 70mm frame for the IMAX sequences, the film’s tallest picture',
        source: 'https://ymcinema.com/2023/06/23/the-official-oppenheimer-large-formats-guide/',
      },
      {
        id: 'imax-190',
        label: 'IMAX Digital',
        ratio: 1.9,
        note: 'Digital and laser IMAX frame in select locations',
        source: 'https://ymcinema.com/2023/06/23/the-official-oppenheimer-large-formats-guide/',
      },
      {
        id: '70mm-220',
        label: '70mm',
        ratio: 2.2,
        note: 'Standard 70mm and digital frame; IMAX scenes are cropped to this width',
        source: 'https://ymcinema.com/2023/06/23/the-official-oppenheimer-large-formats-guide/',
      },
    ],
    defaultFormatId: 'imax-143',
    source: 'https://ymcinema.com/2023/06/23/the-official-oppenheimer-large-formats-guide/',
  },
  {
    id: 'dune-part-two',
    title: 'Dune: Part Two',
    year: 2024,
    director: 'Denis Villeneuve',
    // "Dune: Part Two - Official Trailer" - author: Warner Bros. UK & Ireland
    youtubeId: 'WUBQdC__fC4',
    formats: [
      {
        id: 'imax-143',
        label: 'IMAX 70mm',
        ratio: 1.43,
        note: 'About 40 minutes of the film in the full-height IMAX 70mm frame',
        source: 'https://www.dexerto.com/tv-movies/best-way-to-watch-dune-2-imax-plf-2566736/',
      },
      {
        id: 'imax-190',
        label: 'IMAX Digital',
        ratio: 1.9,
        note: 'The rest of the film in the 1.90 IMAX frame',
        source: 'https://www.dexerto.com/tv-movies/best-way-to-watch-dune-2-imax-plf-2566736/',
      },
      {
        id: 'scope-239',
        label: 'Scope',
        ratio: 2.39,
        note: 'Standard wide release, finished as a 2.39:1 digital intermediate',
        source: 'https://www.dexerto.com/tv-movies/best-way-to-watch-dune-2-imax-plf-2566736/',
      },
    ],
    defaultFormatId: 'imax-143',
    source: 'https://www.dexerto.com/tv-movies/best-way-to-watch-dune-2-imax-plf-2566736/',
  },
  {
    id: 'interstellar',
    title: 'Interstellar',
    year: 2014,
    director: 'Christopher Nolan',
    // "Interstellar - Trailer - Official Warner Bros. UK" - author: Warner Bros. UK & Ireland
    youtubeId: 'zSWdZVtXT7E',
    formats: [
      {
        id: 'imax-143',
        label: 'IMAX 70mm',
        ratio: 1.43,
        note: 'IMAX 70mm frame for the IMAX footage, alternating with 2.39 scenes',
        source: 'https://flixchatter.net/2014/11/19/interstellar-on-imax-70mm-vs-standard-70mm/',
      },
      {
        id: 'imax-190',
        label: 'IMAX Digital',
        ratio: 1.9,
        note: 'Digital IMAX frame, alternating with 2.39 widescreen scenes',
        source: 'https://flixchatter.net/2014/11/19/interstellar-on-imax-70mm-vs-standard-70mm/',
      },
      {
        id: '70mm-220',
        label: '70mm',
        ratio: 2.2,
        note: 'Standard 70mm prints at a constant 2.20:1',
        source: 'https://flixchatter.net/2014/11/19/interstellar-on-imax-70mm-vs-standard-70mm/',
      },
      {
        id: 'scope-239',
        label: 'Scope',
        ratio: 2.39,
        note: 'Standard 35mm and digital 2K/4K prints at 2.39:1',
        source: 'https://flixchatter.net/2014/11/19/interstellar-on-imax-70mm-vs-standard-70mm/',
      },
    ],
    defaultFormatId: 'imax-143',
    source: 'https://flixchatter.net/2014/11/19/interstellar-on-imax-70mm-vs-standard-70mm/',
  },
  {
    id: 'dark-knight',
    title: 'The Dark Knight',
    year: 2008,
    director: 'Christopher Nolan',
    // "The Dark Knight - Official Trailer [HD]" - author: Warner On Demand
    youtubeId: 'kmJLuwP3MbY',
    formats: [
      {
        id: 'imax-143',
        label: 'IMAX 70mm',
        ratio: 1.43,
        note: 'Six IMAX-shot sequences expand to the taller 1.43 frame',
        source: 'https://www.imdb.com/title/tt0468569/technical',
      },
      {
        id: 'scope-239',
        label: 'Scope',
        ratio: 2.39,
        note: 'Anamorphic 35mm frame for the rest of the film (2.40 in some listings)',
        source: 'https://www.imdb.com/title/tt0468569/technical',
      },
    ],
    defaultFormatId: 'imax-143',
    source: 'https://www.imdb.com/title/tt0468569/technical',
  },
  {
    id: 'top-gun-maverick',
    title: 'Top Gun: Maverick',
    year: 2022,
    director: 'Joseph Kosinski',
    // "Top Gun: Maverick - Official Trailer (2022) - Paramount Pictures" - author: Paramount Pictures
    youtubeId: 'qSqVVswa420',
    formats: [
      {
        id: 'imax-190',
        label: 'IMAX Digital',
        ratio: 1.9,
        note: 'Nearly an hour of IMAX-exclusive flying scenes fill the full IMAX height',
        source: 'https://www.soundandvision.com/content/top-gun-maverick',
      },
      {
        id: 'scope-239',
        label: 'Scope',
        ratio: 2.39,
        note: 'Standard widescreen frame for the rest of the film',
        source: 'https://www.soundandvision.com/content/top-gun-maverick',
      },
    ],
    defaultFormatId: 'imax-190',
    source: 'https://www.soundandvision.com/content/top-gun-maverick',
  },
  {
    id: 'avatar-fire-and-ash',
    title: 'Avatar: Fire and Ash',
    year: 2025,
    director: 'James Cameron',
    // "Avatar: Fire and Ash | Officiële Trailer | 20th Century Studios NL" - author: 20th Century Studios NL
    youtubeId: '43lmMitslwo',
    formats: [
      {
        id: 'imax-190',
        label: 'IMAX',
        ratio: 1.9,
        note: 'IMAX frame, the largest picture on the widest IMAX release',
        source: 'https://www.imdb.com/title/tt1757678/technical',
      },
      {
        id: 'flat-185',
        label: '3D',
        ratio: 1.85,
        note: 'Standard 3D version frame at 1.85:1',
        source: 'https://www.imdb.com/title/tt1757678/technical',
      },
      {
        id: 'scope-239',
        label: 'Scope',
        ratio: 2.39,
        note: 'Theatrical 2.39:1 frame for 2D screenings',
        source: 'https://www.imdb.com/title/tt1757678/technical',
      },
    ],
    defaultFormatId: 'imax-190',
    source: 'https://www.imdb.com/title/tt1757678/technical',
  },
]

/** Format presets offered for any film, and for a pasted custom trailer. */
export const genericFormats: FilmFormat[] = [
  { id: 'r-133', label: 'Academy', ratio: 4 / 3 },
  { id: 'r-143', label: 'IMAX 70mm', ratio: 1.43 },
  { id: 'r-185', label: 'Flat', ratio: 1.85 },
  { id: 'r-190', label: 'IMAX Digital', ratio: 1.9 },
  { id: 'r-178', label: 'HD', ratio: 16 / 9 },
  { id: 'r-200', label: 'Univisium', ratio: 2 },
  { id: 'r-220', label: '70mm', ratio: 2.2 },
  { id: 'r-239', label: 'Scope', ratio: 2.39 },
  { id: 'r-276', label: 'Ultra Panavision', ratio: 2.76 },
]
