# The website is hosted on Vercel, public but unlisted

The site deploys to Vercel (Hobby plan) as the project `wings-of-freedom` through the Git integration on this private repository, with `site/` as the project's root directory and files outside it included so the build can read `data/` and `docs/rules/`. An ignored build step skips any commit that touches none of `site/`, `data/`, or `docs/rules/`, so Foundry and design commits never build the site. Work happens on a `site` branch with pull requests, whose preview URLs Vercel Authentication protects; `main` is production. The production site is public but unlisted: every page sends `noindex`, `robots.txt` disallows all crawlers, and nothing links to it. It is hard to find, not secret, which fits a private fan project shared with a play group.

## Considered Options

- GitHub Pages from this repository: rejected, because Pages on a private repository needs a paid plan and exposes the same public site; the owner moved to Vercel, where credentials were already set up.
- GitHub Pages from a separate public repository holding only the build: superseded by the move to Vercel.
- Cloudflare Pages behind Cloudflare Access: rejected as more setup than a play group needs.
- Vercel password protection: rejected; it needs the Pro plan and a paid add-on. A shared-password routing middleware on Hobby stays available if a gate is ever wanted.
- A Claude Artifact as the site: rejected for a multi-page compendium; Artifacts are used for the design concepts only.
