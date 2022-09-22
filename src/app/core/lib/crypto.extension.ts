import * as CryptoJS from 'crypto-js';
import { Convert } from './convert';

export class CryptoExtension {
    public static encrypt(data: string, key: string) {
        let ciphertext = CryptoJS.AES.encrypt(data, key);
        return ciphertext.toString();
    }

    public static decrypt(data: string, key?: string) {
        let _result = CryptoJS.AES.decrypt(data, key);
        return _result.toString(CryptoJS.enc.Utf8);
    }

    public static sha256(pzData: string): string {
        return CryptoJS.SHA1(pzData).toString();
    }

    public static computeHashBytes(pzData: string) {
        let _hash = CryptoJS.MD5(CryptoJS.enc.Utf16LE.parse(pzData));
        return Convert.fromBase64String(_hash.toString(CryptoJS.enc.Base64));
    }

    public static computeHash(ctorArg: string) {
        let _hash = CryptoJS.MD5(CryptoJS.enc.Utf16LE.parse(ctorArg));
        return _hash.toString(CryptoJS.enc.Hex);
    }
}