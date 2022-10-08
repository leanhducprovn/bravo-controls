import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription } from 'rxjs';

import * as wjc from '@grapecity/wijmo';
import * as wjNav from '@grapecity/wijmo.nav';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcInput from '@grapecity/wijmo.input';

import { WebDataSet } from '../../core/lib/data/bravo.web.dataset';
import { WebDataColumn } from '../../core/lib/data/bravo.web.datacolumn';

@Component({
	selector: 'bravo-tab-grid-layout',
	templateUrl: './bravo.tab.grid.layout.html',
	styleUrls: ['./bravo.tab.grid.layout.css', './bravo.tab.grid.layout.scss'],
})
export class BravoTabGridLayout
	extends wjc.Control
	implements OnInit, OnDestroy, AfterViewInit {
	@ViewChild('tab') _tab!: wjNav.TabPanel;
	@ViewChildren('grid') _grid!: QueryList<wjcGrid.FlexGrid>;
	@ViewChildren('search') _search!: QueryList<wjcInput.ComboBox>;
	@ViewChildren('gridInfo') _info!: QueryList<wjcGrid.FlexGrid>;

	public tabsInfo!: any[];

	constructor(private http: HttpClient, elementRef: ElementRef) {
		super(elementRef.nativeElement);
	}

	public refresh(fullUpdate?: boolean | undefined): void {
		super.refresh(fullUpdate);
	}

	public ngOnInit(): void {
		this.loadXML();
	}

	public ngAfterViewInit(): void { }

	public ngOnDestroy(): void {
		this._xmlSubscription.unsubscribe();
	}

	private _xmlSubscription!: Subscription;
	private loadXML() {
		const _api = './assets/data/cash-receipts.xml';
		let _data: any;
		this._xmlSubscription = this.http.get(_api, {
			headers: new HttpHeaders()
				.set('Content-Type', 'text/xml')
				.append('Access-Control-Allow-Methods', 'GET')
				.append('Access-Control-Allow-Origin', '*')
				.append(
					'Access-Control-Allow-Headers',
					'Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method'
				),
			responseType: 'text',
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
					this.loadTab(_ws);
				}
			);
	}

	private loadTab(pWebDataSet?: WebDataSet) {
		this.tabsInfo = [];
		this.getHeaders(pWebDataSet).forEach((header) => {
			this.tabsInfo.push({
				header: header,
				data: pWebDataSet.tables[this.getHeaders(pWebDataSet).indexOf(header)],
				columns: this.loadColumn(this.getHeaders(pWebDataSet), pWebDataSet.tables, header),
				search: this.loadSearch(this.getHeaders(pWebDataSet), pWebDataSet.tables, header),
			});
		});

		this.initHeader();
		this.onSelection();
	}

	private getHeaders(pWebDataSet?: WebDataSet) {
		let _headers: any[] = [];
		for (let i = 0; i < pWebDataSet.tables.length; i++) {
			_headers.push(pWebDataSet.tables[i].name);
		}

		return _headers;
	}

	private loadSearch(pHeaders?: any[], pData?: any, pHeader?: any) {
		let _search: any[];
		_search =
			pData[pHeaders.indexOf(pHeader)].items.length != 0
				? Object.keys(pData[pHeaders.indexOf(pHeader)].items[0])
				: [];

		return _search;
	}

	private loadColumn(pHeaders?: any[], pData?: any, pHeader?: any) {
		let _columns: any[] = [];
		if (pData[pHeaders.indexOf(pHeader)].items.length != 0) {
			for (
				let i = 0;
				i < pData[pHeaders.indexOf(pHeader)].columns.length;
				i++
			) {
				_columns.push(
					pData[pHeaders.indexOf(pHeader)].columns[i].caption
						? pData[pHeaders.indexOf(pHeader)].columns[i].columnName +
						` (${pData[pHeaders.indexOf(pHeader)].columns[i].caption})`
						: pData[pHeaders.indexOf(pHeader)].columns[i].columnName
				);
			}
		}

		return _columns;
	}

	private initHeader() {
		if (this._tab) {
			this._tab.selectedIndex = 0;
			this._tab.isAnimated = false;

			let _panel = this.hostElement?.querySelector('wj-tab-panel div');
			wjc.setCss(_panel, {
				display: 'flex',
				flexDirection: 'column-reverse',
				width: '100%',
				height: '100%',
			});

			let _parent = this.hostElement?.querySelector('.wj-tabheaders') as any;
			if (_parent) {
				let _wrapper = document.createElement('div');
				wjc.addClass(_wrapper, 'tab-headers');
				wjc.setCss(_wrapper, {
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-between',
					background: '#f0f0f0',
					width: '100%',
					height: '20px',
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
						width: '36px',
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
							background: '#e9e9e9',
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
							})
							wjc.setCss(_scroll, {
								display: _headerWidth < _tabWidth ? 'flex' : "none",
							})
						})
					}
				}
			}
		}
	}

	private onSelection() {
		if (this._tab) {
			this._tab.refreshed.addHandler(() => {
				this._grid.forEach((gridItem) => {
					gridItem.selectionChanged.addHandler((e, s) => {
						this._search.toArray()[this._tab.selectedIndex].selectedIndex = s.col;
					})
				})
			})
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
					border: '1px solid #568FBA',
				});
			});
			_element.addEventListener('mouseout', () => {
				wjc.setCss(_element, {
					'background-color': '#e9e9e9',
					border: '1px solid #acacac',
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

	public gridInitialized(flexgrid: wjcGrid.FlexGrid) {
		flexgrid.formatItem.addHandler(
			(s: wjcGrid.FlexGrid, e: wjcGrid.FormatItemEventArgs) => {
				if (e.panel.cellType == wjcGrid.CellType.RowHeader) {
					e.cell.textContent = (e.row + 1).toString();
				}
			}
		);
	}
}