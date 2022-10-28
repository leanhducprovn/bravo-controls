import { Component, ElementRef, OnInit } from '@angular/core';
import Docxtemplater from 'docxtemplater';
import * as PizZip from 'pizzip';
import PizZipUtils from 'pizzip/utils/index.js';
import { saveAs } from 'file-saver';
import { DomSanitizer } from '@angular/platform-browser';

import * as wjc from '@grapecity/wijmo';
import * as docx from 'docx-preview';
import * as print from 'print-js';

@Component({
    selector: 'bravo-docxtemplater',
    templateUrl: './bravo.docxtemplater.html',
    styleUrls: ['./bravo.docxtemplater.scss']
})
export class BravoDocxtemplater extends wjc.Control implements OnInit {
    constructor(private sanitizer: DomSanitizer, private elRef: ElementRef) {
        super(elRef.nativeElement);
    }

    ngOnInit(): void {}

    public file!: any;

    private loadFile(url, callback) {
        PizZipUtils.getBinaryContent(url, callback);
    }

    public onGenerate() {
        this.loadFile(
            './assets/data/bravo-docxtemplater/docxtemplater2.docx',
            (error: Error | null, content: string) => {
                if (error) {
                    throw error;
                }
                const zip = new PizZip(content);
                const doc = new Docxtemplater(zip, {
                    paragraphLoop: true,
                    linebreaks: true
                });

                doc.setData({
                    company: 'Cổ phần Phần mềm Bravo',
                    full_name: 'Lê Anh Đức',
                    name: 'Đức',
                    signature: 'Duc',
                    date_of_birth: '27/02/2001',
                    cmnd: Math.floor(Math.random() * Date.now()),
                    date_range: `${Math.floor(Math.random() * 31)}/${Math.floor(Math.random() * 13)}/2020`,
                    phone: '0977.977.655',
                    city: 'Hà Nội',
                    residential_address: 'Kim Nỗ, Đông Anh, Hà Nội',
                    day: 28,
                    month: 10,
                    year: 2022
                });
                try {
                    // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
                    doc.render();
                } catch (error) {
                    // The error thrown here contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).
                    function replaceErrors(key, value) {
                        if (value instanceof Error) {
                            return Object.getOwnPropertyNames(value).reduce(function (error, key) {
                                error[key] = value[key];
                                return error;
                            }, {});
                        }
                        return value;
                    }
                    console.log(JSON.stringify({ error: error }, replaceErrors));

                    if (error.properties && error.properties.errors instanceof Array) {
                        const errorMessages = error.properties.errors
                            .map(function (error) {
                                return error.properties.explanation;
                            })
                            .join('\n');
                        console.log('errorMessages', errorMessages);
                        // errorMessages is a humanly readable message looking like this :
                        // 'The tag beginning with "foobar" is unopened'
                    }
                    throw error;
                }
                this.file = doc.getZip().generate({
                    type: 'blob',
                    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                });

                console.log('Successful!');
                this.onPreview();
            }
        );
    }

    public onPreview() {
        const docxOptions = Object.assign(docx.defaultOptions, {
            debug: true,
            experimental: true,
            useMathMLPolyfill: true,
            className: 'bravo-docx-preview'
        });
        docx.renderAsync(this.file, this.hostElement.querySelector('.preview'), null, docxOptions);
    }

    public onPrint() {
        // print({
        //     printable: 'preview',
        //     type: 'html',
        //     scanStyles: false,
        //     honorMarginPadding: false,
        //     honorColor: true
        // });

        const iframe = document.createElement('iframe') as any;
        // const file = this.hostElement.querySelector('article').cloneNode(true);

        let _preview = this.hostElement?.querySelector('.preview');
        if (_preview) {
            let _wrapper = document.createElement('div');
            wjc.addClass(_wrapper, 'test');
            _preview.appendChild(_wrapper);

            console.log(_preview.children);

            for (let i = 0; i < _preview.children.length - 1; i++) {
                _wrapper.appendChild(_preview.children[i]);
            }
        }

        this.getCollection('test').forEach((e) => {
            const file = e.cloneNode(true);
            wjc.setCss(file, {
                maxWidth: '100%'
            });
            wjc.setCss(iframe, {
                width: 0,
                height: 0,
                visibility: 'hidden'
            });
            wjc.setAttribute(iframe, 'srcdoc', '<html><body></body></html>');
            this.hostElement.appendChild(iframe);
            iframe.addEventListener('load', () => {
                const body = iframe.contentDocument.body;
                wjc.setCss(body, {
                    display: 'flex',
                    'flex-direction': 'column',
                    height: '100%',
                    'justify-content': 'center',
                    'align-items': 'center'
                });
                body.appendChild(file);
                iframe.contentWindow.print();
                iframe.contentWindow.addEventListener('afterprint', () => {
                    iframe.parentNode.removeChild(iframe);
                });
            });
        });
    }

    public onDownload() {
        saveAs(this.file, 'bravo.docx');
    }

    private getCollection(...className: Array<string>) {
        const _elements = new Array<HTMLElement>();
        for (const zClassName of className) {
            _elements.push(
                ...Array.from(this.hostElement?.getElementsByClassName(zClassName) as HTMLCollectionOf<HTMLElement>)
            );
        }
        return _elements;
    }
}
