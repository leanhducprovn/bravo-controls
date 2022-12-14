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
    selector: 'bravo-docx-preview',
    templateUrl: './bravo.docx.preview.html',
    styleUrls: ['./bravo.docx.preview.scss']
})
export class BravoDocxPreview extends wjc.Control implements OnInit {
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
        /**
         * Sử dụng thư viện
         */
        // print({
        //     printable: 'preview',
        //     type: 'html',
        //     scanStyles: false,
        //     honorMarginPadding: false,
        //     honorColor: true
        // });

        /**
         * Sử dụng thư viện wijmo
         */
        // let doc = new wjc.PrintDocument({
        //     title: 'PrintDocument Test'
        // });

        // doc.append(this.hostElement.querySelector('.preview') as HTMLElement);
        // doc.print();

        /**
         * Không sử dụng thư viện
         */
        const _wrapper = this.getCollection('bravo-docx-preview-wrapper');
        _wrapper.forEach((e) => {
            wjc.setCss(e, {
                background: 'unset'
            });
        });

        const _section = this.getCollection('bravo-docx-preview');
        _section.forEach((e) => {
            wjc.setCss(e, {
                boxShadow: 'unset',
                width: 'calc(794px + 79.4px)',
                height: 'calc(1123px + 25px)'
                // background: 'gray'
            });
        });

        const _iframe = document.createElement('iframe') as any;
        wjc.setCss(_iframe, {
            margin: 0,
            padding: 0,
            width: 0,
            height: 0,
            border: 0,
            visibility: 'hidden'
        });
        const _preview = this.hostElement.querySelector('.preview').cloneNode(true);
        wjc.setCss(_preview, {
            maxWidth: '100%',
            maxHeight: '100%'
        });

        wjc.setAttribute(_iframe, 'srcdoc', '<html><body></body></html>');
        this.hostElement.appendChild(_iframe);
        _iframe.addEventListener('load', () => {
            const body = _iframe.contentDocument.body;
            wjc.setCss(body, {
                margin: '0px',
                padding: '0px',
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                top: '-30px'
            });
            body.appendChild(_preview);
            _iframe.contentWindow.print();
            _iframe.contentWindow.addEventListener('afterprint', () => {
                _iframe.parentNode.removeChild(_iframe);
                _wrapper.forEach((e) => {
                    wjc.setCss(e, {
                        background: 'gray'
                    });
                });
                _section.forEach((e) => {
                    wjc.setCss(e, {
                        boxShadow: '0 0 10px rgb(0 0 0 / 50%)',
                        width: '612pt',
                        height: 'unset'
                    });
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
