(function () {
    var $jscomp = $jscomp || {};
    $jscomp.scope = {};
    $jscomp.arrayIteratorImpl = function (p) {
        var l = 0;
        return function () {
            return l < p.length ? { done: !1, value: p[l++] } : { done: !0 };
        };
    };
    $jscomp.arrayIterator = function (p) {
        return { next: $jscomp.arrayIteratorImpl(p) };
    };
    $jscomp.makeIterator = function (p) {
        var l = 'undefined' != typeof Symbol && Symbol.iterator && p[Symbol.iterator];
        return l ? l.call(p) : $jscomp.arrayIterator(p);
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
        for (var l = 0; l < p.length; ++l) {
            var r = p[l];
            if (r && r.Math == Math) return r;
        }
        throw Error('Cannot find global object');
    };
    $jscomp.global = $jscomp.getGlobal(this);
    $jscomp.defineProperty =
        $jscomp.ASSUME_ES5 || 'function' == typeof Object.defineProperties
            ? Object.defineProperty
            : function (p, l, r) {
                  if (p == Array.prototype || p == Object.prototype) return p;
                  p[l] = r.value;
                  return p;
              };
    $jscomp.IS_SYMBOL_NATIVE = 'function' === typeof Symbol && 'symbol' === typeof Symbol('x');
    $jscomp.TRUST_ES6_POLYFILLS = !$jscomp.ISOLATE_POLYFILLS || $jscomp.IS_SYMBOL_NATIVE;
    $jscomp.polyfills = {};
    $jscomp.propertyToPolyfillSymbol = {};
    $jscomp.POLYFILL_PREFIX = '$jscp$';
    var $jscomp$lookupPolyfilledValue = function (p, l) {
        var r = $jscomp.propertyToPolyfillSymbol[l];
        if (null == r) return p[l];
        r = p[r];
        return void 0 !== r ? r : p[l];
    };
    $jscomp.polyfill = function (p, l, r, n) {
        l &&
            ($jscomp.ISOLATE_POLYFILLS ? $jscomp.polyfillIsolated(p, l, r, n) : $jscomp.polyfillUnisolated(p, l, r, n));
    };
    $jscomp.polyfillUnisolated = function (p, l, r, n) {
        r = $jscomp.global;
        p = p.split('.');
        for (n = 0; n < p.length - 1; n++) {
            var k = p[n];
            if (!(k in r)) return;
            r = r[k];
        }
        p = p[p.length - 1];
        n = r[p];
        l = l(n);
        l != n && null != l && $jscomp.defineProperty(r, p, { configurable: !0, writable: !0, value: l });
    };
    $jscomp.polyfillIsolated = function (p, l, r, n) {
        var k = p.split('.');
        p = 1 === k.length;
        n = k[0];
        n = !p && n in $jscomp.polyfills ? $jscomp.polyfills : $jscomp.global;
        for (var q = 0; q < k.length - 1; q++) {
            var g = k[q];
            if (!(g in n)) return;
            n = n[g];
        }
        k = k[k.length - 1];
        r = $jscomp.IS_SYMBOL_NATIVE && 'es6' === r ? n[k] : null;
        l = l(r);
        null != l &&
            (p
                ? $jscomp.defineProperty($jscomp.polyfills, k, { configurable: !0, writable: !0, value: l })
                : l !== r &&
                  (void 0 === $jscomp.propertyToPolyfillSymbol[k] &&
                      ((r = (1e9 * Math.random()) >>> 0),
                      ($jscomp.propertyToPolyfillSymbol[k] = $jscomp.IS_SYMBOL_NATIVE
                          ? $jscomp.global.Symbol(k)
                          : $jscomp.POLYFILL_PREFIX + r + '$' + k)),
                  $jscomp.defineProperty(n, $jscomp.propertyToPolyfillSymbol[k], {
                      configurable: !0,
                      writable: !0,
                      value: l
                  })));
    };
    $jscomp.polyfill(
        'Promise',
        function (p) {
            function l() {
                this.batch_ = null;
            }
            function r(g) {
                return g instanceof k
                    ? g
                    : new k(function (m, t) {
                          m(g);
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
            l.prototype.asyncExecute = function (g) {
                if (null == this.batch_) {
                    this.batch_ = [];
                    var m = this;
                    this.asyncExecuteFunction(function () {
                        m.executeBatch_();
                    });
                }
                this.batch_.push(g);
            };
            var n = $jscomp.global.setTimeout;
            l.prototype.asyncExecuteFunction = function (g) {
                n(g, 0);
            };
            l.prototype.executeBatch_ = function () {
                for (; this.batch_ && this.batch_.length; ) {
                    var g = this.batch_;
                    this.batch_ = [];
                    for (var m = 0; m < g.length; ++m) {
                        var t = g[m];
                        g[m] = null;
                        try {
                            t();
                        } catch (v) {
                            this.asyncThrow_(v);
                        }
                    }
                }
                this.batch_ = null;
            };
            l.prototype.asyncThrow_ = function (g) {
                this.asyncExecuteFunction(function () {
                    throw g;
                });
            };
            var k = function (g) {
                this.state_ = 0;
                this.result_ = void 0;
                this.onSettledCallbacks_ = [];
                this.isRejectionHandled_ = !1;
                var m = this.createResolveAndReject_();
                try {
                    g(m.resolve, m.reject);
                } catch (t) {
                    m.reject(t);
                }
            };
            k.prototype.createResolveAndReject_ = function () {
                function g(v) {
                    return function (w) {
                        t || ((t = !0), v.call(m, w));
                    };
                }
                var m = this,
                    t = !1;
                return { resolve: g(this.resolveTo_), reject: g(this.reject_) };
            };
            k.prototype.resolveTo_ = function (g) {
                if (g === this) this.reject_(new TypeError('A Promise cannot resolve to itself'));
                else if (g instanceof k) this.settleSameAsPromise_(g);
                else {
                    a: switch (typeof g) {
                        case 'object':
                            var m = null != g;
                            break a;
                        case 'function':
                            m = !0;
                            break a;
                        default:
                            m = !1;
                    }
                    m ? this.resolveToNonPromiseObj_(g) : this.fulfill_(g);
                }
            };
            k.prototype.resolveToNonPromiseObj_ = function (g) {
                var m = void 0;
                try {
                    m = g.then;
                } catch (t) {
                    this.reject_(t);
                    return;
                }
                'function' == typeof m ? this.settleSameAsThenable_(m, g) : this.fulfill_(g);
            };
            k.prototype.reject_ = function (g) {
                this.settle_(2, g);
            };
            k.prototype.fulfill_ = function (g) {
                this.settle_(1, g);
            };
            k.prototype.settle_ = function (g, m) {
                if (0 != this.state_)
                    throw Error('Cannot settle(' + g + ', ' + m + '): Promise already settled in state' + this.state_);
                this.state_ = g;
                this.result_ = m;
                2 === this.state_ && this.scheduleUnhandledRejectionCheck_();
                this.executeOnSettledCallbacks_();
            };
            k.prototype.scheduleUnhandledRejectionCheck_ = function () {
                var g = this;
                n(function () {
                    if (g.notifyUnhandledRejection_()) {
                        var m = $jscomp.global.console;
                        'undefined' !== typeof m && m.error(g.result_);
                    }
                }, 1);
            };
            k.prototype.notifyUnhandledRejection_ = function () {
                if (this.isRejectionHandled_) return !1;
                var g = $jscomp.global.CustomEvent,
                    m = $jscomp.global.Event,
                    t = $jscomp.global.dispatchEvent;
                if ('undefined' === typeof t) return !0;
                'function' === typeof g
                    ? (g = new g('unhandledrejection', { cancelable: !0 }))
                    : 'function' === typeof m
                    ? (g = new m('unhandledrejection', { cancelable: !0 }))
                    : ((g = $jscomp.global.document.createEvent('CustomEvent')),
                      g.initCustomEvent('unhandledrejection', !1, !0, g));
                g.promise = this;
                g.reason = this.result_;
                return t(g);
            };
            k.prototype.executeOnSettledCallbacks_ = function () {
                if (null != this.onSettledCallbacks_) {
                    for (var g = 0; g < this.onSettledCallbacks_.length; ++g)
                        q.asyncExecute(this.onSettledCallbacks_[g]);
                    this.onSettledCallbacks_ = null;
                }
            };
            var q = new l();
            k.prototype.settleSameAsPromise_ = function (g) {
                var m = this.createResolveAndReject_();
                g.callWhenSettled_(m.resolve, m.reject);
            };
            k.prototype.settleSameAsThenable_ = function (g, m) {
                var t = this.createResolveAndReject_();
                try {
                    g.call(m, t.resolve, t.reject);
                } catch (v) {
                    t.reject(v);
                }
            };
            k.prototype.then = function (g, m) {
                function t(y, z) {
                    return 'function' == typeof y
                        ? function (A) {
                              try {
                                  v(y(A));
                              } catch (C) {
                                  w(C);
                              }
                          }
                        : z;
                }
                var v,
                    w,
                    E = new k(function (y, z) {
                        v = y;
                        w = z;
                    });
                this.callWhenSettled_(t(g, v), t(m, w));
                return E;
            };
            k.prototype.catch = function (g) {
                return this.then(void 0, g);
            };
            k.prototype.callWhenSettled_ = function (g, m) {
                function t() {
                    switch (v.state_) {
                        case 1:
                            g(v.result_);
                            break;
                        case 2:
                            m(v.result_);
                            break;
                        default:
                            throw Error('Unexpected state: ' + v.state_);
                    }
                }
                var v = this;
                null == this.onSettledCallbacks_ ? q.asyncExecute(t) : this.onSettledCallbacks_.push(t);
                this.isRejectionHandled_ = !0;
            };
            k.resolve = r;
            k.reject = function (g) {
                return new k(function (m, t) {
                    t(g);
                });
            };
            k.race = function (g) {
                return new k(function (m, t) {
                    for (var v = $jscomp.makeIterator(g), w = v.next(); !w.done; w = v.next())
                        r(w.value).callWhenSettled_(m, t);
                });
            };
            k.all = function (g) {
                var m = $jscomp.makeIterator(g),
                    t = m.next();
                return t.done
                    ? r([])
                    : new k(function (v, w) {
                          function E(A) {
                              return function (C) {
                                  y[A] = C;
                                  z--;
                                  0 == z && v(y);
                              };
                          }
                          var y = [],
                              z = 0;
                          do y.push(void 0), z++, r(t.value).callWhenSettled_(E(y.length - 1), w), (t = m.next());
                          while (!t.done);
                      });
            };
            return k;
        },
        'es6',
        'es3'
    );
    (function (p) {
        function l(n) {
            if (r[n]) return r[n].exports;
            var k = (r[n] = { i: n, l: !1, exports: {} });
            p[n].call(k.exports, k, k.exports, l);
            k.l = !0;
            return k.exports;
        }
        var r = {};
        l.m = p;
        l.c = r;
        l.d = function (n, k, q) {
            l.o(n, k) || Object.defineProperty(n, k, { enumerable: !0, get: q });
        };
        l.r = function (n) {
            'undefined' !== typeof Symbol &&
                Symbol.toStringTag &&
                Object.defineProperty(n, Symbol.toStringTag, { value: 'Module' });
            Object.defineProperty(n, '__esModule', { value: !0 });
        };
        l.t = function (n, k) {
            k & 1 && (n = l(n));
            if (k & 8 || (k & 4 && 'object' === typeof n && n && n.__esModule)) return n;
            var q = Object.create(null);
            l.r(q);
            Object.defineProperty(q, 'default', { enumerable: !0, value: n });
            if (k & 2 && 'string' != typeof n)
                for (var g in n)
                    l.d(
                        q,
                        g,
                        function (m) {
                            return n[m];
                        }.bind(null, g)
                    );
            return q;
        };
        l.n = function (n) {
            var k =
                n && n.__esModule
                    ? function () {
                          return n['default'];
                      }
                    : function () {
                          return n;
                      };
            l.d(k, 'a', k);
            return k;
        };
        l.o = function (n, k) {
            return Object.prototype.hasOwnProperty.call(n, k);
        };
        l.p = '/core';
        return l((l.s = 1));
    })([
        function (p, l, r) {
            (function (n) {
                r.d(l, 'b', function () {
                    return B;
                });
                r.d(l, 'a', function () {
                    return K;
                });
                r.d(l, 'c', function () {
                    return D;
                });
                r.d(l, 'd', function () {
                    return H;
                });
                var k = r(4);
                r.n(k);
                var q = window,
                    g = (function () {
                        return function (b, c) {
                            this.fsQ = this.fs_read_counter = 0;
                            this.needCallback = !1;
                            this.fs_read_total = b;
                            this.fsQ = c;
                        };
                    })();
                q.AsyncFSHack = { readingAsyncFS: 0, readingCounter: 0, readCalls: {} };
                var m = q.Module,
                    t = 0,
                    v = {},
                    w = function (b) {
                        q.AsyncFSHack.readingAsyncFS = 1;
                        b in q.AsyncFSHack.readCalls ||
                            (q.AsyncFSHack.readCalls[b] = new g(q.AsyncFSHack.read_total, q.AsyncFSHack.q));
                    },
                    E = function (b) {
                        var c = q.AsyncFSHack.readCalls[b];
                        ++c.fs_read_counter;
                        c.fs_read_counter >= c.fs_read_total &&
                            (c.needCallback ? m._finish_do_call_operation(c.fsQ) : (q.AsyncFSHack.readingAsyncFS = 0),
                            delete q.AsyncFSHack.readCalls[b]);
                    },
                    y = function (b, c, h, e, d, a) {
                        this.lruList = [];
                        this.chunkMap = {};
                        this.chunkReader = {};
                        this.chunkMap[c] = e;
                        this.length = c;
                        this.cacheDataSize = h;
                        this.url = b;
                        this.customHeaders = d;
                        this.withCredentials = a;
                        this.chunkSize = 1048576;
                    };
                y.prototype = {
                    lruUpdate: function (b) {
                        var c = this.lruList.lastIndexOf(b);
                        0 <= c && this.lruList.splice(c, 1);
                        this.lruList.push(b);
                    },
                    downloadChunk: function (b, c) {
                        var h = !1;
                        b in this.chunkReader || ((this.chunkReader[b] = []), (h = !0));
                        c && this.chunkReader[b].push(c);
                        if (h) {
                            c = Math.min(b + this.chunkSize, this.length) - 1;
                            var e = new XMLHttpRequest();
                            e.open('GET', this.url, !0);
                            e.responseType = 'arraybuffer';
                            e.setRequestHeader('Range', ['bytes=', b, '-', c].join(''));
                            this.withCredentials && (e.withCredentials = this.withCredentials);
                            if (this.customHeaders)
                                for (var d in this.customHeaders) e.setRequestHeader(d, this.customHeaders[d]);
                            e.send();
                            var a = this;
                            e.onload = function () {
                                if (200 === e.status || 206 === e.status) {
                                    var f = new Int8Array(e.response);
                                    a.writeChunk(f, b);
                                } else
                                    window.parent.parentWarn('Failed to load data from' + a.url),
                                        (f = new Int8Array(0));
                                for (var u = a.chunkReader[b], x = 0; x < u.length; x++) u[x](f);
                                delete a.chunkReader[b];
                            };
                        }
                    },
                    hadChunk: function (b) {
                        return b in this.chunkMap;
                    },
                    hasChunk: function (b) {
                        return this.chunkMap[b];
                    },
                    getCacheData: function () {
                        return this.chunkMap[this.length];
                    },
                    updateCache: function (b) {
                        for (var c = 0; c < b.length; c++) {
                            var h = b[c];
                            this.hadChunk(h) && (this.hasChunk(h) ? this.lruUpdate(h) : this.downloadChunk(h));
                        }
                    },
                    wrapChunkRetrieval: function (b, c, h) {
                        this.downloadChunk(b, function (e) {
                            h(e, c);
                        });
                    },
                    downloadChunks: function (b, c) {
                        for (
                            var h = b.length,
                                e = Array(h),
                                d = 0,
                                a = function (u, x) {
                                    e[x] = u;
                                    ++d;
                                    d === h && c(e);
                                },
                                f = 0;
                            f < h;
                            ++f
                        )
                            this.wrapChunkRetrieval(b[f][0], f, a);
                    },
                    readFromCache: function (b, c, h) {
                        var e = [],
                            d = 0,
                            a = Math.floor(c / this.chunkSize) * this.chunkSize,
                            f = c % this.chunkSize;
                        c = this.chunkSize - f;
                        c = c > h ? h : c;
                        this.chunkMap[a]
                            ? ((f = this.chunkMap[a].subarray(f, f + c)), b.set(f), this.lruUpdate(a))
                            : this.hadChunk(a)
                            ? e.push([a, f, c, d])
                            : ((f = new Int8Array(c)), b.set(f));
                        for (h -= c; 0 < h; )
                            (d += c),
                                (a += this.chunkSize),
                                (c = this.chunkSize > h ? h : this.chunkSize),
                                this.chunkMap[a]
                                    ? ((f = this.chunkMap[a].subarray(0, c)), b.set(f, d), this.lruUpdate(a))
                                    : this.hadChunk(a)
                                    ? e.push([a, 0, c, d])
                                    : ((f = new Int8Array(c)), b.set(f, d)),
                                (h -= c);
                        return e;
                    },
                    writeChunk: function (b, c, h) {
                        h = h || 0;
                        var e = this.chunkMap[c],
                            d = b.length,
                            a = this.lruList.length >= m.chunkMax && !e;
                        d !== this.chunkSize || b.buffer.byteLength !== d
                            ? (a
                                  ? ((e = this.lruList.shift()),
                                    (a = this.chunkMap[e]),
                                    a.length < this.chunkSize && (a = new Int8Array(this.chunkSize)),
                                    (this.chunkMap[e] = null))
                                  : (a = e ? this.chunkMap[c] : new Int8Array(this.chunkSize)),
                              a.subarray(h, h + d).set(b),
                              (b = a))
                            : a && ((e = this.lruList.shift()), (this.chunkMap[e] = null));
                        this.lruUpdate(c);
                        this.chunkMap[c] = b;
                    }
                };
                var z = function (b) {
                    this.chunkStorage = b;
                    this.position = 0;
                    this.length = this.chunkStorage.length;
                };
                z.prototype = {
                    read: function (b, c, h, e) {
                        var d = e + h <= this.length,
                            a = d ? h : this.length - e,
                            f = q.AsyncFSHack.readingCounter.toString();
                        if (0 < a) {
                            w(f);
                            var u = b.subarray(c, c + a);
                            var x = this.chunkStorage.readFromCache(u, e, a);
                            x.length
                                ? ((q.AsyncFSHack.readCalls[f].needCallback = !0),
                                  this.chunkStorage.downloadChunks(x, function (L) {
                                      for (var I = 0; I < L.length; ++I) {
                                          var J = x[I],
                                              M = L[I].subarray(J[1], J[1] + J[2]);
                                          u.set(M, J[3]);
                                      }
                                      E(f);
                                  }))
                                : d && E(f);
                            e += a;
                        } else a = 0;
                        if (!d) {
                            w(f);
                            c += a;
                            if ((h -= a)) {
                                d = this.chunkStorage.getCacheData();
                                h > d.length && (h = d.length);
                                var G = e - this.length;
                                h -= G;
                                b = b.subarray(c, c + h);
                                c = d.subarray(G, G + h);
                                b.set(c);
                            }
                            (x && x.length) || E(f);
                            e += h;
                            a += h;
                        }
                        this.position = e;
                        return a;
                    },
                    write: function (b, c, h, e) {
                        var d = e + h <= this.length,
                            a = e + h <= this.length ? h : this.length - e;
                        if (0 < a) {
                            var f = b.subarray(c, c + a),
                                u = e % 1048576;
                            this.chunkStorage.writeChunk(f, e - u, u);
                            e += a;
                        } else a = 0;
                        if (!d) {
                            f = c + a;
                            if ((h -= a))
                                (c = this.chunkStorage.getCacheData()),
                                    h > c.length && (h = c.length),
                                    (d = e - this.length),
                                    (h -= d),
                                    (f = b.subarray(f, f + h)),
                                    c.subarray(d, d + h).set(f);
                            e += h;
                            a += h;
                        }
                        this.position = e;
                        return a;
                    },
                    seek: function (b) {
                        this.position = b;
                    },
                    close: function () {
                        this.chunkStorage = null;
                    },
                    getPos: function () {
                        return this.position;
                    },
                    getTotalSize: function () {
                        return this.length + this.chunkStorage.cacheDataSize;
                    }
                };
                var A = function (b) {
                    this.file = b;
                    this.filePosition = 0;
                    this.fileLength = b.size;
                    this.readerPool = [];
                };
                A.prototype = {
                    readFromFile: function (b, c, h) {
                        var e = this.readerPool.length ? this.readerPool.pop() : new FileReader();
                        var d = this;
                        e.onload = function () {
                            var a = new Int8Array(e.result);
                            d.readerPool.push(e);
                            h(a);
                        };
                        e.readAsArrayBuffer(this.file.slice(c, c + b));
                    },
                    read: function (b, c, h, e) {
                        h = e + h <= this.fileLength ? h : this.fileLength - e;
                        if (0 < h) {
                            var d = q.AsyncFSHack.readingCounter.toString();
                            w(d);
                            var a = b.subarray(c, c + h);
                            q.AsyncFSHack.readCalls[d].needCallback = !0;
                            this.readFromFile(h, e, function (f) {
                                a.set(f);
                                E(d);
                            });
                            this.filePosition = e + h;
                        }
                        return h;
                    },
                    seek: function (b) {
                        this.filePosition = b;
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
                var C = {
                        open: function (b) {
                            var c = b.path.slice(1);
                            b.provider = m.docs[c].chunkStorage ? new z(m.docs[c].chunkStorage) : new A(m.docs[c]);
                        },
                        close: function (b) {
                            b.provider.close();
                        },
                        read: function (b, c, h, e, d) {
                            return b.provider.read(c, h, e, d);
                        },
                        llseek: function (b, c, h) {
                            b = b.provider;
                            1 === h ? (c += b.getPos()) : 2 === h && (c = b.getTotalSize() + c);
                            if (0 > c) throw new q.FS.ErrnoError(n.ERRNO_CODES.EINVAL);
                            b.seek(c);
                            return c;
                        },
                        write: function (b, c, h, e, d) {
                            return e ? b.provider.write(c, h, e, d) : 0;
                        }
                    },
                    F = function (b) {
                        if (!v[b]) {
                            var c = q.FS.makedev(3, 5);
                            q.FS.registerDevice(c, C);
                            q.FS.mkdev(b, 511, c);
                            v[b] = !0;
                        }
                    },
                    B = function (b, c, h, e) {
                        var d = 'docdev' + ++t;
                        F(d);
                        var a = Math.ceil((c + 1048576 - 1) / 1048576 / 8),
                            f = new Int8Array(new ArrayBuffer(a));
                        b = new y(b, c, a, f, h, e);
                        m.docs[d] = { chunkStorage: b };
                        return d;
                    },
                    K = function (b) {
                        var c = 'docdev' + ++t;
                        F(c);
                        m.docs[c] = b;
                        return c;
                    },
                    D = function (b) {
                        q.FS.unlink(b);
                        m.docs[b] && delete m.docs[b];
                    },
                    H = function (b) {
                        var c = Object.prototype.toString.call(b);
                        return 'object' === typeof b && null !== b && ('[object File]' === c || '[object Blob]' === c);
                    };
            }.call(this, r(3)));
        },
        function (p, l, r) {
            p.exports = r(2);
        },
        function (p, l, r) {
            function n(h) {
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
                    n(h)
                );
            }
            r.r(l);
            var k = r(0),
                q = window,
                g;
            q.Module.onRuntimeInitialized = function () {
                m = !0;
                v || (D.handleMessage({ action: 'workerLoaded', data: {} }), (v = !0));
                D.sendTestResponse();
                q.PThread.receiveObjectTransfer = function () {
                    var h = q.Module.GetNextResponseMessage();
                    q.getThreadedWasmWorker().handleMessage(h);
                    q.Module.PopNextResponseMessage();
                };
            };
            q.Module.locateFile = function (h) {
                return g + h;
            };
            q.Module.INITIAL_MEMORY = 100663296;
            var m = !1,
                t = !1,
                v = !1,
                w = 1,
                E = function d(e) {
                    if ('object' === n(e) && null !== e)
                        if ('undefined' !== typeof e.byteLength) {
                            var a = 'mainThreadArrayBuffer'.concat(w);
                            w++;
                            e = new Uint8Array(e);
                            q.FS.writeFile(a, e);
                            e = { handle: a, isArrayBufferRef: !0 };
                        } else for (a in e) e.hasOwnProperty(a) && (e[a] = d(e[a]));
                    return e;
                },
                y = function a(d) {
                    if ('object' === n(d) && null !== d)
                        if (d.isArrayBufferRef) {
                            var f = q.FS.readFile(d.handle, { encoding: 'binary' });
                            q.FS.unlink(d.handle);
                            d = f.buffer;
                        } else if (d.constructor === Uint8Array) d = new Uint8Array(d).buffer;
                        else for (f in d) d.hasOwnProperty(f) && (d[f] = a(d[f]));
                    return d;
                },
                z = 0,
                A = {},
                C = {},
                F = {},
                B = {},
                K = function (d) {
                    var a = d.action,
                        f = d.data,
                        u = d.callbackId;
                    if ('NewDoc' === a && f)
                        (a = f.value),
                            'url' === f.type
                                ? ((a = Object(k.b)(a.url, a.size, a.customHeaders, a.withCredentials)),
                                  (C[u] = a),
                                  (f.value.docDevId = a))
                                : Object(k.d)(a) && ((a = Object(k.a)(a)), (C[u] = a), (f.value = a));
                    else if (('SaveDoc' !== a && 'SaveDocFromFixedElements' !== a) || !f)
                        'GetCanvas' === a && f
                            ? ((u = f.docId),
                              u in B &&
                                  ((a = B[u]),
                                  a in q.Module.docs &&
                                      ((a = q.Module.docs[a]),
                                      'chunkStorage' in a &&
                                          ((f = q.Module.GetRequiredChunkOffsetArray(u, f.pageIndex + 1)),
                                          f.length && a.chunkStorage.updateCache(f)))))
                            : 'DeleteDocument' === a && f && ((f = f.docId), f in B && (F[u] = f));
                    else {
                        a = f.docId;
                        var x = f.finishedWithDocument,
                            G = 'docFilePath'.concat(z);
                        A[u] = { filePath: G, docId: a, finishedWithDocument: x };
                        z++;
                        f.filePath = G;
                    }
                    q.Module.HandleMessage(E(d));
                },
                D;
            q.MainThreadLabel = !0;
            q.getThreadedWasmWorker = function () {
                return D;
            };
            var H = function (d) {
                window.parent.loadThreadedBackend(d, { 'Wasm.wasm': 1e7, 'Wasm.js': 15e4 }, window);
                this.eventListeners = [];
            };
            H.prototype = {
                addEventListener: function (d, a) {
                    if ('message' === d) this.eventListeners.push(a);
                    else throw Error('event type '.concat(d, ' is not supported by WasmWorker.'));
                },
                removeEventListener: function (d, a) {
                    'message' === d &&
                        (this.eventListeners = this.eventListeners.filter(function (f) {
                            return f !== a;
                        }));
                },
                sendTestResponse: function () {
                    m &&
                        t &&
                        (this.handleMessage({ action: 'test', data: { supportTypedArray: !0, supportTransfers: !0 } }),
                        (this.postMessage = K));
                },
                postMessage: function (d) {
                    if ('test' === d.action) (t = !0), this.sendTestResponse();
                    else throw Error('Need to do handshake first!');
                },
                handleMessage: function (d) {
                    var a = d.callbackId,
                        f = d.data;
                    if (a in C) f && f.docId ? (B[f.docId] = C[a]) : Object(k.c)(C[a]), delete C[a];
                    else if (a in A) {
                        if (!d.hasOwnProperty('error')) {
                            var u = A[a].filePath,
                                x = q.FS.readFile(u, { encoding: 'binary' });
                            f.fileData = x.buffer;
                            f = A[a].docId;
                            f in B && (Object(k.c)(B[f]), delete B[f]);
                            f && !A[a].finishedWithDocument ? (B[f] = u) : q.FS.unlink(u);
                        }
                        delete A[a];
                    } else a in F && ((u = F[a]), u in B && (Object(k.c)(B[u]), delete B[u]), delete F[a]);
                    d = y(d);
                    window.parent.postMessage(d);
                },
                reset: function () {
                    D = null;
                    v = t = m = !1;
                }
            };
            var b = (function () {
                    var d = {},
                        a = new Promise(function (f, u) {
                            d.resolve = f;
                            d.reject = u;
                        });
                    d.promise = a;
                    return d;
                })(),
                c = function f(a) {
                    'object' === n(a.data) &&
                        'action' in a.data &&
                        'workerLoaded' === a.data.action &&
                        (b.resolve(D), D.removeEventListener('message', f));
                };
            window.addEventListener('message', function (a) {
                a = a.data;
                'loadWasmWorker' === a.action
                    ? ((g = a.workerFolder),
                      (D = new H(''.concat(a.wasmSource, 'PDFNetThreaded'))),
                      v || D.addEventListener('message', c))
                    : D.postMessage(a);
            });
            q.getWasmWorkerPromise = function () {
                return b.promise;
            };
        },
        function (p, l) {
            l = (function () {
                return this;
            })();
            try {
                l = l || new Function('return this')();
            } catch (r) {
                'object' === typeof window && (l = window);
            }
            p.exports = l;
        },
        function (p, l) {
            window.Module = { chunkMax: 100, docs: {} };
        }
    ]);
}.call(this || window));
