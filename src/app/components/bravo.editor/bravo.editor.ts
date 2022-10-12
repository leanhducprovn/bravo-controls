import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'bravo-editor',
  templateUrl: './bravo.editor.html',
  styleUrls: ['./bravo.editor.css']
})
export class BravoEditor implements OnInit {

  editorOptions = { theme: 'vs-dark', language: 'javascript' };
  code: string = 'function x() {\nconsole.log("Hello world!");\n}';

  constructor() { }

  ngOnInit(): void {
  }

}
