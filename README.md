# Tanks for Watching — shop

Static storefront for cherry shrimp and bladder snails. No build step: open `index.html` or serve the folder.

- `index.html` — shell (header, footer, mount points)
- `css/organic.css` — the Organic design-system tokens and components (source of truth for colors, type, radii)
- `css/site.css` — page styles built on those tokens
- `js/app.js` — content (`PRODUCTS`, `PHOTOS`, FAQs, steps), hash routing (`#/`, `#/shop`, `#/product/<id>`), cart (localStorage)
- `img/` — photos referenced from `PHOTOS` in `js/app.js`

## Edit content
Everything editable is at the top of `js/app.js`. Add a photo to `img/`, then point the matching slot id in `PHOTOS` at it.

## Still to wire up
- **Checkout**: the Checkout button is a stub (`case 'checkout'` in `js/app.js`). Connect Stripe Checkout, Shopify Buy Button or similar.
- **Email signup**: shows the confirmation locally but doesn't send the address anywhere yet.
- **Links**: `CHANNEL_URL`, `LATEST_VIDEO_URL`, the Instagram link and `hello@tanksforwatching.com` are placeholders.
- **Photos**: only the hero and cherry shrimp have real photos; other slots show labelled placeholders.

## Deploy
Works as-is on GitHub Pages (Settings → Pages → deploy from `main`, root).
