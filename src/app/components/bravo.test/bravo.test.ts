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

    ngOnInit(): void {}
}
