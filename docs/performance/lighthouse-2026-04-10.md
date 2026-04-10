# Lighthouse detailed logs (April 10, 2026)

This file keeps the full reviewer-facing Lighthouse notes that were previously in `README.md`.

## Scope

- Public demo URL: `https://social-fitness-platform-next-v4.vercel.app/`
- Audit date: April 10, 2026
- Routes:
  - `/`
  - `/activity`
  - `/friend/friend-list`
  - `/friend/search`
  - `/message`

## Home page (`/`)

### Mobile

- **Performance / Accessibility / Best Practices / SEO**: `83 / 92 / 96 / 63`
- **First Contentful Paint**: `1.4s`
- **Largest Contentful Paint**: `2.4s`
- **Speed Index**: `3.3s`
- **Time to Interactive**: `4.4s`
- **Total Blocking Time**: `530ms`
- **Server Response Time**: `90ms`
- **Cumulative Layout Shift**: `0`

### Desktop

- **Performance / Accessibility / Best Practices / SEO**: `99 / 92 / 96 / 63`
- **First Contentful Paint**: `0.5s`
- **Largest Contentful Paint**: `0.5s`
- **Speed Index**: `1.1s`
- **Time to Interactive**: `1.0s`
- **Total Blocking Time**: `70ms`
- **Server Response Time**: `61ms`
- **Cumulative Layout Shift**: `0`

### Interpretation

- Desktop rendering is already strong (paint, interactivity, and layout stability).
- Remaining mobile cost is mostly post-paint frontend work.
- Main reviewer-facing gaps are asset efficiency, runtime correctness, and accessibility/SEO details.

### Improvement opportunities

- Reduce home-page client-side JavaScript and main-thread work on mobile.
- Optimize oversized images (Supabase-hosted avatar and logo asset).
- Investigate production console error (`Minified React error #418`).
- Reduce DOM size and forced reflow hotspots.
- Fix accessibility issues (low-contrast timestamp text, list semantics).
- Review SEO defaults (`noindex` observed in demo).
- Increase cache lifetime for stable assets and review bfcache blockers.

## Activity page (`/activity`)

### Mobile

- **Performance / Accessibility / Best Practices / SEO**: `93 / 87 / 96 / 63`
- **First Contentful Paint**: `1.1s`
- **Largest Contentful Paint**: `1.7s`
- **Speed Index**: `4.3s`
- **Time to Interactive**: `3.8s`
- **Total Blocking Time**: `234ms`
- **Server Response Time**: `124ms`
- **Cumulative Layout Shift**: `0`

### Desktop

- **Performance / Accessibility / Best Practices / SEO**: `99 / 87 / 96 / 63`
- **First Contentful Paint**: `0.3s`
- **Largest Contentful Paint**: `0.4s`
- **Speed Index**: `1.1s`
- **Time to Interactive**: `0.4s`
- **Total Blocking Time**: `10ms`
- **Server Response Time**: `80ms`
- **Cumulative Layout Shift**: `0`

### Interpretation

- Desktop performance is already strong.
- On mobile, bottlenecks are mostly JS execution and main-thread work after first paint.
- Reviewer-facing issues are now efficiency, accessibility semantics, runtime correctness, and indexability.

### Improvement opportunities

- Investigate shared-bundle runtime error (`Minified React error #418`).
- Reduce mobile main-thread work and JS execution cost.
- Trim unused JavaScript (`~175 KiB` estimate in audit).
- Reduce oversized media (avatar PNG and logo).
- Add accessible names to icon-only category filter links.
- Add accessible label for date range `<select>`.
- Improve contrast for activity timestamp text.
- Review SEO defaults (`noindex` observed).
- Increase cache lifetime for stable media.

## Friend list page (`/friend/friend-list`)

### Mobile

- **Performance / Accessibility / Best Practices / SEO**: `93 / 89 / 100 / 60`
- **First Contentful Paint**: `1.2s`
- **Largest Contentful Paint**: `1.6s`
- **Speed Index**: `4.5s`
- **Time to Interactive**: `2.5s`
- **Total Blocking Time**: `220ms`
- **Server Response Time**: `70ms`
- **Cumulative Layout Shift**: `0`

### Desktop

