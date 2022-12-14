/** Notice * This file contains works from many authors under various (but compatible) licenses. Please see core.txt for more information. **/
(function () {
    (window.wpCoreControlsBundle = window.wpCoreControlsBundle || []).push([
        [0],
        {
            456: function (Ba, va, r) {
                r.r(va);
                r.d(va, 'ByteRangeRequest', function () {
                    return z;
                });
                var oa = r(0),
                    na = r(1);
                r.n(na);
                var ma = r(2),
                    fa = r(157);
                Ba = r(99);
                var da = r(261),
                    aa = r(78),
                    y = r(74),
                    x = r(260),
                    h = r(177);
                r = r(393);
                var b = [],
                    e = [],
                    a = window,
                    f = (function () {
                        return function () {
                            this.Km = 1;
                        };
                    })(),
                    n;
                (function (ea) {
                    ea[(ea.UNSENT = 0)] = 'UNSENT';
                    ea[(ea.DONE = 4)] = 'DONE';
                })(n || (n = {}));
                var z = (function () {
                        function ea(ka, ca, ba, ia) {
                            var ha = this;
                            this.url = ka;
                            this.range = ca;
                            this.mf = ba;
                            this.withCredentials = ia;
                            this.D4 = n;
                            this.request = new XMLHttpRequest();
                            this.request.open('GET', this.url, !0);
                            a.Uint8Array && (this.request.responseType = 'arraybuffer');
                            ia && (this.request.withCredentials = ia);
                            w.DISABLE_RANGE_HEADER ||
                                (Object(na.isUndefined)(ca.stop)
                                    ? this.request.setRequestHeader('Range', 'bytes=' + ca.start)
                                    : this.request.setRequestHeader(
                                          'Range',
                                          ['bytes=', ca.start, '-', ca.stop - 1].join('')
                                      ));
                            ba &&
                                Object.keys(ba).forEach(function (la) {
                                    ha.request.setRequestHeader(la, ba[la]);
                                });
                            this.request.overrideMimeType
                                ? this.request.overrideMimeType('text/plain; charset=x-user-defined')
                                : this.request.setRequestHeader('Accept-Charset', 'x-user-defined');
                            this.status = x.a.NOT_STARTED;
                        }
                        ea.prototype.start = function (ka) {
                            var ca = this,
                                ba = this.request;
                            ba.onreadystatechange = function () {
                                if (ca.aborted) return (ca.status = x.a.ABORTED), ka({ code: x.a.ABORTED });
                                if (this.readyState === ca.D4.DONE) {
                                    ca.nD();
                                    var ia = 0 === window.document.URL.indexOf('file:///');
                                    200 === ba.status || 206 === ba.status || (ia && 0 === ba.status)
                                        ? ((ia = a.JV(this)), ca.mO(ia, ka))
                                        : ((ca.status = x.a.ERROR), ka({ code: ca.status, status: ca.status }));
                                }
                            };
                            this.request.send(null);
                            this.status = x.a.STARTED;
                        };
                        ea.prototype.mO = function (ka, ca) {
                            this.status = x.a.SUCCESS;
                            if (ca) return ca(!1, ka);
                        };
                        ea.prototype.abort = function () {
                            this.nD();
                            this.aborted = !0;
                            this.request.abort();
                        };
                        ea.prototype.nD = function () {
                            var ka = Object(h.c)(this.url, this.range, e);
                            -1 !== ka && e.splice(ka, 1);
                            if (0 < b.length) {
                                ka = b.shift();
                                var ca = new ea(ka.url, ka.range, this.mf, this.withCredentials);
                                ka.request = ca;
                                e.push(ka);
                                ca.start(Object(h.d)(ka));
                            }
                        };
                        ea.prototype.extend = function (ka) {
                            var ca = Object.assign({}, this, ka.prototype);
                            ca.constructor = ka;
                            return ca;
                        };
                        return ea;
                    })(),
                    w = (function (ea) {
                        function ka(ca, ba, ia, ha, la) {
                            ia = ea.call(this, ca, ia, ha) || this;
                            ia.tj = {};
                            ia.PB = ba;
                            ia.url = ca;
                            ia.DISABLE_RANGE_HEADER = !1;
                            ia.Ly = z;
                            ia.fP = 3;
                            ia.mf = la || {};
                            return ia;
                        }
                        Object(oa.c)(ka, ea);
                        ka.prototype.uw = function (ca, ba, ia) {
                            var ha = -1 === ca.indexOf('?') ? '?' : '&';
                            switch (ia) {
                                case !1:
                                case y.a.NEVER_CACHE:
                                    ca = ca + ha + '_=' + Object(na.uniqueId)();
                                    break;
                                case !0:
                                case y.a.CACHE:
                                    ca =
                                        ca +
                                        ha +
                                        '_=' +
                                        ba.start +
                                        ',' +
                                        (Object(na.isUndefined)(ba.stop) ? '' : ba.stop);
                            }
                            return ca;
                        };
                        ka.prototype.uT = function (ca, ba, ia, ha) {
                            void 0 === ia && (ia = {});
                            return new this.Ly(ca, ba, ia, ha);
                        };
                        ka.prototype.Vba = function (ca, ba, ia, ha, la) {
                            for (var ja = 0; ja < b.length; ja++)
                                if (Object(na.isEqual)(b[ja].range, ba) && Object(na.isEqual)(b[ja].url, ca))
                                    return b[ja].bh.push(ha), b[ja].tE++, null;
                            for (ja = 0; ja < e.length; ja++)
                                if (Object(na.isEqual)(e[ja].range, ba) && Object(na.isEqual)(e[ja].url, ca))
                                    return e[ja].bh.push(ha), e[ja].tE++, null;
                            ia = { url: ca, range: ba, PB: ia, bh: [ha], tE: 1 };
                            if (0 === b.length && e.length < this.fP)
                                return e.push(ia), (ia.request = this.uT(ca, ba, la, this.withCredentials)), ia;
                            b.push(ia);
                            return null;
                        };
                        ka.prototype.Ao = function (ca, ba, ia) {
                            var ha = this.uw(ca, ba, this.PB);
                            (ca = this.Vba(ha, ba, this.PB, ia, this.mf)) && ca.request.start(Object(h.d)(ca));
                            return function () {
                                var la = Object(h.c)(ha, ba, e);
                                if (-1 !== la) {
                                    var ja = --e[la].tE;
                                    0 === ja && e[la].request && e[la].request.abort();
                                } else
                                    (la = Object(h.c)(ha, ba, b)),
                                        -1 !== la && ((ja = --b[la].tE), 0 === ja && b.splice(la, 1));
                            };
                        };
                        ka.prototype.mV = function () {
                            return { start: -fa.a };
                        };
                        ka.prototype.Nfa = function () {
                            var ca = -(fa.a + fa.e);
                            return { start: ca - fa.d, end: ca };
                        };
                        ka.prototype.Ut = function (ca) {
                            var ba = this;
                            this.VB = !0;
                            var ia = fa.a;
                            this.Ao(this.url, this.mV(), function (ha, la, ja) {
                                function ra() {
                                    var pa = ba.Ad.iV();
                                    ba.Ao(ba.url, pa, function (sa, ua) {
                                        if (sa) return Object(ma.j)('Error loading central directory: ' + sa), ca(sa);
                                        ua = Object(aa.a)(ua);
                                        if (ua.length !== pa.stop - pa.start)
                                            return ca(
                                                'Invalid XOD file: Zip central directory data is wrong size! Should be ' +
                                                    (pa.stop - pa.start) +
                                                    ' but is ' +
                                                    ua.length
                                            );
                                        ba.Ad.lZ(ua);
                                        ba.HI = !0;
                                        ba.VB = !1;
                                        return ca(!1);
                                    });
                                }
                                if (ha) return Object(ma.j)('Error loading end header: ' + ha), ca(ha, la, ja);
                                la = Object(aa.a)(la);
                                if (la.length !== ia) return ca('Invalid XOD file: Zip end header data is wrong size!');
                                try {
                                    ba.Ad = new da.a(la);
                                } catch (pa) {
                                    return ca(pa);
                                }
                                ba.Ad.wha
                                    ? ba.Ao(ba.url, ba.Nfa(), function (pa, sa) {
                                          if (pa) return Object(ma.j)('Error loading zip64 header: ' + pa), ca(pa);
                                          sa = Object(aa.a)(sa);
                                          ba.Ad.Pha(sa);
                                          ra();
                                      })
                                    : ra();
                            });
                        };
                        ka.prototype.GV = function (ca) {
                            ca(Object.keys(this.Ad.Yn));
                        };
                        ka.prototype.LM = function (ca, ba) {
                            var ia = this;
                            if (this.Ad.jT(ca)) {
                                var ha = this.Ad.gx(ca);
                                if (ha in this.tj) {
                                    var la = this.vh[ca];
                                    la.As = this.tj[ha];
                                    la.As.Km++;
                                    la.cancel = la.As.cancel;
                                } else {
                                    var ja = this.Ad.Uda(ca),
                                        ra = this.Ao(this.url, ja, function (sa, ua) {
                                            sa
                                                ? (Object(ma.j)('Error loading part "' + ca + '": ' + sa),
                                                  ia.Ao(ia.url, ja, function (qa, wa) {
                                                      if (qa) return ba(qa, ca);
                                                      ia.pZ(wa, ja, ha, ca, ba);
                                                  }))
                                                : ia.pZ(ua, ja, ha, ca, ba);
                                        }),
                                        pa = this.vh[ca];
                                    pa &&
                                        ((pa.C0 = !0),
                                        (pa.cancel = function () {
                                            pa.As.Km--;
                                            0 === pa.As.Km && (ra(), delete ia.tj[ha]);
                                        }),
                                        (this.tj[ha] = new f(ha)),
                                        (pa.As = this.tj[ha]),
                                        (pa.As.cancel = pa.cancel));
                                }
                            } else delete this.vh[ca], ba(Error('File not found: "' + ca + '"'), ca);
                        };
                        ka.prototype.pZ = function (ca, ba, ia, ha, la) {
                            if (ca.length !== ba.stop - ba.start) la(Error('Part data is wrong size!'), ha);
                            else {
                                do {
                                    if (!this.tj[ia]) return;
                                    ha = this.tj[ia].Km;
                                    for (var ja = ba.ar.length, ra = 0; ra < ja; ++ra) {
                                        var pa = ba.ar[ra];
                                        la(
                                            !1,
                                            pa.Xq,
                                            ca['string' === typeof ca ? 'substring' : 'subarray'](pa.start, pa.stop),
                                            this.Ad.NW(pa.Xq)
                                        );
                                        pa.Xq in this.vh && delete this.vh[pa.Xq];
                                    }
                                } while (ha !== this.tj[ia].Km);
                                delete this.tj[ia];
                            }
                        };
                        ka.DISABLE_RANGE_HEADER = !1;
                        ka.fP = 3;
                        return ka;
                    })(Ba.a);
                (function (ea) {
                    function ka(ca, ba, ia) {
                        var ha = ea.call(this) || this,
                            la;
                        for (la in ca) ha[la] = ca[la];
                        ha.wta = ca;
                        ha.startOffset = ba;
                        ha.endOffset = ia;
                        ha.uT = function (ja, ra, pa, sa) {
                            Object(na.isUndefined)(ra.stop)
                                ? ((ra.start += ha.endOffset), (ra.stop = ha.endOffset))
                                : ((ra.start += ha.startOffset), (ra.stop += ha.startOffset));
                            ja = ha.uw(ha.url, ra, ha.PB);
                            return new ca.Ly(ja, ra, pa, sa);
                        };
                        return ha;
                    }
                    Object(oa.c)(ka, ea);
                    return ka;
                })(w);
                Object(r.a)(w);
                Object(r.b)(w);
                va['default'] = w;
            }
        }
    ]);
}.call(this || window));
