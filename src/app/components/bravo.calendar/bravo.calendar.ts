import { AfterViewInit, Component, ElementRef, forwardRef, OnDestroy, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

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

    ngOnInit(): void {
        // create the calendar
        let calendar = this.hostElement.querySelector('.calendar');
        for (let i = 0, start = new Date(); i < 12; i++) {
            let month = this._createMonthControl(wjc.DateTime.addMonths(start, -i));
            calendar.appendChild(month);
        }
    }

    ngAfterViewInit(): void {}

    ngOnDestroy(): void {}

    private _createMonthControl(date: Date) {
        // create the calendar
        let month = wjc.createElement('<div class="month"></div>'),
            cal = new wjInput.Calendar(month, {
                showHeader: false,
                value: date
            });
        cal.refresh();

        // disable changing months with the mouse wheel
        cal.removeEventListener(cal.hostElement, 'wheel');

        // add a custom header element
        let fmt = wjc.format(
            '<div class="month-header">' +
                '<div class="month-title">{header}</div>' +
                '<div class="month-status">{uptime}% uptime</div>' +
                '</div>',
            {
                header: wjc.Globalize.format(date, 'MMMM yyyy'),
                uptime: this._getUptime()
            }
        );
        let newHeader = wjc.createElement(fmt);
        let hdr = cal.hostElement.querySelector('.wj-calendar-header');
        hdr.parentElement.insertBefore(newHeader, hdr);

        // show only first letter of week day
        let cells = cal.hostElement.querySelectorAll('table tr.wj-header td');
        for (let i = 0; i < 7; i++) {
            cells[i].textContent = cells[i].textContent.substr(0, 1);
        }
        //
        return month;
    }

    private _getUptime() {
        let tm = [100, 99.75, 99.998, 99.98, 99.996, 99.93];
        return tm[Math.floor(Math.random() * tm.length)];
    }
}
