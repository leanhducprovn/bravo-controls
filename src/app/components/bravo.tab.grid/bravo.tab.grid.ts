import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription } from 'rxjs';
import * as wjc from '@grapecity/wijmo';
import * as wjNav from '@grapecity/wijmo.nav';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcInput from '@grapecity/wijmo.input';

import { WebDataSet } from '../../core/lib/data/bravo.web.dataset';
import { WebDataColumn } from 'core';

@Component({
	selector: 'bravo-tab-grid',
	templateUrl: './bravo.tab.grid.html',
	styleUrls: ['./bravo.tab.grid.scss'],
})
export class BravoTabGrid
	extends wjc.Control
	implements OnInit, OnDestroy, AfterViewInit {
	constructor(private http: HttpClient, elementRef: ElementRef) {
		super(elementRef.nativeElement);
	}

	ngOnInit(): void {
		this.loadXML();
	}

	ngAfterViewInit(): void { }

	ngOnDestroy(): void {
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
					const _ws = new WebDataSet();
					_ws.readXml(_data);
					this.loadTab(_ws);
					console.log(_ws)
				}
			);
	}

	private loadTab(pWebDataSet: WebDataSet) {
		let _headers: any[] = [];
		for (let i = 0; i < pWebDataSet.tables.length; i++) {
			_headers.push(pWebDataSet.tables[i].name);
		}
		let _eBravoTabGrid = document.createElement('div');
		wjc.addClass(_eBravoTabGrid, 'bravo-tab-grid');
		this.hostElement.appendChild(_eBravoTabGrid);

		let _eTabPanel = this.hostElement?.querySelector('.bravo-tab-grid');
		if (_eTabPanel) {
			wjc.setCss(_eTabPanel, {
				'display': 'flex',
				'flex-direction': 'column',
				'width': '100%',
				'height': '100%',
				'overflow': 'hidden'
			})
			let _tabPanel = new wjNav.TabPanel(_eTabPanel);
			_tabPanel.tabs.deferUpdate(() => {
				_headers.forEach((header) => {
					// create the tab header element
					let _eHeader = document.createElement('div');
					wjc.addClass(_eHeader, 'bravo-tab-header')
					_eHeader.textContent = header;
					// create the tab pane element
					let _ePane = document.createElement('div');
					wjc.addClass(_ePane, 'bravo-tab-panel')
					let _eGrid = document.createElement('div');
					wjc.addClass(_eGrid, 'bravo-tab-grid')
					let _grid = new wjcGrid.FlexGrid(_eGrid, {
						isReadOnly: true,
						itemsSource: pWebDataSet.tables[_headers.indexOf(header)],
					});
					_ePane.appendChild(_eGrid);
					// add the new Tab to the TabPanel
					_tabPanel.tabs.push(new wjNav.Tab(_eHeader, _ePane));
				});
			});
		}
	}
}
