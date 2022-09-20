import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
} from '@angular/core';
import * as wjc from '@grapecity/wijmo';
import * as input from '@grapecity/wijmo.input';

import ResizeObserver from 'resize-observer-polyfill';

@Component({
  selector: 'bravo-toolbar',
  templateUrl: './bravo.toolbar.html',
  styleUrls: ['./bravo.toolbar.css', './bravo.toolbar.scss'],
})
export class BravoToolbarComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
