import {
    AfterViewInit,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    QueryList,
    ViewChild,
    ViewChildren
} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription } from 'rxjs';

import * as wjc from '@grapecity/wijmo';
import * as wjNav from '@grapecity/wijmo.nav';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcInput from '@grapecity/wijmo.input';

import { WebDataSet } from '../../core/lib/data/bravo.web.dataset';
import {
    WebDataTable,
    WebTableCollection
} from '../../core/lib/data/bravo.web.datatable';

@Component({
    selector: 'bravo-tab-grid-layout',
    templateUrl: './bravo.tab.grid.layout.html',
    styleUrls: ['./bravo.tab.grid.layout.css', './bravo.tab.grid.layout.scss']
})
export class BravoTabGridLayout
    extends wjc.Control
    implements OnInit, OnDestroy, AfterViewInit
{
    @ViewChild('tab') _tab!: wjNav.TabPanel;
    @ViewChildren('grid') _grid!: QueryList<wjcGrid.FlexGrid>;
    @ViewChildren('box') _box!: QueryList<wjcInput.ComboBox>;
    @ViewChildren('gridInfo') _info!: QueryList<wjcGrid.FlexGrid>;

    private _tabsInfo: any[] = [];
    public set tabsInfo(pValue: any[]) {
        if (this._tabsInfo == pValue) return;

        this._tabsInfo = pValue;
        this.invalidate();
    }
    public get tabsInfo(): any[] {
        return this._tabsInfo;
    }

    constructor(private http: HttpClient, elementRef: ElementRef) {
        super(elementRef.nativeElement);
    }

    public refresh(fullUpdate?: boolean | undefined): void {
        super.refresh(fullUpdate);
    }

    public ngOnInit(): void {
        this.loadXML();
    }

    public ngAfterViewInit(): void {}

    public ngOnDestroy(): void {
        this._xmlSubscription.unsubscribe();
    }

    private _xmlSubscription!: Subscription;
    private loadXML() {
        const _api = './assets/data/cash-receipts.xml';
        let _data: any;
        this._xmlSubscription = this.http
            .get(_api, {
                headers: new HttpHeaders()
                    .set('Content-Type', 'text/xml')
                    .append('Access-Control-Allow-Methods', 'GET')
                    .append('Access-Control-Allow-Origin', '*')
                    .append(
                        'Access-Control-Allow-Headers',
                        'Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method'
                    ),
                responseType: 'text'
            })
            .subscribe(
                (data) => {
                    _data = data;
                },
                (error) => {
                    console.log(error);
                },
                () => {
                    let _ws = new WebDataSet();
                    _ws.readXml(_data);
                    this.setTabPanel(_ws);
                }
            );
    }

    private setTabPanel(pWebDataSet?: WebDataSet) {
        let _tables: WebTableCollection = pWebDataSet.tables;
        let _headers = this.getHeaders(pWebDataSet);
        _headers.forEach((item) => {
            this.tabsInfo.push({
                header: item,
                data: _tables[_headers.indexOf(item)],
                isData:
                    _tables[_headers.indexOf(item)].items.length != 0
                        ? true
                        : false,
                columns: this.setColumn(_headers, _tables, item),
                search: this.setSearch(_headers, _tables, item)
            });
        });

        this.initTabPanel();
    }

    private getHeaders(pWebDataSet?: WebDataSet) {
        let _headers: any[] = [];
        let _tables: WebTableCollection = pWebDataSet.tables;
        for (let i = 0; i < _tables.length; i++) {
            _headers.push(_tables[i].name);
        }

        return _headers;
    }

    private setColumn(
        pHeaders?: any[],
        pTables?: WebTableCollection,
        pItem?: any
    ) {
        let _columns: any[] = [];
        let _wt: WebDataTable = pTables[pHeaders.indexOf(pItem)];
        if (_wt.items.length != 0) {
            for (let i = 0; i < _wt.columns.length; i++) {
                _columns.push(
                    _wt.columns[i].caption
                        ? _wt.columns[i].columnName +
                              ` (${_wt.columns[i].caption})`
                        : _wt.columns[i].columnName
                );
            }
        }

        return _columns;
    }

    private setSearch(pHeaders?: any[], pTables?: any, pItem?: any) {
        let _search: any[] = [];
        let _wt: WebDataTable = pTables[pHeaders.indexOf(pItem)];
        _search = _wt.items.length != 0 ? Object.keys(_wt.items[0]) : [];

        return _search;
    }

    private initTabPanel() {
        if (this._tab) {
            // custum tab header
            this.initHeader();

            // custom tab content
            this._tab.refreshed.addHandler(() => {
                this.setDefaultTab();
                this.initGrid();
                this.initBox();
                this.initInfoColumn();
            });
        }
    }

    private setDefaultTab(tab: wjNav.TabPanel = this._tab) {
        tab.selectedIndex = 0;
        tab.isAnimated = false;
    }

    private initHeader() {
        if (this._tab) {
            let _panel = this.hostElement?.querySelector('wj-tab-panel div');
            wjc.setCss(_panel, {
                display: 'flex',
                flexDirection: 'column-reverse',
                width: '100%',
                height: '100%'
            });

            let _parent = this.hostElement?.querySelector(
                '.wj-tabheaders'
            ) as any;
            if (_parent) {
                let _wrapper = document.createElement('div');
                wjc.addClass(_wrapper, 'tab-headers');
                wjc.setCss(_wrapper, {
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    background: '#f0f0f0',
                    width: '100%',
                    height: '20px'
                });
                _parent.parentNode.appendChild(_wrapper);
                _wrapper.appendChild(_parent);

                // create scroll button
                if (_wrapper) {
                    let _scroll: HTMLElement;
                    _scroll = document.createElement('div');
                    wjc.addClass(_scroll, 'tab-scroll');
                    wjc.setCss(_scroll, {
                        display: 'none',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '36px'
                    });
                    _wrapper.appendChild(_scroll);
                    if (_scroll) {
                        let _left = document.createElement('button');
                        let _right = document.createElement('button');
                        wjc.addClass(_left, 'left');
                        wjc.addClass(_right, 'right');
                        wjc.setCss([_left, _right], {
                            width: '18px',
                            height: '18px',
                            border: '1px solid #acacac',
                            background: '#e9e9e9'
                        });
                        _left.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" width="10" height="10" x="0" y="0" viewBox="0 0 64 64" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g transform="matrix(6.123233995736766e-17,1,-1,6.123233995736766e-17,64.00000190734863,-0.0000019073486328125)"><g xmlns="http://www.w3.org/2000/svg" id="Arrow-13"><path d="m54.9210777 20.296875c-.15625-.3701172-.5185547-.6108398-.9208984-.6108398l-44 .0004883c-.4018555 0-.7646484.2407227-.9213867.6108398-.15625.3701172-.0756836.7983398.2045898 1.0864258l22 22.6274414c.1879883.1933594.4467773.3027344.7167969.3027344s.5288086-.109375.7167969-.3027344l22-22.6279297c.2802734-.2885742.3603515-.7163086.2041015-1.0864258z" fill="#000000" data-original="#000000" class=""></path></g></g></svg>`;
                        _right.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" width="10" height="10" x="0" y="0" viewBox="0 0 64 64" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g transform="matrix(-6.123233995736766e-17,1,1,6.123233995736766e-17,0.0000019073486328125,-0.0000019073486328125)"><g xmlns="http://www.w3.org/2000/svg" id="Arrow-13"><path d="m54.9210777 20.296875c-.15625-.3701172-.5185547-.6108398-.9208984-.6108398l-44 .0004883c-.4018555 0-.7646484.2407227-.9213867.6108398-.15625.3701172-.0756836.7983398.2045898 1.0864258l22 22.6274414c.1879883.1933594.4467773.3027344.7167969.3027344s.5288086-.109375.7167969-.3027344l22-22.6279297c.2802734-.2885742.3603515-.7163086.2041015-1.0864258z" fill="#000000" data-original="#000000" class=""></path></g></g></svg>`;
                        _scroll.appendChild(_left);
                        _scroll.appendChild(_right);
                        this.setHover(_left, _right);

                        // mouse click event
                        this.setScrollEvent(_left, _parent, -50);
                        this.setScrollEvent(_right, _parent, +50);

                        // hidden/show scroll button
                        this._tab.refreshed.addHandler(() => {
                            let _headerWidth: number = 0;
                            let _tabWidth: number = 0;
                            _headerWidth = _parent.clientWidth;
                            this.getCollection('wj-tabheader').forEach((e) => {
                                _tabWidth = _tabWidth + e.clientWidth + 2;
                            });
                            wjc.setCss(_scroll, {
                                display:
                                    _headerWidth < _tabWidth ? 'flex' : 'none'
                            });
                        });
                    }
                }
            }
        }
    }

    private initGrid() {
        this._grid.forEach((item: wjcGrid.FlexGrid) => {
            // default grid
            this.setDefaultGrid(item);

            // default selected
            this.getSelectedItemGrid(item);

            // selected item
            this.onSelectedItemGrid(item);
        });
    }

    private _gridRange: wjcGrid.CellRange = new wjcGrid.CellRange(0, 0, 0, 0);

    private _infoColumn: any[] = [];
    public set infoColumn(pValue: any[]) {
        if (this._infoColumn == pValue) return;

        this._infoColumn = pValue;
        this.invalidate();
    }
    public get infoColumn(): any[] {
        return this._infoColumn;
    }

    private getSelectedItemGrid(flexGrid?: wjcGrid.FlexGrid) {
        flexGrid.refreshed.addHandler(
            (flex: any, e: wjcGrid.CellRangeEventArgs) => {
                this.setInfoColumn(flex);
            }
        );
    }

    private onSelectedItemGrid(flexGrid?: wjcGrid.FlexGrid) {
        flexGrid.selectionChanged.addHandler(
            (flex: any, e: wjcGrid.CellRangeEventArgs) => {
                this._gridRange = e.range;
                this._box.toArray()[this._tab.selectedIndex].selectedIndex =
                    e.col;
                this.setInfoColumn(flex);
            }
        );
    }

    private setDefaultGrid(flexGrid?: wjcGrid.FlexGrid) {
        // row numbering
        flexGrid.formatItem.addHandler(
            (flex: wjcGrid.FlexGrid, e: wjcGrid.FormatItemEventArgs) => {
                if (e.panel.cellType == wjcGrid.CellType.RowHeader) {
                    e.cell.textContent = (e.row + 1).toString();
                }
            }
        );

        // default selection
        flexGrid.selection = this._gridRange;
        flexGrid.isReadOnly = true;
    }

    private initBox() {
        this._box.forEach((item: wjcInput.ComboBox) => {
            // selected item
            this.onSelectedItemBox(item);
        });
    }

    private onSelectedItemBox(box?: wjcInput.ComboBox) {
        box.selectedIndexChanged.addHandler(
            (box: wjcInput.ComboBox, self: wjc.EventArgs) => {
                this._grid.toArray()[this._tab.selectedIndex].selection =
                    new wjcGrid.CellRange(
                        this._gridRange.row,
                        box.selectedIndex
                    );
            }
        );
    }

    private initInfoColumn() {
        this._info.forEach((item: wjcGrid.FlexGrid) => {
            item.headersVisibility = wjcGrid.HeadersVisibility.None;
            item.isReadOnly = true;
        });
    }

    private setInfoColumn(flexGrid?: any) {
        if (flexGrid.collectionView.columns[this._gridRange.col]) {
            this.infoColumn = [];
            for (const [key, value] of Object.entries(
                flexGrid.collectionView.columns[this._gridRange.col]
            )) {
                this.infoColumn.push({
                    property: `${key}`,
                    value: `${value}`
                });
            }
        }
    }

    private setScrollEvent(button?: any, element?: any, value?: number) {
        button.addEventListener('click', () => {
            element.scrollLeft = element.scrollLeft + value;
        });
    }

    private setHover(...element: Array<any>) {
        for (const _element of element) {
            _element.addEventListener('mouseover', () => {
                wjc.setCss(_element, {
                    'background-color': '#E0EEF9',
                    border: '1px solid #568FBA'
                });
            });
            _element.addEventListener('mouseout', () => {
                wjc.setCss(_element, {
                    'background-color': '#e9e9e9',
                    border: '1px solid #acacac'
                });
            });
        }
    }

    private getCollection(...className: Array<string>) {
        const _elements = new Array<HTMLElement>();
        for (const zClassName of className) {
            _elements.push(
                ...Array.from(
                    this.hostElement?.getElementsByClassName(
                        zClassName
                    ) as HTMLCollectionOf<HTMLElement>
                )
            );
        }
        return _elements;
    }
}