- **Performance / Accessibility / Best Practices / SEO**: `100 / 90 / 100 / 63`
- **First Contentful Paint**: `0.4s`
- **Largest Contentful Paint**: `0.5s`
- **Speed Index**: `1.1s`
- **Time to Interactive**: `0.5s`
- **Total Blocking Time**: `0ms`
- **Server Response Time**: `80ms`
- **Cumulative Layout Shift**: `0`

### Interpretation

- Route is strong on both mobile and desktop for core speed signals.
- Remaining slowdown on mobile is mostly script-heavy post-paint work.
- Remaining reviewer-facing issues are accessibility semantics and crawlability.

### Improvement opportunities

- Add accessible names to icon-only chat controls and message links.
- Add a `<main>` landmark.
- Reduce mobile main-thread work and post-render client work.
- Trim unused JavaScript (`~254 KiB` mobile, `~255 KiB` desktop estimates).
- Review SEO defaults (`noindex` observed).
- Review cache/bfcache behavior for repeat visits.

## Friend search page (`/friend/search`)

### Mobile

- **Performance / Accessibility / Best Practices / SEO**: `96 / 98 / 100 / 60`
- **First Contentful Paint**: `1.0s`
- **Largest Contentful Paint**: `1.3s`
- **Speed Index**: `2.7s`
- **Time to Interactive**: `2.3s`
- **Total Blocking Time**: `200ms`
- **Server Response Time**: `70ms`
- **Cumulative Layout Shift**: `0`

### Desktop

- **Performance / Accessibility / Best Practices / SEO**: `99 / 98 / 100 / 63`
- **First Contentful Paint**: `0.4s`
- **Largest Contentful Paint**: `0.5s`
- **Speed Index**: `1.4s`
- **Time to Interactive**: `0.5s`
- **Total Blocking Time**: `0ms`
- **Server Response Time**: `70ms`
- **Cumulative Layout Shift**: `0`

### Interpretation

- Route is already fast and stable.
- Mobile bottleneck is primarily post-paint JavaScript work.
- Remaining issues are semantics, payload efficiency, cache policy, and crawlability.

### Improvement opportunities

- Add a `<main>` landmark.
- Reduce mobile main-thread work and post-render client work.
- Trim unused JavaScript (`~192 KiB` mobile, `~173 KiB` desktop estimates).
- Review large shared bundles called out by audit.
- Reduce oversized images and improve avatar delivery.
- Review SEO defaults (`noindex` observed).
- Increase cache lifetime for stable avatar assets (`~292 KiB` repeat-visit savings estimate).

## Message page (`/message`)

### Mobile

- **Performance / Accessibility / Best Practices / SEO**: `88 / 97 / 100 / 60`
- **First Contentful Paint**: `1.2s`
- **Largest Contentful Paint**: `2.1s`
- **Speed Index**: `3.6s`
- **Time to Interactive**: `3.8s`
- **Total Blocking Time**: `380ms`
- **Server Response Time**: `70ms`
- **Cumulative Layout Shift**: `0`

### Desktop

- **Performance / Accessibility / Best Practices / SEO**: `99 / 97 / 100 / 63`
- **First Contentful Paint**: `0.3s`
- **Largest Contentful Paint**: `0.5s`
- **Speed Index**: `1.3s`
- **Time to Interactive**: `0.5s`
- **Total Blocking Time**: `0ms`
- **Server Response Time**: `80ms`
- **Cumulative Layout Shift**: `0`

### Interpretation

- Desktop route is very fast and stable.
- Mobile bottlenecks are primarily JavaScript execution and main-thread work after first paint.
- Remaining reviewer-facing issues are conversation-list semantics, image delivery, caching, and crawlability.

### Improvement opportunities

- Add a `<main>` landmark.
- Fix heading hierarchy in conversation list.
- Reduce oversized media (avatar PNG and logo asset).
- Improve avatar format/compression and responsive sizing.
- Reduce mobile main-thread work and route-level script cost (`~178 KiB` estimated savings in this mobile run).
- Trim unused JavaScript (`~160 KiB` desktop estimate).
- Review SEO defaults (`noindex` observed).
- Increase cache lifetime and review bfcache blockers (`no-store`, WebSocket usage).

## Notes

- These results are intended as reviewer-facing guidance, not a strict reproducible lab baseline.
- Browser extensions, network state, and deployment headers can affect final scores.
