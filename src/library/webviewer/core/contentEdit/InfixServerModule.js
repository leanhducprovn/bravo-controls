(function () {
    /*
 *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
**************************************************************************** The buffer module from node.js, for the browser.

 @author   Feross Aboukhadijeh <http://feross.org>
 @license  MIT
*/
    var $jscomp = $jscomp || {};
    $jscomp.scope = {};
    $jscomp.arrayIteratorImpl = function (p) {
        var m = 0;
        return function () {
            return m < p.length ? { done: !1, value: p[m++] } : { done: !0 };
        };
    };
    $jscomp.arrayIterator = function (p) {
        return { next: $jscomp.arrayIteratorImpl(p) };
    };
    $jscomp.makeIterator = function (p) {
        var m = 'undefined' != typeof Symbol && Symbol.iterator && p[Symbol.iterator];
        return m ? m.call(p) : $jscomp.arrayIterator(p);
    };
    $jscomp.ASSUME_ES5 = !1;
    $jscomp.ASSUME_NO_NATIVE_MAP = !1;
    $jscomp.ASSUME_NO_NATIVE_SET = !1;
    $jscomp.SIMPLE_FROUND_POLYFILL = !1;
    $jscomp.ISOLATE_POLYFILLS = !1;
    $jscomp.FORCE_POLYFILL_PROMISE = !1;
    $jscomp.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION = !1;
    $jscomp.getGlobal = function (p) {
        p = [
            'object' == typeof globalThis && globalThis,
            p,
            'object' == typeof window && window,
            'object' == typeof self && self,
            'object' == typeof global && global
        ];
        for (var m = 0; m < p.length; ++m) {
            var l = p[m];
            if (l && l.Math == Math) return l;
        }
        throw Error('Cannot find global object');
    };
    $jscomp.global = $jscomp.getGlobal(this);
    $jscomp.defineProperty =
        $jscomp.ASSUME_ES5 || 'function' == typeof Object.defineProperties
            ? Object.defineProperty
            : function (p, m, l) {
                  if (p == Array.prototype || p == Object.prototype) return p;
                  p[m] = l.value;
                  return p;
              };
    $jscomp.IS_SYMBOL_NATIVE = 'function' === typeof Symbol && 'symbol' === typeof Symbol('x');
    $jscomp.TRUST_ES6_POLYFILLS = !$jscomp.ISOLATE_POLYFILLS || $jscomp.IS_SYMBOL_NATIVE;
    $jscomp.polyfills = {};
    $jscomp.propertyToPolyfillSymbol = {};
    $jscomp.POLYFILL_PREFIX = '$jscp$';
    var $jscomp$lookupPolyfilledValue = function (p, m) {
        var l = $jscomp.propertyToPolyfillSymbol[m];
        if (null == l) return p[m];
        l = p[l];
        return void 0 !== l ? l : p[m];
    };
    $jscomp.polyfill = function (p, m, l, g) {
        m &&
            ($jscomp.ISOLATE_POLYFILLS ? $jscomp.polyfillIsolated(p, m, l, g) : $jscomp.polyfillUnisolated(p, m, l, g));
    };
    $jscomp.polyfillUnisolated = function (p, m, l, g) {
        l = $jscomp.global;
        p = p.split('.');
        for (g = 0; g < p.length - 1; g++) {
            var k = p[g];
            if (!(k in l)) return;
            l = l[k];
        }
        p = p[p.length - 1];
        g = l[p];
        m = m(g);
        m != g && null != m && $jscomp.defineProperty(l, p, { configurable: !0, writable: !0, value: m });
    };
    $jscomp.polyfillIsolated = function (p, m, l, g) {
        var k = p.split('.');
        p = 1 === k.length;
        g = k[0];
        g = !p && g in $jscomp.polyfills ? $jscomp.polyfills : $jscomp.global;
        for (var t = 0; t < k.length - 1; t++) {
            var d = k[t];
            if (!(d in g)) return;
            g = g[d];
        }
        k = k[k.length - 1];
        l = $jscomp.IS_SYMBOL_NATIVE && 'es6' === l ? g[k] : null;
        m = m(l);
        null != m &&
            (p
                ? $jscomp.defineProperty($jscomp.polyfills, k, { configurable: !0, writable: !0, value: m })
                : m !== l &&
                  (void 0 === $jscomp.propertyToPolyfillSymbol[k] &&
                      ((l = (1e9 * Math.random()) >>> 0),
                      ($jscomp.propertyToPolyfillSymbol[k] = $jscomp.IS_SYMBOL_NATIVE
                          ? $jscomp.global.Symbol(k)
                          : $jscomp.POLYFILL_PREFIX + l + '$' + k)),
                  $jscomp.defineProperty(g, $jscomp.propertyToPolyfillSymbol[k], {
                      configurable: !0,
                      writable: !0,
                      value: m
                  })));
    };
    $jscomp.polyfill(
        'Promise',
        function (p) {
            function m() {
                this.batch_ = null;
            }
            function l(d) {
                return d instanceof k
                    ? d
                    : new k(function (h, q) {
                          h(d);
                      });
            }
            if (
                p &&
                (!(
                    $jscomp.FORCE_POLYFILL_PROMISE ||
                    ($jscomp.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION &&
                        'undefined' === typeof $jscomp.global.PromiseRejectionEvent)
                ) ||
                    !$jscomp.global.Promise ||
                    -1 === $jscomp.global.Promise.toString().indexOf('[native code]'))
            )
                return p;
            m.prototype.asyncExecute = function (d) {
                if (null == this.batch_) {
                    this.batch_ = [];
                    var h = this;
                    this.asyncExecuteFunction(function () {
                        h.executeBatch_();
                    });
                }
                this.batch_.push(d);
            };
            var g = $jscomp.global.setTimeout;
            m.prototype.asyncExecuteFunction = function (d) {
                g(d, 0);
            };
            m.prototype.executeBatch_ = function () {
                for (; this.batch_ && this.batch_.length; ) {
                    var d = this.batch_;
                    this.batch_ = [];
                    for (var h = 0; h < d.length; ++h) {
                        var q = d[h];
                        d[h] = null;
                        try {
                            q();
                        } catch (r) {
                            this.asyncThrow_(r);
                        }
                    }
                }
                this.batch_ = null;
            };
            m.prototype.asyncThrow_ = function (d) {
                this.asyncExecuteFunction(function () {
                    throw d;
                });
            };
            var k = function (d) {
                this.state_ = 0;
                this.result_ = void 0;
                this.onSettledCallbacks_ = [];
                this.isRejectionHandled_ = !1;
                var h = this.createResolveAndReject_();
                try {
                    d(h.resolve, h.reject);
                } catch (q) {
                    h.reject(q);
                }
            };
            k.prototype.createResolveAndReject_ = function () {
                function d(r) {
                    return function (u) {
                        q || ((q = !0), r.call(h, u));
                    };
                }
                var h = this,
                    q = !1;
                return { resolve: d(this.resolveTo_), reject: d(this.reject_) };
            };
            k.prototype.resolveTo_ = function (d) {
                if (d === this) this.reject_(new TypeError('A Promise cannot resolve to itself'));
                else if (d instanceof k) this.settleSameAsPromise_(d);
                else {
                    a: switch (typeof d) {
                        case 'object':
                            var h = null != d;
                            break a;
                        case 'function':
                            h = !0;
                            break a;
                        default:
                            h = !1;
                    }
                    h ? this.resolveToNonPromiseObj_(d) : this.fulfill_(d);
                }
            };
            k.prototype.resolveToNonPromiseObj_ = function (d) {
                var h = void 0;
                try {
                    h = d.then;
                } catch (q) {
                    this.reject_(q);
                    return;
                }
                'function' == typeof h ? this.settleSameAsThenable_(h, d) : this.fulfill_(d);
            };
            k.prototype.reject_ = function (d) {
                this.settle_(2, d);
            };
            k.prototype.fulfill_ = function (d) {
                this.settle_(1, d);
            };
            k.prototype.settle_ = function (d, h) {
                if (0 != this.state_)
                    throw Error('Cannot settle(' + d + ', ' + h + '): Promise already settled in state' + this.state_);
                this.state_ = d;
                this.result_ = h;
                2 === this.state_ && this.scheduleUnhandledRejectionCheck_();
                this.executeOnSettledCallbacks_();
            };
            k.prototype.scheduleUnhandledRejectionCheck_ = function () {
                var d = this;
                g(function () {
                    if (d.notifyUnhandledRejection_()) {
                        var h = $jscomp.global.console;
                        'undefined' !== typeof h && h.error(d.result_);
                    }
                }, 1);
            };
            k.prototype.notifyUnhandledRejection_ = function () {
                if (this.isRejectionHandled_) return !1;
                var d = $jscomp.global.CustomEvent,
                    h = $jscomp.global.Event,
                    q = $jscomp.global.dispatchEvent;
                if ('undefined' === typeof q) return !0;
                'function' === typeof d
                    ? (d = new d('unhandledrejection', { cancelable: !0 }))
                    : 'function' === typeof h
                    ? (d = new h('unhandledrejection', { cancelable: !0 }))
                    : ((d = $jscomp.global.document.createEvent('CustomEvent')),
                      d.initCustomEvent('unhandledrejection', !1, !0, d));
                d.promise = this;
                d.reason = this.result_;
                return q(d);
            };
            k.prototype.executeOnSettledCallbacks_ = function () {
                if (null != this.onSettledCallbacks_) {
                    for (var d = 0; d < this.onSettledCallbacks_.length; ++d)
                        t.asyncExecute(this.onSettledCallbacks_[d]);
                    this.onSettledCallbacks_ = null;
                }
            };
            var t = new m();
            k.prototype.settleSameAsPromise_ = function (d) {
                var h = this.createResolveAndReject_();
                d.callWhenSettled_(h.resolve, h.reject);
            };
            k.prototype.settleSameAsThenable_ = function (d, h) {
                var q = this.createResolveAndReject_();
                try {
                    d.call(h, q.resolve, q.reject);
                } catch (r) {
                    q.reject(r);
                }
            };
            k.prototype.then = function (d, h) {
                function q(w, C) {
                    return 'function' == typeof w
                        ? function (f) {
                              try {
                                  r(w(f));
                              } catch (v) {
                                  u(v);
                              }
                          }
                        : C;
                }
                var r,
                    u,
                    A = new k(function (w, C) {
                        r = w;
                        u = C;
                    });
                this.callWhenSettled_(q(d, r), q(h, u));
                return A;
            };
            k.prototype.catch = function (d) {
                return this.then(void 0, d);
            };
            k.prototype.callWhenSettled_ = function (d, h) {
                function q() {
                    switch (r.state_) {
                        case 1:
                            d(r.result_);
                            break;
                        case 2:
                            h(r.result_);
                            break;
                        default:
                            throw Error('Unexpected state: ' + r.state_);
                    }
                }
                var r = this;
                null == this.onSettledCallbacks_ ? t.asyncExecute(q) : this.onSettledCallbacks_.push(q);
                this.isRejectionHandled_ = !0;
            };
            k.resolve = l;
            k.reject = function (d) {
                return new k(function (h, q) {
                    q(d);
                });
            };
            k.race = function (d) {
                return new k(function (h, q) {
                    for (var r = $jscomp.makeIterator(d), u = r.next(); !u.done; u = r.next())
                        l(u.value).callWhenSettled_(h, q);
                });
            };
            k.all = function (d) {
                var h = $jscomp.makeIterator(d),
                    q = h.next();
                return q.done
                    ? l([])
                    : new k(function (r, u) {
                          function A(f) {
                              return function (v) {
                                  w[f] = v;
                                  C--;
                                  0 == C && r(w);
                              };
                          }
                          var w = [],
                              C = 0;
                          do w.push(void 0), C++, l(q.value).callWhenSettled_(A(w.length - 1), u), (q = h.next());
                          while (!q.done);
                      });
            };
            return k;
        },
        'es6',
        'es3'
    );
    $jscomp.checkStringArgs = function (p, m, l) {
        if (null == p)
            throw new TypeError("The 'this' value for String.prototype." + l + ' must not be null or undefined');
        if (m instanceof RegExp)
            throw new TypeError('First argument to String.prototype.' + l + ' must not be a regular expression');
        return p + '';
    };
    $jscomp.polyfill(
        'String.prototype.endsWith',
        function (p) {
            return p
                ? p
                : function (m, l) {
                      var g = $jscomp.checkStringArgs(this, m, 'endsWith');
                      m += '';
                      void 0 === l && (l = g.length);
                      l = Math.max(0, Math.min(l | 0, g.length));
                      for (var k = m.length; 0 < k && 0 < l; ) if (g[--l] != m[--k]) return !1;
                      return 0 >= k;
                  };
        },
        'es6',
        'es3'
    );
    $jscomp.initSymbol = function () {};
    $jscomp.polyfill(
        'Symbol',
        function (p) {
            if (p) return p;
            var m = function (t, d) {
                this.$jscomp$symbol$id_ = t;
                $jscomp.defineProperty(this, 'description', { configurable: !0, writable: !0, value: d });
            };
            m.prototype.toString = function () {
                return this.$jscomp$symbol$id_;
            };
            var l = 'jscomp_symbol_' + ((1e9 * Math.random()) >>> 0) + '_',
                g = 0,
                k = function (t) {
                    if (this instanceof k) throw new TypeError('Symbol is not a constructor');
                    return new m(l + (t || '') + '_' + g++, t);
                };
            return k;
        },
        'es6',
        'es3'
    );
    $jscomp.polyfill(
        'Symbol.iterator',
        function (p) {
            if (p) return p;
            p = Symbol('Symbol.iterator');
            for (
                var m =
                        'Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array'.split(
                            ' '
                        ),
                    l = 0;
                l < m.length;
                l++
            ) {
                var g = $jscomp.global[m[l]];
                'function' === typeof g &&
                    'function' != typeof g.prototype[p] &&
                    $jscomp.defineProperty(g.prototype, p, {
                        configurable: !0,
                        writable: !0,
                        value: function () {
                            return $jscomp.iteratorPrototype($jscomp.arrayIteratorImpl(this));
                        }
                    });
            }
            return p;
        },
        'es6',
        'es3'
    );
    $jscomp.iteratorPrototype = function (p) {
        p = { next: p };
        p[Symbol.iterator] = function () {
            return this;
        };
        return p;
    };
    $jscomp.checkEs6ConformanceViaProxy = function () {
        try {
            var p = {},
                m = Object.create(
                    new $jscomp.global.Proxy(p, {
                        get: function (l, g, k) {
                            return l == p && 'q' == g && k == m;
                        }
                    })
                );
            return !0 === m.q;
        } catch (l) {
            return !1;
        }
    };
    $jscomp.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS = !1;
    $jscomp.ES6_CONFORMANCE = $jscomp.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS && $jscomp.checkEs6ConformanceViaProxy();
    $jscomp.owns = function (p, m) {
        return Object.prototype.hasOwnProperty.call(p, m);
    };
    $jscomp.MapEntry = function () {};
    $jscomp.underscoreProtoCanBeSet = function () {
        var p = { a: !0 },
            m = {};
        try {
            return (m.__proto__ = p), m.a;
        } catch (l) {}
        return !1;
    };
    $jscomp.setPrototypeOf =
        $jscomp.TRUST_ES6_POLYFILLS && 'function' == typeof Object.setPrototypeOf
            ? Object.setPrototypeOf
            : $jscomp.underscoreProtoCanBeSet()
            ? function (p, m) {
                  p.__proto__ = m;
                  if (p.__proto__ !== m) throw new TypeError(p + ' is not extensible');
                  return p;
              }
            : null;
    $jscomp.assign =
        $jscomp.TRUST_ES6_POLYFILLS && 'function' == typeof Object.assign
            ? Object.assign
            : function (p, m) {
                  for (var l = 1; l < arguments.length; l++) {
                      var g = arguments[l];
                      if (g) for (var k in g) $jscomp.owns(g, k) && (p[k] = g[k]);
                  }
                  return p;
              };
    $jscomp.polyfill(
        'Array.prototype.fill',
        function (p) {
            return p
                ? p
                : function (m, l, g) {
                      var k = this.length || 0;
                      0 > l && (l = Math.max(0, k + l));
                      if (null == g || g > k) g = k;
                      g = Number(g);
                      0 > g && (g = Math.max(0, k + g));
                      for (l = Number(l || 0); l < g; l++) this[l] = m;
                      return this;
                  };
        },
        'es6',
        'es3'
    );
    $jscomp.typedArrayFill = function (p) {
        return p ? p : Array.prototype.fill;
    };
    $jscomp.polyfill('Int8Array.prototype.fill', $jscomp.typedArrayFill, 'es6', 'es5');
    $jscomp.polyfill('Uint8Array.prototype.fill', $jscomp.typedArrayFill, 'es6', 'es5');
    $jscomp.polyfill('Uint8ClampedArray.prototype.fill', $jscomp.typedArrayFill, 'es6', 'es5');
    $jscomp.polyfill('Int16Array.prototype.fill', $jscomp.typedArrayFill, 'es6', 'es5');
    $jscomp.polyfill('Uint16Array.prototype.fill', $jscomp.typedArrayFill, 'es6', 'es5');
    $jscomp.polyfill('Int32Array.prototype.fill', $jscomp.typedArrayFill, 'es6', 'es5');
    $jscomp.polyfill('Uint32Array.prototype.fill', $jscomp.typedArrayFill, 'es6', 'es5');
    $jscomp.polyfill('Float32Array.prototype.fill', $jscomp.typedArrayFill, 'es6', 'es5');
    $jscomp.polyfill('Float64Array.prototype.fill', $jscomp.typedArrayFill, 'es6', 'es5');
    (function (p) {
        function m(g) {
            if (l[g]) return l[g].exports;
            var k = (l[g] = { i: g, l: !1, exports: {} });
            p[g].call(k.exports, k, k.exports, m);
            k.l = !0;
            return k.exports;
        }
        var l = {};
        m.m = p;
        m.c = l;
        m.d = function (g, k, t) {
            m.o(g, k) || Object.defineProperty(g, k, { enumerable: !0, get: t });
        };
        m.r = function (g) {
            'undefined' !== typeof Symbol &&
                Symbol.toStringTag &&
                Object.defineProperty(g, Symbol.toStringTag, { value: 'Module' });
            Object.defineProperty(g, '__esModule', { value: !0 });
        };
        m.t = function (g, k) {
            k & 1 && (g = m(g));
            if (k & 8 || (k & 4 && 'object' === typeof g && g && g.__esModule)) return g;
            var t = Object.create(null);
            m.r(t);
            Object.defineProperty(t, 'default', { enumerable: !0, value: g });
            if (k & 2 && 'string' != typeof g)
                for (var d in g)
                    m.d(
                        t,
                        d,
                        function (h) {
                            return g[h];
                        }.bind(null, d)
                    );
            return t;
        };
        m.n = function (g) {
            var k =
                g && g.__esModule
                    ? function () {
                          return g['default'];
                      }
                    : function () {
                          return g;
                      };
            m.d(k, 'a', k);
            return k;
        };
        m.o = function (g, k) {
            return Object.prototype.hasOwnProperty.call(g, k);
        };
        m.p = '/core/contentEdit';
        return m((m.s = 9));
    })([
        function (p, m, l) {
            l.d(m, 'c', function () {
                return k;
            });
            l.d(m, 'a', function () {
                return d;
            });
            l.d(m, 'b', function () {
                return t;
            });
            var g = l(2),
                k = function (h, q) {
                    Object(g.a)('disableLogs') || (q ? console.warn(h + ': ' + q) : console.warn(h));
                },
                t = function (h, q, r, u) {
                    void 0 === u && (u = !1);
                    var A = r.pop();
                    r = r.length ? r.join(', ') + ' and ' + A : A;
                    u
                        ? k("'" + q + "' will be deprecated in version " + h + '. Please use ' + r + ' instead.')
                        : k("'" + q + "' is deprecated since version " + h + '. Please use ' + r + ' instead.');
                },
                d = function (h, q) {};
        },
        function (p, m, l) {
            l.d(m, 'a', function () {
                return y;
            });
            l.d(m, 'b', function () {
                return O;
            });
            l.d(m, 'c', function () {
                return K;
            });
            var g = l(6),
                k = l(0),
                t = l(4),
                d = l(3),
                h = 'undefined' === typeof window ? self : window,
                q = h.importScripts,
                r = !1,
                u = function (x, z) {
                    r || (q(h.basePath + 'decode.min.js'), (r = !0));
                    x = self.BrotliDecode(Object(d.b)(x));
                    return z ? x : Object(d.a)(x);
                },
                A = function (x, z) {
                    return Object(g.a)(void 0, void 0, Promise, function () {
                        var E;
                        return Object(g.b)(this, function (H) {
                            switch (H.label) {
                                case 0:
                                    return r
                                        ? [3, 2]
                                        : [
                                              4,
                                              Object(t.a)(
                                                  self.Core.getWorkerPath() + 'external/decode.min.js',
                                                  'Failed to download decode.min.js',
                                                  window
                                              )
                                          ];
                                case 1:
                                    H.sent(), (r = !0), (H.label = 2);
                                case 2:
                                    return (E = self.BrotliDecode(Object(d.b)(x))), [2, z ? E : Object(d.a)(E)];
                            }
                        });
                    });
                };
            (function () {
                function x() {
                    this.remainingDataArrays = [];
                }
                x.prototype.processRaw = function (z) {
                    return z;
                };
                x.prototype.processBrotli = function (z) {
                    this.remainingDataArrays.push(z);
                    return null;
                };
                x.prototype.GetNextChunk = function (z) {
                    this.decodeFunction ||
                        (this.decodeFunction =
                            0 === z[0] && 97 === z[1] && 115 === z[2] && 109 === z[3]
                                ? this.processRaw
                                : this.processBrotli);
                    return this.decodeFunction(z);
                };
                x.prototype.End = function () {
                    if (this.remainingDataArrays.length) {
                        for (var z = this.arrays, E = 0, H = 0; H < z.length; ++H) E += z[H].length;
                        E = new Uint8Array(E);
                        var P = 0;
                        for (H = 0; H < z.length; ++H) {
                            var Q = z[H];
                            E.set(Q, P);
                            P += Q.length;
                        }
                        return u(E, !0);
                    }
                    return null;
                };
                return x;
            })();
            var w = !1,
                C = function (x) {
                    w || (q(h.basePath + 'pako_inflate.min.js'), (w = !0));
                    var z = 10;
                    if ('string' === typeof x) {
                        if (x.charCodeAt(3) & 8) {
                            for (; 0 !== x.charCodeAt(z); ++z);
                            ++z;
                        }
                    } else if (x[3] & 8) {
                        for (; 0 !== x[z]; ++z);
                        ++z;
                    }
                    x = Object(d.b)(x);
                    x = x.subarray(z, x.length - 8);
                    return h.pako.inflate(x, { windowBits: -15 });
                },
                f = function (x, z) {
                    return z ? x : Object(d.a)(x);
                },
                v = function (x) {
                    var z = !x.shouldOutputArray,
                        E = new XMLHttpRequest();
                    E.open('GET', x.url, x.isAsync);
                    var H = z && E.overrideMimeType;
                    E.responseType = H ? 'text' : 'arraybuffer';
                    H && E.overrideMimeType('text/plain; charset=x-user-defined');
                    E.send();
                    var P = function () {
                        var S = Date.now();
                        var N = H ? E.responseText : new Uint8Array(E.response);
                        Object(k.a)('worker', 'Result length is ' + N.length);
                        N.length < x.compressedMaximum
                            ? ((N = x.decompressFunction(N, x.shouldOutputArray)),
                              Object(k.c)(
                                  'There may be some degradation of performance. Your server has not been configured to serve .gz. and .br. files with the expected Content-Encoding. See http://www.pdftron.com/kb_content_encoding for instructions on how to resolve this.'
                              ),
                              q && Object(k.a)('worker', 'Decompressed length is ' + N.length))
                            : z && (N = Object(d.a)(N));
                        q && Object(k.a)('worker', x.url + ' Decompression took ' + (Date.now() - S));
                        return N;
                    };
                    if (x.isAsync)
                        var Q = new Promise(function (S, N) {
                            E.onload = function () {
                                200 === this.status || 0 === this.status ? S(P()) : N('Download Failed ' + x.url);
                            };
                            E.onerror = function () {
                                N('Network error occurred ' + x.url);
                            };
                        });
                    else {
                        if (200 === E.status || 0 === E.status) return P();
                        throw Error('Failed to load ' + x.url);
                    }
                    return Q;
                },
                y = function (x) {
                    var z = x.lastIndexOf('/');
                    -1 === z && (z = 0);
                    var E = x.slice(z).replace('.', '.br.');
                    q ||
                        (E.endsWith('.js.mem')
                            ? (E = E.replace('.js.mem', '.mem'))
                            : E.endsWith('.js') && (E = E.concat('.mem')));
                    return x.slice(0, z) + E;
                },
                G = function (x, z) {
                    var E = x.lastIndexOf('/');
                    -1 === E && (E = 0);
                    var H = x.slice(E).replace('.', '.gz.');
                    z.url = x.slice(0, E) + H;
                    z.decompressFunction = C;
                    return v(z);
                },
                J = function (x, z) {
                    z.url = y(x);
                    z.decompressFunction = q ? u : A;
                    return v(z);
                },
                B = function (x, z) {
                    x.endsWith('.js.mem')
                        ? (x = x.slice(0, -4))
                        : x.endsWith('.mem') && (x = x.slice(0, -4) + '.js.mem');
                    z.url = x;
                    z.decompressFunction = f;
                    return v(z);
                },
                F = function (x, z, E, H) {
                    return x.catch(function (P) {
                        Object(k.c)(P);
                        return H(z, E);
                    });
                },
                I = function (x, z, E) {
                    var H;
                    if (E.isAsync) {
                        var P = z[0](x, E);
                        for (H = 1; H < z.length; ++H) P = F(P, x, E, z[H]);
                        return P;
                    }
                    for (H = 0; H < z.length; ++H)
                        try {
                            return z[H](x, E);
                        } catch (Q) {
                            Object(k.c)(Q.message);
                        }
                    throw Error('');
                },
                K = function (x, z, E, H) {
                    return I(x, [G, J, B], { compressedMaximum: z, isAsync: E, shouldOutputArray: H });
                },
                O = function (x, z, E, H) {
                    return I(x, [J, G, B], { compressedMaximum: z, isAsync: E, shouldOutputArray: H });
                };
        },
        function (p, m, l) {
            l.d(m, 'a', function () {
                return t;
            });
            l.d(m, 'b', function () {
                return d;
            });
            var g = {},
                k = {
                    flattenedResources: !1,
                    CANVAS_CACHE_SIZE: void 0,
                    maxPagesBefore: void 0,
                    maxPagesAhead: void 0,
                    disableLogs: !1,
                    wvsQueryParameters: {},
                    _trnDebugMode: !1,
                    _logFiltersEnabled: null
                },
                t = function (h) {
                    return k[h];
                },
                d = function (h, q) {
                    var r;
                    k[h] = q;
                    null === (r = g[h]) || void 0 === r
                        ? void 0
                        : r.forEach(function (u) {
                              u(q);
                          });
                };
        },
        function (p, m, l) {
            l.d(m, 'b', function () {
                return g;
            });
            l.d(m, 'a', function () {
                return k;
            });
            var g = function (t) {
                    if ('string' === typeof t) {
                        for (var d = new Uint8Array(t.length), h = t.length, q = 0; q < h; q++) d[q] = t.charCodeAt(q);
                        return d;
                    }
                    return t;
                },
                k = function (t) {
                    if ('string' !== typeof t) {
                        for (var d = '', h = 0, q = t.length, r; h < q; )
                            (r = t.subarray(h, h + 1024)), (h += 1024), (d += String.fromCharCode.apply(null, r));
                        return d;
                    }
                    return t;
                };
        },
        function (p, m, l) {
            function g(t, d, h) {
                return new Promise(function (q) {
                    if (!t) return q();
                    var r = h.document.createElement('script');
                    r.type = 'text/javascript';
                    r.onload = function () {
                        q();
                    };
                    r.onerror = function () {
                        d && Object(k.c)(d);
                        q();
                    };
                    r.src = t;
                    h.document.getElementsByTagName('head')[0].appendChild(r);
                });
            }
            l.d(m, 'a', function () {
                return g;
            });
            var k = l(0);
        },
        function (p, m, l) {
            function g(h, q, r) {
                function u(C) {
                    w = w || Date.now();
                    return C
                        ? (Object(k.a)('load', 'Try instantiateStreaming'),
                          fetch(Object(t.a)(h))
                              .then(function (f) {
                                  return WebAssembly.instantiateStreaming(f, q);
                              })
                              .catch(function (f) {
                                  Object(k.a)('load', 'instantiateStreaming Failed ' + h + ' message ' + f.message);
                                  return u(!1);
                              }))
                        : Object(t.b)(h, r, !0, !0).then(function (f) {
                              A = Date.now();
                              Object(k.a)('load', 'Request took ' + (A - w) + ' ms');
                              return WebAssembly.instantiate(f, q);
                          });
                }
                var A, w;
                return u(!!WebAssembly.instantiateStreaming).then(function (C) {
                    Object(k.a)('load', 'WASM compilation took ' + (Date.now() - (A || w)) + ' ms');
                    return C;
                });
            }
            l.d(m, 'a', function () {
                return g;
            });
            var k = l(0),
                t = l(1),
                d = l(4);
            l.d(m, 'b', function () {
                return d.a;
            });
        },
        function (p, m, l) {
            function g(t, d, h, q) {
                function r(u) {
                    return u instanceof h
                        ? u
                        : new h(function (A) {
                              A(u);
                          });
                }
                return new (h || (h = Promise))(function (u, A) {
                    function w(v) {
                        try {
                            f(q.next(v));
                        } catch (y) {
                            A(y);
                        }
                    }
                    function C(v) {
                        try {
                            f(q['throw'](v));
                        } catch (y) {
                            A(y);
                        }
                    }
                    function f(v) {
                        v.done ? u(v.value) : r(v.value).then(w, C);
                    }
                    f((q = q.apply(t, d || [])).next());
                });
            }
            function k(t, d) {
                function h(f) {
                    return function (v) {
                        return q([f, v]);
                    };
                }
                function q(f) {
                    if (u) throw new TypeError('Generator is already executing.');
                    for (; r; )
                        try {
                            if (
                                ((u = 1),
                                A &&
                                    (w =
                                        f[0] & 2
                                            ? A['return']
                                            : f[0]
                                            ? A['throw'] || ((w = A['return']) && w.call(A), 0)
                                            : A.next) &&
                                    !(w = w.call(A, f[1])).done)
                            )
                                return w;
                            if (((A = 0), w)) f = [f[0] & 2, w.value];
                            switch (f[0]) {
                                case 0:
                                case 1:
                                    w = f;
                                    break;
                                case 4:
                                    return r.label++, { value: f[1], done: !1 };
                                case 5:
                                    r.label++;
                                    A = f[1];
                                    f = [0];
                                    continue;
                                case 7:
                                    f = r.ops.pop();
                                    r.trys.pop();
                                    continue;
                                default:
                                    if (
                                        !((w = r.trys), (w = 0 < w.length && w[w.length - 1])) &&
                                        (6 === f[0] || 2 === f[0])
                                    ) {
                                        r = 0;
                                        continue;
                                    }
                                    if (3 === f[0] && (!w || (f[1] > w[0] && f[1] < w[3]))) r.label = f[1];
                                    else if (6 === f[0] && r.label < w[1]) (r.label = w[1]), (w = f);
                                    else if (w && r.label < w[2]) (r.label = w[2]), r.ops.push(f);
                                    else {
                                        w[2] && r.ops.pop();
                                        r.trys.pop();
                                        continue;
                                    }
                            }
                            f = d.call(t, r);
                        } catch (v) {
                            (f = [6, v]), (A = 0);
                        } finally {
                            u = w = 0;
                        }
                    if (f[0] & 5) throw f[1];
                    return { value: f[0] ? f[1] : void 0, done: !0 };
                }
                var r = {
                        label: 0,
                        sent: function () {
                            if (w[0] & 1) throw w[1];
                            return w[1];
                        },
                        trys: [],
                        ops: []
                    },
                    u,
                    A,
                    w,
                    C;
                return (
                    (C = { next: h(0), throw: h(1), return: h(2) }),
                    'function' === typeof Symbol &&
                        (C[Symbol.iterator] = function () {
                            return this;
                        }),
                    C
                );
            }
            l.d(m, 'a', function () {
                return g;
            });
            l.d(m, 'b', function () {
                return k;
            });
        },
        function (p, m, l) {
            l.d(m, 'a', function () {
                return h;
            });
            var g = l(1),
                k = l(5),
                t = l(8),
                d = (function () {
                    function q(r) {
                        var u = this;
                        this.promise = r.then(function (A) {
                            u.response = A;
                            u.status = 200;
                        });
                    }
                    q.prototype.addEventListener = function (r, u) {
                        this.promise.then(u);
                    };
                    return q;
                })(),
                h = function (q, r, u) {
                    if (Object(t.a)() && !u)
                        (self.Module.instantiateWasm = function (w, C) {
                            return Object(k.a)(q + 'Wasm.wasm', w, r['Wasm.wasm']).then(function (f) {
                                C(f.instance);
                            });
                        }),
                            (u = Object(g.b)(q + 'Wasm.js.mem', r['Wasm.js.mem'], !1, !1));
                    else {
                        u = Object(g.b)(
                            (self.Module.asmjsPrefix ? self.Module.asmjsPrefix : '') + q + '.js.mem',
                            r['.js.mem'],
                            !1
                        );
                        var A = Object(g.c)(
                            (self.Module.memoryInitializerPrefixURL ? self.Module.memoryInitializerPrefixURL : '') +
                                q +
                                '.mem',
                            r['.mem'],
                            !0,
                            !0
                        );
                        self.Module.memoryInitializerRequest = new d(A);
                    }
                    u = new Blob([u], { type: 'application/javascript' });
                    importScripts(URL.createObjectURL(u));
                };
        },
        function (p, m, l) {
            l.d(m, 'a', function () {
                return C;
            });
            l(0);
            var g = 'undefined' === typeof window ? self : window;
            p = (function () {
                var f = navigator.userAgent.toLowerCase();
                return (f = /(msie) ([\w.]+)/.exec(f) || /(trident)(?:.*? rv:([\w.]+)|)/.exec(f))
                    ? parseInt(f[2], 10)
                    : f;
            })();
            var k = (function () {
                var f = g.navigator.userAgent.match(/OPR/),
                    v = g.navigator.userAgent.match(/Maxthon/),
                    y = g.navigator.userAgent.match(/Edge/);
                return g.navigator.userAgent.match(/Chrome\/(.*?) /) && !f && !v && !y;
            })();
            (function () {
                if (!k) return null;
                var f = g.navigator.userAgent.match(/Chrome\/([0-9]+)\./);
                return f ? parseInt(f[1], 10) : f;
            })();
            var t =
                !!navigator.userAgent.match(/Edge/i) ||
                (navigator.userAgent.match(/Edg\/(.*?)/) && g.navigator.userAgent.match(/Chrome\/(.*?) /));
            (function () {
                if (!t) return null;
                var f = g.navigator.userAgent.match(/Edg\/([0-9]+)\./);
                return f ? parseInt(f[1], 10) : f;
            })();
            m =
                /iPad|iPhone|iPod/.test(g.navigator.platform) ||
                ('MacIntel' === navigator.platform && 1 < navigator.maxTouchPoints) ||
                /iPad|iPhone|iPod/.test(g.navigator.userAgent);
            var d = (function () {
                    var f = g.navigator.userAgent.match(/.*\/([0-9\.]+)\s(Safari|Mobile).*/i);
                    return f ? parseFloat(f[1]) : f;
                })(),
                h =
                    /^((?!chrome|android).)*safari/i.test(g.navigator.userAgent) ||
                    (/^((?!chrome|android).)*$/.test(g.navigator.userAgent) && m),
                q = g.navigator.userAgent.match(/Firefox/);
            (function () {
                if (!q) return null;
                var f = g.navigator.userAgent.match(/Firefox\/([0-9]+)\./);
                return f ? parseInt(f[1], 10) : f;
            })();
            p || /Android|webOS|Touch|IEMobile|Silk/i.test(navigator.userAgent);
            navigator.userAgent.match(/(iPad|iPhone|iPod)/i);
            g.navigator.userAgent.indexOf('Android');
            var r = /Mac OS X 10_13_6.*\(KHTML, like Gecko\)$/.test(g.navigator.userAgent),
                u = g.navigator.userAgent.match(/(iPad|iPhone).+\sOS\s((\d+)(_\d)*)/i)
                    ? 14 <= parseInt(g.navigator.userAgent.match(/(iPad|iPhone).+\sOS\s((\d+)(_\d)*)/i)[3], 10)
                    : !1,
                A = !(!self.WebAssembly || !self.WebAssembly.validate),
                w = -1 < g.navigator.userAgent.indexOf('Edge/16') || -1 < g.navigator.userAgent.indexOf('MSAppHost'),
                C = function () {
                    return A && !w && !(!u && ((h && 14 > d) || r));
                };
        },
        function (p, m, l) {
            p.exports = l(10);
        },
        function (p, m, l) {
            l.r(m);
            (function (g) {
                function k(f, v, y) {
                    y = 'importCommand' + y + '.xml';
                    FS.writeFile(y, '<InfixServer>' + f + '</InfixServer>');
                    C.ccall('wasmRunXML', 'number', ['string', 'string'], [y, v]);
                    FS.unlink(y);
                }
                function t() {
                    1 == u ? postMessage({ cmd: 'isReady' }) : setTimeout(t, 300);
                }
                function d(f, v, y, G, J) {
                    if (v) {
                        v = new Uint8Array(y);
                        var B = 'inputFile' + f + '.pdf';
                        FS.writeFile(B, v);
                        G = new Uint8Array(G);
                        var F = new TextDecoder('utf-8').decode(G);
                        G = 'exported' + f + '.xml';
                        v = 'objects' + f + '.xml';
                        y = 'results' + f + '.xml';
                        var I =
                            '<Commands><Command Name="LoadPDF"><File>' +
                            (B +
                                '</File></Command><Command Name="Page BBox"><StartPage>1</StartPage><EndPage>1</EndPage></Command>');
                        '' != F && (I += '<Command Name="AddTableBoxes">' + F + '</Command>');
                        I =
                            I +
                            '<Command Name="Translate Export"><File>' +
                            (G +
                                '</File><TransXML>coreTransXML.cfg</TransXML><StartPage>1</StartPage><EndPage>1</EndPage></Command>');
                        I += '<Command Name="Edit Page">';
                        I += '<Output>' + v + '</Output><ImagesOnly/></Command></Commands>';
                        k(I, y, 1);
                        w = f;
                        J &&
                            ((J = FS.readFile(B).buffer),
                            (B = FS.readFile(G).buffer),
                            (F = FS.readFile(v).buffer),
                            (I = FS.readFile(y).buffer),
                            FS.unlink(y),
                            FS.unlink(G),
                            FS.unlink(v),
                            postMessage(
                                {
                                    cmd: 'exportFile',
                                    pageNumber: f,
                                    exportPerformed: !0,
                                    pdfBuffer: J,
                                    exportXML: B,
                                    objectXML: F,
                                    resultsXML: I
                                },
                                [J, B, I]
                            ));
                    } else postMessage({ cmd: 'exportFile', pageNumber: f, exportPerformed: !1 });
                }
                var h = l(7),
                    q = l(1),
                    r = 'undefined' === typeof window ? self : window;
                r.Core = r.Core || {};
                var u = !1,
                    A = null,
                    w = -1,
                    C = {
                        noInitialRun: !0,
                        onRuntimeInitialized: function () {
                            u = !0;
                        },
                        fetchSelf: function () {
                            Object(h.a)(
                                'InfixServer',
                                { 'Wasm.wasm': 1e8, 'Wasm.js.mem': 1e5, '.js.mem': 5e6, '.mem': 3e6 },
                                !!navigator.userAgent.match(/Edge/i)
                            );
                        },
                        locateFile: function (f) {
                            return f;
                        },
                        getPreloadedPackage: function (f, v) {
                            'InfixServerWasm.br.mem' == f && (f = 'InfixServerWasm.mem');
                            return Object(q.b)(''.concat(A).concat(f), v, !1, !0).buffer;
                        }
                    };
                self.Module = C;
                self.basePath = '../external/';
                onmessage = function (f) {
                    f = f.data;
                    switch (f.cmd) {
                        case 'isReady':
                            A = f.resourcePath;
                            C.fetchSelf();
                            t();
                            break;
                        case 'initialiseInfixServer':
                            f = f.l;
                            C.callMain(['']);
                            C.ccall(
                                'wasmInitInfixServer',
                                'number',
                                ['string', 'string', 'string'],
                                ['infixcore.cfg', f, 'results']
                            );
                            f = FS.readFile('results').buffer;
                            postMessage({ cmd: 'initialiseInfixServer', resultsXML: f }, [f]);
                            break;
                        case 'loadAvailableFonts':
                            k(
                                '<Commands><Command Name="Dump Core Fonts"><WebFontURL>' +
                                    (f.webFontURL + '</WebFontURL></Command></Commands>'),
                                'results0.xml',
                                0
                            );
                            f = FS.readFile('results0.xml').buffer;
                            FS.unlink('results0.xml');
                            postMessage({ cmd: 'loadAvailableFonts', resultsXML: f }, [f]);
                            break;
                        case 'exportFile':
                            d(f.pageNumber, f.performExport, f.pdfFile, f.tableData, !0);
                            break;
                        case 'importText':
                            var v = f.pdfFile,
                                y = f.pageNumber,
                                G = f.webFontURL,
                                J = f.galleyId,
                                B = f.tableData,
                                F = f.isSearchReplace,
                                I = f.callbackMapId;
                            f = new Uint8Array(f.importData);
                            var K = new TextDecoder('utf-8').decode(f);
                            y != w && d(y, !0, v, B, !1);
                            f = 'editText' + y + '.xml';
                            v = K.replace(/(\r\n|\n|\r)/gm, '');
                            v = v.replace(/\t/g, '');
                            FS.writeFile(f, v);
                            v = 'outputFile' + y + '.pdf';
                            B = 'results' + y + '.xml';
                            K =
                                '<Commands><Command Name="Translate Import"><File>' +
                                (f +
                                    '</File><StartPage>1</StartPage><EndPage>LastPage</EndPage><AutoSubstitute/><AutoDeleteParas/><Fitting><Shrink><FontSize Min="0.65">true</FontSize><Leading>False</Leading></Shrink><Stretch><FontSize>False</FontSize>');
                            K += '<Leading>False</Leading></Stretch></Fitting>';
                            K += '<ResetLetterSpacing/><IgnoreFlightCheck/>';
                            K += '<MissingFont>Noto Sans Regular</MissingFont><SubstituteAllChars/>';
                            K += '<WebFontURL>' + G + '</WebFontURL>';
                            K += '<TargetLang>en</TargetLang></Command>';
                            K += '<Command Name="SavePDF"><File>' + v + '</File></Command>';
                            K += '<Command Name="DumpObjectBBox"><GID>' + J + '</GID></Command></Commands>';
                            k(K, B, y);
                            G = FS.readFile(v).buffer;
                            K = FS.readFile(B).buffer;
                            FS.unlink(v);
                            FS.unlink(B);
                            FS.unlink(f);
                            postMessage(
                                {
                                    cmd: 'importText',
                                    pageNumber: y,
                                    pdfBuffer: G,
                                    resultsXML: K,
                                    id: J,
                                    isSearchReplace: F,
                                    callbackMapId: I
                                },
                                [G, K]
                            );
                            break;
                        case 'transformObject':
                            y = f.pageNumber;
                            J = f.objectID;
                            var O = f.isText;
                            I = f.topVal;
                            G = f.leftVal;
                            v = f.bottomVal;
                            B = f.rightVal;
                            K = '<Commands><Command Name="TransformToRect">';
                            y != w && d(y, !0, f.pdfFile, f.tableData, !1);
                            f = 'outputFile' + y + '.pdf';
                            F = 'results' + y + '.xml';
                            O = !0 === O ? '<GID>' + J + '</GID>' : '<OID>' + J + '</OID>';
                            K =
                                K +
                                O +
                                ('<Rect><Top>' + I + '</Top><Left>' + G + '</Left><Bottom>') +
                                (v + '</Bottom><Right>' + B + '</Right></Rect></Command>');
                            K += '<Command Name="SavePDF"><File>' + f + '</File></Command>';
                            k(K + ('<Command Name="DumpObjectBBox">' + O + '</Command></Commands>'), F, y);
                            I = FS.readFile(f).buffer;
                            G = FS.readFile(F).buffer;
                            FS.unlink(f);
                            FS.unlink(F);
                            postMessage({ cmd: 'transformObject', pageNumber: y, pdfBuffer: I, resultsXML: G, id: J }, [
                                I,
                                G
                            ]);
                            break;
                        case 'deleteObject':
                            y = f.pageNumber;
                            J = f.objectID;
                            I = f.isText;
                            y != w && d(y, !0, f.pdfFile, f.tableData, !1);
                            f = 'outputFile' + y + '.pdf';
                            F = 'results' + y + '.xml';
                            G = '<Commands><Command Name="DeleteObject">';
                            G =
                                (!0 === I
                                    ? G + ('<GID>' + J + '</GID></Command>')
                                    : G + ('<OID>' + J + '</OID></Command>')) +
                                ('<Command Name="SavePDF"><File>' + f + '</File></Command></Commands>');
                            k(G, F, y);
                            I = FS.readFile(f).buffer;
                            G = FS.readFile(F).buffer;
                            FS.unlink(f);
                            FS.unlink(F);
                            postMessage({ cmd: 'deleteObject', pageNumber: y, pdfBuffer: I, resultsXML: G, id: J }, [
                                I,
                                G
                            ]);
                            break;
                        case 'insertNewTextBox':
                            F = f.pdfFile;
                            y = f.pageNumber;
                            v = f.topVal;
                            B = f.leftVal;
                            K = f.bottomVal;
                            O = f.rightVal;
                            var x = f.font,
                                z = f.fontSize;
                            J = f.importData;
                            f = f.content;
                            I = new TextEncoder().encode('').buffer;
                            y != w && d(y, !0, F, I, !1);
                            F = 'results' + y + '.xml';
                            I = 'exported' + y + '.xml';
                            G = 'outputFile' + y + '.pdf';
                            v =
                                '<Commands><Command Name="Insert Text Box"><Rect><Top>' +
                                (v + '</Top><Left>' + B + '</Left><Bottom>') +
                                (K + '</Bottom><Right>' + O + '</Right></Rect><Size>') +
                                (z + '</Size><FontName>' + x + '</FontName>');
                            B = 'editText' + y + '.xml';
                            FS.writeFile(B, J);
                            v += '<File>' + B + '</File><TransXML>coreTransXML.cfg</TransXML>';
                            v += '<ExportFile>' + I + '</ExportFile><TransXML>coreTransXML.cfg</TransXML>';
                            v += '<StartPage>1</StartPage><EndPage>LastPage</EndPage>';
                            v +=
                                '<AutoSubstitute/><AutoDeleteParas/><Fitting><Shrink><FontSize Min="0.65">true</FontSize>';
                            v += '<Leading>False</Leading></Shrink><Stretch><FontSize>False</FontSize>';
                            v += '<Leading>False</Leading></Stretch></Fitting>';
                            v += '<ResetLetterSpacing/><IgnoreFlightCheck/>';
                            v += '<MissingFont>Noto Sans Regular</MissingFont><SubstituteAllChars/>';
                            v += '<TargetLang>en</TargetLang></Command>';
                            v += '<Command Name="SavePDF"><File>' + G + '</File></Command></Commands>';
                            k(v, F, y);
                            J = FS.readFile(G).buffer;
                            v = FS.readFile(F).buffer;
                            B = FS.readFile(I).buffer;
                            FS.unlink(G);
                            FS.unlink(F);
                            FS.unlink(I);
                            postMessage(
                                {
                                    cmd: 'insertNewTextBox',
                                    pageNumber: y,
                                    pdfBuffer: J,
                                    exportXML: B,
                                    resultsXML: v,
                                    contentHTML: f
                                },
                                [J, B, v]
                            );
                            break;
                        case 'AlignParaText':
                            y = f.pageNumber;
                            J = f.galleyID;
                            I = f.alignment;
                            G = f.topVal1;
                            v = f.leftVal1;
                            B = f.bottomVal1;
                            K = f.rightVal1;
                            O = f.topVal2;
                            x = f.leftVal2;
                            z = f.bottomVal2;
                            var E = f.rightVal2;
                            y != w && d(y, !0, f.pdfFile, f.tableData, !1);
                            f = 'outputFile' + y + '.pdf';
                            F = 'results' + y + '.xml';
                            var H = '<Commands><Command Name="AlignParaText"><GID>' + (J + '</GID>');
                            '' !== G &&
                                ((H =
                                    H +
                                    ('<StartRect><Top>' + G + '</Top><Left>' + v + '</Left><Bottom>') +
                                    (B + '</Bottom><Right>' + K + '</Right></StartRect><EndRect><Top>') +
                                    (O + '</Top><Left>' + x + '</Left>')),
                                (H += '<Bottom>' + z + '</Bottom><Right>' + E + '</Right></EndRect>'));
                            H += '<Align>' + I + '</Align></Command>';
                            H += '<Command Name="SavePDF"><File>' + f + '</File>';
                            H += '</Command></Commands>';
                            k(H, F, y);
                            I = FS.readFile(f).buffer;
                            G = FS.readFile(F).buffer;
                            FS.unlink(f);
                            FS.unlink(F);
                            postMessage({ cmd: 'alignParagraph', pageNumber: y, pdfBuffer: I, resultsXML: G, id: J }, [
                                I,
                                G
                            ]);
                            break;
                        case 'insertImage':
                            (B = f.pdfFile),
                                (y = f.pageNumber),
                                (F = f.newImage),
                                (I = f.scaleType),
                                (G = f.topVal),
                                (v = f.leftVal),
                                (J = f.bottomVal),
                                (f = f.rightVal),
                                (K = new TextEncoder().encode('').buffer),
                                y != w && d(y, !0, B, K, !1),
                                (B = 'outputFile' + y + '.pdf'),
                                (K = 'results' + y + '.xml'),
                                (O = 'imageFile' + y + '.jpg'),
                                FS.writeFile(O, g.from(F)),
                                (F =
                                    '<Commands><Command Name="Place Image"><File>' +
                                    (O + '</File><Scale>') +
                                    (I + '</Scale><Rect><Top>') +
                                    (G + '</Top><Left>' + v + '</Left>')),
                                (F += '<Bottom>' + J + '</Bottom><Right>' + f + '</Right></Rect></Command>'),
                                (F += '<Command Name="SavePDF"><File>' + B + '</File>'),
                                (F += '</Command></Commands>'),
                                k(F, K, y),
                                (f = FS.readFile(B).buffer),
                                (J = FS.readFile(K).buffer),
                                FS.unlink(B),
                                FS.unlink(K),
                                FS.unlink(O),
                                postMessage({ cmd: 'insertImage', pageNumber: y, pdfBuffer: f, resultsXML: J }, [f, J]);
                    }
                };
            }.call(this, l(11).Buffer));
        },
        function (p, m, l) {
            (function (g) {
                function k() {
                    try {
                        var a = new Uint8Array(1);
                        a.__proto__ = {
                            __proto__: Uint8Array.prototype,
                            foo: function () {
                                return 42;
                            }
                        };
                        return 42 === a.foo() && 'function' === typeof a.subarray && 0 === a.subarray(1, 1).byteLength;
                    } catch (b) {
                        return !1;
                    }
                }
                function t(a, b) {
                    if ((d.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823) < b)
                        throw new RangeError('Invalid typed array length');
                    d.TYPED_ARRAY_SUPPORT
                        ? ((a = new Uint8Array(b)), (a.__proto__ = d.prototype))
                        : (null === a && (a = new d(b)), (a.length = b));
                    return a;
                }
                function d(a, b, c) {
                    if (!(d.TYPED_ARRAY_SUPPORT || this instanceof d)) return new d(a, b, c);
                    if ('number' === typeof a) {
                        if ('string' === typeof b)
                            throw Error('If encoding is specified then the first argument must be a string');
                        return r(this, a);
                    }
                    return h(this, a, b, c);
                }
                function h(a, b, c, e) {
                    if ('number' === typeof b) throw new TypeError('"value" argument must not be a number');
                    if ('undefined' !== typeof ArrayBuffer && b instanceof ArrayBuffer) {
                        b.byteLength;
                        if (0 > c || b.byteLength < c) throw new RangeError("'offset' is out of bounds");
                        if (b.byteLength < c + (e || 0)) throw new RangeError("'length' is out of bounds");
                        b =
                            void 0 === c && void 0 === e
                                ? new Uint8Array(b)
                                : void 0 === e
                                ? new Uint8Array(b, c)
                                : new Uint8Array(b, c, e);
                        d.TYPED_ARRAY_SUPPORT ? ((a = b), (a.__proto__ = d.prototype)) : (a = u(a, b));
                        return a;
                    }
                    if ('string' === typeof b) {
                        e = a;
                        a = c;
                        if ('string' !== typeof a || '' === a) a = 'utf8';
                        if (!d.isEncoding(a)) throw new TypeError('"encoding" must be a valid string encoding');
                        c = C(b, a) | 0;
                        e = t(e, c);
                        b = e.write(b, a);
                        b !== c && (e = e.slice(0, b));
                        return e;
                    }
                    return A(a, b);
                }
                function q(a) {
                    if ('number' !== typeof a) throw new TypeError('"size" argument must be a number');
                    if (0 > a) throw new RangeError('"size" argument must not be negative');
                }
                function r(a, b) {
                    q(b);
                    a = t(a, 0 > b ? 0 : w(b) | 0);
                    if (!d.TYPED_ARRAY_SUPPORT) for (var c = 0; c < b; ++c) a[c] = 0;
                    return a;
                }
                function u(a, b) {
                    var c = 0 > b.length ? 0 : w(b.length) | 0;
                    a = t(a, c);
                    for (var e = 0; e < c; e += 1) a[e] = b[e] & 255;
                    return a;
                }
                function A(a, b) {
                    if (d.isBuffer(b)) {
                        var c = w(b.length) | 0;
                        a = t(a, c);
                        if (0 === a.length) return a;
                        b.copy(a, 0, 0, c);
                        return a;
                    }
                    if (b) {
                        if (('undefined' !== typeof ArrayBuffer && b.buffer instanceof ArrayBuffer) || 'length' in b)
                            return (
                                (c = 'number' !== typeof b.length) || ((c = b.length), (c = c !== c)),
                                c ? t(a, 0) : u(a, b)
                            );
                        if ('Buffer' === b.type && U(b.data)) return u(a, b.data);
                    }
                    throw new TypeError(
                        'First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.'
                    );
                }
                function w(a) {
                    if (a >= (d.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823))
                        throw new RangeError(
                            'Attempt to allocate Buffer larger than maximum size: 0x' +
                                (d.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823).toString(16) +
                                ' bytes'
                        );
                    return a | 0;
                }
                function C(a, b) {
                    if (d.isBuffer(a)) return a.length;
                    if (
                        'undefined' !== typeof ArrayBuffer &&
                        'function' === typeof ArrayBuffer.isView &&
                        (ArrayBuffer.isView(a) || a instanceof ArrayBuffer)
                    )
                        return a.byteLength;
                    'string' !== typeof a && (a = '' + a);
                    var c = a.length;
                    if (0 === c) return 0;
                    for (var e = !1; ; )
                        switch (b) {
                            case 'ascii':
                            case 'latin1':
                            case 'binary':
                                return c;
                            case 'utf8':
                            case 'utf-8':
                            case void 0:
                                return E(a).length;
                            case 'ucs2':
                            case 'ucs-2':
                            case 'utf16le':
                            case 'utf-16le':
                                return 2 * c;
                            case 'hex':
                                return c >>> 1;
                            case 'base64':
                                return P(a).length;
                            default:
                                if (e) return E(a).length;
                                b = ('' + b).toLowerCase();
                                e = !0;
                        }
                }
                function f(a, b, c) {
                    var e = !1;
                    if (void 0 === b || 0 > b) b = 0;
                    if (b > this.length) return '';
                    if (void 0 === c || c > this.length) c = this.length;
                    if (0 >= c) return '';
                    c >>>= 0;
                    b >>>= 0;
                    if (c <= b) return '';
                    for (a || (a = 'utf8'); ; )
                        switch (a) {
                            case 'hex':
                                a = b;
                                b = c;
                                c = this.length;
                                if (!a || 0 > a) a = 0;
                                if (!b || 0 > b || b > c) b = c;
                                e = '';
                                for (c = a; c < b; ++c)
                                    (a = e),
                                        (e = this[c]),
                                        (e = 16 > e ? '0' + e.toString(16) : e.toString(16)),
                                        (e = a + e);
                                return e;
                            case 'utf8':
                            case 'utf-8':
                                return J(this, b, c);
                            case 'ascii':
                                a = '';
                                for (c = Math.min(this.length, c); b < c; ++b) a += String.fromCharCode(this[b] & 127);
                                return a;
                            case 'latin1':
                            case 'binary':
                                a = '';
                                for (c = Math.min(this.length, c); b < c; ++b) a += String.fromCharCode(this[b]);
                                return a;
                            case 'base64':
                                return (
                                    (b =
                                        0 === b && c === this.length
                                            ? S.fromByteArray(this)
                                            : S.fromByteArray(this.slice(b, c))),
                                    b
                                );
                            case 'ucs2':
                            case 'ucs-2':
                            case 'utf16le':
                            case 'utf-16le':
                                b = this.slice(b, c);
                                c = '';
                                for (a = 0; a < b.length; a += 2) c += String.fromCharCode(b[a] + 256 * b[a + 1]);
                                return c;
                            default:
                                if (e) throw new TypeError('Unknown encoding: ' + a);
                                a = (a + '').toLowerCase();
                                e = !0;
                        }
                }
                function v(a, b, c) {
                    var e = a[b];
                    a[b] = a[c];
                    a[c] = e;
                }
                function y(a, b, c, e, n) {
                    if (0 === a.length) return -1;
                    'string' === typeof c
                        ? ((e = c), (c = 0))
                        : 2147483647 < c
                        ? (c = 2147483647)
                        : -2147483648 > c && (c = -2147483648);
                    c = +c;
                    isNaN(c) && (c = n ? 0 : a.length - 1);
                    0 > c && (c = a.length + c);
                    if (c >= a.length) {
                        if (n) return -1;
                        c = a.length - 1;
                    } else if (0 > c)
                        if (n) c = 0;
                        else return -1;
                    'string' === typeof b && (b = d.from(b, e));
                    if (d.isBuffer(b)) return 0 === b.length ? -1 : G(a, b, c, e, n);
                    if ('number' === typeof b)
                        return (
                            (b &= 255),
                            d.TYPED_ARRAY_SUPPORT && 'function' === typeof Uint8Array.prototype.indexOf
                                ? n
                                    ? Uint8Array.prototype.indexOf.call(a, b, c)
                                    : Uint8Array.prototype.lastIndexOf.call(a, b, c)
                                : G(a, [b], c, e, n)
                        );
                    throw new TypeError('val must be string, number or Buffer');
                }
                function G(a, b, c, e, n) {
                    function D(T, V) {
                        return 1 === L ? T[V] : T.readUInt16BE(V * L);
                    }
                    var L = 1,
                        M = a.length,
                        R = b.length;
                    if (
                        void 0 !== e &&
                        ((e = String(e).toLowerCase()),
                        'ucs2' === e || 'ucs-2' === e || 'utf16le' === e || 'utf-16le' === e)
                    ) {
                        if (2 > a.length || 2 > b.length) return -1;
                        L = 2;
                        M /= 2;
                        R /= 2;
                        c /= 2;
                    }
                    if (n)
                        for (e = -1; c < M; c++)
                            if (D(a, c) === D(b, -1 === e ? 0 : c - e)) {
                                if ((-1 === e && (e = c), c - e + 1 === R)) return e * L;
                            } else -1 !== e && (c -= c - e), (e = -1);
                    else
                        for (c + R > M && (c = M - R); 0 <= c; c--) {
                            M = !0;
                            for (e = 0; e < R; e++)
                                if (D(a, c + e) !== D(b, e)) {
                                    M = !1;
                                    break;
                                }
                            if (M) return c;
                        }
                    return -1;
                }
                function J(a, b, c) {
                    c = Math.min(a.length, c);
                    for (var e = []; b < c; ) {
                        var n = a[b],
                            D = null,
                            L = 239 < n ? 4 : 223 < n ? 3 : 191 < n ? 2 : 1;
                        if (b + L <= c)
                            switch (L) {
                                case 1:
                                    128 > n && (D = n);
                                    break;
                                case 2:
                                    var M = a[b + 1];
                                    128 === (M & 192) && ((n = ((n & 31) << 6) | (M & 63)), 127 < n && (D = n));
                                    break;
                                case 3:
                                    M = a[b + 1];
                                    var R = a[b + 2];
                                    128 === (M & 192) &&
                                        128 === (R & 192) &&
                                        ((n = ((n & 15) << 12) | ((M & 63) << 6) | (R & 63)),
                                        2047 < n && (55296 > n || 57343 < n) && (D = n));
                                    break;
                                case 4:
                                    M = a[b + 1];
                                    R = a[b + 2];
                                    var T = a[b + 3];
                                    128 === (M & 192) &&
                                        128 === (R & 192) &&
                                        128 === (T & 192) &&
                                        ((n = ((n & 15) << 18) | ((M & 63) << 12) | ((R & 63) << 6) | (T & 63)),
                                        65535 < n && 1114112 > n && (D = n));
                            }
                        null === D
                            ? ((D = 65533), (L = 1))
                            : 65535 < D &&
                              ((D -= 65536), e.push(((D >>> 10) & 1023) | 55296), (D = 56320 | (D & 1023)));
                        e.push(D);
                        b += L;
                    }
                    a = e.length;
                    if (a <= W) e = String.fromCharCode.apply(String, e);
                    else {
                        c = '';
                        for (b = 0; b < a; ) c += String.fromCharCode.apply(String, e.slice(b, (b += W)));
                        e = c;
                    }
                    return e;
                }
                function B(a, b, c) {
                    if (0 !== a % 1 || 0 > a) throw new RangeError('offset is not uint');
                    if (a + b > c) throw new RangeError('Trying to access beyond buffer length');
                }
                function F(a, b, c, e, n, D) {
                    if (!d.isBuffer(a)) throw new TypeError('"buffer" argument must be a Buffer instance');
                    if (b > n || b < D) throw new RangeError('"value" argument is out of bounds');
                    if (c + e > a.length) throw new RangeError('Index out of range');
                }
                function I(a, b, c, e) {
                    0 > b && (b = 65535 + b + 1);
                    for (var n = 0, D = Math.min(a.length - c, 2); n < D; ++n)
                        a[c + n] = (b & (255 << (8 * (e ? n : 1 - n)))) >>> (8 * (e ? n : 1 - n));
                }
                function K(a, b, c, e) {
                    0 > b && (b = 4294967295 + b + 1);
                    for (var n = 0, D = Math.min(a.length - c, 4); n < D; ++n)
                        a[c + n] = (b >>> (8 * (e ? n : 3 - n))) & 255;
                }
                function O(a, b, c, e, n, D) {
                    if (c + e > a.length) throw new RangeError('Index out of range');
                    if (0 > c) throw new RangeError('Index out of range');
                }
                function x(a, b, c, e, n) {
                    n || O(a, b, c, 4, 3.4028234663852886e38, -3.4028234663852886e38);
                    N.write(a, b, c, e, 23, 4);
                    return c + 4;
                }
                function z(a, b, c, e, n) {
                    n || O(a, b, c, 8, 1.7976931348623157e308, -1.7976931348623157e308);
                    N.write(a, b, c, e, 52, 8);
                    return c + 8;
                }
                function E(a, b) {
                    b = b || Infinity;
                    for (var c, e = a.length, n = null, D = [], L = 0; L < e; ++L) {
                        c = a.charCodeAt(L);
                        if (55295 < c && 57344 > c) {
                            if (!n) {
                                if (56319 < c) {
                                    -1 < (b -= 3) && D.push(239, 191, 189);
                                    continue;
                                } else if (L + 1 === e) {
                                    -1 < (b -= 3) && D.push(239, 191, 189);
                                    continue;
                                }
                                n = c;
                                continue;
                            }
                            if (56320 > c) {
                                -1 < (b -= 3) && D.push(239, 191, 189);
                                n = c;
                                continue;
                            }
                            c = (((n - 55296) << 10) | (c - 56320)) + 65536;
                        } else n && -1 < (b -= 3) && D.push(239, 191, 189);
                        n = null;
                        if (128 > c) {
                            if (0 > --b) break;
                            D.push(c);
                        } else if (2048 > c) {
                            if (0 > (b -= 2)) break;
                            D.push((c >> 6) | 192, (c & 63) | 128);
                        } else if (65536 > c) {
                            if (0 > (b -= 3)) break;
                            D.push((c >> 12) | 224, ((c >> 6) & 63) | 128, (c & 63) | 128);
                        } else if (1114112 > c) {
                            if (0 > (b -= 4)) break;
                            D.push((c >> 18) | 240, ((c >> 12) & 63) | 128, ((c >> 6) & 63) | 128, (c & 63) | 128);
                        } else throw Error('Invalid code point');
                    }
                    return D;
                }
                function H(a) {
                    for (var b = [], c = 0; c < a.length; ++c) b.push(a.charCodeAt(c) & 255);
                    return b;
                }
                function P(a) {
                    var b = S,
                        c = b.toByteArray;
                    a = (a.trim ? a.trim() : a.replace(/^\s+|\s+$/g, '')).replace(X, '');
                    if (2 > a.length) a = '';
                    else for (; 0 !== a.length % 4; ) a += '=';
                    return c.call(b, a);
                }
                function Q(a, b, c, e) {
                    for (var n = 0; n < e && !(n + c >= b.length || n >= a.length); ++n) b[n + c] = a[n];
                    return n;
                }
                var S = l(13),
                    N = l(14),
                    U = l(15);
                m.Buffer = d;
                m.SlowBuffer = function (a) {
                    +a != a && (a = 0);
                    return d.alloc(+a);
                };
                m.INSPECT_MAX_BYTES = 50;
                d.TYPED_ARRAY_SUPPORT = void 0 !== g.TYPED_ARRAY_SUPPORT ? g.TYPED_ARRAY_SUPPORT : k();
                m.kMaxLength = d.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
                d.poolSize = 8192;
                d._augment = function (a) {
                    a.__proto__ = d.prototype;
                    return a;
                };
                d.from = function (a, b, c) {
                    return h(null, a, b, c);
                };
                d.TYPED_ARRAY_SUPPORT &&
                    ((d.prototype.__proto__ = Uint8Array.prototype),
                    (d.__proto__ = Uint8Array),
                    'undefined' !== typeof Symbol &&
                        Symbol.species &&
                        d[Symbol.species] === d &&
                        Object.defineProperty(d, Symbol.species, { value: null, configurable: !0 }));
                d.alloc = function (a, b, c) {
                    q(a);
                    a =
                        0 >= a
                            ? t(null, a)
                            : void 0 !== b
                            ? 'string' === typeof c
                                ? t(null, a).fill(b, c)
                                : t(null, a).fill(b)
                            : t(null, a);
                    return a;
                };
                d.allocUnsafe = function (a) {
                    return r(null, a);
                };
                d.allocUnsafeSlow = function (a) {
                    return r(null, a);
                };
                d.isBuffer = function (a) {
                    return !(null == a || !a._isBuffer);
                };
                d.compare = function (a, b) {
                    if (!d.isBuffer(a) || !d.isBuffer(b)) throw new TypeError('Arguments must be Buffers');
                    if (a === b) return 0;
                    for (var c = a.length, e = b.length, n = 0, D = Math.min(c, e); n < D; ++n)
                        if (a[n] !== b[n]) {
                            c = a[n];
                            e = b[n];
                            break;
                        }
                    return c < e ? -1 : e < c ? 1 : 0;
                };
                d.isEncoding = function (a) {
                    switch (String(a).toLowerCase()) {
                        case 'hex':
                        case 'utf8':
                        case 'utf-8':
                        case 'ascii':
                        case 'latin1':
                        case 'binary':
                        case 'base64':
                        case 'ucs2':
                        case 'ucs-2':
                        case 'utf16le':
                        case 'utf-16le':
                            return !0;
                        default:
                            return !1;
                    }
                };
                d.concat = function (a, b) {
                    if (!U(a)) throw new TypeError('"list" argument must be an Array of Buffers');
                    if (0 === a.length) return d.alloc(0);
                    var c;
                    if (void 0 === b) for (c = b = 0; c < a.length; ++c) b += a[c].length;
                    b = d.allocUnsafe(b);
                    var e = 0;
                    for (c = 0; c < a.length; ++c) {
                        var n = a[c];
                        if (!d.isBuffer(n)) throw new TypeError('"list" argument must be an Array of Buffers');
                        n.copy(b, e);
                        e += n.length;
                    }
                    return b;
                };
                d.byteLength = C;
                d.prototype._isBuffer = !0;
                d.prototype.swap16 = function () {
                    var a = this.length;
                    if (0 !== a % 2) throw new RangeError('Buffer size must be a multiple of 16-bits');
                    for (var b = 0; b < a; b += 2) v(this, b, b + 1);
                    return this;
                };
                d.prototype.swap32 = function () {
                    var a = this.length;
                    if (0 !== a % 4) throw new RangeError('Buffer size must be a multiple of 32-bits');
                    for (var b = 0; b < a; b += 4) v(this, b, b + 3), v(this, b + 1, b + 2);
                    return this;
                };
                d.prototype.swap64 = function () {
                    var a = this.length;
                    if (0 !== a % 8) throw new RangeError('Buffer size must be a multiple of 64-bits');
                    for (var b = 0; b < a; b += 8)
                        v(this, b, b + 7), v(this, b + 1, b + 6), v(this, b + 2, b + 5), v(this, b + 3, b + 4);
                    return this;
                };
                d.prototype.toString = function () {
                    var a = this.length | 0;
                    return 0 === a ? '' : 0 === arguments.length ? J(this, 0, a) : f.apply(this, arguments);
                };
                d.prototype.equals = function (a) {
                    if (!d.isBuffer(a)) throw new TypeError('Argument must be a Buffer');
                    return this === a ? !0 : 0 === d.compare(this, a);
                };
                d.prototype.inspect = function () {
                    var a = '',
                        b = m.INSPECT_MAX_BYTES;
                    0 < this.length &&
                        ((a = this.toString('hex', 0, b).match(/.{2}/g).join(' ')), this.length > b && (a += ' ... '));
                    return '<Buffer ' + a + '>';
                };
                d.prototype.compare = function (a, b, c, e, n) {
                    if (!d.isBuffer(a)) throw new TypeError('Argument must be a Buffer');
                    void 0 === b && (b = 0);
                    void 0 === c && (c = a ? a.length : 0);
                    void 0 === e && (e = 0);
                    void 0 === n && (n = this.length);
                    if (0 > b || c > a.length || 0 > e || n > this.length) throw new RangeError('out of range index');
                    if (e >= n && b >= c) return 0;
                    if (e >= n) return -1;
                    if (b >= c) return 1;
                    b >>>= 0;
                    c >>>= 0;
                    e >>>= 0;
                    n >>>= 0;
                    if (this === a) return 0;
                    var D = n - e,
                        L = c - b,
                        M = Math.min(D, L);
                    e = this.slice(e, n);
                    a = a.slice(b, c);
                    for (b = 0; b < M; ++b)
                        if (e[b] !== a[b]) {
                            D = e[b];
                            L = a[b];
                            break;
                        }
                    return D < L ? -1 : L < D ? 1 : 0;
                };
                d.prototype.includes = function (a, b, c) {
                    return -1 !== this.indexOf(a, b, c);
                };
                d.prototype.indexOf = function (a, b, c) {
                    return y(this, a, b, c, !0);
                };
                d.prototype.lastIndexOf = function (a, b, c) {
                    return y(this, a, b, c, !1);
                };
                d.prototype.write = function (a, b, c, e) {
                    if (void 0 === b) (e = 'utf8'), (c = this.length), (b = 0);
                    else if (void 0 === c && 'string' === typeof b) (e = b), (c = this.length), (b = 0);
                    else if (isFinite(b))
                        (b |= 0), isFinite(c) ? ((c |= 0), void 0 === e && (e = 'utf8')) : ((e = c), (c = void 0));
                    else throw Error('Buffer.write(string, encoding, offset[, length]) is no longer supported');
                    var n = this.length - b;
                    if (void 0 === c || c > n) c = n;
                    if ((0 < a.length && (0 > c || 0 > b)) || b > this.length)
                        throw new RangeError('Attempt to write outside buffer bounds');
                    e || (e = 'utf8');
                    for (n = !1; ; )
                        switch (e) {
                            case 'hex':
                                a: {
                                    b = Number(b) || 0;
                                    e = this.length - b;
                                    c ? ((c = Number(c)), c > e && (c = e)) : (c = e);
                                    e = a.length;
                                    if (0 !== e % 2) throw new TypeError('Invalid hex string');
                                    c > e / 2 && (c = e / 2);
                                    for (e = 0; e < c; ++e) {
                                        n = parseInt(a.substr(2 * e, 2), 16);
                                        if (isNaN(n)) {
                                            a = e;
                                            break a;
                                        }
                                        this[b + e] = n;
                                    }
                                    a = e;
                                }
                                return a;
                            case 'utf8':
                            case 'utf-8':
                                return Q(E(a, this.length - b), this, b, c);
                            case 'ascii':
                                return Q(H(a), this, b, c);
                            case 'latin1':
                            case 'binary':
                                return Q(H(a), this, b, c);
                            case 'base64':
                                return Q(P(a), this, b, c);
                            case 'ucs2':
                            case 'ucs-2':
                            case 'utf16le':
                            case 'utf-16le':
                                e = a;
                                n = this.length - b;
                                for (var D = [], L = 0; L < e.length && !(0 > (n -= 2)); ++L) {
                                    var M = e.charCodeAt(L);
                                    a = M >> 8;
                                    M %= 256;
                                    D.push(M);
                                    D.push(a);
                                }
                                return Q(D, this, b, c);
                            default:
                                if (n) throw new TypeError('Unknown encoding: ' + e);
                                e = ('' + e).toLowerCase();
                                n = !0;
                        }
                };
                d.prototype.toJSON = function () {
                    return { type: 'Buffer', data: Array.prototype.slice.call(this._arr || this, 0) };
                };
                var W = 4096;
                d.prototype.slice = function (a, b) {
                    var c = this.length;
                    a = ~~a;
                    b = void 0 === b ? c : ~~b;
                    0 > a ? ((a += c), 0 > a && (a = 0)) : a > c && (a = c);
                    0 > b ? ((b += c), 0 > b && (b = 0)) : b > c && (b = c);
                    b < a && (b = a);
                    if (d.TYPED_ARRAY_SUPPORT) (b = this.subarray(a, b)), (b.__proto__ = d.prototype);
                    else {
                        c = b - a;
                        b = new d(c, void 0);
                        for (var e = 0; e < c; ++e) b[e] = this[e + a];
                    }
                    return b;
                };
                d.prototype.readUIntLE = function (a, b, c) {
                    a |= 0;
                    b |= 0;
                    c || B(a, b, this.length);
                    c = this[a];
                    for (var e = 1, n = 0; ++n < b && (e *= 256); ) c += this[a + n] * e;
                    return c;
                };
                d.prototype.readUIntBE = function (a, b, c) {
                    a |= 0;
                    b |= 0;
                    c || B(a, b, this.length);
                    c = this[a + --b];
                    for (var e = 1; 0 < b && (e *= 256); ) c += this[a + --b] * e;
                    return c;
                };
                d.prototype.readUInt8 = function (a, b) {
                    b || B(a, 1, this.length);
                    return this[a];
                };
                d.prototype.readUInt16LE = function (a, b) {
                    b || B(a, 2, this.length);
                    return this[a] | (this[a + 1] << 8);
                };
                d.prototype.readUInt16BE = function (a, b) {
                    b || B(a, 2, this.length);
                    return (this[a] << 8) | this[a + 1];
                };
                d.prototype.readUInt32LE = function (a, b) {
                    b || B(a, 4, this.length);
                    return (this[a] | (this[a + 1] << 8) | (this[a + 2] << 16)) + 16777216 * this[a + 3];
                };
                d.prototype.readUInt32BE = function (a, b) {
                    b || B(a, 4, this.length);
                    return 16777216 * this[a] + ((this[a + 1] << 16) | (this[a + 2] << 8) | this[a + 3]);
                };
                d.prototype.readIntLE = function (a, b, c) {
                    a |= 0;
                    b |= 0;
                    c || B(a, b, this.length);
                    c = this[a];
                    for (var e = 1, n = 0; ++n < b && (e *= 256); ) c += this[a + n] * e;
                    c >= 128 * e && (c -= Math.pow(2, 8 * b));
                    return c;
                };
                d.prototype.readIntBE = function (a, b, c) {
                    a |= 0;
                    b |= 0;
                    c || B(a, b, this.length);
                    c = b;
                    for (var e = 1, n = this[a + --c]; 0 < c && (e *= 256); ) n += this[a + --c] * e;
                    n >= 128 * e && (n -= Math.pow(2, 8 * b));
                    return n;
                };
                d.prototype.readInt8 = function (a, b) {
                    b || B(a, 1, this.length);
                    return this[a] & 128 ? -1 * (255 - this[a] + 1) : this[a];
                };
                d.prototype.readInt16LE = function (a, b) {
                    b || B(a, 2, this.length);
                    a = this[a] | (this[a + 1] << 8);
                    return a & 32768 ? a | 4294901760 : a;
                };
                d.prototype.readInt16BE = function (a, b) {
                    b || B(a, 2, this.length);
                    a = this[a + 1] | (this[a] << 8);
                    return a & 32768 ? a | 4294901760 : a;
                };
                d.prototype.readInt32LE = function (a, b) {
                    b || B(a, 4, this.length);
                    return this[a] | (this[a + 1] << 8) | (this[a + 2] << 16) | (this[a + 3] << 24);
                };
                d.prototype.readInt32BE = function (a, b) {
                    b || B(a, 4, this.length);
                    return (this[a] << 24) | (this[a + 1] << 16) | (this[a + 2] << 8) | this[a + 3];
                };
                d.prototype.readFloatLE = function (a, b) {
                    b || B(a, 4, this.length);
                    return N.read(this, a, !0, 23, 4);
                };
                d.prototype.readFloatBE = function (a, b) {
                    b || B(a, 4, this.length);
                    return N.read(this, a, !1, 23, 4);
                };
                d.prototype.readDoubleLE = function (a, b) {
                    b || B(a, 8, this.length);
                    return N.read(this, a, !0, 52, 8);
                };
                d.prototype.readDoubleBE = function (a, b) {
                    b || B(a, 8, this.length);
                    return N.read(this, a, !1, 52, 8);
                };
                d.prototype.writeUIntLE = function (a, b, c, e) {
                    a = +a;
                    b |= 0;
                    c |= 0;
                    e || F(this, a, b, c, Math.pow(2, 8 * c) - 1, 0);
                    e = 1;
                    var n = 0;
                    for (this[b] = a & 255; ++n < c && (e *= 256); ) this[b + n] = (a / e) & 255;
                    return b + c;
                };
                d.prototype.writeUIntBE = function (a, b, c, e) {
                    a = +a;
                    b |= 0;
                    c |= 0;
                    e || F(this, a, b, c, Math.pow(2, 8 * c) - 1, 0);
                    e = c - 1;
                    var n = 1;
                    for (this[b + e] = a & 255; 0 <= --e && (n *= 256); ) this[b + e] = (a / n) & 255;
                    return b + c;
                };
                d.prototype.writeUInt8 = function (a, b, c) {
                    a = +a;
                    b |= 0;
                    c || F(this, a, b, 1, 255, 0);
                    d.TYPED_ARRAY_SUPPORT || (a = Math.floor(a));
                    this[b] = a & 255;
                    return b + 1;
                };
                d.prototype.writeUInt16LE = function (a, b, c) {
                    a = +a;
                    b |= 0;
                    c || F(this, a, b, 2, 65535, 0);
                    d.TYPED_ARRAY_SUPPORT ? ((this[b] = a & 255), (this[b + 1] = a >>> 8)) : I(this, a, b, !0);
                    return b + 2;
                };
                d.prototype.writeUInt16BE = function (a, b, c) {
                    a = +a;
                    b |= 0;
                    c || F(this, a, b, 2, 65535, 0);
                    d.TYPED_ARRAY_SUPPORT ? ((this[b] = a >>> 8), (this[b + 1] = a & 255)) : I(this, a, b, !1);
                    return b + 2;
                };
                d.prototype.writeUInt32LE = function (a, b, c) {
                    a = +a;
                    b |= 0;
                    c || F(this, a, b, 4, 4294967295, 0);
                    d.TYPED_ARRAY_SUPPORT
                        ? ((this[b + 3] = a >>> 24),
                          (this[b + 2] = a >>> 16),
                          (this[b + 1] = a >>> 8),
                          (this[b] = a & 255))
                        : K(this, a, b, !0);
                    return b + 4;
                };
                d.prototype.writeUInt32BE = function (a, b, c) {
                    a = +a;
                    b |= 0;
                    c || F(this, a, b, 4, 4294967295, 0);
                    d.TYPED_ARRAY_SUPPORT
                        ? ((this[b] = a >>> 24),
                          (this[b + 1] = a >>> 16),
                          (this[b + 2] = a >>> 8),
                          (this[b + 3] = a & 255))
                        : K(this, a, b, !1);
                    return b + 4;
                };
                d.prototype.writeIntLE = function (a, b, c, e) {
                    a = +a;
                    b |= 0;
                    e || ((e = Math.pow(2, 8 * c - 1)), F(this, a, b, c, e - 1, -e));
                    e = 0;
                    var n = 1,
                        D = 0;
                    for (this[b] = a & 255; ++e < c && (n *= 256); )
                        0 > a && 0 === D && 0 !== this[b + e - 1] && (D = 1),
                            (this[b + e] = (((a / n) >> 0) - D) & 255);
                    return b + c;
                };
                d.prototype.writeIntBE = function (a, b, c, e) {
                    a = +a;
                    b |= 0;
                    e || ((e = Math.pow(2, 8 * c - 1)), F(this, a, b, c, e - 1, -e));
                    e = c - 1;
                    var n = 1,
                        D = 0;
                    for (this[b + e] = a & 255; 0 <= --e && (n *= 256); )
                        0 > a && 0 === D && 0 !== this[b + e + 1] && (D = 1),
                            (this[b + e] = (((a / n) >> 0) - D) & 255);
                    return b + c;
                };
                d.prototype.writeInt8 = function (a, b, c) {
                    a = +a;
                    b |= 0;
                    c || F(this, a, b, 1, 127, -128);
                    d.TYPED_ARRAY_SUPPORT || (a = Math.floor(a));
                    0 > a && (a = 255 + a + 1);
                    this[b] = a & 255;
                    return b + 1;
                };
                d.prototype.writeInt16LE = function (a, b, c) {
                    a = +a;
                    b |= 0;
                    c || F(this, a, b, 2, 32767, -32768);
                    d.TYPED_ARRAY_SUPPORT ? ((this[b] = a & 255), (this[b + 1] = a >>> 8)) : I(this, a, b, !0);
                    return b + 2;
                };
                d.prototype.writeInt16BE = function (a, b, c) {
                    a = +a;
                    b |= 0;
                    c || F(this, a, b, 2, 32767, -32768);
                    d.TYPED_ARRAY_SUPPORT ? ((this[b] = a >>> 8), (this[b + 1] = a & 255)) : I(this, a, b, !1);
                    return b + 2;
                };
                d.prototype.writeInt32LE = function (a, b, c) {
                    a = +a;
                    b |= 0;
                    c || F(this, a, b, 4, 2147483647, -2147483648);
                    d.TYPED_ARRAY_SUPPORT
                        ? ((this[b] = a & 255),
                          (this[b + 1] = a >>> 8),
                          (this[b + 2] = a >>> 16),
                          (this[b + 3] = a >>> 24))
                        : K(this, a, b, !0);
                    return b + 4;
                };
                d.prototype.writeInt32BE = function (a, b, c) {
                    a = +a;
                    b |= 0;
                    c || F(this, a, b, 4, 2147483647, -2147483648);
                    0 > a && (a = 4294967295 + a + 1);
                    d.TYPED_ARRAY_SUPPORT
                        ? ((this[b] = a >>> 24),
                          (this[b + 1] = a >>> 16),
                          (this[b + 2] = a >>> 8),
                          (this[b + 3] = a & 255))
                        : K(this, a, b, !1);
                    return b + 4;
                };
                d.prototype.writeFloatLE = function (a, b, c) {
                    return x(this, a, b, !0, c);
                };
                d.prototype.writeFloatBE = function (a, b, c) {
                    return x(this, a, b, !1, c);
                };
                d.prototype.writeDoubleLE = function (a, b, c) {
                    return z(this, a, b, !0, c);
                };
                d.prototype.writeDoubleBE = function (a, b, c) {
                    return z(this, a, b, !1, c);
                };
                d.prototype.copy = function (a, b, c, e) {
                    c || (c = 0);
                    e || 0 === e || (e = this.length);
                    b >= a.length && (b = a.length);
                    b || (b = 0);
                    0 < e && e < c && (e = c);
                    if (e === c || 0 === a.length || 0 === this.length) return 0;
                    if (0 > b) throw new RangeError('targetStart out of bounds');
                    if (0 > c || c >= this.length) throw new RangeError('sourceStart out of bounds');
                    if (0 > e) throw new RangeError('sourceEnd out of bounds');
                    e > this.length && (e = this.length);
                    a.length - b < e - c && (e = a.length - b + c);
                    var n = e - c;
                    if (this === a && c < b && b < e) for (e = n - 1; 0 <= e; --e) a[e + b] = this[e + c];
                    else if (1e3 > n || !d.TYPED_ARRAY_SUPPORT) for (e = 0; e < n; ++e) a[e + b] = this[e + c];
                    else Uint8Array.prototype.set.call(a, this.subarray(c, c + n), b);
                    return n;
                };
                d.prototype.fill = function (a, b, c, e) {
                    if ('string' === typeof a) {
                        'string' === typeof b
                            ? ((e = b), (b = 0), (c = this.length))
                            : 'string' === typeof c && ((e = c), (c = this.length));
                        if (1 === a.length) {
                            var n = a.charCodeAt(0);
                            256 > n && (a = n);
                        }
                        if (void 0 !== e && 'string' !== typeof e) throw new TypeError('encoding must be a string');
                        if ('string' === typeof e && !d.isEncoding(e)) throw new TypeError('Unknown encoding: ' + e);
                    } else 'number' === typeof a && (a &= 255);
                    if (0 > b || this.length < b || this.length < c) throw new RangeError('Out of range index');
                    if (c <= b) return this;
                    b >>>= 0;
                    c = void 0 === c ? this.length : c >>> 0;
                    a || (a = 0);
                    if ('number' === typeof a) for (e = b; e < c; ++e) this[e] = a;
                    else
                        for (a = d.isBuffer(a) ? a : E(new d(a, e).toString()), n = a.length, e = 0; e < c - b; ++e)
                            this[e + b] = a[e % n];
                    return this;
                };
                var X = /[^+\/0-9A-Za-z-_]/g;
            }.call(this, l(12)));
        },
        function (p, m) {
            m = (function () {
                return this;
            })();
            try {
                m = m || new Function('return this')();
            } catch (l) {
                'object' === typeof window && (m = window);
            }
            p.exports = m;
        },
        function (p, m, l) {
            function g(h) {
                var q = h.length;
                if (0 < q % 4) throw Error('Invalid string. Length must be a multiple of 4');
                h = h.indexOf('=');
                -1 === h && (h = q);
                return [h, h === q ? 0 : 4 - (h % 4)];
            }
            m.byteLength = function (h) {
                h = g(h);
                var q = h[1];
                return (3 * (h[0] + q)) / 4 - q;
            };
            m.toByteArray = function (h) {
                var q = g(h);
                var r = q[0];
                q = q[1];
                var u = new d((3 * (r + q)) / 4 - q),
                    A = 0,
                    w = 0 < q ? r - 4 : r,
                    C;
                for (C = 0; C < w; C += 4)
                    (r =
                        (t[h.charCodeAt(C)] << 18) |
                        (t[h.charCodeAt(C + 1)] << 12) |
                        (t[h.charCodeAt(C + 2)] << 6) |
                        t[h.charCodeAt(C + 3)]),
                        (u[A++] = (r >> 16) & 255),
                        (u[A++] = (r >> 8) & 255),
                        (u[A++] = r & 255);
                2 === q && ((r = (t[h.charCodeAt(C)] << 2) | (t[h.charCodeAt(C + 1)] >> 4)), (u[A++] = r & 255));
                1 === q &&
                    ((r = (t[h.charCodeAt(C)] << 10) | (t[h.charCodeAt(C + 1)] << 4) | (t[h.charCodeAt(C + 2)] >> 2)),
                    (u[A++] = (r >> 8) & 255),
                    (u[A++] = r & 255));
                return u;
            };
            m.fromByteArray = function (h) {
                for (var q = h.length, r = q % 3, u = [], A = 0, w = q - r; A < w; A += 16383) {
                    for (
                        var C = u, f = C.push, v, y = h, G = A + 16383 > w ? w : A + 16383, J = [], B = A;
                        B < G;
                        B += 3
                    )
                        (v = ((y[B] << 16) & 16711680) + ((y[B + 1] << 8) & 65280) + (y[B + 2] & 255)),
                            J.push(k[(v >> 18) & 63] + k[(v >> 12) & 63] + k[(v >> 6) & 63] + k[v & 63]);
                    v = J.join('');
                    f.call(C, v);
                }
                1 === r
                    ? ((h = h[q - 1]), u.push(k[h >> 2] + k[(h << 4) & 63] + '=='))
                    : 2 === r &&
                      ((h = (h[q - 2] << 8) + h[q - 1]),
                      u.push(k[h >> 10] + k[(h >> 4) & 63] + k[(h << 2) & 63] + '='));
                return u.join('');
            };
            var k = [],
                t = [],
                d = 'undefined' !== typeof Uint8Array ? Uint8Array : Array;
            for (p = 0; 64 > p; ++p)
                (k[p] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'[p]),
                    (t['ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.charCodeAt(p)] = p);
            t[45] = 62;
            t[95] = 63;
        },
        function (p, m) {
            m.read = function (l, g, k, t, d) {
                var h = 8 * d - t - 1;
                var q = (1 << h) - 1,
                    r = q >> 1,
                    u = -7;
                d = k ? d - 1 : 0;
                var A = k ? -1 : 1,
                    w = l[g + d];
                d += A;
                k = w & ((1 << -u) - 1);
                w >>= -u;
                for (u += h; 0 < u; k = 256 * k + l[g + d], d += A, u -= 8);
                h = k & ((1 << -u) - 1);
                k >>= -u;
                for (u += t; 0 < u; h = 256 * h + l[g + d], d += A, u -= 8);
                if (0 === k) k = 1 - r;
                else {
                    if (k === q) return h ? NaN : Infinity * (w ? -1 : 1);
                    h += Math.pow(2, t);
                    k -= r;
                }
                return (w ? -1 : 1) * h * Math.pow(2, k - t);
            };
            m.write = function (l, g, k, t, d, h) {
                var q,
                    r = 8 * h - d - 1,
                    u = (1 << r) - 1,
                    A = u >> 1,
                    w = 23 === d ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
                h = t ? 0 : h - 1;
                var C = t ? 1 : -1,
                    f = 0 > g || (0 === g && 0 > 1 / g) ? 1 : 0;
                g = Math.abs(g);
                isNaN(g) || Infinity === g
                    ? ((g = isNaN(g) ? 1 : 0), (t = u))
                    : ((t = Math.floor(Math.log(g) / Math.LN2)),
                      1 > g * (q = Math.pow(2, -t)) && (t--, (q *= 2)),
                      (g = 1 <= t + A ? g + w / q : g + w * Math.pow(2, 1 - A)),
                      2 <= g * q && (t++, (q /= 2)),
                      t + A >= u
                          ? ((g = 0), (t = u))
                          : 1 <= t + A
                          ? ((g = (g * q - 1) * Math.pow(2, d)), (t += A))
                          : ((g = g * Math.pow(2, A - 1) * Math.pow(2, d)), (t = 0)));
                for (; 8 <= d; l[k + h] = g & 255, h += C, g /= 256, d -= 8);
                t = (t << d) | g;
                for (r += d; 0 < r; l[k + h] = t & 255, h += C, t /= 256, r -= 8);
                l[k + h - C] |= 128 * f;
            };
        },
        function (p, m) {
            var l = {}.toString;
            p.exports =
                Array.isArray ||
                function (g) {
                    return '[object Array]' == l.call(g);
                };
        }
    ]);
}.call(this || window));
