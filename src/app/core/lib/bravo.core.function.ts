import * as wjc from '@grapecity/wijmo';

export function asEnum(value: any, enumType: any, nullOK = false): number {
    if (value == null && nullOK) return null;
    let e = enumType[value];
    wjc.assert(e != null, String.format('Invalid enum value. {0}', e));
    return Number.isNumber(e) ? e : value;
}

export function isMobile() {
    if (isTablet()) return false;

    return wjc.isMobile();
}

export function isTablet() {
    return /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/i.test(navigator.userAgent);
}

/**
     * Performs HTTP requests.
     *
     * @param url String containing the URL to which the request is sent.
     * @param settings An optional object used to configure the request.
     *
     * The <b>settings</b> object may contain the following:
     *
     * <table>
     * <tr>
     *   <td><b>method</b></td>
     *   <td>The HTTP method to use for the request (e.g. "POST", "GET", "PUT").
     *       The default is "GET".</td>
     * </tr>
     * <tr>
     *   <td><b>data</b></td>
     *   <td>Data to be sent to the server. It is appended to the url for GET requests,
     *       and converted to a string for other requests.</td>
     * </tr>
     * <tr>
     *   <td><b>async</b></td>
     *   <td>By default, all requests are sent asynchronously (i.e. this is set to true by default).
     *       If you need synchronous requests, set this option to false.</td>
     * </tr>
     * <tr>
     *   <td><b>success</b></td>
     *   <td>A function to be called if the request succeeds.
     *       The function gets passed a single parameter of type <b>XMLHttpRequest</b>.</td>
     * </tr>
     * <tr>
     *   <td><b>error</b></td>
     *   <td>A function to be called if the request fails.
     *       The function gets passed a single parameter of type <b>XMLHttpRequest</b>.</td>
     * </tr>
     * <tr>
     *   <td><b>complete</b></td>
     *   <td>A function to be called when the request finishes (after success and error callbacks are executed).
     *       The function gets passed a single parameter of type <b>XMLHttpRequest</b>.</td>
     * </tr>
     * <tr>
     *   <td><b>beforeSend</b></td>
     *   <td>A function to be called immediately before the request us sent.
     *       The function gets passed a single parameter of type <b>XMLHttpRequest</b>.</td>
     * </tr>
     * <tr>
     *   <td><b>requestHeaders</b></td>
     *   <td>A JavaScript object containing key/value pairs to be added to the request
     *       headers.</td>
     * </tr>
     * <tr>
     *   <td><b>user</b></td>
     *   <td>A username to be used with <b>XMLHttpRequest</b> in response to an HTTP access
     *       authentication request.</td>
     * </tr>
     * <tr>
     *   <td><b>password</b></td>
     *   <td>A password to be used with <b>XMLHttpRequest</b> in response to an HTTP access
     *       authentication request.</td>
     * </tr>
     * </table>
     *
     * Use the <b>success</b> to obtain the result of the request which is provided in
     * the callback's <b>XMLHttpRequest</b> parameter. For example, the code below uses
     * the @see:httpRequest method to retrieve a list of customers from an OData service:
     *
     * <pre>wijmo.httpRequest('http://services.odata.org/Northwind/Northwind.svc/Customers?$format=json', {
     *   success: function (xhr) {
     *     var response = JSON.parse(xhr.response),
     *         customers = response.value;
     *     // do something with the customers...
     *   }
     * });</pre>
     *
     * @return The <b>XMLHttpRequest</b> object used to perform the request.
     */
