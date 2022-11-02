(window.webpackJsonp = window.webpackJsonp || []).push([
    [24],
    {
        1245: function (e, n, t) {
            e.exports = (function (e) {
                'use strict';
                var n = (function (e) {
                    return e && 'object' == typeof e && 'default' in e ? e : { default: e };
                })(e);
                function t(e) {
                    return e > 1 && e < 5 && 1 != ~~(e / 10);
                }
                function r(e, n, r, s) {
                    var _ = e + ' ';
                    switch (r) {
                        case 's':
                            return n || s ? 'pár sekund' : 'pár sekundami';
                        case 'm':
                            return n ? 'minuta' : s ? 'minutu' : 'minutou';
                        case 'mm':
                            return n || s ? _ + (t(e) ? 'minuty' : 'minut') : _ + 'minutami';
                        case 'h':
                            return n ? 'hodina' : s ? 'hodinu' : 'hodinou';
                        case 'hh':
                            return n || s ? _ + (t(e) ? 'hodiny' : 'hodin') : _ + 'hodinami';
                        case 'd':
                            return n || s ? 'den' : 'dnem';
                        case 'dd':
                            return n || s ? _ + (t(e) ? 'dny' : 'dní') : _ + 'dny';
                        case 'M':
                            return n || s ? 'měsíc' : 'měsícem';
                        case 'MM':
                            return n || s ? _ + (t(e) ? 'měsíce' : 'měsíců') : _ + 'měsíci';
                        case 'y':
                            return n || s ? 'rok' : 'rokem';
                        case 'yy':
                            return n || s ? _ + (t(e) ? 'roky' : 'let') : _ + 'lety';
                    }
                }
                var s = {
                    name: 'cs',
                    weekdays: 'neděle_pondělí_úterý_středa_čtvrtek_pátek_sobota'.split('_'),
                    weekdaysShort: 'ne_po_út_st_čt_pá_so'.split('_'),
                    weekdaysMin: 'ne_po_út_st_čt_pá_so'.split('_'),
                    months: 'leden_únor_březen_duben_květen_červen_červenec_srpen_září_říjen_listopad_prosinec'.split(
                        '_'
                    ),
                    monthsShort: 'led_úno_bře_dub_kvě_čvn_čvc_srp_zář_říj_lis_pro'.split('_'),
                    weekStart: 1,
                    yearStart: 4,
                    ordinal: function (e) {
                        return e + '.';
                    },
                    formats: {
                        LT: 'H:mm',
                        LTS: 'H:mm:ss',
                        L: 'DD.MM.YYYY',
                        LL: 'D. MMMM YYYY',
                        LLL: 'D. MMMM YYYY H:mm',
                        LLLL: 'dddd D. MMMM YYYY H:mm',
                        l: 'D. M. YYYY'
                    },
                    relativeTime: {
                        future: 'za %s',
                        past: 'před %s',
                        s: r,
                        m: r,
                        mm: r,
                        h: r,
                        hh: r,
                        d: r,
                        dd: r,
                        M: r,
                        MM: r,
                        y: r,
                        yy: r
                    }
                };
                return n.default.locale(s, null, !0), s;
            })(t(30));
        }
    }
]);
//# sourceMappingURL=24.chunk.js.map
