import {
    Component,
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
import * as wjc from '@grapecity/wijmo';

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
export class BravoMonacoEditor
    extends wjc.Control
    implements OnInit, OnChanges, OnDestroy, ControlValueAccessor, Validator
{
    /**
     * Value
     */
    private _value: string = 'Bravo Monaco Editor';
    @Input()
    public set value(pValue: string) {
        if (this._value == pValue) return;

        this._value = pValue;
    }
    public get value(): string {
        return this._value;
    }

    /**
     * Language
     */
    private _language: string = 'xml';
    @Input()
    public set language(pValue: string) {
        if (this._language == pValue) return;

        this._language = pValue;
    }
    public get language(): string {
        return this._language;
    }

    /**
     * Theme
     * The current out-of-the-box available themes are: 'vs' (default), 'vs-dark', 'hc-black', 'hc-light'.
     */
    private _theme: string = 'vs';
    @Input()
    public set theme(pValue: string) {
        if (this._theme == pValue) return;

        this._theme = pValue;
    }
    public get theme(): string {
        return this._theme;
    }

    /**
     * ReadOnly
     */
    private _readOnly: boolean = false;
    @Input()
    public set readOnly(pValue: boolean) {
        if (this._readOnly == pValue) return;

        this._readOnly = pValue;
    }
    public get readOnly(): boolean {
        return this._readOnly;
    }

    /**
     * Folding enabled
     */
    private _folding: boolean = true;
    @Input()
    public set folding(pValue: boolean) {
        if (this._folding == pValue) return;

        this._folding = pValue;
    }
    public get folding(): boolean {
        return this._folding;
    }

    /**
     * Folding highlight
     */
    private _foldingHighlight: boolean = true;
    @Input()
    public set foldingHighlight(pValue: boolean) {
        if (this._foldingHighlight == pValue) return;

        this._foldingHighlight = pValue;
    }
    public get foldingHighlight(): boolean {
        return this._foldingHighlight;
    }

    /**
     * Folding imports by default
     */
    private _foldingImportsByDefault: boolean = true;
    @Input()
    public set foldingImportsByDefault(pValue: boolean) {
        if (this._foldingImportsByDefault == pValue) return;

        this._foldingImportsByDefault = pValue;
    }
    public get foldingImportsByDefault(): boolean {
        return this._foldingImportsByDefault;
    }

    /**
     * Folding maximum regions
     */
    private _foldingMaximumRegions: number = 5000;
    @Input()
    public set foldingMaximumRegions(pValue: number) {
        if (this._foldingMaximumRegions == pValue) return;

        this._foldingMaximumRegions = pValue;
    }
    public get foldingMaximumRegions(): number {
        return this._foldingMaximumRegions;
    }

    /**
     * Folding strategy
     */
    private _foldingStrategy: 'auto' | 'indentation' = 'auto';
    @Input()
    public set foldingStrategy(pValue: 'auto' | 'indentation') {
        if (this._foldingStrategy == pValue) return;

        this._foldingStrategy = pValue;
    }
    public get foldingStrategy(): 'auto' | 'indentation' {
        return this._foldingStrategy;
    }

    /**
     * Show folding controls
     */
    private _showFoldingControls: 'always' | 'never' | 'mouseover' = 'always';
    @Input()
    public set showFoldingControls(pValue: 'always' | 'never' | 'mouseover') {
        if (this._showFoldingControls == pValue) return;

        this._showFoldingControls = pValue;
    }
    public get showFoldingControls(): 'always' | 'never' | 'mouseover' {
        return this._showFoldingControls;
    }

    /**
     * Minimap
     */
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

    /**
     * Scroll
     */
    private _scrollBeyondLastLine: boolean = false;
    @Input()
    public set scrollBeyondLastLine(pValue: boolean) {
        if (this._scrollBeyondLastLine == pValue) return;

        this._scrollBeyondLastLine = pValue;
    }
    public get scrollBeyondLastLine(): boolean {
        return this._scrollBeyondLastLine;
    }

    /**
     * Automatic layout
     */
    private _automaticLayout: boolean = true;
    @Input()
    public set automaticLayout(pValue: boolean) {
        if (this._automaticLayout == pValue) return;

        this._automaticLayout = pValue;
    }
    public get automaticLayout(): boolean {
        return this._automaticLayout;
    }

    /**
     * Mouse style
     */
    private _mouseStyle: 'default' | 'text' | 'copy' = 'text';
    @Input()
    public set mouseStyle(pValue: 'default' | 'text' | 'copy') {
        if (this._mouseStyle == pValue) return;

        this._mouseStyle = pValue;
    }
    public get mouseStyle(): 'default' | 'text' | 'copy' {
        return this._mouseStyle;
    }

    /**
     * Tab size
     */
    private _tabSize: number = 8;
    @Input()
    public set tabSize(pValue: number) {
        if (this._tabSize == pValue) return;

        this._tabSize = pValue;
    }
    public get tabSize(): number {
        return this._tabSize;
    }

    /**
     * Options
     */
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
    public uri?: BravoMonacoUri;

    @Output()
    init: EventEmitter<BravoMonacoStandaloneCodeEditor> = new EventEmitter();

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

    constructor(private bravoMonacoEditorService: BravoMonacoEditorService, private elRef: ElementRef) {
        super(elRef.nativeElement);
    }

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
            theme: this.theme,
            value: [this.value].join('\n'),
            minimap: this.minimap,
            language: this.language,
            readOnly: this.readOnly,
            folding: this.folding,
            foldingHighlight: this.foldingHighlight,
            foldingImportsByDefault: this.foldingImportsByDefault,
            foldingMaximumRegions: this.foldingMaximumRegions,
            foldingStrategy: this.foldingStrategy,
            showFoldingControls: this.showFoldingControls,
            scrollBeyondLastLine: this.scrollBeyondLastLine,
            automaticLayout: this.automaticLayout,
            mouseStyle: this.mouseStyle,
            tabSize: this.tabSize
        };

        const editorContent = this.hostElement?.querySelector('.bravo-monaco-editor') as HTMLElement;
        if (editorContent)
            this.editor = monaco.editor.create(editorContent, this.options ? { ...options, ...this.options } : options);

        this.registerEditorListeners();
        this.init.emit(this.editor);
    }

    private registerEditorListeners() {
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
