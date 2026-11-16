# Astra star field: WebGL fallback and lifecycle

The star field after the footer (`src/components/home/AstraField.tsx`) is WebGL. This is what it does when WebGL is missing, goes away, or nobody is looking.

## When WebGL is not there

Two things are checked, both after three.js has loaded:

1. `canCreateWebgl` (`src/lib/astra-webgl.ts`) makes a throwaway canvas and asks for a WebGL 2 context, then WebGL 1. Any failure counts as no (a blocked GPU, a disabled setting, a canvas or `getContext` that throws). A context it makes is handed straight back with `WEBGL_lose_context`, because browsers cap how many live contexts a page may hold.
2. A `catch` on the whole load chain covers three.js failing to load or the renderer throwing while it is made.

Either way the component sets a `fallback` flag and the stage shows `AstraStaticDust` instead of the canvas.

### The still sky

`AstraStaticDust` draws 240 soft dots with CSS radial gradients, from a fixed seed, so the server and client agree and every visit shows the same sky. It uses the same `dustLook` as the live field (mostly tiny dots, a few larger ones, the same palette) and draws **no mark** and no animation, so the section never looks half-broken.

- The dots are drawn brighter than the live field (opacity x1.7, radius 0.7x the star's size). The live field adds its stars together and blooms them; CSS dots do not.
- The words "Bridge" and "Wide" stay on top, and the section's `aria-label` stops promising a mark that is not there.
- The layer carries `data-astra-fallback="static-dust"` so tests can find it.

## When the tab is hidden or the section is off screen

`shouldRun({ inView, tabVisible, contextLive })` decides whether the render loop runs: all three must be true. `AstraField` keeps one `runState`, updated by:

- the `IntersectionObserver` on the section (`inView`);
- a `visibilitychange` listener on the document (`tabVisible`);
- the context events below (`contextLive`).

Each change calls `sync()`, which starts or stops the loop. Returning to the tab restarts it through the same `start()`, which resets the frame clock, so there is no jump.

## When the WebGL context is lost

A GPU reset, memory pressure or a driver update can lose the context.

- `webglcontextlost`: call `preventDefault()` so the browser may restore the context, mark it not live and stop the loop. A timer of `CONTEXT_RESTORE_MS` (3 s) starts.
- `webglcontextrestored`: clear the timer, mark it live and restart the loop. three.js rebuilds its own GL state on restore, and its listeners were added before ours, so they run first.
- No restore in time: release the GPU resources and show the still sky.

The timer and both listeners are removed in cleanup. The timer swaps `cleanup` for a no-op before running it, so unmounting afterwards does not dispose twice.

## Tests

- `src/lib/astra-webgl.test.ts`: `canCreateWebgl` with fakes (both versions, the fallback order, no canvas, throwing factories and contexts, handing the context back) and `shouldRun` (each condition, exactly one of the eight combinations runs).
- `src/lib/astra-static-dust.test.ts`: determinism, the seed, the count, the bounds, the palette, the size mix, the brightness, the exact CSS for a dot.
- `e2e/astra-fallback.spec.ts` (Playwright): with WebGL disabled the stage shows the still sky and both words with no script error; a context lost and restored keeps the live canvas; a context lost and never restored falls back.

The hidden-tab pause was also checked by hand in headless Chromium: the loop's frame requests stop the moment the tab is marked hidden and resume when it is visible again.
