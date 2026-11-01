---
name: What the Aspect Ratio
description: Every release ratio as a labelled frame line on one projectionist's framing chart, with the device screen laid under it.
colors:
  chart-ground: "#0c0d0f"
  chart-ground-raised: "#131417"
  bezel: "#17181b"
  glass: "#000000"
  chart-white: "#e9e7e1"
  chart-white-dim: "rgba(233, 231, 225, 0.66)"
  chart-white-faint: "rgba(233, 231, 225, 0.42)"
  hairline: "rgba(233, 231, 225, 0.16)"
  hairline-strong: "rgba(233, 231, 225, 0.32)"
  active-red: "#d9302c"
  active-red-wash: "rgba(217, 48, 44, 0.09)"
  frame-blue: "#3aa0ff"
  frame-blue-wash: "rgba(58, 160, 255, 0.1)"
  on-red: "#ffffff"
typography:
  headline:
    fontFamily: "Schibsted Grotesk Variable, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(17px, 2.2vw, 24px)"
    fontWeight: 700
    lineHeight: 1.2
  title:
    fontFamily: "Schibsted Grotesk Variable, Segoe UI, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: "Schibsted Grotesk Variable, Segoe UI, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.4
  body-sm:
    fontFamily: "Schibsted Grotesk Variable, Segoe UI, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.4
  figure:
    fontFamily: "Martian Mono, ui-monospace, Consolas, monospace"
    fontSize: "20px"
    fontWeight: 400
    letterSpacing: "-0.02em"
    fontFeature: "tnum"
  measure:
    fontFamily: "Martian Mono, ui-monospace, Consolas, monospace"
    fontSize: "12px"
    fontWeight: 400
    fontFeature: "tnum"
  label:
    fontFamily: "Martian Mono, ui-monospace, Consolas, monospace"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.1em"
rounded:
  none: "0px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "5": "24px"
  "6": "32px"
  "7": "48px"
components:
  segmented-format:
    backgroundColor: "{colors.chart-ground}"
    textColor: "{colors.chart-white-dim}"
    rounded: "{rounded.none}"
    height: "36px"
    padding: "0 10px"
  segmented-format-active:
    backgroundColor: "{colors.active-red}"
    textColor: "{colors.on-red}"
    rounded: "{rounded.none}"
  segmented-ink-active:
    backgroundColor: "{colors.chart-white}"
    textColor: "{colors.chart-ground}"
    rounded: "{rounded.none}"
  select:
    backgroundColor: "{colors.chart-ground}"
    textColor: "{colors.chart-white}"
    rounded: "{rounded.none}"
    height: "36px"
    padding: "0 32px 0 12px"
  input-text:
    backgroundColor: "{colors.chart-ground}"
    textColor: "{colors.chart-white}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    height: "32px"
    padding: "0 12px"
  button-outline:
    backgroundColor: "{colors.chart-ground}"
    textColor: "{colors.chart-white}"
    rounded: "{rounded.none}"
    height: "34px"
    padding: "4px 12px"
  button-outline-hover:
    backgroundColor: "{colors.chart-white}"
    textColor: "{colors.chart-ground}"
  button-hairline:
    backgroundColor: "{colors.chart-ground}"
    textColor: "{colors.chart-white-dim}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    height: "32px"
    padding: "0 12px"
  nav-tab:
    textColor: "{colors.chart-white-dim}"
    padding: "0 16px"
  nav-tab-active:
    textColor: "{colors.chart-white}"
  frame-tag-active:
    backgroundColor: "{colors.active-red}"
    textColor: "{colors.on-red}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "4px 8px"
  frame-tag-other:
    backgroundColor: "{colors.chart-ground}"
    textColor: "{colors.frame-blue}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "4px 8px"
  verdict-box:
    backgroundColor: "{colors.chart-ground}"
    textColor: "{colors.chart-white}"
    rounded: "{rounded.none}"
    padding: "12px 16px"
---

# Design System: What the Aspect Ratio

## Overview

**Creative North Star: "The Projectionist's Framing Chart"**

The whole app is one framing chart, the kind a projectionist tapes up to line a picture up with a screen. A near-black ground carries a faint registration grid. Every release ratio is drawn on it as a labelled frame line, and the device's own glass sits under those lines. The active ratio is the one red line on the chart. Every other ratio is a blue hairline. The chart is a working instrument, not a showroom. It refuses the usual category look of glossy device mockups on a dark spec page.

The density is like an instrument panel. There is one reading size (14px), and hierarchy comes from weight, position and the switch from grotesk to mono, not from big type. Structure comes from 1px rules, not fills or shadows. Measurements, ratios and frame tags are set in mono, stencilled in small caps, so a number always reads as a measurement. Controls have square corners. Devices keep their real corner radii, because that radius is a measured fact about the device.

Motion has one job: when the format changes, the red frame line and the picture box glide to the new ratio over 520ms on a long ease-out, and the blue lines stay where they are. UI feedback is a fast 160ms colour change. Reduced motion turns both off.