export function httpRequest(url: string, settings?: any): XMLHttpRequest {
    if (!settings) settings = {};

    // select method and basic options
    let method = settings.method ? wjc.asString(settings.method).toUpperCase() : 'GET',
        asynk = settings.async != null ? wjc.asBoolean(settings.async) : true,
        data = settings.data;

    // convert data to url parameters for GET requests
    if (data != null && method == 'GET') {
        let s = [];
        for (let k in data) {
            let val = data[k];
            if (wjc.isDate(val)) {
                val = val.toJSON();
            }
            s.push(k + '=' + val);
        }
        if (s.length) {
            let sep = url.indexOf('?') < 0 ? '?' : '&';
            url += sep + s.join('&');
        }
        data = null;
    }

    // create the request
    let xhr = new XMLHttpRequest();
    xhr['URL_DEBUG'] = url; // add some debug info
    xhr['isCompress'] = settings.isCompress;

    // if the data is not a string, stringify it
    let isJson = false;
    if (!(data instanceof ArrayBuffer) && data != null && !wjc.isString(data)) {
        isJson = wjc.isObject(data);
        data = JSON.stringify(data);
    }

    // callbacks
    xhr.onload = function () {
        if (xhr.readyState == 4) {
            if (xhr.status < 300) {
                if (settings.success) {
                    wjc.asFunction(settings.success)(xhr);
                }
            } else if (settings.error) {
                wjc.asFunction(settings.error)(xhr);
            }
            if (settings.complete) {
                wjc.asFunction(settings.complete)(xhr);
            }
        }
    };
    xhr.onerror = function () {
        if (wjc.isFunction(settings.error)) {
            settings.error(xhr);
        } else {
            throw 'HttpRequest Error: ' + xhr.status + ' ' + xhr.statusText;
        }
    };

    // send the request
    xhr.open(method, url, asynk, settings.user, settings.password);
    if (settings.user && settings.password) {
        xhr.setRequestHeader('Authorization', 'Basic ' + btoa(settings.user + ':' + settings.password))
    }

    if (settings.contentType) {
        xhr.setRequestHeader('Content-Type', settings.contentType);
    }
    else if (isJson) {
        xhr.setRequestHeader('Content-Type', 'application/json');
    }

    if (settings.responseType) {
        xhr.responseType = settings.responseType;
    }

    if (settings.requestHeaders) {
        for (let key in settings.requestHeaders) {
            xhr.setRequestHeader(key, settings.requestHeaders[key])
        }
    }
    if (wjc.isNumber(settings.timeout)) {
        xhr.timeout = settings.timeout;
    }
    if (wjc.isFunction(settings.beforeSend)) {
        settings.beforeSend(xhr);
    }

    xhr.send(data);

    // return the request
    return xhr;
}

export function isoStringToDate(match: RegExpMatchArray): Date {
    if (match instanceof Array) {
        const date = new Date(0);
        let tzHour = 0;
        let tzMin = 0;
        const dateSetter = match[8] ? date.setUTCFullYear : date.setFullYear;
        const timeSetter = match[8] ? date.setUTCHours : date.setHours;

        if (match[9]) {
            tzHour = toInt(match[9] + match[10]);
            tzMin = toInt(match[9] + match[11]);
        }
        dateSetter.call(date, toInt(match[1]), toInt(match[2]) - 1, toInt(match[3]));
        const h = toInt(match[4] || '0') - tzHour;
        const m = toInt(match[5] || '0') - tzMin;
        const s = toInt(match[6] || '0');
        const ms = Math.round(parseFloat('0.' + (match[7] || 0)) * 1000);
        timeSetter.call(date, h, m, s, ms);
        return date;
    }

    return match;
}

export function isHex(hex: string) {
    if (hex.length % 2 == 0 && (hex.match(/^[0-9a-f]+$/) || hex.match(/^[0-9A-F]+$/)))
        return true;

    return false;
}

export function ObjectValues(obj) {
    return Object.keys(obj).map(key => {
        return obj[key];
    });
}

function toInt(str: string): number {
    return parseInt(str, 10);
}

export const regexSpecials = /([.*+?^=!:${}()|[\]\/\\])/g

export function escapeRegExp(pzStr: string) {
    return pzStr.replace(regexSpecials, "\\$1");
}

export function escapeXml(text: string) {
    if (wjc.isString(text)) {
        text = text.replace(/[&<>"']/g, function (s) {
            return _ENTITYMAP[s];
        });
    }
    return text;
}

const _ENTITYMAP = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;'
};

export function isAnsiString(value): boolean {
    if (value == null)
        return true;

    if (wjc.isString(value))
        return value.isASCII();

    return false;
}

export function compareStrings(string1, string2, ignoreCase = false, useLocale = false) {
    if (!string1 && !string2)
        return true;

    try {
        if (string1 && string2) {
            if (ignoreCase) {
                if (useLocale) {
                    string1 = string1.toLocaleLowerCase();
                    string2 = string2.toLocaleLowerCase();
                }
                else {
                    string1 = string1.toLowerCase();
                    string2 = string2.toLowerCase();
                }
            }

            return string1 === string2;
        }

        return false;
    }
    catch (ex) {
        console.warn('**************', ex, string1, string2);
        throw ex;
    }
}