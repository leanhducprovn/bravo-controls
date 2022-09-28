import { AfterViewInit, Component, ElementRef } from '@angular/core';
import * as wjc from '@grapecity/wijmo';
@Component({
	selector: 'app-root',
	templateUrl: './app.html',
	styleUrls: ['./app.scss'],
})

export class App extends wjc.Control implements AfterViewInit {
	constructor(elementRef: ElementRef) {
		super(elementRef.nativeElement);
	}
	ngAfterViewInit(): void {
		wjc.removeChild(document.querySelector('body').lastChild);
	}
}
