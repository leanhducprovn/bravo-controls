/** Notice * This file contains works from many authors under various (but compatible) licenses. Please see core.txt for more information. **/
(function () {
    (window.wpCoreControlsBundle = window.wpCoreControlsBundle || []).push([
        [9],
        {
            459: function (Ba, va, r) {
                r.r(va);
                var oa = r(0);
                Ba = r(48);
                var na = r(393),
                    ma = r(223),
                    fa = r(20),
                    da = window;
                r = (function () {
                    function aa(y) {
                        var x = this;
                        this.Vga = function (h) {
                            return (
                                h &&
                                ('image' === h.type.split('/')[0].toLowerCase() ||
                                    (h.name && !!h.name.match(/.(jpg|jpeg|png|gif)$/i)))
                            );
                        };
                        this.file = y;
                        this.iha = new Promise(function (h) {
                            return Object(oa.b)(x, void 0, void 0, function () {
                                var b;
                                return Object(oa.d)(this, function (e) {
                                    switch (e.label) {
                                        case 0:
                                            return this.Vga(this.file) ? [4, Object(ma.b)(y)] : [3, 2];
                                        case 1:
                                            (b = e.ca()),
                                                (this.file = fa.q
                                                    ? new Blob([b], { type: y.type })
                                                    : new File([b], null === y || void 0 === y ? void 0 : y.name, {
                                                          type: y.type
                                                      })),
                                                (e.label = 2);
                                        case 2:
                                            return h(!0), [2];
                                    }
                                });
                            });
                        });
                    }
                    aa.prototype.getFileData = function (y) {
                        var x = this,
                            h = new FileReader();
                        h.onload = function (b) {
                            x.trigger(aa.Events.DOCUMENT_LOADING_PROGRESS, [b.loaded, b.loaded]);
                            y(new Uint8Array(b.target.result));
                        };
                        h.onprogress = function (b) {
                            b.lengthComputable &&
                                x.trigger(aa.Events.DOCUMENT_LOADING_PROGRESS, [b.loaded, 0 < b.total ? b.total : 0]);
                        };
                        h.readAsArrayBuffer(this.file);
                    };
                    aa.prototype.getFile = function () {
                        return Object(oa.b)(this, void 0, Promise, function () {
                            return Object(oa.d)(this, function (y) {
                                switch (y.label) {
                                    case 0:
                                        return [4, this.iha];
                                    case 1:
                                        return y.ca(), da.utils.isJSWorker ? [2, this.file.path] : [2, this.file];
                                }
                            });
                        });
                    };
                    aa.Events = { DOCUMENT_LOADING_PROGRESS: 'documentLoadingProgress' };
                    return aa;
                })();
                Object(Ba.a)(r);
                Object(na.a)(r);
                Object(na.b)(r);
                va['default'] = r;
            }
        }
    ]);
}.call(this || window));
