import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'bravo-login',
	templateUrl: './bravo.login.html',
	styleUrls: ['./bravo.login.css', 'bravo.login.scss', 'bravo.login.less']
})
export class BravoLogin implements OnInit {
	constructor() {}

	ngOnInit(): void {
		console.log('Hoàn thành');
	}
}
