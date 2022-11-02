/** Notice * This file contains works from many authors under various (but compatible) licenses. Please see core.txt for more information. **/
(function () {
    (window.wpCoreControlsBundle = window.wpCoreControlsBundle || []).push([
        [6],
        {
            463: function (Ba, va, r) {
                r.r(va);
                var oa = r(0);
                Ba = r(48);
                var na = r(177),
                    ma = r(393),
                    fa = r(223),
                    da = window;
                r = (function () {
                    function aa(y, x) {
                        this.YW = function (h) {
                            h = h.split('.');
                            return h[h.length - 1].match(/(jpg|jpeg|png|gif)$/i);
                        };
                        x = x || {};
                        this.url = y;
                        this.filename = x.filename || y;
                        this.mf = x.customHeaders;
                        this.cqa = !!x.useDownloader;
                        this.withCredentials = !!x.withCredentials;
                    }
                    aa.prototype.wF = function (y) {
                        this.mf = y;
                    };
                    aa.prototype.getCustomHeaders = function () {
                        return this.mf;
                    };
                    aa.prototype.getFileData = function (y) {
                        var x = this,
                            h = this,
                            b = new XMLHttpRequest(),
                            e = 0 === this.url.indexOf('blob:') ? 'blob' : 'arraybuffer';
                        b.open('GET', this.url, !0);
                        b.withCredentials = this.withCredentials;
                        b.responseType = e;
                        this.mf &&
                            Object.keys(this.mf).forEach(function (f) {
                                b.setRequestHeader(f, x.mf[f]);
                            });
                        var a = /^https?:/i.test(this.url);
                        b.addEventListener(
                            'load',
                            function (f) {
                                return Object(oa.b)(this, void 0, void 0, function () {
                                    var n, z, w, ea, ka, ca;
                                    return Object(oa.d)(this, function (ba) {
                                        switch (ba.label) {
                                            case 0:
                                                if (200 !== this.status && (a || 0 !== this.status)) return [3, 10];
                                                h.trigger(aa.Events.DOCUMENT_LOADING_PROGRESS, [f.loaded, f.loaded]);
                                                if ('blob' !== this.responseType) return [3, 4];
                                                n = this.response;
                                                return h.YW(h.filename) ? [4, Object(fa.b)(n)] : [3, 2];
                                            case 1:
                                                return (
                                                    (z = ba.ca()),
                                                    (h.fileSize = z.byteLength),
                                                    y(new Uint8Array(z)),
                                                    [3, 3]
                                                );
                                            case 2:
                                                (w = new FileReader()),
                                                    (w.onload = function (ia) {
                                                        ia = new Uint8Array(ia.target.result);
                                                        h.fileSize = ia.length;
                                                        y(ia);
                                                    }),
                                                    w.readAsArrayBuffer(n),
                                                    (ba.label = 3);
                                            case 3:
                                                return [3, 9];
                                            case 4:
                                                ba.hg.push([4, 8, , 9]);
                                                ea = new Uint8Array(this.response);
                                                if (!h.YW(h.filename)) return [3, 6];
                                                n = new Blob([ea.buffer]);
                                                return [4, Object(fa.b)(n)];
                                            case 5:
                                                return (
                                                    (z = ba.ca()),
                                                    (h.fileSize = z.byteLength),
                                                    y(new Uint8Array(z)),
                                                    [3, 7]
                                                );
                                            case 6:
                                                (h.fileSize = ea.length), y(ea), (ba.label = 7);
                                            case 7:
                                                return [3, 9];
                                            case 8:
                                                return (
                                                    ba.ca(),
                                                    h.trigger(aa.Events.ERROR, ['pdfLoad', 'Out of memory']),
                                                    [3, 9]
                                                );
                                            case 9:
                                                return [3, 11];
                                            case 10:
                                                (ka = f.currentTarget),
                                                    (ca = Object(na.b)(ka)),
                                                    h.trigger(aa.Events.ERROR, [
                                                        'pdfLoad',
                                                        this.status + ' ' + ka.statusText,
                                                        ca
                                                    ]),
                                                    (ba.label = 11);
                                            case 11:
                                                return (h.Pz = null), [2];
                                        }
                                    });
                                });
                            },
                            !1
                        );
                        b.onprogress = function (f) {
                            h.trigger(aa.Events.DOCUMENT_LOADING_PROGRESS, [f.loaded, 0 < f.total ? f.total : 0]);
                        };
                        b.addEventListener(
                            'error',
                            function () {
                                h.trigger(aa.Events.ERROR, ['pdfLoad', 'Network failure']);
                                h.Pz = null;
                            },
                            !1
                        );
                        b.send();
                        this.Pz = b;
                    };
                    aa.prototype.getFile = function () {
                        var y = this;
                        return new Promise(function (x) {
                            da.utils.isJSWorker && x(y.url);
                            if (y.cqa) {
                                var h = Object(oa.a)({ url: y.url }, y.mf ? { customHeaders: y.mf } : {});
                                x(h);
                            }
                            x(null);
                        });
                    };
                    aa.prototype.abort = function () {
                        this.Pz && (this.Pz.abort(), (this.Pz = null));
                    };
                    aa.Events = { DOCUMENT_LOADING_PROGRESS: 'documentLoadingProgress', ERROR: 'error' };
                    return aa;
                })();
                Object(Ba.a)(r);
                Object(ma.a)(r);
                Object(ma.b)(r);
                va['default'] = r;
            }
        }
    ]);
}.call(this || window));
