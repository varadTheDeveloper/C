/*
 * Quote list: like a cart, but with no prices.
 * The list is sent to the shop on WhatsApp, which replies with today's price.
 */
(function () {
  var KEY = "cw-quote";
  var items = read();

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) {}
    render();
    document.dispatchEvent(new CustomEvent("quotechange"));
  }

  function has(id) { return items.some(function (i) { return i.id === id; }); }

  function add(p) {
    if (has(p.id)) return;
    items.push({ id: p.id, name: p.name, brand: p.brand || "", qty: 1 });
    save();
  }
  function remove(id) {
    items = items.filter(function (i) { return i.id !== id; });
    save();
  }
  function setQty(id, qty) {
    if (qty < 1) { remove(id); return; }
    items.forEach(function (i) { if (i.id === id) i.qty = Math.min(99, qty); });
    save();
  }
  function qty(id) {
    var it = items.filter(function (i) { return i.id === id; })[0];
    return it ? it.qty : 0;
  }

  function waLink(text) {
    return "https://wa.me/" + SHOP.whatsapp + "?text=" + encodeURIComponent(text);
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  var dlg, list, form, countEls;

  function render() {
    var n = items.reduce(function (a, i) { return a + i.qty; }, 0);
    (countEls || []).forEach(function (el) {
      el.textContent = n;
      el.hidden = n === 0;
    });
    if (!list) return;
    var t = i18n.t;
    if (!items.length) {
      list.innerHTML = '<p class="quote-empty">' + esc(t("quote_empty")) + "</p>";
      form.hidden = true;
      return;
    }
    form.hidden = false;
    list.innerHTML = items.map(function (i) {
      return '<li class="quote-item">' +
        '<div class="quote-item-name"><strong>' + esc(i.name) + "</strong>" +
        (i.brand ? "<span>" + esc(i.brand) + "</span>" : "") + "</div>" +
        '<div class="qty" role="group" aria-label="' + esc(t("q_qty")) + '">' +
        '<button type="button" data-qty="-1" data-id="' + esc(i.id) + '" aria-label="−">' + ICONS.get("minus", 18) + "</button>" +
        "<output>" + i.qty + "</output>" +
        '<button type="button" data-qty="1" data-id="' + esc(i.id) + '" aria-label="+">' + ICONS.get("plus", 18) + "</button>" +
        "</div>" +
        '<button type="button" class="link-btn" data-remove="' + esc(i.id) + '">' + esc(t("q_remove")) + "</button>" +
        "</li>";
    }).join("");
  }

  function buildMessage(data) {
    var t = i18n.t;
    var lines = [t("wa_quote_head"), ""];
    items.forEach(function (i) { lines.push(i.qty + " × " + i.name); });
    lines.push("");
    var how = { pickup: t("q_pickup"), jalna: t("q_jalna"), other: t("q_other") }[data.how];
    lines.push(t("wa_delivery") + ": " + how + (data.place ? " (" + data.place + ")" : ""));
    if (data.name) lines.push(t("wa_name") + ": " + data.name);
    if (data.gst) lines.push(t("wa_gst") + ": " + data.gst);
    if (data.note) lines.push(t("wa_note") + ": " + data.note);
    return lines.join("\n");
  }

  function init() {
    dlg = document.getElementById("quote");
    list = document.getElementById("quote-list");
    form = document.getElementById("quote-form");
    countEls = Array.prototype.slice.call(document.querySelectorAll("[data-quote-count]"));

    document.querySelectorAll("[data-open-quote]").forEach(function (b) {
      b.addEventListener("click", function () { render(); dlg.showModal(); });
    });
    dlg.querySelector("[data-close]").addEventListener("click", function () { dlg.close(); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });

    list.addEventListener("click", function (e) {
      var q = e.target.closest("[data-qty]");
      var r = e.target.closest("[data-remove]");
      if (q) {
        var id = q.getAttribute("data-id");
        var cur = items.filter(function (i) { return i.id === id; })[0];
        if (cur) setQty(id, cur.qty + Number(q.getAttribute("data-qty")));
      }
      if (r) remove(r.getAttribute("data-remove"));
    });

    var placeField = form.querySelector("[data-place]");
    function syncPlace() {
      var how = form.elements.how.value;
      placeField.hidden = how === "pickup";
      form.elements.place.required = how !== "pickup";
    }
    form.addEventListener("change", syncPlace);
    syncPlace();

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var place = form.elements.place;
      if (place.required && !place.value.trim()) {
        place.setCustomValidity(i18n.t("q_place_needed"));
        place.reportValidity();
        place.setCustomValidity("");
        return;
      }
      var msg = buildMessage({
        how: form.elements.how.value,
        place: form.elements.how.value === "pickup" ? "" : place.value.trim(),
        name: form.elements.name.value.trim(),
        gst: form.elements.gst.value.trim(),
        note: form.elements.note.value.trim()
      });
      window.open(waLink(msg), "_blank", "noopener");
    });

    document.addEventListener("langchange", render);
    render();
  }

  window.Quote = { init: init, add: add, has: has, qty: qty, setQty: setQty, waLink: waLink, esc: esc };
})();
