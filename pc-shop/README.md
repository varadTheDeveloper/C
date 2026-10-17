# Computer Warehouse Jalna – website

Plain HTML, CSS and JavaScript. No build step, no server code.

## Run it on your computer

```sh
cd pc-shop
python3 -m http.server 8000
```

Then open http://localhost:8000. (Opening `index.html` directly won't load the products,
because browsers block reading files that way.)

## Pages

| Page | File |
|---|---|
| Home | `index.html` |
| All products, categories, filters, search | `products.html` (e.g. `products.html?cat=laptops`) |
| Build my PC form (sends to WhatsApp) | `build.html` |
| Repair form (sends to WhatsApp) | `repair.html` |

Header, footer, phone bottom bar and the quote list are shared: `assets/js/layout.js`.

You can also open `index.html` straight from the folder (double-click); the sample products still load.

## Where to change things

| What | File |
|---|---|
| WhatsApp number, phones, map, Instagram, brands, offer banner on/off | `assets/js/config.js` |
| All text in Marathi, Hindi and English | `assets/js/i18n.js` |
| Colours and layout | `assets/css/style.css` |
| Product photos | `assets/products/` (sources in `SOURCES.md`) |
| Products | the shop's Google Sheet (link goes in `productsCsvUrl` in `config.js`) |

Until the Google Sheet link is set, the site shows `data/sample-products.csv`.

## Product sheet columns

`id, name, category, brand, specs, warranty, stock, condition, offer, featured, image`

- `category`: laptops, open-box, pc-setups, printers, parts, monitors, accessories
- `specs`: separate lines with `|`
- `stock`: in, order, out
- `condition`: new, open-box
- `offer`, `featured`: yes or no
- `image`: Google Drive share link (optional)

There are no price columns on purpose. Prices are sent on WhatsApp.

## Fonts

Inter and Noto Sans Devanagari are hosted in `assets/fonts` (SIL Open Font License, see the `OFL-*.txt` files).
