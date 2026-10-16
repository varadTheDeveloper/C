/*
 * Product illustrations drawn in code. Used until the shop adds real photos.
 * Each one takes a "screen" colour so cards in the same category don't look identical.
 */
(function () {
  var SCREENS = [
    ["#3B6FE0", "#7FB2FF"], ["#7A3FE0", "#C08BFF"], ["#0F9D8A", "#6FE3CF"],
    ["#E0573B", "#FFB27F"], ["#1F3A93", "#5AA9F5"], ["#C2185B", "#FF8FB8"]
  ];

  function hash(s) {
    var h = 0;
    for (var i = 0; i < (s || "").length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return h;
  }

  var uid = 0;

  function grad(id, c) {
    return '<linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="' + c[0] + '"/><stop offset="1" stop-color="' + c[1] + '"/></linearGradient>';
  }

  function wrap(defs, body) {
    return '<svg viewBox="0 0 160 120" role="img" aria-hidden="true" class="art"><defs>' + defs + "</defs>" + body + "</svg>";
  }

  var draw = {
    laptops: function (g) {
      return '<ellipse cx="80" cy="104" rx="62" ry="5" fill="#000" opacity=".08"/>' +
        '<rect x="34" y="18" width="92" height="62" rx="5" fill="#2A2F3A"/>' +
        '<rect x="39" y="23" width="82" height="52" rx="2" fill="url(#' + g + ')"/>' +
        '<path d="M39 60c18-14 34-6 46-14s24-8 36-2v31H39z" fill="#fff" opacity=".18"/>' +
        '<path d="M20 82h120l-8 16H28z" fill="#C9CED8"/>' +
        '<path d="M20 82h120v3H20z" fill="#E4E7ED"/>' +
        '<path d="M68 89h24" stroke="#A9AFBB" stroke-width="3" stroke-linecap="round"/>';
    },
    "open-box": function (g) {
      return '<ellipse cx="80" cy="106" rx="56" ry="5" fill="#000" opacity=".08"/>' +
        '<path d="M34 50l46-14 46 14v46l-46 12-46-12z" fill="#C89B62"/>' +
        '<path d="M80 64v44l46-12V50z" fill="#B5864D"/>' +
        '<path d="M34 50l46 14 46-14" fill="none" stroke="#9C7140" stroke-width="1.5"/>' +
        '<path d="M34 50l-12 14 46 14 12-14z" fill="#D9AE76"/>' +
        '<path d="M126 50l12 14-46 14-12-14z" fill="#CFA167"/>' +
        '<rect x="56" y="22" width="48" height="32" rx="3" fill="#2A2F3A" transform="rotate(-4 80 38)"/>' +
        '<rect x="60" y="26" width="40" height="24" rx="1.5" fill="url(#' + g + ')" transform="rotate(-4 80 38)"/>' +
        '<path d="M54 84l10 3M54 90l16 4" stroke="#8A6236" stroke-width="2" stroke-linecap="round" opacity=".6"/>';
    },
    "pc-setups": function (g) {
      return '<ellipse cx="80" cy="106" rx="66" ry="5" fill="#000" opacity=".08"/>' +
        '<rect x="14" y="20" width="84" height="56" rx="4" fill="#2A2F3A"/>' +
        '<rect x="18" y="24" width="76" height="46" rx="2" fill="url(#' + g + ')"/>' +
        '<path d="M18 58c14-10 28-4 38-10s26-6 38 0v22H18z" fill="#fff" opacity=".18"/>' +
        '<path d="M50 76h12l3 14H47z" fill="#3A404D"/>' +
        '<rect x="38" y="90" width="36" height="5" rx="2" fill="#3A404D"/>' +
        '<rect x="106" y="16" width="40" height="82" rx="4" fill="#1E222B"/>' +
        '<rect x="110" y="20" width="32" height="74" rx="2" fill="#2C313C"/>' +
        '<circle cx="126" cy="40" r="10" fill="none" stroke="url(#' + g + ')" stroke-width="4"/>' +
        '<circle cx="126" cy="66" r="10" fill="none" stroke="url(#' + g + ')" stroke-width="4"/>' +
        '<circle cx="126" cy="40" r="3" fill="#596070"/><circle cx="126" cy="66" r="3" fill="#596070"/>' +
        '<rect x="20" y="98" width="62" height="7" rx="2" fill="#C9CED8"/>' +
        '<rect x="88" y="97" width="10" height="9" rx="4" fill="#C9CED8"/>';
    },
    printers: function (g) {
      return '<ellipse cx="80" cy="104" rx="60" ry="5" fill="#000" opacity=".08"/>' +
        '<path d="M50 20h60v26H50z" fill="#fff" stroke="#D5DAE3" stroke-width="2"/>' +
        '<path d="M58 28h40M58 34h30" stroke="#C3C9D4" stroke-width="2"/>' +
        '<rect x="26" y="40" width="108" height="50" rx="8" fill="#2F3440"/>' +
        '<rect x="26" y="40" width="108" height="12" rx="6" fill="#3B414E"/>' +
        '<rect x="44" y="76" width="72" height="8" rx="2" fill="#1E222B"/>' +
        '<path d="M48 84h64l4 14H44z" fill="#fff" stroke="#D5DAE3" stroke-width="2"/>' +
        '<rect x="108" y="58" width="16" height="6" rx="2" fill="url(#' + g + ')"/>' +
        '<rect x="34" y="58" width="5" height="12" rx="1.5" fill="#00A3E0"/>' +
        '<rect x="41" y="58" width="5" height="12" rx="1.5" fill="#E6007E"/>' +
        '<rect x="48" y="58" width="5" height="12" rx="1.5" fill="#FFD100"/>' +
        '<rect x="55" y="58" width="5" height="12" rx="1.5" fill="#111"/>';
    },
    monitors: function (g) {
      return '<ellipse cx="80" cy="106" rx="50" ry="5" fill="#000" opacity=".08"/>' +
        '<path d="M14 22q66-10 132 0v58q-66-8-132 0z" fill="#2A2F3A"/>' +
        '<path d="M19 27q61-9 122 0v48q-61-7-122 0z" fill="url(#' + g + ')"/>' +
        '<path d="M19 62c22-12 40-4 56-12s40-8 66 0v25q-61-7-122 0z" fill="#fff" opacity=".18"/>' +
        '<path d="M70 79h20l5 18H65z" fill="#3A404D"/>' +
        '<path d="M50 97h60l-4 6H54z" fill="#3A404D"/>';
    },
    parts: function (g) {
      return '<ellipse cx="80" cy="104" rx="56" ry="5" fill="#000" opacity=".08"/>' +
        '<rect x="22" y="56" width="116" height="30" rx="3" fill="#1C6E4B"/>' +
        '<rect x="22" y="80" width="116" height="6" fill="#E1B54A"/>' +
        '<path d="M28 86v6M36 86v6M44 86v6M52 86v6M60 86v6M68 86v6M92 86v6M100 86v6M108 86v6M116 86v6M124 86v6M132 86v6" stroke="#E1B54A" stroke-width="3"/>' +
        '<rect x="30" y="61" width="16" height="14" rx="1.5" fill="#1E222B"/><rect x="52" y="61" width="16" height="14" rx="1.5" fill="#1E222B"/>' +
        '<rect x="92" y="61" width="16" height="14" rx="1.5" fill="#1E222B"/><rect x="114" y="61" width="16" height="14" rx="1.5" fill="#1E222B"/>' +
        '<rect x="54" y="14" width="52" height="36" rx="4" fill="#C9CED8"/>' +
        '<rect x="62" y="20" width="36" height="24" rx="2" fill="url(#' + g + ')"/>' +
        '<path d="M58 50v6M66 50v6M74 50v6M82 50v6M90 50v6M98 50v6" stroke="#E1B54A" stroke-width="2.5"/>';
    },
    accessories: function (g) {
      return '<ellipse cx="80" cy="104" rx="64" ry="5" fill="#000" opacity=".08"/>' +
        '<rect x="12" y="52" width="106" height="44" rx="6" fill="#2A2F3A"/>' +
        (function () {
          var k = "";
          for (var r = 0; r < 3; r++) for (var c = 0; c < 9; c++) k += '<rect x="' + (18 + c * 11) + '" y="' + (58 + r * 11) + '" width="8" height="8" rx="1.5" fill="#3E4552"/>';
          return k;
        })() +
        '<rect x="34" y="84" width="56" height="7" rx="1.5" fill="#3E4552"/>' +
        '<path d="M12 92h106" stroke="url(#' + g + ')" stroke-width="3"/>' +
        '<rect x="126" y="50" width="24" height="40" rx="12" fill="#2A2F3A"/>' +
        '<path d="M138 50v14" stroke="#596070" stroke-width="2"/>' +
        '<rect x="136" y="56" width="4" height="7" rx="2" fill="url(#' + g + ')"/>';
    },
    repair: function (g) {
      return '<ellipse cx="80" cy="104" rx="50" ry="5" fill="#000" opacity=".08"/>' +
        '<path d="M98 22a20 20 0 0 0-24 26L36 86a8 8 0 0 0 11 11l38-38a20 20 0 0 0 26-24l-12 12-10-3-3-10z" fill="#9AA3B2"/>' +
        '<path d="M60 30l40 40" stroke="url(#' + g + ')" stroke-width="10" stroke-linecap="round" transform="translate(16 6)"/>' +
        '<path d="M114 84l12 12" stroke="#2A2F3A" stroke-width="12" stroke-linecap="round"/>';
    }
  };

  function make(category, seed) {
    var fn = draw[category] || draw["pc-setups"];
    var id = "g" + (++uid);
    var c = SCREENS[hash(seed || category) % SCREENS.length];
    return wrap(grad(id, c), fn(id));
  }

  window.ART = { make: make };
})();
