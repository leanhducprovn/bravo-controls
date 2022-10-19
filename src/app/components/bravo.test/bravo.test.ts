import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { filter, take } from 'rxjs/operators';
import {
    BravoMonaco,
    BravoMonacoEditorConstructionOptions,
    BravoMonacoStandaloneCodeEditor,
    BravoMonacoUri
} from '../bravo.monaco.editor/bravo.monaco.editor.interfaces';
import { BravoMonacoEditorService } from '../bravo.monaco.editor/bravo.monaco.editor.service';

declare var monaco: BravoMonaco;
@Component({
    selector: 'bravo-test',
    templateUrl: './bravo.test.html',
    styleUrls: ['./bravo.test.scss']
})
export class BravoTest implements OnInit {
    constructor(
        private http: HttpClient,
        private fb: FormBuilder,
        private bravoMonacoEditorService: BravoMonacoEditorService
    ) {
        this.bravoMonacoEditorService.isMonacoLoaded$
            .pipe(
                filter((isLoaded) => !!isLoaded),
                take(1)
            )
            .subscribe(() => {
                this.registerMonacoCustomTheme();
            });
    }

    public editor: BravoMonacoEditorConstructionOptions = {
        theme: 'myCustomTheme',
        language: 'html',
        roundedSelection: true,
        autoIndent: 'full',
        value: this.getCode()
    };

    public modelUri: BravoMonacoUri;

    ngOnInit(): void {
        this.loadXML();
    }

    private loadXML() {
        const _api = './assets/data/declare.xml';
        let _data: any;
        this.http
            .get(_api, {
                headers: new HttpHeaders()
                    .set('Content-Type', 'text/xml')
                    .append('Access-Control-Allow-Methods', 'GET')
                    .append('Access-Control-Allow-Origin', '*')
                    .append(
                        'Access-Control-Allow-Headers',
                        'Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method'
                    ),
                responseType: 'text'
            })
            .subscribe(
                (data) => {
                    _data = data;
                },
                (error) => {
                    console.log(error);
                },
                () => {
                    this.editor.value = _data;
                }
            );
    }

    editorInit(editor: BravoMonacoStandaloneCodeEditor) {
        // Programatic content selection example
        editor.setSelection({
            startLineNumber: 1,
            startColumn: 1,
            endColumn: 50,
            endLineNumber: 3
        });
    }

    getCode() {
        return (
            // tslint:disable-next-line: max-line-length
            '<html><!-- // !!! Tokens can be inspected using F1 > Developer: Inspect Tokens !!! -->\n<head>\n	<!-- HTML comment -->\n	<style type="text/css">\n		/* CSS comment */\n	</style>\n	<script type="javascript">\n		// JavaScript comment\n	</' +
            'script>\n</head>\n<body></body>\n</html>'
        );
    }

    registerMonacoCustomTheme() {
        monaco.editor.defineTheme('myCustomTheme', {
            base: 'vs',
            inherit: true,
            rules: [
                {
                    token: 'comment',
                    foreground: '298a08',
                    fontStyle: 'italic underline'
                },
                { token: 'comment.js', foreground: 'ff0303', fontStyle: 'bold' },
                { token: 'comment.css', foreground: 'ff0303', fontStyle: 'bold' }
            ],
            colors: {}
        });
    }

    // editorOptions = { theme: 'vs-dark', language: 'javascript' };
    // code: string = 'function x() {\nconsole.log("Hello world!");\n}';
    // originalCode: string = 'function x() { // TODO }';
}
