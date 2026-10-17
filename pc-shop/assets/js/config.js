/*
 * Shop settings. Change things here, not in the page code.
 */
window.SHOP = {
  name: "Computer Warehouse Jalna",

  // WhatsApp number that receives quote requests (country code, no + or spaces)
  whatsapp: "919307570781",

  // Phone numbers shown on the site (from the shop signboard)
  phones: [
    { name: "Amol Jagtap", number: "9307570781" },
    { name: "Krushna Jagtap", number: "8888479687" }
  ],

  // Google Maps listing
  map: {
    lat: 19.8394922,
    lng: 75.8820408,
    placeUrl: "https://maps.google.com/?cid=4897079765035030415",
    rating: "4.9",
    reviews: 284
  },

  instagram: [
    "https://www.instagram.com/computer_warehouse_jalna/",
    "https://www.instagram.com/computer_warehouse02/"
  ],

  // Products: paste the Google Sheet "Publish to web > CSV" link here.
  // While it is empty, the site uses data/sample-products.csv.
  productsCsvUrl: "",
  sampleCsvUrl: "data/sample-products.csv",

  // Festival offer banner on the home page. Set show to false to hide it.
  // The text for each language is in i18n.js (offer_title, offer_body).
  offer: { show: true },

  // Real photos for the category tiles (assets/products/...)
  categoryImages: {
    laptops: "assets/products/hp-15s.jpg",
    "pc-setups": "assets/products/msi-mag-forge-100r.jpg",
    printers: "assets/products/canon-pixma-g3012.jpg",
    "open-box": "assets/products/apple-mac-mini.jpg",
    monitors: "assets/products/msi-g244f.jpg",
    parts: "assets/products/rtx-5060.jpg",
    accessories: "assets/products/zebronics-keyboard-mouse.jpg",
    repair: "assets/products/hp-pavilion-14.jpg"
  },

  // Brands on the signboard
  brands: [
    "Apple", "HP", "Dell", "ASUS", "Lenovo", "MSI", "Acer", "Samsung",
    "Microsoft", "Gigabyte", "Intel", "Zebronics", "Epson", "Fingers",
    "Canon", "Brother"
  ]
};
