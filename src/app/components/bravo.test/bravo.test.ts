import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { filter, take } from 'rxjs/operators';
import {
    BravoMonaco,
    BravoMonacoEditorConstructionOptions,
    BravoMonacoStandaloneCodeEditor,
    BravoMonacoUri
} from '../bravo.monaco.editor/bravo.monaco.editor.interfaces';
import { BravoMonacoEditorService } from '../bravo.monaco.editor/bravo.monaco.editor.service';

declare var monaco: BravoMonaco;
@Component({
    selector: 'bravo-test',
    templateUrl: './bravo.test.html',
    styleUrls: ['./bravo.test.scss']
})
export class BravoTest implements OnInit {
    constructor(
        private http: HttpClient,
        private fb: FormBuilder,
        private bravoMonacoEditorService: BravoMonacoEditorService
    ) {
        this.bravoMonacoEditorService.isMonacoLoaded$
            .pipe(
                filter((isLoaded) => !!isLoaded),
                take(1)
            )
            .subscribe(() => {
                this.registerMonacoCustomTheme();
            });
    }

    public editor: BravoMonacoEditorConstructionOptions = {
        theme: 'myCustomTheme',
        language: 'xml',
        roundedSelection: true,
        autoIndent: 'full'
        // value: this.getCode()
    };

    public modelUri: BravoMonacoUri;

    ngOnInit(): void {
        // this.loadXML();
    }

