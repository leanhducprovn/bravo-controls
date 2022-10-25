import {
    Component,
    ViewChild,
    ElementRef,
    EventEmitter,
    OnInit,
    OnChanges,
    OnDestroy,
    Input,
    ChangeDetectionStrategy,
    forwardRef,
    SimpleChanges,
    Output
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, Validator, NG_VALIDATORS, ValidationErrors } from '@angular/forms';
import { filter, take } from 'rxjs/operators';

import { BravoMonacoEditorService } from './bravo.monaco.editor.service';
import {
    BravoMonaco,
    BravoMonacoUri,
    BravoMonacoTextModel,
    BravoMonacoStandaloneCodeEditor,
    BravoMonacoEditorConstructionOptions,
    BravoMonacoEditorMinimapOptions
} from './bravo.monaco.editor.type';

declare var monaco: BravoMonaco;

@Component({
    selector: 'bravo-monaco-editor',
    templateUrl: './bravo.monaco.editor.html',
    styleUrls: ['./bravo.monaco.editor.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => BravoMonacoEditor),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => BravoMonacoEditor),
            multi: true
        }
    ]
})
export class BravoMonacoEditor implements OnInit, OnChanges, OnDestroy, ControlValueAccessor, Validator {
    private _value: string = 'Bravo Monaco Editor';
    @Input()
    public set value(pValue: string) {
        if (this._value == pValue) return;

        this._value = pValue;
    }
    public get value(): string {
        return this._value;
    }

    private _minimap: BravoMonacoEditorMinimapOptions = {
        autohide: false,
        enabled: false,
        maxColumn: 120,
        renderCharacters: true,
        scale: 1,
        showSlider: 'mouseover',
        side: 'right',
        size: 'fit'
    };
    @Input()
    public set minimap(pValue: BravoMonacoEditorMinimapOptions) {
        if (this._minimap == pValue) return;

        this._minimap = pValue;
    }
    public get minimap(): BravoMonacoEditorMinimapOptions {
        return this._minimap;
    }

    private _options: BravoMonacoEditorConstructionOptions;
    @Input()
    public set options(pValue: BravoMonacoEditorConstructionOptions) {
        if (this._options == pValue) return;

        this._options = pValue;
    }
    public get options(): BravoMonacoEditorConstructionOptions {
        return this._options;
    }

    @Input()
    uri?: BravoMonacoUri;
    @Output() init: EventEmitter<BravoMonacoStandaloneCodeEditor> = new EventEmitter();
    @ViewChild('editor', { static: true }) editorContent: ElementRef;

    public editor: BravoMonacoStandaloneCodeEditor;
    public modelUriInstance: BravoMonacoTextModel;

    public parsedError: string;

    private onTouched: () => void = () => {};
    private onErrorStatusChange: () => void = () => {};
    private propagateChange: (_: any) => any = () => {};

    get model() {
        return this.editor && this.editor.getModel();
    }

    get modelMarkers() {
        return (
            this.model &&
            monaco.editor.getModelMarkers({
                resource: this.model.uri
            })
        );
    }

    constructor(private bravoMonacoEditorService: BravoMonacoEditorService) {}

    ngOnInit() {
        this.bravoMonacoEditorService.isMonacoLoaded$
            .pipe(
                filter((isLoaded) => isLoaded),
                take(1)
            )
            .subscribe(() => {
                this.initEditor();
            });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.editor && changes.options && !changes.options.firstChange) {
            const { language: toLanguage, theme: toTheme, ...options } = changes.options.currentValue;
            const { language: fromLanguage, theme: fromTheme } = changes.options.previousValue;

            if (fromLanguage !== toLanguage) {
                monaco.editor.setModelLanguage(
                    this.editor.getModel(),
                    this.options && this.options.language ? this.options.language : 'text'
                );
            }

            if (fromTheme !== toTheme) {
                monaco.editor.setTheme(toTheme);
            }

            this.editor.updateOptions(options);
        }

        if (this.editor && changes.uri) {
            const toUri = changes.uri.currentValue;
            const fromUri = changes.uri.previousValue;

            if ((fromUri && !toUri) || (!fromUri && toUri) || (toUri && fromUri && toUri.path !== fromUri.path)) {
                const value = this.editor.getValue();

                if (this.modelUriInstance) {
                    this.modelUriInstance.dispose();
                }

                let existingModel;

                if (toUri) {
                    existingModel = monaco.editor.getModels().find((model) => model.uri.path === toUri.path);
                }

                this.modelUriInstance = existingModel
                    ? existingModel
                    : monaco.editor.createModel(value, this.options.language || 'text', this.uri);
                this.editor.setModel(this.modelUriInstance);
            }
        }
    }

    writeValue(value: string): void {
        this.value = value;
        if (this.editor && value) {
            this.editor.setValue(value);
        } else if (this.editor) {
            this.editor.setValue('');
        }
    }

    registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    validate(): ValidationErrors {
        return !this.parsedError
            ? null
            : {
                  monaco: {
                      value: this.parsedError.split('|')
                  }
              };
    }

    registerOnValidatorChange?(fn: () => void): void {
        this.onErrorStatusChange = fn;
    }

    private initEditor() {
        const options: BravoMonacoEditorConstructionOptions = {
            value: [this.value].join('\n'),
            language: 'text',
            automaticLayout: true,
            scrollBeyondLastLine: false,
            theme: 'vc',
            minimap: this.minimap
        };

        this.editor = monaco.editor.create(
            this.editorContent.nativeElement,
            this.options ? { ...options, ...this.options } : options
        );

        this.registerEditorListeners();
        this.init.emit(this.editor);
    }

    public registerEditorListeners() {
        this.editor.onDidChangeModelContent(() => {
            this.propagateChange(this.editor.getValue());
        });

        this.editor.onDidChangeModelDecorations(() => {
            const currentParsedError = this.modelMarkers.map(({ message }) => message).join('|');
            const hasValidationStatusChanged = this.parsedError !== currentParsedError;

            if (hasValidationStatusChanged) {
                this.parsedError = currentParsedError;
                this.onErrorStatusChange();
            }
        });

        this.editor.onDidBlurEditorText(() => {
            this.onTouched();
        });
    }

    ngOnDestroy() {
        if (this.editor) {
            this.editor.dispose();
        }
    }
}
