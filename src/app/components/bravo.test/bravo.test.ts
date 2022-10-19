import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
    selector: 'bravo-test',
    templateUrl: './bravo.test.html',
    styleUrls: ['./bravo.test.scss']
})
export class BravoTest implements OnInit {
    constructor(private http: HttpClient, private fb: FormBuilder) {}

    public editor = {
        theme: 'vs',
        language: 'xml',
        value: ''
    };

    // editorOptions = { theme: 'vs-dark', language: 'javascript' };
    // code: string = 'function x() {\nconsole.log("Hello world!");\n}';
    // originalCode: string = 'function x() { // TODO }';

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
}
