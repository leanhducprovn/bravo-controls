import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';

import * as wjc from '@grapecity/wijmo';

interface IBravoEditor {
	theme?: string,
	language?: string,
	value?: string,
}

@Component({
	selector: 'bravo-editor',
	templateUrl: './bravo.editor.html',
	styleUrls: ['./bravo.editor.scss']
})

export class BravoEditor extends wjc.Control implements OnInit {

	private _options: IBravoEditor = {
		theme: 'vs',
		language: 'typescript',
		value: 'Bravo Editor'
	};
	public set options(pValue: IBravoEditor) {
		if (this._options == pValue)
			return;

		this._options = pValue;
		this.invalidate();
	}
	public get options(): IBravoEditor {
		return this._options;
	}

	constructor(private http: HttpClient, elementRef: ElementRef) {
		super(elementRef.nativeElement);
	}

	refresh(fullUpdate?: boolean): void {
		super.refresh(fullUpdate);
	}

	ngOnInit(): void {
		this.initEditor();
	}

	private initEditor() {
		// set options
		const _api = './assets/data/cash-receipts.xml';
		let _data: any;
		this.http
			.get(_api, {
				headers: new HttpHeaders()
					.set('Content-Type', 'text/xml')
					.append('Access-Control-Allow-Methods', 'GET')
					.append('Access-Control-Allow-Origin', '*')
					.append(
						'Access-Control-Allow-Headers',
						'Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method'
					),
				responseType: 'text',
			})
			.subscribe(
				(data) => {
					_data = data;
				},
				(error) => {
					console.log(error);
				},
				() => {
					this.options = {
						theme: 'vs',
						language: 'xml',
						value: _data
					}
				}
			);

		// set container
		let _editorContainer = this.hostElement?.querySelector('.editor-container');
		if (_editorContainer)
			wjc.setCss(_editorContainer, {
				width: '100%',
				height: '100%'
			})
	}

	public getPreferredSize() {
		let _editor = this.hostElement?.querySelector('.bravo-editor');
		if (_editor)
			return new wjc.Size(_editor.clientWidth, _editor.clientHeight);
	}


}
