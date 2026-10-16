/*
 * Home page: categories, banner slider, product rows, search, shop details.
 */
(function () {
  var t = function (k, v) { return i18n.t(k, v); };
  var esc = function (s) { return Quote.esc(s); };

  var CATEGORIES = ["laptops", "pc-setups", "printers", "open-box", "monitors", "parts", "accessories", "repair"];
  var products = [];

  function catHref(c) { return c === "repair" ? "repair.html" : "products.html?cat=" + c; }

  /* ---------- small fills ---------- */
  function fillIcons(root) {
    (root || document).querySelectorAll("[data-icon]").forEach(function (el) {
      var name = el.getAttribute("data-icon");
      el.innerHTML = name === "whatsapp" ? ICONS.whatsapp : name === "mark" ? ICONS.mark : ICONS.get(name, el.getAttribute("data-size") || 24);
    });
    (root || document).querySelectorAll("[data-art]").forEach(function (el) {
      el.innerHTML = ART.make(el.getAttribute("data-art"), el.getAttribute("data-seed"));
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
      if (!f.src) f.src = "https://maps.google.com/maps?q=" + SHOP.map.lat + "," + SHOP.map.lng + "&z=17&output=embed";
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
    if (brands) brands.innerHTML = SHOP.brands.map(function (b) { return "<li>" + esc(b) + "</li>"; }).join("");
    document.querySelectorAll("[data-insta]").forEach(function (a) { a.href = SHOP.instagram[0]; });
    var offer = document.getElementById("offer");
    if (offer && !SHOP.offer.show) offer.remove();
  }

  /* ---------- categories ---------- */
  function renderCategories() {
    var row = document.getElementById("categories");
    if (row) {
      row.innerHTML = CATEGORIES.map(function (c) {
        return '<li><a class="cat" href="' + catHref(c) + '">' +
          '<span class="cat-art cat-' + c + '">' + ART.make(c, "cat-" + c) + "</span>" +
          '<span class="cat-name">' + esc(t("cat_" + c)) + "</span></a></li>";
      }).join("");
    }
    var foot = document.getElementById("footer-cats");
    if (foot) {
      foot.innerHTML = CATEGORIES.map(function (c) {
        return '<li><a href="' + catHref(c) + '">' + esc(t("cat_" + c)) + "</a></li>";
      }).join("");
    }
  }

  /* ---------- product card ---------- */
  function stockLabel(s) {
    return { in: t("stock_in"), order: t("stock_order"), out: t("stock_out") }[s] || t("stock_in");
  }

  function shortSpecs(p) {
    return p.specs.slice(0, 3).join(", ");
  }

  function addControl(p) {
    if (p.stock === "out") return '<span class="sold-out">' + esc(t("stock_out")) + "</span>";
    var q = Quote.qty(p.id);
    if (!q) {
      return '<button type="button" class="add-btn" data-add="' + esc(p.id) + '" aria-label="' + esc(t("add_quote") + ": " + p.name) + '">' + esc(t("add")) + "</button>";
    }
    return '<div class="stepper" role="group" aria-label="' + esc(t("q_qty") + ": " + p.name) + '">' +
      '<button type="button" data-step="-1" data-id="' + esc(p.id) + '" aria-label="−">' + ICONS.get("minus", 16) + "</button>" +
      "<output>" + q + "</output>" +
      '<button type="button" data-step="1" data-id="' + esc(p.id) + '" aria-label="+">' + ICONS.get("plus", 16) + "</button></div>";
  }

  function card(p) {
    var media = p.image
      ? '<img src="' + esc(p.image) + '" alt="" loading="lazy">'
      : ART.make(p.category, p.id);
    return '<li class="card" data-card="' + esc(p.id) + '">' +
      '<div class="card-media">' + media +
      '<div class="tags">' +
      (p.offer ? '<span class="tag tag-offer">' + esc(t("badge_offer")) + "</span>" : "") +
      (p.condition === "open-box" ? '<span class="tag tag-box">' + esc(t("cond_open")) + "</span>" : "") +
      "</div>" +
      (Products.isSample() ? '<span class="tag tag-sample" title="' + esc(t("sample_note")) + '">' + esc(t("sample_badge")) + "</span>" : "") +
      "</div>" +
      '<div class="card-body">' +
      '<p class="card-brand">' + esc(p.brand || " ") + "</p>" +
      '<h3 class="card-name">' + esc(p.name) + "</h3>" +
      '<p class="card-specs">' + esc(shortSpecs(p)) + "</p>" +
      '<p class="card-stock stock-' + esc(p.stock) + '">' + esc(stockLabel(p.stock)) +
      (p.warranty ? '<span class="card-warranty">' + esc(t("warranty")) + " " + esc(p.warranty) + "</span>" : "") + "</p>" +
      '<div class="card-foot">' +
      '<span class="price-wa">' + ICONS.whatsapp + "<span>" + esc(t("price_on_wa")) + "</span></span>" +
      '<span class="card-add">' + addControl(p) + "</span>" +
      "</div></div></li>";
  }

  function byId(id) { return products.filter(function (p) { return p.id === id; })[0]; }

  function handleCardClick(e) {
    var a = e.target.closest("[data-add]");
    var s = e.target.closest("[data-step]");
    if (a) { var p = byId(a.getAttribute("data-add")); if (p) Quote.add(p); }
    if (s) { var id = s.getAttribute("data-id"); Quote.setQty(id, Quote.qty(id) + Number(s.getAttribute("data-step"))); }
  }

  // Update only the add buttons when the quote changes, so rows don't jump
  function refreshAddControls() {
    document.querySelectorAll("[data-card]").forEach(function (el) {
      var p = byId(el.getAttribute("data-card"));
      if (p) el.querySelector(".card-add").innerHTML = addControl(p);
    });
  }

  /* ---------- rows ---------- */
  function rails() {
    var list = [];
    var offers = products.filter(function (p) { return p.offer && p.stock !== "out"; });
    if (offers.length) list.push({ key: "offer", title: t("rail_offer"), items: offers, href: "products.html?offer=yes" });
    ["laptops", "pc-setups", "printers", "open-box", "monitors", "parts", "accessories"].forEach(function (c) {
      var items = products.filter(function (p) { return p.category === c; })
        .sort(function (a, b) { return (b.stock !== "out") - (a.stock !== "out") || b.featured - a.featured; });
      if (items.length) list.push({ key: c, title: t("cat_" + c), items: items, href: catHref(c) });
    });
    return list;
  }

  function renderRails() {
    var root = document.getElementById("rails");
    if (!root) return;
    root.innerHTML = rails().map(function (r) {
      return '<section class="section rail" aria-labelledby="rail-' + r.key + '">' +
        '<div class="wrap">' +
        '<div class="rail-head"><h2 class="h2" id="rail-' + r.key + '">' + esc(r.title) + "</h2>" +
        '<a class="see-all" href="' + r.href + '">' + esc(t("see_all")) + ICONS.get("chevron-right", 18) + "</a></div>" +
        '<ul class="rail-list">' + r.items.slice(0, 10).map(card).join("") + "</ul>" +
        "</div></section>";
    }).join("");
  }

  /* ---------- search ---------- */
  function norm(s) { return (s || "").toLowerCase(); }

  function search(q) {
    var words = norm(q).split(/\s+/).filter(Boolean);
    return products.map(function (p) {
      var head = norm(p.name + " " + p.brand);
      var hay = norm([head, p.specs.join(" "), t("cat_" + p.category), p.category].join(" "));
      if (!words.every(function (w) { return hay.indexOf(w) >= 0; })) return null;
      // Name and brand matches first, sold-out items last
      var score = words.filter(function (w) { return head.indexOf(w) >= 0; }).length * 2 + (p.stock !== "out" ? 1 : 0);
      return { p: p, score: score };
    }).filter(Boolean).sort(function (a, b) { return b.score - a.score; })
      .slice(0, 6).map(function (x) { return x.p; });
  }

  function initSearch() {
    var form = document.getElementById("search");
    var input = document.getElementById("q");
    var box = document.getElementById("search-results");
    function show() {
      var q = input.value.trim();
      if (!q) { box.hidden = true; return; }
      var hits = search(q);
      box.hidden = false;
      if (!hits.length) {
        box.innerHTML = '<p class="sr-empty">' + esc(t("search_none", { q: q })) + "</p>" +
          '<a class="btn btn-wa btn-small" target="_blank" rel="noopener" href="' +
          Quote.waLink(t("wa_hello") + "\n" + q) + '">' + ICONS.whatsapp + "<span>" + esc(t("search_ask")) + "</span></a>";
        return;
      }
      box.innerHTML = '<ul class="sr-list">' + hits.map(function (p) {
        return '<li class="sr-item" data-card="' + esc(p.id) + '">' +
          '<span class="sr-art">' + (p.image ? '<img src="' + esc(p.image) + '" alt="">' : ART.make(p.category, p.id)) + "</span>" +
          '<span class="sr-text"><strong>' + esc(p.name) + "</strong><span>" + esc(shortSpecs(p)) + "</span></span>" +
          '<span class="card-add">' + addControl(p) + "</span></li>";
      }).join("") + "</ul>";
    }
    input.addEventListener("input", show);
    input.addEventListener("focus", show);
    form.addEventListener("submit", function (e) { e.preventDefault(); show(); });
    box.addEventListener("click", handleCardClick);
    document.addEventListener("click", function (e) { if (!form.contains(e.target)) box.hidden = true; });
    input.addEventListener("keydown", function (e) { if (e.key === "Escape") { box.hidden = true; input.blur(); } });
  }

  /* ---------- banner slider ---------- */
  function initSlider() {
    var track = document.getElementById("slides");
    var dots = document.getElementById("dots");
    if (!track) return;
    var slides = track.querySelectorAll(".slide");
    dots.innerHTML = Array.prototype.map.call(slides, function (_, i) {
      return '<button type="button" role="tab" aria-label="' + (i + 1) + '" data-dot="' + i + '"></button>';
    }).join("");
    function current() { return Math.round(track.scrollLeft / slides[0].offsetWidth); }
    function go(i) {
      i = (i + slides.length) % slides.length;
      track.scrollTo({ left: slides[i].offsetLeft - track.offsetLeft, behavior: "smooth" });
    }
    function mark() {
      var c = current();
      dots.querySelectorAll("button").forEach(function (d, i) { d.setAttribute("aria-selected", i === c ? "true" : "false"); });
    }
    track.addEventListener("scroll", function () { window.requestAnimationFrame(mark); }, { passive: true });
    dots.addEventListener("click", function (e) { var d = e.target.closest("[data-dot]"); if (d) go(Number(d.getAttribute("data-dot"))); });
    document.querySelectorAll("[data-slide]").forEach(function (b) {
      b.addEventListener("click", function () { go(current() + Number(b.getAttribute("data-slide"))); });
    });
    mark();

    // Gentle auto-advance, paused on hover/focus/touch and off for reduced motion
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || slides.length < 2) return;
    var paused = false;
    ["mouseenter", "focusin", "touchstart"].forEach(function (ev) { track.parentNode.addEventListener(ev, function () { paused = true; }, { passive: true }); });
    ["mouseleave", "focusout"].forEach(function (ev) { track.parentNode.addEventListener(ev, function () { paused = false; }); });
    setInterval(function () { if (!paused && !document.hidden) go(current() + 1); }, 6000);
  }

  /* ---------- load ---------- */
  function loadProducts() {
    var root = document.getElementById("rails");
    root.addEventListener("click", handleCardClick);
    Products.load().then(function (all) {
      products = all;
      renderRails();
    }).catch(function () { root.innerHTML = ""; });
  }

  function refreshText() {
    fillWhatsApp();
    fillShop();
    renderCategories();
    renderRails();
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-lang]").forEach(function (b) {
      b.addEventListener("click", function () { i18n.set(b.getAttribute("data-lang")); });
    });
    i18n.apply();
    fillIcons();
    Quote.init();
    refreshText();
    initSlider();
    initSearch();
    loadProducts();
    document.querySelectorAll("[data-focus-cats]").forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        document.querySelector(".cat-row").scrollIntoView({ behavior: "smooth" });
      });
    });
    var y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  });

  document.addEventListener("langchange", refreshText);
  document.addEventListener("quotechange", refreshAddControls);
})();
