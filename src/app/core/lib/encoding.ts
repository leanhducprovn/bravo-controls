export namespace Encoding {
    export class UTF8 {
        public static getBytes(pzText: string) {
            if (typeof (TextEncoder) != 'undefined') {
                let _enc = new TextEncoder();
                return _enc.encode(pzText);
            }

            const octets = [];
            const length = pzText.length;
            let i = 0;
            while (i < length) {
                var codePoint = pzText.codePointAt(i);
                var c = 0;
                var bits = 0;
                if (codePoint <= 0x0000007F) {
                    c = 0;
                    bits = 0x00;
                } else if (codePoint <= 0x000007FF) {
                    c = 6;
                    bits = 0xC0;
                } else if (codePoint <= 0x0000FFFF) {
                    c = 12;
                    bits = 0xE0;
                } else if (codePoint <= 0x001FFFFF) {
                    c = 18;
                    bits = 0xF0;
                }
                octets.push(bits | (codePoint >> c));
                c -= 6;
                while (c >= 0) {
                    octets.push(0x80 | ((codePoint >> c) & 0x3F));
                    c -= 6;
                }
                i += codePoint >= 0x10000 ? 2 : 1;
            }

            return new Uint8Array(octets);
        }

        public static getString(bytes: Uint8Array) {
            if (typeof (TextEncoder) != 'undefined') {
                const _decoder = new TextDecoder();
                return _decoder.decode(bytes);
            }

            var string = "";
            var i = 0;
            while (i < bytes.length) {
                var octet = bytes[i];
                var bytesNeeded = 0;
                var codePoint = 0;
                if (octet <= 0x7F) {
                    bytesNeeded = 0;
                    codePoint = octet & 0xFF;
                } else if (octet <= 0xDF) {
                    bytesNeeded = 1;
                    codePoint = octet & 0x1F;
                } else if (octet <= 0xEF) {
                    bytesNeeded = 2;
                    codePoint = octet & 0x0F;
                } else if (octet <= 0xF4) {
                    bytesNeeded = 3;
                    codePoint = octet & 0x07;
                }
                if (bytes.length - i - bytesNeeded > 0) {
                    var k = 0;
                    while (k < bytesNeeded) {
                        octet = bytes[i + k + 1];
                        codePoint = (codePoint << 6) | (octet & 0x3F);
                        k += 1;
                    }
                } else {
                    codePoint = 0xFFFD;
                    bytesNeeded = bytes.length - i;
                }
                string += String.fromCodePoint(codePoint);
                i += bytesNeeded + 1;
            }
            return string
        }
    }

    export class Unicode {
        public static getBytes(pText: string) {
            var buf = new ArrayBuffer(pText.length * 2); // 2 bytes for each char
            var bufView = new Uint16Array(buf);
            for (var i = 0, strLen = pText.length; i < strLen; i++) {
                bufView[i] = pText.charCodeAt(i);
            }
            return new Uint8Array(buf);
        }

        public static getString(bytes) {
            let _buff: ArrayBuffer;
            if (bytes instanceof Uint8Array)
                _buff = bytes.buffer;
            else if (bytes instanceof Uint16Array)
                _buff = bytes.buffer;

            if (_buff instanceof ArrayBuffer)
                return String.fromCharCode.apply(null, new Uint16Array(_buff));
        }
    }
}
