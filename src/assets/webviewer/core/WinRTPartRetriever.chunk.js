/** Notice * This file contains works from many authors under various (but compatible) licenses. Please see core.txt for more information. **/
(function () {
    (window.wpCoreControlsBundle = window.wpCoreControlsBundle || []).push([
        [15],
        {
            466: function (Ba, va, r) {
                r.r(va);
                var oa = r(0),
                    na = r(260);
                Ba = r(456);
                var ma = r(99);
                r = r(393);
                var fa = {},
                    da = (function (aa) {
                        function y(x, h) {
                            var b = aa.call(this, x, h) || this;
                            b.url = x;
                            b.range = h;
                            b.status = na.a.NOT_STARTED;
                            return b;
                        }
                        Object(oa.c)(y, aa);
                        y.prototype.start = function (x) {
                            var h = this;
                            'undefined' === typeof fa[this.range.start] &&
                                ((fa[this.range.start] = {
                                    mO: function (b) {
                                        var e = atob(b),
                                            a,
                                            f = e.length;
                                        b = new Uint8Array(f);
                                        for (a = 0; a < f; ++a) b[a] = e.charCodeAt(a);
                                        e = b.length;
                                        a = '';
                                        for (var n = 0; n < e; )
                                            (f = b.subarray(n, n + 1024)),
                                                (n += 1024),
                                                (a += String.fromCharCode.apply(null, f));
                                        h.mO(a, x);
                                    },
                                    Asa: function () {
                                        h.status = na.a.ERROR;
                                        x({ code: h.status });
                                    }
                                }),
                                window.external.notify(this.url),
                                (this.status = na.a.STARTED));
                            h.nD();
                        };
                        return y;
                    })(Ba.ByteRangeRequest);
                Ba = (function (aa) {
                    function y(x, h, b, e) {
                        x = aa.call(this, x, b, e) || this;
                        x.Ly = da;
                        return x;
                    }
                    Object(oa.c)(y, aa);
                    y.prototype.uw = function (x, h) {
                        return x + '?' + h.start + '&' + (h.stop ? h.stop : '');
                    };
                    return y;
                })(ma.a);
                Object(r.a)(Ba);
                Object(r.b)(Ba);
                va['default'] = Ba;
            }
        }
    ]);
}.call(this || window));
