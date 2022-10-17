import { Component, Inject, Input } from '@angular/core';
import { fromEvent } from 'rxjs';

import { BravoMonacoEditorBase } from './bravo.monaco.editor.base';
import { BRAVO_MONACO_EDITOR_CONFIG, BravoMonacoEditorConfig } from './bravo.monaco.editor.config';
import { DiffEditorModel } from './bravo.monaco.editor.types';

declare var monaco: any;

@Component({
	selector: 'ngx-monaco-diff-editor',
	template: '<div class="editor-container" #editorContainer></div>',
	styles: [`
    :host {
      display: block;
      height: 200px;
    }

    .editor-container {
      width: 100%;
      height: 98%;
    }
  `]
})
export class DiffEditorComponent extends BravoMonacoEditorBase {

	_originalModel: DiffEditorModel;
	_modifiedModel: DiffEditorModel;

	@Input('options')
	set options(options: any) {
		this._options = Object.assign({}, this.config.defaultOptions, options);
		if (this._editor) {
			this._editor.dispose();
			this.initMonaco(options);
		}
	}

	get options(): any {
		return this._options;
	}

	@Input('originalModel')
	set originalModel(model: DiffEditorModel) {
		this._originalModel = model;
		if (this._editor) {
			this._editor.dispose();
			this.initMonaco(this.options);
		}
	}

	@Input('modifiedModel')
	set modifiedModel(model: DiffEditorModel) {
		this._modifiedModel = model;
		if (this._editor) {
			this._editor.dispose();
			this.initMonaco(this.options);
		}
	}

	constructor(@Inject(BRAVO_MONACO_EDITOR_CONFIG) private editorConfig: BravoMonacoEditorConfig) {
		super(editorConfig);
	}

	protected initMonaco(options: any): void {

		if (!this._originalModel || !this._modifiedModel) {
			throw new Error('originalModel or modifiedModel not found for ngx-monaco-diff-editor');
		}

		this._originalModel.language = this._originalModel.language || options.language;
		this._modifiedModel.language = this._modifiedModel.language || options.language;

		let originalModel = monaco.editor.createModel(this._originalModel.code, this._originalModel.language);
		let modifiedModel = monaco.editor.createModel(this._modifiedModel.code, this._modifiedModel.language);

		this._editorContainer.nativeElement.innerHTML = '';
		const theme = options.theme;
		this._editor = monaco.editor.createDiffEditor(this._editorContainer.nativeElement, options);
		options.theme = theme;
		this._editor.setModel({
			original: originalModel,
			modified: modifiedModel
		});

		// refresh layout on resize event.
		if (this._windowResizeSubscription) {
			this._windowResizeSubscription.unsubscribe();
		}
		this._windowResizeSubscription = fromEvent(window, 'resize').subscribe(() => this._editor.layout());
		this.onInit.emit(this._editor);
	}

}