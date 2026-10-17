/*
 * Shared page parts: header, footer, phone bottom bar, WhatsApp button and quote list.
 * Every page has <div data-layout="..."> placeholders; this file fills them,
 * so a change here shows on all pages.
 * The current page is set on <body data-page="home|products|build|repair">.
 */
(function () {
  var page = document.body.getAttribute("data-page") || "home";

  var header =
    '<header class="header">' +
    '<div class="wrap header-inner">' +
    '<a class="logo" href="index.html" aria-label="Computer Warehouse Jalna">' +
    '<span class="logo-name">Computer Warehouse</span>' +
    '<span class="logo-sub"><span data-icon="pin" data-size="12"></span>Jalna</span></a>' +
    '<form class="search" role="search" id="search" action="products.html" autocomplete="off">' +
    '<label class="sr-only" for="q" data-i18n="search_label"></label>' +
    '<span class="search-icon" data-icon="search" data-size="20"></span>' +
    '<input id="q" name="q" type="search" data-i18n-placeholder="search_ph" enterkeyhint="search">' +
    '<div class="search-results" id="search-results" hidden></div></form>' +
    '<label class="lang"><span class="sr-only">Language / भाषा</span>' +
    '<span class="lang-icon" data-icon="globe" data-size="18"></span>' +
    '<select id="lang"><option value="mr">मराठी</option><option value="hi">हिंदी</option><option value="en">English</option></select></label>' +
    '<nav class="header-nav" aria-label="Main">' +
    '<a href="products.html"' + (page === "products" ? ' aria-current="page"' : "") + ' data-i18n="nav_products"></a>' +
    '<a href="build.html"' + (page === "build" ? ' aria-current="page"' : "") + ' data-i18n="nav_build"></a>' +
    '<a href="repair.html"' + (page === "repair" ? ' aria-current="page"' : "") + ' data-i18n="nav_repair"></a></nav>' +
    '<button type="button" class="quote-btn" data-open-quote>' +
    '<span class="quote-btn-icon"><span data-icon="quote"></span><span class="quote-count" data-quote-count hidden>0</span></span>' +
    '<span class="quote-btn-text" data-i18n="quote_btn"></span></button>' +
    "</div></header>";

  var footer =
    '<footer class="footer"><div class="wrap"><div class="footer-cols">' +
    '<div class="footer-about">' +
    '<a class="logo logo-light" href="index.html" aria-label="Computer Warehouse Jalna">' +
    '<span class="logo-name">Computer Warehouse</span>' +
    '<span class="logo-sub"><span data-icon="pin" data-size="12"></span>Jalna</span></a>' +
    '<p data-i18n="f_about"></p><p class="footer-tag" data-i18n="footer_tag"></p></div>' +
    '<div><h2 class="footer-h" data-i18n="f_shop"></h2><ul class="footer-list" id="footer-cats"></ul></div>' +
    '<div><h2 class="footer-h" data-i18n="f_help"></h2><ul class="footer-list">' +
    '<li><a href="index.html#how" data-i18n="how_title"></a></li>' +
    '<li><a href="build.html" data-i18n="nav_build"></a></li>' +
    '<li><a href="repair.html" data-i18n="nav_repair"></a></li>' +
    '<li><a data-wa="wa_bulk" href="#" data-i18n="bulk_t"></a></li></ul></div>' +
    '<div><h2 class="footer-h" data-i18n="f_contact"></h2><ul class="footer-list">' +
    '<li data-i18n="address"></li><li data-i18n="hours_v"></li>' +
    '<li><a href="tel:+919307570781">93075 70781</a> · <a href="tel:+918888479687">88884 79687</a></li>' +
    '<li><a data-insta href="#" target="_blank" rel="noopener">Instagram @computer_warehouse_jalna</a></li></ul></div>' +
    '</div><p class="footer-copy">© <span id="year"></span> Computer Warehouse Jalna</p></div></footer>';

  function bn(href, icon, key, here) {
    return '<a href="' + href + '"' + (here ? ' aria-current="page"' : "") + '><span data-icon="' + icon + '"></span><span data-i18n="' + key + '"></span></a>';
  }
  var bottom =
    '<a class="wa-float" data-wa="wa_hello" href="#" data-i18n-label="btn_wa"><span data-icon="whatsapp"></span></a>' +
    '<nav class="bottom-nav" aria-label="Quick">' +
    bn("index.html", "home", "nav_home", page === "home") +
    bn("products.html", "grid", "nav_cats", page === "products") +
    '<button type="button" data-open-quote><span class="bn-icon"><span data-icon="quote"></span><span class="quote-count" data-quote-count hidden>0</span></span><span data-i18n="nav_quote"></span></button>' +
    '<a data-wa="wa_hello" href="#" class="bn-wa"><span data-icon="whatsapp"></span><span>WhatsApp</span></a>' +
    "</nav>";

  var quote =
    '<dialog class="quote" id="quote" aria-labelledby="quote-title">' +
    '<div class="quote-head"><h2 id="quote-title" data-i18n="quote_title"></h2>' +
    '<button type="button" class="icon-btn" data-close data-i18n-label="q_close"><span data-icon="close"></span></button></div>' +
    '<ul class="quote-list" id="quote-list"></ul>' +
    '<form class="quote-form" id="quote-form" novalidate>' +
    '<fieldset><legend data-i18n="q_how"></legend>' +
    '<label class="radio"><input type="radio" name="how" value="pickup" checked><span data-i18n="q_pickup"></span></label>' +
    '<label class="radio"><input type="radio" name="how" value="jalna"><span data-i18n="q_jalna"></span></label>' +
    '<label class="radio"><input type="radio" name="how" value="other"><span data-i18n="q_other"></span></label></fieldset>' +
    '<label class="field" data-place><span data-i18n="q_place"></span><input name="place" autocomplete="address-level2"></label>' +
    '<label class="field"><span data-i18n="q_name"></span><input name="name" autocomplete="name"></label>' +
    '<label class="field"><span data-i18n="q_gst"></span><input name="gst" maxlength="15"></label>' +
    '<label class="field"><span data-i18n="q_note"></span><textarea name="note" rows="2"></textarea></label>' +
    '<button type="submit" class="btn btn-wa btn-block"><span data-icon="whatsapp"></span><span data-i18n="q_send"></span></button>' +
    "</form></dialog>";

  var parts = { header: header, footer: footer, bottom: bottom, quote: quote };
  document.querySelectorAll("[data-layout]").forEach(function (el) {
    var html = parts[el.getAttribute("data-layout")];
    if (html) el.outerHTML = html;
  });
})();