**Key Characteristics:**
- Near-black chart ground with a faint 80px registration grid and a vignette on the stage.
- Red is the active ratio and nothing else. Blue draws every other ratio and every score bar.
- 1px hairline rules carry all structure. There are no drop shadows.
- Schibsted Grotesk for UI. Martian Mono only for measurements, ratios and stencilled labels.
- Square controls. Devices keep their real radii.
- One signature motion: the red frame line moves, everything else holds still.

## Colors

A monochrome chart in warm chart-white on near-black, plus two signal inks with fixed meanings.

### Primary
- **Active Red** (active-red): the active ratio only. It marks the active frame line (1.5px inset), its corner ticks and solid tag, the selected Format option, the rank-1 numeral and its 3px inset marker, the verdict box border, and invalid-input borders. It is also the accent, caret and text-selection colour. **Active Red Wash** tints the rank-1 row.

### Secondary
- **Frame Blue** (frame-blue): every non-active ratio's frame line (1px inset) and outlined tag, the leader lines from margin tags, score-bar fills, link underlines and the focus ring. **Frame Blue Wash** is the matching tint for blue surfaces.

### Neutral
- **Chart Ground** (chart-ground): page, stage, rail, inputs and tag backings.
- **Chart Ground Raised** (chart-ground-raised): the one raised tone, used for sticky table heads, popovers and the error tip.
- **Bezel** (bezel): device body around the glass.
- **Glass** (glass): pure black screen under the picture and the camera cutouts.
- **Chart White** (chart-white): primary text, the active-tab underline, ink-filled selections and outline-button borders.
- **Chart White Dim / Faint**: secondary text and field labels / placeholders.
- **Hairline / Hairline Strong**: dividers, grid lines and hover fills / control borders and the crosshair.
- **On Red** (on-red): text on red fills only.

