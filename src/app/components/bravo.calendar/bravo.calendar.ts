import {
	AfterViewInit,
	Component,
	ElementRef,
	forwardRef,
	Input,
	OnDestroy,
	OnInit
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import ResizeObserver from 'resize-observer-polyfill';

import * as wjc from '@grapecity/wijmo';
import * as wjInput from '@grapecity/wijmo.input';
import { isNumber } from 'core';
import * as moment from 'moment';

@Component({
	selector: 'bravo-calendar',
	templateUrl: './bravo.calendar.html',
	styleUrls: ['./bravo.calendar.css', './bravo.calendar.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			multi: true,
			useExisting: forwardRef(() => BravoCalendar)
		}
	]
})
export class BravoCalendar extends wjc.Control implements OnInit, AfterViewInit, OnDestroy {
	private _resizeObserver: ResizeObserver;

	private _nRows: number = 0;
	public set nRows(pValue: number) {
		if (this._nRows == pValue) return;

		this._nRows = pValue;
		this.nMonths = this._nRows * this.nColumns;
	}
	public get nRows(): number {
		return this._nRows;
	}

	private _nColumns: number = 0;
	public set nColumns(pValue: number) {
		if (this._nColumns == pValue) return;

		this._nColumns = pValue;
		this.nMonths = this._nColumns * this.nRows;
	}
	public get nColumns(): number {
		return this._nColumns;
	}

	private _nMonths: number = this.nRows * this.nColumns;
	public set nMonths(pValue: number) {
		if (this._nMonths == pValue) return;

		this._nMonths = pValue;
		this._createCalendarControl();
	}
	public get nMonths(): number {
		return this._nMonths;
	}

	private _containerSize!: wjc.Size;
	public set containerSize(pValue: wjc.Size) {
		if (this._containerSize == pValue) {
			return;
		}

		this._containerSize = pValue;

		this.nRows =
			Math.floor(this._containerSize.width / 180) > 1
				? Math.floor(this._containerSize.width / 180)
				: 1;
		this.nColumns =
			Math.floor(this._containerSize.height / 180) > 1
				? Math.floor(this._containerSize.height / 180)
				: 1;
	}
	public get containerSize(): wjc.Size {
		return this._containerSize;
	}

	private _cals: wjInput.Calendar[] = [];
	private _calendars: wjInput.Calendar[] = [];
	public set calendars(pValue: wjInput.Calendar[]) {
		this._calendars = pValue;
		this.invalidate();
	}
	public get calendars(): wjInput.Calendar[] {
		return this._calendars;
	}

	private _startTime: Date = new Date();
	@Input()
	public set startTime(pValue: Date) {
		if (this._startTime == pValue) return;

		this._startTime = pValue;
	}
	public get startTime(): Date {
		return this._startTime;
	}

	private _culture: number = CultureEnum.VI;
	@Input()
	public set culture(pValue: number) {
		if (this._culture == pValue) return;

		this._culture = pValue;
		this._createCalendarControl();
	}
	public get culture(): number {
		return this._culture;
	}

	private _firstDayOfWeek: DayOfWeek = DayOfWeek.Sunday;
	@Input()
	public set firstDayOfWeek(pValue: DayOfWeek) {
		if (this._firstDayOfWeek == pValue) return;

		this._firstDayOfWeek = pValue;
		this.invalidate();
	}
	public get firstDayOfWeek(): DayOfWeek {
		return this._firstDayOfWeek;
	}

	private _weekendDays: WorkingDayEnum[] = [WorkingDayEnum.Sunday];
	@Input()
	public set weekendDays(pValue: WorkingDayEnum[]) {
		if (this._weekendDays == pValue) return;

		this._weekendDays = pValue;
		if (!this._weekendDays.includes(WorkingDayEnum.Sunday))
			this._weekendDays.push(WorkingDayEnum.Sunday);
		this.invalidate();
	}
	public get weekendDays(): WorkingDayEnum[] {
		return this._weekendDays;
	}

	private _workingDays: WorkingDayEnum[] = [
		WorkingDayEnum.Monday,
		WorkingDayEnum.Tuesday,
		WorkingDayEnum.Wednesday,
		WorkingDayEnum.Thursday,
		WorkingDayEnum.Friday,
		WorkingDayEnum.Saturday
	];
	@Input()
	public set workingDays(pValue: WorkingDayEnum[]) {
		if (this._workingDays == pValue) return;

		this._workingDays = pValue;
		this.invalidate();
	}
	public get workingDays(): WorkingDayEnum[] {
		return this._workingDays;
	}

