# Premier League — Virtual Stadium

A Vietnamese React + Three.js football stadium simulation prototype inspired by the interaction pattern of the supplied virtual pilgrimage site. It is an original implementation, not a copy of that site's source code or assets.

## Features
- Procedural 3D stadium, striped pitch, goals, multi-tier stands, floodlights and 2,100 instanced crowd figures.
- Random home/away fixture, favorite-club weighting, club picker and stadium name.
- Camera presets (stands, sideline, high, behind goal) plus mouse orbit controls.
- Simulated 90-minute match clock, random commentary events, occasional goals and score overlay.
- Web Audio ambient crowd bed, synthetic whistle/cheer effects, crowd intensity slider and browser Vietnamese speech synthesis.
- Responsive control center, match feed, full-screen mode and audio controls.

## Run locally
Requires Node.js 18+.

```bash
npm install
npm run dev
```
Open the local URL printed by Vite. To create a production build:

```bash
npm run build
npm run preview
```

## Important notes
- The match is an entertainment simulation, not live scores, a real football engine, or a broadcast of Premier League fixtures.
- The crowd is rendered procedurally with instanced low-poly figures for performance. For production-grade realism, replace it with optimized animated GLB crowd loops, LODs, baked lighting and spatial audio.
- Commentary uses the browser's installed Vietnamese speech voice. The generated ambient crowd and effects are synthesized locally; no licensed broadcast audio is included.
- The team roster is a demo data set in `src/data/teams.js`. Update it for the official league lineup of the season you intend to deploy.
- Socket.IO / multiplayer presence is not enabled in this starter. It can be added with a server and shared match state if real multi-user attendance is required.

## Main structure
- `src/App.jsx` — interface, fixture randomization, simulated match state and controls.
- `src/components/Stadium.jsx` — Three.js scene, pitch, stands, lights, ball and camera.
- `src/data/teams.js` — club data and random fixture selection.
- `src/lib/audio.js` — Web Audio effects and speech synthesis.
- `src/styles.css` — responsive visual design.
