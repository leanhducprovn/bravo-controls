import { asEnum } from '@grapecity/wijmo';
import { BravoZipTool } from './bravo.zip.tool';
import { BravoCore } from './bravo.core';
import { compareStrings } from './bravo.core.function';

export class BravoFileTypeDetector {
    //#region static members

    private static readonly Signatures: Array<string> = [
        '', //Unknown
        '25 50 44 46', //Pdf
        '42 4D', //Bmp
        'FF D8 FF', //Jpg
        '47 49 46 38', //Gif
        '49 49 2A 00|4D 4D 00 2A', //Tif
        '89 50 4E 47', //Png
        '38 42 50 53', //Psd
        'D7 CD C6 9A', //Wmf
        '00 00 01 00', //Ico
        '49 44 33|FF FB', //Mp3
        '52 49 46 46 ?? ?? ?? ?? 41 56 49 20', //Avi
        '46 57 53|43 57 53', //Swf
        '46 4C 56', //Flv
        '00 00 00 18 66 74 79 70 6D 70 34 32', //Mp4
        '6D 6F 6F 76', //Mov
        '30 26 B2 75 8E 66 CF', //Wmv
        '30 26 B2 75 8E 66 CF', //Wma
        '50 4B 03 04', //Zip, may contains *.docx, *.xlsx, *.pptx, *.xps
        '', // Docx
        '', // Xlsx
        '', // Pptx
        '', // Xps
        '52 61 72 21 1A 07 00|52 61 72 21 1A 07 01 00', //Rar
        'D0 CF 11 E0 A1 B1 1A E1', //Doc
        '7B 5C 72 74 66 31', //Rtf
        'D0 CF 11 E0 A1 B1 1A E1', //Xls
        'D0 CF 11 E0 A1 B1 1A E1', //Ppt
        '25 21 50 53 2D 41 64 6F 62 65 2D 33 2E 30 20 45 50 53 46 2D 33 20 30', //Eps
        '52 49 46 46 ?? ?? ?? ?? 57 41 56 45', //Wav
        '66 4C 61 43', //Flac
        '1A 45 DF A3', //Mkv
        '3c 3f 78 6d 6c 20' //Xml
    ];

    public static detectFileType(pStream: Uint8Array): FileTypeEnum {
        const _bom = pStream.slice(0, 4);
        if (
            (_bom[0] == 0xef && _bom[1] == 0xbb && _bom[2] == 0xbf) || // utf-8
            (_bom[0] == 0xff && _bom[1] == 0xfe) || // ucs-2le, ucs-4le, and ucs-16le (utf-16le)
            (_bom[0] == 0xfe && _bom[1] == 0xff) || // ucs-2 (utf-16be)
            (_bom[0] == 0 && _bom[1] == 0 && _bom[2] == 0xfe && _bom[3] == 0xff) || // ucs-4 | utf-32
            (_bom[0] == 0x2b && _bom[1] == 0x2f && _bom[2] == 0x76)
        ) {
            // utf-7
            return FileTypeEnum.Txt;
        }

        for (let _i = 1; _i < this.Signatures.length; _i++) {
            if (String.isNullOrEmpty(this.Signatures[_i])) continue;

            const _s = this.Signatures[_i].split('|').filter((i) => i);
            for (const _zSign of _s) {
                const _keys = _zSign.split(' ');
                const _nLength = _keys.length / 2;
                const _buff = pStream.slice(0, _nLength);

                if (_buff == null /*  || _buff.length != _nLength */) continue;

                let _bMatched = true;
                for (let _nByteIndex = 0; _nByteIndex < _buff.length; _nByteIndex++) {
                    if (_keys[_nByteIndex] == '??')
                        // ignore byte
                        continue;

                    let _c = new Array(2);
                    let _b;
                    _b = _buff[_nByteIndex] >> 4;
                    _c[0] = String.fromCharCode(55 + _b + (((_b - 10) >> 31) & -7));
                    _b = _buff[_nByteIndex] & 0xf;
                    _c[1] = String.fromCharCode(55 + _b + (((_b - 10) >> 31) & -7));

                    if (!compareStrings(_keys[_nByteIndex], _c[0] + _c[1], true)) {
                        _bMatched = false;
                        break;
                    }
                }

                if (!_bMatched) continue;

                const _type = asEnum(_i, FileTypeEnum);
                if (_type == FileTypeEnum.Zip) {
                    try {
                        let _zt = BravoZipTool.open(pStream);
                        try {
                            if (_zt.containsEntry('xl/workbook.xml')) return FileTypeEnum.Xlsx;
                            else if (_zt.containsEntry('word/document.xml')) return FileTypeEnum.Docx;
                            else if (_zt.containsEntry('ppt/presentation.xml')) return FileTypeEnum.Pptx;
                            else if (
                                _zt.containsEntry('FixedDocumentSequence.fdseq') ||
                                _zt.containsEntry('FixedDocSeq.fdseq')
                            )
                                return FileTypeEnum.Xps;
                        } finally {
                            if (_zt) {
                                _zt.dispose();
                                _zt = null;
                            }
                        }
                    } catch {}

                    return _type;
                }

                return _type;
            }
        }

        return FileTypeEnum.Unknown;
    }

