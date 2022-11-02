(window.webpackJsonp = window.webpackJsonp || []).push([
    [11],
    {
        1232: function (_, t, e) {
            _.exports = (function (_) {
                'use strict';
                var t = (function (_) {
                        return _ && 'object' == typeof _ && 'default' in _ ? _ : { default: _ };
                    })(_),
                    e = {
                        name: 'ar-tn',
                        weekdays: 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
                        months: 'جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
                        weekStart: 1,
                        weekdaysShort: 'أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_'),
                        monthsShort: 'جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split(
                            '_'
                        ),
                        weekdaysMin: 'ح_ن_ث_ر_خ_ج_س'.split('_'),
                        ordinal: function (_) {
                            return _;
                        },
                        formats: {
                            LT: 'HH:mm',
                            LTS: 'HH:mm:ss',
                            L: 'DD/MM/YYYY',
                            LL: 'D MMMM YYYY',
                            LLL: 'D MMMM YYYY HH:mm',
                            LLLL: 'dddd D MMMM YYYY HH:mm'
                        },
                        meridiem: function (_) {
                            return _ > 12 ? 'ص' : 'م';
                        },
                        relativeTime: {
                            future: 'في %s',
                            past: 'منذ %s',
                            s: 'ثوان',
                            m: 'دقيقة',
                            mm: '%d دقائق',
                            h: 'ساعة',
                            hh: '%d ساعات',
                            d: 'يوم',
                            dd: '%d أيام',
                            M: 'شهر',
                            MM: '%d أشهر',
                            y: 'سنة',
                            yy: '%d سنوات'
                        }
                    };
                return t.default.locale(e, null, !0), e;
            })(e(30));
        }
    }
]);
//# sourceMappingURL=11.chunk.js.map
