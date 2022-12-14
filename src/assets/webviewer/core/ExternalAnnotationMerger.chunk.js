/** Notice * This file contains works from many authors under various (but compatible) licenses. Please see core.txt for more information. **/
(function () {
    (window.wpCoreControlsBundle = window.wpCoreControlsBundle || []).push([
        [5],
        {
            471: function (Ba, va, r) {
                r.r(va);
                var oa = r(0),
                    na = r(493),
                    ma = r(494),
                    fa;
                (function (da) {
                    da[(da.EXTERNAL_XFDF_NOT_REQUESTED = 0)] = 'EXTERNAL_XFDF_NOT_REQUESTED';
                    da[(da.EXTERNAL_XFDF_NOT_AVAILABLE = 1)] = 'EXTERNAL_XFDF_NOT_AVAILABLE';
                    da[(da.EXTERNAL_XFDF_AVAILABLE = 2)] = 'EXTERNAL_XFDF_AVAILABLE';
                })(fa || (fa = {}));
                Ba = (function () {
                    function da(aa) {
                        this.aa = aa;
                        this.state = fa.EXTERNAL_XFDF_NOT_REQUESTED;
                    }
                    da.prototype.Ffa = function () {
                        var aa = this;
                        return function (y, x, h) {
                            return Object(oa.b)(aa, void 0, void 0, function () {
                                var b,
                                    e,
                                    a,
                                    f,
                                    n,
                                    z,
                                    w,
                                    ea = this,
                                    ka;
                                return Object(oa.d)(this, function (ca) {
                                    switch (ca.label) {
                                        case 0:
                                            if (this.state !== fa.EXTERNAL_XFDF_NOT_REQUESTED) return [3, 2];
                                            b = this.aa.getDocument().bt();
                                            return [4, this.Nda(b)];
                                        case 1:
                                            (e = ca.ca()),
                                                (a = this.F9(e)),
                                                (this.BJ =
                                                    null !== (ka = null === a || void 0 === a ? void 0 : a.parse()) &&
                                                    void 0 !== ka
                                                        ? ka
                                                        : null),
                                                (this.state =
                                                    null === this.BJ
                                                        ? fa.EXTERNAL_XFDF_NOT_AVAILABLE
                                                        : fa.EXTERNAL_XFDF_AVAILABLE),
                                                (ca.label = 2);
                                        case 2:
                                            if (this.state === fa.EXTERNAL_XFDF_NOT_AVAILABLE) return h(y), [2];
                                            f = new DOMParser();
                                            n = f.parseFromString(y, 'text/xml');
                                            x.forEach(function (ba) {
                                                ea.merge(n, ea.BJ, ba - 1);
                                            });
                                            z = new XMLSerializer();
                                            w = z.serializeToString(n);
                                            h(w);
                                            return [2];
                                    }
                                });
                            });
                        };
                    };
                    da.prototype.zN = function (aa) {
                        this.Nda = aa;
                    };
                    da.prototype.ye = function () {
                        this.BJ = void 0;
                        this.state = fa.EXTERNAL_XFDF_NOT_REQUESTED;
                    };
                    da.prototype.F9 = function (aa) {
                        return aa
                            ? Array.isArray(aa)
                                ? new na.a(aa)
                                : 'string' !== typeof aa
                                ? null
                                : new DOMParser().parseFromString(aa, 'text/xml').querySelector('xfdf > add')
                                ? new na.a(aa)
                                : new ma.a(aa)
                            : null;
                    };
                    da.prototype.merge = function (aa, y, x) {
                        var h = this;
                        0 === x && (this.bia(aa, y.Ip), this.dia(aa, y.iJ));
                        var b = y.da[x];
                        b &&
                            (this.eia(aa, b.Jn), this.gia(aa, b.z1, y.Qw), this.fia(aa, b.page, x), this.cia(aa, b.MT));
                        b = this.aa.Nb();
                        if (x === b - 1) {
                            var e = y.Qw;
                            Object.keys(e).forEach(function (a) {
                                e[a].PK || h.OX(aa, a, e[a]);
                            });
                        }
                    };
                    da.prototype.bia = function (aa, y) {
                        null !== y && ((aa = this.bw(aa)), this.$q(aa, 'calculation-order', y));
                    };
                    da.prototype.dia = function (aa, y) {
                        null !== y && ((aa = this.bw(aa)), this.$q(aa, 'document-actions', y));
                    };
                    da.prototype.eia = function (aa, y) {
                        var x = this,
                            h = this.aw(aa.querySelector('xfdf'), 'annots');
                        Object.keys(y).forEach(function (b) {
                            x.$q(h, '[name="' + b + '"]', y[b]);
                        });
                    };
                    da.prototype.gia = function (aa, y, x) {
                        var h = this;
                        if (0 !== y.length) {
                            var b = this.bw(aa);
                            y.forEach(function (e) {
                                var a = e.getAttribute('field'),
                                    f = x[a];
                                f && (h.OX(aa, a, f), h.$q(b, 'null', e));
                            });
                        }
                    };
                    da.prototype.OX = function (aa, y, x) {
                        var h = this.bw(aa);
                        null !== x.KC && this.$q(h, 'ffield [name="' + y + '"]', x.KC);
                        aa = this.aw(aa.querySelector('xfdf'), 'fields');
                        y = y.split('.');
                        this.HM(aa, y, 0, x.value);
                        x.PK = !0;
                    };
                    da.prototype.fia = function (aa, y, x) {
                        null !== y &&
                            ((aa = this.bw(aa)),
                            (aa = this.aw(aa, 'pages')),
                            this.$q(aa, '[number="' + (x + 1) + '"]', y));
                    };
                    da.prototype.cia = function (aa, y) {
                        Object.keys(y).forEach(function (x) {
                            (x = aa.querySelector('annots [name="' + x + '"]')) && x.parentElement.removeChild(x);
                        });
                    };
                    da.prototype.HM = function (aa, y, x, h) {
                        if (x === y.length)
                            (y = document.createElementNS('', 'value')), (y.textContent = h), this.$q(aa, 'value', y);
                        else {
                            var b = y[x];
                            this.aw(aa, '[name="' + b + '"]', 'field').setAttribute('name', b);
                            aa = aa.querySelectorAll('[name="' + b + '"]');
                            1 === aa.length
                                ? this.HM(aa[0], y, x + 1, h)
                                : ((b = this.uca(aa)), this.HM(x === y.length - 1 ? b : this.tpa(aa, b), y, x + 1, h));
                        }
                    };
                    da.prototype.uca = function (aa) {
                        for (var y = null, x = 0; x < aa.length; x++) {
                            var h = aa[x];
                            if (
                                0 === h.childElementCount ||
                                (1 === h.childElementCount && 'value' === h.children[0].tagName)
                            ) {
                                y = h;
                                break;
                            }
                        }
                        return y;
                    };
                    da.prototype.tpa = function (aa, y) {
                        for (var x = 0; x < aa.length; x++) if (aa[x] !== y) return aa[x];
                        return null;
                    };
                    da.prototype.$q = function (aa, y, x) {
                        y = aa.querySelector(y);
                        null !== y && aa.removeChild(y);
                        aa.appendChild(x);
                    };
                    da.prototype.bw = function (aa) {
                        var y = aa.querySelector('pdf-info');
                        if (null !== y) return y;
                        y = this.aw(aa.querySelector('xfdf'), 'pdf-info');
                        y.setAttribute('xmlns', 'http://www.pdftron.com/pdfinfo');
                        y.setAttribute('version', '2');
                        y.setAttribute('import-version', '4');
                        return y;
                    };
                    da.prototype.aw = function (aa, y, x) {
                        var h = aa.querySelector(y);
                        if (null !== h) return h;
                        h = document.createElementNS('', x || y);
                        aa.appendChild(h);
                        return h;
                    };
                    return da;
                })();
                va['default'] = Ba;
            },
            482: function (Ba, va) {
                Ba = (function () {
                    function r() {}
                    r.prototype.oB = function (oa) {
                        var na = { Ip: null, iJ: null, Qw: {}, da: {} };
                        oa = new DOMParser().parseFromString(oa, 'text/xml');
                        na.Ip = oa.querySelector('pdf-info calculation-order');
                        na.iJ = oa.querySelector('pdf-info document-actions');
                        na.Qw = this.$ia(oa);
                        na.da = this.lja(oa);
                        return na;
                    };
                    r.prototype.$ia = function (oa) {
                        var na = oa.querySelector('fields');
                        oa = oa.querySelectorAll('pdf-info > ffield');
                        if (null === na && null === oa) return {};
                        var ma = {};
                        this.R6(ma, na);
                        this.P6(ma, oa);
                        return ma;
                    };
                    r.prototype.R6 = function (oa, na) {
                        if (null !== na && na.children) {
                            for (var ma = [], fa = 0; fa < na.children.length; fa++) {
                                var da = na.children[fa];
                                ma.push({ name: da.getAttribute('name'), element: da });
                            }
                            for (; 0 !== ma.length; )
                                for (na = ma.shift(), fa = 0; fa < na.element.children.length; fa++)
                                    (da = na.element.children[fa]),
                                        'value' === da.tagName
                                            ? (oa[na.name] = { value: da.textContent, KC: null, PK: !1 })
                                            : da.children &&
                                              ma.push({ name: na.name + '.' + da.getAttribute('name'), element: da });
                        }
                    };
                    r.prototype.P6 = function (oa, na) {
                        na.forEach(function (ma) {
                            var fa = ma.getAttribute('name');
                            oa[fa] ? (oa[fa].KC = ma) : (oa[fa] = { value: null, KC: ma, PK: !1 });
                        });
                    };
                    r.prototype.lja = function (oa) {
                        var na = this,
                            ma = {};
                        oa.querySelectorAll('pdf-info widget').forEach(function (fa) {
                            var da = parseInt(fa.getAttribute('page'), 10) - 1;
                            na.ND(ma, da);
                            ma[da].z1.push(fa);
                        });
                        oa.querySelectorAll('pdf-info page').forEach(function (fa) {
                            var da = parseInt(fa.getAttribute('number'), 10) - 1;
                            na.ND(ma, da);
                            ma[da].page = fa;
                        });
                        this.wV(oa).forEach(function (fa) {
                            var da = parseInt(fa.getAttribute('page'), 10),
                                aa = fa.getAttribute('name');
                            na.ND(ma, da);
                            ma[da].Jn[aa] = fa;
                        });
                        this.hV(oa).forEach(function (fa) {
                            var da = parseInt(fa.getAttribute('page'), 10);
                            fa = fa.textContent;
                            na.ND(ma, da);
                            ma[da].MT[fa] = !0;
                        });
                        return ma;
                    };
                    r.prototype.ND = function (oa, na) {
                        oa[na] || (oa[na] = { Jn: {}, MT: {}, z1: [], page: null });
                    };
                    return r;
                })();
                va.a = Ba;
            },
            493: function (Ba, va, r) {
                var oa = r(0),
                    na = r(1);
                r.n(na);
                Ba = (function (ma) {
                    function fa(da) {
                        var aa = ma.call(this) || this;
                        aa.fca = Array.isArray(da) ? da : [da];
                        return aa;
                    }
                    Object(oa.c)(fa, ma);
                    fa.prototype.parse = function () {
                        var da = this,
                            aa = { Ip: null, iJ: null, Qw: {}, da: {} };
                        this.fca.forEach(function (y) {
                            aa = Object(na.merge)(aa, da.oB(y));
                        });
                        return aa;
                    };
                    fa.prototype.wV = function (da) {
                        var aa = [];
                        da.querySelectorAll('add > *').forEach(function (y) {
                            aa.push(y);
                        });
                        da.querySelectorAll('modify > *').forEach(function (y) {
                            aa.push(y);
                        });
                        return aa;
                    };
                    fa.prototype.hV = function (da) {
                        return da.querySelectorAll('delete > *');
                    };
                    return fa;
                })(r(482).a);
                va.a = Ba;
            },
            494: function (Ba, va, r) {
                var oa = r(0);
                Ba = (function (na) {
                    function ma(fa) {
                        var da = na.call(this) || this;
                        da.gca = fa;
                        return da;
                    }
                    Object(oa.c)(ma, na);
                    ma.prototype.parse = function () {
                        return this.oB(this.gca);
                    };
                    ma.prototype.wV = function (fa) {
                        return fa.querySelectorAll('annots > *');
                    };
                    ma.prototype.hV = function () {
                        return [];
                    };
                    return ma;
                })(r(482).a);
                va.a = Ba;
            }
        }
    ]);
}.call(this || window));
