(window.webpackJsonp = window.webpackJsonp || []).push([
    [86],
    {
        1307: function (e, _, t) {
            e.exports = (function (e) {
                'use strict';
                var _ = (function (e) {
                        return e && 'object' == typeof e && 'default' in e ? e : { default: e };
                    })(e),
                    t = {
                        name: 'me',
                        weekdays: 'nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota'.split('_'),
                        months: 'januar_februar_mart_april_maj_jun_jul_avgust_septembar_oktobar_novembar_decembar'.split(
                            '_'
                        ),
                        weekStart: 1,
                        weekdaysShort: 'ned._pon._uto._sri._čet._pet._sub.'.split('_'),
                        monthsShort: 'jan._feb._mar._apr._maj_jun_jul_avg._sep._okt._nov._dec.'.split('_'),
                        weekdaysMin: 'ne_po_ut_sr_če_pe_su'.split('_'),
                        ordinal: function (e) {
                            return e;
                        },
                        formats: {
                            LT: 'H:mm',
                            LTS: 'H:mm:ss',
                            L: 'DD.MM.YYYY',
                            LL: 'D. MMMM YYYY',
                            LLL: 'D. MMMM YYYY H:mm',
                            LLLL: 'dddd, D. MMMM YYYY H:mm'
                        }
                    };
                return _.default.locale(t, null, !0), t;
            })(t(30));
        }
    }
]);
//# sourceMappingURL=86.chunk.js.map
