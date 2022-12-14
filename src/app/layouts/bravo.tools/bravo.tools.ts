import { AfterViewInit, Component, OnInit, ElementRef } from '@angular/core';
import * as wjc from '@grapecity/wijmo';
import * as wjcInput from '@grapecity/wijmo.input';

import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-bravo-tools',
    templateUrl: './bravo.tools.html',
    styleUrls: ['./bravo.tools.scss']
})
export class BravoTools extends wjc.Control implements AfterViewInit, OnInit {
    public viewport: FormGroup = this.fb.group({
        width: [],
        height: []
    });

    private _defaultSize!: wjc.Size;

    private _background: string = localStorage.getItem('background') ? localStorage.getItem('background') : '#f2f2f2';
    public set background(pValue: string) {
        if (this._background == pValue) return;

        this._background = pValue;
    }
    public get background(): string {
        return this._background;
    }

    private _inputColor!: wjcInput.InputColor;

    constructor(elementRef: ElementRef, private fb: FormBuilder) {
        super(elementRef.nativeElement);

        /**
         * remove license wijmo
         */
        setTimeout(() => {
            wjc.removeChild(document.querySelector('body').lastChild);
            wjc.removeChild(document.querySelector('body').lastChild);
        });
    }

    ngAfterViewInit(): void {
        /**
         * set default viewport
         */
        this._defaultSize = new wjc.Size(this.getClientSize().width, this.getClientSize().height);
        this.viewport.setValue({
            width: localStorage.getItem('clientSize')
                ? JSON.parse(localStorage.getItem('clientSize')).width
                : this._defaultSize.width,
            height: localStorage.getItem('clientSize')
                ? JSON.parse(localStorage.getItem('clientSize')).height
                : this._defaultSize.height
        });
        this.setClientSize(this.viewport.value.width, this.viewport.value.height);

        /**
         * create input color
         */
        this.initBackground();
    }

    ngOnInit(): void {}

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
        localStorage.setItem(
            'clientSize',
            JSON.stringify(new wjc.Size(this.viewport.value.width, this.viewport.value.height))
        );
    }

    public onRandom() {
        this.viewport.setValue({
            width: Math.floor(Math.random() * this._defaultSize.width) + 300,
            height: Math.floor(Math.random() * this._defaultSize.height) + 300
        });
        this.onRun();
    }

    public onReset() {
        this.viewport.setValue({
            width: this._defaultSize.width,
            height: this._defaultSize.height
        });
        this.onRun();
    }

    public onClear() {
        this.viewport.reset();
    }

    private initBackground() {
        const _background = this.hostElement?.querySelector('.background');
        if (_background)
            this._inputColor = new wjcInput.InputColor(_background, {
                isAnimated: true
            });

        /**
         * default value
         */
        this._inputColor.value = this.background;

        /**
         * color changed
         */
        this._inputColor.valueChanged.addHandler((e: wjcInput.InputColor, s: any) => {
            this.background = e.value;
            localStorage.setItem('background', this.background);
        });
    }

    public onRandomBackground() {
        this.background = '#' + Math.floor(Math.random() * 16777215).toString(16);
        this._inputColor.value = this.background;
        localStorage.setItem('background', this.background);
    }

    public onResetBackground() {
        this.background = '#f2f2f2';
        this._inputColor.value = this.background;
        localStorage.setItem('background', this.background);
    }
}
