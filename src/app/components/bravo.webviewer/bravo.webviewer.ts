import { Component, ViewChild, OnInit, Output, EventEmitter, ElementRef, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs';
import WebViewer, { WebViewerInstance } from '@pdftron/webviewer';

@Component({
    selector: 'bravo-webviewer',
    templateUrl: './bravo.webviewer.html',
    styleUrls: ['./bravo.webviewer.scss']
})
export class BravoWebviewer implements OnInit, AfterViewInit {
    @ViewChild('viewer') viewer: ElementRef;
    wvInstance: WebViewerInstance;
    @Output() coreControlsEvent: EventEmitter<string> = new EventEmitter();

    private documentLoaded$: Subject<void>;

    constructor() {
        this.documentLoaded$ = new Subject<void>();
    }

    ngAfterViewInit(): void {
        WebViewer(
            {
                path: '../../../library/webviewer',
                initialDoc: '../../../assets/data/bravo-docxtemplater/docxtemplater.docx'
            },
            this.viewer.nativeElement
        ).then((instance) => {
            this.wvInstance = instance;

            this.coreControlsEvent.emit(instance.UI.LayoutMode.Single);

            const { documentViewer, Annotations, annotationManager } = instance.Core;

            instance.UI.openElements(['notesPanel']);

            documentViewer.addEventListener('annotationsLoaded', () => {
                console.log('annotations loaded');
            });

            documentViewer.addEventListener('documentLoaded', () => {
                this.documentLoaded$.next();
                const rectangleAnnot = new Annotations.RectangleAnnotation({
                    PageNumber: 1,
                    // values are in page coordinates with (0, 0) in the top left
                    X: 100,
                    Y: 150,
                    Width: 200,
                    Height: 50,
                    Author: annotationManager.getCurrentUser()
                });
                annotationManager.addAnnotation(rectangleAnnot);
                annotationManager.redrawAnnotation(rectangleAnnot);
            });
        });
    }

    ngOnInit() {}

    getDocumentLoadedObservable() {
        return this.documentLoaded$.asObservable();
    }
}
