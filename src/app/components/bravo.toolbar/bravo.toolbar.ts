import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import * as wjc from '@grapecity/wijmo';
import * as input from '@grapecity/wijmo.input';

import ResizeObserver from 'resize-observer-polyfill';

export interface IToolBar {
    title?: string;
    image?: string;
    value?: any;
    bulkhead?: boolean;
}
@Component({
    selector: 'bravo-toolbar',
    templateUrl: './bravo.toolbar.html',
    styleUrls: ['./bravo.toolbar.css', './bravo.toolbar.scss']
})
export class BravoToolbar extends wjc.Control implements OnInit, OnDestroy {
    private _tools: IToolBar[];

    @Input()
    public set tools(pValue: IToolBar[]) {
        if (this._tools == pValue) return;

        this._tools = pValue;
    }
    public get tools(): IToolBar[] {
        return this._tools;
    }

    private _sizeBox: wjc.Size = new wjc.Size();
    public set sizeBox(pValue: wjc.Size) {
        if (this._sizeBox?.equals(pValue)) return;

        this._sizeBox = pValue;
        this.invalidate();
    }
    public get sizeBox(): wjc.Size {
        return this._sizeBox;
    }

    public listBox!: input.ListBox;
    public listBoxMore!: input.ListBox;
    private _popup!: input.Popup;

    public isMore: boolean = false;

    constructor(elementRef: ElementRef) {
        super(elementRef.nativeElement);
    }

    public refresh(fullUpdate?: boolean | undefined): void {
        super.refresh(fullUpdate);
        this.responsive();
    }

    ngOnInit(): void {
        this.initItem();
        this.initPopup();
        this.onResize();
    }

    ngOnDestroy(): void {
        this._toolbar.disconnect();
    }

    private _toolbar: ResizeObserver;
    private onResize() {
        let _listBox = this.hostElement?.querySelector('.bravo-toolbar');
        this._toolbar = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                this.sizeBox = new wjc.Size(width, height);
            }
        });

        if (_listBox) this._toolbar.observe(_listBox);
    }

    private initItem() {
        let _listBox = this.hostElement?.querySelector('.list-box');
        this.listBox = new input.ListBox(_listBox, {
            formatItem: (sender: any, e: any) => {
                this.onFormatItem(sender, e);
            },
            itemsSource: this.tools
        });

        let _listBoxMore = this.hostElement?.querySelector('.list-box-more');
        this.listBoxMore = new input.ListBox(_listBoxMore, {
            formatItem: (sender: any, e: any) => {
                this.onFormatItem(sender, e);
            },
            itemsSource: []
        });
    }

    private onFormatItem(sender: any, e: any) {
        sender.selectedIndex = -1;
        if (e.data.image) {
            e.item.innerHTML = `<img src="${e.data.image}" title="${e.data.title}" style="width:15px">`;
            if (this.disable) {
                wjc.toggleClass(e.item, 'wj-state-disabled', !this.skipDisable.includes(e.data.value));
            }
        } else if (e.data.text) {
            e.item.innerHTML = e.data.text;
        }
        if (e.data.bulkhead) {
            e.item.innerHTML = '';
            wjc.addClass(e.item, 'bulkhead');
            wjc.removeClass(e.item, 'wj-listbox-item');
        }
    }

    private _skipDisable: any[] = [];
    public set skipDisable(pValue: any[]) {
        if (this._skipDisable == pValue) return;
        this._skipDisable = pValue;
    }
    public get skipDisable(): any[] {
        return this._skipDisable;
    }

    private _disable: boolean = false;
    public set disable(pValue: boolean) {
        this._disable = pValue;
        this.skipDisable.clear();
        this.invalidate();
    }
    public get disable(): boolean {
        return this._disable;
    }

    public skipDisableItem(item?: any) {
        this.skipDisable[this.skipDisable.length] = item;
    }

    public skipDisableItems(items?: any[]) {
        this.skipDisable = this.skipDisable.concat(items);
    }

    private responsive() {
        let _listBox = this.hostElement?.querySelector('.list-box');
        let _more = this.hostElement?.querySelector('.list-more');
        if (_listBox && _more) {
            let _defWidth = this.tools.length * 20;
            let _clientWidth = this.sizeBox.width;
            if (_clientWidth >= _defWidth) {
                wjc.setCss(_more, {
                    display: 'none'
                });
                this.listBox.itemsSource = this.tools;
            } else {
                wjc.setCss(_more, {
                    display: 'block'
                });
                let _countItem = Math.floor(_clientWidth / 20) - 1;
                this.listBox.itemsSource = this.tools.slice(0, _countItem);
                this.listBoxMore.itemsSource = this.tools.slice(_countItem, this.tools.length);
                if (_clientWidth <= 40) {
                    this.listBox.itemsSource = [];
                    this.listBoxMore.itemsSource = this.tools;
                }
            }
        }
    }

    private initPopup() {
        let _morePopup = this.hostElement?.querySelector('.more-popup');
        let _listMore = this.hostElement?.querySelector('.list-more');
        if (_listMore && _morePopup) {
            this._popup = new input.Popup(_morePopup, {
                owner: _listMore,
                position: wjc.PopupPosition.AboveRight,
                showTrigger: input.PopupTrigger.ClickOwner,
                hideTrigger: input.PopupTrigger.Blur | input.PopupTrigger.ClickOwner | input.PopupTrigger.Leave
            });
        }

        this._popup.showing.addHandler((e: input.Popup) => {
            let _item =
                this.listBoxMore.itemsSource.length -
                this.listBoxMore.itemsSource.filter((e: any) => e.bulkhead).length;
            wjc.setCss(this._popup.hostElement, {
                width: `${_item * 20 + 2}px`,
                maxWidth: '142px',
                height: `${Math.ceil((_item * 20) / 140) * 20 + 2}px`
            });
        });

        this._popup.shown.addHandler((e: input.Popup) => {
            this.isMore = e.isVisible;
            Array.from(this._popup.hostElement?.getElementsByClassName('wj-listbox-item')).forEach((e) => {
                wjc.setCss(e, {
                    display: 'flex',
                    'align-items': 'center',
                    'justify-content': 'center',
                    padding: '1.5px',
                    border: '1px solid transparent'
                });
                e.addEventListener('mouseover', () => {
                    wjc.setCss(e, {
                        'background-color': '#E0EEF9',
                        border: '1px solid #568FBA',
                        'border-radius': '2px'
                    });
                });
                e.addEventListener('mouseout', () => {
                    wjc.setCss(e, {
                        'background-color': 'unset',
                        border: '1px solid transparent',
                        'border-radius': 'unset'
                    });
                });
            });
        });

        this._popup.hidden.addHandler((e: input.Popup) => {
            this.isMore = e.isVisible;
        });
    }
}
