/** Notice * This file contains works from many authors under various (but compatible) licenses. Please see core.txt for more information. **/
(function () {
    (window.wpCoreControlsBundle = window.wpCoreControlsBundle || []).push([
        [7],
        {
            464: function (Ba, va, r) {
                r.r(va);
                var oa = r(0),
                    na = r(260);
                Ba = r(456);
                r(22);
                r = r(393);
                var ma = (function (fa) {
                    function da(aa, y) {
                        var x = fa.call(this, aa, y) || this;
                        x.url = aa;
                        x.range = y;
                        x.status = na.a.NOT_STARTED;
                        return x;
                    }
                    Object(oa.c)(da, fa);
                    da.prototype.start = function () {
                        var aa = document.createElement('IFRAME');
                        aa.setAttribute('src', this.url);
                        document.documentElement.appendChild(aa);
                        aa.parentNode.removeChild(aa);
                        this.status = na.a.STARTED;
                        this.nD();
                    };
                    return da;
                })(Ba.ByteRangeRequest);
                Ba = (function (fa) {
                    function da(aa, y, x, h) {
                        aa = fa.call(this, aa, y, x, h) || this;
                        aa.Ly = ma;
                        return aa;
                    }
                    Object(oa.c)(da, fa);
                    da.prototype.uw = function (aa, y) {
                        return aa + '#' + y.start + '&' + (y.stop ? y.stop : '');
                    };
                    return da;
                })(Ba['default']);
                Object(r.a)(Ba);
                Object(r.b)(Ba);
                va['default'] = Ba;
            }
        }
    ]);
}.call(this || window));
