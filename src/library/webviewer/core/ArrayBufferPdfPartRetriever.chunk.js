/** Notice * This file contains works from many authors under various (but compatible) licenses. Please see core.txt for more information. **/
(function () {
    (window.wpCoreControlsBundle = window.wpCoreControlsBundle || []).push([
        [2],
        {
            461: function (Ba, va, r) {
                r.r(va);
                Ba = r(48);
                r = r(393);
                var oa = (function () {
                    function na(ma) {
                        this.buffer = ma;
                        this.fileSize = null === ma || void 0 === ma ? void 0 : ma.byteLength;
                    }
                    na.prototype.getFileData = function (ma) {
                        ma(new Uint8Array(this.buffer));
                    };
                    na.prototype.getFile = function () {
                        return Promise.resolve(null);
                    };
                    return na;
                })();
                Object(Ba.a)(oa);
                Object(r.a)(oa);
                Object(r.b)(oa);
                va['default'] = oa;
            }
        }
    ]);
}.call(this || window));