	private _selectionType: SelectionType = SelectionType.Day;
	@Input()
	public set selectionType(pValue: SelectionType) {
		if (this._selectionType == pValue) return;

		this._selectionType = pValue;
		if (this._selectionType == SelectionType.Day)
			this.selectionMode = wjInput.DateSelectionMode.Day;
		else if (this._selectionType == SelectionType.Week || SelectionType.Month)
			this.selectionMode = wjInput.DateSelectionMode.Range;
		else this.selectionMode = wjInput.DateSelectionMode.None;
	}
	public get selectionType(): SelectionType {
		return this._selectionType;
	}

	private _selectionMode: wjInput.DateSelectionMode = wjInput.DateSelectionMode.Day;
	@Input()
	public set selectionMode(pValue: wjInput.DateSelectionMode) {
		if (this._selectionMode == pValue) return;

		this._selectionMode = pValue;
		this.invalidate();
	}
	public get selectionMode(): wjInput.DateSelectionMode {
		return this._selectionMode;
	}

	private _rangeTime: RangeTime = new RangeTime();
	public set rangeTime(pValue: RangeTime) {
		if (this._rangeTime == pValue) return;

		this._rangeTime = pValue;
		console.log(this._rangeTime);
	}
	public get rangeTime(): RangeTime {
		return this._rangeTime;
	}

	constructor(private elRef: ElementRef) {
		super(elRef.nativeElement);
	}

	onChange = (changed: any) => {};

	onTouch = () => {};

	writeValue(obj: any): void {
		if (wjc.isDate(obj)) this.startTime = obj;
	}

	registerOnChange(changed: any): void {
		this.onChange = changed;
	}

	registerOnTouched(touched: any): void {
		this.onTouch = touched;
	}

	refresh(fullUpdate?: boolean): void {
		super.refresh(fullUpdate);
		this._refreshCalendars();
	}

	ngOnInit(): void {
		this._resize();
		this._customLocale();
	}

	ngAfterViewInit(): void {}

	ngOnDestroy(): void {
		this._resizeObserver.disconnect();
	}

	private _refreshCalendars() {
		this.calendars.forEach((calendar) => {
			let _bIsUpdate = calendar.isUpdating;
			if (!_bIsUpdate) calendar.beginUpdate();
			try {
				calendar.firstDayOfWeek = this.firstDayOfWeek;
				calendar.selectionMode = this.selectionMode;
				calendar.formatItem.addHandler((e, s) => {
					let _weekday = s.data.getDay();

					/**
					 * working days
					 */
					Object.values(WorkingDayEnum)
						.filter((value: WorkingDayEnum) => isNumber(value))
						.forEach((value: WorkingDayEnum) => {
							if (!this.workingDays.includes(value) && _weekday == value) {
								wjc.setCss(s.item, {
									color: '#cccccc'
								});
							}
						});

					/**
					 * weekend days
					 */
					this.weekendDays.forEach((value) => {
						if (_weekday == value)
							wjc.setCss(s.item, {
								color: 'red'
							});
					});
				});
			} finally {
				calendar.endUpdate();
			}
		});
	}

