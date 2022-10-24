import { Component, OnInit } from '@angular/core';
import { BravoMonacoEditorConstructionOptions } from 'src/app/components/bravo.monaco.editor/bravo.monaco.editor.type';

@Component({
    selector: 'app-bravo-monaco-editor-base-demo',
    templateUrl: './bravo.monaco.editor.base.demo.html',
    styleUrls: ['./bravo.monaco.editor.base.demo.scss']
})
export class BravoMonacoEditorBaseDemo implements OnInit {
    constructor() {}

    public editor: BravoMonacoEditorConstructionOptions = {
        theme: 'vs-dark',
        language: 'javascript',
        value: `function Bravo(p1, p2) {
    return p1 * p2;
}`
    };

    ngOnInit(): void {}
}
