import { Directive, TemplateRef, ViewContainerRef, OnDestroy, OnInit } from '@angular/core';
import { BravoMonacoEditorService } from './bravo.monaco.editor.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Directive({ selector: '[ngxLoadMonacoEditor]' })
export class BravoMonacoEditorDirective implements OnInit, OnDestroy {
    public isMonacoLoaded$ = this.bravoMonacoEditorService.isMonacoLoaded$.asObservable();
    public destroyed$ = new Subject<void>();

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private bravoMonacoEditorService: BravoMonacoEditorService
    ) {}

    ngOnInit() {
        this.isMonacoLoaded$.pipe(takeUntil(this.destroyed$)).subscribe((loaded) => {
            if (!loaded) {
                return this.viewContainer.clear();
            }
            this.viewContainer.createEmbeddedView(this.templateRef);
        });
    }

    ngOnDestroy() {
        this.destroyed$.next();
        this.destroyed$.complete();
    }
}
