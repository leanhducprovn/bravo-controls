import { AfterViewInit, Component, ElementRef, forwardRef, OnDestroy, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import ResizeObserver from 'resize-observer-polyfill';

import * as wjc from '@grapecity/wijmo';
import * as wjInput from '@grapecity/wijmo.input';

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

        this.nRows = Math.floor(this._containerSize.width / 180);
        this.nColumns = Math.floor(this._containerSize.height / 180);
    }
    public get containerSize(): wjc.Size {
        return this._containerSize;
    }

    constructor(private elRef: ElementRef) {
        super(elRef.nativeElement);
    }

    onChange = (changed: any) => {};

    onTouch = () => {};

    writeValue(obj: any): void {
        console.log(obj);
    }

    registerOnChange(changed: any): void {
        this.onChange = changed;
    }

    registerOnTouched(touched: any): void {
        this.onTouch = touched;
    }

    refresh(fullUpdate?: boolean): void {}

    ngOnInit(): void {
        this._resize();
    }

    ngAfterViewInit(): void {}

    ngOnDestroy(): void {
        this._resizeObserver.disconnect();
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

    private _createCalendarControl() {
        let _month: Array<HTMLElement> = this.getCollection('bravo-calendar-month');
        if (_month)
            _month.forEach((e: HTMLElement) => {
                e.remove();
            });

        let _calendar: HTMLElement = this.hostElement?.querySelector('.bravo-calendar-content');
        for (let i = 0; i < this.nMonths; i++) {
            let _month = this._createMonthControl(wjc.DateTime.addMonths(new Date(), i), i);
            wjc.setAttribute(_month, 'index', i);
            _calendar.appendChild(_month);
        }
    }

    private _createMonthControl(date?: Date, index?: number) {
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
            selectionMode: wjInput.DateSelectionMode.Range,
            value: date
        });
        _calendar.refresh();

        /**
         * set style calendar
         */
        wjc.setCss(_month, {
            width: '180px',
            height: '180px',
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
            marginBottom: '5px'
        });
        let _oldHeader = _calendar.hostElement.querySelector('.wj-calendar-header') as HTMLElement;
        _oldHeader.parentElement.insertBefore(_header, _oldHeader);

        /**
         * create month title
         */
        let _monthTitle = wjc.format('<div class="bravo-month-title">{title}</div>', {
            title: wjc.Globalize.format(date, 'MMMM yyyy')
        });
        wjc.createElement(_monthTitle, _header, {
            color: 'inherit'
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
                        <polygon points="79.093,0 48.907,30.187 146.72,128 48.907,225.813 79.093,256 207.093,128" fill="#ffffff"></polygon>
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
                        <polygon points="79.093,0 48.907,30.187 146.72,128 48.907,225.813 79.093,256 207.093,128 " fill="#ffffff"></polygon>
                    </g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></g>
                </svg>
            </button>`,
                _monthTools,
                _buttonStyle
            );

            this.setHoverMonthTools(_previousMonth, _nextMonth);
        }

        /**
         * set style weekday
         */
        _calendar.formatItem.addHandler((e, s) => {
            let _weekday = s.data.getDay();

            if (_weekday == 0)
                wjc.setCss(s.item, {
                    color: 'red'
                });
        });

        // let cells = _calendar.hostElement.querySelectorAll('table tr.wj-header td');
        // for (let i = 0; i < 7; i++) {
        //     cells[i].textContent = cells[i].textContent.substr(0, 1);
        // }

        return _month;
    }

    private setHoverMonthTools(...element: Array<any>) {
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
                    fill: '#ffffff'
                });
            });
        }
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
