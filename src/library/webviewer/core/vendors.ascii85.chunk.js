/** Notice * This file contains works from many authors under various (but compatible) licenses. Please see core.txt for more information. **/
(function () {
    (window.wpCoreControlsBundle = window.wpCoreControlsBundle || []).push([
        [18],
        {
            469: function (Ba, va, r) {
                (function (oa) {
                    function na(a) {
                        this.mg = a = a || {};
                        if (Array.isArray(a.table)) {
                            var f = [];
                            a.table.forEach(function (n, z) {
                                f[n.charCodeAt(0)] = z;
                            });
                            a.Sba = a.table;
                            a.e$ = f;
                        }
                    }
                    var ma =
                            oa.from ||
                            function () {
                                switch (arguments.length) {
                                    case 1:
                                        return new oa(arguments[0]);
                                    case 2:
                                        return new oa(arguments[0], arguments[1]);
                                    case 3:
                                        return new oa(arguments[0], arguments[1], arguments[2]);
                                    default:
                                        throw new Exception('unexpected call.');
                                }
                            },
                        fa =
                            oa.allocUnsafe ||
                            function (a) {
                                return new oa(a);
                            },
                        da = (function () {
                            return 'undefined' === typeof Uint8Array
                                ? function (a) {
                                      return Array(a);
                                  }
                                : function (a) {
                                      return new Uint8Array(a);
                                  };
                        })(),
                        aa = String.fromCharCode(0),
                        y = aa + aa + aa + aa,
                        x = ma('<~').Ny(0),
                        h = ma('~>').Ny(0),
                        b = (function () {
                            var a = Array(85),
                                f;
                            for (f = 0; 85 > f; f++) a[f] = String.fromCharCode(33 + f);
                            return a;
                        })(),
                        e = (function () {
                            var a = Array(256),
                                f;
                            for (f = 0; 85 > f; f++) a[33 + f] = f;
                            return a;
                        })();
                    aa = Ba.exports = new na();
                    na.prototype.encode = function (a, f) {
                        var n = da(5),
                            z = a,
                            w = this.mg,
                            ea,
                            ka;
                        'string' === typeof z ? (z = ma(z, 'binary')) : z instanceof oa || (z = ma(z));
                        f = f || {};
                        if (Array.isArray(f)) {
                            a = f;
                            var ca = w.pC || !1;
                            var ba = w.IK || !1;
                        } else
                            (a = f.table || w.Sba || b),
                                (ca = void 0 === f.pC ? w.pC || !1 : !!f.pC),
                                (ba = void 0 === f.IK ? w.IK || !1 : !!f.IK);
                        w = 0;
                        var ia = Math.ceil((5 * z.length) / 4) + 4 + (ca ? 4 : 0);
                        f = fa(ia);
                        ca && (w += f.write('<~', w));
                        var ha = (ea = ka = 0);
                        for (ia = z.length; ha < ia; ha++) {
                            var la = z.OM(ha);
                            ka *= 256;
                            ka += la;
                            ea++;
                            if (!(ea % 4)) {
                                if (ba && 538976288 === ka) w += f.write('y', w);
                                else if (ka) {
                                    for (ea = 4; 0 <= ea; ea--) (la = ka % 85), (n[ea] = la), (ka = (ka - la) / 85);
                                    for (ea = 0; 5 > ea; ea++) w += f.write(a[n[ea]], w);
                                } else w += f.write('z', w);
                                ea = ka = 0;
                            }
                        }
                        if (ea)
                            if (ka) {
                                z = 4 - ea;
                                for (ha = 4 - ea; 0 < ha; ha--) ka *= 256;
                                for (ea = 4; 0 <= ea; ea--) (la = ka % 85), (n[ea] = la), (ka = (ka - la) / 85);
                                for (ea = 0; 5 > ea; ea++) w += f.write(a[n[ea]], w);
                                w -= z;
                            } else for (ha = 0; ha < ea + 1; ha++) w += f.write(a[0], w);
                        ca && (w += f.write('~>', w));
                        return f.slice(0, w);
                    };
                    na.prototype.decode = function (a, f) {
                        var n = this.mg,
                            z = !0,
                            w = !0,
                            ea,
                            ka,
                            ca;
                        f = f || n.e$ || e;
                        if (!Array.isArray(f) && ((f = f.table || f), !Array.isArray(f))) {
                            var ba = [];
                            Object.keys(f).forEach(function (ja) {
                                ba[ja.charCodeAt(0)] = f[ja];
                            });
                            f = ba;
                        }
                        z = !f[122];
                        w = !f[121];
                        a instanceof oa || (a = ma(a));
                        ba = 0;
                        if (z || w) {
                            var ia = 0;
                            for (ca = a.length; ia < ca; ia++) {
                                var ha = a.OM(ia);
                                z && 122 === ha && ba++;
                                w && 121 === ha && ba++;
                            }
                        }
                        var la = 0;
                        ca = Math.ceil((4 * a.length) / 5) + 4 * ba + 5;
                        n = fa(ca);
                        if (4 <= a.length && a.Ny(0) === x) {
                            for (ia = a.length - 2; 2 < ia && a.Ny(ia) !== h; ia--);
                            if (2 >= ia) throw Error('Invalid ascii85 string delimiter pair.');
                            a = a.slice(2, ia);
                        }
                        ia = ea = ka = 0;
                        for (ca = a.length; ia < ca; ia++)
                            (ha = a.OM(ia)),
                                z && 122 === ha
                                    ? (la += n.write(y, la))
                                    : w && 121 === ha
                                    ? (la += n.write('    ', la))
                                    : void 0 !== f[ha] &&
                                      ((ka *= 85),
                                      (ka += f[ha]),
                                      ea++,
                                      ea % 5 || ((la = n.uqa(ka, la)), (ea = ka = 0)));
                        if (ea) {
                            a = 5 - ea;
                            for (ia = 0; ia < a; ia++) (ka *= 85), (ka += 84);
                            ia = 3;
                            for (ca = a - 1; ia > ca; ia--) la = n.vqa((ka >>> (8 * ia)) & 255, la);
                        }
                        return n.slice(0, la);
                    };
                    aa.sra = new na({
                        table: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-:+=^!/*?&<>()[]{}@%$#'.split(
                            ''
                        )
                    });
                    aa.Pqa = new na({ pC: !0 });
                    aa.X1 = na;
                }.call(this, r(394).Buffer));
            }
        }
    ]);
}.call(this || window));
