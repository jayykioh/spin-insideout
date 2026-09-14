# Findings

- Workspace was empty at project start.
- A local-only implementation cannot prevent the same phone number from spinning on another device; it can enforce both keys only on the current browser.
- Listed probabilities total 99.996666...% because 1/150 is more precise than the displayed 0.67%; the no-prize probability must absorb the remainder.
- Current Motion guidance supports declarative animation, `AnimatePresence`, and `useReducedMotion`; wheel rotation should animate a wrapper instead of SVG internals.
- Current Vite guidance uses root `index.html`, `@vitejs/plugin-react`, and a typecheck followed by `vite build`.
- React guidance favors deriving values during render and keeping effect callbacks synchronous with cleanup.