    private loadXML() {
        const _api = './assets/data/declare.xml';
        let _data: any;
        this.http
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
                    this.editor.value = _data;
                }
            );
    }

    editorInit(editor: BravoMonacoStandaloneCodeEditor) {
        // Programatic content selection example
        editor.setSelection({
            startLineNumber: 1,
            startColumn: 1,
            endColumn: 50,
            endLineNumber: 3
        });
    }

    getCode() {
        return `<root>
	<Tables>
		<ParentTable>
			<FilterKey>DocCode='PT' AND BranchCode='{=BRANCH()}'</FilterKey>
			<Sort>DocDate DESC,DocNo DESC</Sort>
			<Name>vB30AccDoc_Explore</Name>
			<Alias>Ct</Alias>
			<DisplayMember>Description</DisplayMember>
			<Evaluators>
				<Eval_Editor>
					<ClassName>BravoCommandKey</ClassName>
					<CommandKey>EDIT_PT</CommandKey>
					<Expr>LastCommand() IN ('New', 'NewAsCopy', 'Open')</Expr>
				</Eval_Editor>
				<Eval_Reporter>
					<ClassName>BravoCommandKey</ClassName>
					<CommandKey>AccDocViewer_PT</CommandKey>
					<Expr>LastCommand() IN ('Viewer','Print', 'QuickPrint', 'Preview')</Expr>
				</Eval_Reporter>
				<Eval_PreviewReporter>
					<ClassName>BravoCommandKey</ClassName>
					<CommandKey>AccDocViewer_PT</CommandKey>
				</Eval_PreviewReporter>
			</Evaluators>
			<DefaultValues>
				<DocCode>'PT'</DocCode>
			</DefaultValues>
			<RowSelected>
				<Eval_CurrencyCode_FormatWhen>
					<Controls>
						<Name>Item_0.OriginalAmount,Item_1.OriginalAmount.OriginalAmountBeforeTax</Name>
						<Format>FormatCurrency(CurrencyCode)</Format>
					</Controls>
				</Eval_CurrencyCode_FormatWhen>
			</RowSelected>
		</ParentTable>
		<ChildTable_Detail>
			<Name>B30AccDocCashReceipt</Name>
			<Sort>BuiltinOrder</Sort>
			<ParentKey>Stt</ParentKey>
			<ChildKey>Stt</ChildKey>
			<DisplayMember>Description</DisplayMember>
			<FetchingColumnList>BuiltinOrder</FetchingColumnList>
			<ServerLoaded>
				<Eval_Ct0_Description>
					<DataMember>Description</DataMember>
					<Value>Parent.Description</Value>
					<Expr>Description IS NULL</Expr>
				</Eval_Ct0_Description>
			</ServerLoaded>
			<FilterKey />
		</ChildTable_Detail>
		<ChildTable_Task>
			<Name>vB30Task</Name>
			<Sort>TaskDate DESC</Sort>
			<ParentKey>Stt</ParentKey>
			<ChildKey>Stt</ChildKey>
			<Evaluators>
				<Eval_ChildTable_Task>
					<ClassName>BravoCommandKey</ClassName>
					<CommandKey>EDIT_TaskBizDoc</CommandKey>
					<zCtorArgs>ParentTable.DefaultCategory='ACCDOC';</zCtorArgs>
					<Expr>LastCommand() IN ('New', 'NewAsCopy', 'Open')</Expr>
				</Eval_ChildTable_Task>
			</Evaluators>
			<FilterKey />
		</ChildTable_Task>
		<ChildTable_AtchDoc>
			<ChildKey>Stt</ChildKey>
			<Sort>Stt</Sort>
			<Name>vB30AccDocAtchDoc_Edit</Name>
			<ParentKey>Stt</ParentKey>
			<FilterKey>ISNULL(RowId_SourceDoc,'') = ''</FilterKey>
		</ChildTable_AtchDoc>
		<ChildTable_Paybill>
			<ChildKey>RowId_SourceDoc</ChildKey>
			<Name>vB30AccDocPaybill</Name>
			<ParentTable>B30AccDocCashReceipt</ParentTable>
			<ParentKey>RowId</ParentKey>
			<Sort>DueDocDate</Sort>
			<FilterKey />
		</ChildTable_Paybill>
		<ChildTable_ApplyPrepay>
			<Name>vB30DueApplyPrepay_Explore</Name>
			<ParentTable>B30AccDocCashReceipt</ParentTable>
			<ParentKey>RowId</ParentKey>
			<ChildKey>RowId_SourceDoc</ChildKey>
			<Sort>Stt</Sort>
			<FilterKey />
		</ChildTable_ApplyPrepay>
		<ChildTable_AccDocPrcess>
			<Name>vB30AccDocProcess</Name>
			<ChildKey>Stt</ChildKey>
			<ParentKey>Stt</ParentKey>
			<Sort>BuiltinOrder</Sort>
			<FilterKey />
		</ChildTable_AccDocPrcess>
		<ChildTable_ProcessResult>
			<!-- 10/08/22 THANGNH thêm bảng Lịch sử duyệt -->
			<Name>vB30AccDocProcessResult</Name>
			<ParentTable>Ct</ParentTable>
			<ChildKey>Stt</ChildKey>
			<ParentKey>Stt</ParentKey>
			<Sort>ApprovedAt DESC</Sort>
			<FilterKey />
		</ChildTable_ProcessResult>
		<!--8/12/2021: Thêm tab tài liệu đính kèm-->
		<ChildTable_FileStore>
			<Name>vB20FileStore</Name>
			<ChildKey>Stt</ChildKey>
			<ParentKey>Stt</ParentKey>
			<Sort>BuiltinOrder</Sort>
			<ServerLoading>
				<_FileName>IIF(ISNULL(FileName,'')&lt;&gt;'', FileName, NULL)</_FileName>
			</ServerLoading>
		</ChildTable_FileStore>
	</Tables>
</root>`;
    }

    registerMonacoCustomTheme() {
        monaco.editor.defineTheme('myCustomTheme', {
            base: 'vs',
            inherit: true,
            rules: [
                { token: 'comment', fontStyle: 'italic underline' },
                { token: 'comment.js', foreground: 'ff0303', fontStyle: 'bold' },
                { token: 'comment.css', foreground: 'ff0303', fontStyle: 'bold' }
            ],
            colors: {}
        });

        monaco.languages.registerCompletionItemProvider('xml', {
            provideCompletionItems: (model, position) => {
                const wordBeforePosition = model.getWordUntilPosition({
                    lineNumber: position.lineNumber,
                    column: position.column - 1
                });

                const wordUntilPosition = model.getWordUntilPosition(position);
                if (wordBeforePosition.word.trim() === '' || wordUntilPosition.word.trim() === '') {
                    const keywords = [
                        {
                            label: 'Bravo',
                            kind: monaco.languages.CompletionItemKind.Function,
                            insertText: 'Bravo',
                            description: 'Bravo',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                        },
                        {
                            label: 'Bravo8',
                            kind: monaco.languages.CompletionItemKind.Function,
                            insertText: 'Bravo8',
                            description: 'Bravo8'
                        },
                        {
                            label: 'Bravo8R3',
                            kind: monaco.languages.CompletionItemKind.Function,
                            insertText: 'Bravo8R3',
                            description: 'Bravo8R3'
                        },
                        {
                            label: 'DucLA',
                            kind: monaco.languages.CompletionItemKind.Function,
                            insertText: 'DucLA',
                            description: 'Lê Anh Đức',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                        },
                        {
                            label: 'CuongNC',
                            kind: monaco.languages.CompletionItemKind.Function,
                            insertText: 'CuongNC',
                            description: 'Nguyễn Chí Cường',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                        },
                        {
                            label: 'TrungNB',
                            kind: monaco.languages.CompletionItemKind.Function,
                            insertText: 'TrungNB',
                            description: 'Trung NB',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                        }
                    ];

                    const suggestions = keywords.map((id) => ({
                        label: id.label,
                        kind: id.kind,
                        description: id.description,
                        documentation: id.description,
                        insertText: id.insertText,
                        detail: id.description,
                        insertTextRules: id.insertTextRules,
                        range: {
                            startLineNumber: position.lineNumber,
                            startColumn: wordUntilPosition.startColumn,
                            endLineNumber: position.lineNumber,
                            endColumn: wordUntilPosition.endColumn - 1
                        }
                    }));
                    return { suggestions };
                }
            }
        });
    }

    // editorOptions = { theme: 'vs-dark', language: 'javascript' };
    // code: string = 'function x() {\nconsole.log("Hello world!");\n}';
    // originalCode: string = 'function x() { // TODO }';
}
