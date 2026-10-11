# Space Buro Website

Public RU/EN website for Space Buro Technical Services L.L.C-FZ in Dubai:
https://space-buro-website.vercel.app/

## Development and verification

```bash
npm ci
npm run dev
```

Before publishing, run `npm run lint`, `npm run build`, then `npm run verify`.
Verification checks the 20 generated pages, indexing, canonical and language URLs,
sitemap, internal links, fragments and local media.

## Production deployment

The Vercel project builds the repository's `main` branch as a Next.js application
using `npm run build` and the standard Next.js output. Keep the repository root
as the project root. The configuration preserves security headers, legacy
redirects and the original optimized image files.

`app/` contains pages and project data; `public/` contains photos, logos and fonts.
No database or secret environment variables are required. The contact form opens
a prepared WhatsApp message. `NEXT_PUBLIC_MAP_TILE_URL` may optionally configure
a different map provider; the default is OpenStreetMap.

The public origin is defined in `app/site.ts` and shared by canonical metadata,
social previews, structured data, robots and sitemap. Update it together with the
verification script if the primary domain changes.
