# Deploy to Cloudflare Pages

Endpoint: **https://mach-dien.pages.dev/**

## Quick deploy with wrangler

```bash
cd /Users/huyntq/Documents/ev/mach-dien
pnpm build
pnpm dlx wrangler pages deploy dist --project-name=mach-dien
```

First-time setup: `pnpm dlx wrangler login` opens browser to authenticate.

## Dashboard setup (one-time)

1. https://dash.cloudflare.com → **Workers & Pages** → **Create application** → **Pages**
2. **Connect to Git** → pick `Techcoop-vn/mach-dien`
3. **Build settings**:
   - Build command: `pnpm build`
   - Build output directory: `dist`
   - Root directory: *(leave blank)*
   - Environment variables: *(none needed)*
4. **Save and Deploy** — first deploy ~2 min, then auto-deploys on every push to `main`.

## Project structure for Cloudflare Pages

- `dist/` — build output (committed via `pnpm build`, not to git)
- `public/_redirects` — SPA fallback: `/* /index.html 200` (all routes → React)
- `public/manifest.json` + `public/sw.js` + `public/icons/` — PWA assets
- `public/brand/` + `public/svg/` — static images (schematics, logos)
- `index.html` — Vite entry, contains theme-color + apple-touch-icon meta

## Notes

- pnpm v12.3.4 + pnpm-workspace.yaml; Cloudflare auto-detects pnpm
- `.npmrc` has `ignore-scripts=false` so esbuild native binary installs
- Build: 1886 modules, 393 kB JS / 37 kB CSS (gzip 118/7.2 kB)
- All assets cached by service worker after first visit → works offline
- PWA installable on iPhone: Safari → Share → "Add to Home Screen"
