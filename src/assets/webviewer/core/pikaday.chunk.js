/** Notice * This file contains works from many authors under various (but compatible) licenses. Please see core.txt for more information. **/
(function () {
    /*
 Pikaday

 Copyright © 2014 David Bushell | BSD & MIT license | https://github.com/Pikaday/Pikaday
*/
    (window.wpCoreControlsBundle = window.wpCoreControlsBundle || []).push([
        [17],
        {
            457: function (Ba, va) {
                !(function (r, oa) {
                    if ('object' == typeof va) {
                        try {
                            var na = require('moment');
                        } catch (ma) {}
                        Ba.exports = oa(na);
                    } else
                        'function' == typeof define && define.amd
                            ? define(function (ma) {
                                  try {
                                      na = ma('moment');
                                  } catch (fa) {}
                                  return oa(na);
                              })
                            : (r.Pikaday = oa(r.moment));
                })(this, function (r) {
                    function oa(ha) {
                        var la = this,
                            ja = la.config(ha);
                        la._onMouseDown = function (ra) {
                            if (la._v) {
                                var pa = (ra = ra || window.event).target || ra.srcElement;
                                if (pa)
                                    if (
                                        (n(pa, 'is-disabled') ||
                                            (!n(pa, 'pika-button') ||
                                            n(pa, 'is-empty') ||
                                            n(pa.parentNode, 'is-disabled')
                                                ? n(pa, 'pika-prev')
                                                    ? la.prevMonth()
                                                    : n(pa, 'pika-next')
                                                    ? la.nextMonth()
                                                    : n(pa, 'pika-set-today') && (la.setDate(new Date()), la.hide())
                                                : (la.setDate(
                                                      new Date(
                                                          pa.getAttribute('data-pika-year'),
                                                          pa.getAttribute('data-pika-month'),
                                                          pa.getAttribute('data-pika-day')
                                                      )
                                                  ),
                                                  ja.bound &&
                                                      ba(function () {
                                                          la.hide();
                                                          ja.blurFieldOnSelect && ja.field && ja.field.blur();
                                                      }, 100))),
                                        n(pa, 'pika-select'))
                                    )
                                        la._c = !0;
                                    else {
                                        if (!ra.preventDefault) return (ra.returnValue = !1), !1;
                                        ra.preventDefault();
                                    }
                            }
                        };
                        la._onChange = function (ra) {
                            var pa = (ra = ra || window.event).target || ra.srcElement;
                            pa &&
                                (n(pa, 'pika-select-month')
                                    ? la.gotoMonth(pa.value)
                                    : n(pa, 'pika-select-year') && la.gotoYear(pa.value));
                        };
                        la._onKeyChange = function (ra) {
                            if (((ra = ra || window.event), la.isVisible()))
                                switch (ra.keyCode) {
                                    case 13:
                                    case 27:
                                        ja.field && ja.field.blur();
                                        break;
                                    case 37:
                                        la.adjustDate('subtract', 1);
                                        break;
                                    case 38:
                                        la.adjustDate('subtract', 7);
                                        break;
                                    case 39:
                                        la.adjustDate('add', 1);
                                        break;
                                    case 40:
                                        la.adjustDate('add', 7);
                                        break;
                                    case 8:
                                    case 46:
                                        la.setDate(null);
                                }
                        };
                        la._parseFieldValue = function () {
                            if (ja.parse) return ja.parse(ja.field.value, ja.format);
                            if (ea) {
                                var ra = r(ja.field.value, ja.format, ja.formatStrict);
                                return ra && ra.isValid() ? ra.toDate() : null;
                            }
                            return new Date(Date.parse(ja.field.value));
                        };
                        la._onInputChange = function (ra) {
                            var pa;
                            ra.firedBy !== la &&
                                ((pa = la._parseFieldValue()), b(pa) && la.setDate(pa), la._v || la.show());
                        };
                        la._onInputFocus = function () {
                            la.show();
                        };
                        la._onInputClick = function () {
                            la.show();
                        };
                        la._onInputBlur = function () {
                            var ra = ca.activeElement;
                            do if (n(ra, 'pika-single')) return;
                            while ((ra = ra.parentNode));
                            la._c ||
                                (la._b = ba(function () {
                                    la.hide();
                                }, 50));
                            la._c = !1;
                        };
                        la._onClick = function (ra) {
                            var pa = (ra = ra || window.event).target || ra.srcElement;
                            if ((ra = pa)) {
                                !ka &&
                                    n(pa, 'pika-select') &&
                                    (pa.onchange ||
                                        (pa.setAttribute('onchange', 'return;'), w(pa, 'change', la._onChange)));
                                do if (n(ra, 'pika-single') || ra === ja.trigger) return;
                                while ((ra = ra.parentNode));
                                la._v && pa !== ja.trigger && ra !== ja.trigger && la.hide();
                            }
                        };
                        la.el = ca.createElement('div');
                        la.el.className =
                            'pika-single' + (ja.isRTL ? ' is-rtl' : '') + (ja.theme ? ' ' + ja.theme : '');
                        w(la.el, 'mousedown', la._onMouseDown, !0);
                        w(la.el, 'touchend', la._onMouseDown, !0);
                        w(la.el, 'change', la._onChange);
                        ja.keyboardInput && w(ca, 'keydown', la._onKeyChange);
                        ja.field &&
                            (ja.container
                                ? ja.container.appendChild(la.el)
                                : ja.bound
                                ? ca.body.appendChild(la.el)
                                : ja.field.parentNode.insertBefore(la.el, ja.field.nextSibling),
                            w(ja.field, 'change', la._onInputChange),
                            ja.defaultDate || ((ja.defaultDate = la._parseFieldValue()), (ja.setDefaultDate = !0)));
                        ha = ja.defaultDate;
                        b(ha) ? (ja.setDefaultDate ? la.setDate(ha, !0) : la.gotoDate(ha)) : la.gotoDate(new Date());
                        ja.bound
                            ? (this.hide(),
                              (la.el.className += ' is-bound'),
                              w(ja.trigger, 'click', la._onInputClick),
                              w(ja.trigger, 'focus', la._onInputFocus),
                              w(ja.trigger, 'blur', la._onInputBlur))
                            : this.show();
                    }
                    function na(ha, la, ja) {
                        return (
                            '<table cellpadding="0" cellspacing="0" class="pika-table" role="grid" aria-labelledby="' +
                            ja +
                            '">' +
                            (function (ra) {
                                var pa,
                                    sa = [];
                                ra.showWeekNumber && sa.push('<th></th>');
                                for (pa = 0; 7 > pa; pa++)
                                    sa.push(
                                        '<th scope="col"><abbr title="' +
                                            fa(ra, pa) +
                                            '">' +
                                            fa(ra, pa, !0) +
                                            '</abbr></th>'
                                    );
                                return '<thead><tr>' + (ra.isRTL ? sa.reverse() : sa).join('') + '</tr></thead>';
                            })(ha) +
                            ('<tbody>' + la.join('') + '</tbody>') +
                            (ha.showTodayButton
                                ? (function (ra) {
                                      var pa = [];
                                      return (
                                          pa.push(
                                              '<td colspan="' +
                                                  (ra.showWeekNumber ? '8' : '7') +
                                                  '"><button class="pika-set-today">' +
                                                  ra.i18n.today +
                                                  '</button></td>'
                                          ),
                                          '<tfoot>' + (ra.isRTL ? pa.reverse() : pa).join('') + '</tfoot>'
                                      );
                                  })(ha)
                                : '') +
                            '</table>'
                        );
                    }
                    function ma(ha, la, ja, ra, pa, sa) {
                        var ua,
                            qa,
                            wa = ha._o,
                            za = ja === wa.minYear,
                            Ha = ja === wa.maxYear,
                            Ia = '<div id="' + sa + '" class="pika-title" role="heading" aria-live="assertive">',
                            Aa = !0,
                            Ja = !0;
                        var Pa = [];
                        for (sa = 0; 12 > sa; sa++)
                            Pa.push(
                                '<option value="' +
                                    (ja === pa ? sa - la : 12 + sa - la) +
                                    '"' +
                                    (sa === ra ? ' selected="selected"' : '') +
                                    ((za && sa < wa.minMonth) || (Ha && sa > wa.maxMonth)
                                        ? ' disabled="disabled"'
                                        : '') +
                                    '>' +
                                    wa.i18n.months[sa] +
                                    '</option>'
                            );
                        pa =
                            '<div class="pika-label">' +
                            wa.i18n.months[ra] +
                            '<select class="pika-select pika-select-month" tabindex="-1">' +
                            Pa.join('') +
                            '</select></div>';
                        e(wa.yearRange)
                            ? ((sa = wa.yearRange[0]), (ua = wa.yearRange[1] + 1))
                            : ((sa = ja - wa.yearRange), (ua = 1 + ja + wa.yearRange));
                        for (Pa = []; sa < ua && sa <= wa.maxYear; sa++)
                            sa >= wa.minYear &&
                                Pa.push(
                                    '<option value="' +
                                        sa +
                                        '"' +
                                        (sa === ja ? ' selected="selected"' : '') +
                                        '>' +
                                        sa +
                                        '</option>'
                                );
                        return (
                            (qa =
                                '<div class="pika-label">' +
                                ja +
                                wa.yearSuffix +
                                '<select class="pika-select pika-select-year" tabindex="-1">' +
                                Pa.join('') +
                                '</select></div>'),
                            wa.showMonthAfterYear ? (Ia += qa + pa) : (Ia += pa + qa),
                            za && (0 === ra || wa.minMonth >= ra) && (Aa = !1),
                            Ha && (11 === ra || wa.maxMonth <= ra) && (Ja = !1),
                            0 === la &&
                                (Ia +=
                                    '<button class="pika-prev' +
                                    (Aa ? '' : ' is-disabled') +
                                    '" type="button">' +
                                    wa.i18n.previousMonth +
                                    '</button>'),
                            la === ha._o.numberOfMonths - 1 &&
                                (Ia +=
                                    '<button class="pika-next' +
                                    (Ja ? '' : ' is-disabled') +
                                    '" type="button">' +
                                    wa.i18n.nextMonth +
                                    '</button>'),
                            Ia + '</div>'
                        );
                    }
                    function fa(ha, la, ja) {
                        for (la += ha.firstDay; 7 <= la; ) la -= 7;
                        return ja ? ha.i18n.weekdaysShort[la] : ha.i18n.weekdays[la];
                    }
                    function da(ha) {
                        return (
                            0 > ha.month && ((ha.year -= Math.ceil(Math.abs(ha.month) / 12)), (ha.month += 12)),
                            11 < ha.month && ((ha.year += Math.floor(Math.abs(ha.month) / 12)), (ha.month -= 12)),
                            ha
                        );
                    }
                    function aa(ha, la, ja) {
                        var ra;
                        ca.createEvent
                            ? ((ra = ca.createEvent('HTMLEvents')).initEvent(la, !0, !1),
                              (ra = y(ra, ja)),
                              ha.dispatchEvent(ra))
                            : ca.createEventObject &&
                              ((ra = ca.createEventObject()), (ra = y(ra, ja)), ha.fireEvent('on' + la, ra));
                    }
                    function y(ha, la, ja) {
                        var ra, pa;
                        for (ra in la)
                            (pa = void 0 !== ha[ra]) &&
                            'object' == typeof la[ra] &&
                            null !== la[ra] &&
                            void 0 === la[ra].nodeName
                                ? b(la[ra])
                                    ? ja && (ha[ra] = new Date(la[ra].getTime()))
                                    : e(la[ra])
                                    ? ja && (ha[ra] = la[ra].slice(0))
                                    : (ha[ra] = y({}, la[ra], ja))
                                : (!ja && pa) || (ha[ra] = la[ra]);
                        return ha;
                    }
                    function x(ha) {
                        b(ha) && ha.setHours(0, 0, 0, 0);
                    }
                    function h(ha, la) {
                        return [
                            31,
                            (0 == ha % 4 && 0 != ha % 100) || 0 == ha % 400 ? 29 : 28,
                            31,
                            30,
                            31,
                            30,
                            31,
                            31,
                            30,
                            31,
                            30,
                            31
                        ][la];
                    }
                    function b(ha) {
                        return /Date/.test(Object.prototype.toString.call(ha)) && !isNaN(ha.getTime());
                    }
                    function e(ha) {
                        return /Array/.test(Object.prototype.toString.call(ha));
                    }
                    function a(ha, la) {
                        var ja;
                        ha.className = (ja = (' ' + ha.className + ' ').replace(' ' + la + ' ', ' ')).trim
                            ? ja.trim()
                            : ja.replace(/^\s+|\s+$/g, '');
                    }
                    function f(ha, la) {
                        n(ha, la) || (ha.className = '' === ha.className ? la : ha.className + ' ' + la);
                    }
                    function n(ha, la) {
                        return -1 !== (' ' + ha.className + ' ').indexOf(' ' + la + ' ');
                    }
                    function z(ha, la, ja, ra) {
                        ka ? ha.removeEventListener(la, ja, !!ra) : ha.detachEvent('on' + la, ja);
                    }
                    function w(ha, la, ja, ra) {
                        ka ? ha.addEventListener(la, ja, !!ra) : ha.attachEvent('on' + la, ja);
                    }
                    var ea = 'function' == typeof r,
                        ka = !!window.addEventListener,
                        ca = window.document,
                        ba = window.setTimeout,
                        ia = {
                            field: null,
                            bound: void 0,
                            ariaLabel: 'Use the arrow keys to pick a date',
                            position: 'bottom left',
                            reposition: !0,
                            format: 'YYYY-MM-DD',
                            toString: null,
                            parse: null,
                            defaultDate: null,
                            setDefaultDate: !1,
                            firstDay: 0,
                            firstWeekOfYearMinDays: 4,
                            formatStrict: !1,
                            minDate: null,
                            maxDate: null,
                            yearRange: 10,
                            showWeekNumber: !1,
                            showTodayButton: !1,
                            pickWholeWeek: !1,
                            minYear: 0,
                            maxYear: 9999,
                            minMonth: void 0,
                            maxMonth: void 0,
                            startRange: null,
                            endRange: null,
                            isRTL: !1,
                            yearSuffix: '',
                            showMonthAfterYear: !1,
                            showDaysInNextAndPreviousMonths: !1,
                            enableSelectionDaysInNextAndPreviousMonths: !1,
                            numberOfMonths: 1,
                            mainCalendar: 'left',
                            container: void 0,
                            blurFieldOnSelect: !0,
                            i18n: {
                                previousMonth: 'Previous Month',
                                nextMonth: 'Next Month',
                                today: 'Today',
                                months: 'January February March April May June July August September October November December'.split(
                                    ' '
                                ),
                                weekdays: 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday'.split(' '),
                                weekdaysShort: 'Sun Mon Tue Wed Thu Fri Sat'.split(' ')
                            },
                            theme: null,
                            events: [],
                            onSelect: null,
                            onOpen: null,
                            onClose: null,
                            onDraw: null,
                            keyboardInput: !0
                        };
                    return (
                        (oa.prototype = {
                            config: function (ha) {
                                this._o || (this._o = y({}, ia, !0));
                                ha = y(this._o, ha, !0);
                                ha.isRTL = !!ha.isRTL;
                                ha.field = ha.field && ha.field.nodeName ? ha.field : null;
                                ha.theme = 'string' == typeof ha.theme && ha.theme ? ha.theme : null;
                                ha.bound = !!(void 0 !== ha.bound ? ha.field && ha.bound : ha.field);
                                ha.trigger = ha.trigger && ha.trigger.nodeName ? ha.trigger : ha.field;
                                ha.disableWeekends = !!ha.disableWeekends;
                                ha.disableDayFn = 'function' == typeof ha.disableDayFn ? ha.disableDayFn : null;
                                var la = parseInt(ha.numberOfMonths, 10) || 1;
                                ((ha.numberOfMonths = 4 < la ? 4 : la),
                                b(ha.minDate) || (ha.minDate = !1),
                                b(ha.maxDate) || (ha.maxDate = !1),
                                ha.minDate && ha.maxDate && ha.maxDate < ha.minDate && (ha.maxDate = ha.minDate = !1),
                                ha.minDate && this.setMinDate(ha.minDate),
                                ha.maxDate && this.setMaxDate(ha.maxDate),
                                e(ha.yearRange))
                                    ? ((la = new Date().getFullYear() - 10),
                                      (ha.yearRange[0] = parseInt(ha.yearRange[0], 10) || la),
                                      (ha.yearRange[1] = parseInt(ha.yearRange[1], 10) || la))
                                    : ((ha.yearRange = Math.abs(parseInt(ha.yearRange, 10)) || ia.yearRange),
                                      100 < ha.yearRange && (ha.yearRange = 100));
                                return ha;
                            },
                            toString: function (ha) {
                                return (
                                    (ha = ha || this._o.format),
                                    b(this._d)
                                        ? this._o.toString
                                            ? this._o.toString(this._d, ha)
                                            : ea
                                            ? r(this._d).format(ha)
                                            : this._d.toDateString()
                                        : ''
                                );
                            },
                            getMoment: function () {
                                return ea ? r(this._d) : null;
                            },
                            setMoment: function (ha, la) {
                                ea && r.isMoment(ha) && this.setDate(ha.toDate(), la);
                            },
                            getDate: function () {
                                return b(this._d) ? new Date(this._d.getTime()) : null;
                            },
                            setDate: function (ha, la) {
                                if (!ha)
                                    return (
                                        (this._d = null),
                                        this._o.field &&
                                            ((this._o.field.value = ''),
                                            aa(this._o.field, 'change', { firedBy: this })),
                                        this.draw()
                                    );
                                if (('string' == typeof ha && (ha = new Date(Date.parse(ha))), b(ha))) {
                                    var ja = this._o.minDate,
                                        ra = this._o.maxDate;
                                    b(ja) && ha < ja ? (ha = ja) : b(ra) && ha > ra && (ha = ra);
                                    this._d = new Date(ha.getTime());
                                    this.gotoDate(this._d);
                                    this._o.field &&
                                        ((this._o.field.value = this.toString()),
                                        aa(this._o.field, 'change', { firedBy: this }));
                                    la ||
                                        'function' != typeof this._o.onSelect ||
                                        this._o.onSelect.call(this, this.getDate());
                                }
                            },
                            clear: function () {
                                this.setDate(null);
                            },
                            gotoDate: function (ha) {
                                var la = !0;
                                if (b(ha)) {
                                    if (this.calendars) {
                                        la = new Date(this.calendars[0].year, this.calendars[0].month, 1);
                                        var ja = new Date(
                                                this.calendars[this.calendars.length - 1].year,
                                                this.calendars[this.calendars.length - 1].month,
                                                1
                                            ),
                                            ra = ha.getTime();
                                        ja.setMonth(ja.getMonth() + 1);
                                        ja.setDate(ja.getDate() - 1);
                                        la = ra < la.getTime() || ja.getTime() < ra;
                                    }
                                    la &&
                                        ((this.calendars = [{ month: ha.getMonth(), year: ha.getFullYear() }]),
                                        'right' === this._o.mainCalendar &&
                                            (this.calendars[0].month += 1 - this._o.numberOfMonths));
                                    this.adjustCalendars();
                                }
                            },
                            adjustDate: function (ha, la) {
                                var ja,
                                    ra = this.getDate() || new Date();
                                la = 864e5 * parseInt(la);
                                'add' === ha
                                    ? (ja = new Date(ra.valueOf() + la))
                                    : 'subtract' === ha && (ja = new Date(ra.valueOf() - la));
                                this.setDate(ja);
                            },
                            adjustCalendars: function () {
                                this.calendars[0] = da(this.calendars[0]);
                                for (var ha = 1; ha < this._o.numberOfMonths; ha++)
                                    this.calendars[ha] = da({
                                        month: this.calendars[0].month + ha,
                                        year: this.calendars[0].year
                                    });
                                this.draw();
                            },
                            gotoToday: function () {
                                this.gotoDate(new Date());
                            },
                            gotoMonth: function (ha) {
                                isNaN(ha) || ((this.calendars[0].month = parseInt(ha, 10)), this.adjustCalendars());
                            },
                            nextMonth: function () {
                                this.calendars[0].month++;
                                this.adjustCalendars();
                            },
                            prevMonth: function () {
                                this.calendars[0].month--;
                                this.adjustCalendars();
                            },
                            gotoYear: function (ha) {
                                isNaN(ha) || ((this.calendars[0].year = parseInt(ha, 10)), this.adjustCalendars());
                            },
                            setMinDate: function (ha) {
                                ha instanceof Date
                                    ? (x(ha),
                                      (this._o.minDate = ha),
                                      (this._o.minYear = ha.getFullYear()),
                                      (this._o.minMonth = ha.getMonth()))
                                    : ((this._o.minDate = ia.minDate),
                                      (this._o.minYear = ia.minYear),
                                      (this._o.minMonth = ia.minMonth),
                                      (this._o.startRange = ia.startRange));
                                this.draw();
                            },
                            setMaxDate: function (ha) {
                                ha instanceof Date
                                    ? (x(ha),
                                      (this._o.maxDate = ha),
                                      (this._o.maxYear = ha.getFullYear()),
                                      (this._o.maxMonth = ha.getMonth()))
                                    : ((this._o.maxDate = ia.maxDate),
                                      (this._o.maxYear = ia.maxYear),
                                      (this._o.maxMonth = ia.maxMonth),
                                      (this._o.endRange = ia.endRange));
                                this.draw();
                            },
                            setStartRange: function (ha) {
                                this._o.startRange = ha;
                            },
                            setEndRange: function (ha) {
                                this._o.endRange = ha;
                            },
                            draw: function (ha) {
                                if (this._v || ha) {
                                    var la = this._o;
                                    var ja = la.minYear;
                                    var ra = la.maxYear,
                                        pa = la.minMonth,
                                        sa = la.maxMonth;
                                    ha = '';
                                    this._y <= ja && ((this._y = ja), !isNaN(pa) && this._m < pa && (this._m = pa));
                                    this._y >= ra && ((this._y = ra), !isNaN(sa) && this._m > sa && (this._m = sa));
                                    for (ra = 0; ra < la.numberOfMonths; ra++)
                                        (ja =
                                            'pika-title-' +
                                            Math.random()
                                                .toString(36)
                                                .replace(/[^a-z]+/g, '')
                                                .substr(0, 2)),
                                            (ha +=
                                                '<div class="pika-lendar">' +
                                                ma(
                                                    this,
                                                    ra,
                                                    this.calendars[ra].year,
                                                    this.calendars[ra].month,
                                                    this.calendars[0].year,
                                                    ja
                                                ) +
                                                this.render(this.calendars[ra].year, this.calendars[ra].month, ja) +
                                                '</div>');
                                    this.el.innerHTML = ha;
                                    la.bound &&
                                        'hidden' !== la.field.type &&
                                        ba(function () {
                                            la.trigger.focus();
                                        }, 1);
                                    'function' == typeof this._o.onDraw && this._o.onDraw(this);
                                    la.bound && la.field.setAttribute('aria-label', la.ariaLabel);
                                }
                            },
                            adjustPosition: function () {
                                var ha, la, ja, ra, pa, sa, ua, qa, wa;
                                if (!this._o.container) {
                                    if (
                                        ((this.el.style.position = 'absolute'),
                                        (la = ha = this._o.trigger),
                                        (ja = this.el.offsetWidth),
                                        (ra = this.el.offsetHeight),
                                        (pa = window.innerWidth || ca.documentElement.clientWidth),
                                        (sa = window.innerHeight || ca.documentElement.clientHeight),
                                        (ua = window.pageYOffset || ca.body.scrollTop || ca.documentElement.scrollTop),
                                        (qa = !0),
                                        (wa = !0),
                                        'function' == typeof ha.getBoundingClientRect)
                                    ) {
                                        var za = (la = ha.getBoundingClientRect()).left + window.pageXOffset;
                                        var Ha = la.bottom + window.pageYOffset;
                                    } else
                                        for (
                                            za = la.offsetLeft, Ha = la.offsetTop + la.offsetHeight;
                                            (la = la.offsetParent);

                                        )
                                            (za += la.offsetLeft), (Ha += la.offsetTop);
                                    ((this._o.reposition && za + ja > pa) ||
                                        (-1 < this._o.position.indexOf('right') && 0 < za - ja + ha.offsetWidth)) &&
                                        ((za = za - ja + ha.offsetWidth), (qa = !1));
                                    ((this._o.reposition && Ha + ra > sa + ua) ||
                                        (-1 < this._o.position.indexOf('top') && 0 < Ha - ra - ha.offsetHeight)) &&
                                        ((Ha = Ha - ra - ha.offsetHeight), (wa = !1));
                                    0 > za && (za = 0);
                                    0 > Ha && (Ha = 0);
                                    this.el.style.left = za + 'px';
                                    this.el.style.top = Ha + 'px';
                                    f(this.el, qa ? 'left-aligned' : 'right-aligned');
                                    f(this.el, wa ? 'bottom-aligned' : 'top-aligned');
                                    a(this.el, qa ? 'right-aligned' : 'left-aligned');
                                    a(this.el, wa ? 'top-aligned' : 'bottom-aligned');
                                }
                            },
                            render: function (ha, la, ja) {
                                var ra = this._o,
                                    pa = new Date(),
                                    sa = h(ha, la),
                                    ua = new Date(ha, la, 1).getDay(),
                                    qa = [],
                                    wa = [];
                                x(pa);
                                0 < ra.firstDay && 0 > (ua -= ra.firstDay) && (ua += 7);
                                for (
                                    var za = 0 === la ? 11 : la - 1,
                                        Ha = 11 === la ? 0 : la + 1,
                                        Ia = 0 === la ? ha - 1 : ha,
                                        Aa = 11 === la ? ha + 1 : ha,
                                        Ja = h(Ia, za),
                                        Pa = sa + ua,
                                        Ma = Pa;
                                    7 < Ma;

                                )
                                    Ma -= 7;
                                Pa += 7 - Ma;
                                for (var Ra = !1, Da = (Ma = 0); Ma < Pa; Ma++) {
                                    var Ga = new Date(ha, la, Ma - ua + 1),
                                        Sa = !!b(this._d) && Ga.getTime() === this._d.getTime(),
                                        Qa = Ga.getTime() === pa.getTime(),
                                        Ya = -1 !== ra.events.indexOf(Ga.toDateString()),
                                        db = Ma < ua || Ma >= sa + ua,
                                        Wa = Ma - ua + 1,
                                        pb = la,
                                        Va = ha,
                                        Fa = ra.startRange && ra.startRange.getTime() === Ga.getTime(),
                                        Oa = ra.endRange && ra.endRange.getTime() === Ga.getTime(),
                                        Ta = ra.startRange && ra.endRange && ra.startRange < Ga && Ga < ra.endRange;
                                    db &&
                                        (Ma < ua
                                            ? ((Wa = Ja + Wa), (pb = za), (Va = Ia))
                                            : ((Wa -= sa), (pb = Ha), (Va = Aa)));
                                    var Xa = Sa,
                                        bb;
                                    !(bb = (ra.minDate && Ga < ra.minDate) || (ra.maxDate && Ga > ra.maxDate)) &&
                                        (bb = ra.disableWeekends) &&
                                        ((bb = Ga.getDay()), (bb = 0 === bb || 6 === bb));
                                    db = {
                                        day: Wa,
                                        month: pb,
                                        year: Va,
                                        hasEvent: Ya,
                                        isSelected: Xa,
                                        isToday: Qa,
                                        isDisabled: bb || (ra.disableDayFn && ra.disableDayFn(Ga)),
                                        isEmpty: db,
                                        isStartRange: Fa,
                                        isEndRange: Oa,
                                        isInRange: Ta,
                                        showDaysInNextAndPreviousMonths: ra.showDaysInNextAndPreviousMonths,
                                        enableSelectionDaysInNextAndPreviousMonths:
                                            ra.enableSelectionDaysInNextAndPreviousMonths
                                    };
                                    ra.pickWholeWeek && Sa && (Ra = !0);
                                    Sa = wa;
                                    Ga = Sa.push;
                                    a: {
                                        Fa = db;
                                        Oa = [];
                                        Ta = 'false';
                                        if (Fa.isEmpty) {
                                            if (!Fa.showDaysInNextAndPreviousMonths) {
                                                db = '<td class="is-empty"></td>';
                                                break a;
                                            }
                                            Oa.push('is-outside-current-month');
                                            Fa.enableSelectionDaysInNextAndPreviousMonths ||
                                                Oa.push('is-selection-disabled');
                                        }
                                        db =
                                            (Fa.isDisabled && Oa.push('is-disabled'),
                                            Fa.isToday && Oa.push('is-today'),
                                            Fa.isSelected && (Oa.push('is-selected'), (Ta = 'true')),
                                            Fa.hasEvent && Oa.push('has-event'),
                                            Fa.isInRange && Oa.push('is-inrange'),
                                            Fa.isStartRange && Oa.push('is-startrange'),
                                            Fa.isEndRange && Oa.push('is-endrange'),
                                            '<td data-day="' +
                                                Fa.day +
                                                '" class="' +
                                                Oa.join(' ') +
                                                '" aria-selected="' +
                                                Ta +
                                                '"><button class="pika-button pika-day" type="button" data-pika-year="' +
                                                Fa.year +
                                                '" data-pika-month="' +
                                                Fa.month +
                                                '" data-pika-day="' +
                                                Fa.day +
                                                '">' +
                                                Fa.day +
                                                '</button></td>');
                                    }
                                    Ga.call(Sa, db);
                                    7 == ++Da &&
                                        (ra.showWeekNumber &&
                                            ((Da = wa),
                                            (Sa = Da.unshift),
                                            (Fa = ra.firstWeekOfYearMinDays),
                                            (Ga = new Date(ha, la, Ma - ua)),
                                            ea
                                                ? (Ga = r(Ga).isoWeek())
                                                : (Ga.setHours(0, 0, 0, 0),
                                                  (Oa = Ga.getDate()),
                                                  (db = Fa - 1),
                                                  Ga.setDate(Oa + db - ((Ga.getDay() + 7 - 1) % 7)),
                                                  (Fa = new Date(Ga.getFullYear(), 0, Fa)),
                                                  (Ga =
                                                      1 +
                                                      Math.round(
                                                          ((Ga.getTime() - Fa.getTime()) / 864e5 -
                                                              db +
                                                              ((Fa.getDay() + 7 - 1) % 7)) /
                                                              7
                                                      ))),
                                            Sa.call(Da, '<td class="pika-week">' + Ga + '</td>')),
                                        (Da = qa),
                                        (Sa = Da.push),
                                        (wa =
                                            '<tr class="pika-row' +
                                            (ra.pickWholeWeek ? ' pick-whole-week' : '') +
                                            (Ra ? ' is-selected' : '') +
                                            '">' +
                                            (ra.isRTL ? wa.reverse() : wa).join('') +
                                            '</tr>'),
                                        Sa.call(Da, wa),
                                        (wa = []),
                                        (Da = 0),
                                        (Ra = !1));
                                }
                                return na(ra, qa, ja);
                            },
                            isVisible: function () {
                                return this._v;
                            },
                            show: function () {
                                this.isVisible() ||
                                    ((this._v = !0),
                                    this.draw(),
                                    a(this.el, 'is-hidden'),
                                    this._o.bound && (w(ca, 'click', this._onClick), this.adjustPosition()),
                                    'function' == typeof this._o.onOpen && this._o.onOpen.call(this));
                            },
                            hide: function () {
                                var ha = this._v;
                                !1 !== ha &&
                                    (this._o.bound && z(ca, 'click', this._onClick),
                                    this._o.container ||
                                        ((this.el.style.position = 'static'),
                                        (this.el.style.left = 'auto'),
                                        (this.el.style.top = 'auto')),
                                    f(this.el, 'is-hidden'),
                                    (this._v = !1),
                                    void 0 !== ha &&
                                        'function' == typeof this._o.onClose &&
                                        this._o.onClose.call(this));
                            },
                            destroy: function () {
                                var ha = this._o;
                                this.hide();
                                z(this.el, 'mousedown', this._onMouseDown, !0);
                                z(this.el, 'touchend', this._onMouseDown, !0);
                                z(this.el, 'change', this._onChange);
                                ha.keyboardInput && z(ca, 'keydown', this._onKeyChange);
                                ha.field &&
                                    (z(ha.field, 'change', this._onInputChange),
                                    ha.bound &&
                                        (z(ha.trigger, 'click', this._onInputClick),
                                        z(ha.trigger, 'focus', this._onInputFocus),
                                        z(ha.trigger, 'blur', this._onInputBlur)));
                                this.el.parentNode && this.el.parentNode.removeChild(this.el);
                            }
                        }),
                        oa
                    );
                });
            }
        }
    ]);
}.call(this || window));
