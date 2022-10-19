import {
    Component,
    ViewChild,
    ElementRef,
    EventEmitter,
    OnInit,
    OnChanges,
    OnDestroy,
    Output,
    Input,
    ChangeDetectionStrategy,
    SimpleChanges
} from '@angular/core';
import { filter, take } from 'rxjs/operators';

import { BravoMonacoEditorService } from './bravo.monaco.editor.service';
import {
    BravoMonaco,
    BravoMonacoDiffEditorConstructionOptions,
    BravoMonacoStandaloneDiffEditor
} from './bravo.monaco.editor.interfaces';

declare var monaco: BravoMonaco;

@Component({
    selector: 'bravo-monaco-diff-editor',
    templateUrl: './bravo.monaco.editor.html',
    styleUrls: ['./bravo.monaco.editor.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BravoMonacoDiffEditor implements OnInit, OnChanges, OnDestroy {
    container: HTMLDivElement;
    editor: BravoMonacoStandaloneDiffEditor;

    @Input() original: string;
    @Input() modified: string;
    @Input() options: BravoMonacoDiffEditorConstructionOptions;
    @Output() init: EventEmitter<BravoMonacoStandaloneDiffEditor> = new EventEmitter();

    @ViewChild('editor', { static: true }) editorContent: ElementRef;

    constructor(private bravoMonacoEditorService: BravoMonacoEditorService) {}

    ngOnInit() {
        this.container = this.editorContent.nativeElement;
        this.bravoMonacoEditorService.isMonacoLoaded$
            .pipe(
                filter((isLoaded) => isLoaded),
                take(1)
            )
            .subscribe(() => {
                this.initMonaco();
            });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (
            this.editor &&
            ((changes.code && !changes.code.firstChange) || (changes.modified && !changes.modified.firstChange))
        ) {
            const modified = monaco.editor.createModel(this.modified);
            const original = monaco.editor.createModel(this.original);
            this.editor.setModel({
                original,
                modified
            });
        }
        if (this.editor && changes.options && !changes.options.firstChange) {
            if (changes.options.previousValue.theme !== changes.options.currentValue.theme) {
                monaco.editor.setTheme(changes.options.currentValue.theme);
            }

            this.editor.updateOptions(changes.options.currentValue);
        }
    }

    private initMonaco() {
        let opts: BravoMonacoDiffEditorConstructionOptions = {
            readOnly: true,
            automaticLayout: true,
            theme: 'vc'
        };
        if (this.options) {
            opts = Object.assign({}, opts, this.options);
        }
        this.editor = monaco.editor.createDiffEditor(this.container, opts);

        const original = monaco.editor.createModel(this.original);
        const modified = monaco.editor.createModel(this.modified);

        this.editor.setModel({
            original,
            modified
        });
        this.editor.layout();
        this.init.emit(this.editor);
    }

    ngOnDestroy() {
        if (this.editor) {
            this.editor.dispose();
        }
    }
}
