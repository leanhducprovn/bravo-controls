(window.webpackJsonp = window.webpackJsonp || []).push([
    [67],
    {
        1288: function (n, e, t) {
            n.exports = (function (n) {
                'use strict';
                var e = (function (n) {
                        return n && 'object' == typeof n && 'default' in n ? n : { default: n };
                    })(n),
                    t = {
                        name: 'hu',
                        weekdays: 'vasárnap_hétfő_kedd_szerda_csütörtök_péntek_szombat'.split('_'),
                        weekdaysShort: 'vas_hét_kedd_sze_csüt_pén_szo'.split('_'),
                        weekdaysMin: 'v_h_k_sze_cs_p_szo'.split('_'),
                        months: 'január_február_március_április_május_június_július_augusztus_szeptember_október_november_december'.split(
                            '_'
                        ),
                        monthsShort: 'jan_feb_márc_ápr_máj_jún_júl_aug_szept_okt_nov_dec'.split('_'),
                        ordinal: function (n) {
                            return n + '.';
                        },
                        weekStart: 1,
                        relativeTime: {
                            future: '%s múlva',
                            past: '%s',
                            s: function (n, e, t, r) {
                                return 'néhány másodperc' + (r || e ? '' : 'e');
                            },
                            m: function (n, e, t, r) {
                                return 'egy perc' + (r || e ? '' : 'e');
                            },
                            mm: function (n, e, t, r) {
                                return n + ' perc' + (r || e ? '' : 'e');
                            },
                            h: function (n, e, t, r) {
                                return 'egy ' + (r || e ? 'óra' : 'órája');
                            },
                            hh: function (n, e, t, r) {
                                return n + ' ' + (r || e ? 'óra' : 'órája');
                            },
                            d: function (n, e, t, r) {
                                return 'egy ' + (r || e ? 'nap' : 'napja');
                            },
                            dd: function (n, e, t, r) {
                                return n + ' ' + (r || e ? 'nap' : 'napja');
                            },
                            M: function (n, e, t, r) {
                                return 'egy ' + (r || e ? 'hónap' : 'hónapja');
                            },
                            MM: function (n, e, t, r) {
                                return n + ' ' + (r || e ? 'hónap' : 'hónapja');
                            },
                            y: function (n, e, t, r) {
                                return 'egy ' + (r || e ? 'év' : 'éve');
                            },
                            yy: function (n, e, t, r) {
                                return n + ' ' + (r || e ? 'év' : 'éve');
                            }
                        },
                        formats: {
                            LT: 'H:mm',
                            LTS: 'H:mm:ss',
                            L: 'YYYY.MM.DD.',
                            LL: 'YYYY. MMMM D.',
                            LLL: 'YYYY. MMMM D. H:mm',
                            LLLL: 'YYYY. MMMM D., dddd H:mm'
                        }
                    };
                return e.default.locale(t, null, !0), t;
            })(t(30));
        }
    }
]);
//# sourceMappingURL=67.chunk.js.map
