/*
 * Loads products from the shop's Google Sheet (published as CSV).
 * Columns: id, name, category, brand, specs, warranty, stock, condition, offer, featured, image
 *   category:  laptops | open-box | pc-setups | printers | parts | monitors | accessories
 *   stock:     in | order | out
 *   condition: new | open-box
 *   offer, featured: yes | no
 *   image:     a Google Drive share link or any image link (optional)
 * There are no price columns on purpose: prices are sent on WhatsApp.
 */
(function () {
  function parseCsv(text) {
    var rows = [], row = [], field = "", inQuotes = false;
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (inQuotes) {
        if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
        else if (c === '"') { inQuotes = false; }
        else { field += c; }
      } else if (c === '"') { inQuotes = true; }
      else if (c === ",") { row.push(field); field = ""; }
      else if (c === "\n" || c === "\r") {
        if (c === "\r" && text[i + 1] === "\n") i++;
        row.push(field); rows.push(row); row = []; field = "";
      } else { field += c; }
    }
    if (field !== "" || row.length) { row.push(field); rows.push(row); }
    return rows.filter(function (r) { return r.some(function (v) { return v.trim() !== ""; }); });
  }

  // Turns a Google Drive "share" link into a link that works in <img>
  function driveToImage(url) {
    if (!url) return "";
    var m = url.match(/drive\.google\.com\/file\/d\/([^/]+)/) || url.match(/[?&]id=([^&]+)/);
    return m ? "https://drive.google.com/thumbnail?id=" + m[1] + "&sz=w800" : url.trim();
  }

  function yes(v) { return /^(yes|y|true|1|हो|हां)$/i.test((v || "").trim()); }

  function toProducts(rows) {
    if (!rows.length) return [];
    var head = rows[0].map(function (h) { return h.trim().toLowerCase(); });
    return rows.slice(1).map(function (r) {
      var o = {};
      head.forEach(function (h, i) { o[h] = (r[i] || "").trim(); });
      return {
        id: o.id || o.name,
        name: o.name,
        category: (o.category || "").toLowerCase(),
        brand: o.brand,
        specs: o.specs ? o.specs.split(/\s*\|\s*/) : [],
        warranty: o.warranty,
        stock: (o.stock || "in").toLowerCase(),
        condition: (o.condition || "new").toLowerCase(),
        offer: yes(o.offer),
        featured: yes(o.featured),
        image: driveToImage(o.image),
        source: o.source || ""
      };
    }).filter(function (p) { return p.name; });
  }

  var cache = null;

  function load() {
    if (cache) return cache;
    var url = SHOP.productsCsvUrl || SHOP.sampleCsvUrl;
    var sample = !SHOP.productsCsvUrl && window.SAMPLE_CSV;
    // Opened by double-click (file://): browsers block fetch, so use the JS copy of the sample list
    var text = sample && location.protocol === "file:"
      ? Promise.resolve(sample)
      : fetch(url, { cache: "no-cache" })
        .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.text(); })
        .catch(function (e) { if (sample) return sample; throw e; });
    cache = text.then(function (t) { return toProducts(parseCsv(t)); });
    return cache;
  }

  window.Products = {
    load: load,
    isSample: function () { return !SHOP.productsCsvUrl; }
  };
})();
