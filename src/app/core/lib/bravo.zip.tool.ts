import * as JSZip from 'jszip';
import * as JSZipSync from 'jszip-sync';
import { NullReferenceException } from './exception/null.reference.exception';
import { Resources } from './resources';

export class BravoZipTool {
    private constructor() { }

    private _zipFile: any = null;

    public get zipFile(): any {
        return this._zipFile;
    }

    private _zFileName: string = null;

    public get zFileName(): string {
        return this._zipFile != null ? this._zipFile.name : null;
    }

    public set zFileName(zName: string) {
        this._zFileName = zName;
    }

    public static createAsync() {
        var _zt = new BravoZipTool();
        _zt._zipFile = new JSZip();
        return _zt;
    }

    public static create() {
        const _zt = new BravoZipTool();
        _zt._zipFile = new JSZipSync();
        return _zt;
    }

    public static open(data, options?: any) {
        let _zt = new BravoZipTool();
        _zt._zipFile = new JSZipSync();

        _zt._zipFile.sync(() => {
            let _z = null;
            _zt._zipFile.loadAsync(data, options).then(e => _z = e);
            return _z;
        })

        return _zt;
    }

    public static async openAync(data): Promise<BravoZipTool> {
        var _zt = new BravoZipTool();
        _zt._zipFile = new JSZip();
        await _zt._zipFile.loadAsync(data);

        return _zt;
    }

    public addComment(pzComment: string, pzEntryName?: string) {
        if (pzEntryName) {
            if (!this.containsEntry(pzEntryName))
                throw new Error(String.format(Resources.EntryNameNotExist, pzEntryName));

            this.zipFile.filter((entryName, file) => {
                if (String.compare(pzEntryName, entryName) == 0) {
                    file.comment = pzComment;
                    return true;
                }

                return false;
            })
        }
        /* else {
            this.zipFile.comment = pzComment;
        } */
    }

    public addEntry(pzEntryName: string, data) {
        this.zipFile.sync(() => {
            this.addEntryAync(pzEntryName, data);
        });
    }

    public addEntryAync(pzEntryName: string, data) {
        if (data instanceof Array || data instanceof Uint8Array || data instanceof ArrayBuffer) {
            this.zipFile.file(pzEntryName, data, { binary: true });
        }
        else if (data instanceof Blob) {
            this.zipFile.file(pzEntryName, data, { binary: true });
        }
        else if (data instanceof Object) {
            this.zipFile.file(pzEntryName, JSON.stringify(data));
        }
        else if (String.isBase64(data)) {
            this.zipFile.file(pzEntryName, data, { base64: true });
        }
        else if (data instanceof File) {
            this.zipFile.file(pzEntryName, data);
        }
        else {
            this.zipFile.file(pzEntryName, data)
        }
    }

    public readEntry(pzEntryName, type: string = "text") {
        if (!this.containsEntry(pzEntryName))
            throw new Error(String.format(Resources.EntryNameNotExist, pzEntryName));

        return this.zipFile.sync(() => {
            let _data;
            this.zipFile.file(pzEntryName).async(type).then(content => _data = content);

            return _data;
        });
    }

    public async readEntryAync(pzEntryName) {
        if (!this.containsEntry(pzEntryName))
            throw new Error(String.format(Resources.EntryNameNotExist, pzEntryName));

        return await this.zipFile.file(pzEntryName).async("text");
    }

    public extractFirstEntry() {
        for (const key in this.zipFile.files) {
            return this.zipFile.sync(() => {
                let _data;
                this.zipFile.file(key).async('uint8array').then(content => _data = content);

                return _data;
            });
        }
    }

    public removeEntryAync(pzEntryName: string) {
        if (!this.containsEntry(pzEntryName))
            throw new Error(String.format(Resources.EntryNameNotExist, pzEntryName));

        this.zipFile.remove(pzEntryName);
    }

    public containsEntry(pzEntryName: string) {
        if (!pzEntryName) return false;

        let _bMatch = false;
        this.zipFile.filter((entryName, file) => {
            if (String.compare(pzEntryName, entryName) == 0) {
                _bMatch = true;
                return true;
            }
        })

        return _bMatch;
    }

    public dispose() {
        if (this.zipFile) {
            this._zipFile = null;
        }
    }

    public countsEntries() {
        return Object.keys(this.zipFile.files).length;
    }

    public getEntryNames() {
        return Object.keys(this.zipFile.files);
    }

    private getEntry(pzEntryName) {
        for (const _zKey in this.zipFile.files) {
            if (String.compare(pzEntryName, _zKey) == 0)
                return this.zipFile.files[_zKey];
        }
    }

    public getEntryDateTime(pzEntryName: string) {
        const _e = this.getEntry(pzEntryName);
        if (_e == null)
            throw new NullReferenceException(String.format(Resources.EntryNameNotExist, pzEntryName));

        return _e ? _e.date : null;
    }

    public getEntryOriginalSize(pzEntryName: string) {
        const _e = this.getEntry(pzEntryName);
        if (_e == null)
            throw new NullReferenceException(String.format(Resources.EntryNameNotExist, pzEntryName));

        return _e && _e['_data'] ? _e['_data'].uncompressedSize : 0;
    }

    public save(type: "base64" | "binarystring" | "array" | "uint8array" | "arraybuffer" | "blob" = "arraybuffer") {
        return this.zipFile.sync(() => {
            let _dt;
            this.zipFile.generateAsync({ type: type })
                .then(data => _dt = data);
            return _dt;
        });
    }

    public async generateAync(option?) {
        if (!option)
            return await this.zipFile.generateAsync({ type: "text" });

        return await this.zipFile.generateAsync(option);
    }
}