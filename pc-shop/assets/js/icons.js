/*
 * Line icons drawn in code (no photos needed while building).
 * All use currentColor so CSS controls the colour.
 */
(function () {
  function svg(body, size) {
    size = size || 24;
    return '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size +
      '" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      body + "</svg>";
  }

  var paths = {
    laptops: '<rect x="4" y="5" width="16" height="11" rx="1.2"/><path d="M2 19h20"/><path d="M10 19l.6-1.5h2.8L14 19"/>',
    "open-box": '<path d="M3 9l9-4 9 4-9 4-9-4z"/><path d="M3 9v8l9 4 9-4V9"/><path d="M12 13v8"/><path d="M3 9l-1 3 9 4 1-3"/><path d="M21 9l1 3-9 4"/>',
    "pc-setups": '<rect x="2" y="4" width="13" height="10" rx="1"/><path d="M6 18h5M8.5 14v4"/><rect x="17" y="4" width="5" height="16" rx="1"/><circle cx="19.5" cy="8" r="1"/><path d="M18.5 16h2"/>',
    printers: '<path d="M7 9V3h10v6"/><rect x="3" y="9" width="18" height="8" rx="1.5"/><path d="M7 14h10v7H7z"/><path d="M17.5 12h.01"/>',
    parts: '<rect x="6" y="6" width="12" height="12" rx="1.5"/><rect x="9.5" y="9.5" width="5" height="5"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
    monitors: '<rect x="2" y="3" width="20" height="13" rx="1.2"/><path d="M8 21h8M12 16v5"/>',
    accessories: '<rect x="2" y="7" width="14" height="10" rx="1.5"/><path d="M5 10h.01M8 10h.01M11 10h.01M5 13h6"/><path d="M19 7a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0v-5a3 3 0 0 1 3-3z"/><path d="M19 7v3"/>',
    repair: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4 2.6-2.6z"/>',
    quote: '<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5"/><path d="M9 12h7M9 15.5h7M9 19h4"/>',
    pin: '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    phone: '<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z"/>',
    star: '<path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    minus: '<path d="M5 12h14"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
    "chevron-left": '<path d="M15 5l-7 7 7 7"/>',
    "chevron-right": '<path d="M9 5l7 7-7 7"/>',
    truck: '<path d="M2 6h12v10H2z"/><path d="M14 9h4l4 4v3h-8"/><circle cx="6.5" cy="17.5" r="1.8"/><circle cx="17.5" cy="17.5" r="1.8"/>',
    shield: '<path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
    upi: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/><path d="M7 15h4"/>',
    home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>',
    grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>'
  };

  var whatsapp =
    '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 2.9 2.9 0 0 0-.9 2.2 5 5 0 0 0 1.1 2.7 11.5 11.5 0 0 0 4.4 3.9c1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.5-.3z"/></svg>';

  // Shop mark: a monitor with a gear tooth ring, echoing the emblem on the signboard
  var mark =
    '<svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">' +
    '<circle cx="20" cy="20" r="17" fill="none" stroke="currentColor" stroke-width="2.4" stroke-dasharray="4.2 2.4"/>' +
    '<rect x="10" y="12" width="20" height="13" rx="1.6" fill="none" stroke="currentColor" stroke-width="2.4"/>' +
    '<path d="M16 29h8M20 25v4" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>' +
    '<path d="M14.5 21l3.5-4 2.6 2.6 4.4-4.6" fill="none" stroke="var(--yellow)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>' +
    "</svg>";

  window.ICONS = {
    get: function (name, size) { return paths[name] ? svg(paths[name], size) : ""; },
    whatsapp: whatsapp,
    mark: mark
  };
})();
