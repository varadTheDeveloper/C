/*
 * Shared page setup: language switch, icons, WhatsApp links, shop details,
 * plus the home page sections (categories, featured products).
 */
(function () {
  var t = function (k, v) { return i18n.t(k, v); };
  var esc = function (s) { return Quote.esc(s); };

  var CATEGORIES = ["laptops", "open-box", "pc-setups", "printers", "parts", "monitors", "accessories", "repair"];

  function catHref(c) {
    return c === "repair" ? "repair.html" : "products.html?cat=" + c;
  }

  function fillIcons() {
    document.querySelectorAll("[data-icon]").forEach(function (el) {
      var name = el.getAttribute("data-icon");
      el.innerHTML = name === "whatsapp" ? ICONS.whatsapp : name === "mark" ? ICONS.mark : ICONS.get(name, el.getAttribute("data-size") || 24);
    });
  }

  function fillWhatsApp() {
    document.querySelectorAll("[data-wa]").forEach(function (a) {
      a.href = Quote.waLink(t(a.getAttribute("data-wa")));
      a.target = "_blank";
      a.rel = "noopener";
    });
  }

  function fillShop() {
    document.querySelectorAll("[data-rating]").forEach(function (el) {
      el.textContent = t("rating", { r: SHOP.map.rating, n: SHOP.map.reviews });
    });
    document.querySelectorAll("[data-place-link]").forEach(function (a) { a.href = SHOP.map.placeUrl; });
    document.querySelectorAll("[data-directions]").forEach(function (a) {
      a.href = "https://www.google.com/maps/dir/?api=1&destination=" + SHOP.map.lat + "," + SHOP.map.lng;
    });
    document.querySelectorAll("[data-map]").forEach(function (f) {
      f.src = "https://maps.google.com/maps?q=" + SHOP.map.lat + "," + SHOP.map.lng + "&z=17&output=embed";
    });
    var phones = document.getElementById("phones");
    if (phones) {
      phones.innerHTML = SHOP.phones.map(function (p) {
        return '<li><a class="phone-link" href="tel:+91' + p.number + '">' +
          '<span class="phone-num">' + p.number.replace(/(\d{5})(\d{5})/, "$1 $2") + "</span>" +
          '<span class="phone-name">' + esc(p.name) + "</span></a></li>";
      }).join("");
    }
    var brands = document.getElementById("brands");
    if (brands) {
      brands.innerHTML = SHOP.brands.map(function (b) { return "<li>" + esc(b) + "</li>"; }).join("");
    }
    var insta = document.querySelectorAll("[data-insta]");
    insta.forEach(function (a, i) { a.href = SHOP.instagram[i] || SHOP.instagram[0]; });
    var offer = document.getElementById("offer");
    if (offer) offer.hidden = !SHOP.offer.show;
  }

  function renderCategories() {
    var grid = document.getElementById("categories");
    if (!grid) return;
    grid.innerHTML = CATEGORIES.map(function (c) {
      return '<li><a class="cat" href="' + catHref(c) + '">' +
        '<span class="cat-icon">' + ICONS.get(c, 30) + "</span>" +
        '<span class="cat-name">' + esc(t("cat_" + c)) + "</span></a></li>";
    }).join("");
  }

  function stockLabel(s) {
    return { in: t("stock_in"), order: t("stock_order"), out: t("stock_out") }[s] || t("stock_in");
  }

  function card(p, sample) {
    var inList = Quote.has(p.id);
    var media = p.image
      ? '<img src="' + esc(p.image) + '" alt="" loading="lazy">'
      : '<span class="card-icon">' + ICONS.get(p.category, 56) + "</span>";
    return '<li class="card">' +
      '<div class="card-media">' + media +
      '<div class="tags">' +
      (p.condition === "open-box" ? '<span class="tag tag-box">' + esc(t("cond_open")) + "</span>" : "") +
      (p.offer ? '<span class="tag tag-offer">' + esc(t("badge_offer")) + "</span>" : "") +
      "</div></div>" +
      '<div class="card-body">' +
      (p.brand ? '<p class="card-brand">' + esc(p.brand) + "</p>" : "") +
      '<h3 class="card-name">' + esc(p.name) + "</h3>" +
      (p.specs.length ? '<ul class="card-specs">' + p.specs.slice(0, 4).map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "</ul>" : "") +
      '<p class="card-meta">' +
      '<span class="stock stock-' + esc(p.stock) + '">' + esc(stockLabel(p.stock)) + "</span>" +
      (p.warranty ? '<span class="warranty">' + esc(t("warranty")) + ": " + esc(p.warranty) + "</span>" : "") +
      "</p>" +
      (sample ? '<p class="sample-note">' + esc(t("sample_note")) + "</p>" : "") +
      '<div class="card-foot">' +
      '<span class="price-wa">' + ICONS.whatsapp + esc(t("price_on_wa")) + "</span>" +
      '<button type="button" class="btn btn-small' + (inList ? " is-added" : "") + '" data-add="' + esc(p.id) + '"' +
      (p.stock === "out" ? " disabled" : "") + ">" +
      esc(inList ? t("added") : t("add_quote")) + "</button>" +
      "</div></div></li>";
  }

  var featured = [];

  function renderFeatured() {
    var grid = document.getElementById("featured");
    if (!grid) return;
    var sample = Products.isSample();
    grid.innerHTML = featured.map(function (p) { return card(p, sample); }).join("");
  }

  function loadFeatured() {
    var grid = document.getElementById("featured");
    if (!grid) return;
    grid.addEventListener("click", function (e) {
      var b = e.target.closest("[data-add]");
      if (!b) return;
      var p = featured.filter(function (x) { return x.id === b.getAttribute("data-add"); })[0];
      if (p) Quote.add(p);
    });
    Products.load().then(function (all) {
      featured = all.filter(function (p) { return p.featured && p.stock !== "out"; }).slice(0, 6);
      // Keep full rows on the 3-column desktop grid (3 or 6 cards)
      if (featured.length > 3) featured = featured.slice(0, Math.floor(featured.length / 3) * 3);
      renderFeatured();
    }).catch(function () {
      document.getElementById("featured-section").hidden = true;
    });
  }

  function refreshText() {
    fillWhatsApp();
    fillShop();
    renderCategories();
    renderFeatured();
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-lang]").forEach(function (b) {
      b.addEventListener("click", function () { i18n.set(b.getAttribute("data-lang")); });
    });
    i18n.apply();
    fillIcons();
    Quote.init();
    refreshText();
    loadFeatured();
    var y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  });

  document.addEventListener("langchange", refreshText);
  document.addEventListener("quotechange", renderFeatured);
})();
