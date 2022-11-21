import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'bravo-calendar-demo',
    templateUrl: './bravo.calendar.demo.html',
    styleUrls: ['./bravo.calendar.demo.scss']
})
export class BravoCalendarDemo implements OnInit {
    private _data: FormGroup;
    public set data(pValue: FormGroup) {
        if (this._data == pValue) return;

        this._data = pValue;
    }
    public get data(): FormGroup {
        return this._data;
    }

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        this._data = this.fb.group({
            date: [[new Date()]]
        });
    }
}
