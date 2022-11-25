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

	private _culture: string = localStorage.getItem('culture')
		? localStorage.getItem('culture')
		: 'vi';
	public set culture(pValue: string) {
		if (this._culture == pValue) return;

		this._culture = pValue;
		localStorage.setItem('culture', pValue);
	}
	public get culture(): string {
		return this._culture;
	}

	private _firstDayOfWeek: any = Number(localStorage.getItem('firstDayOfWeek'))
		? Number(localStorage.getItem('firstDayOfWeek'))
		: 0;
	public set firstDayOfWeek(pValue: any) {
		if (this._firstDayOfWeek == pValue) return;

		this._firstDayOfWeek = pValue;
		localStorage.setItem('firstDayOfWeek', pValue);
	}
	public get firstDayOfWeek(): any {
		return this._firstDayOfWeek;
	}

	constructor(private fb: FormBuilder) {}

	ngOnInit(): void {
		this._data = this.fb.group({
			date: [new Date()]
		});
	}
}
