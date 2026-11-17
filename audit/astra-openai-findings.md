# OpenAI "GPT-6 Astra" starfield: how it is built

Source page: https://openai.com/index/gpt-6-astra/ (inspected live in the built-in browser, 2026-11-16).
Labels: **Confirmed** = read from the shipped JavaScript or the live DOM. **Inferred** = reasoned from that code.

## 1. Technology: WebGL2 (Confirmed)

| Check | Result |
|---|---|
| `document.querySelectorAll('canvas')` | one `<canvas class="absolute inset-0 block size-full">`, 1504x845, `getContext('webgl2')` succeeds |
| `<video>` count | 0 |
| `window.THREE` / `window.gsap` | not exposed (three.js is bundled into a Next/Turbopack chunk, not a global) |
| SVG | 109 `<svg>` on the page are UI icons. The only SVG in the effect is a string constant holding the five logo paths (see 2) that is parsed in JS and never inserted in the DOM |
| CSS | CSS only draws the page background and the "GPT" / "Astra" labels (DOM text, not canvas) |

So: **WebGL (three.js `Points` + custom `ShaderMaterial`)**, not Canvas 2D, not SVG, not CSS.

## 2. The script

`https://openai.com/_next/static/immutable/chunks/2ia6c_20zgahj.js` (52 KB). It holds the vertex and fragment shaders (`gl_PointSize`, `gl_FragColor`), the particle generator, and the palette. Shared three.js code lives in the ~1.6 MB chunks (`1gf_fzrqx5a-m.js`, `3x2d7x6w-5d28.js`), which also hold the scene config (`densityFalloff:.22, flowSpeed:.8 ...`).

### Where the "spiral arms" come from
There is no analytic spiral formula. The arms are **five open SVG paths** (an `OpenAI`-swirl-like glyph, `viewBox="0 0 231 325"`) parsed with three's `SVGLoader`. Each path is wrapped in a `CurvePath` subclass (`x`) that maps SVG xy to world xy (`(x-114.973) * 9.7/325`, `(211.36-y) * 9.7/325`) and adds a sine depth: `z = sin(t*PI*1.35 + phase) * depth * rotationDepth * sin(t*PI)`.

Per path the table `v` gives `{depth, phase, speed, strong}`:
`[{.62,.16,.025,true},{-.46,.72,-.018,false},{.78,.38,.021,true},{-.7,.58,-.016,false},{.42,.08,.03,true}]`.

### Placing particles on an arm
For each path the generator draws `count` stars (strong arm 220, weak arm 170, times `density`=4 capped by tier; plus orbital dust 150/90 when enabled; plus a 24-star centre cluster):

1. `u = rand()`; `s = u + densityFalloff * sin(u*2PI) / 2PI` (densityFalloff .22). Stars bunch toward the middle of each arm and thin at the ends.
2. `point = path.getPointAt(s)`, `tangent`, `normal = (-ty, tx, 0)`.
3. Scatter across the line: `spread = scatter(.4) * lerp(.3, 1, sin(s*PI)) * (.22 + .78*rand())`; across offset `(rand()+rand()-1) * spread` (triangular distribution), depth offset `(rand()+rand()-1) * spread * .65`. Arms are therefore wider in the middle and tight at the tips.
4. The path is also baked into a 512x1 float texture (`uPathTexture`). The vertex shader re-samples it every frame at `fract(orbitProgress + uPathOffset)`, so each star **flows along its arm**. `uPathOffset` is advanced by the animation loop (flowSpeed .8; arm speeds from table `v`).

### Sizes (Confirmed)
Per star: `isHero = rand() < lerp(.22*w, w, sin(s*PI))` where `w` = .085 (strong arm) or .055 (weak arm).
- Ordinary star: `starScale = (0.12 + rand()^2.4 * .68) * size(2.05)`; `starBrightness = (0.56 + .78*rand()) * (strong ? 1 : .82)`.
- Hero star: `starScale = (0.85 + 1.25*rand()) * 2.05`; `starBrightness = 2 + 1.5*rand()` (x .82 on weak arms).
- One guaranteed "flare" star per arm: scale >= 2.2 (2.05 weak), brightness >= 3.35 (2.85).

Vertex shader: `gl_PointSize = pixelRatio * (0.35 + starScale * sizeEnvelope * endpointVisibility * 3.8) * twinkleSize * introScale ...`, then `max(size, 4.0)` for the quad. `sizeEnvelope = mix(1, .14 + .86 * sin(progress*PI)^.68, sizeFalloff .45)`, so stars shrink toward both tips; `endpointVisibility` fades the first and last 5.5% of the arm.

### Colour (Confirmed)
Palette "astra": `#6DCBF4, #7AB1FE, #F87915, #FA994C, #F5F6FB`. Pick by `r = rand()`: `<.36` cyan, `<.52` blue, `<.64` orange, `<.74` light orange, else near-white. That is 36 / 16 / 12 / 10 / 26 %. (The `colorWeights` array in the config, `[.15,.18,.07,.08,.52]`, is not what the picker reads.) Hero stars use fixed colours per arm from `[.08,.58,.22,.68,.44]`.

