# Open Graph image assets

This folder should contain **`default.png`** — the social-share banner used for link previews.

## `default.png` spec

- **Dimensions:** 1200 × 630 px (the standard Open Graph / Twitter `summary_large_image` ratio).
- **File size:** under 1 MB.
- **Content:** the CLSS logo + tagline on a brand-coloured background.
- **Format:** PNG.

## Where it is referenced

`default.png` is wired into the `<head>` of **all 27 pages** in this site via:

- `og:image` → `https://uikishore.github.io/clsslabs-portal/assets/og/default.png`
- `twitter:image` → `https://uikishore.github.io/clsslabs-portal/assets/og/default.png`

(Both also declare `og:image:width=1200`, `og:image:height=630`, and `og:image:alt="CLSS Labs"`.)

## Until the image exists

The `og:image` / `twitter:image` URLs point to a file that is not committed yet, so shared-link
previews (Slack, WhatsApp, LinkedIn, X/Twitter, iMessage, etc.) will fall back to **text only** —
title + description, no banner image. Drop a compliant `default.png` into this folder to enable the
visual preview across every page.
