# Deploy: boringstack.xyz on Cloudflare Pages

The site in `.github/` is an [Astro Starlight](https://starlight.astro.build) docs site. It builds to static files, deploys to [Cloudflare Pages](https://pages.cloudflare.com), and is served at https://boringstack.xyz.

This file documents the wire-up so future-you (or a teammate) can rebuild it from scratch if needed.

## One-time setup

1. **Cloudflare account.** Use the same one that owns the `boringstack.xyz` DNS zone.

2. **Create a Pages project.**
   - Cloudflare dashboard → Workers & Pages → Create application → Pages → Connect to Git.
   - Authorize the `AI-Starter-Templates` GitHub org.
   - Select the `.github` repository.
   - Project name: `boringstack-docs` (becomes the `*.pages.dev` subdomain).

3. **Build settings.**

   | Setting | Value |
   |---|---|
   | Production branch | `main` |
   | Framework preset | Astro |
   | Build command | `pnpm build` |
   | Build output directory | `dist` |
   | Root directory | `/` |
   | Node version | `22` (via `.nvmrc`) |
   | Environment variables | _(none)_ |

4. **Custom domain.**
   - Pages project → Custom domains → Set up a custom domain → `boringstack.xyz`.
   - Cloudflare auto-creates the DNS CNAME (zone is already on Cloudflare).
   - Cert is provisioned automatically; usually live in under a minute.
   - Add `www.boringstack.xyz` the same way if desired (redirect handled in the CF dashboard).

## Build locally

```bash
cd .github
pnpm install
pnpm dev       # local preview at http://localhost:4321
pnpm build     # produces dist/
pnpm preview   # serves dist/ at http://localhost:4321
```

The build runs Pagefind automatically (Starlight bundles it), so search works on the built site too.

## How deploys work

- Push to `main` → Cloudflare Pages auto-builds and deploys to production.
- Pushes to other branches → preview deployment at `<branch>.boringstack-docs.pages.dev`.
- PRs from forks get preview deployments too (CF Pages comments the URL on the PR).
- Rollback: Pages dashboard → Deployments → pick a previous deployment → Rollback.

## Notes

- **No CNAME file.** Unlike GitHub Pages, Cloudflare Pages binds the custom domain via the dashboard, not via a `public/CNAME` file. Adding one would just serve `/CNAME` as text.
- **Sitemap.** Astro's `@astrojs/sitemap` is not installed; Starlight's Pagefind index plus the sidebar is the primary nav. Add `@astrojs/sitemap` if you start running SEO campaigns.
- **Analytics.** Not wired up. If you add Cloudflare Web Analytics later, drop the `<script>` into `astro.config.mjs` via Starlight's `head` option.
