import { AfterViewInit, Component, ElementRef } from '@angular/core';
import * as wjc from '@grapecity/wijmo';

import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
    selector: 'app-root',
    templateUrl: './app.html',
    styleUrls: ['./app.scss']
})
export class App extends wjc.Control implements AfterViewInit {
    public viewport!: FormGroup;

    private _defaultWidth!: number;
    private _defaultHeight!: number;

    constructor(elementRef: ElementRef, private fb: FormBuilder) {
        super(elementRef.nativeElement);

        /**
         * remove license wijmo
         */
        setTimeout(() => {
            wjc.removeChild(document.querySelector('body').lastChild);
            wjc.removeChild(document.querySelector('body').lastChild);
        });

        /**
         * viewport
         */
        this.viewport = fb.group({
            width: [],
            height: []
        });
    }

    ngAfterViewInit(): void {
        /**
         * set default viewport
         */
        this._defaultWidth = this.getClientSize().width;
        this._defaultHeight = this.getClientSize().height;
        this.viewport.setValue({
            width: this._defaultWidth,
            height: this._defaultHeight
        });
    }

    private getClientSize() {
        const _component = this.hostElement?.querySelector('.component');
        if (_component) {
            let _width = _component.clientWidth;
            let _height = _component.clientHeight;
            return new wjc.Size(_width, _height);
        }
    }

    private setClientSize(pWidth?: number, pHeight?: number) {
        const _component = this.hostElement?.querySelector('.component');
        if (_component)
            wjc.setCss(_component, {
                width: pWidth,
                height: pHeight
            });
    }

    public onRun() {
        this.setClientSize(this.viewport.value.width, this.viewport.value.height);
    }

    public onRandom() {
        this.viewport.setValue({
            width: Math.floor(Math.random() * this._defaultWidth) + 300,
            height: Math.floor(Math.random() * this._defaultHeight) + 300
        });
        this.onRun();
    }

    public onReset() {
        this.viewport.setValue({
            width: this._defaultWidth,
            height: this._defaultHeight
        });
        this.onRun();
    }

    public onClear() {
        this.viewport.reset();
    }
}
