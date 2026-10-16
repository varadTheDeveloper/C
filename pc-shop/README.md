# Computer Warehouse Jalna – website

Plain HTML, CSS and JavaScript. No build step, no server code.

## Run it on your computer

```sh
cd pc-shop
python3 -m http.server 8000
```

Then open http://localhost:8000. (Opening `index.html` directly won't load the products,
because browsers block reading files that way.)

## Where to change things

| What | File |
|---|---|
| WhatsApp number, phones, map, Instagram, brands, offer banner on/off | `assets/js/config.js` |
| All text in Marathi, Hindi and English | `assets/js/i18n.js` |
| Colours and layout | `assets/css/style.css` |
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

Teko and Mukta are hosted in `assets/fonts` (SIL Open Font License, see the `OFL-*.txt` files).
