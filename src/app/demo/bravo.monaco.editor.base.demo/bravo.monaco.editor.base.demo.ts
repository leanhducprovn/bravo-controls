import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BravoMonacoEditorConstructionOptions } from 'src/app/components/bravo.monaco.editor/bravo.monaco.editor.type';

@Component({
    selector: 'bravo-monaco-editor-base-demo',
    templateUrl: './bravo.monaco.editor.base.demo.html',
    styleUrls: ['./bravo.monaco.editor.base.demo.scss']
})
export class BravoMonacoEditorBaseDemo implements OnInit {
    constructor(private http: HttpClient) {}

    public editor: BravoMonacoEditorConstructionOptions = {
        value: `<?xml version="1.0" encoding="UTF-8"?>
<shiporder>
	<shipto>
		<name>Ola Nordmann</name>
		<address>Langgt 23</address>
		<city>4000 Stavanger</city>
		<country>Norway</country>
	</shipto>
</shiporder>`
    };

    ngOnInit(): void {}
}
