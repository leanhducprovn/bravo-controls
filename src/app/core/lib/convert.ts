import { isHex } from './bravo.core.function';

export class Convert {
    private static chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

    public static toBase64String(buff: Uint8Array | ArrayBuffer) {
        const bytes = buff instanceof ArrayBuffer ? new Uint8Array(buff) : buff;
        let i,
            len = bytes.length,
            base64 = '';

        for (i = 0; i < len; i += 3) {
            base64 += this.chars[bytes[i] >> 2];
            base64 += this.chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
            base64 += this.chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
            base64 += this.chars[bytes[i + 2] & 63];
        }

        if (len % 3 === 2) {
            base64 = base64.substring(0, base64.length - 1) + '=';
        } else if (len % 3 === 1) {
            base64 = base64.substring(0, base64.length - 2) + '==';
        }

        return base64;
    }

    public static fromBase64String(base64: string) {
        // Use a lookup table to find the index.
        let lookup = new Uint8Array(256);
        for (let i = 0; i < this.chars.length; i++) {
            lookup[this.chars.charCodeAt(i)] = i;
        }

        let bufferLength = base64.length * 0.75,
            len = base64.length,
            i,
            p = 0,
            encoded1,
            encoded2,
            encoded3,
            encoded4;

        if (base64[base64.length - 1] === '=') {
            bufferLength--;
            if (base64[base64.length - 2] === '=') {
                bufferLength--;
            }
        }

        var arraybuffer = new ArrayBuffer(bufferLength),
            bytes = new Uint8Array(arraybuffer);

        for (i = 0; i < len; i += 4) {
            encoded1 = lookup[base64.charCodeAt(i)];
            encoded2 = lookup[base64.charCodeAt(i + 1)];
            encoded3 = lookup[base64.charCodeAt(i + 2)];
            encoded4 = lookup[base64.charCodeAt(i + 3)];

            bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
            bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
            bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
        }

        return bytes;
    }

    public static toArrayBuffer(buf) {
        var ab = new ArrayBuffer(buf.length);
        var view = new Uint8Array(ab);
        for (var i = 0; i < buf.length; ++i) {
            view[i] = buf[i];
        }
        return ab;
    }

    public static hextoArrayBuffer(hex) {
        if (hex.length % 2 != 0) throw 'Input is not even length';
        if (isHex(hex) == null) throw 'Input is not hexadecimal';

        let buffer = new ArrayBuffer(hex.length / 2);
        let view = new DataView(buffer);

        for (let i = 0; i < hex.length / 2; i++) {
            view.setUint8(i, parseInt(hex.substr(i * 2, 2), 16));
        }

        return buffer;
    }

    public static ArrayBuffertohex(buffer) {
        var hex = '';
        var view = new DataView(buffer);

        for (var i = 0; i < buffer.byteLength; i++) {
            hex += ('00' + view.getUint8(i).toString(16)).slice(-2);
        }

        return hex;
    }
}
