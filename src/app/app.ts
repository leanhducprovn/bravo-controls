import { Component, ElementRef } from '@angular/core';
import * as wjc from '@grapecity/wijmo';
@Component({
    selector: 'app-root',
    templateUrl: './app.html',
    styleUrls: ['./app.scss']
})
export class App extends wjc.Control {
    constructor(elementRef: ElementRef) {
        super(elementRef.nativeElement);

        /**
         * remove license wijmo
         */
        setTimeout(() => {
            wjc.removeChild(document.querySelector('body').lastChild);
            wjc.removeChild(document.querySelector('body').lastChild);
        });
    }
}
