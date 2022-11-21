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

    ngOnInit(): void {}

    ngAfterViewInit(): void {}

    ngOnDestroy(): void {}
}
