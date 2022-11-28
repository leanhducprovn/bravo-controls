import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import * as wjInput from '@grapecity/wijmo.input';

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

	private _selectionType: any = Number(localStorage.getItem('selectionType'))
		? Number(localStorage.getItem('selectionType'))
		: 0;
	public set selectionType(pValue: any) {
		if (this._selectionType == pValue) return;

		this._selectionType = pValue;
		localStorage.setItem('selectionType', pValue);
	}
	public get selectionType(): any {
		return this._selectionType;
	}

	private _weekendDays: number[] = [0];
	public set weekendDays(pValue: number[]) {
		if (this._weekendDays == pValue) return;

		this._weekendDays = pValue;
	}
	public get weekendDays(): number[] {
		return this._weekendDays;
	}

	@ViewChild('multiSelect', { static: true }) _multiSelect: wjInput.MultiSelect;

	constructor(private fb: FormBuilder) {}

	ngOnInit(): void {
		this._data = this.fb.group({
			date: [new Date()]
		});

		this._multiSelect.itemsSource = [
			{ id: 0, day: 'Sunday' },
			{ id: 1, day: 'Monday' },
			{ id: 2, day: 'Tuesday' },
			{ id: 3, day: 'Wednesday' },
			{ id: 4, day: 'Thursday' },
			{ id: 5, day: 'Friday' },
			{ id: 6, day: 'Saturday' }
		];
		this._multiSelect.placeholder = 'Weekend days';
		this._multiSelect.displayMemberPath = 'day';
		this._multiSelect.showSelectAllCheckbox = true;
		this._multiSelect.showFilterInput = true;

		this._multiSelect.checkedItemsChanged.addHandler(() => {
			this.weekendDays = this._multiSelect.checkedItems.map((s) => s.id);
		});
	}
}
