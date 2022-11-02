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
*****************************************************************************/
    var $jscomp = $jscomp || {};
    $jscomp.scope = {};
    $jscomp.arrayIteratorImpl = function (v) {
        var x = 0;
        return function () {
            return x < v.length ? { done: !1, value: v[x++] } : { done: !0 };
        };
    };
    $jscomp.arrayIterator = function (v) {
        return { next: $jscomp.arrayIteratorImpl(v) };
    };
    $jscomp.ASSUME_ES5 = !1;
    $jscomp.ASSUME_NO_NATIVE_MAP = !1;
    $jscomp.ASSUME_NO_NATIVE_SET = !1;
    $jscomp.SIMPLE_FROUND_POLYFILL = !1;
    $jscomp.ISOLATE_POLYFILLS = !1;
    $jscomp.FORCE_POLYFILL_PROMISE = !1;
    $jscomp.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION = !1;
    $jscomp.defineProperty =
        $jscomp.ASSUME_ES5 || 'function' == typeof Object.defineProperties
            ? Object.defineProperty
            : function (v, x, u) {
                  if (v == Array.prototype || v == Object.prototype) return v;
                  v[x] = u.value;
                  return v;
              };
    $jscomp.getGlobal = function (v) {
        v = [
            'object' == typeof globalThis && globalThis,
            v,
            'object' == typeof window && window,
            'object' == typeof self && self,
            'object' == typeof global && global
        ];
        for (var x = 0; x < v.length; ++x) {
            var u = v[x];
            if (u && u.Math == Math) return u;
        }
        throw Error('Cannot find global object');
    };
    $jscomp.global = $jscomp.getGlobal(this);
    $jscomp.IS_SYMBOL_NATIVE = 'function' === typeof Symbol && 'symbol' === typeof Symbol('x');
    $jscomp.TRUST_ES6_POLYFILLS = !$jscomp.ISOLATE_POLYFILLS || $jscomp.IS_SYMBOL_NATIVE;
    $jscomp.polyfills = {};
    $jscomp.propertyToPolyfillSymbol = {};
    $jscomp.POLYFILL_PREFIX = '$jscp$';
    var $jscomp$lookupPolyfilledValue = function (v, x) {
        var u = $jscomp.propertyToPolyfillSymbol[x];
        if (null == u) return v[x];
        u = v[u];
        return void 0 !== u ? u : v[x];
    };
    $jscomp.polyfill = function (v, x, u, n) {
        x &&
            ($jscomp.ISOLATE_POLYFILLS ? $jscomp.polyfillIsolated(v, x, u, n) : $jscomp.polyfillUnisolated(v, x, u, n));
    };
    $jscomp.polyfillUnisolated = function (v, x, u, n) {
        u = $jscomp.global;
        v = v.split('.');
        for (n = 0; n < v.length - 1; n++) {
            var r = v[n];
            if (!(r in u)) return;
            u = u[r];
        }
        v = v[v.length - 1];
        n = u[v];
        x = x(n);
        x != n && null != x && $jscomp.defineProperty(u, v, { configurable: !0, writable: !0, value: x });
    };
    $jscomp.polyfillIsolated = function (v, x, u, n) {
        var r = v.split('.');
        v = 1 === r.length;
        n = r[0];
        n = !v && n in $jscomp.polyfills ? $jscomp.polyfills : $jscomp.global;
        for (var y = 0; y < r.length - 1; y++) {
            var l = r[y];
            if (!(l in n)) return;
            n = n[l];
        }
        r = r[r.length - 1];
        u = $jscomp.IS_SYMBOL_NATIVE && 'es6' === u ? n[r] : null;
        x = x(u);
        null != x &&
            (v
                ? $jscomp.defineProperty($jscomp.polyfills, r, { configurable: !0, writable: !0, value: x })
                : x !== u &&
                  (void 0 === $jscomp.propertyToPolyfillSymbol[r] &&
                      ((u = (1e9 * Math.random()) >>> 0),
                      ($jscomp.propertyToPolyfillSymbol[r] = $jscomp.IS_SYMBOL_NATIVE
                          ? $jscomp.global.Symbol(r)
                          : $jscomp.POLYFILL_PREFIX + u + '$' + r)),
                  $jscomp.defineProperty(n, $jscomp.propertyToPolyfillSymbol[r], {
                      configurable: !0,
                      writable: !0,
                      value: x
                  })));
    };
    $jscomp.initSymbol = function () {};
    $jscomp.polyfill(
        'Symbol',
        function (v) {
            if (v) return v;
            var x = function (y, l) {
                this.$jscomp$symbol$id_ = y;
                $jscomp.defineProperty(this, 'description', { configurable: !0, writable: !0, value: l });
            };
            x.prototype.toString = function () {
                return this.$jscomp$symbol$id_;
            };
            var u = 'jscomp_symbol_' + ((1e9 * Math.random()) >>> 0) + '_',
                n = 0,
                r = function (y) {
                    if (this instanceof r) throw new TypeError('Symbol is not a constructor');
                    return new x(u + (y || '') + '_' + n++, y);
                };
            return r;
        },
        'es6',
        'es3'
    );
    $jscomp.polyfill(
        'Symbol.iterator',
        function (v) {
            if (v) return v;
            v = Symbol('Symbol.iterator');
            for (
                var x =
                        'Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array'.split(
                            ' '
                        ),
                    u = 0;
                u < x.length;
                u++
            ) {
                var n = $jscomp.global[x[u]];
                'function' === typeof n &&
                    'function' != typeof n.prototype[v] &&
                    $jscomp.defineProperty(n.prototype, v, {
                        configurable: !0,
                        writable: !0,
                        value: function () {
                            return $jscomp.iteratorPrototype($jscomp.arrayIteratorImpl(this));
                        }
                    });
            }
            return v;
        },
        'es6',
        'es3'
    );
    $jscomp.iteratorPrototype = function (v) {
        v = { next: v };
        v[Symbol.iterator] = function () {
            return this;
        };
        return v;
    };
    $jscomp.checkEs6ConformanceViaProxy = function () {
        try {
            var v = {},
                x = Object.create(
                    new $jscomp.global.Proxy(v, {
                        get: function (u, n, r) {
                            return u == v && 'q' == n && r == x;
                        }
                    })
                );
            return !0 === x.q;
        } catch (u) {
            return !1;
        }
    };
    $jscomp.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS = !1;
    $jscomp.ES6_CONFORMANCE = $jscomp.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS && $jscomp.checkEs6ConformanceViaProxy();
    $jscomp.makeIterator = function (v) {
        var x = 'undefined' != typeof Symbol && Symbol.iterator && v[Symbol.iterator];
        return x ? x.call(v) : $jscomp.arrayIterator(v);
    };
    $jscomp.owns = function (v, x) {
        return Object.prototype.hasOwnProperty.call(v, x);
    };
    $jscomp.polyfill(
        'WeakMap',
        function (v) {
            function x() {
                if (!v || !Object.seal) return !1;
                try {
                    var f = Object.seal({}),
                        k = Object.seal({}),
                        p = new v([
                            [f, 2],
                            [k, 3]
                        ]);
                    if (2 != p.get(f) || 3 != p.get(k)) return !1;
                    p.delete(f);
                    p.set(k, 4);
                    return !p.has(f) && 4 == p.get(k);
                } catch (m) {
                    return !1;
                }
            }
            function u() {}
            function n(f) {
                var k = typeof f;
                return ('object' === k && null !== f) || 'function' === k;
            }
            function r(f) {
                if (!$jscomp.owns(f, l)) {
                    var k = new u();
                    $jscomp.defineProperty(f, l, { value: k });
                }
            }
            function y(f) {
                if (!$jscomp.ISOLATE_POLYFILLS) {
                    var k = Object[f];
                    k &&
                        (Object[f] = function (p) {
                            if (p instanceof u) return p;
                            Object.isExtensible(p) && r(p);
                            return k(p);
                        });
                }
            }
            if ($jscomp.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS) {
                if (v && $jscomp.ES6_CONFORMANCE) return v;
            } else if (x()) return v;
            var l = '$jscomp_hidden_' + Math.random();
            y('freeze');
            y('preventExtensions');
            y('seal');
            var d = 0,
                e = function (f) {
                    this.id_ = (d += Math.random() + 1).toString();
                    if (f) {
                        f = $jscomp.makeIterator(f);
                        for (var k; !(k = f.next()).done; ) (k = k.value), this.set(k[0], k[1]);
                    }
                };
            e.prototype.set = function (f, k) {
                if (!n(f)) throw Error('Invalid WeakMap key');
                r(f);
                if (!$jscomp.owns(f, l)) throw Error('WeakMap key fail: ' + f);
                f[l][this.id_] = k;
                return this;
            };
            e.prototype.get = function (f) {
                return n(f) && $jscomp.owns(f, l) ? f[l][this.id_] : void 0;
            };
            e.prototype.has = function (f) {
                return n(f) && $jscomp.owns(f, l) && $jscomp.owns(f[l], this.id_);
            };
            e.prototype.delete = function (f) {
                return n(f) && $jscomp.owns(f, l) && $jscomp.owns(f[l], this.id_) ? delete f[l][this.id_] : !1;
            };
            return e;
        },
        'es6',
        'es3'
    );
    $jscomp.MapEntry = function () {};
    $jscomp.polyfill(
        'Map',
        function (v) {
            function x() {
                if (
                    $jscomp.ASSUME_NO_NATIVE_MAP ||
                    !v ||
                    'function' != typeof v ||
                    !v.prototype.entries ||
                    'function' != typeof Object.seal
                )
                    return !1;
                try {
                    var e = Object.seal({ x: 4 }),
                        f = new v($jscomp.makeIterator([[e, 's']]));
                    if ('s' != f.get(e) || 1 != f.size || f.get({ x: 4 }) || f.set({ x: 4 }, 't') != f || 2 != f.size)
                        return !1;
                    var k = f.entries(),
                        p = k.next();
                    if (p.done || p.value[0] != e || 's' != p.value[1]) return !1;
                    p = k.next();
                    return p.done || 4 != p.value[0].x || 't' != p.value[1] || !k.next().done ? !1 : !0;
                } catch (m) {
                    return !1;
                }
            }
            if ($jscomp.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS) {
                if (v && $jscomp.ES6_CONFORMANCE) return v;
            } else if (x()) return v;
            var u = new WeakMap(),
                n = function (e) {
                    this.data_ = {};
                    this.head_ = l();
                    this.size = 0;
                    if (e) {
                        e = $jscomp.makeIterator(e);
                        for (var f; !(f = e.next()).done; ) (f = f.value), this.set(f[0], f[1]);
                    }
                };
            n.prototype.set = function (e, f) {
                e = 0 === e ? 0 : e;
                var k = r(this, e);
                k.list || (k.list = this.data_[k.id] = []);
                k.entry
                    ? (k.entry.value = f)
                    : ((k.entry = {
                          next: this.head_,
                          previous: this.head_.previous,
                          head: this.head_,
                          key: e,
                          value: f
                      }),
                      k.list.push(k.entry),
                      (this.head_.previous.next = k.entry),
                      (this.head_.previous = k.entry),
                      this.size++);
                return this;
            };
            n.prototype.delete = function (e) {
                e = r(this, e);
                return e.entry && e.list
                    ? (e.list.splice(e.index, 1),
                      e.list.length || delete this.data_[e.id],
                      (e.entry.previous.next = e.entry.next),
                      (e.entry.next.previous = e.entry.previous),
                      (e.entry.head = null),
                      this.size--,
                      !0)
                    : !1;
            };
            n.prototype.clear = function () {
                this.data_ = {};
                this.head_ = this.head_.previous = l();
                this.size = 0;
            };
            n.prototype.has = function (e) {
                return !!r(this, e).entry;
            };
            n.prototype.get = function (e) {
                return (e = r(this, e).entry) && e.value;
            };
            n.prototype.entries = function () {
                return y(this, function (e) {
                    return [e.key, e.value];
                });
            };
            n.prototype.keys = function () {
                return y(this, function (e) {
                    return e.key;
                });
            };
            n.prototype.values = function () {
                return y(this, function (e) {
                    return e.value;
                });
            };
            n.prototype.forEach = function (e, f) {
                for (var k = this.entries(), p; !(p = k.next()).done; ) (p = p.value), e.call(f, p[1], p[0], this);
            };
            n.prototype[Symbol.iterator] = n.prototype.entries;
            var r = function (e, f) {
                    var k = f && typeof f;
                    'object' == k || 'function' == k
                        ? u.has(f)
                            ? (k = u.get(f))
                            : ((k = '' + ++d), u.set(f, k))
                        : (k = 'p_' + f);
                    var p = e.data_[k];
                    if (p && $jscomp.owns(e.data_, k))
                        for (e = 0; e < p.length; e++) {
                            var m = p[e];
                            if ((f !== f && m.key !== m.key) || f === m.key)
                                return { id: k, list: p, index: e, entry: m };
                        }
                    return { id: k, list: p, index: -1, entry: void 0 };
                },
                y = function (e, f) {
                    var k = e.head_;
                    return $jscomp.iteratorPrototype(function () {
                        if (k) {
                            for (; k.head != e.head_; ) k = k.previous;
                            for (; k.next != k.head; ) return (k = k.next), { done: !1, value: f(k) };
                            k = null;
                        }
                        return { done: !0, value: void 0 };
                    });
                },
                l = function () {
                    var e = {};
                    return (e.previous = e.next = e.head = e);
                },
                d = 0;
            return n;
        },
        'es6',
        'es3'
    );
    $jscomp.polyfill(
        'Promise',
        function (v) {
            function x() {
                this.batch_ = null;
            }
            function u(l) {
                return l instanceof r
                    ? l
                    : new r(function (d, e) {
                          d(l);
                      });
            }
            if (
                v &&
                (!(
                    $jscomp.FORCE_POLYFILL_PROMISE ||
                    ($jscomp.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION &&
                        'undefined' === typeof $jscomp.global.PromiseRejectionEvent)
                ) ||
                    !$jscomp.global.Promise ||
                    -1 === $jscomp.global.Promise.toString().indexOf('[native code]'))
            )
                return v;
            x.prototype.asyncExecute = function (l) {
                if (null == this.batch_) {
                    this.batch_ = [];
                    var d = this;
                    this.asyncExecuteFunction(function () {
                        d.executeBatch_();
                    });
                }
                this.batch_.push(l);
            };
            var n = $jscomp.global.setTimeout;
            x.prototype.asyncExecuteFunction = function (l) {
                n(l, 0);
            };
            x.prototype.executeBatch_ = function () {
                for (; this.batch_ && this.batch_.length; ) {
                    var l = this.batch_;
                    this.batch_ = [];
                    for (var d = 0; d < l.length; ++d) {
                        var e = l[d];
                        l[d] = null;
                        try {
                            e();
                        } catch (f) {
                            this.asyncThrow_(f);
                        }
                    }
                }
                this.batch_ = null;
            };
            x.prototype.asyncThrow_ = function (l) {
                this.asyncExecuteFunction(function () {
                    throw l;
                });
            };
            var r = function (l) {
                this.state_ = 0;
                this.result_ = void 0;
                this.onSettledCallbacks_ = [];
                this.isRejectionHandled_ = !1;
                var d = this.createResolveAndReject_();
                try {
                    l(d.resolve, d.reject);
                } catch (e) {
                    d.reject(e);
                }
            };
            r.prototype.createResolveAndReject_ = function () {
                function l(f) {
                    return function (k) {
                        e || ((e = !0), f.call(d, k));
                    };
                }
                var d = this,
                    e = !1;
                return { resolve: l(this.resolveTo_), reject: l(this.reject_) };
            };
            r.prototype.resolveTo_ = function (l) {
                if (l === this) this.reject_(new TypeError('A Promise cannot resolve to itself'));
                else if (l instanceof r) this.settleSameAsPromise_(l);
                else {
                    a: switch (typeof l) {
                        case 'object':
                            var d = null != l;
                            break a;
                        case 'function':
                            d = !0;
                            break a;
                        default:
                            d = !1;
                    }
                    d ? this.resolveToNonPromiseObj_(l) : this.fulfill_(l);
                }
            };
            r.prototype.resolveToNonPromiseObj_ = function (l) {
                var d = void 0;
                try {
                    d = l.then;
                } catch (e) {
                    this.reject_(e);
                    return;
                }
                'function' == typeof d ? this.settleSameAsThenable_(d, l) : this.fulfill_(l);
            };
            r.prototype.reject_ = function (l) {
                this.settle_(2, l);
            };
            r.prototype.fulfill_ = function (l) {
                this.settle_(1, l);
            };
            r.prototype.settle_ = function (l, d) {
                if (0 != this.state_)
                    throw Error('Cannot settle(' + l + ', ' + d + '): Promise already settled in state' + this.state_);
                this.state_ = l;
                this.result_ = d;
                2 === this.state_ && this.scheduleUnhandledRejectionCheck_();
                this.executeOnSettledCallbacks_();
            };
            r.prototype.scheduleUnhandledRejectionCheck_ = function () {
                var l = this;
                n(function () {
                    if (l.notifyUnhandledRejection_()) {
                        var d = $jscomp.global.console;
                        'undefined' !== typeof d && d.error(l.result_);
                    }
                }, 1);
            };
            r.prototype.notifyUnhandledRejection_ = function () {
                if (this.isRejectionHandled_) return !1;
                var l = $jscomp.global.CustomEvent,
                    d = $jscomp.global.Event,
                    e = $jscomp.global.dispatchEvent;
                if ('undefined' === typeof e) return !0;
                'function' === typeof l
                    ? (l = new l('unhandledrejection', { cancelable: !0 }))
                    : 'function' === typeof d
                    ? (l = new d('unhandledrejection', { cancelable: !0 }))
                    : ((l = $jscomp.global.document.createEvent('CustomEvent')),
                      l.initCustomEvent('unhandledrejection', !1, !0, l));
                l.promise = this;
                l.reason = this.result_;
                return e(l);
            };
            r.prototype.executeOnSettledCallbacks_ = function () {
                if (null != this.onSettledCallbacks_) {
                    for (var l = 0; l < this.onSettledCallbacks_.length; ++l)
                        y.asyncExecute(this.onSettledCallbacks_[l]);
                    this.onSettledCallbacks_ = null;
                }
            };
            var y = new x();
            r.prototype.settleSameAsPromise_ = function (l) {
                var d = this.createResolveAndReject_();
                l.callWhenSettled_(d.resolve, d.reject);
            };
            r.prototype.settleSameAsThenable_ = function (l, d) {
                var e = this.createResolveAndReject_();
                try {
                    l.call(d, e.resolve, e.reject);
                } catch (f) {
                    e.reject(f);
                }
            };
            r.prototype.then = function (l, d) {
                function e(m, A) {
                    return 'function' == typeof m
                        ? function (q) {
                              try {
                                  f(m(q));
                              } catch (t) {
                                  k(t);
                              }
                          }
                        : A;
                }
                var f,
                    k,
                    p = new r(function (m, A) {
                        f = m;
                        k = A;
                    });
                this.callWhenSettled_(e(l, f), e(d, k));
                return p;
            };
            r.prototype.catch = function (l) {
                return this.then(void 0, l);
            };
            r.prototype.callWhenSettled_ = function (l, d) {
                function e() {
                    switch (f.state_) {
                        case 1:
                            l(f.result_);
                            break;
                        case 2:
                            d(f.result_);
                            break;
                        default:
                            throw Error('Unexpected state: ' + f.state_);
                    }
                }
                var f = this;
                null == this.onSettledCallbacks_ ? y.asyncExecute(e) : this.onSettledCallbacks_.push(e);
                this.isRejectionHandled_ = !0;
            };
            r.resolve = u;
            r.reject = function (l) {
                return new r(function (d, e) {
                    e(l);
                });
            };
            r.race = function (l) {
                return new r(function (d, e) {
                    for (var f = $jscomp.makeIterator(l), k = f.next(); !k.done; k = f.next())
                        u(k.value).callWhenSettled_(d, e);
                });
            };
            r.all = function (l) {
                var d = $jscomp.makeIterator(l),
                    e = d.next();
                return e.done
                    ? u([])
                    : new r(function (f, k) {
                          function p(q) {
                              return function (t) {
                                  m[q] = t;
                                  A--;
                                  0 == A && f(m);
                              };
                          }
                          var m = [],
                              A = 0;
                          do m.push(void 0), A++, u(e.value).callWhenSettled_(p(m.length - 1), k), (e = d.next());
                          while (!e.done);
                      });
            };
            return r;
        },
        'es6',
        'es3'
    );
    $jscomp.checkStringArgs = function (v, x, u) {
        if (null == v)
            throw new TypeError("The 'this' value for String.prototype." + u + ' must not be null or undefined');
        if (x instanceof RegExp)
            throw new TypeError('First argument to String.prototype.' + u + ' must not be a regular expression');
        return v + '';
    };
    $jscomp.polyfill(
        'String.prototype.endsWith',
        function (v) {
            return v
                ? v
                : function (x, u) {
                      var n = $jscomp.checkStringArgs(this, x, 'endsWith');
                      x += '';
                      void 0 === u && (u = n.length);
                      u = Math.max(0, Math.min(u | 0, n.length));
                      for (var r = x.length; 0 < r && 0 < u; ) if (n[--u] != x[--r]) return !1;
                      return 0 >= r;
                  };
        },
        'es6',
        'es3'
    );
    $jscomp.findInternal = function (v, x, u) {
        v instanceof String && (v = String(v));
        for (var n = v.length, r = 0; r < n; r++) {
            var y = v[r];
            if (x.call(u, y, r, v)) return { i: r, v: y };
        }
        return { i: -1, v: void 0 };
    };
    $jscomp.polyfill(
        'Array.prototype.find',
        function (v) {
            return v
                ? v
                : function (x, u) {
                      return $jscomp.findInternal(this, x, u).v;
                  };
        },
        'es6',
        'es3'
    );
    $jscomp.underscoreProtoCanBeSet = function () {
        var v = { a: !0 },
            x = {};
        try {
            return (x.__proto__ = v), x.a;
        } catch (u) {}
        return !1;
    };
    $jscomp.setPrototypeOf =
        $jscomp.TRUST_ES6_POLYFILLS && 'function' == typeof Object.setPrototypeOf
            ? Object.setPrototypeOf
            : $jscomp.underscoreProtoCanBeSet()
            ? function (v, x) {
                  v.__proto__ = x;
                  if (v.__proto__ !== x) throw new TypeError(v + ' is not extensible');
                  return v;
              }
            : null;
    $jscomp.assign =
        $jscomp.TRUST_ES6_POLYFILLS && 'function' == typeof Object.assign
            ? Object.assign
            : function (v, x) {
                  for (var u = 1; u < arguments.length; u++) {
                      var n = arguments[u];
                      if (n) for (var r in n) $jscomp.owns(n, r) && (v[r] = n[r]);
                  }
                  return v;
              };
    $jscomp.polyfill(
        'Set',
        function (v) {
            function x() {
                if (
                    $jscomp.ASSUME_NO_NATIVE_SET ||
                    !v ||
                    'function' != typeof v ||
                    !v.prototype.entries ||
                    'function' != typeof Object.seal
                )
                    return !1;
                try {
                    var n = Object.seal({ x: 4 }),
                        r = new v($jscomp.makeIterator([n]));
                    if (!r.has(n) || 1 != r.size || r.add(n) != r || 1 != r.size || r.add({ x: 4 }) != r || 2 != r.size)
                        return !1;
                    var y = r.entries(),
                        l = y.next();
                    if (l.done || l.value[0] != n || l.value[1] != n) return !1;
                    l = y.next();
                    return l.done || l.value[0] == n || 4 != l.value[0].x || l.value[1] != l.value[0]
                        ? !1
                        : y.next().done;
                } catch (d) {
                    return !1;
                }
            }
            if ($jscomp.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS) {
                if (v && $jscomp.ES6_CONFORMANCE) return v;
            } else if (x()) return v;
            var u = function (n) {
                this.map_ = new Map();
                if (n) {
                    n = $jscomp.makeIterator(n);
                    for (var r; !(r = n.next()).done; ) this.add(r.value);
                }
                this.size = this.map_.size;
            };
            u.prototype.add = function (n) {
                n = 0 === n ? 0 : n;
                this.map_.set(n, n);
                this.size = this.map_.size;
                return this;
            };
            u.prototype.delete = function (n) {
                n = this.map_.delete(n);
                this.size = this.map_.size;
                return n;
            };
            u.prototype.clear = function () {
                this.map_.clear();
                this.size = 0;
            };
            u.prototype.has = function (n) {
                return this.map_.has(n);
            };
            u.prototype.entries = function () {
                return this.map_.entries();
            };
            u.prototype.values = function () {
                return this.map_.values();
            };
            u.prototype.keys = u.prototype.values;
            u.prototype[Symbol.iterator] = u.prototype.values;
            u.prototype.forEach = function (n, r) {
                var y = this;
                this.map_.forEach(function (l) {
                    return n.call(r, l, l, y);
                });
            };
            return u;
        },
        'es6',
        'es3'
    );
    $jscomp.iteratorFromArray = function (v, x) {
        v instanceof String && (v += '');
        var u = 0,
            n = !1,
            r = {
                next: function () {
                    if (!n && u < v.length) {
                        var y = u++;
                        return { value: x(y, v[y]), done: !1 };
                    }
                    n = !0;
                    return { done: !0, value: void 0 };
                }
            };
        r[Symbol.iterator] = function () {
            return r;
        };
        return r;
    };
    $jscomp.polyfill(
        'Array.prototype.keys',
        function (v) {
            return v
                ? v
                : function () {
                      return $jscomp.iteratorFromArray(this, function (x) {
                          return x;
                      });
                  };
        },
        'es6',
        'es3'
    );
    (function (v) {
        function x(n) {
            if (u[n]) return u[n].exports;
            var r = (u[n] = { i: n, l: !1, exports: {} });
            v[n].call(r.exports, r, r.exports, x);
            r.l = !0;
            return r.exports;
        }
        var u = {};
        x.m = v;
        x.c = u;
        x.d = function (n, r, y) {
            x.o(n, r) || Object.defineProperty(n, r, { enumerable: !0, get: y });
        };
        x.r = function (n) {
            'undefined' !== typeof Symbol &&
                Symbol.toStringTag &&
                Object.defineProperty(n, Symbol.toStringTag, { value: 'Module' });
            Object.defineProperty(n, '__esModule', { value: !0 });
        };
        x.t = function (n, r) {
            r & 1 && (n = x(n));
            if (r & 8 || (r & 4 && 'object' === typeof n && n && n.__esModule)) return n;
            var y = Object.create(null);
            x.r(y);
            Object.defineProperty(y, 'default', { enumerable: !0, value: n });
            if (r & 2 && 'string' != typeof n)
                for (var l in n)
                    x.d(
                        y,
                        l,
                        function (d) {
                            return n[d];
                        }.bind(null, l)
                    );
            return y;
        };
        x.n = function (n) {
            var r =
                n && n.__esModule
                    ? function () {
                          return n['default'];
                      }
                    : function () {
                          return n;
                      };
            x.d(r, 'a', r);
            return r;
        };
        x.o = function (n, r) {
            return Object.prototype.hasOwnProperty.call(n, r);
        };
        x.p = '/core/pdf/';
        return x((x.s = 19));
    })([
        function (v, x, u) {
            u.d(x, 'd', function () {
                return l;
            });
            u.d(x, 'e', function () {
                return r;
            });
            u.d(x, 'c', function () {
                return d;
            });
            u.d(x, 'a', function () {
                return e;
            });
            u.d(x, 'b', function () {
                return y;
            });
            var n = u(2),
                r = function (f, k) {
                    Object(n.a)('disableLogs') || (k ? console.warn(f + ': ' + k) : console.warn(f));
                },
                y = function (f, k, p, m) {
                    void 0 === m && (m = !1);
                    var A = p.pop();
                    p = p.length ? p.join(', ') + ' and ' + A : A;
                    m
                        ? r("'" + k + "' will be deprecated in version " + f + '. Please use ' + p + ' instead.')
                        : r("'" + k + "' is deprecated since version " + f + '. Please use ' + p + ' instead.');
                },
                l = function (f, k) {
                    Object(n.a)('disableLogs') || (k ? console.log(f + ': ' + k) : console.log(f));
                },
                d = function (f) {
                    if (!Object(n.a)('disableLogs')) throw (console.error(f), Error(f));
                },
                e = function (f, k) {};
        },
        function (v, x, u) {
            u.d(x, 'c', function () {
                return e;
            });
            u.d(x, 'a', function () {
                return f;
            });
            u.d(x, 'b', function () {
                return k;
            });
            u.d(x, 'd', function () {
                return p;
            });
            var n = u(14),
                r = console.log,
                y = console.warn,
                l = console.error,
                d = function (m) {
                    void 0 === m && (m = !0);
                    m
                        ? ((console.log = function () {}),
                          (console.warn = function () {}),
                          (console.error = function () {}))
                        : ((console.log = r), (console.warn = y), (console.error = l));
                },
                e = function () {
                    var m = Object(n.a)(location.search);
                    d('1' === m.disableLogs);
                },
                f = function (m) {
                    m.on('disableLogs', function (A) {
                        d(A.disabled);
                    });
                },
                k = function (m, A) {
                    return function () {};
                },
                p = function (m, A) {
                    A ? console.warn(m + ': ' + A) : console.warn(m);
                };
        },
        function (v, x, u) {
            u.d(x, 'a', function () {
                return y;
            });
            u.d(x, 'b', function () {
                return l;
            });
            var n = {},
                r = {
                    flattenedResources: !1,
                    CANVAS_CACHE_SIZE: void 0,
                    maxPagesBefore: void 0,
                    maxPagesAhead: void 0,
                    disableLogs: !1,
                    wvsQueryParameters: {},
                    _trnDebugMode: !1,
                    _logFiltersEnabled: null
                },
                y = function (d) {
                    return r[d];
                },
                l = function (d, e) {
                    var f;
                    r[d] = e;
                    null === (f = n[d]) || void 0 === f
                        ? void 0
                        : f.forEach(function (k) {
                              k(e);
                          });
                };
        },
        function (v, x, u) {
            u.d(x, 'a', function () {
                return B;
            });
            u.d(x, 'b', function () {
                return b;
            });
            u.d(x, 'c', function () {
                return a;
            });
            var n = u(11),
                r = u(0),
                y = u(8),
                l = u(4),
                d = 'undefined' === typeof window ? self : window,
                e = d.importScripts,
                f = !1,
                k = function (c, h) {
                    f || (e(d.basePath + 'decode.min.js'), (f = !0));
                    c = self.BrotliDecode(Object(l.b)(c));
                    return h ? c : Object(l.a)(c);
                },
                p = function (c, h) {
                    return Object(n.a)(void 0, void 0, Promise, function () {
                        var g;
                        return Object(n.b)(this, function (w) {
                            switch (w.label) {
                                case 0:
                                    return f
                                        ? [3, 2]
                                        : [
                                              4,
                                              Object(y.a)(
                                                  self.Core.getWorkerPath() + 'external/decode.min.js',
                                                  'Failed to download decode.min.js',
                                                  window
                                              )
                                          ];
                                case 1:
                                    w.sent(), (f = !0), (w.label = 2);
                                case 2:
                                    return (g = self.BrotliDecode(Object(l.b)(c))), [2, h ? g : Object(l.a)(g)];
                            }
                        });
                    });
                };
            (function () {
                function c() {
                    this.remainingDataArrays = [];
                }
                c.prototype.processRaw = function (h) {
                    return h;
                };
                c.prototype.processBrotli = function (h) {
                    this.remainingDataArrays.push(h);
                    return null;
                };
                c.prototype.GetNextChunk = function (h) {
                    this.decodeFunction ||
                        (this.decodeFunction =
                            0 === h[0] && 97 === h[1] && 115 === h[2] && 109 === h[3]
                                ? this.processRaw
                                : this.processBrotli);
                    return this.decodeFunction(h);
                };
                c.prototype.End = function () {
                    if (this.remainingDataArrays.length) {
                        for (var h = this.arrays, g = 0, w = 0; w < h.length; ++w) g += h[w].length;
                        g = new Uint8Array(g);
                        var G = 0;
                        for (w = 0; w < h.length; ++w) {
                            var z = h[w];
                            g.set(z, G);
                            G += z.length;
                        }
                        return k(g, !0);
                    }
                    return null;
                };
                return c;
            })();
            var m = !1,
                A = function (c) {
                    m || (e(d.basePath + 'pako_inflate.min.js'), (m = !0));
                    var h = 10;
                    if ('string' === typeof c) {
                        if (c.charCodeAt(3) & 8) {
                            for (; 0 !== c.charCodeAt(h); ++h);
                            ++h;
                        }
                    } else if (c[3] & 8) {
                        for (; 0 !== c[h]; ++h);
                        ++h;
                    }
                    c = Object(l.b)(c);
                    c = c.subarray(h, c.length - 8);
                    return d.pako.inflate(c, { windowBits: -15 });
                },
                q = function (c, h) {
                    return h ? c : Object(l.a)(c);
                },
                t = function (c) {
                    var h = !c.shouldOutputArray,
                        g = new XMLHttpRequest();
                    g.open('GET', c.url, c.isAsync);
                    var w = h && g.overrideMimeType;
                    g.responseType = w ? 'text' : 'arraybuffer';
                    w && g.overrideMimeType('text/plain; charset=x-user-defined');
                    g.send();
                    var G = function () {
                        var H = Date.now();
                        var J = w ? g.responseText : new Uint8Array(g.response);
                        Object(r.a)('worker', 'Result length is ' + J.length);
                        J.length < c.compressedMaximum
                            ? ((J = c.decompressFunction(J, c.shouldOutputArray)),
                              Object(r.e)(
                                  'There may be some degradation of performance. Your server has not been configured to serve .gz. and .br. files with the expected Content-Encoding. See http://www.pdftron.com/kb_content_encoding for instructions on how to resolve this.'
                              ),
                              e && Object(r.a)('worker', 'Decompressed length is ' + J.length))
                            : h && (J = Object(l.a)(J));
                        e && Object(r.a)('worker', c.url + ' Decompression took ' + (Date.now() - H));
                        return J;
                    };
                    if (c.isAsync)
                        var z = new Promise(function (H, J) {
                            g.onload = function () {
                                200 === this.status || 0 === this.status ? H(G()) : J('Download Failed ' + c.url);
                            };
                            g.onerror = function () {
                                J('Network error occurred ' + c.url);
                            };
                        });
                    else {
                        if (200 === g.status || 0 === g.status) return G();
                        throw Error('Failed to load ' + c.url);
                    }
                    return z;
                },
                B = function (c) {
                    var h = c.lastIndexOf('/');
                    -1 === h && (h = 0);
                    var g = c.slice(h).replace('.', '.br.');
                    e ||
                        (g.endsWith('.js.mem')
                            ? (g = g.replace('.js.mem', '.mem'))
                            : g.endsWith('.js') && (g = g.concat('.mem')));
                    return c.slice(0, h) + g;
                },
                D = function (c, h) {
                    var g = c.lastIndexOf('/');
                    -1 === g && (g = 0);
                    var w = c.slice(g).replace('.', '.gz.');
                    h.url = c.slice(0, g) + w;
                    h.decompressFunction = A;
                    return t(h);
                },
                I = function (c, h) {
                    h.url = B(c);
                    h.decompressFunction = e ? k : p;
                    return t(h);
                },
                C = function (c, h) {
                    c.endsWith('.js.mem')
                        ? (c = c.slice(0, -4))
                        : c.endsWith('.mem') && (c = c.slice(0, -4) + '.js.mem');
                    h.url = c;
                    h.decompressFunction = q;
                    return t(h);
                },
                E = function (c, h, g, w) {
                    return c.catch(function (G) {
                        Object(r.e)(G);
                        return w(h, g);
                    });
                },
                F = function (c, h, g) {
                    var w;
                    if (g.isAsync) {
                        var G = h[0](c, g);
                        for (w = 1; w < h.length; ++w) G = E(G, c, g, h[w]);
                        return G;
                    }
                    for (w = 0; w < h.length; ++w)
                        try {
                            return h[w](c, g);
                        } catch (z) {
                            Object(r.e)(z.message);
                        }
                    throw Error('');
                },
                a = function (c, h, g, w) {
                    return F(c, [D, I, C], { compressedMaximum: h, isAsync: g, shouldOutputArray: w });
                },
                b = function (c, h, g, w) {
                    return F(c, [I, D, C], { compressedMaximum: h, isAsync: g, shouldOutputArray: w });
                };
        },
        function (v, x, u) {
            u.d(x, 'b', function () {
                return n;
            });
            u.d(x, 'a', function () {
                return r;
            });
            var n = function (y) {
                    if ('string' === typeof y) {
                        for (var l = new Uint8Array(y.length), d = y.length, e = 0; e < d; e++) l[e] = y.charCodeAt(e);
                        return l;
                    }
                    return y;
                },
                r = function (y) {
                    if ('string' !== typeof y) {
                        for (var l = '', d = 0, e = y.length, f; d < e; )
                            (f = y.subarray(d, d + 1024)), (d += 1024), (l += String.fromCharCode.apply(null, f));
                        return l;
                    }
                    return y;
                };
        },
        function (v, x, u) {
            u.d(x, 'a', function () {
                return A;
            });
            u(0);
            var n = 'undefined' === typeof window ? self : window;
            v = (function () {
                var q = navigator.userAgent.toLowerCase();
                return (q = /(msie) ([\w.]+)/.exec(q) || /(trident)(?:.*? rv:([\w.]+)|)/.exec(q))
                    ? parseInt(q[2], 10)
                    : q;
            })();
            var r = (function () {
                var q = n.navigator.userAgent.match(/OPR/),
                    t = n.navigator.userAgent.match(/Maxthon/),
                    B = n.navigator.userAgent.match(/Edge/);
                return n.navigator.userAgent.match(/Chrome\/(.*?) /) && !q && !t && !B;
            })();
            (function () {
                if (!r) return null;
                var q = n.navigator.userAgent.match(/Chrome\/([0-9]+)\./);
                return q ? parseInt(q[1], 10) : q;
            })();
            var y =
                !!navigator.userAgent.match(/Edge/i) ||
                (navigator.userAgent.match(/Edg\/(.*?)/) && n.navigator.userAgent.match(/Chrome\/(.*?) /));
            (function () {
                if (!y) return null;
                var q = n.navigator.userAgent.match(/Edg\/([0-9]+)\./);
                return q ? parseInt(q[1], 10) : q;
            })();
            x =
                /iPad|iPhone|iPod/.test(n.navigator.platform) ||
                ('MacIntel' === navigator.platform && 1 < navigator.maxTouchPoints) ||
                /iPad|iPhone|iPod/.test(n.navigator.userAgent);
            var l = (function () {
                    var q = n.navigator.userAgent.match(/.*\/([0-9\.]+)\s(Safari|Mobile).*/i);
                    return q ? parseFloat(q[1]) : q;
                })(),
                d =
                    /^((?!chrome|android).)*safari/i.test(n.navigator.userAgent) ||
                    (/^((?!chrome|android).)*$/.test(n.navigator.userAgent) && x),
                e = n.navigator.userAgent.match(/Firefox/);
            (function () {
                if (!e) return null;
                var q = n.navigator.userAgent.match(/Firefox\/([0-9]+)\./);
                return q ? parseInt(q[1], 10) : q;
            })();
            v || /Android|webOS|Touch|IEMobile|Silk/i.test(navigator.userAgent);
            navigator.userAgent.match(/(iPad|iPhone|iPod)/i);
            n.navigator.userAgent.indexOf('Android');
            var f = /Mac OS X 10_13_6.*\(KHTML, like Gecko\)$/.test(n.navigator.userAgent),
                k = n.navigator.userAgent.match(/(iPad|iPhone).+\sOS\s((\d+)(_\d)*)/i)
                    ? 14 <= parseInt(n.navigator.userAgent.match(/(iPad|iPhone).+\sOS\s((\d+)(_\d)*)/i)[3], 10)
                    : !1,
                p = !(!self.WebAssembly || !self.WebAssembly.validate),
                m = -1 < n.navigator.userAgent.indexOf('Edge/16') || -1 < n.navigator.userAgent.indexOf('MSAppHost'),
                A = function () {
                    return p && !m && !(!k && ((d && 14 > l) || f));
                };
        },
        function (v, x, u) {
            function n(d) {
                '@babel/helpers - typeof';
                return (
                    (n =
                        'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
                            ? function (e) {
                                  return typeof e;
                              }
                            : function (e) {
                                  return e &&
                                      'function' == typeof Symbol &&
                                      e.constructor === Symbol &&
                                      e !== Symbol.prototype
                                      ? 'symbol'
                                      : typeof e;
                              }),
                    n(d)
                );
            }
            var r, y, l;
            !(function (d) {
                'object' === n(x) && 'undefined' !== typeof v
                    ? (v.exports = d())
                    : !((y = []),
                      (r = d),
                      (l = 'function' === typeof r ? r.apply(x, y) : r),
                      void 0 !== l && (v.exports = l));
            })(function () {
                return (function p(e, f, k) {
                    function m(t, B) {
                        if (!f[t]) {
                            if (!e[t]) {
                                if (A) return A(t, !0);
                                B = Error("Cannot find module '".concat(t, "'"));
                                throw ((B.code = 'MODULE_NOT_FOUND'), B);
                            }
                            B = f[t] = { exports: {} };
                            e[t][0].call(
                                B.exports,
                                function (D) {
                                    return m(e[t][1][D] || D);
                                },
                                B,
                                B.exports,
                                p,
                                e,
                                f,
                                k
                            );
                        }
                        return f[t].exports;
                    }
                    for (var A = !1, q = 0; q < k.length; q++) m(k[q]);
                    return m;
                })(
                    {
                        1: [
                            function (e, f, k) {
                                var p = {}.hasOwnProperty,
                                    m = function (A, q) {
                                        function t() {
                                            this.constructor = A;
                                        }
                                        for (var B in q) p.call(q, B) && (A[B] = q[B]);
                                        t.prototype = q.prototype;
                                        A.prototype = new t();
                                        A.__super__ = q.prototype;
                                        return A;
                                    };
                                k = e('./PriorityQueue/AbstractPriorityQueue');
                                e = e('./PriorityQueue/ArrayStrategy');
                                k = (function (A) {
                                    function q(t) {
                                        t || (t = {});
                                        t.strategy || (t.strategy = BinaryHeapStrategy);
                                        t.comparator ||
                                            (t.comparator = function (B, D) {
                                                return (B || 0) - (D || 0);
                                            });
                                        q.__super__.constructor.call(this, t);
                                    }
                                    m(q, A);
                                    return q;
                                })(k);
                                k.ArrayStrategy = e;
                                f.exports = k;
                            },
                            { './PriorityQueue/AbstractPriorityQueue': 2, './PriorityQueue/ArrayStrategy': 3 }
                        ],
                        2: [
                            function (e, f, k) {
                                f.exports = (function () {
                                    function p(m) {
                                        if (null == (null != m ? m.strategy : void 0))
                                            throw 'Must pass options.strategy, a strategy';
                                        if (null == (null != m ? m.comparator : void 0))
                                            throw 'Must pass options.comparator, a comparator';
                                        this.priv = new m.strategy(m);
                                        this.length = 0;
                                    }
                                    p.prototype.queue = function (m) {
                                        this.length++;
                                        this.priv.queue(m);
                                    };
                                    p.prototype.dequeue = function (m) {
                                        if (!this.length) throw 'Empty queue';
                                        this.length--;
                                        return this.priv.dequeue();
                                    };
                                    p.prototype.peek = function (m) {
                                        if (!this.length) throw 'Empty queue';
                                        return this.priv.peek();
                                    };
                                    p.prototype.remove = function (m) {
                                        this.priv.remove(m) && --this.length;
                                    };
                                    p.prototype.find = function (m) {
                                        return 0 <= this.priv.find(m);
                                    };
                                    p.prototype.removeAllMatching = function (m, A) {
                                        m = this.priv.removeAllMatching(m, A);
                                        this.length -= m;
                                    };
                                    return p;
                                })();
                            },
                            {}
                        ],
                        3: [
                            function (e, f, k) {
                                var p = function (m, A, q) {
                                    var t;
                                    var B = 0;
                                    for (t = m.length; B < t; ) {
                                        var D = (B + t) >>> 1;
                                        0 <= q(m[D], A) ? (B = D + 1) : (t = D);
                                    }
                                    return B;
                                };
                                f.exports = (function () {
                                    function m(A) {
                                        var q;
                                        this.options = A;
                                        this.comparator = this.options.comparator;
                                        this.data =
                                            (null != (q = this.options.initialValues) ? q.slice(0) : void 0) || [];
                                        this.data.sort(this.comparator).reverse();
                                    }
                                    m.prototype.queue = function (A) {
                                        var q = p(this.data, A, this.comparator);
                                        this.data.splice(q, 0, A);
                                    };
                                    m.prototype.dequeue = function () {
                                        return this.data.pop();
                                    };
                                    m.prototype.peek = function () {
                                        return this.data[this.data.length - 1];
                                    };
                                    m.prototype.find = function (A) {
                                        var q = p(this.data, A, this.comparator) - 1;
                                        return 0 <= q && !this.comparator(this.data[q], A) ? q : -1;
                                    };
                                    m.prototype.remove = function (A) {
                                        A = this.find(A);
                                        return 0 <= A ? (this.data.splice(A, 1), !0) : !1;
                                    };
                                    m.prototype.removeAllMatching = function (A, q) {
                                        for (var t = 0, B = this.data.length - 1; 0 <= B; --B)
                                            if (A(this.data[B])) {
                                                var D = this.data.splice(B, 1)[0];
                                                q && q(D);
                                                ++t;
                                            }
                                        return t;
                                    };
                                    return m;
                                })();
                            },
                            {}
                        ]
                    },
                    {},
                    [1]
                )(1);
            });
        },
        function (v, x, u) {
            (function (n) {
                function r(d, e) {
                    this._id = d;
                    this._clearFn = e;
                }
                var y = ('undefined' !== typeof n && n) || ('undefined' !== typeof self && self) || window,
                    l = Function.prototype.apply;
                x.setTimeout = function () {
                    return new r(l.call(setTimeout, y, arguments), clearTimeout);
                };
                x.setInterval = function () {
                    return new r(l.call(setInterval, y, arguments), clearInterval);
                };
                x.clearTimeout = x.clearInterval = function (d) {
                    d && d.close();
                };
                r.prototype.unref = r.prototype.ref = function () {};
                r.prototype.close = function () {
                    this._clearFn.call(y, this._id);
                };
                x.enroll = function (d, e) {
                    clearTimeout(d._idleTimeoutId);
                    d._idleTimeout = e;
                };
                x.unenroll = function (d) {
                    clearTimeout(d._idleTimeoutId);
                    d._idleTimeout = -1;
                };
                x._unrefActive = x.active = function (d) {
                    clearTimeout(d._idleTimeoutId);
                    var e = d._idleTimeout;
                    0 <= e &&
                        (d._idleTimeoutId = setTimeout(function () {
                            d._onTimeout && d._onTimeout();
                        }, e));
                };
                u(23);
                x.setImmediate =
                    ('undefined' !== typeof self && self.setImmediate) ||
                    ('undefined' !== typeof n && n.setImmediate) ||
                    (this && this.setImmediate);
                x.clearImmediate =
                    ('undefined' !== typeof self && self.clearImmediate) ||
                    ('undefined' !== typeof n && n.clearImmediate) ||
                    (this && this.clearImmediate);
            }.call(this, u(10)));
        },
        function (v, x, u) {
            function n(y, l, d) {
                return new Promise(function (e) {
                    if (!y) return e();
                    var f = d.document.createElement('script');
                    f.type = 'text/javascript';
                    f.onload = function () {
                        e();
                    };
                    f.onerror = function () {
                        l && Object(r.e)(l);
                        e();
                    };
                    f.src = y;
                    d.document.getElementsByTagName('head')[0].appendChild(f);
                });
            }
            u.d(x, 'a', function () {
                return n;
            });
            var r = u(0);
        },
        function (v, x, u) {
            function n(d, e, f) {
                function k(A) {
                    m = m || Date.now();
                    return A
                        ? (Object(r.a)('load', 'Try instantiateStreaming'),
                          fetch(Object(y.a)(d))
                              .then(function (q) {
                                  return WebAssembly.instantiateStreaming(q, e);
                              })
                              .catch(function (q) {
                                  Object(r.a)('load', 'instantiateStreaming Failed ' + d + ' message ' + q.message);
                                  return k(!1);
                              }))
                        : Object(y.b)(d, f, !0, !0).then(function (q) {
                              p = Date.now();
                              Object(r.a)('load', 'Request took ' + (p - m) + ' ms');
                              return WebAssembly.instantiate(q, e);
                          });
                }
                var p, m;
                return k(!!WebAssembly.instantiateStreaming).then(function (A) {
                    Object(r.a)('load', 'WASM compilation took ' + (Date.now() - (p || m)) + ' ms');
                    return A;
                });
            }
            u.d(x, 'a', function () {
                return n;
            });
            var r = u(0),
                y = u(3),
                l = u(8);
            u.d(x, 'b', function () {
                return l.a;
            });
        },
        function (v, x) {
            x = (function () {
                return this;
            })();
            try {
                x = x || new Function('return this')();
            } catch (u) {
                'object' === typeof window && (x = window);
            }
            v.exports = x;
        },
        function (v, x, u) {
            function n(y, l, d, e) {
                function f(k) {
                    return k instanceof d
                        ? k
                        : new d(function (p) {
                              p(k);
                          });
                }
                return new (d || (d = Promise))(function (k, p) {
                    function m(t) {
                        try {
                            q(e.next(t));
                        } catch (B) {
                            p(B);
                        }
                    }
                    function A(t) {
                        try {
                            q(e['throw'](t));
                        } catch (B) {
                            p(B);
                        }
                    }
                    function q(t) {
                        t.done ? k(t.value) : f(t.value).then(m, A);
                    }
                    q((e = e.apply(y, l || [])).next());
                });
            }
            function r(y, l) {
                function d(q) {
                    return function (t) {
                        return e([q, t]);
                    };
                }
                function e(q) {
                    if (k) throw new TypeError('Generator is already executing.');
                    for (; f; )
                        try {
                            if (
                                ((k = 1),
                                p &&
                                    (m =
                                        q[0] & 2
                                            ? p['return']
                                            : q[0]
                                            ? p['throw'] || ((m = p['return']) && m.call(p), 0)
                                            : p.next) &&
                                    !(m = m.call(p, q[1])).done)
                            )
                                return m;
                            if (((p = 0), m)) q = [q[0] & 2, m.value];
                            switch (q[0]) {
                                case 0:
                                case 1:
                                    m = q;
                                    break;
                                case 4:
                                    return f.label++, { value: q[1], done: !1 };
                                case 5:
                                    f.label++;
                                    p = q[1];
                                    q = [0];
                                    continue;
                                case 7:
                                    q = f.ops.pop();
                                    f.trys.pop();
                                    continue;
                                default:
                                    if (
                                        !((m = f.trys), (m = 0 < m.length && m[m.length - 1])) &&
                                        (6 === q[0] || 2 === q[0])
                                    ) {
                                        f = 0;
                                        continue;
                                    }
                                    if (3 === q[0] && (!m || (q[1] > m[0] && q[1] < m[3]))) f.label = q[1];
                                    else if (6 === q[0] && f.label < m[1]) (f.label = m[1]), (m = q);
                                    else if (m && f.label < m[2]) (f.label = m[2]), f.ops.push(q);
                                    else {
                                        m[2] && f.ops.pop();
                                        f.trys.pop();
                                        continue;
                                    }
                            }
                            q = l.call(y, f);
                        } catch (t) {
                            (q = [6, t]), (p = 0);
                        } finally {
                            k = m = 0;
                        }
                    if (q[0] & 5) throw q[1];
                    return { value: q[0] ? q[1] : void 0, done: !0 };
                }
                var f = {
                        label: 0,
                        sent: function () {
                            if (m[0] & 1) throw m[1];
                            return m[1];
                        },
                        trys: [],
                        ops: []
                    },
                    k,
                    p,
                    m,
                    A;
                return (
                    (A = { next: d(0), throw: d(1), return: d(2) }),
                    'function' === typeof Symbol &&
                        (A[Symbol.iterator] = function () {
                            return this;
                        }),
                    A
                );
            }
            u.d(x, 'a', function () {
                return n;
            });
            u.d(x, 'b', function () {
                return r;
            });
        },
        function (v, x) {
            function u() {
                throw Error('setTimeout has not been defined');
            }
            function n() {
                throw Error('clearTimeout has not been defined');
            }
            function r(B) {
                if (k === setTimeout) return setTimeout(B, 0);
                if ((k === u || !k) && setTimeout) return (k = setTimeout), setTimeout(B, 0);
                try {
                    return k(B, 0);
                } catch (D) {
                    try {
                        return k.call(null, B, 0);
                    } catch (I) {
                        return k.call(this, B, 0);
                    }
                }
            }
            function y(B) {
                if (p === clearTimeout) return clearTimeout(B);
                if ((p === n || !p) && clearTimeout) return (p = clearTimeout), clearTimeout(B);
                try {
                    return p(B);
                } catch (D) {
                    try {
                        return p.call(null, B);
                    } catch (I) {
                        return p.call(this, B);
                    }
                }
            }
            function l() {
                A && q && ((A = !1), q.length ? (m = q.concat(m)) : (t = -1), m.length && d());
            }
            function d() {
                if (!A) {
                    var B = r(l);
                    A = !0;
                    for (var D = m.length; D; ) {
                        q = m;
                        for (m = []; ++t < D; ) q && q[t].run();
                        t = -1;
                        D = m.length;
                    }
                    q = null;
                    A = !1;
                    y(B);
                }
            }
            function e(B, D) {
                this.fun = B;
                this.array = D;
            }
            function f() {}
            v = v.exports = {};
            try {
                var k = 'function' === typeof setTimeout ? setTimeout : u;
            } catch (B) {
                k = u;
            }
            try {
                var p = 'function' === typeof clearTimeout ? clearTimeout : n;
            } catch (B) {
                p = n;
            }
            var m = [],
                A = !1,
                q,
                t = -1;
            v.nextTick = function (B) {
                var D = Array(arguments.length - 1);
                if (1 < arguments.length) for (var I = 1; I < arguments.length; I++) D[I - 1] = arguments[I];
                m.push(new e(B, D));
                1 !== m.length || A || r(d);
            };
            e.prototype.run = function () {
                this.fun.apply(null, this.array);
            };
            v.title = 'browser';
            v.browser = !0;
            v.env = {};
            v.argv = [];
            v.version = '';
            v.versions = {};
            v.on = f;
            v.addListener = f;
            v.once = f;
            v.off = f;
            v.removeListener = f;
            v.removeAllListeners = f;
            v.emit = f;
            v.prependListener = f;
            v.prependOnceListener = f;
            v.listeners = function (B) {
                return [];
            };
            v.binding = function (B) {
                throw Error('process.binding is not supported');
            };
            v.cwd = function () {
                return '/';
            };
            v.chdir = function (B) {
                throw Error('process.chdir is not supported');
            };
            v.umask = function () {
                return 0;
            };
        },
        function (v, x, u) {
            x.a = function () {
                ArrayBuffer.prototype.slice ||
                    (ArrayBuffer.prototype.slice = function (n, r) {
                        void 0 === n && (n = 0);
                        void 0 === r && (r = this.byteLength);
                        n = Math.floor(n);
                        r = Math.floor(r);
                        0 > n && (n += this.byteLength);
                        0 > r && (r += this.byteLength);
                        n = Math.min(Math.max(0, n), this.byteLength);
                        r = Math.min(Math.max(0, r), this.byteLength);
                        if (0 >= r - n) return new ArrayBuffer(0);
                        var y = new ArrayBuffer(r - n),
                            l = new Uint8Array(y);
                        n = new Uint8Array(this, n, r - n);
                        l.set(n);
                        return y;
                    });
            };
        },
        function (v, x, u) {
            x.a = function (n) {
                var r = {};
                decodeURIComponent(n.slice(1))
                    .split('&')
                    .forEach(function (y) {
                        y = y.split('=', 2);
                        r[y[0]] = y[1];
                    });
                return r;
            };
        },
        function (v, x, u) {
            (function (n) {
                function r(C) {
                    'function' !== typeof C && (C = new Function('' + C));
                    for (var E = Array(arguments.length - 1), F = 0; F < E.length; F++) E[F] = arguments[F + 1];
                    q[A] = { callback: C, args: E };
                    D(A);
                    return A++;
                }
                function y(C) {
                    delete q[C];
                }
                function l(C) {
                    if (t) setTimeout(l, 0, C);
                    else {
                        var E = q[C];
                        if (E) {
                            t = !0;
                            try {
                                var F = E.callback,
                                    a = E.args;
                                switch (a.length) {
                                    case 0:
                                        F();
                                        break;
                                    case 1:
                                        F(a[0]);
                                        break;
                                    case 2:
                                        F(a[0], a[1]);
                                        break;
                                    case 3:
                                        F(a[0], a[1], a[2]);
                                        break;
                                    default:
                                        F.apply(void 0, a);
                                }
                            } finally {
                                y(C), (t = !1);
                            }
                        }
                    }
                }
                function d() {
                    D = function (C) {
                        n.nextTick(function () {
                            l(C);
                        });
                    };
                }
                function e() {
                    if (m.postMessage && !m.importScripts) {
                        var C = !0,
                            E = m.onmessage;
                        m.onmessage = function () {
                            C = !1;
                        };
                        m.postMessage('', '*');
                        m.onmessage = E;
                        return C;
                    }
                }
                function f() {
                    var C = 'setImmediate$' + Math.random() + '$',
                        E = function (F) {
                            (F.source !== m && F.source !== m.parent) ||
                                'string' !== typeof F.data ||
                                0 !== F.data.indexOf(C) ||
                                l(+F.data.slice(C.length));
                        };
                    m.addEventListener ? m.addEventListener('message', E, !1) : m.attachEvent('onmessage', E);
                    D = function (F) {
                        m.postMessage(C + F, '*');
                    };
                }
                function k() {
                    var C = B.documentElement;
                    D = function (E) {
                        var F = B.createElement('script');
                        F.onreadystatechange = function () {
                            l(E);
                            F.onreadystatechange = null;
                            C.removeChild(F);
                            F = null;
                        };
                        C.appendChild(F);
                    };
                }
                function p() {
                    D = function (C) {
                        setTimeout(l, 0, C);
                    };
                }
                var m = 'undefined' === typeof window ? self : window,
                    A = 1,
                    q = {},
                    t = !1,
                    B = m.document,
                    D,
                    I = Object.getPrototypeOf && Object.getPrototypeOf(m);
                I = I && I.setTimeout ? I : m;
                '[object process]' === {}.toString.call(m.process)
                    ? d()
                    : e()
                    ? f()
                    : B && 'onreadystatechange' in B.createElement('script')
                    ? k()
                    : p();
                I.setImmediate = r;
                I.clearImmediate = y;
                x.a = { setImmediate: r, clearImmediate: y };
            }.call(this, u(12)));
        },
        function (v, x, u) {
            var n = u(0),
                r = u(2);
            v = (function () {
                function y(l, d) {
                    this.name = l;
                    this.comObj = d;
                    this.callbackIndex = 1;
                    this.postMessageTransfers = !0;
                    this.callbacksCapabilities = {};
                    this.actionHandler = {};
                    this.actionHandlerAsync = {};
                    this.pdfnetCommandChain = this.nextAsync = null;
                    this.pdfnetActiveCommands = new Set();
                    this.actionHandler.console_log = [
                        function (e) {
                            Object(n.d)(e);
                        }
                    ];
                    this.actionHandler.console_error = [
                        function (e) {
                            Object(n.c)(e);
                        }
                    ];
                    this.actionHandler.workerLoaded = [function () {}];
                    this.msgHandler = this.handleMessage.bind(this);
                    d.addEventListener('message', this.msgHandler);
                }
                y.prototype.on = function (l, d, e) {
                    var f = this.actionHandler;
                    f[l] && Object(n.c)('There is already an actionName called "' + l + '"');
                    f[l] = [d, e];
                };
                y.prototype.clearActionHandlers = function () {
                    this.actionHandler = {};
                    this.comObj.removeEventListener('message', this.msgHandler);
                };
                y.prototype.reset = function () {
                    this.clearActionHandlers();
                    this.comObj.reset && this.comObj.reset();
                };
                y.prototype.replace = function (l, d, e) {
                    this.actionHandler[l] = [d, e];
                };
                y.prototype.onAsync = function (l, d, e) {
                    var f = this.actionHandlerAsync;
                    f[l] && Object(n.c)('There is already an actionName called "' + l + '"');
                    f[l] = [d, e];
                };
                y.prototype.replaceAsync = function (l, d, e) {
                    var f = this.actionHandlerAsync,
                        k = this.actionHandler;
                    k[l] && delete k[l];
                    f[l] = [d, e];
                };
                y.prototype.onNextAsync = function (l) {
                    this.nextAsync = l;
                };
                y.prototype.send = function (l, d) {
                    this.postMessage({ action: l, data: d });
                };
                y.prototype.getNextId = function () {
                    return this.callbackIndex++;
                };
                y.prototype.sendWithPromise = function (l, d, e) {
                    var f = this.getNextId();
                    l = { action: l, data: d, callbackId: f, priority: e };
                    d = window.createPromiseCapability();
                    this.callbacksCapabilities[f] = d;
                    try {
                        this.postMessage(l);
                    } catch (k) {
                        d.reject(k);
                    }
                    return d.promise;
                };
                y.prototype.sendWithPromiseReturnId = function (l, d, e) {
                    var f = this.getNextId();
                    l = { action: l, data: d, callbackId: f, priority: e };
                    d = window.createPromiseCapability();
                    this.callbacksCapabilities[f] = d;
                    try {
                        this.postMessage(l);
                    } catch (k) {
                        d.reject(k);
                    }
                    return { promise: d.promise, callbackId: f };
                };
                y.prototype.sendWithPromiseWithId = function (l, d, e) {
                    d > this.callbackIndex &&
                        Object(n.c)("Can't reuse callbackId " + d + ' lesser than callbackIndex ' + this.callbackIndex);
                    d in this.callbacksCapabilities &&
                        Object(n.c)("Can't reuse callbackId " + d + '. There is a capability waiting to be resolved. ');
                    l = { action: l, data: e, callbackId: d };
                    e = window.createPromiseCapability();
                    this.callbacksCapabilities[d] = e;
                    try {
                        this.postMessage(l);
                    } catch (f) {
                        e.reject(f);
                    }
                    return e.promise;
                };
                y.prototype.sendError = function (l, d) {
                    if (l.message || l.errorData) {
                        l.message && l.message.message && (l.message = l.message.message);
                        var e = l.errorData;
                        l = { type: l.type ? l.type : 'JavascriptError', message: l.message };
                        e &&
                            Object.keys(e).forEach(function (f) {
                                e.hasOwnProperty(f) && (l[f] = e[f]);
                            });
                    }
                    this.postMessage({ isReply: !0, callbackId: d, error: l });
                };
                y.prototype.getPromise = function (l) {
                    if (l in this.callbacksCapabilities) return this.callbacksCapabilities[l];
                    Object(n.c)('Cannot get promise for callback ' + l);
                };
                y.prototype.cancelPromise = function (l) {
                    if (l in this.callbacksCapabilities) {
                        var d = this.callbacksCapabilities[l];
                        delete this.callbacksCapabilities[l];
                        this.pdfnetActiveCommands.has(l) && this.pdfnetActiveCommands.delete(l);
                        d.reject({ type: 'Cancelled', message: 'Request has been cancelled.' });
                        this.postMessage({ action: 'actionCancel', data: { callbackId: l } });
                    } else Object(n.e)('Cannot cancel callback ' + l);
                };
                y.prototype.postMessage = function (l) {
                    Object(r.a)('enableWorkerLogs') && Object(n.d)('PDFWorker', 'Sent ' + JSON.stringify(l));
                    if (this.postMessageTransfers) {
                        var d = this.getTransfersArray(l);
                        this.comObj.postMessage(l, d);
                    } else this.comObj.postMessage(l);
                };
                y.prototype.getObjectTransfers = function (l, d) {
                    var e = this;
                    null !== l &&
                        'object' === typeof l &&
                        (l instanceof Uint8Array
                            ? d.push(l.buffer)
                            : l instanceof ArrayBuffer
                            ? d.push(l)
                            : Object.keys(l).forEach(function (f) {
                                  l.hasOwnProperty(f) && e.getObjectTransfers(l[f], d);
                              }));
                };
                y.prototype.getTransfersArray = function (l) {
                    var d = [];
                    this.getObjectTransfers(l, d);
                    return 0 === d.length ? void 0 : d;
                };
                y.prototype.handleMessage = function (l) {
                    var d = this,
                        e = l.data;
                    Object(r.a)('enableWorkerLogs') && Object(n.d)('PDFWorker', 'Received ' + JSON.stringify(e));
                    var f = this.actionHandler,
                        k = this.actionHandlerAsync;
                    l = this.callbacksCapabilities;
                    var p = this.pdfnetActiveCommands;
                    if (e.isReply)
                        (f = e.callbackId),
                            f in l
                                ? ((k = l[f]),
                                  delete l[f],
                                  p.has(f) && p.delete(f),
                                  'error' in e ? k.reject(e.error) : k.resolve(e.data))
                                : Object(n.a)('Cannot resolve callback ' + f);
                    else if (e.action in f) {
                        var m = f[e.action];
                        e.callbackId
                            ? Promise.resolve()
                                  .then(function () {
                                      return m[0].call(m[1], e.data);
                                  })
                                  .then(
                                      function (A) {
                                          d.postMessage({ isReply: !0, callbackId: e.callbackId, data: A });
                                      },
                                      function (A) {
                                          d.sendError(A, e.callbackId);
                                      }
                                  )
                            : m[0].call(m[1], e.data);
                    } else
                        e.action in k
                            ? ((m = k[e.action]),
                              e.callbackId
                                  ? m[0].call(m[1], e).then(
                                        function (A) {
                                            d.postMessage({ isReply: !0, callbackId: e.callbackId, data: A });
                                            d.nextAsync();
                                        },
                                        function (A) {
                                            d.sendError(A, e.callbackId);
                                            d.nextAsync();
                                        }
                                    )
                                  : m[0].call(m[1], e).then(
                                        function () {
                                            d.nextAsync();
                                        },
                                        function () {
                                            d.nextAsync();
                                        }
                                    ))
                            : Object(n.c)('Unknown action from worker: ' + e.action);
                };
                return y;
            })();
            x.a = v;
        },
        function (v, x, u) {
            u.d(x, 'a', function () {
                return d;
            });
            var n = u(3),
                r = u(9),
                y = u(5),
                l = (function () {
                    function e(f) {
                        var k = this;
                        this.promise = f.then(function (p) {
                            k.response = p;
                            k.status = 200;
                        });
                    }
                    e.prototype.addEventListener = function (f, k) {
                        this.promise.then(k);
                    };
                    return e;
                })(),
                d = function (e, f, k) {
                    if (Object(y.a)() && !k)
                        (self.Module.instantiateWasm = function (m, A) {
                            return Object(r.a)(e + 'Wasm.wasm', m, f['Wasm.wasm']).then(function (q) {
                                A(q.instance);
                            });
                        }),
                            (k = Object(n.b)(e + 'Wasm.js.mem', f['Wasm.js.mem'], !1, !1));
                    else {
                        k = Object(n.b)(
                            (self.Module.asmjsPrefix ? self.Module.asmjsPrefix : '') + e + '.js.mem',
                            f['.js.mem'],
                            !1
                        );
                        var p = Object(n.c)(
                            (self.Module.memoryInitializerPrefixURL ? self.Module.memoryInitializerPrefixURL : '') +
                                e +
                                '.mem',
                            f['.mem'],
                            !0,
                            !0
                        );
                        self.Module.memoryInitializerRequest = new l(p);
                    }
                    k = new Blob([k], { type: 'application/javascript' });
                    importScripts(URL.createObjectURL(k));
                };
        },
        function (v, x, u) {
            u.d(x, 'a', function () {
                return n;
            });
            var n = 'optimized/';
        },
        function (v, x, u) {
            v.exports = u(20);
        },
        function (v, x, u) {
            u.r(x);
            u(5);
            v = u(13);
            u(21);
            u(22);
            u(25);
            u(26);
            u(27);
            u(28);
            u(29);
            Object(v.a)();
        },
        function (v, x, u) {
            (function (n) {
                'undefined' === typeof n.crypto &&
                    (n.crypto = {
                        getRandomValues: function (r) {
                            for (var y = 0; y < r.length; y++) r[y] = 256 * Math.random();
                        }
                    });
            })('undefined' === typeof window ? self : window);
        },
        function (v, x, u) {
            (function (n, r) {
                function y(l) {
                    '@babel/helpers - typeof';
                    return (
                        (y =
                            'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
                                ? function (d) {
                                      return typeof d;
                                  }
                                : function (d) {
                                      return d &&
                                          'function' == typeof Symbol &&
                                          d.constructor === Symbol &&
                                          d !== Symbol.prototype
                                          ? 'symbol'
                                          : typeof d;
                                  }),
                        y(l)
                    );
                }
                (function (l) {
                    function d() {
                        for (var z = 0; z < w.length; z++) w[z][0](w[z][1]);
                        w = [];
                        G = !1;
                    }
                    function e(z, H) {
                        w.push([z, H]);
                        G || ((G = !0), g(d, 0));
                    }
                    function f(z, H) {
                        function J(K) {
                            m(H, K);
                        }
                        function L(K) {
                            q(H, K);
                        }
                        try {
                            z(J, L);
                        } catch (K) {
                            L(K);
                        }
                    }
                    function k(z) {
                        var H = z.owner,
                            J = H.state_;
                        H = H.data_;
                        var L = z[J];
                        z = z.then;
                        if ('function' === typeof L) {
                            J = b;
                            try {
                                H = L(H);
                            } catch (K) {
                                q(z, K);
                            }
                        }
                        p(z, H) || (J === b && m(z, H), J === c && q(z, H));
                    }
                    function p(z, H) {
                        var J;
                        try {
                            if (z === H) throw new TypeError('A promises callback cannot return that same promise.');
                            if (H && ('function' === typeof H || 'object' === y(H))) {
                                var L = H.then;
                                if ('function' === typeof L)
                                    return (
                                        L.call(
                                            H,
                                            function (K) {
                                                J || ((J = !0), H !== K ? m(z, K) : A(z, K));
                                            },
                                            function (K) {
                                                J || ((J = !0), q(z, K));
                                            }
                                        ),
                                        !0
                                    );
                            }
                        } catch (K) {
                            return J || q(z, K), !0;
                        }
                        return !1;
                    }
                    function m(z, H) {
                        (z !== H && p(z, H)) || A(z, H);
                    }
                    function A(z, H) {
                        z.state_ === F && ((z.state_ = a), (z.data_ = H), e(B, z));
                    }
                    function q(z, H) {
                        z.state_ === F && ((z.state_ = a), (z.data_ = H), e(D, z));
                    }
                    function t(z) {
                        var H = z.then_;
                        z.then_ = void 0;
                        for (z = 0; z < H.length; z++) k(H[z]);
                    }
                    function B(z) {
                        z.state_ = b;
                        t(z);
                    }
                    function D(z) {
                        z.state_ = c;
                        t(z);
                    }
                    function I(z) {
                        if ('function' !== typeof z)
                            throw new TypeError('Promise constructor takes a function argument');
                        if (!(this instanceof I))
                            throw new TypeError(
                                "Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function."
                            );
                        this.then_ = [];
                        f(z, this);
                    }
                    l.createPromiseCapability = function () {
                        var z = {};
                        z.promise = new I(function (H, J) {
                            z.resolve = H;
                            z.reject = J;
                        });
                        return z;
                    };
                    var C = l.Promise,
                        E =
                            C &&
                            'resolve' in C &&
                            'reject' in C &&
                            'all' in C &&
                            'race' in C &&
                            (function () {
                                var z;
                                new C(function (H) {
                                    z = H;
                                });
                                return 'function' === typeof z;
                            })();
                    'undefined' !== typeof exports && exports
                        ? ((exports.Promise = E ? C : I), (exports.Polyfill = I))
                        : 'function' === typeof define && u(24)
                        ? define(function () {
                              return E ? C : I;
                          })
                        : E || (l.Promise = I);
                    var F = 'pending',
                        a = 'sealed',
                        b = 'fulfilled',
                        c = 'rejected',
                        h = function () {},
                        g = 'undefined' !== typeof r ? r : setTimeout,
                        w = [],
                        G;
                    I.prototype = {
                        constructor: I,
                        state_: F,
                        then_: null,
                        data_: void 0,
                        then: function (z, H) {
                            z = { owner: this, then: new this.constructor(h), fulfilled: z, rejected: H };
                            this.state_ === b || this.state_ === c ? e(k, z) : this.then_.push(z);
                            return z.then;
                        },
                        catch: function (z) {
                            return this.then(null, z);
                        }
                    };
                    I.all = function (z) {
                        if ('[object Array]' !== Object.prototype.toString.call(z))
                            throw new TypeError('You must pass an array to Promise.all().');
                        return new this(function (H, J) {
                            function L(Q) {
                                O++;
                                return function (R) {
                                    K[Q] = R;
                                    --O || H(K);
                                };
                            }
                            for (var K = [], O = 0, M = 0, P; M < z.length; M++)
                                (P = z[M]) && 'function' === typeof P.then ? P.then(L(M), J) : (K[M] = P);
                            O || H(K);
                        });
                    };
                    I.race = function (z) {
                        if ('[object Array]' !== Object.prototype.toString.call(z))
                            throw new TypeError('You must pass an array to Promise.race().');
                        return new this(function (H, J) {
                            for (var L = 0, K; L < z.length; L++)
                                (K = z[L]) && 'function' === typeof K.then ? K.then(H, J) : H(K);
                        });
                    };
                    I.resolve = function (z) {
                        return z && 'object' === y(z) && z.constructor === this
                            ? z
                            : new this(function (H) {
                                  H(z);
                              });
                    };
                    I.reject = function (z) {
                        return new this(function (H, J) {
                            J(z);
                        });
                    };
                })(
                    'undefined' !== typeof window
                        ? window
                        : 'undefined' !== typeof n
                        ? n
                        : 'undefined' !== typeof self
                        ? self
                        : void 0
                );
            }.call(this, u(10), u(7).setImmediate));
        },
        function (v, x, u) {
            (function (n, r) {
                (function (y, l) {
                    function d(F) {
                        delete B[F];
                    }
                    function e(F) {
                        if (D) setTimeout(e, 0, F);
                        else {
                            var a = B[F];
                            if (a) {
                                D = !0;
                                try {
                                    var b = a.callback,
                                        c = a.args;
                                    switch (c.length) {
                                        case 0:
                                            b();
                                            break;
                                        case 1:
                                            b(c[0]);
                                            break;
                                        case 2:
                                            b(c[0], c[1]);
                                            break;
                                        case 3:
                                            b(c[0], c[1], c[2]);
                                            break;
                                        default:
                                            b.apply(l, c);
                                    }
                                } finally {
                                    d(F), (D = !1);
                                }
                            }
                        }
                    }
                    function f() {
                        C = function (F) {
                            r.nextTick(function () {
                                e(F);
                            });
                        };
                    }
                    function k() {
                        if (y.postMessage && !y.importScripts) {
                            var F = !0,
                                a = y.onmessage;
                            y.onmessage = function () {
                                F = !1;
                            };
                            y.postMessage('', '*');
                            y.onmessage = a;
                            return F;
                        }
                    }
                    function p() {
                        var F = 'setImmediate$' + Math.random() + '$',
                            a = function (b) {
                                b.source === y &&
                                    'string' === typeof b.data &&
                                    0 === b.data.indexOf(F) &&
                                    e(+b.data.slice(F.length));
                            };
                        y.addEventListener ? y.addEventListener('message', a, !1) : y.attachEvent('onmessage', a);
                        C = function (b) {
                            y.postMessage(F + b, '*');
                        };
                    }
                    function m() {
                        var F = new MessageChannel();
                        F.port1.onmessage = function (a) {
                            e(a.data);
                        };
                        C = function (a) {
                            F.port2.postMessage(a);
                        };
                    }
                    function A() {
                        var F = I.documentElement;
                        C = function (a) {
                            var b = I.createElement('script');
                            b.onreadystatechange = function () {
                                e(a);
                                b.onreadystatechange = null;
                                F.removeChild(b);
                                b = null;
                            };
                            F.appendChild(b);
                        };
                    }
                    function q() {
                        C = function (F) {
                            setTimeout(e, 0, F);
                        };
                    }
                    if (!y.setImmediate) {
                        var t = 1,
                            B = {},
                            D = !1,
                            I = y.document,
                            C,
                            E = Object.getPrototypeOf && Object.getPrototypeOf(y);
                        E = E && E.setTimeout ? E : y;
                        '[object process]' === {}.toString.call(y.process)
                            ? f()
                            : k()
                            ? p()
                            : y.MessageChannel
                            ? m()
                            : I && 'onreadystatechange' in I.createElement('script')
                            ? A()
                            : q();
                        E.setImmediate = function (F) {
                            'function' !== typeof F && (F = new Function('' + F));
                            for (var a = Array(arguments.length - 1), b = 0; b < a.length; b++) a[b] = arguments[b + 1];
                            B[t] = { callback: F, args: a };
                            C(t);
                            return t++;
                        };
                        E.clearImmediate = d;
                    }
                })('undefined' === typeof self ? ('undefined' === typeof n ? this : n) : self);
            }.call(this, u(10), u(12)));
        },
        function (v, x) {
            v.exports = {};
        },
        function (v, x, u) {
            (function (n) {
                var r = function (y, l) {
                    var d = function p(k) {
                            k = this['catch'](k);
                            return { cancel: l, promise: k, then: e.bind(k), catch: p.bind(k) };
                        },
                        e = function A(p, m) {
                            p = this.then(p, m);
                            return { cancel: l, promise: p, then: A.bind(p), catch: d.bind(p) };
                        };
                    return { cancel: l, promise: y, then: e.bind(y), catch: d.bind(y) };
                };
                n.CancellablePromise = function (y, l) {
                    var d = !1,
                        e,
                        f = new Promise(function (k, p) {
                            e = function () {
                                d || (l(), p('cancelled'));
                            };
                            new Promise(y).then(
                                function (m) {
                                    d = !0;
                                    k(m);
                                },
                                function (m) {
                                    d = !0;
                                    p(m);
                                }
                            );
                        });
                    return r(f, e);
                };
                n.CancellablePromise.all = function (y) {
                    var l = Promise.all(y);
                    return r(l, function () {
                        y.forEach(function (d) {
                            d.cancel && d.cancel();
                        });
                    });
                };
            })('undefined' === typeof self ? void 0 : self);
        },
        function (v, x, u) {
            (function (n, r) {
                var y = u(1);
                (function (l) {
                    l.Module = {
                        INITIAL_MEMORY: 50331648,
                        noExitRuntime: !0,
                        devicePixelRatio: 1,
                        cur_doc: null,
                        cachePtrSize: 0,
                        hasBufOwnership: !0,
                        loaded: !1,
                        initCb: null,
                        cachePtr: null,
                        cleanupState: null,
                        docs: {},
                        postEvent: function (d, e, f) {
                            Module.workerMessageHandler.send('event', { docId: d, type: e, data: f });
                        },
                        postProgressiveRenderingStartEvent: function (d, e) {
                            Module.postEvent(d, 'progressiveRenderingStart', { pageNum: e });
                        },
                        postPagesUpdatedEvent: function (d, e, f, k) {
                            d = { pageDimensions: Module.GetPageDimensions(d) };
                            if (f)
                                for (var p = 0; p < f.length; ++p)
                                    f[p] in d.pageDimensions
                                        ? ((d.pageDimensions[f[p]].contentChanged = !0),
                                          k && (d.pageDimensions[f[p]].annotationsUnchanged = !0))
                                        : console.warn('Invalid Page Number '.concat(f[p]));
                            Module.postEvent(e, 'pagesUpdated', d);
                            return d;
                        },
                        postPagesRenamedEvent: function (d, e) {
                            var f = {};
                            d = Module.PDFDocGetPageIterator(d, 1);
                            for (var k = 1; Module.IteratorHasNext(d); ++k) {
                                var p = Module.stackSave(),
                                    m = Module.IteratorCurrent(d);
                                f[k] = Module.PageGetId(m);
                                Module.IteratorNext(d);
                                Module.stackRestore(p);
                            }
                            Module.postEvent(e, 'pagesRenamed', { pageNumToId: f });
                        },
                        GetIndividualPageDimensions: function (d, e, f) {
                            d = Module.PageGetPageInfo(f);
                            d.id = Module.PageGetId(f);
                            return d;
                        },
                        GetPageDimensionsRange: function (d, e, f) {
                            for (
                                var k = {}, p = Module.PDFDocGetPageIterator(d, e);
                                e < f && Module.IteratorHasNext(p);
                                ++e
                            ) {
                                var m = Module.stackSave(),
                                    A = Module.IteratorCurrent(p);
                                k[e] = this.GetIndividualPageDimensions(d, e, A);
                                Module.IteratorNext(p);
                                Module.stackRestore(m);
                            }
                            return k;
                        },
                        GetPageDimensionsContentChangedList: function (d, e) {
                            e.sort(function (B, D) {
                                return B - D;
                            });
                            for (
                                var f = {},
                                    k = e[0],
                                    p = e[e.length - 1],
                                    m = 0,
                                    A = Module.PDFDocGetPageIterator(d, k);
                                k <= p && Module.IteratorHasNext(A);
                                ++k
                            ) {
                                if (e[m] == k) {
                                    ++m;
                                    var q = Module.stackSave(),
                                        t = Module.IteratorCurrent(A);
                                    t = this.GetIndividualPageDimensions(d, k, t);
                                    t.contentChanged = !0;
                                    f[k] = t;
                                    Module.stackRestore(q);
                                }
                                Module.IteratorNext(A);
                            }
                            return f;
                        },
                        GetPageDimensions: function (d) {
                            try {
                                var e = Module.stackSave();
                                var f = Module.GetPageCount(d);
                                if (0 === f) throw 'This document has no pages.';
                                return Module.GetPageDimensionsRange(d, 1, f + 1);
                            } finally {
                                Module.stackRestore(e);
                            }
                        },
                        loadDoc: function (d, e) {
                            'undefined' === typeof Module && this._main();
                            var f = null;
                            try {
                                var k = Module.stackSave();
                                d.customHandlerId && Module._TRN_PDFNetAddPDFTronCustomHandler(d.customHandlerId);
                                e = Module.CreateDoc(d, e);
                                var p = Module.GetDoc(e);
                                if (Module.PDFDocInitSecurityHandler(p))
                                    return { docId: e, pageDimensions: Module.GetPageDimensions(p) };
                                f = {
                                    type: 'NeedsPassword',
                                    errorData: { docId: e },
                                    message: 'This document requires a password'
                                };
                            } catch (m) {
                                f = { type: 'InvalidPDF', message: m };
                            } finally {
                                Module.stackRestore(k);
                            }
                            throw f;
                        },
                        loadCanvas: function (d, e, f, k, p, m, A, q) {
                            return new Promise(function (t, B) {
                                var D = Module.GetDoc(d),
                                    I = e + 1,
                                    C = function () {
                                        t(Module.RasterizePage(D, I, f, k, m, p, A, q, d));
                                    },
                                    E = Module.docs[d].chunkStorage;
                                if (E) {
                                    var F = Module.GetDownloadData(D).downloader,
                                        a = E.getRequiredChunkOffsetArrays(F, I);
                                    E.keepChunks(a.have);
                                    F = function () {
                                        var b = E.getChunks(a.missing);
                                        Module.loadPromise = b
                                            .then(function () {
                                                var c = Module.loadPromise.cancelled;
                                                Module.loadPromise = null;
                                                c || C();
                                            })
                                            ['catch'](function (c) {
                                                'cancelled' !== c ? B(c) : (Module.loadPromise = null);
                                            });
                                    };
                                    Module.loadPromise ? Module.loadPromise.then(F, F) : F();
                                } else C();
                            });
                        },
                        loadResources: function (d, e) {
                            Module.Initialize(e);
                            Object(y.b)('worker', 'PDFNet initialized!');
                            Module._TRN_PDFNetSetDefaultDiskCachingEnabled(!1);
                            d = new Uint8Array(d);
                            Module.PDFNetSetResourceData(d);
                        },
                        onRuntimeInitialized: function () {
                            'undefined' === typeof Module &&
                                (('undefined' !== typeof window ? window : self).Module = {});
                            (function (d) {
                                d.PDFDocExportXFDF = function (e, f) {
                                    e = Module.GetDoc(e);
                                    var k = Module.stackSave();
                                    try {
                                        var p = f ? Module.PDFDocFDFExtract(e, f) : Module.PDFDocFDFExtract(e);
                                        var m = Module.FDFDocSaveAsXFDF(p);
                                        Module.stackRestore(k);
                                    } catch (A) {
                                        throw (Module.stackRestore(k), A);
                                    }
                                    return m;
                                };
                                d.PageArrayToPageSet = function (e) {
                                    var f = Module.stackSave();
                                    try {
                                        var k = Module.PageSetCreate();
                                        for (var p = 0; p < e.length; ++p) Module.PageSetAddPage(k, e[p]);
                                        Module.stackRestore(f);
                                    } catch (m) {
                                        throw (Module.stackRestore(f), m);
                                    }
                                    return k;
                                };
                                d.cancelCurrent = function () {
                                    var e = Module.loadPromise;
                                    return e
                                        ? (e.cancel(), (e.cancelled = !0))
                                        : (e = Module.cleanupState)
                                        ? (n(e.timeout),
                                          e.cleanupArr.reverse().forEach(function (f) {
                                              f();
                                          }),
                                          (Module.cleanupState = null),
                                          !0)
                                        : !1;
                                };
                                d.SetWorkerRestartCallback = function (e) {
                                    Module.workerRestartCallback = e;
                                };
                                d.XFDFMerge = function (e, f, k) {
                                    if (f) {
                                        var p = [];
                                        try {
                                            Object(y.b)('worker', 'Merge XFDF of length '.concat(f.length));
                                            var m = Module.GetUStringFromJSString(f, !0);
                                            p.push(function () {
                                                Module.UStringDestroy(m);
                                            });
                                            var A = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                                            REX(Module._TRN_FDFDocCreateFromXFDF(m, A));
                                            var q = Module.getValue(A, 'i8*');
                                            p.push(function () {
                                                Module.FDFDocDestroy(q);
                                            });
                                            Module.PDFDocFDFUpdate(e, q, k);
                                        } finally {
                                            p.reverse().forEach(function (t) {
                                                t();
                                            });
                                        }
                                    }
                                };
                                d.MergeXFDF = function (e, f, k) {
                                    return new Promise(function (p, m) {
                                        var A = [];
                                        try {
                                            var q = Module.stackSave();
                                            A[A.length] = function () {
                                                Module.stackRestore(q);
                                            };
                                            var t = Module.GetDoc(e);
                                            Module.XFDFMerge(t, f, k);
                                            A.forEach(function (B) {
                                                B();
                                            });
                                            p({});
                                        } catch (B) {
                                            A.forEach(function (D) {
                                                D();
                                            }),
                                                m(B);
                                        }
                                    });
                                };
                                d.CreateBufferFile = function (e, f, k) {
                                    Module.MakeDev(e);
                                    var p = new ArrayBuffer(f);
                                    p = new Uint8Array(p);
                                    k = k ? 0 : 255;
                                    for (var m = 0; m < f; ++m) p[m] = k;
                                    Module.docs[e] = { buffer: p };
                                };
                                d.ReadBufferFile = function (e, f) {
                                    var k = Module.docs[e].buffer;
                                    f && (Module.docs[e].buffer = new Uint8Array(k.buffer.slice(0)));
                                    return k;
                                };
                                d.RemoveBufferFile = function (e) {
                                    Module.docs[e] = null;
                                };
                                d.SaveHelper = function (e, f, k) {
                                    k = 'undefined' === typeof k ? 2 : k;
                                    Module.MakeDev(f);
                                    var p = Module._TRN_PDFDocSave(e, Module.GetUStringFromJSString(f), k, 0);
                                    Module.docs[f].sink = null;
                                    REX(p);
                                    k & 16 && Module.postPagesRenamedEvent(e, f);
                                    return Module.docs[f].buffer.buffer;
                                };
                                d.SaveDoc = function (e, f, k, p, m, A, q, t, B) {
                                    return new Promise(function (D, I) {
                                        var C = [];
                                        try {
                                            var E = Module.GetDoc(e),
                                                F = Module.stackSave();
                                            C[C.length] = function () {
                                                Module.stackRestore(F);
                                            };
                                            Module.XFDFMerge(E, f, q);
                                            var a = Module.allocate(8, 'i8', Module.ALLOC_STACK),
                                                b = Module.allocate(
                                                    Module.intArrayFromString('{"UseNonStandardRotation": true}'),
                                                    'i8',
                                                    Module.ALLOC_STACK
                                                );
                                            Module.setValue(a, b, 'i8*');
                                            Module.setValue(a + 4, 0, 'i32');
                                            Module._TRN_PDFDocRefreshAnnotAppearances(E, a);
                                            if (A) {
                                                a = function (N) {
                                                    N = new Uint8Array(N);
                                                    l.FS.writeFile('watermarkFile', N);
                                                    N = Module.ImageCreateFromFile(
                                                        E,
                                                        Module.GetUStringFromJSString('watermarkFile')
                                                    );
                                                    l.FS.unlink('watermarkFile');
                                                    return N;
                                                };
                                                var c = Module.ElementBuilderCreate();
                                                C.push(function () {
                                                    Module.ElementBuilderDestroy(c);
                                                });
                                                var h = Module.ElementWriterCreate();
                                                C.push(function () {
                                                    Module.ElementWriterDestroy(h);
                                                });
                                                try {
                                                    if (!A.hasOwnProperty('default'))
                                                        throw Error("Watermark dictionary has no 'default' key!");
                                                    var g = a(A['default']),
                                                        w = Module.PDFDocGetPageIterator(E, 1);
                                                    for (b = -1; Module.IteratorHasNext(w); ) {
                                                        var G = Module.IteratorCurrent(w);
                                                        Module.IteratorNext(w);
                                                        b++;
                                                        var z = b.toString();
                                                        try {
                                                            var H = void 0;
                                                            if (A.hasOwnProperty(z)) {
                                                                var J = A[z];
                                                                if (J) H = a(J);
                                                                else continue;
                                                            } else H = g;
                                                            var L = Module.PageGetPageInfo(G),
                                                                K = Module.ElementBuilderCreateImage(
                                                                    c,
                                                                    H,
                                                                    0,
                                                                    0,
                                                                    L.width,
                                                                    L.height
                                                                );
                                                            Module.ElementWriterBegin(h, G);
                                                            Module.ElementWriterWritePlacedElement(h, K);
                                                            Module.ElementWriterEnd(h);
                                                        } catch (N) {
                                                            console.warn(
                                                                'Watermark for page ' +
                                                                    z +
                                                                    'can not be added due to error: ' +
                                                                    N
                                                            );
                                                        }
                                                    }
                                                } catch (N) {
                                                    console.warn('Watermarks can not be added due to error: ' + N);
                                                }
                                            }
                                            if (t) {
                                                var O = Module.SecurityHandlerCreate(B);
                                                O &&
                                                    (Module.SecurityHandlerChangeUserPasswordUString(O, t),
                                                    Module.PDFDocSetSecurityHandler(E, O));
                                            }
                                            g = 0;
                                            if (p) {
                                                var M = Module.PDFDocGetRoot(E);
                                                (g = Module.ObjFindObj(M, 'OpenAction')) &&
                                                    Module.ObjPut(M, '__OpenActionBackup__', g);
                                                var P = Module.ObjPutDict(M, 'OpenAction');
                                                Module.ObjPutName(P, 'Type', 'Action');
                                                Module.ObjPutName(P, 'S', 'JavaScript');
                                                Module.ObjPutString(P, 'JS', 'this.print()');
                                            }
                                            var Q = Module.SaveHelper(E, e, m);
                                            p &&
                                                (g
                                                    ? Module.ObjPut(
                                                          M,
                                                          'OpenAction',
                                                          Module.ObjFindObj(M, '__OpenActionBackup__')
                                                      )
                                                    : Module.ObjErase(M, 'OpenAction'));
                                            C.reverse().forEach(function (N) {
                                                N();
                                            });
                                            if (k) D({ fileData: Q });
                                            else {
                                                var R = Q.slice(0);
                                                D({ fileData: R });
                                            }
                                        } catch (N) {
                                            C.reverse().forEach(function (S) {
                                                S();
                                            }),
                                                I(N);
                                        }
                                    });
                                };
                                d.SaveDocFromFixedElements = function (e, f, k, p, m, A) {
                                    e = Module.PDFDocCreateFromLayoutEls(e);
                                    e = Module.CreateDoc({ type: 'ptr', value: e });
                                    return Module.SaveDoc(e, f, !0, !1, k, p, m, A);
                                };
                                d.GetCurrentCanvasData = function (e) {
                                    var f = Module.currentRenderData;
                                    if (!f) return null;
                                    e && REX(Module._TRN_PDFRasterizerUpdateBuffer(f.rast));
                                    var k = Date.now();
                                    if (f.bufPtr) {
                                        e = new Uint8Array(new ArrayBuffer(f.buf_size));
                                        for (var p = 0, m = 0; m < f.out_height; ++m)
                                            for (var A = f.bufPtr + f.stride * m, q = 0; q < f.out_width; ++q)
                                                (e[p++] = Module.HEAPU8[A + 2]),
                                                    (e[p++] = Module.HEAPU8[A + 1]),
                                                    (e[p++] = Module.HEAPU8[A]),
                                                    (e[p++] = Module.HEAPU8[A + 3]),
                                                    (A += 4);
                                    } else e = Module.ReadBufferFile('b', e);
                                    Object(y.b)('bufferTiming', 'Copy took '.concat(Date.now() - k));
                                    return { pageBuf: e.buffer, pageWidth: f.out_width, pageHeight: f.out_height };
                                };
                                d.RasterizePage = function (e, f, k, p, m, A, q, t, B) {
                                    return new Promise(function (D, I) {
                                        Module.currentRenderData = {};
                                        var C = Module.currentRenderData;
                                        C.out_width = parseInt(k, 10);
                                        C.out_height = parseInt(p, 10);
                                        var E = [];
                                        E.push(function () {
                                            Module.currentRenderData = null;
                                        });
                                        try {
                                            var F = Module.stackSave();
                                            E[E.length] = function () {
                                                Module.stackRestore(F);
                                            };
                                            var a = Module.GetPage(e, f),
                                                b = Module.PageGetPageWidth(a),
                                                c = Module.PageGetPageHeight(a);
                                            C.stride = 4 * C.out_width;
                                            C.buf_size = C.out_width * C.out_height * 4;
                                            Object(y.b)('Memory', 'Created rasterizer');
                                            C.rast = Module.PDFRasterizerCreate();
                                            E.push(function () {
                                                Object(y.b)('Memory', 'Destroyed rasterizer');
                                                Module._TRN_PDFRasterizerDestroy(C.rast);
                                            });
                                            if (q) {
                                                var h = Module.EMSCreateUpdatedLayersContext(e, q);
                                                0 !== h &&
                                                    (REX(Module._TRN_PDFRasterizerSetOCGContext(C.rast, h)),
                                                    E.push(function () {
                                                        Module._TRN_OCGContextDestroy(h);
                                                    }));
                                            }
                                            var g = !1;
                                            t.hasOwnProperty('renderAnnots')
                                                ? (t.renderAnnots && (g = !0),
                                                  REX(
                                                      Module._TRN_PDFRasterizerSetDrawAnnotations(
                                                          C.rast,
                                                          t.renderAnnots ? 1 : 0
                                                      )
                                                  ))
                                                : REX(Module._TRN_PDFRasterizerSetDrawAnnotations(C.rast, 0));
                                            t.hasOwnProperty('highlightFields') &&
                                                (t.highlightFields && (g = !0),
                                                REX(
                                                    Module._TRN_PDFRasterizerSetHighlightFields(
                                                        C.rast,
                                                        t.highlightFields
                                                    )
                                                ));
                                            t.hasOwnProperty('antiAliasing') &&
                                                REX(Module._TRN_PDFRasterizerSetAntiAliasing(C.rast, t.antiAliasing));
                                            t.hasOwnProperty('pathHinting') &&
                                                REX(Module._TRN_PDFRasterizerSetPathHinting(C.rast, t.pathHinting));
                                            if (t.hasOwnProperty('thinLinePixelGridFit')) {
                                                var w = !0;
                                                t.hasOwnProperty('thinLineStrokeAdjust') &&
                                                    (w = t.thinLineStrokeAdjust);
                                                REX(
                                                    Module._TRN_PDFRasterizerSetThinLineAdjustment(
                                                        C.rast,
                                                        t.thinLinePixelGridFit,
                                                        w
                                                    )
                                                );
                                            } else t.hasOwnProperty('thinLineStrokeAdjust') && REX(Module._TRN_PDFRasterizerSetThinLineAdjustment(C.rast, !1, t.thinLineStrokeAdjust));
                                            t.hasOwnProperty('imageSmoothing')
                                                ? ((w = !1),
                                                  t.hasOwnProperty('hqImageResampling') && (w = t.hqImageResampling),
                                                  REX(
                                                      Module._TRN_PDFRasterizerSetImageSmoothing(
                                                          C.rast,
                                                          t.imageSmoothing,
                                                          w
                                                      )
                                                  ))
                                                : t.hasOwnProperty('hqImageResampling') &&
                                                  REX(
                                                      Module._TRN_PDFRasterizerSetImageSmoothing(
                                                          C.rast,
                                                          !0,
                                                          t.hqImageResampling
                                                      )
                                                  );
                                            t.hasOwnProperty('caching') &&
                                                REX(Module._TRN_PDFRasterizerSetCaching(C.rast, t.caching));
                                            t.hasOwnProperty('expGamma') &&
                                                REX(Module._TRN_PDFRasterizerSetGamma(C.rast, t.expGamma));
                                            t.hasOwnProperty('isPrinting') &&
                                                (t.isPrinting && (g = !0),
                                                REX(Module._TRN_PDFRasterizerSetPrintMode(C.rast, t.isPrinting)));
                                            t.hasOwnProperty('colorPostProcessMode') &&
                                                (t.colorPostProcessMode && (g = !0),
                                                REX(
                                                    Module._TRN_PDFRasterizerSetColorPostProcessMode(
                                                        C.rast,
                                                        t.colorPostProcessMode
                                                    )
                                                ));
                                            var G = Module.PageGetRotation(a);
                                            w = 1 === A || 3 === A;
                                            G = (1 === G || 3 === G) !== w;
                                            var z = Module.allocate(48, 'i8', Module.ALLOC_STACK);
                                            if (m) {
                                                m.x1 = m[0];
                                                m.y1 = m[1];
                                                m.x2 = m[2];
                                                m.y2 = m[3];
                                                var H = Module.PageGetDefaultMatrix(a, 0),
                                                    J = Module.Matrix2DInverse(H);
                                                m = Module.Matrix2DMultBBox(J, m);
                                                if (m.x2 < m.x1) {
                                                    var L = m.x1;
                                                    m.x1 = m.x2;
                                                    m.x2 = L;
                                                }
                                                m.y2 < m.y1 && ((L = m.y1), (m.y1 = m.y2), (m.y2 = L));
                                                var K = C.out_width / (G ? m.y2 - m.y1 : m.x2 - m.x1);
                                                var O = Module.GetDefaultMatrixBox(a, m, A);
                                            } else (O = Module.PageGetDefaultMatrix(a, A)), (K = C.out_width / (w ? c : b));
                                            Module.Matrix2DSet(z, K, 0, 0, K, 0, 0);
                                            Module.Matrix2DConcat(z, O);
                                            var M = Module.allocate(4, 'i8', Module.ALLOC_STACK),
                                                P = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                                            g
                                                ? ((C.bufPtr = Module._malloc(C.buf_size)),
                                                  Module._memset(C.bufPtr, t.pageTransparent ? 0 : 255, C.buf_size),
                                                  E.push(function () {
                                                      Module._free(C.bufPtr);
                                                  }))
                                                : (Module.CreateBufferFile('b', C.buf_size, t.pageTransparent),
                                                  E.push(function () {
                                                      Module.RemoveBufferFile('b');
                                                  }));
                                            var Q = t.overprintMode;
                                            if (10 === Q) {
                                                REX(Module._TRN_PDFRasterizerSetOverprint(C.rast, 1));
                                                var R = Module.PDFRasterizerRasterizeSeparations(
                                                    C.rast,
                                                    a,
                                                    C.out_width,
                                                    C.out_height,
                                                    z,
                                                    0,
                                                    0
                                                );
                                                D({ pageBuf: R, pageWidth: C.out_width, pageHeight: C.out_height });
                                            } else {
                                                REX(Module._TRN_PDFRasterizerSetOverprint(C.rast, Q));
                                                g
                                                    ? REX(
                                                          Module._TRN_PDFRasterizerGetChunkRenderer(
                                                              C.rast,
                                                              a,
                                                              C.bufPtr,
                                                              C.out_width,
                                                              C.out_height,
                                                              C.stride,
                                                              4,
                                                              !0,
                                                              z,
                                                              0,
                                                              0,
                                                              0,
                                                              M
                                                          )
                                                      )
                                                    : REX(
                                                          Module._TRN_PDFRasterizerGetChunkRendererPath(
                                                              C.rast,
                                                              a,
                                                              Module.GetUStringFromJSString('b'),
                                                              C.out_width,
                                                              C.out_height,
                                                              !0,
                                                              z,
                                                              0,
                                                              0,
                                                              0,
                                                              M
                                                          )
                                                      );
                                                var N = Module.getValue(M, 'i8*');
                                                E.push(function () {
                                                    REX(Module._TRN_ChunkRendererDestroy(N));
                                                });
                                            }
                                            var S = new Date().getTime();
                                            t.useProgress && Module.postProgressiveRenderingStartEvent(B, f);
                                            var X = r(function T() {
                                                try {
                                                    if (
                                                        (REX(Module._TRN_ChunkRendererRenderForTimePeriod(N, 200, P)),
                                                        Module.getValue(P, 'i8'))
                                                    )
                                                        Module.cleanupState.timeout = r(T);
                                                    else {
                                                        var V = Module.GetCurrentCanvasData(!1);
                                                        Object(y.b)(
                                                            'worker',
                                                            'Total Page Time '.concat(new Date().getTime() - S)
                                                        );
                                                        E.reverse().forEach(function (U) {
                                                            U();
                                                        });
                                                        D(V);
                                                    }
                                                } catch (U) {
                                                    E.reverse().forEach(function (W) {
                                                        W();
                                                    }),
                                                        I(U);
                                                }
                                            });
                                            Module.cleanupState = { cleanupArr: E, timeout: X };
                                            E.push(function () {
                                                Module.cleanupState = null;
                                            });
                                        } catch (Y) {
                                            E.reverse().forEach(function (T) {
                                                T();
                                            }),
                                                I(Y);
                                        }
                                    });
                                };
                                d.UpdatePassword = function (e, f) {
                                    try {
                                        var k = Module.stackSave();
                                        var p = Module.GetDoc(e);
                                        return Module.PDFDocInitStdSecurityHandler(p, f)
                                            ? (p in downloadDataMap &&
                                                  REX(
                                                      Module._TRN_PDFDocDownloaderInitialize(
                                                          p,
                                                          downloadDataMap[p].downloader
                                                      )
                                                  ),
                                              { success: !0, pageDimensions: Module.GetPageDimensions(p) })
                                            : { success: !1 };
                                    } finally {
                                        Module.stackRestore(k);
                                    }
                                };
                                d.TriggerFullDownload = function (e) {
                                    return new Promise(function (f, k) {
                                        var p = Module.GetDoc(e);
                                        try {
                                            p in downloadDataMap &&
                                                REX(
                                                    Module.PDFDocDownloaderTriggerFullDownload(
                                                        p,
                                                        downloadDataMap[p].downloader
                                                    )
                                                ),
                                                f({});
                                        } catch (m) {
                                            k(m);
                                        }
                                    });
                                };
                                d.InsertBlankPages = function (e, f, k, p) {
                                    return new Promise(function (m, A) {
                                        var q = [],
                                            t = Module.GetDoc(e);
                                        try {
                                            var B = Module.stackSave();
                                            q[q.length] = function () {
                                                Module.stackRestore(B);
                                            };
                                            for (var D = f.length - 1; 0 <= D; --D) {
                                                var I = Module.PDFDocGetPageIterator(t, f[D]),
                                                    C = Module.PDFDocPageCreate(t, k, p);
                                                Module.PDFDocPageInsert(t, I, C);
                                            }
                                            var E = Module.postPagesUpdatedEvent(t, e);
                                            q.forEach(function (F) {
                                                F();
                                            });
                                            m(E);
                                        } catch (F) {
                                            q.forEach(function (a) {
                                                a();
                                            }),
                                                A(F);
                                        }
                                    });
                                };
                                d.InsertPages = function (e, f, k, p, m, A) {
                                    return new Promise(function (q, t) {
                                        var B = [],
                                            D = Module.GetDoc(e);
                                        try {
                                            var I = Module.stackSave();
                                            B[B.length] = function () {
                                                Module.stackRestore(I);
                                            };
                                            if (f instanceof ArrayBuffer) {
                                                var C = Module.CreateDoc(f);
                                                var E = Module.GetDoc(C);
                                                B[B.length] = function () {
                                                    Module.DeleteDoc(C);
                                                };
                                            } else E = Module.GetDoc(f);
                                            for (var F = k.length, a = Module.PageSetCreate(), b = 0; b < F; ++b)
                                                Module.PageSetAddPage(a, k[b]);
                                            Module.PDFDocInsertPages(D, p, E, a, m);
                                            var c;
                                            A || (c = Module.postPagesUpdatedEvent(D, e));
                                            B.reverse().forEach(function (h) {
                                                h();
                                            });
                                            q(c);
                                        } catch (h) {
                                            B.reverse().forEach(function (g) {
                                                g();
                                            }),
                                                t(h);
                                        }
                                    });
                                };
                                d.MovePages = function (e, f, k) {
                                    return new Promise(function (p, m) {
                                        var A = [],
                                            q = Module.GetDoc(e);
                                        try {
                                            var t = Module.stackSave();
                                            A[A.length] = function () {
                                                Module.stackRestore(t);
                                            };
                                            for (var B = f.length, D = Module.PageSetCreate(), I = 0; I < B; ++I)
                                                Module.PageSetAddPage(D, f[I]);
                                            Module.PDFDocMovePages(q, k, D);
                                            var C = Module.postPagesUpdatedEvent(q, e);
                                            A.forEach(function (E) {
                                                E();
                                            });
                                            p(C);
                                        } catch (E) {
                                            A.forEach(function (F) {
                                                F();
                                            }),
                                                m(E);
                                        }
                                    });
                                };
                                d.RemovePages = function (e, f, k) {
                                    return new Promise(function (p, m) {
                                        var A = Module.GetDoc(e),
                                            q = [];
                                        try {
                                            var t = Module.stackSave();
                                            q[q.length] = function () {
                                                Module.stackRestore(t);
                                            };
                                            for (var B = f.length - 1; 0 <= B; --B) {
                                                var D = Module.PDFDocGetPageIterator(A, f[B]);
                                                Module.IteratorHasNext(D) && Module.PDFDocPageRemove(A, D);
                                            }
                                            var I;
                                            k || (I = Module.postPagesUpdatedEvent(A, e));
                                            q.forEach(function (C) {
                                                C();
                                            });
                                            p(I);
                                        } catch (C) {
                                            q.forEach(function (E) {
                                                E();
                                            }),
                                                m(C);
                                        }
                                    });
                                };
                                d.RotatePages = function (e, f, k) {
                                    return new Promise(function (p, m) {
                                        var A = Module.GetDoc(e),
                                            q = [];
                                        try {
                                            var t = Module.stackSave();
                                            q[q.length] = function () {
                                                Module.stackRestore(t);
                                            };
                                            var B = f.length,
                                                D = 0,
                                                I = Module.PDFDocGetPageIterator(A, f[0]),
                                                C = [];
                                            q.push(function () {
                                                Module._TRN_IteratorDestroy(I);
                                            });
                                            for (var E = f[0]; Module.IteratorHasNext(I) && D < f[B - 1]; ++E) {
                                                if (E === f[D]) {
                                                    var F = Module.IteratorCurrent(I),
                                                        a = (Module.PageGetRotation(F) + k) % 4;
                                                    Module.PageSetRotation(F, a);
                                                    C.push(E);
                                                    D++;
                                                }
                                                Module.IteratorNext(I);
                                            }
                                            var b = Module.postPagesUpdatedEvent(A, e, C, !0);
                                            q.reverse().forEach(function (c) {
                                                c();
                                            });
                                            p(b);
                                        } catch (c) {
                                            q.reverse().forEach(function (h) {
                                                h();
                                            }),
                                                m(c);
                                        }
                                    });
                                };
                                d.ExtractPages = function (e, f, k, p, m) {
                                    return new Promise(function (A, q) {
                                        var t = [];
                                        try {
                                            var B = Module.GetDoc(e),
                                                D = Module.stackSave();
                                            t[t.length] = function () {
                                                Module.stackRestore(D);
                                            };
                                            var I = function (F) {
                                                t.reverse().forEach(function (a) {
                                                    a();
                                                });
                                                q(F);
                                            };
                                            Module.XFDFMerge(B, k, m);
                                            var C = Module.CreateEmptyDoc();
                                            t[t.length] = function () {
                                                Module.DeleteDoc(C);
                                            };
                                            var E = Module.InsertPages(C, e, f, 1, !0)
                                                .then(function () {
                                                    return Module.SaveDoc(C, void 0, !0, !1, void 0, p);
                                                })
                                                .then(function (F) {
                                                    t.reverse().forEach(function (a) {
                                                        a();
                                                    });
                                                    return F;
                                                })
                                                ['catch'](I);
                                            A(E);
                                        } catch (F) {
                                            I(F);
                                        }
                                    });
                                };
                                d.CropPages = function (e, f, k, p, m, A) {
                                    return new Promise(function (q, t) {
                                        var B = Module.GetDoc(e),
                                            D = [];
                                        try {
                                            var I = Module.stackSave();
                                            D[D.length] = function () {
                                                Module.stackRestore(I);
                                            };
                                            var C = f.length,
                                                E = 0,
                                                F = Module.PDFDocGetPageIterator(B, f[0]);
                                            D.push(function () {
                                                Module._TRN_IteratorDestroy(F);
                                            });
                                            for (var a = [], b = f[0]; Module.IteratorHasNext(F) && E < f[C - 1]; ++b) {
                                                if (b === f[E]) {
                                                    var c = Module.IteratorCurrent(F),
                                                        h = Module.allocate(8, 'i8', Module.ALLOC_STACK);
                                                    REX(Module._TRN_PageGetCropBox(c, h));
                                                    var g = Module.PageGetRotation(c),
                                                        w = Module.getValue(h, 'double'),
                                                        G = Module.getValue(h + 8, 'double'),
                                                        z = Module.getValue(h + 16, 'double'),
                                                        H = Module.getValue(h + 24, 'double');
                                                    0 === g % 4
                                                        ? (Module.setValue(h, w + m, 'double'),
                                                          Module.setValue(h + 8, G + p, 'double'),
                                                          Module.setValue(h + 16, z - A, 'double'),
                                                          Module.setValue(h + 24, H - k, 'double'))
                                                        : 1 === g % 4
                                                        ? (Module.setValue(h, w + k, 'double'),
                                                          Module.setValue(h + 8, G + m, 'double'),
                                                          Module.setValue(h + 16, z - p, 'double'),
                                                          Module.setValue(h + 24, H - A, 'double'))
                                                        : 2 === g % 4
                                                        ? (Module.setValue(h, w + A, 'double'),
                                                          Module.setValue(h + 8, G + k, 'double'),
                                                          Module.setValue(h + 16, z - m, 'double'),
                                                          Module.setValue(h + 24, H - p, 'double'))
                                                        : 3 === g % 4 &&
                                                          (Module.setValue(h, w + p, 'double'),
                                                          Module.setValue(h + 8, G + A, 'double'),
                                                          Module.setValue(h + 16, z - k, 'double'),
                                                          Module.setValue(h + 24, H - m, 'double'));
                                                    Module.setValue(h + 32, 0, 'double');
                                                    REX(Module._TRN_PageSetBox(c, 0, h));
                                                    REX(Module._TRN_PageSetBox(c, 1, h));
                                                    a.push(b);
                                                    E++;
                                                }
                                                Module.IteratorNext(F);
                                            }
                                            var J = Module.postPagesUpdatedEvent(B, e, a, !0);
                                            D.reverse().forEach(function (L) {
                                                L();
                                            });
                                            q(J);
                                        } catch (L) {
                                            D.reverse().forEach(function (K) {
                                                K();
                                            }),
                                                t(L);
                                        }
                                    });
                                };
                            })('undefined' === typeof self ? this.Module : self.Module);
                            this.loaded = !0;
                            Module.initCb && Module.initCb();
                        }
                    };
                })(self);
            }.call(this, u(7).clearImmediate, u(7).setImmediate));
        },
        function (v, x, u) {
            (function (n) {
                function r(d) {
                    '@babel/helpers - typeof';
                    return (
                        (r =
                            'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
                                ? function (e) {
                                      return typeof e;
                                  }
                                : function (e) {
                                      return e &&
                                          'function' == typeof Symbol &&
                                          e.constructor === Symbol &&
                                          e !== Symbol.prototype
                                          ? 'symbol'
                                          : typeof e;
                                  }),
                        r(d)
                    );
                }
                var y = u(1),
                    l = 'undefined' !== typeof window ? window : self;
                l.global = l;
                (function (d) {
                    d.currentFileString = '/current';
                    var e = 0,
                        f = 0,
                        k = {},
                        p = null;
                    Module.chunkMax = 200;
                    var m = function (a, b, c, h, g) {
                            var w = new XMLHttpRequest();
                            return CancellablePromise(
                                function (G, z) {
                                    w.open('GET', a, !0);
                                    w.responseType = 'arraybuffer';
                                    w.onerror = function () {
                                        z('Network error occurred');
                                    };
                                    w.onload = function () {
                                        if (206 === this.status && w.response.byteLength === c) {
                                            var J = new Int8Array(w.response);
                                            G(J);
                                        } else z('Download Failed');
                                    };
                                    var H = ['bytes=', b, '-', b + c - 1].join('');
                                    w.setRequestHeader('Range', H);
                                    g && (w.withCredentials = g);
                                    h &&
                                        Object.keys(h).forEach(function (J) {
                                            w.setRequestHeader(J, h[J]);
                                        });
                                    w.send();
                                },
                                function () {
                                    w.abort();
                                }
                            );
                        },
                        A = function (a) {
                            this.maxChunkNum = a;
                            this.lruList = [];
                            this.chunkMap = {};
                        };
                    A.prototype = {
                        has: function (a) {
                            return a in this.chunkMap;
                        },
                        insert: function (a, b) {
                            this.lruList.length >= this.maxChunkNum &&
                                (delete this.chunkMap[this.lruList[0]], this.lruList.shift());
                            this.lruList.push(b);
                            this.chunkMap[b] = a;
                        },
                        get: function (a) {
                            var b = this.lruList.lastIndexOf(a);
                            0 <= b && this.lruList.splice(b, 1);
                            this.lruList.push(a);
                            return this.chunkMap[a];
                        }
                    };
                    var q = function (a) {
                        this.file = a;
                        this.filePosition = 0;
                        this.fileLength = a.size;
                        this.chunkSize = 1048576;
                        this.chunkCache = new A(8);
                        this.reader = new FileReaderSync();
                    };
                    q.prototype = {
                        read: function (a, b, c) {
                            c = this.filePosition + c <= this.fileLength ? c : this.fileLength - this.filePosition;
                            a = a.subarray(b, b + c);
                            b = c;
                            for (
                                var h = this.filePosition % this.chunkSize, g = this.filePosition - h, w = 0;
                                0 < c;

                            ) {
                                if (this.chunkCache.has(g)) var G = this.chunkCache.get(g);
                                else
                                    (G = new Int8Array(
                                        this.reader.readAsArrayBuffer(this.file.slice(g, g + this.chunkSize))
                                    )),
                                        this.chunkCache.insert(G, g);
                                var z = G.length,
                                    H = h + c;
                                H <= z
                                    ? (a.set(G.subarray(h, H), w), (this.filePosition += c), (c = 0))
                                    : (a.set(G.subarray(h), w),
                                      (this.filePosition += z - h),
                                      (h = 0),
                                      (g = this.filePosition),
                                      (c = H - z),
                                      (w = b - c));
                            }
                            return b;
                        },
                        seek: function (a) {
                            this.filePosition = a;
                        },
                        close: function () {
                            this.reader = this.file = null;
                        },
                        getPos: function () {
                            return this.filePosition;
                        },
                        getTotalSize: function () {
                            return this.fileLength;
                        }
                    };
                    var t = function (a) {
                        this.data = a;
                        this.position = 0;
                        this.length = this.data.length;
                    };
                    t.prototype = {
                        read: function (a, b, c) {
                            c = this.position + c <= this.length ? c : this.length - this.position;
                            a = a.subarray(b, b + c);
                            b = this.data.subarray(this.position, this.position + c);
                            a.set(b);
                            this.position += c;
                            return c;
                        },
                        write: function (a, b, c) {
                            c = this.position + c <= this.length ? c : this.length - this.position;
                            a = a.subarray(b, b + c);
                            this.data.subarray(this.position, this.position + c).set(a);
                            this.position += c;
                            return c;
                        },
                        seek: function (a) {
                            this.position = a;
                        },
                        close: function () {
                            this.data = null;
                        },
                        getPos: function () {
                            return this.position;
                        },
                        getTotalSize: function () {
                            return this.length;
                        }
                    };
                    var B = function (a, b, c, h, g) {
                        'object' === r(a)
                            ? ((this.lruList = a.lruList),
                              (this.chunkMap = a.chunkMap),
                              (this.length = a.length),
                              (this.url = a.url),
                              (this.customHeaders = a.customHeaders),
                              (this.withCredentials = a.withCredentials))
                            : ((this.lruList = []),
                              (this.chunkMap = {}),
                              (this.chunkMap[b] = g),
                              (this.length = b),
                              (this.url = a),
                              (this.customHeaders = c),
                              (this.withCredentials = h));
                    };
                    B.prototype = {
                        lruUpdate: function (a) {
                            var b = this.lruList.lastIndexOf(a);
                            0 <= b && this.lruList.splice(b, 1);
                            this.lruList.push(a);
                        },
                        getChunk: function (a) {
                            var b = this;
                            if (this.chunkMap[a]) this.lruUpdate(a);
                            else {
                                var c = Math.min(a + 1048576, this.length) - 1,
                                    h = new XMLHttpRequest();
                                h.open('GET', this.url, !1);
                                h.responseType = 'arraybuffer';
                                h.setRequestHeader('Range', ['bytes=', a, '-', c].join(''));
                                this.withCredentials && (h.withCredentials = this.withCredentials);
                                this.customHeaders &&
                                    Object.keys(this.customHeaders).forEach(function (g) {
                                        h.setRequestHeader(g, b.customHeaders[g]);
                                    });
                                h.send();
                                if (200 === h.status || 206 === h.status) this.writeChunk(new Int8Array(h.response), a);
                                else throw Error('Failed to load data from');
                            }
                            return this.chunkMap[a];
                        },
                        hadChunk: function (a) {
                            return a in this.chunkMap;
                        },
                        hasChunk: function (a) {
                            return this.chunkMap[a];
                        },
                        getCacheData: function () {
                            return this.chunkMap[this.length];
                        },
                        getRequiredChunkOffsetArrays: function (a, b) {
                            var c = { have: [], downloading: [], missing: [] };
                            try {
                                var h = Module.stackSave();
                                var g = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                                REX(Module._TRN_DownloaderGetRequiredChunksSize(a, b, g));
                                var w = Module.getValue(g, 'i8*');
                                if (w) {
                                    var G = Module._malloc(4 * w);
                                    REX(Module._TRN_DownloaderGetRequiredChunks(a, b, G, w));
                                    for (a = 0; a < w; ++a) {
                                        var z = Module.getValue(G + 4 * a, 'i8*');
                                        this.hasChunk(z)
                                            ? c.have.push(z)
                                            : this.hadChunk(z)
                                            ? c.missing.push(z)
                                            : c.downloading.push(z);
                                    }
                                }
                            } finally {
                                G && Module._free(G), Module.stackRestore(h);
                            }
                            return c;
                        },
                        keepVisibleChunks: function (a, b) {
                            for (var c = b.length, h = Module.chunkMax / 2, g = 0, w = 0; w < c; ++w) {
                                var G = this.getRequiredChunkOffsetArrays(a, b[w]),
                                    z = G.have,
                                    H = z.length;
                                g += H;
                                if (g > h) {
                                    this.keepChunks(z.slice(0, H - g + h));
                                    break;
                                }
                                this.keepChunks(G.have);
                            }
                        },
                        getChunkAsync: function (a) {
                            var b = this,
                                c = a + 1048576,
                                h = 1048576;
                            c > this.length && (h -= c - this.length);
                            return m(this.url, a, h, this.customHeaders, this.withCredentials).then(function (g) {
                                b.writeChunk(g, a);
                            });
                        },
                        getChunks: function (a) {
                            for (var b = a.length, c = Array(b), h = 0; h < b; ++h) c[h] = this.getChunkAsync(a[h]);
                            return CancellablePromise.all(c);
                        },
                        keepChunks: function (a) {
                            for (var b = a.length, c = 0; c < b; ++c) this.lruUpdate(a[c]);
                        },
                        writeChunk: function (a, b, c) {
                            c = c || 0;
                            var h = this.chunkMap[b],
                                g = a.length,
                                w = this.lruList.length >= Module.chunkMax && !h;
                            1048576 !== g || a.buffer.byteLength !== g
                                ? (w
                                      ? ((h = this.lruList.shift()),
                                        (w = this.chunkMap[h]),
                                        1048576 > w.length && (w = new Int8Array(1048576)),
                                        (this.chunkMap[h] = null))
                                      : (w = h ? this.chunkMap[b] : new Int8Array(1048576)),
                                  w.subarray(c, c + g).set(a),
                                  (a = w))
                                : w && ((h = this.lruList.shift()), (this.chunkMap[h] = null));
                            this.lruUpdate(b);
                            this.chunkMap[b] = a;
                        }
                    };
                    var D = function (a) {
                        this.chunkStorage = a;
                        this.position = 0;
                        this.length = this.chunkStorage.length;
                    };
                    D.prototype = {
                        read: function (a, b, c) {
                            var h = this.position + c <= this.length,
                                g = h ? c : this.length - this.position;
                            if (this.position < this.length) {
                                var w;
                                for (w = 0; w < g; ) {
                                    var G = this.position % 1048576;
                                    var z = this.position - G;
                                    var H = g - w,
                                        J = a.subarray(b + w, b + w + H);
                                    if (this.chunkStorage.hadChunk(z))
                                        (z = this.chunkStorage.getChunk(z).subarray(G, G + H)),
                                            J.set(z),
                                            (J = z.length),
                                            (w += J),
                                            (this.position += J);
                                    else for (this.position += H; w < g; ++w) J[w] = 0;
                                }
                            }
                            if (!h) {
                                b += g;
                                if ((c -= g))
                                    (h = this.chunkStorage.getCacheData()),
                                        c > h.length && (c = h.length),
                                        (w = this.position - this.length),
                                        (a = a.subarray(b, b + c)),
                                        (z = h.subarray(w, w + c)),
                                        a.set(z);
                                this.position += c;
                                return g + c;
                            }
                            return g;
                        },
                        write: function (a, b, c) {
                            var h = this.position + c <= this.length,
                                g = this.position + c <= this.length ? c : this.length - this.position,
                                w = a.subarray(b, b + g),
                                G = this.position % 1048576;
                            this.chunkStorage.writeChunk(w, this.position - G, G);
                            this.position += g;
                            if (!h) {
                                w = b + g;
                                if ((c -= g))
                                    (b = this.chunkStorage.getCacheData()),
                                        c > b.length && (c = b.length),
                                        (h = this.position - this.length),
                                        (w = a.subarray(w, w + c)),
                                        b.subarray(h, h + c).set(w);
                                this.position += c;
                                return g + c;
                            }
                            return g;
                        },
                        seek: function (a) {
                            this.position = a;
                        },
                        close: function () {
                            this.chunkStorage = null;
                        },
                        getPos: function () {
                            return this.position;
                        },
                        getTotalSize: function () {
                            return this.length;
                        }
                    };
                    var I = function (a) {
                        this.docId = a;
                        this.length = 0;
                        this.data = new Int8Array(8192);
                        this.position = 0;
                    };
                    I.prototype = {
                        seek: function (a) {
                            this.position = a;
                        },
                        close: function () {
                            var a = new Int8Array(this.data.buffer.slice(0, this.length));
                            Module.ChangeDocBackend(this.docId, { ptr: Module.GetDoc(this.docId), buffer: a });
                            this.data = null;
                        },
                        getPos: function () {
                            return this.position;
                        },
                        getTotalSize: function () {
                            return this.length;
                        },
                        read: function (a, b, c) {
                            var h = this.data.length;
                            c = c + b < h ? c : h - b;
                            a = a.subarray(b, b + c);
                            b = this.data.subarray(this.position, this.position + c);
                            a.set(b);
                            this.position += c;
                            return c;
                        },
                        write: function (a, b, c) {
                            for (var h = this.position + c, g = this.data.length; h > g; ) {
                                g = Math.max(g * (16777216 < g ? 1.5 : 2), h);
                                var w = new Int8Array(g);
                                w.set(this.data.subarray(0, this.length), 0);
                                this.data = w;
                            }
                            a = a.subarray(b, b + c);
                            this.data.set(a, this.position);
                            this.position += c;
                            this.position > this.length && (this.length = this.position);
                            return c;
                        }
                    };
                    var C = {
                        IsSink: function (a) {
                            return 66 === (a.flags & 255);
                        },
                        open: function (a) {
                            var b = a.path.slice(1);
                            this.IsSink(a)
                                ? ((a.provider = new I(b)), (Module.docs[b].sink = a.provider))
                                : (a.provider = Module.docs[b].sink
                                      ? new t(Module.docs[b].sink.data)
                                      : Module.docs[b].chunkStorage
                                      ? new D(Module.docs[b].chunkStorage)
                                      : Module.docs[b].buffer
                                      ? new t(Module.docs[b].buffer)
                                      : new q(Module.docs[b].file));
                        },
                        close: function (a) {
                            a.provider.close();
                        },
                        read: function (a, b, c, h, g) {
                            return a.provider.read(b, c, h);
                        },
                        llseek: function (a, b, c) {
                            a = a.provider;
                            1 === c ? (b += a.getPos()) : 2 === c && (b = a.getTotalSize() + b);
                            if (0 > b) throw new FS.ErrnoError(l.ERRNO_CODES.EINVAL);
                            a.seek(b);
                            return b;
                        },
                        write: function (a, b, c, h, g) {
                            return h ? a.provider.write(b, c, h) : 0;
                        }
                    };
                    l.THROW = function (a) {
                        throw { type: 'PDFWorkerError', message: a };
                    };
                    var E = function (a) {
                        return 'Exception: \n\t Message: '
                            .concat(d.GetJSStringFromCString(Module._TRN_GetMessage(a)), '\n\t Filename: ')
                            .concat(d.GetJSStringFromCString(Module._TRN_GetFileName(a)), '\n\t Function: ')
                            .concat(d.GetJSStringFromCString(Module._TRN_GetFunction(a)), '\n\t Linenumber: ')
                            .concat(d.GetJSStringFromCString(Module._TRN_GetLineNum(a)));
                    };
                    d.GetErrToString = E;
                    l.REX = function (a) {
                        a && THROW(E(a));
                    };
                    d.Initialize = function (a) {
                        var b = Module.stackSave();
                        a = a ? Module.allocate(Module.intArrayFromString(a), 'i8', Module.ALLOC_STACK) : 0;
                        REX(Module._TRN_PDFNetInitialize(a));
                        Module.stackRestore(b);
                    };
                    d.GetDoc = function (a) {
                        if (a in Module.docs) return Module.docs[a].ptr;
                        throw {
                            type: 'InvalidDocReference',
                            message: 'Unable to access Document id='.concat(
                                a,
                                '. The document appears to be invalid or was deleted.'
                            )
                        };
                    };
                    d.clearDocBackend = function () {
                        null !== Module.cachePtr
                            ? (Module.hasBufOwnership && Module._free(Module.cachePtr), (Module.cachePtr = null))
                            : Module.docs[d.currentFileString] && delete Module.docs[d.currentFileString];
                    };
                    d.MakeDev = function (a) {
                        if (!k[a]) {
                            var b = FS.makedev(3, 5);
                            FS.registerDevice(b, C);
                            FS.mkdev(a, 511, b);
                            k[a] = !0;
                        }
                    };
                    d.CreateDocFileBackend = function (a, b) {
                        Module.MakeDev(b);
                        var c = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        Module.docs[b] = { file: a };
                        a = Module.allocate(Module.intArrayFromString(b), 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_PDFDocCreateFromFilePath(a, c));
                        c = Module.getValue(c, 'i8*');
                        Module.docs[b].ptr = c;
                    };
                    d.InsertImageIntoDoc = function (a, b, c) {
                        var h = [];
                        try {
                            var g = Module.ElementBuilderCreate();
                            h.push(function () {
                                Module.ElementBuilderDestroy(g);
                            });
                            var w = Module.ElementWriterCreate();
                            h.push(function () {
                                Module.ElementWriterDestroy(w);
                            });
                            if (c) {
                                var G = c.width;
                                var z = c.height;
                            } else
                                (G = Module.ImageGetImageWidth(b)),
                                    (z = Module.ImageGetImageHeight(b)),
                                    (c = G / z),
                                    c > 612 / 792
                                        ? ((G = 612), (z = parseInt(G / c, 10)))
                                        : ((z = 792), (G = parseInt(z * c, 10)));
                            var H = Module.ElementBuilderCreateImage(g, b, 0, 0, G, z),
                                J = Module.PDFDocPageCreate(a, G, z);
                            Module.ElementWriterBegin(w, J);
                            Module.ElementWriterWritePlacedElement(w, H);
                            Module.ElementWriterEnd(w);
                            Module.PDFDocPagePushBack(a, J);
                        } finally {
                            h.reverse().forEach(function (L) {
                                L();
                            });
                        }
                    };
                    var F = function (a, b, c) {
                        'object' === r(a)
                            ? ((this.m_pages = a.m_pages),
                              (this.m_has_named_dests = a.m_has_named_dests),
                              (this.m_finished_download = a.m_finished_download),
                              (this.m_has_outline = a.m_has_outline),
                              (this.m_current_page = a.m_current_page),
                              (this.m_id = a.m_id),
                              (this.size = a.size),
                              (this.timeout = a.timeout),
                              (this.eventPageArray = a.eventPageArray),
                              (this.requirePageCallbacks = a.requirePageCallbacks))
                            : ((this.m_pages = []),
                              (this.m_has_outline = this.m_finished_download = this.m_has_named_dests = !1),
                              (this.m_current_page = 1),
                              (this.m_id = c),
                              (this.size = a),
                              (this.timeout = null),
                              (this.eventPageArray = []),
                              (this.requirePageCallbacks = {}));
                        this.downloadUserData = Module.createDownloadUserData(b, c);
                    };
                    F.prototype = {
                        getJSUrl: function () {
                            return Module.extractDownloadUserData(this.downloadUserData).url;
                        },
                        getDocId: function () {
                            return Module.extractDownloadUserData(this.downloadUserData).docId;
                        },
                        destroyUserData: function () {
                            this.m_id in Module.withCredentials && delete Module.withCredentials[this.m_id];
                            this.m_id in Module.customHeadersMap && delete Module.customHeadersMap[this.m_id];
                            Module.destroyDownloadUserData(this.downloadUserData);
                        }
                    };
                    d.createDownloadUserData = function (a, b) {
                        a = Module.allocate(Module.intArrayFromString(a), 'i8', Module.ALLOC_NORMAL);
                        var c = Module.allocate(8, 'i8', Module.ALLOC_NORMAL);
                        Module.setValue(c, a, 'i8*');
                        Module.setValue(c + 4, parseInt(b, 10), 'i32');
                        return (this.downloadUserData = c);
                    };
                    d.extractDownloadUserData = function (a) {
                        var b = Module.getValue(a, 'i8*');
                        b = d.GetJSStringFromCString(b);
                        a = Module.getValue(a + 4, 'i32').toString();
                        return { url: b, docId: a };
                    };
                    d.destroyDownloadUserData = function (a) {
                        Module._free(Module.getValue(a, 'i8*'));
                        Module._free(a);
                    };
                    l.downloadDataMap = {};
                    Module.customHeadersMap = {};
                    Module.withCredentials = {};
                    d.GetDownloadData = function (a) {
                        if (a in downloadDataMap) return downloadDataMap[a];
                    };
                    d.DownloaderHint = function (a, b) {
                        var c = Module.GetDoc(a),
                            h = downloadDataMap[c];
                        b.currentPage && (h.m_current_page = b.currentPage);
                        if (b.visiblePages) {
                            var g = b.visiblePages;
                            for (b = 0; b < g.length; ++b) ++g[b];
                            Object.keys(h.requirePageCallbacks).forEach(function (G) {
                                h.requirePageCallbacks.hasOwnProperty(G) && g.push(parseInt(G, 10));
                            });
                            (b = Module.docs[a].chunkStorage) && b.keepVisibleChunks(h.downloader, g);
                            a = g.length;
                            var w = Module.allocate(4 * a, 'i8', Module.ALLOC_STACK);
                            for (b = 0; b < a; ++b) Module.setValue(w + 4 * b, g[b], 'i32');
                            REX(Module._TRN_PDFDocDownloadPages(c, w, a, 1, 0));
                        }
                    };
                    d.RequirePage = function (a, b) {
                        return new Promise(function (c, h) {
                            h = Module.GetDoc(a);
                            var g = downloadDataMap[h];
                            !g || g.m_finished_download || g.m_pages[b]
                                ? c()
                                : (b in g.requirePageCallbacks
                                      ? g.requirePageCallbacks[b].push(c)
                                      : (g.requirePageCallbacks[b] = [c]),
                                  (c = Module.allocate(4, 'i8', Module.ALLOC_STACK)),
                                  Module.setValue(c, b, 'i32'),
                                  Module._TRN_PDFDocDownloadPages(h, c, 1, 0, 0));
                        });
                    };
                    d.IsLinearizationValid = function (a) {
                        a = Module.GetDoc(a);
                        if ((a = downloadDataMap[a])) {
                            var b = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                            REX(Module._TRN_DownloaderIsLinearizationValid(a.downloader, b));
                            return 0 !== Module.getValue(b, 'i8');
                        }
                        return !1;
                    };
                    d.ShouldRunRender = function (a, b) {
                        a = Module.GetDoc(a);
                        return (a = downloadDataMap[a]) ? (a.m_finished_download ? !0 : a.m_pages[b]) : !0;
                    };
                    d.postPagesDownloadedEvent = function (a, b, c) {
                        a = { pageDimensions: Module.GetPageDimensionsContentChangedList(a, c), pageNumbers: c };
                        Module.postEvent(b, 'pagesDownloaded', a);
                        return a;
                    };
                    d.createCallbacksStruct = function (a) {
                        if (!p) {
                            var b = function (c) {
                                return function (h) {
                                    var g = arguments;
                                    h in downloadDataMap
                                        ? c.apply(this, g)
                                        : n(function () {
                                              h in downloadDataMap && c.apply(this, g);
                                          }, 0);
                                };
                            };
                            p = {
                                downloadProc: Module.addFunction(function (c, h, g, w, G) {
                                    w = Module.extractDownloadUserData(w);
                                    var z = w.docId;
                                    m(w.url, h, g, Module.customHeadersMap[z], Module.withCredentials[z]).then(
                                        function (H) {
                                            z in Module.docs &&
                                                Module.docs[z].chunkStorage &&
                                                Module.docs[z].chunkStorage.writeChunk(H, h);
                                            Module._TRN_DownloadComplete(0, h, g, c);
                                        }
                                    );
                                }, 'viiiii'),
                                notifyUpdatePage: Module.addFunction(
                                    b(function (c, h, g, w) {
                                        var G = downloadDataMap[c];
                                        G.m_pages[h] = !0;
                                        var z = G.eventPageArray;
                                        if (h in G.requirePageCallbacks)
                                            for (g = G.requirePageCallbacks[h], w = 0; w < g.length; ++w) g[w]();
                                        G.timeout
                                            ? z.push(h)
                                            : ((z = G.eventPageArray = [h]),
                                              (G.timeout = setTimeout(function () {
                                                  Module.postPagesDownloadedEvent(c, G.m_id, z);
                                                  G.timeout = null;
                                              }, 100)));
                                    }),
                                    'viiii'
                                ),
                                notifyUpdateOutline: Module.addFunction(
                                    b(function (c, h) {
                                        c = downloadDataMap[c];
                                        c.m_has_outline ||
                                            ((c.m_has_outline = !0), Module.postEvent(c.m_id, 'bookmarksUpdated', {}));
                                    }),
                                    'vii'
                                ),
                                notifyUpdateNamedDests: Module.addFunction(
                                    b(function (c, h) {
                                        c = downloadDataMap[c];
                                        c.m_has_named_dests || (c.m_has_named_dests = !0);
                                    }),
                                    'vii'
                                ),
                                notifyUpdateThumb: Module.addFunction(
                                    b(function (c, h) {}),
                                    'viiii'
                                ),
                                notifyFinishedDownload: Module.addFunction(
                                    b(function (c, h) {
                                        c = downloadDataMap[c];
                                        c.m_finished_download ||
                                            ((c.m_finished_download = !0),
                                            Module.postEvent(c.m_id, 'documentComplete', {}));
                                    }),
                                    'vii'
                                ),
                                notifyDocumentError: Module.addFunction(function (c, h) {}, 'viii'),
                                getCurrentPage: Module.addFunction(function (c, h) {
                                    return downloadDataMap[c].m_current_page;
                                }, 'iii')
                            };
                        }
                        b = Module.allocate(40, 'i8', Module.ALLOC_STACK);
                        Module.setValue(b, p.downloadProc, 'i8*');
                        Module.setValue(b + 4, a, 'i8*');
                        Module.setValue(b + 8, p.notifyUpdatePage, 'i8*');
                        Module.setValue(b + 12, p.notifyUpdateOutline, 'i8*');
                        Module.setValue(b + 16, p.notifyUpdateNamedDests, 'i8*');
                        Module.setValue(b + 20, p.notifyUpdateThumb, 'i8*');
                        Module.setValue(b + 24, p.notifyFinishedDownload, 'i8*');
                        Module.setValue(b + 28, p.notifyDocumentError, 'i8*');
                        Module.setValue(b + 32, p.getCurrentPage, 'i8*');
                        Module.setValue(b + 36, 0, 'i8*');
                        return b;
                    };
                    d.CreateDocDownloaderBackend = function (a, b, c) {
                        var h = a.url,
                            g = a.size,
                            w = a.customHeaders,
                            G = a.withCredentials,
                            z = a.shouldUseMinimumDownloads;
                        w && (Module.customHeadersMap[c] = w);
                        G && (Module.withCredentials[c] = G);
                        var H = a.downloadData ? new F(a.downloadData, h, c, w, G) : new F(a.size, h, c, w, G);
                        var J = Module.createCallbacksStruct(H.downloadUserData),
                            L = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        Module.MakeDev(c);
                        a.chunkStorage
                            ? (h = new B(a.chunkStorage))
                            : ((a = new Int8Array(new ArrayBuffer(Math.ceil((a.size + 1048576 - 1) / 1048576 / 8)))),
                              (h = new B(h, g, w, G, a)));
                        Module.docs[c] = { chunkStorage: h };
                        REX(Module._TRN_DownloaderCreate(J, g, Module.GetUStringFromJSString(c), z, L));
                        H.downloader = Module.getValue(L, 'i8*');
                        if ((g = Module._TRN_PDFDocCreateFromFilter(H.downloader, b)))
                            Module._TRN_FilterDestroy(H.downloader), REX(g);
                        b = Module.getValue(b, 'i8*');
                        Module.docs[c].ptr = b;
                        Module.PDFDocInitSecurityHandler(b) &&
                            REX(Module._TRN_PDFDocDownloaderInitialize(b, H.downloader));
                        downloadDataMap[b] = H;
                    };
                    d.CreateDocBackend = function (a, b) {
                        var c = a.value,
                            h = a.extension,
                            g = a.type,
                            w = Module.allocate(4, 'i8', Module.ALLOC_STACK),
                            G = Module.stackSave();
                        try {
                            if (c)
                                if ('ptr' === g) Module.docs[b] = { ptr: c };
                                else {
                                    c.shouldUseMinimumDownloads = a.shouldUseMinimumDownloads;
                                    var z = 'object' === r(c) && c.url;
                                    g = h && 'pdf' !== h;
                                    if (z) d.CreateDocDownloaderBackend(c, w, b);
                                    else {
                                        var H = c instanceof ArrayBuffer;
                                        z = H ? 'buffer' : 'file';
                                        if (H && ((c = new Uint8Array(c)), 10485760 > c.length + e && !g)) {
                                            e += c.length;
                                            var J = c.length,
                                                L = Module._malloc(c.length);
                                            Module.HEAPU8.set(c, L);
                                            REX(Module._TRN_PDFDocCreateFromBuffer(L, J, w));
                                            var K = Module.getValue(w, 'i8*');
                                            Module.docs[b] = { ptr: K, bufPtr: L, bufPtrSize: J, ownership: !0 };
                                            Module.docs[b].extension = h;
                                            return;
                                        }
                                        Module.MakeDev(b);
                                        H = {};
                                        H[z] = c;
                                        Module.docs[b] = H;
                                        if (g) {
                                            if (a.pageSizes && a.pageSizes.length) var O = a.pageSizes[0];
                                            else a.defaultPageSize && (O = a.defaultPageSize);
                                            var M = Module.GetUStringFromJSString(b);
                                            REX(Module._TRN_PDFDocCreate(w));
                                            K = Module.getValue(w, 'i8*');
                                            var P = Module.ImageCreateFromFile(K, M);
                                            Module.InsertImageIntoDoc(K, P, O);
                                        } else {
                                            var Q = Module.allocate(
                                                Module.intArrayFromString(b),
                                                'i8',
                                                Module.ALLOC_STACK
                                            );
                                            REX(Module._TRN_PDFDocCreateFromFilePath(Q, w));
                                            K = Module.getValue(w, 'i8*');
                                        }
                                        Module.docs[b].extension = h;
                                        Module.docs[b].ptr = K;
                                    }
                                }
                            else
                                REX(Module._TRN_PDFDocCreate(w)),
                                    (K = Module.getValue(w, 'i8*')),
                                    (Module.docs[b] = { ptr: K }),
                                    (Module.docs[b].extension = h);
                        } finally {
                            Module.stackRestore(G);
                        }
                    };
                    d.ChangeDocBackend = function (a, b) {
                        var c = Module.docs[a];
                        c
                            ? (c.bufPtr && c.ownership && (Module._free(c.bufPtr), (e -= c.bufPtrSize)),
                              delete Module.docs[a])
                            : Object(y.d)('Trying to delete document '.concat(a, ' that does not exist.'));
                        Module.docs[a] = b;
                    };
                    d.DeleteDoc = function (a) {
                        var b = Module.docs[a];
                        b
                            ? (b.ptr &&
                                  (b.ptr in downloadDataMap &&
                                      (clearTimeout(downloadDataMap[b.ptr].timeout),
                                      downloadDataMap[b.ptr].destroyUserData(),
                                      delete downloadDataMap[b.ptr]),
                                  Module.PDFDocDestroy(b.ptr)),
                              b.bufPtr && b.ownership && (Module._free(b.bufPtr), (e -= b.bufPtrSize)),
                              delete Module.docs[a])
                            : Object(y.d)('Trying to delete document '.concat(a, ' that does not exist.'));
                    };
                    d.CreateDoc = function (a, b) {
                        if ('id' === a.type) return Module.docPtrStringToIdMap[a.value];
                        if (!b) {
                            do b = (++f).toString();
                            while (b in Module.docs);
                        }
                        Module.hasBufOwnership = !0;
                        d.CreateDocBackend(a, b);
                        return b;
                    };
                    d.CreateEmptyDoc = function () {
                        var a = (++f).toString(),
                            b = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_PDFDocCreate(b));
                        b = Module.getValue(b, 'i8*');
                        Module.docs[a] = { ptr: b };
                        return a;
                    };
                    d.PDFDocCreateFromLayoutEls = function (a) {
                        var b = new Uint8Array(a);
                        a = Module._malloc(b.length);
                        var c = Module.stackSave(),
                            h = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        Module.HEAPU8.set(b, a);
                        b = Module._TRN_PDFDocCreateFromLayoutEls(a, b.length, h);
                        h = Module.getValue(h, 'i8*');
                        Module._free(a);
                        Module.stackRestore(c);
                        REX(b);
                        return h;
                    };
                    d.GetPageCount = function (a) {
                        var b = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_PDFDocGetPageCount(a, b));
                        return Module.getValue(b, 'i8*');
                    };
                    d.GetPage = function (a, b) {
                        var c = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_PDFDocGetPage(a, b, c));
                        a = Module.getValue(c, 'i8*');
                        Module.PageIsValid(a) || THROW("Trying to access page that doesn't exist at index ".concat(b));
                        return a;
                    };
                    d.PageGetPageWidth = function (a) {
                        var b = Module.allocate(8, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_PageGetPageWidth(a, 1, b));
                        return Module.getValue(b, 'double');
                    };
                    d.PageGetPageHeight = function (a) {
                        var b = Module.allocate(8, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_PageGetPageHeight(a, 1, b));
                        return Module.getValue(b, 'double');
                    };
                    d.PageGetDefaultMatrix = function (a, b) {
                        var c = Module.allocate(48, 'i8', Module.ALLOC_STACK);
                        b || (b = 0);
                        REX(Module._TRN_PageGetDefaultMatrix(a, !0, 1, b, c));
                        return c;
                    };
                    d.GetMatrixAsArray = function (a) {
                        for (var b = [], c = 0; 6 > c; ++c) b[c] = Module.getValue(a + 8 * c, 'double');
                        return b;
                    };
                    d.PageGetPageInfo = function (a) {
                        var b = Module.allocate(48, 'i8', Module.ALLOC_STACK),
                            c = Module.allocate(8, 'i8', Module.ALLOC_STACK),
                            h = Module.allocate(8, 'i8', Module.ALLOC_STACK),
                            g = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_PageGetPageInfo(a, !0, 1, 0, c, h, b, g));
                        return {
                            rotation: Module.getValue(g, 'i8*'),
                            width: Module.getValue(c, 'double'),
                            height: Module.getValue(h, 'double'),
                            matrix: Module.GetMatrixAsArray(b)
                        };
                    };
                    d.GetUStringFromJSString = function (a, b) {
                        var c = Module.allocate(4, 'i8', Module.ALLOC_STACK),
                            h = 2 * (a.length + 1),
                            g = Module.allocate(h, 'i8', b ? Module.ALLOC_NORMAL : Module.ALLOC_STACK);
                        Module.stringToUTF16(a, g, h);
                        a = Module._TRN_UStringCreateFromString(g, c);
                        b && Module._free(g);
                        REX(a);
                        return Module.getValue(c, 'i8*');
                    };
                    d.GetJSStringFromUString = function (a) {
                        var b = Module.allocate(4, 'i16*', Module.ALLOC_STACK);
                        REX(Module._TRN_UStringCStr(a, b));
                        return Module.UTF16ToString(Module.getValue(b, 'i16*'));
                    };
                    d.GetJSStringFromCString = function (a) {
                        return Module.UTF8ToString(a);
                    };
                    d.PDFNetSetResourceData = function (a) {
                        Module.res_ptr = Module._malloc(a.length);
                        Module.HEAPU8.set(a, Module.res_ptr);
                        REX(Module._TRN_PDFNetSetResourceData(Module.res_ptr, a.length));
                        Module.res_ptr_size = a.length;
                    };
                    d.PDFDocDestroy = function (a) {
                        REX(Module._TRN_PDFDocDestroy(a));
                    };
                    d.VectorGetSize = function (a) {
                        var b = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_VectorGetSize(a, b));
                        return Module.getValue(b, 'i32');
                    };
                    d.VectorGetAt = function (a, b) {
                        var c = Module.allocate(1, 'i8*', Module.ALLOC_STACK);
                        REX(Module._TRN_VectorGetAt(a, b, c));
                        return Module.getValue(c, 'i8*');
                    };
                    d.VectorDestroy = function (a) {
                        REX(Module._TRN_VectorDestroy(a));
                    };
                    d.PDFRasterizerCreate = function () {
                        var a = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_PDFRasterizerCreate(0, a));
                        return Module.getValue(a, 'i8*');
                    };
                    d.ExtractSeparationData = function (a) {
                        var b = Module.getValue(a, 'i8*'),
                            c = Module.getValue(a + 4, 'i32'),
                            h = Module.getValue(a + 8, 'i8*'),
                            g = Module.HEAPU8[a + 12],
                            w = Module.HEAPU8[a + 13],
                            G = Module.HEAPU8[a + 14];
                        a = Module.HEAPU8[a + 15];
                        var z = new Uint8Array(c);
                        z.set(Module.HEAPU8.subarray(b, b + c));
                        b = Module.GetJSStringFromUString(h);
                        return { color: [g, w, G, a], data: z.buffer, name: b };
                    };
                    d.PDFRasterizerRasterizeSeparations = function (a, b, c, h, g, w, G) {
                        var z = Module.allocate(8, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_PDFRasterizerRasterizeSeparations(a, b, c, h, g, w, G, z));
                        a = Module.getValue(z, 'i8*');
                        b = Module.VectorGetSize(a);
                        c = Array(b);
                        for (h = 0; h < b; ++h)
                            (g = Module.VectorGetAt(a, h)), (c[h] = Module.ExtractSeparationData(g));
                        Module.VectorDestroy(a);
                        return c;
                    };
                    d.PageGetRotation = function (a) {
                        var b = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_PageGetRotation(a, b));
                        return Module.getValue(b, 'i8*');
                    };
                    d.PageGetId = function (a) {
                        var b = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_PageGetSDFObj(a, b));
                        b = Module.getValue(b, 'i8*');
                        a = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_ObjGetObjNum(b, a));
                        a = Module.getValue(a, 'i32');
                        var c = Module.allocate(2, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_ObjGetGenNum(b, c));
                        c = Module.getValue(c, 'i16');
                        return ''.concat(a, '-').concat(c);
                    };
                    d.PageSetRotation = function (a, b) {
                        REX(Module._TRN_PageSetRotation(a, b));
                    };
                    d.GetDefaultMatrixBox = function (a, b, c) {
                        var h = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_PageGetRotation(a, h));
                        a = (Module.getValue(h, 'i32') + c) % 4;
                        c = Module.allocate(48, 'i8', Module.ALLOC_STACK);
                        switch (a) {
                            case 0:
                                return REX(Module._TRN_Matrix2DSet(c, 1, 0, 0, -1, -b.x1, b.y2)), c;
                            case 1:
                                return REX(Module._TRN_Matrix2DSet(c, 0, 1, 1, 0, -b.y1, -b.x1)), c;
                            case 2:
                                return REX(Module._TRN_Matrix2DSet(c, -1, 0, 0, 1, b.x2, -b.y1)), c;
                            case 3:
                                return REX(Module._TRN_Matrix2DSet(c, 0, -1, -1, 0, b.y2, b.x2)), c;
                        }
                        throw Error("Yikes, we don't support that rotation type");
                    };
                    d.Matrix2DMultBBox = function (a, b) {
                        var c = Module.allocate(8, 'i8', Module.ALLOC_STACK),
                            h = Module.allocate(8, 'i8', Module.ALLOC_STACK);
                        Module.setValue(c, b.x1, 'double');
                        Module.setValue(h, b.y1, 'double');
                        REX(Module._TRN_Matrix2DMult(a, c, h));
                        b.x1 = Module.getValue(c, 'double');
                        b.y1 = Module.getValue(h, 'double');
                        Module.setValue(c, b.x2, 'double');
                        Module.setValue(h, b.y2, 'double');
                        REX(Module._TRN_Matrix2DMult(a, c, h));
                        b.x2 = Module.getValue(c, 'double');
                        b.y2 = Module.getValue(h, 'double');
                        return b;
                    };
                    d.Matrix2DMult = function (a, b) {
                        var c = Module.allocate(8, 'i8', Module.ALLOC_STACK),
                            h = Module.allocate(8, 'i8', Module.ALLOC_STACK);
                        Module.setValue(c, b.x, 'double');
                        Module.setValue(h, b.y, 'double');
                        REX(Module._TRN_Matrix2DMult(a, c, h));
                        b.x = Module.getValue(c, 'double');
                        b.y = Module.getValue(h, 'double');
                        return b;
                    };
                    d.Matrix2DConcat = function (a, b) {
                        var c = Module.getValue(b, 'double'),
                            h = Module.getValue(b + 8, 'double'),
                            g = Module.getValue(b + 16, 'double'),
                            w = Module.getValue(b + 24, 'double'),
                            G = Module.getValue(b + 32, 'double');
                        b = Module.getValue(b + 40, 'double');
                        REX(Module._TRN_Matrix2DConcat(a, c, h, g, w, G, b));
                    };
                    d.Matrix2DSet = function (a, b, c, h, g, w, G) {
                        REX(Module._TRN_Matrix2DSet(a, b, c, h, g, w, G));
                    };
                    d.IteratorHasNext = function (a) {
                        var b = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_IteratorHasNext(a, b));
                        return 0 !== Module.getValue(b, 'i8');
                    };
                    d.IteratorCurrent = function (a) {
                        var b = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_IteratorCurrent(a, b));
                        return Module.getValue(Module.getValue(b, 'i8*'), 'i8*');
                    };
                    d.IteratorNext = function (a) {
                        REX(Module._TRN_IteratorNext(a));
                    };
                    d.PageGetNumAnnots = function (a) {
                        var b = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_PageGetNumAnnots(a, b));
                        return Module.getValue(b, 'i32');
                    };
                    d.PageGetAnnot = function (a, b) {
                        var c = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_PageGetAnnot(a, b, c));
                        return Module.getValue(c, 'i8*');
                    };
                    d.PageAnnotRemove = function (a, b) {
                        REX(Module._TRN_PageAnnotRemoveByIndex(a, b));
                    };
                    d.AnnotGetType = function (a) {
                        var b = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_AnnotGetType(a, b));
                        return Module.getValue(b, 'i32');
                    };
                    d.AnnotHasAppearance = function (a) {
                        var b = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_AnnotGetAppearance(a, 0, 0, b));
                        return 0 !== Module.getValue(b, 'i8*');
                    };
                    d.AnnotRefreshAppearance = function (a) {
                        REX(Module._TRN_AnnotRefreshAppearance(a));
                    };
                    d.ObjErase = function (a, b) {
                        b = Module.allocate(Module.intArrayFromString(b), 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_ObjEraseFromKey(a, b));
                    };
                    d.GetJSDoubleArrFromCore = function (a, b) {
                        for (var c = Array(b), h = 0; h < b; ++h) (c[h] = Module.getValue(a, 'double')), (a += 8);
                        return c;
                    };
                    d.GetJSIntArrayFromCore = function (a, b) {
                        for (var c = Array(b), h = 0; h < b; ++h) (c[h] = Module.getValue(a, 'i32')), (a += 4);
                        return c;
                    };
                    d.BookmarkIsValid = function (a) {
                        var b = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_BookmarkIsValid(a, b));
                        return 0 !== Module.getValue(b, 'i8');
                    };
                    d.BookmarkGetNext = function (a) {
                        var b = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_BookmarkGetNext(a, b));
                        return Module.getValue(b, 'i8*');
                    };
                    d.BookmarkGetFirstChild = function (a) {
                        var b = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_BookmarkGetFirstChild(a, b));
                        return Module.getValue(b, 'i8*');
                    };
                    d.BookmarkHasChildren = function (a) {
                        var b = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_BookmarkHasChildren(a, b));
                        return 0 !== Module.getValue(b, 'i8');
                    };
                    d.BookmarkGetAction = function (a) {
                        var b = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_BookmarkGetAction(a, b));
                        return Module.getValue(b, 'i8*');
                    };
                    d.BookmarkGetTitle = function (a) {
                        var b = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_BookmarkGetTitle(a, b));
                        a = Module.getValue(b, 'i8*');
                        return Module.GetJSStringFromUString(a);
                    };
                    d.ActionIsValid = function (a) {
                        var b = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_ActionIsValid(a, b));
                        return 0 !== Module.getValue(b, 'i8');
                    };
                    d.ActionGetType = function (a) {
                        var b = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_ActionGetType(a, b));
                        return Module.getValue(b, 'i32');
                    };
                    d.ActionGetDest = function (a) {
                        var b = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_ActionGetDest(a, b));
                        return Module.getValue(b, 'i8*');
                    };
                    d.DestinationIsValid = function (a) {
                        var b = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_DestinationIsValid(a, b));
                        return 0 !== Module.getValue(b, 'i8');
                    };
                    d.DestinationGetPage = function (a) {
                        var b = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_DestinationGetPage(a, b));
                        return Module.getValue(b, 'i8*');
                    };
                    d.PageIsValid = function (a) {
                        var b = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_PageIsValid(a, b));
                        return 0 !== Module.getValue(b, 'i8');
                    };
                    d.PageGetIndex = function (a) {
                        var b = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_PageGetIndex(a, b));
                        return Module.getValue(b, 'i32');
                    };
                    d.ObjGetAsPDFText = function (a) {
                        var b = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_ObjGetAsPDFText(a, b));
                        a = Module.getValue(b, 'i8*');
                        return Module.GetJSStringFromUString(a);
                    };
                    d.ObjFindObj = function (a, b) {
                        var c = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        b = Module.allocate(Module.intArrayFromString(b), 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_ObjFindObj(a, b, c));
                        return Module.getValue(c, 'i8*');
                    };
                    d.PDFDocGetFirstBookmark = function (a) {
                        var b = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_PDFDocGetFirstBookmark(a, b));
                        return Module.getValue(b, 'i8*');
                    };
                    d.DestinationGetExplicitDestObj = function (a) {
                        var b = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_DestinationGetExplicitDestObj(a, b));
                        return Module.getValue(b, 'i8*');
                    };
                    d.DestinationGetFitType = function (a) {
                        var b = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_DestinationGetFitType(a, b));
                        return Module.getValue(b, 'i32');
                    };
                    d.ObjIsNumber = function (a) {
                        var b = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_ObjIsNumber(a, b));
                        return 0 !== Module.getValue(b, 'i8');
                    };
                    d.ObjGetNumber = function (a) {
                        var b = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_ObjGetNumber(a, b));
                        return Module.getValue(b, 'double');
                    };
                    d.PDFDocGetRoot = function (a) {
                        var b = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_PDFDocGetRoot(a, b));
                        return Module.getValue(b, 'i8*');
                    };
                    d.ObjPutName = function (a, b, c) {
                        b = Module.allocate(Module.intArrayFromString(b), 'i8', Module.ALLOC_STACK);
                        c = Module.allocate(Module.intArrayFromString(c), 'i8', Module.ALLOC_STACK);
                        var h = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_ObjPutName(a, b, c, h));
                        return Module.getValue(h, 'i8*');
                    };
                    d.ObjPutDict = function (a, b) {
                        b = Module.allocate(Module.intArrayFromString(b), 'i8', Module.ALLOC_STACK);
                        var c = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_ObjPutDict(a, b, c));
                        return Module.getValue(c, 'i8*');
                    };
                    d.ObjPutString = function (a, b, c) {
                        b = Module.allocate(Module.intArrayFromString(b), 'i8', Module.ALLOC_STACK);
                        c = Module.allocate(Module.intArrayFromString(c), 'i8', Module.ALLOC_STACK);
                        var h = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_ObjPutString(a, b, c, h));
                        return Module.getValue(h, 'i8*');
                    };
                    d.ObjPut = function (a, b, c) {
                        b = Module.allocate(Module.intArrayFromString(b), 'i8', Module.ALLOC_STACK);
                        var h = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_ObjPut(a, b, c, h));
                        return Module.getValue(h, 'i8*');
                    };
                    d.ObjGetAt = function (a, b) {
                        var c = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_ObjGetAt(a, b, c));
                        return Module.getValue(c, 'i8*');
                    };
                    d.Matrix2DInverse = function (a) {
                        var b = Module.allocate(48, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_Matrix2DInverse(a, b));
                        return b;
                    };
                    d.PDFDocInitSecurityHandler = function (a) {
                        var b = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_PDFDocInitSecurityHandler(a, 0, b));
                        return 0 !== Module.getValue(b, 'i8');
                    };
                    d.PDFDocSetSecurityHandler = function (a, b) {
                        REX(Module._TRN_PDFDocSetSecurityHandler(a, b));
                    };
                    d.SecurityHandlerCreate = function (a) {
                        var b = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_SecurityHandlerCreate(a, b));
                        return Module.getValue(b, 'i8*');
                    };
                    d.SecurityHandlerChangeUserPasswordUString = function (a, b) {
                        REX(Module._TRN_SecurityHandlerChangeUserPasswordUString(a, Module.GetUStringFromJSString(b)));
                    };
                    d.PDFDocInitStdSecurityHandler = function (a, b) {
                        var c = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_PDFDocInitStdSecurityHandlerUString(a, Module.GetUStringFromJSString(b), c));
                        return 0 !== Module.getValue(c, 'i8');
                    };
                    d.PDFDocDownloaderTriggerFullDownload = function (a, b) {
                        REX(Module._TRN_PDFDocDownloaderTriggerFullDownload(a, b));
                    };
                    d.PDFDocInsertPages = function (a, b, c, h, g) {
                        REX(Module._TRN_PDFDocInsertPageSet(a, b, c, h, g ? 1 : 0, 0));
                    };
                    d.PDFDocMovePages = function (a, b, c) {
                        REX(Module._TRN_PDFDocMovePageSet(a, b, a, c, 0, 0));
                    };
                    d.PDFDocGetPageIterator = function (a, b) {
                        var c = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_PDFDocGetPageIterator(a, b, c));
                        return Module.getValue(c, 'i8*');
                    };
                    d.PDFDocPageRemove = function (a, b) {
                        REX(Module._TRN_PDFDocPageRemove(a, b));
                    };
                    d.PDFDocPageCreate = function (a, b, c) {
                        var h = Module.allocate(40, 'i8', Module.ALLOC_STACK);
                        Module.setValue(h, 0, 'double');
                        Module.setValue(h + 8, 0, 'double');
                        Module.setValue(h + 16, b, 'double');
                        Module.setValue(h + 24, c, 'double');
                        Module.setValue(h + 32, 0, 'double');
                        b = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_PDFDocPageCreate(a, h, b));
                        return Module.getValue(b, 'i8*');
                    };
                    d.PDFDocPageInsert = function (a, b, c) {
                        REX(Module._TRN_PDFDocPageInsert(a, b, c));
                    };
                    d.PageSetCreate = function () {
                        var a = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_PageSetCreate(a));
                        return Module.getValue(a, 'i8*');
                    };
                    d.PageSetCreateRange = function (a, b) {
                        var c = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_PageSetCreateRange(c, a, b));
                        return Module.getValue(c, 'i8*');
                    };
                    d.PageSetAddPage = function (a, b) {
                        REX(Module._TRN_PageSetAddPage(a, b));
                    };
                    d.ElementBuilderCreate = function () {
                        var a = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_ElementBuilderCreate(a));
                        return Module.getValue(a, 'i8*');
                    };
                    d.ElementBuilderDestroy = function (a) {
                        REX(Module._TRN_ElementBuilderDestroy(a));
                    };
                    d.ElementBuilderCreateImage = function (a, b, c, h, g, w) {
                        var G = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_ElementBuilderCreateImageScaled(a, b, c, h, g, w, G));
                        return Module.getValue(G, 'i8*');
                    };
                    d.ElementWriterCreate = function () {
                        var a = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_ElementWriterCreate(a));
                        return Module.getValue(a, 'i8*');
                    };
                    d.ElementWriterDestroy = function (a) {
                        REX(Module._TRN_ElementWriterDestroy(a));
                    };
                    d.ElementWriterBegin = function (a, b) {
                        REX(Module._TRN_ElementWriterBeginOnPage(a, b, 1, 1, 1, 0));
                    };
                    d.ElementWriterWritePlacedElement = function (a, b) {
                        REX(Module._TRN_ElementWriterWritePlacedElement(a, b));
                    };
                    d.ElementWriterEnd = function (a) {
                        var b = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_ElementWriterEnd(a, b));
                    };
                    d.ImageGetImageWidth = function (a) {
                        var b = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_ImageGetImageWidth(a, b));
                        return Module.getValue(b, 'i32');
                    };
                    d.ImageGetImageHeight = function (a) {
                        var b = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_ImageGetImageHeight(a, b));
                        return Module.getValue(b, 'i32');
                    };
                    d.ImageCreateFromMemory2 = function (a, b, c) {
                        var h = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_ImageCreateFromMemory2(a, b, c, 0, h));
                        return Module.getValue(h, 'i8*');
                    };
                    d.ImageCreateFromFile = function (a, b) {
                        var c = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_ImageCreateFromFile(a, b, 0, c));
                        return Module.getValue(c, 'i8*');
                    };
                    d.PDFDocPagePushBack = function (a, b) {
                        REX(Module._TRN_PDFDocPagePushBack(a, b));
                    };
                    d.PDFDocHasOC = function (a) {
                        var b = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_PDFDocHasOC(a, b));
                        return 0 !== Module.getValue(b, 'i8');
                    };
                    d.PDFDocGetOCGConfig = function (a) {
                        var b = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_PDFDocGetOCGConfig(a, b));
                        return Module.getValue(b, 'i8*');
                    };
                    d.OCGContextCreate = function (a) {
                        var b = Module.allocate(4, 'i8', Module.ALLOC_STACK);
                        REX(Module._TRN_OCGContextCreateFromConfig(a, b));
                        return Module.getValue(b, 'i8*');
                    };
                    d.UStringDestroy = function (a) {
                        REX(Module._TRN_UStringDestroy(a));
                    };
                    d.PDFDocFDFUpdate = function (a, b, c) {
                        if (c) {
                            for (var h = Object.keys(c), g = h.length, w = Module._malloc(8 * g), G = 0; G < g; ++G) {
                                var z = 8 * G,
                                    H = h[G],
                                    J = Module.GetDoc(c[H]);
                                H = Module.GetUStringFromJSString(H);
                                Module.setValue(w + z, J, 'i8*');
                                Module.setValue(w + z + 4, H, 'i8*');
                            }
                            REX(Module._TRN_PDFDocFDFUpdateAppearanceDocs(a, b, w, g));
                        } else REX(Module._TRN_PDFDocFDFUpdate(a, b));
                    };
                    d.FDFDocDestroy = function (a) {
                        REX(Module._TRN_FDFDocDestroy(a));
                    };
                })(l.Module);
            }.call(this, u(7).setImmediate));
        },
        function (v, x, u) {
            function n(r) {
                '@babel/helpers - typeof';
                return (
                    (n =
                        'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
                            ? function (y) {
                                  return typeof y;
                              }
                            : function (y) {
                                  return y &&
                                      'function' == typeof Symbol &&
                                      y.constructor === Symbol &&
                                      y !== Symbol.prototype
                                      ? 'symbol'
                                      : typeof y;
                              }),
                    n(r)
                );
            }
            (function (r) {
                r.SetupPDFNetFunctions = function (y) {
                    Module._IB_ = [];
                    for (
                        var l = function D(B) {
                                if ('object' === n(B) && null !== B)
                                    if ('undefined' !== typeof B.byteLength) {
                                        var I = Module._IB_.length;
                                        Module._IB_[I] = new Uint8Array(B);
                                        B = { handle: I, isArrayBufferRef: !0 };
                                    } else
                                        Object.keys(B).forEach(function (C) {
                                            B.hasOwnProperty(C) && (B[C] = D(B[C]));
                                        });
                                return B;
                            },
                            d = function I(D) {
                                'object' === n(D) &&
                                    null !== D &&
                                    (D.buffer
                                        ? (D = D.buffer.slice(D.byteOffset, D.byteOffset + D.length))
                                        : D.isArrayBufferRef
                                        ? (D = Module._IB_[D.handle].buffer)
                                        : Object.keys(D).forEach(function (C) {
                                              D.hasOwnProperty(C) && (D[C] = I(D[C]));
                                          }));
                                return D;
                            },
                            e = Module._TRN_EMSCreateSharedWorkerInstance(),
                            f,
                            k = Module._TRN_EMSWorkerInstanceGetFunctionIterator(e),
                            p = function (D, I) {
                                return new Promise(function (C, E) {
                                    D = l(D);
                                    var F = D.docId;
                                    F = F ? Module.GetDoc(F) : 0;
                                    (F = Module.EMSCallSharedFunction(e, I, F))
                                        ? E({ type: 'PDFWorkerError', message: Module.GetErrToString(F) })
                                        : ((E = Module.EMSGetLastResponse(e)), (E = d(E)), C(E));
                                });
                            };
                        (f = Module._TRN_EMSFunctionIteratorGetNextCommandName(k));

                    )
                        (f = Module.GetJSStringFromCString(f)), r.queue.onAsync(f, p);
                    Module._TRN_EMSFunctionIteratorDestroy(k);
                    if (Module._TRN_EMSCreatePDFNetWorkerInstance) {
                        var m = {};
                        k = function (t, B) {
                            y.on(t, B);
                            m[t] = !0;
                        };
                        Module.docPtrStringToIdMap = {};
                        var A = function (t) {
                            if (t in Module.docPtrStringToIdMap) return Module.docPtrStringToIdMap[t];
                            throw Error("Couldn't find document ".concat(t));
                        };
                        r.queue.onAsync('PDFDoc.RequirePage', function (t) {
                            return Module.RequirePage(A(t.docId), t.pageNum);
                        });
                        k('pdfDocCreateFromBuffer', function (t) {
                            t = Module.CreateDoc({ type: 'array', value: t.buf });
                            var B = Module.GetDoc(t).toString(16);
                            Module.docPtrStringToIdMap[B] = t;
                            return B;
                        });
                        k('PDFDoc.destroy', function (t) {
                            t = A(t.auto_dealloc_obj);
                            Module.DeleteDoc(t);
                        });
                        k('PDFDoc.saveMemoryBuffer', function (t) {
                            var B = A(t.doc);
                            return Module.SaveHelper(Module.GetDoc(B), B, t.flags).slice(0);
                        });
                        k('pdfDocCreate', function () {
                            var t = Module.CreateDoc({ type: 'new' }),
                                B = Module.GetDoc(t).toString(16);
                            Module.docPtrStringToIdMap[B] = t;
                            return B;
                        });
                        k('GetPDFDoc', function (t) {
                            t = t.docId;
                            var B = Module.GetDoc(t).toString(16);
                            Module.docPtrStringToIdMap[B] = t;
                            return B;
                        });
                        k('ExtractPDFNetLayersContext', function (t) {
                            var B = t.layers;
                            t = Module.GetDoc(t.docId);
                            var D = 0;
                            B
                                ? (D = Module.EMSCreateUpdatedLayersContext(t, B))
                                : Module.PDFDocHasOC(t) &&
                                  ((B = Module.PDFDocGetOCGConfig(t)), (D = Module.OCGContextCreate(B)));
                            return D.toString(16);
                        });
                        var q = Module._TRN_EMSCreatePDFNetWorkerInstance();
                        k = Module._TRN_EMSWorkerInstanceGetFunctionIterator(q);
                        for (
                            p = function (t) {
                                return new Promise(function (B, D) {
                                    t = l(t);
                                    var I = Module.EMSCallPDFNetFunction(q, t);
                                    I
                                        ? D(Module.GetErrToString(I))
                                        : ((D = Module.EMSGetLastResponse(q)), (D = d(D)), B(D));
                                });
                            };
                            (f = Module._TRN_EMSFunctionIteratorGetNextCommandName(k));

                        )
                            if (((f = Module.GetJSStringFromCString(f)), !m[f])) y.onAsync(f, p);
                        Module._TRN_EMSFunctionIteratorDestroy(k);
                    }
                };
            })(self);
        },
        function (v, x, u) {
            v = u(6);
            var n = u.n(v),
                r = u(15),
                y = u(16),
                l = u(5),
                d = u(17),
                e = u(1),
                f = u(18);
            (function (k) {
                var p = null;
                k.basePath = '../';
                var m = function () {
                    var q = k.pdfWorkerPath || '';
                    k.workerBasePath && (k.basePath = k.workerBasePath);
                    var t = k.isFull,
                        B = t ? 'full/' : 'lean/';
                    k.useOptimizedWorker && (B += f.a);
                    var D = k.wasmDisabled;
                    Object(e.c)();
                    k.overriddenPdfWorkerPath &&
                        ((q = k.overriddenPdfWorkerPath), (k.basePath = '../'), !Object(l.a)() || D) &&
                        (q = '');
                    k.basePath = k.externalPath ? k.externalPath : k.basePath + 'external/';
                    Object(d.a)(
                        ''.concat(q + B, 'PDFNetC'),
                        { 'Wasm.wasm': t ? 1e7 : 4e6, 'Wasm.js.mem': 1e5, '.js.mem': 12e6, '.mem': t ? 2e6 : 6e5 },
                        D
                    );
                };
                k.EmscriptenPDFManager = function () {};
                k.EmscriptenPDFManager.prototype = {
                    OnInitialized: function (q) {
                        Module.loaded
                            ? q()
                            : ((Module.initCb = function () {
                                  q();
                              }),
                              Object(e.b)('worker', 'PDFNet is not initialized yet!'));
                    },
                    NewDoc: function (q, t) {
                        return new Promise(function (B, D) {
                            try {
                                B(Module.loadDoc(q, t));
                            } catch (I) {
                                D(I);
                            }
                        });
                    },
                    Initialize: function (q, t, B, D) {
                        q && (Module.TOTAL_MEMORY = q);
                        Module.memoryInitializerPrefixURL = t;
                        Module.asmjsPrefix = B;
                        k.basePath = D;
                        m();
                    },
                    shouldRunRender: function (q) {
                        return Module.ShouldRunRender(q.docId, q.pageIndex + 1);
                    }
                };
                var A = {
                    setup: function (q) {
                        function t(g) {
                            var w = g.data,
                                G = g.action;
                            var z = 'GetCanvas' === G || 'GetCanvasPartial' === G ? C.shouldRunRender(w) : !0;
                            if (z) {
                                p = g;
                                var H = g.asyncCallCapability;
                                Object(e.b)('Memory', 'Worker running command: '.concat(G));
                                E.actionMap[G](w, g).then(
                                    function (J) {
                                        'BeginOperation' !== p.action && (p = null);
                                        H.resolve(J);
                                    },
                                    function (J) {
                                        p = null;
                                        H.reject(J);
                                    }
                                );
                            } else k.deferredQueue.queue(g), I();
                        }
                        function B(g) {
                            g.asyncCallCapability = createPromiseCapability();
                            p || E.length ? E.queue(g) : t(g);
                            return g.asyncCallCapability.promise;
                        }
                        function D(g) {
                            self.shouldResize &&
                                C.Initialize(
                                    g.options.workerHeapSize,
                                    g.options.pdfResourcePath,
                                    g.options.pdfAsmPath,
                                    g.options.parentUrl
                                );
                            Module.chunkMax = g.options.chunkMax;
                            if (g.array instanceof Uint8Array) {
                                var w = 255 === g.array[0];
                                q.postMessageTransfers = w;
                                'response' in new XMLHttpRequest()
                                    ? C.OnInitialized(function () {
                                          k.SetupPDFNetFunctions(q);
                                          b();
                                          q.send('test', { supportTypedArray: !0, supportTransfers: w });
                                      })
                                    : q.send('test', !1);
                            } else q.send('test', !1);
                        }
                        function I() {
                            r.a.setImmediate(function () {
                                if ((!p || 'BeginOperation' !== p.action) && E.length && !p) {
                                    var g = E.dequeue();
                                    t(g);
                                }
                            });
                        }
                        var C = new k.EmscriptenPDFManager(),
                            E,
                            F = !1,
                            a = !1;
                        Module.workerMessageHandler = q;
                        var b = function () {
                            F ? a || (q.send('workerLoaded', {}), (a = !0)) : (F = !0);
                        };
                        C.OnInitialized(b);
                        (function () {
                            k.queue = E = new n.a({
                                strategy: n.a.ArrayStrategy,
                                comparator: function (g, w) {
                                    return g.priority === w.priority
                                        ? g.callbackId - w.callbackId
                                        : w.priority - g.priority;
                                }
                            });
                            k.deferredQueue = new n.a({
                                strategy: n.a.ArrayStrategy,
                                comparator: function (g, w) {
                                    return g.priority === w.priority
                                        ? g.callbackId - w.callbackId
                                        : w.priority - g.priority;
                                }
                            });
                            E.actionMap = {};
                            E.onAsync = function (g, w) {
                                q.onAsync(g, B);
                                E.actionMap[g] = w;
                            };
                        })();
                        q.on('test', D);
                        q.on('InitWorker', D);
                        var c = function (g) {
                                p && g(p) && (Module.cancelCurrent(), (p = null));
                                E.removeAllMatching(g, function (w) {
                                    w.asyncCallCapability.reject({
                                        type: 'Cancelled',
                                        message:
                                            'Operation was cancelled due to a change affecting the loaded document.'
                                    });
                                });
                            },
                            h = function (g) {
                                c(function (w) {
                                    return w.data && w.data.docId === g;
                                });
                            };
                        q.on('UpdatePassword', function (g) {
                            return Module.UpdatePassword(g.docId, g.password);
                        });
                        q.on('LoadRes', function (g) {
                            Module.loadResources(g.array, g.l);
                            return {};
                        });
                        q.on('DownloaderHint', function (g) {
                            Module.DownloaderHint(g.docId, g.hint);
                        });
                        q.on('IsLinearized', function (g) {
                            return Module.IsLinearizationValid(g.docId);
                        });
                        q.onNextAsync(I);
                        E.onAsync('NewDoc', function (g) {
                            return C.NewDoc(g);
                        });
                        E.onAsync('GetCanvas', function (g) {
                            Object(e.b)(
                                'workerdetails',
                                'Run GetCanvas PageIdx: '.concat(g.pageIndex, ' Width: ').concat(g.width)
                            );
                            Object(e.b)(
                                'Memory',
                                'loadCanvas with potential memory usage '.concat(g.width * g.height * 8)
                            );
                            return Module.loadCanvas(
                                g.docId,
                                g.pageIndex,
                                g.width,
                                g.height,
                                g.rotation,
                                null,
                                g.layers,
                                g.renderOptions
                            );
                        });
                        E.onAsync('GetCanvasPartial', function (g) {
                            Object(e.b)(
                                'Memory',
                                'GetCanvasPartial with potential memory usage '.concat(g.width * g.height * 8)
                            );
                            return Module.loadCanvas(
                                g.docId,
                                g.pageIndex,
                                g.width,
                                g.height,
                                g.rotation,
                                g.bbox,
                                g.layers,
                                g.renderOptions
                            );
                        });
                        E.onAsync('SaveDoc', function (g) {
                            return Module.SaveDoc(
                                g.docId,
                                g.xfdfString,
                                g.finishedWithDocument,
                                g.printDocument,
                                g.flags,
                                g.watermarks,
                                g.apdocs,
                                g.password,
                                g.encryptionAlgorithmType
                            );
                        });
                        E.onAsync('SaveDocFromFixedElements', function (g) {
                            return Module.SaveDocFromFixedElements(
                                g.bytes,
                                g.xfdfString,
                                g.flags,
                                g.watermarks,
                                g.password,
                                g.encryptionAlgorithmType
                            );
                        });
                        E.onAsync('MergeXFDF', function (g) {
                            return Module.MergeXFDF(g.docId, g.xfdf, g.apdocs);
                        });
                        E.onAsync('InsertPages', function (g) {
                            return Module.InsertPages(
                                g.docId,
                                g.doc,
                                g.pageArray,
                                g.destPos,
                                g.insertBookmarks,
                                g.skipUpdateEvent
                            );
                        });
                        E.onAsync('MovePages', function (g) {
                            return Module.MovePages(g.docId, g.pageArray, g.destPos);
                        });
                        E.onAsync('RemovePages', function (g) {
                            return Module.RemovePages(g.docId, g.pageArray, g.skipUpdateEvent);
                        });
                        E.onAsync('RotatePages', function (g) {
                            return Module.RotatePages(g.docId, g.pageArray, g.rotation);
                        });
                        E.onAsync('ExtractPages', function (g) {
                            return Module.ExtractPages(g.docId, g.pageArray, g.xfdfString, g.watermarks, g.apdocs);
                        });
                        E.onAsync('CropPages', function (g) {
                            return Module.CropPages(
                                g.docId,
                                g.pageArray,
                                g.topMargin,
                                g.botMargin,
                                g.leftMargin,
                                g.rightMargin
                            );
                        });
                        E.onAsync('TriggerFullDownload', function (g) {
                            return Module.TriggerFullDownload(g.docId);
                        });
                        E.onAsync('InsertBlankPages', function (g) {
                            return Module.InsertBlankPages(g.docId, g.pageArray, g.width, g.height);
                        });
                        E.onAsync('BeginOperation', function () {
                            return Promise.resolve();
                        });
                        E.onAsync('RequirePage', function (g, w) {
                            return Module.RequirePage(g.docId, g.pageNum);
                        });
                        q.on('FinishOperation', function () {
                            if (p && 'BeginOperation' === p.action) (p = null), I();
                            else throw { message: 'Operation has not started.' };
                        });
                        q.on('DeleteDocument', function (g) {
                            g = g.docId;
                            h(g);
                            Module.DeleteDoc(g);
                        });
                        q.on('GetCanvasProgressive', function (g) {
                            if (p && p.callbackId === g.callbackId) {
                                Object(e.b)('worker', 'Progressive request in progress');
                                var w = Module.GetCurrentCanvasData(!0);
                            } else {
                                if (E.find({ priority: 0, callbackId: g.callbackId }))
                                    throw (
                                        (Object(e.b)('worker', 'Progressive request Queued'),
                                        { type: 'Queued', message: 'Rendering has not started yet.' })
                                    );
                                if (k.deferredQueue.find({ priority: 0, callbackId: g.callbackId }))
                                    throw (
                                        (Object(e.b)('worker', 'Progressive request Deferred'),
                                        { type: 'Queued', message: 'Rendering has not started yet.' })
                                    );
                            }
                            if (!w)
                                throw (
                                    (Object(e.b)('worker', 'Progressive request invalid (render already complete)'),
                                    { type: 'Unavailable', message: 'Rendering is complete or was cancelled.' })
                                );
                            return w;
                        });
                        q.on('actionCancel', function (g) {
                            p && p.callbackId === g.callbackId
                                ? (Object(e.b)('workerdetails', 'Cancelled Current Operation'),
                                  Module.cancelCurrent() && ((p = null), I()))
                                : (Object(e.b)('workerdetails', 'Cancelled queued operation'),
                                  E.remove({ priority: 0, callbackId: g.callbackId }),
                                  k.deferredQueue.remove({ priority: 0, callbackId: g.callbackId }));
                        });
                    }
                };
                k.onmessage = function (q) {
                    if ('init' === q.data.action) {
                        var t = q.data.shouldResize;
                        k.shouldResize = t;
                        k.isFull = q.data.isFull;
                        k.wasmDisabled = !q.data.wasm;
                        k.externalPath = q.data.externalPath;
                        k.useOptimizedWorker = q.data.useOptimizedWorker;
                        if ((q = q.data.pdfWorkerPath)) k.overriddenPdfWorkerPath = q;
                        t || m();
                        t = new y.a('worker_processor', self);
                        Object(e.a)(t);
                        A.setup(t);
                    }
                };
            })('undefined' === typeof window ? self : window);
        }
    ]);
}.call(this || window));
