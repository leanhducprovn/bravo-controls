import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import Docxtemplater from 'docxtemplater';
import * as PizZip from 'pizzip';
import PizZipUtils from 'pizzip/utils/index.js';
import { DomSanitizer } from '@angular/platform-browser';

import * as wjc from '@grapecity/wijmo';
import WebViewer, { WebViewerInstance } from '@pdftron/webviewer';

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
        WebViewer(
            {
                path: '../../../library/webviewer'
            },
            this.hostElement.querySelector('.preview')
        ).then((instance: WebViewerInstance) => {
            instance.UI.loadDocument(this.file, { filename: 'bravo.docx' });
            instance.UI.setTheme('light');
            instance.UI.setLanguage('vi');
            instance.UI.disableElements(['header', 'toolsHeader']);
            instance.UI.setZoomLevel(150);

            /**
             * Download
             */
            this.hostElement.querySelector('.download').addEventListener('click', async () => {
                await instance.UI.downloadPdf();
            });

            /**
             * Print
             */
            this.hostElement.querySelector('.print').addEventListener('click', async () => {
                await instance.UI.setPrintQuality(10);
                await instance.UI.setDefaultPrintOptions;
                await instance.UI.print();
            });
        });
    }
}
