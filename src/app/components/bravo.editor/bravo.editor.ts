import { Component, ElementRef, OnInit } from '@angular/core';
import { DiffEditorModel } from 'ngx-monaco-editor';

import * as wjc from '@grapecity/wijmo';
@Component({
	selector: 'bravo-editor',
	templateUrl: './bravo.editor.html',
	styleUrls: ['./bravo.editor.scss']
})
export class BravoEditor extends wjc.Control implements OnInit {

	editorOptions = { theme: 'vs-dark', language: 'typescript' };
	code: string = 'function x() {\nconsole.log("Hello world!");\n}';

	options = {
		theme: 'vs-dark'
	};
	originalModel: DiffEditorModel = {
		code: 'heLLo world!',
		language: 'text/plain'
	};

	modifiedModel: DiffEditorModel = {
		code: 'hello orlando!',
		language: 'text/plain'
	};

	onInit(editor) {
		let line = editor.getPosition();
		console.log(line);
	}

	constructor(elementRef: ElementRef) {
		super(elementRef.nativeElement);
	}

	ngOnInit(): void {
		this.test()
	}

	test() {
		console.log(this.hostElement.querySelector('.editor-container'))
		wjc.setCss(this.hostElement.querySelector('.editor-container'), {
			width: '100%',
			height: '100%'
		})
	}
}
