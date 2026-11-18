# Balamurugan Loganathan — Portfolio V3.2 (3D Edition)

Dark, 3D, data-themed portfolio. Static HTML/CSS/JS — works on GitHub Pages as-is.

## Highlights
- **Three.js particle "data universe"** in the background that morphs as you scroll: globe → 3D bar chart → helix → data wave → galaxy
- Loading counter (0 → 100) with a reveal
- 3D portrait stage with orbiting skill chips, mouse-follow tilt and light sheen
- **3D rotating project ring**: drag, swipe, use the arrows or keys; the detail panel updates with the front card
- A hanging ID badge that swings in the About section
- 3D tag sphere for skills, plus a logo marquee
- Flip cards for education, tilt cards, magnetic buttons
- **3D skill cube** — one face per resume skill category; drag it or pick a tab
- **Exploded tech-stack layers** for each project (hover to pull the layers apart)
- **Certificate deck** that fans out in 3D
- **3D resume sheet** with floating section labels
- Section titles fold up in 3D as they scroll in
- Contact form that opens a pre-filled email (no backend needed)

## Performance
- 3D shape morphing runs on the GPU (shader), canvas renders at ~70% resolution
- No backdrop-blur on cards, no animated CSS blur, no reflections
- One shared animation loop; carousel, sphere and hero pause when off-screen
- **3D toggle** in the nav (Lite mode) — remembered per visitor; off by default on very low-end devices and for "reduce motion" users

## Structure
```
index.html
style.css
script.js
Balamurugan_Resume.pdf
assets/  profile.jpg, logo.png, uow.png, karpagam.png,
         hdb-dashboard.png, sg-transport.png, resume-preview.jpg
```

## Edit content
All content comes from the resume. Projects, cube faces, sphere tags and marquee logos are arrays at the top of `script.js` (`PROJECTS`, `SKILL_FACES`, `SPHERE_TAGS`, `MARQUEE`). If you update the resume PDF, re-export `assets/resume-preview.jpg` from page 1.

## Deploy
Replace the files in the repo root with these files, commit and push. GitHub Pages serves `index.html`.