	private _resize() {
		let _container = this.hostElement?.querySelector('.bravo-calendar-container');
		this._resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				const { width, height } = entry.contentRect;
				this.containerSize = new wjc.Size(width, height);
			}
		});

		if (_container) this._resizeObserver.observe(_container);
	}

	private _createCalendarControl(startTime: Date = this.startTime) {
		let _month: Array<HTMLElement> = this._getCollection('bravo-calendar-month');
		if (_month)
			_month.forEach((e: HTMLElement) => {
				e.remove();
			});

		this._cals.clear();

		let _calendar: HTMLElement = this.hostElement?.querySelector('.bravo-calendar-content');
		for (let i = 0; i < this.nMonths; i++) {
			let _month = this._createMonthControl(
				wjc.DateTime.addMonths(startTime, i),
				i,
				this.culture
			);
			wjc.setAttribute(_month, 'index', i);
			_calendar.appendChild(_month);
		}
	}

	/**
	 * @param date start day
	 * @param index calendar numbering
	 * @param culture language for calendar
	 * @returns calendar
	 */
	private _createMonthControl(date?: Date, index?: number, culture?: number) {
		/**
		 * create calendar element
		 */
		let _element = wjc.format('<div class="bravo-calendar-month"></div>', {});
		let _month = wjc.createElement(_element);

		/**
		 * create calendar
		 */
		let _calendar = new wjInput.Calendar(_month, {
			showHeader: false,
			showYearPicker: false,
			showMonthPicker: false,
			selectionMode: this.selectionMode,
			firstDayOfWeek: this.firstDayOfWeek,
			handleWheel: false,
			displayMonth: date
		});
		_calendar.refresh();

		/**
		 * create calendar array
		 */
		this._cals.push(_calendar);
		this.calendars = this._cals;

		/**
		 * value changed
		 */
		_calendar.valueChanged.addHandler((e, s) => {
			if (e.value == null && e.rangeEnd == null) return;

			this.rangeTime = new RangeTime(e.value, e.rangeEnd);
		});

		/**
		 * range changed
		 */
		_calendar.rangeChanged.addHandler((e, s) => {
			if (e.value == null && e.rangeEnd == null) return;

			this.rangeTime = new RangeTime(e.value, e.rangeEnd);
		});

		/**
		 * lost focus
		 */
		_calendar.lostFocus.addHandler((e: wjInput.Calendar, s) => {
			e.value = null;
			e.displayMonth = date;
		});

		/**
		 * set style calendar
		 */
		wjc.setCss(_month, {
			width: '180px',
			height: '180px',
			minWidth: '180px',
			minHeight: '180px',
			background: 'transparent',
			color: '#ffffff',
			overflow: 'hidden'
		});

		/**
		 * custom header
		 */
		let _header = wjc.createElement('<div class="bravo-month-header">', null, {
			display: 'flex',
			justifyContent: 'space-between',
			marginBottom: '3px'
		});
		let _oldHeader = _calendar.hostElement.querySelector('.wj-calendar-header') as HTMLElement;
		_oldHeader.parentElement.insertBefore(_header, _oldHeader);

		if (culture == CultureEnum.UK) moment.locale('en');
		else if (culture == CultureEnum.JA) moment.locale('ja');
		else if (culture == CultureEnum.ZH) moment.locale('zh-cn');
		else if (culture == CultureEnum.KO) moment.locale('ko');
		else moment.locale('vi');

		/**
		 * create month title
		 */
		let _monthTitle = wjc.format(
			'<div class="bravo-month-title">{title}</div>',
			{
				title: date
			},
			(data) => {
				let title = moment(data.title).format('MMMM YYYY');
				return title;
			}
		);

		wjc.createElement(_monthTitle, _header, {
			color: 'inherit',
			marginLeft: '3px',
			fontWeight: 600,
			fontSize: '90%'
		});

		/**
		 * create month tools
		 */
		if (index == 0) {
			let _monthTools = wjc.createElement('<div class="bravo-month-tools">', _header, {
				display: 'flex',
				color: 'inherit'
			});
			let _buttonStyle = {
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'flex-end',
				width: '20px',
				height: '100%',
				border: 'none',
				color: 'inherit',
				background: 'unset',
				cursor: 'pointer'
			};
			let _previousMonth = wjc.createElement(
				`<button class="previous">
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" width="8" height="8" x="0" y="0" viewBox="0 0 256 256" xml:space="preserve">
                    <g transform="matrix(-1,0,0,1,256.00000762939453,0)"><g><g>
                        <polygon points="79.093,0 48.907,30.187 146.72,128 48.907,225.813 79.093,256 207.093,128" fill="#CAD8E7"></polygon>
                    </g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></g>
                </svg>
            </button>`,
				_monthTools,
				_buttonStyle
			);
			let _nextMonth = wjc.createElement(
				`<button class="next">
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" width="8" height="8" x="0" y="0" viewBox="0 0 256 256" xml:space="preserve">
                    <g><g><g>
                        <polygon points="79.093,0 48.907,30.187 146.72,128 48.907,225.813 79.093,256 207.093,128 " fill="#CAD8E7"></polygon>
                    </g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></g>
                </svg>
            </button>`,
				_monthTools,
				_buttonStyle
			);

			/**
			 * hover style
			 */
			this._setHoverMonthTools(_previousMonth, _nextMonth);

			/**
			 * click event
			 */
			this._setClickMonthTools(_previousMonth, -1);
			this._setClickMonthTools(_nextMonth, +1);
		}

		_calendar.formatItem.addHandler((e, s) => {
			/**
			 * set week days
			 */
			let cells = _calendar.hostElement.querySelectorAll('table tr.wj-header td');
			for (let i = 0; i < 7; i++) {
				cells[i].textContent = moment
					.weekdaysShort()
					.slice(this.firstDayOfWeek)
					.concat(moment.weekdaysShort().slice(0, this.firstDayOfWeek))[i];
			}

			if (index == this.nMonths - 1) {
				/**
				 * set style other month
				 */
				let _otherMonth = Array.from(
					_calendar.hostElement.getElementsByClassName('wj-day-othermonth')
				);
				_otherMonth.forEach((e) => {
					wjc.setCss(e, {
						visibility: 'unset'
					});
				});

				/**
				 * set weeksAfter
				 */
				_calendar.weeksAfter = 1;
			}
		});

		return _month;
	}

	/**
	 * @param culture abbreviated name of the culture
	 */
	// private _loadCulture(culture: number = this.culture) {
	// 	/**
	// 	 * apply new culture to page
	// 	 */
	// 	let url = `library/@grapecity/wijmo.cultures/wijmo.culture.${culture}.js`,
	// 		scripts = document.getElementsByTagName('script');

	// 	for (let i = 0; i < scripts.length; i++) {
	// 		let script = scripts[i];
	// 		if (script.src.indexOf('/library/@grapecity/wijmo.cultures/wijmo.culture.') > -1) {
	// 			script.parentElement.removeChild(script);
	// 			break;
	// 		}
	// 	}

	// 	let script = document.createElement('script');
	// 	script.onload = () => {
	// 		this._createCalendarControl();
	// 	};
	// 	script.src = url;

	// 	document.head.appendChild(script);
	// }

	/**
	 * @param element pass in one or more elements
	 */
	private _setHoverMonthTools(...element: Array<any>) {
		for (const _element of element) {
			let _polygon = _element.querySelector('polygon');

			/**
			 * mouseover
			 */
			_element.addEventListener('mouseover', () => {
				wjc.setCss(_polygon, {
					fill: '#227DD4'
				});
			});

			/**
			 * mouseout
			 */
			_element.addEventListener('mouseout', () => {
				wjc.setCss(_polygon, {
					fill: '#CAD8E7'
				});
			});
		}
	}

	/**
	 * @param button month tools
	 * @param next previous/next month
	 */
	private _setClickMonthTools(button?: any, next?: number) {
		button.addEventListener('click', () => {
			this.startTime.setMonth(this.startTime.getMonth() + next);
			this._createCalendarControl(this.startTime);
		});
	}

	/**
	 * @param className pass in one or more class names
	 * @returns returns an array of elements
	 */
	private _getCollection(...className: Array<string>) {
		const _elements = new Array<HTMLElement>();
		for (const zClassName of className) {
			_elements.push(
				...Array.from(
					this.hostElement?.getElementsByClassName(
						zClassName
					) as HTMLCollectionOf<HTMLElement>
				)
			);
		}
		return _elements;
	}

	private _customLocale() {
		moment.updateLocale('vi', {
			months: [
				'Tha??ng Gi??ng',
				'Tha??ng Hai',
				'Tha??ng Ba',
				'Tha??ng T??',
				'Tha??ng N??m',
				'Tha??ng Sa??u',
				'Tha??ng Ba??y',
				'Tha??ng Ta??m',
				'Tha??ng Chi??n',
				'Tha??ng M??????i',
				'Tha??ng M??????i M????t',
				'Tha??ng M??????i Hai'
			],
			weekdaysShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
		});

		moment.updateLocale('en', {
			weekdaysShort: ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA']
		});
	}

	/**
	 * Event
	 */

	/**
	 * onToday
	 */
	public onToday() {}

	/**
	 * onBefore
	 */
	public onBefore() {
		console.log('before');
	}

	/**
	 * onAfter
	 */
	public onAfter() {
		console.log('after');
	}
}

export class RangeTime {
	public start: Date;
	public end: Date;

	constructor(pStart: Date = new Date(), pEnd: Date = new Date()) {
		this.start = pStart;
		this.end = pEnd;
	}
}

export enum DayOfWeek {
	Sunday = 0,
	Monday = 1,
	Tuesday = 2,
	Wednesday = 3,
	Thursday = 4,
	Friday = 5,
	Saturday = 6
}

export enum WorkingDayEnum {
	Sunday = 0,
	Monday = 1,
	Tuesday = 2,
	Wednesday = 3,
	Thursday = 4,
	Friday = 5,
	Saturday = 6
}

export enum SelectionType {
	Day = 0,
	Week = 1,
	Month = 2
}

export enum CultureEnum {
	VI = 0,
	UK = 1,
	JA = 2,
	ZH = 3,
	KO = 4
}
