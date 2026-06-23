# Icon assets — optional PNG/ICO set (for full coverage)

`favicon.svg` (in the repo root) is the primary favicon and works in all
modern browsers — Chrome, Edge, Firefox, Safari 17+. It is referenced from
every page's `<head>` and from `site.webmanifest`.

For **full coverage** (iOS home-screen, older browsers, Android install
prompt, Windows tiles), generate this PNG/ICO set and drop the files where
noted. The fastest way is to upload `favicon.svg` to
https://realfavicongenerator.net and download the package.

| File | Size | Place in | Referenced by |
|------|------|----------|---------------|
| `favicon.ico` | 32×32 (multi-res) | repo root | legacy browsers (auto-requested at /favicon.ico) |
| `apple-touch-icon.png` | 180×180 | repo root | iOS Safari "Add to Home Screen" |
| `icon-192.png` | 192×192 | repo root | `site.webmanifest` (Android install) |
| `icon-512.png` | 512×512 | repo root | `site.webmanifest` (Android splash) |

After adding `apple-touch-icon.png`, also add this line to the shared
`<head>` of every page (next to the existing favicon link):

```html
<link rel="apple-touch-icon" href="apple-touch-icon.png">
```

Until these PNGs exist:
- Desktop + modern-mobile browser tabs already show the SVG favicon. ✓
- iOS home-screen bookmarks fall back to a page screenshot (cosmetic only).
- The manifest's PNG icon entries 404 silently; the SVG entry still works.

Brand spec for any custom icon: rounded square, gradient
`#4F46E5 → #C84BE0 → #FF7A8A`, white "C" + small dot accent (matches the
`CLSS°` wordmark). Theme color `#4F46E5`, background `#F6F7FB`.