### Glow (Confirmed)
Fragment shader, per star, no sprite texture:
- Quad is at least 4 px. Under 2 px diameter the star uses a cubic B-spline filtered core (`astraFilteredCore`) so tiny stars do not shimmer; 2 to 4 px blends to the resolved disc.
- Resolved disc: `core = pow(1 - smoothstep(.08, 1, r), 2.2)`.
- Bright stars (`starBrightness` 1.45 to 2.8) get a 4-point cross: `max(horizontalRay, verticalRay) * .28`, rays `exp(-abs(y)*28)`.
- Colour: `mix(starColor, white, whiteCore) * brightness * (1 + colorEnergy*.42)`, where `whiteCore` grows with brightness (white-hot centres, coloured edges).
- Output uses `CustomBlending` with `toneMapped:false` (Confirmed). The factor constants are minified three.js enum names, so "src alpha / one, i.e. additive" is **Inferred**.
- Post: bloom (`bloomIntensity .7`, `bloomThreshold .08`), lens flare (`intensity .28, streaks .18, halo .12`), "dirty glass" (`distortion .68, grain .031`). So the big soft halos come from a bloom pass over very bright (up to 3.5x) stars.

### Animation (Confirmed)
- `converge-tilt` intro: `revealDelay 2.2 s`, `revealDuration 5.5 s`. Stars start scattered over the viewport (hash of `orbitProgress/twinklePhase` seeds), orbit in on a smootherstep pull (`astraIntroMotion`), and settle on the arms.
- Twinkle: `0.86 + 0.14 * sin(twinklePhase + uTime * 0.62 * twinkleRate)`, `twinkleRate .65 to 1.35`.
- Idle field motion: `astraDispersedMotion` adds a small Lissajous drift per star.
- Whole shape auto-rotates (`shapeRotationAmount .42`, `shapeRotationSpeed .22`) with a depth tilt (`astraTiltSpiral`).
- Pointer: lens (magnify .18, illumination .55, depth .5, radius .2 NDC) plus particle repel (radius 176 px, spring 7, return 2.8).
- Scroll: stars disperse over `scrollDisperseDistance 800 px` while the "GPT" and "Astra" labels fade; path-shape morph lets the same particles re-form another outline.
- Quality governor: if `hardwareConcurrency <= 4` or `deviceMemory <= 4` or `saveData`, particle budget and frame interval drop (30/24/20 fps tiers).

### Config defaults (Confirmed, from the scene object)
`particles.count 12000, pointScale 16, maxPointSize 40, starDensity 4, starIntensity 1.35, starSize 2.05, scatter .4, flowSpeed .8, densityFalloff .22, sizeFalloff .45, twinkleSpeed .62, turns 2.35, tailRatio .08, rotation [.08,-.06,-.025]`, `renderer.maxDpr 2`.

## Comparison log: `localhost:3003` vs openai.com (6 passes)

Reference for the formed spiral: the screenshot supplied with the request. The live OpenAI page was inspected in the built-in browser; its scattered-star sky and shader code were read there. The pane did not render the formed spiral, so spiral look was matched to the supplied screenshot (Inferred match).

| Pass | Observed gap | Change in `src/components/home/AstraField.tsx` |
|---|---|---|
| 1 | Local stars small with weak halos; navy `#08101a` sky; ACES tone mapping | Diagnosis only |
| 2 | Port OpenAI star model | Vertex and fragment shader from OpenAI (filtered core, `pow(disc, 2.2)` core, 4-point rays, white-hot centre); `bright` HDR attribute replaces `glow`; palette 36/16/12/10/26; size `0.35 + scale*3.8` with `0.12 + rand^2.4*0.68`; hero stars 2-3.5 bright; no tone mapping; near-black linear sky; always-on twinkle `0.86 + 0.14 sin` |
| 3 | Ribbon too sparse; sky too busy | `STARS_PER_UNIT` 3.2 to 5.5, `DUST_PER_SIDE` 320 to 200, `HERO_SHARE` .026 |
| 4 | Halos smaller and tighter than the reference | Bloom 0.7 to 1.0 / radius .45 to .65 (overshot: halos merged) |
| 5 | Halos clumped | Bloom 0.85 / radius .55 / threshold .12, `HERO_SHARE` .028. Matches reference: distinct halos, dense cyan and orange dust, dark gaps |
| 6 | Motion check | Gather, flow and word clearing still work; no console errors; typecheck and lint clean |

Not changed (differences that remain): OpenAI draws 12,000 particles from five SVG paths of its own glyph with a path texture; this site keeps its own BridgeWide mark paths and the scroll-driven gather. OpenAI also adds lens flare, dirty glass and a pointer lens; this field keeps its existing drag-to-rotate and pointer nudge.
