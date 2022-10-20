import * as wjc from '@grapecity/wijmo';
import { ExtensionsMethod } from '../extensions.method';

export class Image {
    private _src: string;
    private _extension: string;
    private _base64: string;
    public get src(): string {
        return this._src;
    }

    public set src(val: string) {
        this._src = val;
    }

    public get extension(): string {
        return this._extension;
    }

    public set extension(val: string) {
        this._extension = val;
    }

    public get base64(): string {
        return this._base64;
    }

    public set base64(val: string) {
        this._base64 = val;
    }

    private _nWidth: number = -1;

    public get width(): number {
        return this._nWidth;
    }

    public set width(value: number) {
        this._nWidth = value;
    }

    private _nHeight: number = -1;

    public get height(): number {
        return this._nHeight;
    }

    public set height(value: number) {
        this._nHeight = value;
    }

    private _size: wjc.Size = null;

    public get size(): wjc.Size {
        /* if (this._size == null) {
            let _imgElement = ExtensionsMethod.renderImage(this._src, this._extension,
                this._base64, this._nWidth, this._nHeight);
            _imgElement.style.visibility = 'hidden';

            document.body.appendChild(_imgElement);

            if (_imgElement) {
                _imgElement.onload = () => {
                    this._size = new wjc.Size(_imgElement.offsetWidth, _imgElement.offsetHeight);
                    _imgElement.remove();
                }
            }
        } */

        return this._size;
    }

    public readonly onImageLoaded = new wjc.Event();

    constructor(pzSrc: string, pExtension?: string, pBase64?: string, pWidth: number = -1, pHeight: number = -1) {
        this._src = pzSrc || '';
        this._extension = pExtension || 'png';
        this._base64 = pBase64 || '';
        this._nWidth = pWidth;
        this._nHeight = pHeight;
    }

    private _imageElement: HTMLElement;

    public get imageElement(): HTMLElement {
        return this._imageElement;
    }

    public render() {
        this._imageElement = ExtensionsMethod.renderImage(
            this.src,
            this.extension,
            this.base64,
            this.width,
            this.height
        );
        if (this.imageElement instanceof HTMLImageElement) {
            this.imageElement.onload = () => {
                this.insertToHost(document.body);

                if (this.isEmpty) {
                    this._size = new wjc.Size(this.imageElement.offsetWidth, this.imageElement.offsetHeight);
                    this._bCalcSizeComplete = true;
                }

                if (this._bCalcSizeComplete && this._hWait) this.insertToHost(this._hWait);

                this.onImageLoaded.raise(this);
            };
        }

        return this.imageElement;
    }

    private get isEmpty() {
        return this._size == null || this._size.equals(new wjc.Size(0, 0));
    }

    private _hWait: any;

    private _bCalcSizeComplete: boolean = false;

    public insertToHost(pHost: HTMLElement, pbClear: boolean = false) {
        if (pHost == null || this.imageElement == null) return;

        if (pbClear) pHost.innerHTML = null;

        if (!Object.is(pHost, document.body)) this._hWait = pHost;

        if (this.isEmpty) {
            pHost.appendChild(this.imageElement);
        } else if (this._bCalcSizeComplete) {
            pHost.appendChild(this.imageElement);
        }
    }

    public static getImage(imgElement: HTMLImageElement): Image {
        if (imgElement == null) return null;

        let _zImageBase64 = null;

        if (imgElement.src.includes('image/jpeg')) {
            _zImageBase64 = imgElement.src;
        } else {
            let _canvas = document.createElement('canvas');
            _canvas.getContext('2d').drawImage(imgElement, 0, 0);
            _zImageBase64 = _canvas.toDataURL('image/png');
        }

        if (!_zImageBase64) return null;
        let _base64 = _zImageBase64.substring(_zImageBase64.indexOf('base64,') + 'base64,'.length);
        let _image = new Image(null, 'png', _base64);
        _image._size = new wjc.Size(imgElement.offsetWidth, imgElement.offsetHeight);

        return _image;
    }
}

export enum ImageType {
    Web = 1,
    Local = 2,
    Base64 = 3
}
