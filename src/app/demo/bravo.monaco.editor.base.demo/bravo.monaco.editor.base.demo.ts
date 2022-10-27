import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BravoMonacoEditorConstructionOptions } from 'src/app/components/bravo.monaco.editor/bravo.monaco.editor.type';

@Component({
    selector: 'bravo-monaco-editor-base-demo',
    templateUrl: './bravo.monaco.editor.base.demo.html',
    styleUrls: ['./bravo.monaco.editor.base.demo.scss']
})
export class BravoMonacoEditorBaseDemo implements OnInit {
    constructor(private http: HttpClient) {}

    public editor: BravoMonacoEditorConstructionOptions = {
        value: `<XmlSnippets>
	<Declare>
		<ChartGroupsTemplate>
			<DEFAULT>
				<Snippets>
					<Snippet></Snippet>
				</Snippets>
			</DEFAULT>
		</ChartGroupsTemplate>
	</Declare>
</XmlSnippets>`
    };

    ngOnInit(): void {}
}
