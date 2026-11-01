---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: ["src/views","src/components"]
---

# Surface: app (Viewer · Compare · Rankings)

Scope: the whole single-page app. Visitor mode: Operate. Audience: public film fans with one film in mind, choosing where it looks best. Task: pick film + format, see it on a device, compare devices, get a ranked answer with its working. Constraints: YouTube trailer as framing simulation, one live iframe at a time; sources on all data; honest simulation label.

## Direction contract

THESIS: Every release ratio is a labelled frame line on one projectionist's framing chart, and the device screen is laid under it. Refuses the category default of a grid of glossy device mockups on a dark spec page.

OWN-WORLD: Near-black chart ground #0c0d0f, chart-white lines and text #e9e7e1, red #d9302c for the ACTIVE ratio only (frame line, selected format, rank 1), blue #3aa0ff hairlines for the other ratios and score bars. Hairline 1px rules, a faint 80px registration grid on the stage, centre crosshair with ring. Schibsted Grotesk for UI; Martian Mono only for measurements, ratios and stencilled frame labels. Square corners on controls; devices keep their real radii.

STORY: The visitor sees The Odyssey in IMAX 1.43 on a big tablet immediately, sees the other ratios as frame lines on the same glass, switches format and watches the red line move, then reads which device wins and why.

FIRST VIEWPORT: Two-tier top bar (stated adaptation: six format options plus film, device, orientation and scaling cannot share one row with wordmark, tabs and share at 1440): nav tier = wordmark, view tabs (Viewer / Compare / Rankings), paste-a-trailer field, Copy link; control tier = Film, Device, Format segmented control (red = active; common 16:9 and 1.85 after a dashed divider), Orientation icons and Fit/Fill right. On phones the controls sit under the stage. Work area (~1fr): stage with registration grid, device frame centred, trailer inside the active red frame, blue nested frames labelled, crosshair; caption row above (device, orientation, native res, legend). Stat strip under the stage: Picture in, Screen used, Picture px, Panel. Right rail 400px: ranking table for the current format (red inset on rank 1), "Best for 1.43" verdict box, lens weights. Primary action: the Format control.

FORM: Projectionist's Framing Chart, my top-ranked grounded candidate (#1 of 7), chosen by the user over the assigned roll. seed:f39acb1c182c5bf9

Signature interaction: switching format animates the red active frame line from the old ratio to the new one while the trailer box resizes with it; the blue frames stay put. In Compare, "True scale" draws every device at one shared inches-to-pixels scale on the same chart grid.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