    public static isTextFile(pFileType: FileTypeEnum);
    public static isTextFile(pStream: Uint8Array);
    public static isTextFile(arg: any) {
        if (arg instanceof Uint8Array) {
            const _fileType = this.detectFileType(arg);
            return this.isTextFile(_fileType);
        }

        return arg == FileTypeEnum.Txt || arg == FileTypeEnum.Xml;
    }

    public static getMediaTypeFromFileType(fileType: FileTypeEnum) {
        switch (fileType) {
            case FileTypeEnum.Pdf:
                return 'application/pdf';
            case FileTypeEnum.Bmp:
                return 'image/bmp';
            case FileTypeEnum.Jpg:
                return 'image/jpeg';
            case FileTypeEnum.Gif:
                return 'image/gif';
            case FileTypeEnum.Tif:
                return 'image/tiff';
            case FileTypeEnum.Png:
                return 'image/png';
            case FileTypeEnum.Psd:
                return '';
            case FileTypeEnum.Wmf:
                return 'image/wmf';
            case FileTypeEnum.Ico:
                return 'image/vnd.microsoft.icon';
            case FileTypeEnum.Mp3:
                return 'audio/mpeg';
            case FileTypeEnum.Avi:
                return 'video/x-msvideo';
            case FileTypeEnum.Swf:
                return 'application/x-shockwave-flash';
            case FileTypeEnum.Flv:
                return 'video/x-matroska';
            case FileTypeEnum.Mp4:
                return 'application/mp4';
            case FileTypeEnum.Mov:
                return 'video/x-sgi-movie';
            case FileTypeEnum.Wmv:
                return 'video/x-ms-wmv';
            case FileTypeEnum.Wma:
                return 'audio/x-ms-wma';
            case FileTypeEnum.Zip:
                return 'application/zip';
            case FileTypeEnum.Docx:
                return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            case FileTypeEnum.Xlsx: {
                if (BravoCore.getMobileOperatingSystem() == 'iOS' && BravoCore.getBrowsers() != 'Safari')
                    return 'application/octet-stream';

                return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            }
            case FileTypeEnum.Pptx:
                return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
            case FileTypeEnum.Xps:
                return 'application/vnd.ms-xpsdocument';
            case FileTypeEnum.Rar:
                return 'application/vnd.rar';
            case FileTypeEnum.Doc:
                return 'application/msword';
            case FileTypeEnum.Rtf:
                return 'application/rtf';
            case FileTypeEnum.Xls:
                return 'application/vnd.ms-excel';
            case FileTypeEnum.Ppt:
                return 'application/vnd.ms-powerpoint';
            case FileTypeEnum.Eps:
                return 'image/x-eps';
            case FileTypeEnum.Wav:
                return 'audio/wav';
            case FileTypeEnum.Flac:
                return 'audio/flac';
            case FileTypeEnum.Mkv:
                return 'video/mp4';
            case FileTypeEnum.Xml:
                return 'application/xml';
            case FileTypeEnum.Msi:
                return 'application/x-msi';
            case FileTypeEnum.Txt:
                return 'text/plain';
        }
    }

    //#endregion static members
}

export enum FileTypeEnum {
    Unknown,
    Pdf,
    Bmp,
    Jpg,
    Gif,
    Tif,
    Png,
    Psd,
    Wmf,
    Ico,
    Mp3,
    Avi,
    Swf,
    Flv,
    Mp4,
    Mov,
    Wmv,
    Wma,
    Zip,
    Docx,
    Xlsx,
    Pptx,
    Xps,
    Rar,
    Doc,
    Rtf,
    Xls,
    Ppt,
    Eps,
    Wav,
    Flac,
    Mkv,
    Xml,
    Msi,
    Txt
}
