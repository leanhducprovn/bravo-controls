import { Component, OnInit } from '@angular/core';
import Docxtemplater from 'docxtemplater';
import * as PizZip from 'pizzip';
import PizZipUtils from 'pizzip/utils/index.js';
import { saveAs } from 'file-saver';

@Component({
    selector: 'bravo-docxtemplater',
    templateUrl: './bravo.docxtemplater.html',
    styleUrls: ['./bravo.docxtemplater.scss']
})
export class BravoDocxtemplater implements OnInit {
    constructor() {}

    ngOnInit(): void {}

    loadFile(url, callback) {
        PizZipUtils.getBinaryContent(url, callback);
    }

    generate() {
        this.loadFile(
            './assets/data/bravo-docxtemplater/docxtemplater.docx',
            function (error: Error | null, content: string) {
                if (error) {
                    throw error;
                }
                const zip = new PizZip(content);
                const doc = new Docxtemplater(zip, {
                    paragraphLoop: true,
                    linebreaks: true
                });
                doc.setData({
                    room: 'Phòng Công Nghệ',
                    full_name: 'Lê Anh Đức',
                    position: 'Nhân viên',
                    day: 26,
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
                const out = doc.getZip().generate({
                    type: 'blob',
                    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                });

                console.log(out);
                // var file = new Blob([out], { type: 'application/pdf' });
                // var fileURL = URL.createObjectURL(file);
                // window.open(fileURL);

                // Output the document using Data-URI
                saveAs(out, 'output.docx');
            }
        );
    }
}