/** Notice * This file contains works from many authors under various (but compatible) licenses. Please see core.txt for more information. **/
(function () {
    (window.wpCoreControlsBundle = window.wpCoreControlsBundle || []).push([
        [1],
        {
            460: function (Ba, va, r) {
                r.r(va);
                var oa = r(0),
                    na = r(260);
                Ba = r(456);
                r = r(393);
                var ma = window,
                    fa = (function (da) {
                        function aa(y, x) {
                            var h = da.call(this, y, x) || this;
                            h.url = y;
                            h.range = x;
                            h.request = new XMLHttpRequest();
                            h.request.open('GET', h.url, !0);
                            ma.Uint8Array && (h.request.responseType = 'arraybuffer');
                            h.request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                            h.status = na.a.NOT_STARTED;
                            return h;
                        }
                        Object(oa.c)(aa, da);
                        return aa;
                    })(Ba.ByteRangeRequest);
                Ba = (function (da) {
                    function aa(y, x, h, b) {
                        y = da.call(this, y, x, h, b) || this;
                        y.Ly = fa;
                        return y;
                    }
                    Object(oa.c)(aa, da);
                    aa.prototype.uw = function (y, x) {
                        return y + '/bytes=' + x.start + ',' + (x.stop ? x.stop : '');
                    };
                    return aa;
                })(Ba['default']);
                Object(r.a)(Ba);
                Object(r.b)(Ba);
                va['default'] = Ba;
            }
        }
    ]);
}.call(this || window));
