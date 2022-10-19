import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { filter, take } from 'rxjs/operators';
import {
    BravoMonaco,
    BravoMonacoCompletionItem,
    BravoMonacoEditorConstructionOptions,
    BravoMonacoStandaloneCodeEditor,
    BravoMonacoUri
} from '../bravo.monaco.editor/bravo.monaco.editor.type';
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
                            label: 'XmlSnippets',
                            insertText: 'XmlSnippets',
                            detail: 'Bắt đầu phần khai báo'
                        },
                        {
                            label: 'Declare',
                            insertText: 'Declare',
                            detail: 'Khai báo template dùng chung sẽ được tham chiếu đến bằng declare="" và link="" (cho phép đệ quy - tham chiếu chính nó)',
                            documentation:
                                'Trong một số trường hợp là thẻ con của <Snippet> để khai báo nội dung chèn khác ngầm định theo khai báo format.'
                        },
                        {
                            label: 'IncludeFile',
                            insertText: 'IncludeFile',
                            detail: 'Tham chiếu đến nội dung khai báo ở file khác ở cùng thư mục'
                        },
                        {
                            label: 'Path',
                            insertText: 'Path',
                            detail: 'Khai báo đường dẫn',
                            documentation:
                                '<Path name="/A/B"/ exclude="B1|B2"> khai báo đường dẫn (/A/B) trong nội dung layout để lấy tất cả các mục con của B mà không phải là B1 và B2.\n\nname\t: khai báo đường dẫn trong nội dung layout\nexclude\t: danh sách các mục con sẽ bỏ qua'
                        },
                        {
                            label: 'DEFAULT',
                            insertText: 'DEFAULT',
                            detail: 'Đại diện cho nhiều mục con, nhiều cột khác nhau... thuộc một mục mẹ, thẻ phải để ở vị trí cuối cùng trong nhóm'
                        },
                        {
                            label: 'Snippets',
                            insertText: 'Snippets',
                            detail: 'khai báo các mục trong auto complete menu',
                            documentation:
                                'name\t: tên của snippet\ntoolTipText\t: nội dung tooltip\ntoolTipTitle\t: tiêu đề tooltip\n\ntype\t: kiểu snippet\n\tDefault\t: snippet để chèn 1 chuỗi văn bản\n\tDeclare\t: tham chiếu đến khai báo ở phần <Declare>\n\tTagName\t: liệt kê tên của các thẻ khai báo phù hợp với tagPath\n\tTagValue\t: liệt kê giá trị của các thẻ khai báo phù hợp với tagPath\n\tPropertyList\t: liệt kê các properties của class khai báo\n\tPropertyValue\t: giá trị property của class khai báo\n\tEnumValue\t: liệt kê các giá trị dạng enum\n\tLanguageName\t: liệt kê các ngôn ngữ giao diện\n\tCommandKey\t: liệt kê các CommandKey trong B00Command\n\tClassName\t: liệt kê các class\n\tDllName\t: liệt kê các assembly\n\tTableName\t: liệt kê tên các bảng dữ liệu khai báo\n\tDataColumnName\t: liệt kê tên các cột dữ liệu của bảng\n\tChildControlName\t: liệt kê đệ quy tên các control của một control collection phù hợp với tagPath\n\tGridColumnName\t: liệt kê tên các cột của grid phù hợp với tagPath\n\tDbTableName\t: liệt kê tên các bảng trong CSDL\n\tDbCommandName\t: liệt kê tên các thủ tục lưu và hàm trong CSDL\n\tDbParameterName\t: liệt kê các tham số của thủ tục lưu và hàm trong CSDL\n\tLayoutData\t: liệt kê các khai báo layout theo pattern chỉ định ở name\n\tPrinterName\t: liệt kê tên các máy in được cài đặt\n\tConnectionName\t: liệt kê tên các kết nối CSDL khai báo trong config\n\ntagPath\t: khai báo đường dẫn trong nội dung layout để lấy giá trị thẻ\nrecursivePath\t: dùng kết hợp với tagPath để tìm đệ quy các thẻ con\ntableName\t: chỉ định tên bảng dữ liệu\ntableNamePath\t: khai báo đường dẫn trong nội dung layout để lấy tên bảng dữ liệu\ntablePattern\t: dùng kết hợp cùng tableNamePath hoặc tableName để tìm thẻ mẹ chứa khai báo bảng dữ liệu và sẽ được thay thế vào tableNamePath hoặc tableName\nbaseClass\t: khai báo danh sách các class và các class kế thừa của chúng sẽ được liệt kê (tên các class phân cách bởi dấu ,)\ndefaultAssembly\t: khai báo danh sách các assembly ngầm định dùng khi không chỉ định thẻ <Assembly>\ndefaultClass\t: khai báo danh sách các class dùng khi không chỉ định thẻ <ClassName>\nvalue\t: chỉ định danh sách các giá trị cách nhau bởi dấu , cho snippet type="EnumValue" hoặc dùng kết hợp cùng tableNamePath hoặc tagPath để lấy giá trị thẻ theo khuôn mẫu\nintegerValue\t: dùng cho snippet type="EnumValue", integerValue="True" sẽ lấy giá trị Integer của kiểu enum khai báo trong defaultClass=""\n\nvisibleType\t: phạm vi của snippet\n\tDefault\t: chỉ dùng cho thẻ ở vị trí khai báo\n\tChildTagNames\t: dùng cho tag name ở vị trí khai báo và tất cả các tag name con\n\tChildTagValues\t: dùng cho tag value ở vị trí khai báo và tất cả các tag value con\n\tTagNameOnly\t: chỉ dùng riêng cho tag name\n\tTagValueOnly\t: chỉ dùng riêng cho tag value\n\nformat\t: kiểu định dạng nội dung chèn (^ là chỉ vị trí con trỏ sau khi chèn)\n\tDefault\t: tag name hoặc tag value\n\tMultiValues\t: cho phép tag value gồm nhiều giá trị cách nhau bởi dấu ,\n\tOpenedTag\t: tag name <snippet_name\n\tClosedTag\t: tag name <snippet_name/>^\n\tCompletedTag\t: tag name <snippet_name>^</snippet_name>\n\tParentTag\t: tag name <snippet_name>...^...</snippet_name>'
                        }
                    ];

                    const suggestions: BravoMonacoCompletionItem[] = keywords.map((id: any) => ({
                        label: id.label,
                        kind: id.kind ? id.kind : monaco.languages.CompletionItemKind.Function,
                        detail: id.detail,
                        documentation: id.documentation ? id.documentation : id.detail,
                        insertText: id.insertText,
                        insertTextRules: id.insertTextRules
                            ? id.insertTextRules
                            : monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        range: id.range
                            ? id.range
                            : {
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
