# MSF Fusion Brand Guidelines

## Brand reference

`branding/source/msf-fusion-brand-board.png` is the official visual reference supplied for MSF Fusion (Mustafa AI Software Factory — Fusion Framework). The mark combines a structured fusion form, a central spark, and interlocking geometry to communicate convergence, precision, and compiler-assisted composition.

The supplied board is a raster board containing several lockups. The repository assets are conservative crops from that board; no logo redesign or redraw was performed.

## Official colors

| Name | Hex | Primary use |
| --- | --- | --- |
| Deep Graphite | `#0B1720` | wordmark, dark surfaces, high-contrast ink |
| Deep Teal | `#0A7F7A` | supporting brand color |
| Electric Cyan | `#00D9FF` | energy, links, active accents |
| Mint Accent | `#00FFA3` | highlight and positive accent |
| Light Background | `#E6EEF2` | light surfaces and presentation backgrounds |

These values are the palette declared on the supplied board and are used as the canonical tokens for product and documentation work.

## Usage rules

- Keep the supplied proportions and do not stretch, skew, rotate, or redraw the mark.
- Preserve a clear space around the mark of at least the height of the central spark (or 10% of the logo width, whichever is larger).
- Use the dark lockup on dark graphite/teal surfaces and the light lockup on light backgrounds.
- For favicons and app icons, use the independent symbol; do not reduce the full wordmark until it becomes illegible.
- Minimum recommended full-lockup width: 180 px on screen; minimum symbol size: 16 px, with 32 px preferred.

## Contexts

- **GitHub:** use `branding/logo/msf-fusion-logo.png` at the top of the README; use the symbol icons for repository and package metadata.
- **Documentation:** use the light or dark crop according to the page surface, with the safe area preserved.
- **Website and DevTools:** prefer the independent symbol for compact navigation and the full lockup for mastheads or landing surfaces.

## Do not

- Do not change the logo colors, apply gradients not present in the reference, add shadows, or place it inside an unapproved container.
- Do not crop into the mark, remove the spark, alter the wordmark, or combine it with third-party logos or emoji.
- Do not use the empty SVG as a substitute for the PNG. It is a valid placeholder documenting that accurate vector path extraction has not yet been completed; an actual vector rebuild should be reviewed against the source board before adoption.

## Asset notes

The source board is RGB PNG at 1254×1254. Because it is a composed brand board rather than layered source artwork, the repository does not claim a true vector reconstruction. Crops retain the original raster detail and are exported at the requested icon sizes with high-quality resampling.
