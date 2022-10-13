import { httpRequest } from '../bravo.core.function';
import { Convert } from '../convert';
import { ArgumentNullException } from '../exception/argument.null.exception';

export class BravoUsbTokenHelper {
    private static url = 'http://localhost:8080/api/UsbToken/';

    public static readRawData(pzSerialNumber: string) {
        try {
            const _url = this.url + 'getTokenRawData/' + pzSerialNumber;
            const xhr = httpRequest(_url, {
                method: 'GET',
                async: false
            });

            if (xhr.status == 200 && xhr.responseText)
                return Convert.fromBase64String(xhr.responseText);
        } catch (_ex) {
            if (_ex instanceof DOMException) throw new Error(_ex.message);

            throw _ex;
        }
    }

    public static signData(
        pzSerialNumber: string,
        pzXMLString: string,
        pzItemTagName: string,
        pzHashValueTagName: string = 'hashValue',
        pzSignValueTagName: string = 'signValue'
    ) {
        if (
            String.isNullOrEmpty(pzXMLString) ||
            String.isNullOrEmpty(pzItemTagName) ||
            String.isNullOrEmpty(pzHashValueTagName) ||
            String.isNullOrEmpty(pzSignValueTagName)
        )
            throw new ArgumentNullException(
                'All parameters are required and cannot be empty.'
            );

        const _jsonData = {
            SerialNumber: pzSerialNumber,
            XmlString: pzXMLString,
            ItemTagName: pzItemTagName,
            HashValueTagName: pzHashValueTagName,
            SignValueTagName: pzSignValueTagName
        };

        const _url = this.url + 'signData';
        const xhr = httpRequest(_url, {
            method: 'POST',
            async: false,
            data: _jsonData,
            contentType: 'application/json'
        });

        if (xhr.status == 200 && xhr.responseText) return xhr.responseText;
    }

    public static signXml(
        pzSerialNumber: string,
        pzXMLString: string,
        pbIncludeKeyInfo: boolean = false,
        pzSignatureId: string = '',
        pzReferenceUri: string = ''
    ) {
        const _jsonData = {
            SerialNumber: pzSerialNumber,
            XmlString: pzXMLString,
            IncludeKeyInfo: pbIncludeKeyInfo,
            SignatureId: pzSignatureId,
            ReferenceUri: pzReferenceUri
        };

        const _url = this.url + 'signXml';
        const xhr = httpRequest(_url, {
            method: 'POST',
            async: false,
            data: _jsonData,
            contentType: 'application/json'
        });

        if (xhr.status == 200 && xhr.responseText) return xhr.responseText;
    }

    public static verifySignXml(pCertificate: Uint8Array, pzSignedXml: string) {
        const _jsonData = {
            Certificate: Convert.toBase64String(pCertificate),
            SignedXml: pzSignedXml
        };

        const _url = this.url + 'verifySignXml';
        const xhr = httpRequest(_url, {
            method: 'POST',
            async: false,
            data: _jsonData,
            contentType: 'application/json'
        });

        if (xhr.status == 200 && xhr.responseText) return xhr.responseText;
    }

    public static signDocument(
        pzSerialNumber: string,
        pzInputFileName: string,
        pzReason: string = null,
        pzContact: string = null,
        pzLocation: string = null,
        pzXOffset: string = '0',
        pzYOffset: string = '0',
        pbShow: boolean = true
    ) {
        const _jsonData = {
            SerialNumber: pzSerialNumber,
            InputFileName: pzInputFileName,
            Reason: pzReason,
            Contact: pzContact,
            Location: pzLocation,
            XOffset: pzXOffset,
            YOffset: pzYOffset,
            Show: pbShow
        };

        const _url = this.url + 'signDocument';
        const xhr = httpRequest(_url, {
            method: 'POST',
            async: false,
            data: _jsonData,
            contentType: 'application/json'
        });

        if (xhr.status == 200 && xhr.responseText) return xhr.responseText;
    }

    public static signDataString(pzSerialNumber: string, pzDataString: string) {
        const _jsonData = {
            SerialNumber: pzSerialNumber,
            DataString: pzDataString
        };

        const _url = this.url + 'signDataString';
        const xhr = httpRequest(_url, {
            method: 'POST',
            async: false,
            data: _jsonData,
            contentType: 'application/json'
        });

        if (xhr.status == 200 && xhr.responseText) return xhr.responseText;
    }

    public static verifySignDataString(
        pCertificate: any,
        pzOriginalData: string,
        pzSignedData: string
    ) {
        const _jsonData = {
            Certificate:
                pCertificate instanceof Uint8Array
                    ? Convert.toBase64String(pCertificate)
                    : null,
            SerialNumber:
                pCertificate instanceof Uint8Array ? null : pCertificate,
            OriginalData: pzOriginalData,
            SignedData: pzOriginalData
        };

        const _url = this.url + 'verifySignDataString';
        const xhr = httpRequest(_url, {
            method: 'POST',
            async: false,
            data: _jsonData,
            contentType: 'application/json'
        });

        if (xhr.status == 200 && xhr.responseText) return xhr.responseText;
    }
}
