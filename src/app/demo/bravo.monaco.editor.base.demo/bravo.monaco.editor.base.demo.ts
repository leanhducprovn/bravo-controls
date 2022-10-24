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
        language: 'xml',
        value: `<?xml version="1.0" encoding="UTF-8"?>
<shiporder>
    <orderperson>John Smith</orderperson>
    <shipto>
        <name>Ola Nordmann</name>
        <address>Langgt 23</address>
        <city>4000 Stavanger</city>
        <country>Norway</country>
    </shipto>
    <item>
        <title>Empire Burlesque</title>
        <note>Special Edition</note>
        <quantity>1</quantity>
        <price>10.90</price>
    </item>
    <item>
        <title>Hide your heart</title>
        <quantity>1</quantity>
        <price>9.90</price>
        <ducla>10.10</ducla>
    </item>
</shiporder>`
    };

    ngOnInit(): void {}
}
