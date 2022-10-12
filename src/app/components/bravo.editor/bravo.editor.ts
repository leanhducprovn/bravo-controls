import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, forwardRef, Input, OnInit } from '@angular/core';
import { FormBuilder, NG_VALUE_ACCESSOR } from '@angular/forms';

import * as wjc from '@grapecity/wijmo';

interface IBravoEditor {
	theme?: string;
	language?: string;
	value?: string;
}

@Component({
	selector: 'bravo-editor',
	templateUrl: './bravo.editor.html',
	styleUrls: ['./bravo.editor.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			multi: true,
			useExisting: forwardRef(() => BravoEditor),
		},
	],
})
export class BravoEditor extends wjc.Control implements OnInit {
	private _theme: string = 'vs';
	@Input()
	public set theme(pValue: string) {
		if (this._theme == pValue) return;

		this._theme = this.options.theme = pValue;
	}
	public get theme(): string {
		return this._theme;
	}

	private _language: string = 'xml';
	@Input()
	public set language(pValue: string) {
		if (this._language == pValue) return;

		this._language = this.options.language = pValue;
	}
	public get language(): string {
		return this._language;
	}

	private _value: string = 'Bravo Editor';
	@Input()
	public set value(pValue: string) {
		if (this._value == pValue) return;

		this._value = this.options.value = pValue;
	}
	public get value(): string {
		return this._value;
	}

	private _options: IBravoEditor = {
		theme: this.theme,
		language: this.language,
		value: this.value,
	};
	public set options(pValue: IBravoEditor) {
		if (this._options == pValue) return;

		this._options = pValue;
		this.invalidate();
	}
	public get options(): IBravoEditor {
		return this._options;
	}

	constructor(elementRef: ElementRef) {
		super(elementRef.nativeElement);
	}

	public onChange = (changed: any) => { };

	public onTouch = () => { };

	public writeValue(obj: any): void { }

	refresh(fullUpdate?: boolean): void {
		super.refresh(fullUpdate);
	}

	ngOnInit(): void {
		this.initEditor();
	}

	private initEditor() {
		// set container
		let _editorContainer = this.hostElement?.querySelector('.editor-container');
		if (_editorContainer)
			wjc.setCss(_editorContainer, {
				width: '100%',
				height: '100%',
			});
	}

	public getPreferredSize() {
		let _editor = this.hostElement?.querySelector('.bravo-editor');
		if (_editor) return new wjc.Size(_editor.clientWidth, _editor.clientHeight);
	}
}
