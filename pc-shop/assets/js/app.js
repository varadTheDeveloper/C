/*
 * Page logic for all pages.
 * Shared: language menu, icons, WhatsApp links, shop details, search, product cards.
 * Per page (body data-page): home rows + banners, products grid + filters,
 * build-my-PC form, repair form.
 */
(function () {
  var t = function (k, v) { return i18n.t(k, v); };
  var esc = function (s) { return Quote.esc(s); };
  var page = document.body.getAttribute("data-page") || "home";

  var CATEGORIES = ["laptops", "pc-setups", "printers", "open-box", "monitors", "parts", "accessories", "repair"];
  var PRODUCT_CATS = CATEGORIES.filter(function (c) { return c !== "repair"; });
  var products = [];
  var loaded = false;

  function catHref(c) { return c === "repair" ? "repair.html" : "products.html?cat=" + c; }

  /* ---------- small fills ---------- */
  function fillIcons(root) {
    (root || document).querySelectorAll("[data-icon]").forEach(function (el) {
      var name = el.getAttribute("data-icon");
      el.innerHTML = name === "whatsapp" ? ICONS.whatsapp : ICONS.get(name, el.getAttribute("data-size") || 24);
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

  function catImage(c) {
    var src = SHOP.categoryImages && SHOP.categoryImages[c];
    return src ? '<img src="' + esc(src) + '" alt="" loading="lazy" data-fallback="' + c + '" data-seed="cat-' + c + '">' : ART.make(c, "cat-" + c);
  }

  function productHref(p) { return "product.html?id=" + encodeURIComponent(p.id); }

  function renderCategories() {
    var row = document.getElementById("categories");
    if (row) {
      row.innerHTML = CATEGORIES.map(function (c) {
        return '<li><a class="cat" href="' + catHref(c) + '">' +
          '<span class="cat-art">' + catImage(c) + (c === "repair" ? '<span class="cat-badge">' + ICONS.get("repair", 16) + "</span>" : "") + "</span>" +
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
  function shortSpecs(p) { return p.specs.slice(0, 3).join(", "); }

  function photo(p, cls) {
    return p.image
      ? '<img src="' + esc(p.image) + '" alt="' + esc(p.name) + '" loading="lazy" referrerpolicy="no-referrer" data-fallback="' + esc(p.category) + '" data-seed="' + esc(p.id) + '">'
      : ART.make(p.category, p.id);
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
    return '<li class="card" data-card="' + esc(p.id) + '">' +
      '<a class="card-link" href="' + productHref(p) + '" aria-label="' + esc(p.name) + '"></a>' +
      '<div class="card-media">' + photo(p) +
      '<div class="tags">' +
      (p.offer ? '<span class="tag tag-offer">' + esc(t("badge_offer")) + "</span>" : "") +
      (p.condition === "open-box" ? '<span class="tag tag-box">' + esc(t("cond_open")) + "</span>" : "") +
      "</div>" +
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

  // Update only the add buttons when the quote changes, so nothing jumps
  function refreshAddControls() {
    document.querySelectorAll("[data-card]").forEach(function (el) {
      var p = byId(el.getAttribute("data-card"));
      var slot = el.querySelector(".card-add");
      if (p && slot) slot.innerHTML = addControl(p);
    });
  }

  function rail(key, title, items, href) {
    return '<section class="section rail" aria-labelledby="rail-' + key + '">' +
      '<div class="wrap"><div class="rail-box">' +
      '<div class="rail-head"><h2 class="h2" id="rail-' + key + '">' + esc(title) + "</h2>" +
      (href ? '<a class="see-all" href="' + href + '" aria-label="' + esc(t("see_all") + ": " + title) + '"><span class="see-all-text">' + esc(t("see_all")) + "</span>" + ICONS.get("chevron-right", 18) + "</a>" : "") +
      "</div>" +
      '<ul class="rail-list">' + items.slice(0, 10).map(card).join("") + "</ul>" +
      "</div></div></section>";
  }

  function sortForShow(list) {
    return list.slice().sort(function (a, b) { return (b.stock !== "out") - (a.stock !== "out") || b.featured - a.featured; });
  }

  /* ---------- search (header, all pages) ---------- */
  function norm(s) { return (s || "").toLowerCase(); }

  function matches(p, q) {
    var words = norm(q).split(/\s+/).filter(Boolean);
    var head = norm(p.name + " " + p.brand);
    var hay = norm([head, p.specs.join(" "), t("cat_" + p.category), p.category].join(" "));
    if (!words.every(function (w) { return hay.indexOf(w) >= 0; })) return -1;
    return words.filter(function (w) { return head.indexOf(w) >= 0; }).length * 2 + (p.stock !== "out" ? 1 : 0);
  }

  function search(q) {
    return products.map(function (p) { return { p: p, s: matches(p, q) }; })
      .filter(function (x) { return x.s >= 0; })
      .sort(function (a, b) { return b.s - a.s; })
      .slice(0, 6).map(function (x) { return x.p; });
  }

  function initSearch() {
    var form = document.getElementById("search");
    var input = document.getElementById("q");
    var box = document.getElementById("search-results");
    if (!form) return;
    function show() {
      var q = input.value.trim();
      if (!q || page === "products") { box.hidden = true; return; }
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
          '<a class="sr-link" href="' + productHref(p) + '">' +
          '<span class="sr-art">' + photo(p) + "</span>" +
          '<span class="sr-text"><strong>' + esc(p.name) + "</strong><span>" + esc(shortSpecs(p)) + "</span></span></a>" +
          '<span class="card-add">' + addControl(p) + "</span></li>";
      }).join("") + "</ul>";
    }
    input.addEventListener("input", function () {
      show();
      if (page === "products") document.dispatchEvent(new CustomEvent("searchchange", { detail: input.value.trim() }));
    });
    input.addEventListener("focus", show);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var q = input.value.trim();
      if (page === "products") { document.dispatchEvent(new CustomEvent("searchchange", { detail: q })); input.blur(); return; }
      location.href = "products.html" + (q ? "?q=" + encodeURIComponent(q) : "");
    });
    box.addEventListener("click", handleCardClick);
    document.addEventListener("click", function (e) { if (!form.contains(e.target)) box.hidden = true; });
    input.addEventListener("keydown", function (e) { if (e.key === "Escape") { box.hidden = true; input.blur(); } });
  }

  /* ---------- HOME ---------- */
  function renderHomeRails() {
    var root = document.getElementById("rails");
    if (!root) return;
    var html = "";
    var offers = products.filter(function (p) { return p.offer && p.stock !== "out"; });
    if (offers.length) html += rail("offer", t("rail_offer"), offers, "products.html?offer=yes");
    PRODUCT_CATS.forEach(function (c) {
      var items = sortForShow(products.filter(function (p) { return p.category === c; }));
      if (items.length) html += rail(c, t("cat_" + c), items, catHref(c));
    });
    root.innerHTML = html;
  }

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
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || slides.length < 2) return;
    var paused = false;
    ["mouseenter", "focusin", "touchstart"].forEach(function (ev) { track.parentNode.addEventListener(ev, function () { paused = true; }, { passive: true }); });
    ["mouseleave", "focusout"].forEach(function (ev) { track.parentNode.addEventListener(ev, function () { paused = false; }); });
    setInterval(function () { if (!paused && !document.hidden) go(current() + 1); }, 6000);
  }

  /* ---------- PRODUCTS ---------- */
  var filters = { cat: "", q: "", brand: "", cond: "", instock: false, offer: false, sort: "featured" };

  function readUrl() {
    var u = new URLSearchParams(location.search);
    filters.cat = PRODUCT_CATS.indexOf(u.get("cat")) >= 0 ? u.get("cat") : "";
    filters.q = u.get("q") || "";
    filters.brand = u.get("brand") || "";
    filters.cond = u.get("cond") || "";
    filters.instock = u.get("stock") === "in";
    filters.offer = u.get("offer") === "yes";
    filters.sort = u.get("sort") || "featured";
  }

  function writeUrl() {
    var u = new URLSearchParams();
    if (filters.cat) u.set("cat", filters.cat);
    if (filters.q) u.set("q", filters.q);
    if (filters.brand) u.set("brand", filters.brand);
    if (filters.cond) u.set("cond", filters.cond);
    if (filters.instock) u.set("stock", "in");
    if (filters.offer) u.set("offer", "yes");
    if (filters.sort !== "featured") u.set("sort", filters.sort);
    var s = u.toString();
    try { history.replaceState(null, "", location.pathname + (s ? "?" + s : "")); } catch (e) {}
  }

  function brandList(p) {
    return (p.brand || "").split("+").map(function (b) { return b.trim(); }).filter(Boolean);
  }

  function filtered() {
    var list = products.filter(function (p) {
      if (filters.cat && p.category !== filters.cat) return false;
      if (filters.brand && brandList(p).indexOf(filters.brand) < 0) return false;
      if (filters.cond && p.condition !== filters.cond) return false;
      if (filters.instock && p.stock !== "in") return false;
      if (filters.offer && !p.offer) return false;
      if (filters.q && matches(p, filters.q) < 0) return false;
      return true;
    });
    if (filters.sort === "name") return list.sort(function (a, b) { return a.name.localeCompare(b.name); });
    if (filters.sort === "stock") {
      var rank = { in: 0, order: 1, out: 2 };
      return list.sort(function (a, b) { return rank[a.stock] - rank[b.stock]; });
    }
    if (filters.q) return list.sort(function (a, b) { return matches(b, filters.q) - matches(a, filters.q); });
    return sortForShow(list);
  }

  function renderProductsPage() {
    var grid = document.getElementById("grid");
    if (!grid) return;
    var title = filters.cat ? t("cat_" + filters.cat) : t("pp_title");
    document.getElementById("pp-title").textContent = title;
    document.getElementById("crumb-here").textContent = title;
    document.title = title + " | Computer Warehouse Jalna";

    var chips = document.getElementById("cat-chips");
    // Empty categories are hidden once products load (unless it is the one being viewed)
    chips.innerHTML = [""].concat(PRODUCT_CATS).filter(function (c) {
      return !loaded || !c || c === filters.cat || products.some(function (p) { return p.category === c; });
    }).map(function (c) {
      var n = products.filter(function (p) { return !c || p.category === c; }).length;
      return '<li><button type="button" class="chip" data-cat="' + c + '" aria-pressed="' + (filters.cat === c) + '">' +
        esc(c ? t("cat_" + c) : t("cat_all")) + ' <span class="chip-n">' + n + "</span></button></li>";
    }).join("") + '<li><a class="chip chip-link" href="repair.html">' + esc(t("cat_repair")) + "</a></li>";

    var brands = {};
    products.forEach(function (p) { if (!filters.cat || p.category === filters.cat) brandList(p).forEach(function (b) { brands[b] = 1; }); });
    var bsel = document.getElementById("f-brand");
    bsel.innerHTML = '<option value="">' + esc(t("f_all_brands")) + "</option>" +
      Object.keys(brands).sort().map(function (b) { return '<option value="' + esc(b) + '">' + esc(b) + "</option>"; }).join("");
    if (filters.brand && !brands[filters.brand]) filters.brand = "";
    bsel.value = filters.brand;
    document.getElementById("f-cond").innerHTML =
      '<option value="">' + esc(t("f_any")) + '</option><option value="new">' + esc(t("cond_new")) + '</option><option value="open-box">' + esc(t("cond_open")) + "</option>";
    document.getElementById("f-cond").value = filters.cond;
    document.getElementById("f-sort").innerHTML =
      '<option value="featured">' + esc(t("sort_featured")) + '</option><option value="stock">' + esc(t("sort_stock")) + '</option><option value="name">' + esc(t("sort_name")) + "</option>";
    document.getElementById("f-sort").value = filters.sort;
    document.getElementById("f-instock").checked = filters.instock;
    document.getElementById("f-offer").checked = filters.offer;

    var list = filtered();
    var count = t("f_count", { n: list.length });
    document.getElementById("pp-count").textContent = filters.q ? t("f_search_for", { q: filters.q }) + " · " + count : count;
    var any = filters.brand || filters.cond || filters.instock || filters.offer || filters.q;
    document.getElementById("f-clear").hidden = !any;

    var empty = document.getElementById("pp-empty");
    if (!list.length) {
      grid.innerHTML = "";
      empty.hidden = !loaded;
      document.getElementById("pp-empty-wa").href = Quote.waLink(t("wa_hello") + (filters.q ? "\n" + filters.q : (filters.cat ? "\n" + t("cat_" + filters.cat) : "")));
    } else {
      empty.hidden = true;
      grid.innerHTML = list.map(card).join("");
    }
    writeUrl();
  }

  function initProductsPage() {
    if (!document.getElementById("grid")) return;
    readUrl();
    var input = document.getElementById("q");
    if (input && filters.q) input.value = filters.q;
    document.getElementById("grid").addEventListener("click", handleCardClick);
    document.getElementById("cat-chips").addEventListener("click", function (e) {
      var b = e.target.closest("[data-cat]");
      if (!b) return;
      filters.cat = b.getAttribute("data-cat");
      renderProductsPage();
      window.scrollTo({ top: 0 });
    });
    function bind(id, key, prop) {
      document.getElementById(id).addEventListener("change", function (e) { filters[key] = e.target[prop]; renderProductsPage(); });
    }
    bind("f-brand", "brand", "value");
    bind("f-cond", "cond", "value");
    bind("f-sort", "sort", "value");
    bind("f-instock", "instock", "checked");
    bind("f-offer", "offer", "checked");
    document.getElementById("f-clear").addEventListener("click", function () {
      filters.brand = ""; filters.cond = ""; filters.instock = false; filters.offer = false; filters.q = "";
      if (input) input.value = "";
      renderProductsPage();
    });
    document.addEventListener("searchchange", function (e) { filters.q = e.detail; renderProductsPage(); });
  }

  /* ---------- BUILD MY PC ---------- */
  function checkedLabels(form, name) {
    return Array.prototype.filter.call(form.querySelectorAll('input[name="' + name + '"]'), function (i) { return i.checked; })
      .map(function (i) { return t(i.value); });
  }

  function initBuild() {
    var form = document.getElementById("build-form");
    if (!form) return;
    var err = document.getElementById("build-error");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var use = checkedLabels(form, "use");
      var budget = checkedLabels(form, "budget")[0];
      if (!use.length || !budget) { err.textContent = t("bp_pick"); err.hidden = false; err.scrollIntoView({ block: "center" }); return; }
      err.hidden = true;
      var extras = checkedLabels(form, "extras");
      var cpu = checkedLabels(form, "cpu")[0];
      var how = form.elements.how.value;
      var place = form.elements.place.value.trim();
      var lines = [t("wa_build_head"), "",
        t("wa_use") + ": " + use.join(", "),
        t("wa_budget") + ": " + budget];
      if (cpu) lines.push(t("wa_cpu") + ": " + cpu);
      if (extras.length) lines.push(t("wa_extras") + ": " + extras.join(", "));
      lines.push(t("wa_delivery") + ": " + t({ pickup: "q_pickup", jalna: "q_jalna", other: "q_other" }[how]) + (how !== "pickup" && place ? " (" + place + ")" : ""));
      var name = form.elements.name.value.trim();
      var note = form.elements.note.value.trim();
      if (name) lines.push(t("wa_name") + ": " + name);
      if (note) lines.push(t("wa_note") + ": " + note);
      window.open(Quote.waLink(lines.join("\n")), "_blank", "noopener");
    });
  }

  function syncPlace(form) {
    var field = form.querySelector("[data-place]");
    if (!field || !form.elements.how) return;
    function sync() { field.hidden = form.elements.how.value === "pickup"; }
    form.addEventListener("change", sync);
    sync();
  }

  /* ---------- REPAIR ---------- */
  function initRepair() {
    var form = document.getElementById("repair-form");
    if (!form) return;
    var err = document.getElementById("repair-error");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var device = checkedLabels(form, "device")[0];
      var problems = checkedLabels(form, "problem");
      if (!device || !problems.length) { err.textContent = t("rp_pick"); err.hidden = false; err.scrollIntoView({ block: "center" }); return; }
      err.hidden = true;
      var lines = [t("wa_repair_head"), "",
        t("wa_device") + ": " + device];
      var model = form.elements.model.value.trim();
      if (model) lines.push(t("wa_model") + ": " + model);
      lines.push(t("wa_problem") + ": " + problems.join(", "));
      var details = form.elements.details.value.trim();
      if (details) lines.push(details);
      lines.push(t("wa_visit") + ": " + t(form.elements.visit.value));
      var name = form.elements.name.value.trim();
      if (name) lines.push(t("wa_name") + ": " + name);
      window.open(Quote.waLink(lines.join("\n")), "_blank", "noopener");
    });
  }

  function renderBuildRail() {
    var root = document.getElementById("build-rail");
    if (!root) return;
    var items = sortForShow(products.filter(function (p) { return p.category === "pc-setups"; }));
    root.innerHTML = items.length ? rail("builds", t("bp_rail"), items, catHref("pc-setups")) : "";
  }

  /* ---------- PRODUCT PAGE ---------- */
  function renderProductPage() {
    var root = document.getElementById("pd");
    if (!root || !loaded) return;
    var id = new URLSearchParams(location.search).get("id");
    var p = byId(id);
    var nf = document.getElementById("pd-notfound");
    if (!p) { root.hidden = true; nf.hidden = false; return; }
    nf.hidden = true; root.hidden = false;
    document.title = p.name + " | Computer Warehouse Jalna";
    var cat = t("cat_" + p.category);
    document.getElementById("pd-crumb-cat").textContent = cat;
    document.getElementById("pd-crumb-cat").href = catHref(p.category);
    document.getElementById("pd-crumb-here").textContent = p.name;
    document.getElementById("pd-photo").innerHTML = photo(p) +
      '<div class="tags">' + (p.offer ? '<span class="tag tag-offer">' + esc(t("badge_offer")) + "</span>" : "") +
      (p.condition === "open-box" ? '<span class="tag tag-box">' + esc(t("cond_open")) + "</span>" : "") + "</div>";
    document.getElementById("pd-brand").textContent = p.brand || "";
    document.getElementById("pd-name").textContent = p.name;
    var stock = document.getElementById("pd-stock");
    stock.className = "pd-stock stock-" + p.stock;
    stock.innerHTML = esc(stockLabel(p.stock)) + (p.warranty ? '<span class="pd-warranty">' + esc(t("warranty")) + " " + esc(p.warranty) + "</span>" : "");
    document.getElementById("pd-highlights").innerHTML = p.specs.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("");
    var rows = [[t("f_brand"), p.brand], [t("pd_category"), cat], [t("f_condition"), p.condition === "open-box" ? t("cond_open") : t("cond_new")],
      [t("warranty"), p.warranty], [t("pd_features"), p.specs.join(", ")]];
    document.getElementById("pd-table").innerHTML = rows.filter(function (r) { return r[1]; })
      .map(function (r) { return "<tr><th scope=\"row\">" + esc(r[0]) + "</th><td>" + esc(r[1]) + "</td></tr>"; }).join("");
    var link = location.href.split("#")[0];
    var msg = t("wa_product") + "\n" + p.name + "\n" + link;
    document.querySelectorAll("[data-pd-wa]").forEach(function (a) { a.href = Quote.waLink(msg); });
    renderPdAdd(p);
    var similar = sortForShow(products.filter(function (x) { return x.category === p.category && x.id !== p.id; }));
    document.getElementById("pd-similar").innerHTML = similar.length ? rail("similar", t("pd_similar"), similar, catHref(p.category)) : "";
  }

  function renderPdAdd(p) {
    var id = new URLSearchParams(location.search).get("id");
    p = p || byId(id);
    if (!p) return;
    var q = Quote.qty(p.id);
    document.querySelectorAll("[data-pd-add]").forEach(function (b) {
      b.disabled = p.stock === "out";
      b.classList.toggle("is-added", q > 0);
      b.querySelector("span:last-child").textContent = p.stock === "out" ? t("stock_out") : q > 0 ? t("pd_view_list") : t("add_quote");
    });
  }

  function initProductPage() {
    if (!document.getElementById("pd")) return;
    document.querySelectorAll("[data-pd-add]").forEach(function (b) {
      b.addEventListener("click", function () {
        var p = byId(new URLSearchParams(location.search).get("id"));
        if (!p) return;
        if (Quote.qty(p.id)) { document.querySelector("[data-open-quote]").click(); return; }
        Quote.add(p);
      });
    });
    var share = document.getElementById("pd-share");
    if (share) share.addEventListener("click", function () {
      var url = location.href.split("#")[0];
      if (navigator.share) { navigator.share({ title: document.title, url: url }).catch(function () {}); return; }
      try { navigator.clipboard.writeText(url).then(function () { share.querySelector("span:last-child").textContent = t("pd_copied"); }); } catch (e) {}
    });
    document.addEventListener("quotechange", function () { renderPdAdd(); });
    document.getElementById("pd-similar").addEventListener("click", handleCardClick);
  }

  function previewBar() {
    if (!Products.isSample() || document.querySelector(".preview-bar")) return;
    var h = document.querySelector(".header");
    if (!h) return;
    var bar = document.createElement("p");
    bar.className = "preview-bar";
    bar.setAttribute("data-i18n", "preview_bar");
    bar.textContent = t("preview_bar");
    h.insertAdjacentElement("afterend", bar);
  }

  /* ---------- load ---------- */
  function renderProductViews() {
    renderHomeRails();
    renderProductsPage();
    renderBuildRail();
    renderProductPage();
  }

  function refreshText() {
    fillWhatsApp();
    fillShop();
    renderCategories();
    renderProductViews();
  }

  document.addEventListener("DOMContentLoaded", function () {
    var lang = document.getElementById("lang");
    if (lang) {
      lang.value = i18n.lang;
      lang.addEventListener("change", function () { i18n.set(lang.value); });
    }
    // If a product photo fails to load, show the drawn picture instead
    document.addEventListener("error", function (e) {
      var img = e.target;
      if (img.tagName !== "IMG" || !img.hasAttribute("data-fallback")) return;
      var holder = document.createElement("span");
      holder.className = "art-fallback";
      holder.innerHTML = ART.make(img.getAttribute("data-fallback"), img.getAttribute("data-seed"));
      img.replaceWith(holder);
    }, true);
    previewBar();
    i18n.apply();
    fillIcons();
    Quote.init();
    initProductsPage();
    initProductPage();
    refreshText();
    initSlider();
    initSearch();
    initBuild();
    initRepair();
    document.querySelectorAll("form").forEach(syncPlace);
    var rails = document.getElementById("rails") || document.getElementById("build-rail");
    if (rails) rails.addEventListener("click", handleCardClick);
    Products.load().then(function (all) {
      products = all;
      loaded = true;
      renderProductViews();
    }).catch(function () {});
    var y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  });

  document.addEventListener("langchange", refreshText);
  document.addEventListener("quotechange", refreshAddControls);
})();
