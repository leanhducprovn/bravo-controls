/** Notice * This file contains works from many authors under various (but compatible) licenses. Please see core.txt for more information. **/
(function () {
    (window.wpCoreControlsBundle = window.wpCoreControlsBundle || []).push([
        [4],
        {
            495: function (Ba, va, r) {
                var oa = r(0);
                Ba = r(87);
                var na = r(49);
                r = (function (ma) {
                    function fa() {
                        return (null !== ma && ma.apply(this, arguments)) || this;
                    }
                    Object(oa.c)(fa, ma);
                    fa.prototype.testSelection = function (da, aa, y) {
                        return na.a.Al(da, aa, y);
                    };
                    return fa;
                })(Ba.a);
                va.a = r;
            },
            86: function (Ba, va, r) {
                function oa(mb) {
                    return Object(za.b)(void 0, void 0, void 0, function () {
                        var nb, rb, sb, xa, Na, Za, cb, jb, zb, eb, lb, tb, Cb, Nb, ib;
                        return Object(za.d)(this, function (ub) {
                            switch (ub.label) {
                                case 0:
                                    return (
                                        (nb = mb.wb),
                                        (rb = mb.RE),
                                        (sb = mb.SE),
                                        (xa = mb.aL),
                                        (Na = mb.mha),
                                        (Za = mb.Yga),
                                        (cb = bb.getDocument()),
                                        (jb = [1]),
                                        [4, Object(Ha.c)(rb, { extension: 'pdf' })]
                                    );
                                case 1:
                                    return (zb = ub.ca()), (eb = bb.ma()), (Cb = (tb = Ga.a).Sja), [4, zb.JC()];
                                case 2:
                                    return (
                                        (lb = Cb.apply(tb, [ub.ca().xfdfString, nb])),
                                        (Nb = !0),
                                        [4, cb.Sf(zb, jb, nb, Nb)]
                                    );
                                case 3:
                                    return ub.ca(), [4, cb.Eg([nb + 1], Nb)];
                                case 4:
                                    return (
                                        ub.ca(),
                                        (ib = eb.nb().filter(function (Fb) {
                                            return Fb.uL() && Fb.PageNumber === nb;
                                        })),
                                        eb.Jf(ib, { force: !0, source: 'contentEditTool' }),
                                        [4, eb.bL(lb)]
                                    );
                                case 5:
                                    return (
                                        ub.ca(),
                                        Fa || (bb.getDocument().TM(), bb.SM(nb), bb.re()),
                                        aa(nb),
                                        Za || Na || (ba(nb, sb.galleys, xa, Na), ba(nb, sb.objects, xa, Na)),
                                        [2]
                                    );
                            }
                        });
                    });
                }
                function na(mb) {
                    if (mb) return ma(mb.contents);
                    Object(Ma.g)('Unable to extract document content');
                }
                function ma(mb) {
                    mb = new DOMParser().parseFromString(mb, 'text/html').documentElement.querySelector('body');
                    mb.querySelectorAll('p').forEach(function (nb) {
                        nb.querySelectorAll('span').forEach(function (xa) {
                            var Na = xa.getAttribute('style');
                            Na = fa(Na, xa.innerHTML);
                            xa.innerHTML = Na;
                        });
                        var rb = nb.getAttribute('style'),
                            sb = nb.innerHTML.replaceAll('<br>', '');
                        nb.innerHTML = fa(rb, sb);
                    });
                    return mb.innerHTML.trim();
                }
                function fa(mb, nb) {
                    if (null === mb || void 0 === mb ? 0 : mb.includes('bold')) nb = '<strong>' + nb + '</strong>';
                    if (null === mb || void 0 === mb ? 0 : mb.includes('italic')) nb = '<em>' + nb + '</em>';
                    if (
                        (null === mb || void 0 === mb ? 0 : mb.includes('underline:1;')) ||
                        (null === mb || void 0 === mb ? 0 : mb.includes('text-decoration: underline'))
                    )
                        nb = '<u>' + nb + '</u>';
                    return nb;
                }
                function da(mb) {
                    if (['STRONG', 'EM', 'U'].includes(mb.tagName) && null !== mb.getAttribute('style')) {
                        var nb = document.createElement('span'),
                            rb = mb.style.color;
                        rb = ca(rb);
                        nb.setAttribute('style', 'color:' + rb);
                        mb.removeAttribute('style');
                        nb.innerHTML = mb.innerHTML;
                        mb.innerHTML = '';
                        mb.appendChild(nb);
                    } else
                        'SPAN' === mb.tagName && null !== mb.getAttribute('style')
                            ? ((rb = mb.style.color), (rb = ca(rb)), mb.setAttribute('style', 'color:' + rb))
                            : 'A' === mb.tagName && mb.removeAttribute('style');
                }
                function aa(mb) {
                    var nb = bb.ma(),
                        rb = nb.nb().filter(function (sb) {
                            return sb.Qe() && sb.PageNumber === mb;
                        });
                    nb.Jf(rb, { force: !0, source: 'contentEditTool' });
                }
                function y(mb, nb) {
                    nb.forEach(function (rb) {
                        Ta[mb] || (Ta[mb] = []);
                        Ta[mb].find(function (sb) {
                            return sb.id === rb.id;
                        }) || Ta[mb].push(rb);
                    });
                }
                function x(mb, nb) {
                    nb.forEach(function (rb) {
                        Oa[mb] || (Oa[mb] = []);
                        Oa[mb].find(function (sb) {
                            return sb.id === rb.id;
                        }) || Oa[mb].push(rb);
                    });
                }
                function h(mb, nb, rb, sb) {
                    return Object(za.b)(void 0, void 0, void 0, function () {
                        var xa, Na, Za, cb, jb, zb, eb, lb, tb, Cb, Nb, ib, ub, Fb, Mb, Sb, Rb, Zb;
                        return Object(za.d)(this, function (ya) {
                            switch (ya.label) {
                                case 0:
                                    if (!mb) return [2];
                                    xa = nb.replaceAll('<p><br></p>', '');
                                    Na = b(xa);
                                    Na = Na.replace(/<span style="color: var\(--text-color\);">(.*?)<\/span>/g, '$1');
                                    Na = Na.replace(/<span class="ql-cursor">(.*?)<\/span>/g, '');
                                    Za = mb.ef.id;
                                    cb = mb.PageNumber;
                                    jb = Xa[cb];
                                    zb = jb.galleys.find(function (hc) {
                                        return hc.id === Za;
                                    });
                                    eb = ma(zb.contents);
                                    lb = ka(cb, jb, eb, Na, Za);
                                    if ('' === lb) return [3, 2];
                                    tb = new TextEncoder();
                                    Cb = tb.encode(lb);
                                    Nb = Cb.buffer;
                                    ib = Object(Ja.c)() || 'https://www.pdftron.com/webfonts/v2/';
                                    ub = bb.getDocument();
                                    return [4, ub.ae([cb])];
                                case 1:
                                    return (
                                        (Fb = ya.ca()),
                                        (tb = new TextEncoder()),
                                        (Mb = tb.encode('')),
                                        (Sb = Mb.buffer),
                                        Wa.postMessage(
                                            {
                                                cmd: 'importText',
                                                pdfFile: Fb,
                                                pageNumber: cb,
                                                webFontURL: ib,
                                                galleyId: Za,
                                                importData: Nb,
                                                tableData: Sb,
                                                isSearchReplace: rb,
                                                callbackMapId: sb
                                            },
                                            [Nb, Sb]
                                        ),
                                        (Rb = {}),
                                        zb &&
                                            ((Zb = zb.galleyBox),
                                            (Rb = { top: Zb.top, left: Zb.left, bottom: Zb.bottom, right: Zb.right })),
                                        Object(Da.w)(eb, Na, Rb),
                                        [3, 3]
                                    );
                                case 2:
                                    Object(Ma.g)('Unable to generate import XML'), (ya.label = 3);
                                case 3:
                                    return [2];
                            }
                        });
                    });
                }
                function b(mb) {
                    var nb = new DOMParser(),
                        rb = nb.parseFromString(mb, 'text/xml');
                    rb.querySelector('parsererror') && (rb = nb.parseFromString('<Root>' + mb + '</Root>', 'text/xml'));
                    rb.querySelectorAll('a').forEach(function (sb) {
                        var xa = sb.childNodes[0];
                        Array.from(sb.querySelectorAll('*')).find(function (Na) {
                            return 'u' === Na.tagName.toLowerCase();
                        }) || ((sb = document.createElement('u')), xa.after(sb), sb.appendChild(xa));
                    });
                    return new XMLSerializer().serializeToString(rb);
                }
                function e(mb, nb, rb) {
                    return Object(za.b)(void 0, void 0, void 0, function () {
                        var sb, xa, Na, Za;
                        return Object(za.d)(this, function (cb) {
                            switch (cb.label) {
                                case 0:
                                    return aa(nb), (Oa[nb] = []), (Ta[nb] = []), [4, mb.ae([nb])];
                                case 1:
                                    return (
                                        (sb = cb.ca()),
                                        (xa = new TextEncoder()),
                                        (Na = xa.encode('')),
                                        (Za = Na.buffer),
                                        Wa.postMessage(
                                            {
                                                cmd: 'exportFile',
                                                pageNumber: nb,
                                                performExport: rb,
                                                pdfFile: sb,
                                                tableData: Za
                                            },
                                            [sb, Za]
                                        ),
                                        [2]
                                    );
                            }
                        });
                    });
                }
                function a(mb) {
                    return Object(za.b)(void 0, void 0, void 0, function () {
                        return Object(za.d)(this, function () {
                            pb ||
                                ((bb = mb),
                                (pb = new Promise(function (nb, rb) {
                                    var sb = window.Core.ContentEdit.getWorkerPath(),
                                        xa = window.Core.ContentEdit.getResourcePath();
                                    Wa = new Worker(sb + 'InfixServerModule.js');
                                    Wa.onmessage = function (Na) {
                                        ia(Na, nb, rb);
                                    };
                                    Wa.postMessage({ cmd: 'isReady', resourcePath: xa });
                                })));
                            return [2, pb];
                        });
                    });
                }
                function f(mb, nb, rb, sb) {
                    this.top = mb;
                    this.left = nb;
                    this.bottom = rb;
                    this.right = sb;
                    this.topVal = function () {
                        return Math.round(this.top);
                    };
                    this.bottomVal = function () {
                        return Math.round(this.bottom);
                    };
                    this.leftVal = function () {
                        return Math.round(this.left);
                    };
                    this.rightVal = function () {
                        return Math.round(this.right);
                    };
                    this.height = function () {
                        return Math.round(Math.abs(this.top - this.bottom));
                    };
                    this.width = function () {
                        return Math.round(this.right - this.left);
                    };
                    this.FS = function (xa) {
                        return (
                            this.topVal() !== xa.topVal() ||
                            this.leftVal() !== xa.leftVal() ||
                            this.bottomVal() !== xa.bottomVal() ||
                            this.rightVal() !== xa.rightVal()
                        );
                    };
                }
                function n(mb, nb, rb, sb, xa) {
                    this.id = mb;
                    this.pagenum = nb;
                    this.galleysContents = rb;
                    this.contents = sb;
                    this.galleyBox = xa;
                    Object(Da.v)(Oa);
                }
                function z(mb, nb, rb, sb) {
                    this.id = nb;
                    this.type = mb;
                    this.bbox = rb;
                    this.pagenum = sb;
                }
                function w(mb, nb, rb, sb, xa) {
                    this.id = mb;
                    this.pagecount = nb;
                    this.pageBBox = rb;
                    this.galleys = sb;
                    this.objects = xa;
                }
                function ea(mb, nb) {
                    this.family = mb;
                    this.variations = nb;
                }
                function ka(mb, nb, rb, sb, xa) {
                    var Na = [],
                        Za = [];
                    new DOMParser()
                        .parseFromString(sb, 'text/html')
                        .documentElement.querySelectorAll('p')
                        .forEach(function (lb, tb) {
                            Na[tb] = lb.innerHTML;
                            Za[tb] = {
                                fontSize: lb.style.fontSize,
                                fontFamily: lb.style.fontFamily,
                                color: ca(lb.style.color)
                            };
                        });
                    rb = new DOMParser().parseFromString(rb, 'text/html');
                    var cb = null;
                    rb.documentElement.querySelectorAll('p').forEach(function (lb, tb) {
                        if (tb < Na.length) {
                            var Cb = new DOMParser()
                                .parseFromString(Na[tb], 'text/html')
                                .documentElement.querySelector('body');
                            Cb.childNodes.forEach(function (ib) {
                                da(ib);
                            });
                            lb.innerHTML = Cb.innerHTML;
                            cb = lb.getAttribute('style');
                            Cb = Za[tb].fontSize ? Za[tb].fontSize : lb.style.fontSize;
                            var Nb = Za[tb].fontFamily
                                ? Za[tb].fontFamily.replace(/\s+/g, '').replace(/['"]+/g, '')
                                : lb.style.fontFamily;
                            tb = Za[tb].color ? Za[tb].color : null;
                            cb = cb.replace(/(font:.*?;)/i, 'font:normal normal ' + Cb + ' ' + Nb + ';');
                            cb = cb.replace('Italic', '');
                            cb = cb.replace('underline:1;', 'underline:0;');
                            cb = cb.replace('text-decoration: underline;', 'text-decoration: none;');
                            tb && (cb = cb.replace(/(color:.*?;)/i, 'color:' + tb + ';'));
                            lb.setAttribute('style', cb);
                        } else lb.remove();
                    });
                    for (sb = rb.documentElement.querySelectorAll('p').length; sb < Na.length; sb++) {
                        var jb = document.createElement('p');
                        jb.setAttribute('id', '0');
                        var zb = new DOMParser()
                            .parseFromString(Na[sb], 'text/html')
                            .documentElement.querySelector('body');
                        zb.childNodes.forEach(function (lb) {
                            da(lb);
                        });
                        jb.innerHTML = zb.innerHTML;
                        null != cb && jb.setAttribute('style', cb);
                        rb.documentElement.querySelector('body').appendChild(jb);
                    }
                    rb = rb.documentElement.querySelector('body').innerHTML;
                    var eb = '';
                    Oa[mb].forEach(function (lb) {
                        lb.id === xa && (eb = lb);
                    });
                    if ('' === eb) return '';
                    nb = "<DOC id='" + nb.id + "' pagecount='" + nb.pagecount + "'>";
                    nb =
                        nb +
                        ("<STORY galley_ids='" + xa + "' pagenum='" + mb + "'><galleys>") +
                        (eb.galleysContents + '</galleys>');
                    eb.contents = rb;
                    nb = nb + rb + '\n</STORY>';
                    return (nb += '</DOC>');
                }
                function ca(mb) {
                    return mb.startsWith('rgb(')
                        ? '#' +
                              mb
                                  .replace(/^[^\d]+/, '')
                                  .replace(/[^\d]+$/, '')
                                  .split(',')
                                  .map(function (nb) {
                                      return ('00' + parseInt(nb, 10).toString(16)).slice(-2);
                                  })
                                  .join('')
                        : mb;
                }
                function ba(mb, nb, rb, sb) {
                    var xa = [],
                        Na = bb.getDocument(),
                        Za = null;
                    nb.forEach(function (cb) {
                        if (cb instanceof z) {
                            var jb = Na.mo(mb, cb.bbox.leftVal(), cb.bbox.topVal());
                            var zb = jb.x;
                            var eb = jb.y;
                            var lb = Na.mo(mb, cb.bbox.rightVal(), cb.bbox.bottomVal());
                            jb = lb.x;
                            lb = lb.y;
                        } else if (cb instanceof n)
                            (jb = Na.mo(mb, cb.galleyBox.leftVal(), cb.galleyBox.topVal())),
                                (zb = jb.x),
                                (eb = jb.y),
                                (lb = Na.mo(mb, cb.galleyBox.rightVal(), cb.galleyBox.bottomVal())),
                                (jb = lb.x),
                                (lb = lb.y);
                        else return;
                        var tb = new window.Core.Annotations.RectangleAnnotation(),
                            Cb = Ra.a.OBJECT;
                        cb instanceof n && (Cb = Ra.a.TEXT);
                        tb.Fma(cb, Cb);
                        tb.PageNumber = cb.pagenum;
                        tb.X = zb;
                        tb.Y = eb;
                        tb.Width = jb - zb;
                        tb.Height = lb - eb;
                        tb.StrokeColor = new Ia.a('#3183C8');
                        tb.FillColor = new Ia.a(255, 255, 255, 0.01);
                        tb.Style = 'dash';
                        tb.Dashes = '4,3';
                        if (Va || sb) (tb.NoView = !0), (tb.Listable = !1);
                        tb.Gw();
                        tb.selectionModel = Aa.a;
                        xa.push(tb);
                        'undefined' !== typeof rb && rb === cb.id && (Za = tb);
                    });
                    nb = bb.ma();
                    nb.Yg(xa);
                    !Za || Va || sb || nb.Zf(Za);
                    nb.le(xa);
                }
                function ia(mb, nb, rb) {
                    return Object(za.b)(this, void 0, void 0, function () {
                        var sb, xa, Na, Za, cb, jb, zb, eb, lb, tb;
                        return Object(za.d)(this, function (Cb) {
                            switch (Cb.label) {
                                case 0:
                                    sb = mb.data;
                                    Na = sb.cmd;
                                    switch (Na) {
                                        case 'isReady':
                                            return [3, 1];
                                        case 'initialiseInfixServer':
                                            return [3, 3];
                                        case 'loadAvailableFonts':
                                            return [3, 4];
                                        case 'exportFile':
                                            return [3, 5];
                                        case 'insertNewTextBox':
                                            return [3, 6];
                                        case 'importText':
                                            return [3, 7];
                                        case 'transformObject':
                                            return [3, 7];
                                        case 'alignParagraph':
                                            return [3, 7];
                                        case 'deleteObject':
                                            return [3, 8];
                                        case 'insertImage':
                                            return [3, 9];
                                    }
                                    return [3, 10];
                                case 1:
                                    return [4, Object(Pa.b)()];
                                case 2:
                                    return (
                                        (Za = Cb.ca()), Wa.postMessage({ cmd: 'initialiseInfixServer', l: Za }), [3, 10]
                                    );
                                case 3:
                                    return (
                                        (cb = ha(sb.resultsXML))
                                            ? (nb(),
                                              (jb = Object(Ja.c)() || 'https://www.pdftron.com/webfonts/v2/'),
                                              Wa.postMessage({ cmd: 'loadAvailableFonts', webFontURL: jb }))
                                            : rb('License key does not have content edit permission'),
                                        [3, 10]
                                    );
                                case 4:
                                    return wa(sb.resultsXML), [3, 10];
                                case 5:
                                    return (
                                        sb.exportPerformed
                                            ? ja(sb.pageNumber, sb.exportXML, sb.objectXML, sb.resultsXML)
                                            : ((xa = Xa[sb.pageNumber]),
                                              x(sb.pageNumber, xa.galleys),
                                              y(sb.pageNumber, xa.objects),
                                              aa(sb.pageNumber),
                                              ba(sb.pageNumber, xa.galleys),
                                              ba(sb.pageNumber, xa.objects)),
                                        ob.resolve(),
                                        qb && qb[sb.pageNumber] && qb[sb.pageNumber].resolve(),
                                        [3, 10]
                                    );
                                case 6:
                                    return (
                                        la(sb.pageNumber, sb.exportXML, sb.contentHTML),
                                        (xa = Xa[sb.pageNumber]),
                                        oa({ wb: sb.pageNumber, RE: sb.pdfBuffer, SE: xa, aL: sb.id }),
                                        [3, 10]
                                    );
                                case 7:
                                    xa = Xa[sb.pageNumber];
                                    ua(sb.pageNumber, sb.resultsXML);
                                    oa({
                                        wb: sb.pageNumber,
                                        RE: sb.pdfBuffer,
                                        SE: xa,
                                        aL: sb.id,
                                        mha: sb.isSearchReplace
                                    });
                                    zb = sb.isSearchReplace;
                                    eb = sb.callbackMapId;
                                    if (zb && eb && Eb[eb]) Eb[eb]();
                                    return [3, 10];
                                case 8:
                                    return (
                                        (xa = Xa[sb.pageNumber]),
                                        ua(sb.pageNumber, sb.resultsXML),
                                        (xa.galleys = xa.galleys.filter(function (Nb) {
                                            return Nb.id !== sb.id;
                                        })),
                                        (xa.objects = xa.objects.filter(function (Nb) {
                                            return Nb.id !== sb.id;
                                        })),
                                        (lb = { wb: sb.pageNumber, RE: sb.pdfBuffer, SE: xa }),
                                        oa(lb),
                                        [3, 10]
                                    );
                                case 9:
                                    return (
                                        (xa = Xa[sb.pageNumber]),
                                        ua(sb.pageNumber, sb.resultsXML),
                                        (tb = { wb: sb.pageNumber, RE: sb.pdfBuffer, SE: xa, aL: sb.isText, Yga: !0 }),
                                        oa(tb),
                                        [3, 10]
                                    );
                                case 10:
                                    return [2];
                            }
                        });
                    });
                }
                function ha(mb) {
                    mb = new Uint8Array(mb);
                    var nb = new TextDecoder('utf-8').decode(mb);
                    mb = !1;
                    nb = new DOMParser().parseFromString(nb, 'text/xml').getElementsByTagName('LicenseCheck');
                    null !== nb &&
                        0 < nb.length &&
                        ((nb = nb[0].getElementsByTagName('Status')[0].innerHTML),
                        'error' !== nb && 'ok' === nb && (mb = !0));
                    return mb;
                }
                function la(mb, nb) {
                    nb = new TextDecoder('utf-8').decode(nb);
                    nb = new DOMParser().parseFromString(nb, 'text/xml').getElementsByTagName('STORY');
                    var rb = Array.prototype.slice.call(nb)[0];
                    nb = rb.getAttribute('galley_ids');
                    var sb = Array.prototype.slice.call(rb.getElementsByTagName('g'))[0],
                        xa = sb.getAttribute('bbox').split(' ');
                    xa = new f(parseFloat(xa[0]), parseFloat(xa[1]), parseFloat(xa[2]), parseFloat(xa[3]));
                    sb = sb.innerHTML;
                    var Na = Array.prototype.slice.call(rb.getElementsByTagName('galleys'))[0];
                    Na.parentNode.removeChild(Na);
                    rb = sa(rb.innerHTML).trim();
                    nb = new n(nb, mb, sb, rb, xa);
                    rb = Xa[mb];
                    xa = rb.galleys;
                    xa.push(nb);
                    rb.galleys = xa;
                    Xa[mb] = rb;
                    x(mb, rb.galleys);
                    y(mb, rb.objects);
                    aa(mb);
                    ba(mb, rb.galleys);
                    ba(mb, rb.objects);
                }
                function ja(mb, nb, rb, sb) {
                    var xa = new Uint8Array(nb),
                        Na = new TextDecoder('utf-8');
                    nb = Na.decode(xa);
                    xa = new Uint8Array(rb);
                    rb = Na.decode(xa);
                    xa = new Uint8Array(sb);
                    sb = Na.decode(xa);
                    Xa[mb] = pa(mb, nb, rb, sb);
                    sb = Xa[mb];
                    x(mb, sb.galleys);
                    y(mb, sb.objects);
                    aa(mb);
                    ba(mb, sb.galleys);
                    ba(mb, sb.objects);
                }
                function ra(mb, nb) {
                    mb = parseFloat(mb);
                    return isNaN(nb) || nb < mb ? mb : nb;
                }
                function pa(mb, nb, rb, sb) {
                    var xa;
                    var Na = new DOMParser();
                    sb = Na.parseFromString(sb, 'text/xml');
                    Array.prototype.slice.call(sb.getElementsByTagName('BBox')).forEach(function (jb) {
                        if ('CropBox' === jb.getAttribute('Name')) {
                            var zb = parseFloat(jb.getElementsByTagName('Top').item(0).innerHTML),
                                eb = parseFloat(jb.getElementsByTagName('Bottom').item(0).innerHTML),
                                lb = parseFloat(jb.getElementsByTagName('Left').item(0).innerHTML);
                            jb = parseFloat(jb.getElementsByTagName('Right').item(0).innerHTML);
                            xa = new f(zb, lb, eb, jb);
                        }
                    });
                    Na = new DOMParser();
                    sb = Na.parseFromString(nb, 'text/xml');
                    var Za = [];
                    Array.prototype.slice.call(sb.getElementsByTagName('STORY')).forEach(function (jb) {
                        var zb = jb.getAttribute('galley_ids'),
                            eb = Array.prototype.slice.call(jb.getElementsByTagName('g'))[0],
                            lb = eb.getAttribute('bbox').split(' ');
                        lb = new f(parseFloat(lb[0]), parseFloat(lb[1]), parseFloat(lb[2]), parseFloat(lb[3]));
                        eb = eb.innerHTML;
                        var tb = Array.prototype.slice.call(jb.getElementsByTagName('galleys'))[0];
                        tb.parentNode.removeChild(tb);
                        jb = sa(jb.innerHTML).trim();
                        zb = new n(zb, mb, eb, jb, lb);
                        Za.push(zb);
                    });
                    Na = new DOMParser();
                    var cb = [];
                    nb = Na.parseFromString(rb, 'text/xml').getElementsByTagName('Object');
                    Array.prototype.slice.call(nb).forEach(function (jb) {
                        var zb = jb.getAttribute('Type'),
                            eb = jb.getAttribute('OID');
                        jb = Array.prototype.slice.call(jb.getElementsByTagName('Point'));
                        var lb = Number.NaN,
                            tb = Number.NaN,
                            Cb = Number.NaN,
                            Nb = Number.NaN;
                        jb.forEach(function (ib) {
                            var ub = ib.getAttribute('Name');
                            'TL' === ub
                                ? ((lb = ra(ib.getAttribute('Y'), lb)), (Cb = ra(ib.getAttribute('X'), Cb)))
                                : 'TR' === ub
                                ? ((lb = ra(ib.getAttribute('Y'), lb)), (Nb = ra(ib.getAttribute('X'), Nb)))
                                : 'BR' === ub
                                ? ((tb = ra(ib.getAttribute('Y'), tb)), (Nb = ra(ib.getAttribute('X'), Nb)))
                                : 'BL' === ub &&
                                  ((tb = ra(ib.getAttribute('Y'), tb)), (Cb = ra(ib.getAttribute('X'), Cb)));
                        });
                        jb = new f(lb, Cb, tb, Nb);
                        zb = new z(zb, eb, jb, mb);
                        cb.push(zb);
                    });
                    nb = Array.prototype.slice.call(sb.getElementsByTagName('DOC'))[0].getAttribute('id');
                    return new w(nb, 1, xa, Za, cb);
                }
                function sa(mb) {
                    return new DOMParser().parseFromString(mb, 'text/html').documentElement.querySelector('body')
                        .innerHTML;
                }
                function ua(mb, nb) {
                    var rb;
                    nb = new TextDecoder('utf-8').decode(nb);
                    var sb = new DOMParser().parseFromString(nb, 'text/xml');
                    nb = sb.getElementsByTagName('Galley').item(0);
                    if (null != nb) {
                        var xa = nb.getAttribute('id');
                        nb = sb.getElementsByTagName('BBox');
                        nb = Array.prototype.slice.call(nb);
                        nb.forEach(function (cb) {
                            var jb = cb.getElementsByTagName('Top'),
                                zb = parseFloat(jb.item(0).innerHTML);
                            jb = cb.getElementsByTagName('Left');
                            var eb = parseFloat(jb.item(0).innerHTML);
                            jb = cb.getElementsByTagName('Bottom');
                            var lb = parseFloat(jb.item(0).innerHTML);
                            jb = cb.getElementsByTagName('Right');
                            cb = parseFloat(jb.item(0).innerHTML);
                            rb = new f(zb, eb, lb, cb);
                        });
                        Oa[mb].forEach(function (cb) {
                            cb.id === xa && !0 === rb.FS(cb.galleyBox) && (cb.galleyBox = rb);
                        });
                    }
                    nb = sb.getElementsByTagName('Object').item(0);
                    if (null != nb) {
                        var Na = nb.getAttribute('OID');
                        nb = sb.getElementsByTagName('BBox');
                        nb = Array.prototype.slice.call(nb);
                        nb.forEach(function (cb) {
                            var jb = cb.getElementsByTagName('Top'),
                                zb = parseFloat(jb.item(0).innerHTML);
                            jb = cb.getElementsByTagName('Left');
                            var eb = parseFloat(jb.item(0).innerHTML);
                            jb = cb.getElementsByTagName('Bottom');
                            var lb = parseFloat(jb.item(0).innerHTML);
                            jb = cb.getElementsByTagName('Right');
                            cb = parseFloat(jb.item(0).innerHTML);
                            rb = new f(zb, eb, lb, cb);
                        });
                        Ta[mb].forEach(function (cb) {
                            cb.id === Na && !0 === rb.FS(cb.bbox) && (cb.bbox = rb);
                        });
                    }
                    nb = sb.getElementsByTagName('NewParas').item(0);
                    if (null != nb) {
                        var Za = nb.getAttribute('id');
                        Oa[mb].forEach(function (cb) {
                            if (cb.id === Za) {
                                var jb = '<Contents>' + cb.contents;
                                jb += '</Contents>';
                                var zb = Array.prototype.slice.call(sb.getElementsByTagName('NewPara'));
                                jb = new DOMParser().parseFromString(jb, 'text/xml');
                                var eb = Array.prototype.slice.call(jb.getElementsByTagName('p'));
                                zb.forEach(function (lb) {
                                    var tb = parseFloat(lb.innerHTML),
                                        Cb = !1;
                                    eb.forEach(function (Nb) {
                                        var ib = Nb.getAttribute('id');
                                        !1 === Cb && '0' === ib && (Nb.setAttribute('id', tb), (Cb = !0));
                                    });
                                });
                                cb.contents = jb.getElementsByTagName('Contents').item(0).innerHTML;
                            }
                        });
                    }
                }
                function qa(mb) {
                    return {
                        regex: 0 !== (mb & Ya.f.sv),
                        wildcard: 0 !== (mb & Ya.f.Jr),
                        wholeWord: 0 !== (mb & Ya.f.uv),
                        caseSensitive: 0 !== (mb & Ya.f.Ar)
                    };
                }
                function wa(mb) {
                    mb = new Uint8Array(mb);
                    mb = new TextDecoder('utf-8').decode(mb);
                    mb = new DOMParser().parseFromString(mb, 'text/xml').getElementsByTagName('Font');
                    var nb = {};
                    Array.prototype.slice.call(mb).forEach(function (rb) {
                        var sb = rb.getAttribute('Family');
                        sb in nb || (nb[sb] = {});
                        var xa = [];
                        Array.prototype.slice.call(rb.getElementsByTagName('Variation')).forEach(function (Na) {
                            Na = Na.innerHTML;
                            xa.push(Na);
                            if (Na.includes('Regular') || Na === sb.replace(/\s+/g, '')) nb[sb].hasRegular = !0;
                            Na.includes('Bold') && (nb[sb].hasBold = !0);
                            Na.includes('Italic') && (nb[sb].hasItalic = !0);
                        });
                        rb = new ea(sb, xa);
                        vb.push(rb);
                    });
                    Ib = Object.keys(nb).filter(function (rb) {
                        return nb[rb].hasRegular && nb[rb].hasBold && nb[rb].hasItalic;
                    });
                }
                r.r(va);
                var za = r(0),
                    Ha = r(55),
                    Ia = r(7),
                    Aa = r(495),
                    Ja = r(39),
                    Pa = r(75),
                    Ma = r(2),
                    Ra = r(172),
                    Da = r(56),
                    Ga = r(6),
                    Sa = r(13),
                    Qa = r(149),
                    Ya = r(25),
                    db = r(10),
                    Wa = null,
                    pb = null,
                    Va = !1,
                    Fa = !1,
                    Oa = {},
                    Ta = {},
                    Xa = {},
                    bb,
                    ob = window.createPromiseCapability(),
                    qb = [],
                    vb = [],
                    Ib = [],
                    Eb = {};
                va['default'] = {
                    Oja: a,
                    Qja: e,
                    l$: function (mb) {
                        return Object(za.b)(void 0, void 0, void 0, function () {
                            var nb, rb, sb, xa, Na, Za, cb, jb;
                            return Object(za.d)(this, function (zb) {
                                switch (zb.label) {
                                    case 0:
                                        return (
                                            (nb = mb.id),
                                            (rb = mb.isText),
                                            (sb = mb.pageNumber),
                                            (xa = bb.getDocument()),
                                            [4, xa.ae([sb])]
                                        );
                                    case 1:
                                        return (
                                            (Na = zb.ca()),
                                            (Za = new TextEncoder()),
                                            (cb = Za.encode('')),
                                            (jb = cb.buffer),
                                            Wa.postMessage(
                                                {
                                                    cmd: 'deleteObject',
                                                    pdfFile: Na,
                                                    pageNumber: sb,
                                                    objectID: nb,
                                                    isText: rb,
                                                    tableData: jb
                                                },
                                                [jb]
                                            ),
                                            [2]
                                        );
                                }
                            });
                        });
                    },
                    Bpa: function (mb) {
                        return Object(za.b)(void 0, void 0, void 0, function () {
                            var nb, rb, sb, xa, Na, Za, cb, jb, zb, eb, lb, tb, Cb;
                            return Object(za.d)(this, function (Nb) {
                                switch (Nb.label) {
                                    case 0:
                                        return (
                                            (nb = mb.id),
                                            (rb = mb.position),
                                            (sb = rb.top),
                                            (xa = rb.left),
                                            (Na = rb.bottom),
                                            (Za = rb.right),
                                            (cb = mb.isText),
                                            (jb = mb.pageNumber),
                                            (zb = bb.getDocument()),
                                            [4, zb.ae([jb])]
                                        );
                                    case 1:
                                        return (
                                            (eb = Nb.ca()),
                                            (lb = new TextEncoder()),
                                            (tb = lb.encode('')),
                                            (Cb = tb.buffer),
                                            Wa.postMessage(
                                                {
                                                    cmd: 'transformObject',
                                                    pdfFile: eb,
                                                    pageNumber: jb,
                                                    objectID: nb,
                                                    isText: cb,
                                                    topVal: sb,
                                                    leftVal: xa,
                                                    bottomVal: Na,
                                                    rightVal: Za,
                                                    tableData: Cb
                                                },
                                                [Cb]
                                            ),
                                            [2]
                                        );
                                }
                            });
                        });
                    },
                    X6: function (mb, nb) {
                        return Object(za.b)(void 0, void 0, void 0, function () {
                            var rb, sb, xa, Na, Za, cb, jb, zb, eb, lb, tb, Cb, Nb, ib, ub;
                            return Object(za.d)(this, function (Fb) {
                                switch (Fb.label) {
                                    case 0:
                                        return (
                                            (rb = '<DOC><STORY><galleys></galleys>'),
                                            (sb = []),
                                            (xa = new DOMParser().parseFromString(nb, 'text/html')),
                                            xa.documentElement.querySelectorAll('p').forEach(function (Mb, Sb) {
                                                sb[Sb] = Mb.innerHTML;
                                            }),
                                            sb.forEach(function (Mb, Sb) {
                                                Mb = new DOMParser()
                                                    .parseFromString(sb[Sb], 'text/html')
                                                    .documentElement.querySelector('body');
                                                Mb.childNodes.forEach(function (Rb) {
                                                    da(Rb);
                                                });
                                                rb += '<p>' + Mb.innerHTML + '</p>';
                                            }),
                                            (rb += '</STORY></DOC>'),
                                            (Na = mb.pageNumber),
                                            (Za = bb.getDocument()),
                                            (cb = mb.position),
                                            (jb = cb.top),
                                            (zb = cb.left),
                                            (eb = cb.bottom),
                                            (lb = cb.right),
                                            (tb = mb.defaultText),
                                            (Cb = mb.font),
                                            (Nb = mb.fontSize),
                                            (ib = mb.textColor),
                                            [4, Za.ae([Na])]
                                        );
                                    case 1:
                                        return (
                                            (ub = Fb.ca()),
                                            Wa.postMessage({
                                                cmd: 'insertNewTextBox',
                                                pdfFile: ub,
                                                pageNumber: Na,
                                                topVal: jb,
                                                leftVal: zb,
                                                bottomVal: eb,
                                                rightVal: lb,
                                                defaultText: tb,
                                                font: Cb,
                                                fontSize: Nb,
                                                textColor: ib,
                                                importData: rb,
                                                content: nb
                                            }),
                                            [2]
                                        );
                                }
                            });
                        });
                    },
                    Upa: h,
                    Ida: na,
                    $la: function (mb) {
                        return Object(za.b)(this, void 0, void 0, function () {
                            var nb,
                                rb,
                                sb,
                                xa,
                                Na,
                                Za,
                                cb,
                                jb,
                                zb,
                                eb,
                                lb,
                                tb,
                                Cb,
                                Nb,
                                ib,
                                ub,
                                Fb,
                                Mb,
                                Sb,
                                Rb,
                                Zb,
                                ya,
                                hc = this;
                            return Object(za.d)(this, function (sc) {
                                switch (sc.label) {
                                    case 0:
                                        nb = mb.replaceWith;
                                        rb = mb.documentViewer;
                                        sb = mb.search;
                                        xa = mb.searchResults;
                                        if (rb) {
                                            if (!xa && !sb)
                                                throw Error('The "searchResults" parameter is missing in the options');
                                            if (void 0 === nb)
                                                throw Error('The "replaceWith" parameter should not be undefined');
                                        } else throw Error('The "documentViewer" parameter is missing in the options');
                                        Na = 1 === xa.length;
                                        sb
                                            ? ((Za = sb.y8), (cb = sb.rqa))
                                            : ((jb = qa(rb.eV())), (Za = jb.y8), (cb = jb.rqa));
                                        zb = null;
                                        eb = [];
                                        if (Na) (zb = xa[0]), (eb = [zb.pageNum]);
                                        else
                                            try {
                                                eb = Object.keys(
                                                    xa.reduce(function (vc, Gc) {
                                                        vc[Gc.pageNum] = Gc.pageNum;
                                                        return vc;
                                                    }, {})
                                                ).map(function (vc) {
                                                    return Number(vc);
                                                });
                                            } catch (vc) {
                                                Object(Ma.i)(vc);
                                            }
                                        lb = 0;
                                        if (zb)
                                            for (
                                                tb = rb.qk(), Cb = -1, Nb = 0, ib = tb.length;
                                                Nb < ib &&
                                                ((ub = tb[Nb]),
                                                ub.pageNum === Cb ? lb++ : ((Cb = ub.pageNum), (lb = 0)),
                                                !Object(Qa.a)(ub, zb));
                                                Nb++
                                            );
                                        Fb = xa[0].resultStr;
                                        Mb = Za ? 'mg' : 'mgi';
                                        Sb = cb ? '\\b(' + Fb + ')\\b' : '(' + Fb + ')';
                                        Rb = new RegExp('(?<!</?[^>]*|&[^;]*)' + Sb, Mb);
                                        ob = window.createPromiseCapability();
                                        return pb ? [3, 2] : [4, a(rb)];
                                    case 1:
                                        sc.ca(), (sc.label = 2);
                                    case 2:
                                        return (
                                            (Va = !0),
                                            Da.a.trigger(db.d.SEARCH_AND_REPLACE_STARTED),
                                            (Zb = 0),
                                            (ya = eb.map(function (vc) {
                                                return Object(za.b)(hc, void 0, void 0, function () {
                                                    var Gc,
                                                        cd = this;
                                                    return Object(za.d)(this, function () {
                                                        Gc = new Promise(function (Ad, Qc) {
                                                            return Object(za.b)(cd, void 0, void 0, function () {
                                                                var Bd = this;
                                                                return Object(za.d)(this, function (je) {
                                                                    switch (je.label) {
                                                                        case 0:
                                                                            return (
                                                                                (qb[vc] =
                                                                                    window.createPromiseCapability()),
                                                                                [4, e(rb.getDocument(), vc, !0)]
                                                                            );
                                                                        case 1:
                                                                            return (
                                                                                je.ca(),
                                                                                qb[vc].promise
                                                                                    .then(function () {
                                                                                        return Object(za.b)(
                                                                                            Bd,
                                                                                            void 0,
                                                                                            void 0,
                                                                                            function () {
                                                                                                function kc(dd, ve) {
                                                                                                    return Object(za.b)(
                                                                                                        this,
                                                                                                        void 0,
                                                                                                        void 0,
                                                                                                        function () {
                                                                                                            var Qd, Vc;
                                                                                                            return Object(
                                                                                                                za.d
                                                                                                            )(
                                                                                                                this,
                                                                                                                function (
                                                                                                                    Wc
                                                                                                                ) {
                                                                                                                    switch (
                                                                                                                        Wc.label
                                                                                                                    ) {
                                                                                                                        case 0:
                                                                                                                            (Qd =
                                                                                                                                Sa.a.Ssa()),
                                                                                                                                (Eb[
                                                                                                                                    Qd
                                                                                                                                ] =
                                                                                                                                    function () {
                                                                                                                                        delete Eb[
                                                                                                                                            Qd
                                                                                                                                        ];
                                                                                                                                        Ad(
                                                                                                                                            !0
                                                                                                                                        );
                                                                                                                                        Da.a.trigger(
                                                                                                                                            db
                                                                                                                                                .d
                                                                                                                                                .SEARCH_AND_REPLACE_TEXT_REPLACED
                                                                                                                                        );
                                                                                                                                    }),
                                                                                                                                (Wc.label = 1);
                                                                                                                        case 1:
                                                                                                                            return (
                                                                                                                                Wc.hg.push(
                                                                                                                                    [
                                                                                                                                        1,
                                                                                                                                        3,
                                                                                                                                        ,
                                                                                                                                        4
                                                                                                                                    ]
                                                                                                                                ),
                                                                                                                                [
                                                                                                                                    4,
                                                                                                                                    h(
                                                                                                                                        dd,
                                                                                                                                        ve,
                                                                                                                                        !0,
                                                                                                                                        Qd
                                                                                                                                    )
                                                                                                                                ]
                                                                                                                            );
                                                                                                                        case 2:
                                                                                                                            return (
                                                                                                                                Wc.ca(),
                                                                                                                                [
                                                                                                                                    3,
                                                                                                                                    4
                                                                                                                                ]
                                                                                                                            );
                                                                                                                        case 3:
                                                                                                                            return (
                                                                                                                                (Vc =
                                                                                                                                    Wc.ca()),
                                                                                                                                Object(
                                                                                                                                    Ma.i
                                                                                                                                )(
                                                                                                                                    Vc
                                                                                                                                ),
                                                                                                                                Qc(
                                                                                                                                    Vc
                                                                                                                                ),
                                                                                                                                [
                                                                                                                                    3,
                                                                                                                                    4
                                                                                                                                ]
                                                                                                                            );
                                                                                                                        case 4:
                                                                                                                            return [
                                                                                                                                2
                                                                                                                            ];
                                                                                                                    }
                                                                                                                }
                                                                                                            );
                                                                                                        }
                                                                                                    );
                                                                                                }
                                                                                                var jc,
                                                                                                    Yd,
                                                                                                    ke,
                                                                                                    Cd,
                                                                                                    Hd,
                                                                                                    le,
                                                                                                    oc,
                                                                                                    Zd,
                                                                                                    Uc,
                                                                                                    md,
                                                                                                    Dd,
                                                                                                    Dc,
                                                                                                    Pd,
                                                                                                    me,
                                                                                                    $d,
                                                                                                    Id,
                                                                                                    Jd;
                                                                                                return Object(za.d)(
                                                                                                    this,
                                                                                                    function () {
                                                                                                        jc = bb.ma();
                                                                                                        Yd = jc
                                                                                                            .nb()
                                                                                                            .filter(
                                                                                                                function (
                                                                                                                    dd
                                                                                                                ) {
                                                                                                                    return (
                                                                                                                        dd.PageNumber ===
                                                                                                                        vc
                                                                                                                    );
                                                                                                                }
                                                                                                            )
                                                                                                            .filter(
                                                                                                                function (
                                                                                                                    dd
                                                                                                                ) {
                                                                                                                    return dd.Qe();
                                                                                                                }
                                                                                                            )
                                                                                                            .concat();
                                                                                                        ke = [];
                                                                                                        Hd = Cd = 0;
                                                                                                        for (
                                                                                                            le =
                                                                                                                Yd.length;
                                                                                                            Hd < le;
                                                                                                            Hd++
                                                                                                        ) {
                                                                                                            oc = Yd[Hd];
                                                                                                            Zd = oc.ef;
                                                                                                            Uc = na(Zd);
                                                                                                            md = [];
                                                                                                            try {
                                                                                                                for (
                                                                                                                    Dd =
                                                                                                                        void 0;
                                                                                                                    null !==
                                                                                                                    (Dd =
                                                                                                                        Rb.exec(
                                                                                                                            Uc
                                                                                                                        ));

                                                                                                                )
                                                                                                                    md.push(
                                                                                                                        Dd
                                                                                                                    ),
                                                                                                                        ke.push(
                                                                                                                            xa[
                                                                                                                                Zb
                                                                                                                            ]
                                                                                                                        ),
                                                                                                                        Zb++;
                                                                                                            } catch (dd) {
                                                                                                                Object(
                                                                                                                    Ma.i
                                                                                                                )(dd);
                                                                                                            }
                                                                                                            if (
                                                                                                                md.length
                                                                                                            )
                                                                                                                if (
                                                                                                                    ((Cd +=
                                                                                                                        md.length),
                                                                                                                    Na &&
                                                                                                                        Cd >
                                                                                                                            lb)
                                                                                                                ) {
                                                                                                                    Dc =
                                                                                                                        Math.abs(
                                                                                                                            Cd -
                                                                                                                                md.length -
                                                                                                                                lb
                                                                                                                        );
                                                                                                                    Pd =
                                                                                                                        md[
                                                                                                                            Dc
                                                                                                                        ]
                                                                                                                            .index;
                                                                                                                    me =
                                                                                                                        Uc.substr(
                                                                                                                            0,
                                                                                                                            Pd
                                                                                                                        );
                                                                                                                    $d =
                                                                                                                        nb;
                                                                                                                    Id =
                                                                                                                        Uc.substr(
                                                                                                                            Pd +
                                                                                                                                Fb.length,
                                                                                                                            Uc.length
                                                                                                                        );
                                                                                                                    Jd =
                                                                                                                        '' +
                                                                                                                        me +
                                                                                                                        $d +
                                                                                                                        Id;
                                                                                                                    Da.a.trigger(
                                                                                                                        db
                                                                                                                            .d
                                                                                                                            .SEARCH_AND_REPLACE_TEXT_FOUND,
                                                                                                                        [
                                                                                                                            [
                                                                                                                                zb
                                                                                                                            ]
                                                                                                                        ]
                                                                                                                    );
                                                                                                                    kc(
                                                                                                                        oc,
                                                                                                                        Jd
                                                                                                                    );
                                                                                                                    break;
                                                                                                                } else
                                                                                                                    Na ||
                                                                                                                        ((Fa =
                                                                                                                            !0),
                                                                                                                        (Jd =
                                                                                                                            Uc.replace(
                                                                                                                                Rb,
                                                                                                                                nb
                                                                                                                            )),
                                                                                                                        Da.a.trigger(
                                                                                                                            db
                                                                                                                                .d
                                                                                                                                .SEARCH_AND_REPLACE_TEXT_FOUND,
                                                                                                                            [
                                                                                                                                ke
                                                                                                                            ]
                                                                                                                        ),
                                                                                                                        kc(
                                                                                                                            oc,
                                                                                                                            Jd
                                                                                                                        ));
                                                                                                        }
                                                                                                        return [2];
                                                                                                    }
                                                                                                );
                                                                                            }
                                                                                        );
                                                                                    })
                                                                                    .catch(Qc),
                                                                                [2]
                                                                            );
                                                                    }
                                                                });
                                                            });
                                                        });
                                                        return [2, Gc];
                                                    });
                                                });
                                            })),
                                            [
                                                2,
                                                Promise.all(ya).then(function () {
                                                    Na && zb ? rb.bN(zb) : (rb.bT(), rb.Jm(), rb.re());
                                                    Fa = Va = !1;
                                                    Da.a.trigger(db.d.SEARCH_AND_REPLACE_ENDED);
                                                    var vc = bb.ma(),
                                                        Gc = vc.nb().filter(function (cd) {
                                                            return cd.Qe();
                                                        });
                                                    vc.Jf(Gc, { force: !0, source: 'contentEditTool' });
                                                })
                                            ]
                                        );
                                }
                            });
                        });
                    },
                    Gma: function (mb, nb) {
                        var rb = ma(mb.ef.contents);
                        rb = new DOMParser().parseFromString(rb, 'text/html').documentElement.querySelector('body');
                        var sb = rb.querySelectorAll('p'),
                            xa = new XMLSerializer();
                        sb.forEach(function (Na) {
                            Na.style.fontFamily = nb;
                        });
                        rb = xa.serializeToString(rb);
                        h(mb, rb);
                    },
                    Hma: function (mb, nb) {
                        var rb = ma(mb.ef.contents);
                        rb = new DOMParser().parseFromString(rb, 'text/html').documentElement.querySelector('body');
                        var sb = rb.querySelectorAll('p'),
                            xa = new XMLSerializer();
                        sb.forEach(function (Na) {
                            Na.style.fontSize = nb;
                        });
                        rb = xa.serializeToString(rb);
                        h(mb, rb);
                    },
                    j7: function (mb, nb) {
                        return Object(za.b)(void 0, void 0, void 0, function () {
                            var rb, sb, xa, Na, Za, cb, jb;
                            return Object(za.d)(this, function (zb) {
                                switch (zb.label) {
                                    case 0:
                                        return (
                                            (rb = mb.ef.id),
                                            (sb = mb.PageNumber),
                                            (xa = bb.getDocument()),
                                            [4, xa.ae([sb])]
                                        );
                                    case 1:
                                        return (
                                            (Na = zb.ca()),
                                            (Za = new TextEncoder()),
                                            (cb = Za.encode('')),
                                            (jb = cb.buffer),
                                            Wa.postMessage(
                                                {
                                                    cmd: 'AlignParaText',
                                                    pdfFile: Na,
                                                    pageNumber: sb,
                                                    galleyID: rb,
                                                    alignment: nb,
                                                    topVal1: '',
                                                    leftVal1: '',
                                                    bottomVal1: '',
                                                    rightVal1: '',
                                                    topVal2: '',
                                                    leftVal2: '',
                                                    bottomVal2: '',
                                                    rightVal2: '',
                                                    tableData: jb
                                                },
                                                [jb]
                                            ),
                                            [2]
                                        );
                                }
                            });
                        });
                    },
                    Z7: function (mb) {
                        var nb = ma(mb.ef.contents);
                        nb = new DOMParser().parseFromString(nb, 'text/html').documentElement.querySelector('body');
                        var rb = nb.querySelectorAll('p'),
                            sb = new XMLSerializer(),
                            xa = 'bold' === rb[0].style.fontWeight,
                            Na = sb.serializeToString(rb[0]).includes('<strong>');
                        rb.forEach(function (Za) {
                            if (xa || Na) {
                                Za.style.fontWeight = 'normal';
                                var cb = sb.serializeToString(Za).replace(/<strong>/g, '');
                                cb = cb.replace(/<\/strong>/g, '');
                                cb = new DOMParser()
                                    .parseFromString(cb, 'text/html')
                                    .documentElement.querySelector('p');
                                Za.parentElement.replaceChild(cb, Za);
                            } else (Za.style.fontWeight = 'bold'), (Za.innerHTML = '<strong>' + Za.innerHTML.trim() + '</strong>');
                        });
                        nb = sb.serializeToString(nb);
                        h(mb, nb);
                    },
                    xha: function (mb) {
                        var nb = ma(mb.ef.contents);
                        nb = new DOMParser().parseFromString(nb, 'text/html').documentElement.querySelector('body');
                        var rb = nb.querySelectorAll('p'),
                            sb = new XMLSerializer(),
                            xa = 'italic' === rb[0].style.fontStyle,
                            Na = sb.serializeToString(rb[0]).includes('<em>');
                        rb.forEach(function (Za) {
                            if (xa || Na) {
                                Za.style.fontStyle = 'normal';
                                Za.style.font.includes('Italic') &&
                                    (Za.style.font = Za.style.font.replace('Italic', ''));
                                var cb = sb.serializeToString(Za).replace(/<em>/g, '');
                                cb = cb.replace(/<\/em>/g, '');
                                cb = new DOMParser()
                                    .parseFromString(cb, 'text/html')
                                    .documentElement.querySelector('p');
                                Za.parentElement.replaceChild(cb, Za);
                            } else (Za.style.fontStyle = 'italic'), (Za.innerHTML = '<em>' + Za.innerHTML.trim() + '</em>');
                        });
                        nb = sb.serializeToString(nb);
                        h(mb, nb);
                    },
                    Hpa: function (mb) {
                        var nb = ma(mb.ef.contents);
                        nb = new DOMParser().parseFromString(nb, 'text/html').documentElement.querySelector('body');
                        var rb = nb.querySelectorAll('p'),
                            sb = new XMLSerializer(),
                            xa =
                                rb[0].style.textDecoration.includes('underline') ||
                                rb[0].style.textDecoration.includes('word'),
                            Na = sb.serializeToString(rb[0]).includes('<u>');
                        rb.forEach(function (Za) {
                            if (xa || Na) {
                                Za.style.textDecoration = Za.style.textDecoration.replace('underline', '');
                                var cb = sb.serializeToString(Za).replace(/<u>/g, '');
                                cb = cb.replace(/<\/u>/g, '');
                                cb = new DOMParser()
                                    .parseFromString(cb, 'text/html')
                                    .documentElement.querySelector('p');
                                Za.parentElement.replaceChild(cb, Za);
                            } else Za.style.textDecoration.includes('none') ? (Za.style.textDecoration = Za.style.textDecoration.replace('none', 'underline')) : (Za.style.textDecoration += ' underline'), (Za.innerHTML = '<u>' + Za.innerHTML.trim() + '</u>');
                        });
                        nb = sb.serializeToString(nb);
                        h(mb, nb);
                    },
                    toa: function (mb, nb) {
                        var rb = ma(mb.ef.contents);
                        rb = new DOMParser().parseFromString(rb, 'text/html').documentElement.querySelector('body');
                        var sb = rb.querySelectorAll('p'),
                            xa = new XMLSerializer();
                        sb.forEach(function (Na) {
                            Na.style.color = nb;
                        });
                        rb.querySelectorAll('span').forEach(function (Na) {
                            Na.setAttribute('style', 'color:' + nb);
                        });
                        rb = xa.serializeToString(rb);
                        h(mb, rb);
                    },
                    uda: function () {
                        return Ib;
                    },
                    V6: function (mb) {
                        return Object(za.b)(void 0, void 0, void 0, function () {
                            var nb, rb, sb, xa, Na, Za, cb, jb, zb, eb;
                            return Object(za.d)(this, function (lb) {
                                switch (lb.label) {
                                    case 0:
                                        return (
                                            (nb = mb.pageNumber),
                                            (rb = mb.newImage),
                                            (sb = mb.scaleType),
                                            (xa = mb.position),
                                            (Na = xa.top),
                                            (Za = xa.left),
                                            (cb = xa.bottom),
                                            (jb = xa.right),
                                            (zb = bb.getDocument()),
                                            [4, zb.ae([nb])]
                                        );
                                    case 1:
                                        return (
                                            (eb = lb.ca()),
                                            Wa.postMessage(
                                                {
                                                    cmd: 'insertImage',
                                                    pdfFile: eb,
                                                    pageNumber: nb,
                                                    newImage: rb,
                                                    scaleType: sb,
                                                    topVal: Na,
                                                    leftVal: Za,
                                                    bottomVal: cb,
                                                    rightVal: jb
                                                },
                                                []
                                            ),
                                            [2]
                                        );
                                }
                            });
                        });
                    }
                };
            }
        }
    ]);
}.call(this || window));