### Named Rules
**The One Red Rule.** Red marks the active ratio and nothing else (rank 1 and the verdict box are the active ratio's winner, so they count as the same signal). The only exception is the error border on an invalid input. Every other selected state, such as lenses, orientation, scaling and view tabs, uses an ink fill or ink underline, never red.

**The Blue Is Everything Else Rule.** Non-active frame lines, score bars, links and focus all use Frame Blue. Blue never marks a selection.

## Typography

**Display Font:** none. The system has no display face.
**Body Font:** Schibsted Grotesk Variable (with Segoe UI, system-ui)
**Label/Mono Font:** Martian Mono 400/500 (with ui-monospace, Consolas)

**Character:** A plain, slightly condensed grotesk does the talking. A wide mono does the measuring. The mono looks like stencilled chart lettering, and tabular figures keep the numbers lined up in columns.

### Hierarchy
- **Headline** (700, clamp(17px, 2.2vw, 24px), 1.2): the Rankings page title only.
- **Title** (700, 17px, 1.2): device name over the stage, rail title, winner name in the verdict box.
- **Body** (400, 14px, 1.4): the one reading size. Weight 500 for controls, 600 for device names and buttons, 700 for selected tabs and section heads.
- **Body Small** (12px): specs, legend, table cells, secondary buttons, input text.
- **Figure** (Mono 400, 20px, -0.02em, tabular): stat-strip numbers.
- **Measure** (Mono, tabular): any inline ratio, inch, pixel or score value, usually set slightly smaller and lighter than the text around it.
- **Label** (Mono 500, 11px, 0.1em, uppercase, chart-white-dim): field names, stat terms, table heads (0.06em) and frame tags (0.08em).

### Named Rules
**The Mono Means Measured Rule.** Martian Mono appears only on measurements, ratios, stencilled field names and frame tags. Prose and controls never use it.

**The One Reading Size Rule.** Hierarchy comes from weight and position on a 14px base. Nothing above 24px exists.

## Layout

A fixed working screen. At 1100px and wider, the Viewer fills exactly 100dvh (minimum 720px) under a two-tier top bar. The nav tier is 52px and holds the wordmark, view tabs, paste-a-trailer field and Copy link. The control tier is at least 72px, bottom-aligned and wrapping, and holds Film, Device, Format, Orientation and Fit/Fill. Below that is a grid with the chart stage (1fr) and a 400px ranking rail. The stage is a grid with a title block top-left, legend top-right, the device centred, and the note and transport along the bottom. A four-column stat strip sits under it, divided by hairlines.

The stage background is the registration grid. That means two 1px hairline gradients on an 80px cell, centred, under a radial vignette that fades to the ground colour.

Spacing uses a 4px-based scale (4/8/12/16/24/32/48). Bar and stage padding is 24px at desktop and 16px on phones. Rankings is a centred column with a 1280px max width.

Breakpoints: at 1100px the rail drops under the stage and the stat strip goes to 2×2. At 900px the trailer field hides. At 720px the bar becomes the phone layout: tabs get their own row, the Format control becomes a two-column grid with nothing clipped, and the device, orientation and scaling controls share one row. Compare collapses at 719px and Rankings at 640px.

## Elevation & Depth

Flat. Nothing uses a drop shadow. Depth comes from two things: tonal steps (ground, raised, bezel, glass) and rule weight (hairline vs hairline-strong). The only `box-shadow`s are inset strokes used as drawing tools: the frame lines (1.5px red, 1px blue) and the 3px red rank-1 marker. Selection on a device frame is a 1px red outline offset by 4px.

### Named Rules
**The Drawn Not Lifted Rule.** If something needs emphasis, draw a line around it or inside it. Don't lift it with a shadow.

## Shapes

Controls, tags, panels, tables and popovers have square corners (0px). The only round things on the chart are the centre crosshair ring (50%) and the device glass and camera cutouts, whose radii come from each device's measured corner radius (outer radius = glass radius + bezel + 1px). In Compare, radius transitions with size on the 520ms frame timing. Frame-line corners get 10×10px red L-ticks, 3px thick, painted like the marks on a framing leader. Controls that share an edge, like segmented options and the input-plus-button pair, are drawn as one bordered strip with internal 1px dividers. The Format control splits its common screen shapes from the release formats with a dashed divider.

## Components

### Buttons
- **Shape:** square (0px), 1px border.
- **Outline (primary action):** 1px chart-white border, 600 weight, 34px tall. On hover it fills with ink and the text flips to the ground colour. Disabled drops to hairline-strong with dim text.
- **Hairline (utility, e.g. Copy link, Open):** 1px hairline-strong border, dim 12px text. On hover the text and border go to chart-white.
- **Text link button:** chart-white text with a blue underline offset 3px. On hover the underline thickens to 2px.
- **Focus:** 2px Frame Blue outline at 2px offset everywhere. It's inset (-2px) inside segmented strips.

### Segmented Controls
- **Style:** a single strip with a 1px hairline-strong border and 1px dividers, 36px tall in the bar and 34px in the rail. Options are dim, 500 weight.
- **Format (red):** the selected option fills Active Red with white 700 text. Mono ratio values sit inline at 12px.
- **Ink (everything else):** the selected option fills chart-white with ground-colour text.
- **Hover:** hairline fill, text goes to chart-white.

### Inputs / Fields
- **Style:** square, 1px hairline-strong border, ground fill. Selects use a 12px chevron drawn inline. Each field has a mono Label above it with a 6px gap.
- **Hover:** border goes to chart-white.
- **Error:** border goes to Active Red, with a raised tip that has a red border.

### Navigation
- **View tabs:** dim 500 text with 16px side padding. The current tab is chart-white 700 with a 2px chart-white underline sitting on the tier's bottom rule. Colour transitions take 160ms.
- **Wordmark:** 700, uppercase, 0.02em tracking, next to a 30×22 mark.

### Tables (Ranking rail, Rankings)
- Sticky mono-label heads, 1px row rules, numbers right-aligned in mono. Each score has a 2px bar under it: blue fill on a hairline track, animated on frame timing.
- **Rank 1:** red numeral, a 3px red inset marker on the rank cell, and a red-wash row. The focused row gets a hairline fill and an ink underline on the device name.

### Verdict Box
- A square panel with a 1px Active Red border and 12/16px padding. It holds a 14/700 heading, a 17/700 winner name and dim prose. It is the only boxed panel that uses red.

### Device Frame (signature)
- A bezel-coloured body with a hairline-strong border, holding black glass at the device's real radius. Inside the glass: the trailer is cropped into the active picture box, with a 1.5px red inset frame line, red corner ticks and a solid red mono tag in the top-left. Blue 1px inset lines mark the other ratios, and their outlined blue tags sit on the glass or out in the margin, joined to the line by a 1px blue leader. There's a hairline-strong crosshair (36% arms, 24% ring), and a red-bordered crop tag in Fill mode. Switching format animates the picture box over 520ms on `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Interactive (Compare):** on hover the border goes to chart-white-dim. When selected it gets a 1px red outline offset by 4px.

## Do's and Don'ts

### Do:
- **Do** give red only to the active ratio and its rank-1 result, and use ink fills for every other selected state.
- **Do** draw every non-active ratio, score bar, link underline and focus ring in Frame Blue (#3aa0ff).
- **Do** set every measurement, ratio and frame tag in Martian Mono with tabular figures, and keep prose and controls in Schibsted Grotesk.
- **Do** build structure from 1px hairlines (16% / 32% chart-white) and square corners.
- **Do** keep devices at their real measured corner radii.
- **Do** animate frame changes on the 520ms frame timing with `cubic-bezier(0.16, 1, 0.3, 1)`, and UI feedback at 160ms.

### Don't:
- **Don't** use red for lenses, tabs, orientation, scaling or any state other than the active ratio.
- **Don't** add drop shadows. Inset strokes for frame lines and the rank marker are the only shadow use.
- **Don't** round controls, tags or panels.
- **Don't** set prose or button text in the mono face.
- **Don't** go above 24px type or add a separate display face.
