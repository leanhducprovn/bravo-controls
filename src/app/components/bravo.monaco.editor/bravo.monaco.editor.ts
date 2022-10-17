import { Component, forwardRef, Inject, Input, NgZone } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { fromEvent } from 'rxjs';

import { BravoMonacoEditorBase } from './bravo.monaco.editor.base';
import { BRAVO_MONACO_EDITOR_CONFIG, BravoMonacoEditorConfig } from './bravo.monaco.editor.config';
import { BravoMonaco, BravoMonacoEditorOptions } from './bravo.monaco.editor.types';

declare var monaco: BravoMonaco;

@Component({
    selector: 'bravo-monaco-editor',
    templateUrl: './bravo.monaco.editor.html',
    styleUrls: ['./bravo.monaco.editor.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => BravoMonacoEditor),
            multi: true
        }
    ]
})
export class BravoMonacoEditor extends BravoMonacoEditorBase implements ControlValueAccessor {
    private _value: string = '';

    propagateChange = (_: any) => {};
    onTouched = () => {};

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

    @Input('model')
    set model(model: BravoMonacoEditorOptions) {
        this.options.model = model;
        if (this._editor) {
            this._editor.dispose();
            this.initMonaco(this.options);
        }
    }

    constructor(
        private zone: NgZone,
        @Inject(BRAVO_MONACO_EDITOR_CONFIG)
        private editorConfig: BravoMonacoEditorConfig
    ) {
        super(editorConfig);
    }

    writeValue(value: any): void {
        this._value = value || '';
        // Fix for value change while dispose in process.
        setTimeout(() => {
            if (this._editor && !this.options.model) {
                this._editor.setValue(this._value);
            }
        });
    }

    registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    protected initMonaco(options: any): void {
        const hasModel = !!options.model;

        if (hasModel) {
            const model = monaco.editor.getModel(options.model.uri || '');
            if (model) {
                options.model = model;
                options.model.setValue(this._value);
            } else {
                options.model = monaco.editor.createModel(
                    options.model.value,
                    options.model.language,
                    options.model.uri
                );
            }
        }

        this._editor = monaco.editor.create(this._editorContainer.nativeElement, options);

        if (!hasModel) {
            this._editor.setValue(this._value);
        }

        this._editor.onDidChangeModelContent((e: any) => {
            const value = this._editor.getValue();

            // value is not propagated to parent when executing outside zone.
            this.zone.run(() => {
                this.propagateChange(value);
                this._value = value;
            });
        });

        this._editor.onDidBlurEditorWidget(() => {
            this.onTouched();
        });

        // refresh layout on resize event.
        if (this._windowResizeSubscription) {
            this._windowResizeSubscription.unsubscribe();
        }
        this._windowResizeSubscription = fromEvent(window, 'resize').subscribe(() =>
            this._editor.layout()
        );
        this.onInit.emit(this._editor);
    }
}
