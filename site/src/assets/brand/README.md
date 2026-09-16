# Brand sources

Brand art that the site does not serve. `brand-wordmark.webp` is the wordmark printed in
iron-gall ink, for paper grounds: it builds `public/og.jpg` (see `design/art-style.md`) and
is kept here so the card can be rebuilt. It is deliberately not in `assets/icons/`, whose
contents `IconSlot.astro` globs eagerly and ships whole.

The marks the site does serve live in `assets/icons/`: `brand-emblem.webp` and
`brand-wordmark-light.webp`, the wordmark in parchment ink for the cloth masthead.
