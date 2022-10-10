import {
	AfterViewInit,
	Component,
	ElementRef,
	forwardRef,
	OnDestroy,
	OnInit,
	ViewChild,
} from '@angular/core';
import * as input from '@grapecity/wijmo.input';
import * as wjc from '@grapecity/wijmo';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { ImageValueEnum } from './../../types/enums';
import { Convert } from 'core';
@Component({
	selector: 'bravo-picture-input-box',
	templateUrl: './bravo.picture.input.box.html',
	styleUrls: ['./bravo.picture.input.box.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			multi: true,
			useExisting: forwardRef(() => BravoPictureInputBox),
		},
	],
})
export class BravoPictureInputBox
	extends wjc.Control
	implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild('upload') private _upload!: ElementRef;

	private _popup!: input.Popup;
	private _isZoom: boolean = false;
	private _imageWidth!: number;
	private _currentZoomPercent!: number;

	private _imageURL: string = '';
	public set imageURL(pValue: string) {
		if (this._imageURL == pValue)
			return;

		this._imageURL = pValue;

		if (this.imageValueEnum == ImageValueEnum.Base64String)
			this.value = this.imageURL.replace(
				/^data:image\/(png|jpg|jpeg|gif|icon);base64,/,
				''
			);
		else
			this.value = Convert.fromBase64String(
				this.imageURL.replace(
					/^data:image\/(png|jpg|jpeg|gif|icon);base64,/,
					''
				)
			);

		this.invalidate();
	}
	public get imageURL(): string {
		return this._imageURL;
	}

	private _dataFile!: DataFile;
	public set dataFile(pValue: DataFile) {
		if (this._dataFile == pValue) return;

		this._dataFile = pValue;
		console.log(this.dataFile);
	}
	public get dataFile(): DataFile {
		return this._dataFile;
	}

	private _bAutoFitPicture: boolean = true;
	public set bAutoFitPicture(pValue: boolean) {
		if (this._bAutoFitPicture == pValue) return;
		this._bAutoFitPicture = pValue;
		this.invalidate();
	}
	public get bAutoFitPicture(): boolean {
		return this._bAutoFitPicture;
	}

	private _imageValueEnum: ImageValueEnum = ImageValueEnum.ByteArray;
	public set imageValueEnum(pValue: ImageValueEnum) {
		if (this._imageValueEnum == pValue)
			return;

		this._imageValueEnum = pValue;
	}
	public get imageValueEnum(): ImageValueEnum {
		return this._imageValueEnum;
	}

	private _bReadOnly: boolean = false;
	public set bReadOnly(pValue: boolean) {
		if (this._bReadOnly == pValue) return;
		this._bReadOnly = pValue;
		this._popup.showTrigger = !this._bReadOnly
			? input.PopupTrigger.ClickOwner
			: input.PopupTrigger.None;
		this.invalidate();
	}
	public get bReadOnly(): boolean {
		return this._bReadOnly;
	}

	private _nMaximumImageSize: number = 1048576; // ~ 1MB;
	public set nMaximumImageSize(pValue: number) {
		if (this._nMaximumImageSize == pValue) return;
		this._nMaximumImageSize = pValue;
		this.invalidate();
	}
	public get nMaximumImageSize(): number {
		return this._nMaximumImageSize;
	}

	public value: any;
	public imageInfo!: string;
	public zoomPercent!: number;

	constructor(elRef: ElementRef) {
		super(elRef.nativeElement);
	}

	public onChange = (changed: any) => { };

	public onTouch = () => { };

	public writeValue(obj: any): void {
		if (obj)
			this.value = obj;

		this._refreshData();
	}

	public registerOnChange(changed: any): void {
		this.onChange = changed;
	}

	public registerOnTouched(touched: any): void {
		this.onTouch = touched;
	}

	public refresh(fullUpdate?: boolean | undefined): void {
		super.refresh(fullUpdate);
		this.render();
	}

	ngOnInit(): void {
		this.setPopup();
	}

	ngAfterViewInit(): void { }

	ngOnDestroy(): void { }

	private _refreshData() {
		if (this.value instanceof Uint8Array) {
			this.imageURL =
				'data:image/png;base64,' + Convert.toBase64String(this.value);
		} else {
			this.imageURL = 'data:image/png;base64,' + this.value;
		}
	}

	public onUpload(e: any) {
		if (!this.bReadOnly && !this.isDisabled) {
			let _file = e.target.files[0];
			if (_file) {
				let _name = _file.name;
				let _size = _file.size;
				let _type = _file.type;
				let _lastModified = _file.lastModified;
				let _lastModifiedDate = _file.lastModifiedDate;
				let _fileReader = new FileReader();
				_fileReader.readAsDataURL(_file);
				_fileReader.onload = (ev: any) => {
					let _result = ev.target.result;
					let _src = _result;
					if (this.getSizeBase64(_src) <= this.nMaximumImageSize) {
						this.imageURL = _src;
					} else {
						this.resize(_src);
					}
					let _image = new Image();
					_image.src = _src;
					_image.onload = () => {
						let _width = _image.width;
						let _height = _image.height;
						let _sizeImage = new wjc.Size(_width, _height)
						this.dataFile = new DataFile(
							_name,
							_size,
							_type,
							_lastModified,
							_lastModifiedDate,
							_result,
							_sizeImage,
						);
					};
				};
			}
		}
	}

	private resize(src: string) {
		let _image = new Image();
		_image.src = src;
		_image.onload = () => {
			let _canvas = document.createElement('canvas');
			let _ctx = _canvas.getContext('2d');
			_canvas.width = _image.width - (50 / 100) * _image.width;
			_canvas.height = _image.height - (50 / 100) * _image.height;
			if (_ctx) {
				_ctx.drawImage(_image, 0, 0, _canvas.width, _canvas.height);
				if (this.getSizeBase64(_canvas.toDataURL()) > this.nMaximumImageSize) {
					this.resize(_canvas.toDataURL());
				} else {
					this.imageURL = _canvas.toDataURL();
				}
			}
		};
	}

	public onSave() {
		const link = document.createElement('a');
		link.download = this.randomName(10);
		link.href = this.imageURL;
		link.click();
	}

	public onRemove() {
		let _imagePreview = this.hostElement?.querySelector(
			'.bravo-picture-preview img'
		);
		let _imagePopupPreview = this._popup.hostElement?.querySelector(
			'.bravo-picture-popup-preview img'
		);
		if (_imagePreview) {
			wjc.removeClass(_imagePreview!, 'default width-100 height-100');
			wjc.addClass(_imagePreview!, 'null');
			wjc.addClass(_imagePopupPreview!, 'null');
		}
		this._upload.nativeElement.value = '';
		this.imageURL = '';
		this.imageInfo = '';
		this.dataFile = new DataFile();
		this._popup.hide();
	}

	public onZoom() {
		this._isZoom = !this._isZoom;
		let _image = this._popup.hostElement?.querySelector(
			'.bravo-picture-popup-preview img'
		);
		if (this._isZoom) {
			wjc.setCss(_image, {
				width: 'auto',
			});
			this.zoomPercent = 100;
		} else {
			wjc.setCss(_image, {
				width: '100%',
			});
			this.zoomPercent = this._currentZoomPercent;
		}
	}

	public onZoomIn() {
		let _image = this._popup.hostElement?.querySelector(
			'.bravo-picture-popup-preview img'
		);
		if (_image) {
			wjc.setCss(_image, {
				width: `${this.getCurrentWidth()! + this.getZoomValue() + 'px'}`,
			});
			this.zoomPercent = this.zoomPercent + 10;
		}
	}

	public onZoomOut() {
		let _image = this._popup.hostElement?.querySelector(
			'.bravo-picture-popup-preview img'
		);
		if (_image) {
			wjc.setCss(_image, {
				width: `${this.getCurrentWidth()! - this.getZoomValue() + 'px'}`,
			});
			if (this.zoomPercent >= 10) {
				this.zoomPercent = this.zoomPercent - 10;
			}
		}
	}

	public onPopup() {
		this.setZoomPercent();
	}

	private render(
		pValue: string = this.imageURL,
		pValueType: ImageValueEnum = this.imageValueEnum,
		pAutoFit: boolean = this.bAutoFitPicture,
		pReadOnly: boolean = this.bReadOnly
	) {
		let _pictureBox = this.hostElement?.querySelector(
			'.bravo-picture-input-box'
		);
		let _picturePreview = this.hostElement?.querySelector(
			'.bravo-picture-preview'
		);
		let _imagePreview = this.hostElement?.querySelector(
			'.bravo-picture-preview img'
		);
		let _imagePopupPreview = this._popup.hostElement?.querySelector(
			'.bravo-picture-popup-preview img'
		);
		let _image = new Image();
		_image.src = pValue;
		_image.onload = () => {
			this._imageWidth = _image.width;
			this.imageInfo = `${_image.width +
				'x' +
				_image.height +
				' ' +
				'(' +
				this.formatBytes(this.getSizeBase64(pValue)) +
				')'
				}`;

			if (_imagePreview && _picturePreview) {
				wjc.removeClass(_imagePreview!, 'null default width-100 height-100');
				wjc.removeClass(_imagePopupPreview!, 'null');
				if (pAutoFit) {
					if (_image.width >= 180) {
						if (_image.width > _image.height) {
							wjc.toggleClass(_imagePreview!, 'width-100');
							if (_imagePreview.clientHeight > _picturePreview.clientHeight) {
								wjc.toggleClass(_imagePreview!, 'height-100');
							}
						} else {
							wjc.toggleClass(_imagePreview!, 'height-100');
						}
					} else {
						wjc.toggleClass(_imagePreview!, 'default');
					}
				} else {
					wjc.setCss(_picturePreview, {
						overflow: 'auto',
					});
					wjc.setCss(_imagePreview, {
						width: 'unset',
						height: 'unset',
						top: 'unset',
						left: 'unset',
						transform: 'unset',
					});
				}
			}
		};

		if (_pictureBox) {
			wjc.toggleClass(_pictureBox, 'wj-state-readonly', pReadOnly);
			wjc.toggleClass(_pictureBox, 'disable', this.isDisabled);
		}

		console.log(this.value)

		this.onChange(this.value);

		if (_imagePopupPreview) {
			wjc.setCss(_imagePopupPreview, {
				width: '100%',
			});
		}
	}

	private getZoomValue() {
		return (this._imageWidth * 10) / 100;
	}

	private setZoomPercent() {
		this.zoomPercent = Math.round(
			(this.getCurrentWidth()! / this._imageWidth) * 100
		);
		this._currentZoomPercent = this.zoomPercent;
	}

	private getCurrentWidth() {
		return this._popup.hostElement?.querySelector(
			'.bravo-picture-popup-preview img'
		)?.clientWidth;
	}

	private setPopup() {
		let _popup = this.hostElement?.querySelector('.bravo-picture-popup');
		this._popup = new input.Popup(_popup, {
			owner: this.hostElement?.querySelector('.bravo-picture-dropdown'),
			position: wjc.PopupPosition.BelowRight,
			showTrigger:
				!this.bReadOnly && !this.isDisabled
					? input.PopupTrigger.ClickOwner
					: input.PopupTrigger.None,
			hideTrigger: input.PopupTrigger.Blur | input.PopupTrigger.ClickOwner,
			isResizable: true,
		});
		wjc.setCss(_popup, {
			width: '300px',
			height: '200px',
			borderRadius: 'unset',
		});
	}

	private getSizeBase64(base64: string) {
		let stringLength = base64.length - 'data:image/png;base64,'.length;
		let sizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.5624896334383812;
		return sizeInBytes;
	}

	private formatBytes(bytes: number, decimals = 2) {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const dm = decimals < 0 ? 0 : decimals;
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + sizes[i];
	}

	private randomName(length: number) {
		let text = '';
		const possible =
			'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		for (var i = 0; i < length; i++)
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		return text;
	}
}

export class DataFile {
	public name: string;
	public size: number;
	public type: string;
	public lastModified: number;
	public lastModifiedDate: Date;
	public result: string;
	public image: wjc.Size;

	constructor(
		pName?: string,
		pSize?: number,
		pType?: string,
		pLastModified?: number,
		pLastModifiedDate?: Date,
		pResult?: string,
		pImage?: wjc.Size
	) {
		this.name = pName;
		this.size = pSize;
		this.type = pType;
		this.lastModified = pLastModified;
		this.lastModifiedDate = pLastModifiedDate;
		this.result = pResult;
		this.image = pImage;
	}
}
