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
        this.invalidate();
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

        this.nRows = Math.floor(this._containerSize.width / 200);
        this.nColumns = Math.floor(this._containerSize.height / 200);
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

    refresh(fullUpdate?: boolean): void {
        console.log(this.nMonths);
        this._createCalendarControl();
    }

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
                this._stt = 1;
            });

        let _calendar: HTMLElement = this.hostElement?.querySelector('.bravo-calendar-content');
        for (let i = 0; i < this.nMonths; i++) {
            let month = this._createMonthControl();
            _calendar.appendChild(month);
        }
    }

    private _stt: number = 1;
    private _createMonthControl() {
        let _fmt = wjc.format('<div class="bravo-calendar-month">{stt}</div>', {
            stt: this._stt++
        });

        let _month = wjc.createElement(_fmt);
        wjc.setCss(_month, {
            width: '200px',
            height: '200px',
            background: '#' + Math.floor(Math.random() * 16777215).toString(16),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '30px',
            color: '#eeeeee'
        });

        return _month;
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
