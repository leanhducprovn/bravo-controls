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

    private _containerDefault!: wjc.Size;
    public set containerDefault(pValue: wjc.Size) {
        if (this._containerDefault == pValue) return;

        this._containerDefault = pValue;
    }
    public get containerDefault(): wjc.Size {
        return this._containerDefault;
    }

    private _containerSize!: wjc.Size;
    public set containerSize(pValue: wjc.Size) {
        if (this._containerSize == pValue) {
            return;
        }

        this._containerSize = pValue;
        this.invalidate();
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
        console.log(this.containerSize);
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
        let _calendar: HTMLElement = this.hostElement?.querySelector('.bravo-calendar-content');
        console.log(Math.floor(this.containerSize.width / 200) * Math.floor(this.containerSize.height / 200));

        let _nRows: number = Math.floor(this.containerSize.width / 200);
        let _nColumns: number = Math.floor(this.containerSize.height / 200);

        if (true) {
        }

        for (let i = 0; i < _nRows * _nColumns; i++) {
            let month = this._createMonthControl();
            _calendar.appendChild(month);
        }
    }

    private _createMonthControl() {
        let _month = wjc.createElement('<div class="bravo-calendar-month"></div>');
        wjc.setCss(_month, {
            width: 200,
            height: 200,
            background: '#' + Math.floor(Math.random() * 16777215).toString(16)
        });

        return _month;
    }
}
