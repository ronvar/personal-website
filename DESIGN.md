# DESIGN.md — Workbench

The site belongs to someone who builds software and fixes the things around it:
laptops, networks, a home theater, cars. It should read like a well-kept
workbench or a spec sheet, not a product launch page: warm paper, dark ink,
one signal-orange accent, ruled lines, monospace labels. Left-aligned. Nothing
floats, nothing glows (outside dev mode).

Tokens live in `src/app/globals.css` (CSS variables) and `src/theme/theme.ts`
(Mantine). Components use the variable names, never raw values.

## Color

| Token | Light | Dark | Role |
|---|---|---|---|
| `--paper` | `#f6f3ec` | `#161412` | Page background |
| `--paper-2` | `#ece7dc` | `#1f1c19` | Alternate band, screenshot mats, inputs |
| `--ink` | `#1c1a17` | `#ede7dc` | Headings and body text |
| `--ink-2` | `#57514a` | `#b3ab9e` | Secondary text, descriptions |
| `--ink-3` | `#6f685c` | `#8f877a` | Mono labels, dates, metadata (≥ 4.5:1 on paper) |
| `--rule` | `#d9d2c3` | `#2e2a25` | Hairlines between rows and sections |
| `--rule-strong` | `#1c1a17` | `#ede7dc` | Section top rule, secondary button border |
| `--accent` | `#c2410c` | `#f2772e` | Primary button, link underline, active nav, focus ring, figures |
| `--accent-ink` | `#ffffff` | `#161412` | Text on the accent |
| `--danger` | `#b42318` | `#f97066` | Form errors |
| `--success` | `#2f7a3e` | `#6fcf7f` | Form success |

One accent only. No gradients, no tinted icon squares, no blue.

**Dev mode** redefines the same tokens (black paper, green ink and accent), so
every component follows without special cases.

## Typography

- **Archivo** (variable, `wdth` axis) for everything set in prose. Headings use
  the expanded width (`font-stretch: 125%`) at weight 800 so they look stamped,
  not soft.
- **IBM Plex Mono** for labels, section numbers, dates, tags, nav and buttons.

| Step | Size / line height | Use |
|---|---|---|
| display | `clamp(3rem, 9vw, 6.5rem)` / 0.92 | Name in hero |
| h2 | `clamp(2rem, 4.5vw, 3rem)` / 1.0 | Section titles |
| h3 | 1.375rem / 1.25 | Project and company names |
| lead | 1.25rem / 1.55 | Hero sentence, section intros |
| body | 1.0625rem / 1.65 | Paragraphs, list items |
| small | 0.9375rem / 1.6 | Descriptions in dense rows |
| mono | 0.8125rem / 1.5, `letter-spacing: 0.02em` | Labels, tags, nav, buttons |
| mono-xs | 0.75rem / 1.4 | Footnotes, counters |

Weights: 400 body, 600 h3, 800 display/h2; mono 400 and 500. Prose measure is
capped at 65ch.

## Spacing and layout

- 8px scale: 4, 8, 12, 16, 24, 32, 48, 64, 96.
- Content width 1120px, 24px gutters (16px under 480px).
- Sections: 96px vertical padding on desktop, 64px on phones. Each section opens
  with a 2px `--rule-strong` line, then a two-column header: a mono index on the
  left (`01 / about`) and the h2 on the right. Below 768px it stacks.
- Lists of things (skills, projects, jobs, hobbies) are rows split by 1px
  `--rule` lines, never card grids.

## Shape and depth

- Radius: 2px everywhere (`--radius`). Pills and circles are not used.
- No shadows. Depth comes from rules and the `--paper-2` band.
- Focus: 2px solid `--accent` outline, 3px offset, on every interactive element.

## Components

- **Primary button**: `--accent` fill, `--accent-ink` text, mono 13px uppercase,
  12px × 20px padding. Hover: 8% darker (`filter: brightness(0.92)`). Disabled:
  40% opacity.
- **Secondary button**: transparent, 1px `--rule-strong` border, `--ink` text.
  Hover: `--paper-2` fill.
- **Quiet link**: `--ink` text, 1px `--accent` underline offset 4px; hover turns
  the text `--accent`. External links end with `↗`.
- **Tags**: plain mono text separated by ` / `, in `--ink-3`. Not pills.
- **Figures**: metrics shown as mono `--accent` numbers with a `--ink-3` label.
- **Nav**: `--paper` bar with a bottom `--rule`. Mono lowercase links; the active
  one gets an `--accent` underline. Phones: one row of links under the logo row,
  wrapping instead of scrolling.
- **Inputs**: `--paper-2` fill, 1px `--rule` border, 2px radius; focus border
  `--accent`.
- **Footer**: the contact section doubles as the footer, ending with a mono
  colophon line.

## Imagery and icons

- Real screenshots shown flat on a `--paper-2` mat with a 1px `--rule` border,
  never darkened or overlaid with titles.
- Icons: Tabler, stroke 1.5, only where they carry meaning (theme toggle,
  modal controls, external link). No decorative icon tiles.
- No background animation in the default theme. The falling-binary canvas runs
  only in dev mode, and never when `prefers-reduced-motion` is set.
