import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Inject,
    OnDestroy,
    Output,
    ViewChild
} from '@angular/core';
import { Subscription } from 'rxjs';

import * as monaco from 'monaco-editor';

import { BRAVO_MONACO_EDITOR_CONFIG, BravoMonacoEditorConfig } from './bravo.monaco.editor.config';

@Component({
    template: ''
})
export abstract class BravoMonacoEditorBase implements AfterViewInit, OnDestroy {
    @ViewChild('editorContainer', { static: true }) _editorContainer: ElementRef;
    @Output() onInit = new EventEmitter<any>();

    private _loadedMonaco: boolean = false;
    private _loadPromise: Promise<void>;

    protected _editor!: any;
    protected _options: monaco.editor.EditorOption;
    protected _windowResizeSubscription: Subscription;

    constructor(@Inject(BRAVO_MONACO_EDITOR_CONFIG) protected config: BravoMonacoEditorConfig) {}

    ngAfterViewInit(): void {
        if (this._loadedMonaco) {
            // Wait until monaco editor is available
            this._loadPromise.then(() => {
                this.initMonaco(this._options);
            });
        } else {
            this._loadedMonaco = true;
            this._loadPromise = new Promise<void>((resolve: any) => {
                const baseUrl = (this.config.baseUrl || './assets') + '/monaco-editor/min/vs';
                if (typeof (<any>window).monaco === 'object') {
                    resolve();
                    return;
                }
                const onGotAmdLoader: any = () => {
                    // Load monaco
                    (<any>window).require.config({ paths: { vs: `${baseUrl}` } });
                    (<any>window).require([`vs/editor/editor.main`], () => {
                        if (typeof this.config.onMonacoLoad === 'function') {
                            this.config.onMonacoLoad();
                        }
                        this.initMonaco(this._options);
                        resolve();
                    });
                };

                // Load AMD loader if necessary
                if (!(<any>window).require) {
                    const loaderScript: HTMLScriptElement = document.createElement('script');
                    loaderScript.type = 'text/javascript';
                    loaderScript.src = `${baseUrl}/loader.js`;
                    loaderScript.addEventListener('load', onGotAmdLoader);
                    document.body.appendChild(loaderScript);
                } else {
                    onGotAmdLoader();
                }
            });
        }
    }

    protected abstract initMonaco(options: monaco.editor.EditorOption): void;

    ngOnDestroy() {
        if (this._windowResizeSubscription) {
            this._windowResizeSubscription.unsubscribe();
        }
        if (this._editor) {
            this._editor.dispose();
            this._editor = undefined;
        }
    }
}
