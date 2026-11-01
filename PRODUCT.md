# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Vite + React + TypeScript, static, no backend. Deployed to GitHub Pages under `/what-the-aspect-ratio/`. App state lives in the URL hash so any view is a shareable link.

## Users

Public film fans who want to know where a specific film will look best before they watch it or before they buy a device: "I'm going to watch The Odyssey on a flight — which of my devices, or which iPad / which Galaxy, gives me the most of that IMAX frame?" They arrive from a shared link, usually with one film in mind, and compare a handful of devices they own or are considering.

## Product Purpose

Shows a film inside real phone and tablet screens (iPad, iPhone, Samsung Galaxy Tab, Samsung Galaxy phones, OnePlus phones and tablets) in each of the film's release formats (IMAX 1.43:1, IMAX 1.90:1, 70mm 2.20:1, Scope 2.39:1, 16:9 and generic presets), and ranks which device shows it best. Success: a visitor leaves with a confident answer — "the 13-inch iPad Pro, in the 1.90 version" — and understands why.

## Positioning

The answer is computed, not opined: physical screen geometry from each device's real diagonal and native resolution, the film's real release ratios, and a transparent score. "Best" is reported through three lenses the visitor can see separately — biggest picture (physical image size), fills the screen (share of the screen that is film, not bars), and image quality (panel type for true-black bars, sharpness, brightness/HDR) — plus a balanced overall.

## Operating Context

- The official YouTube trailer plays inside the device screen as a framing simulation, cropped to the chosen ratio from the trailer's 16:9 master. Only one live player at a time; other screens show the trailer thumbnail cropped the same way.
- Visitors switch orientation (landscape/portrait) and Fit (letterbox) vs Fill (crop).
- Visitors may paste another YouTube trailer URL to try other films.

## Capabilities and Constraints

- No film footage is hosted; trailers are YouTube embeds only.
- Device specs and film release formats carry a source per entry; anything unverified is marked as such, never guessed silently.
- The trailer crop is a simulation: true IMAX-ratio releases reveal more image, they are not crops of 16:9. The UI says so.
- No prices, affiliate links, or purchase claims.

## Brand Commitments

Name: **What The Aspect Ratio**.

## Evidence on Hand

None beyond public device spec sheets and film release information gathered with sources. No testimonials, reviews, or usage numbers exist and none may be invented.

## Product Principles

1. Show the work: every ranking exposes its inputs (inches, % of screen, pixels, panel).
2. One film, many screens: the film choice stays fixed while devices change, so comparison is the core gesture.
3. True to physical size when it matters: a phone never looks as big as a 13-inch tablet when comparing.
4. Honest about the simulation and the data.
