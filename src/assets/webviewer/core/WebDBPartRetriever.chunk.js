/** Notice * This file contains works from many authors under various (but compatible) licenses. Please see core.txt for more information. **/
(function () {
    (window.wpCoreControlsBundle = window.wpCoreControlsBundle || []).push([
        [13],
        {
            468: function (Ba, va, r) {
                r.r(va);
                var oa = r(0),
                    na = r(1);
                r.n(na);
                Ba = r(99);
                r = r(393);
                Ba = (function (ma) {
                    function fa(da, aa, y) {
                        aa = ma.call(this, da, aa, y) || this;
                        aa.db = da;
                        return aa;
                    }
                    Object(oa.c)(fa, ma);
                    fa.prototype.request = function (da) {
                        var aa = this;
                        Object(na.each)(da, function (y) {
                            aa.db.get(y, function (x, h, b) {
                                return x
                                    ? aa.trigger('partReady', { fb: y, error: x })
                                    : aa.trigger('partReady', { fb: y, data: h, Qi: !1, rg: !1, error: null, fd: b });
                            });
                        });
                    };
                    fa.prototype.Ut = function (da) {
                        da();
                    };
                    return fa;
                })(Ba.a);
                Object(r.a)(Ba);
                Object(r.b)(Ba);
                va['default'] = Ba;
            }
        }
    ]);
}.call(this || window));
