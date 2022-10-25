import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BravoMonacoEditorConstructionOptions } from 'src/app/components/bravo.monaco.editor/bravo.monaco.editor.type';

@Component({
    selector: 'app-bravo-monaco-editor-base-demo',
    templateUrl: './bravo.monaco.editor.base.demo.html',
    styleUrls: ['./bravo.monaco.editor.base.demo.scss']
})
export class BravoMonacoEditorBaseDemo implements OnInit {
    constructor(private http: HttpClient) {}

    public editor: BravoMonacoEditorConstructionOptions = {
        theme: 'vs-dark',
        language: 'xml',
        value: `<root>
	<toolStrip1>
		<Items>
			<Open>
				<DisplayStyle>2</DisplayStyle>
			</Open>
			<_SEPARATOR_1 />
			<Print>
				<DisplayStyle>2</DisplayStyle>
			</Print>
			<!--02/07/2021 Chamvt thêm -->
			<_SEPARATOR_0 />
			<UserGuide>
				<DisplayStyle>Image</DisplayStyle>
			</UserGuide>
			<_SEPARATOR_2 />
			<SelectLayout>
				<Alignment>1</Alignment>
				<DisplayStyle>2</DisplayStyle>
			</SelectLayout>
			<ProgramInfo>
				<ForeColor>White</ForeColor>
				<BackColor>Red</BackColor>
				<Font>,,style=Bold</Font>
			</ProgramInfo>
		</Items>
	</toolStrip1>
	<menuStrip1>
		<Items>
			<_MENU_0>
				<Text>
					<Vietnamese>Báo cáo</Vietnamese>
					<English>Report</English>
					<Chinese>报告</Chinese>
					<Japanese>レポート</Japanese>
					<Custom>레포트</Custom>
					<Korean>보고서</Korean>
				</Text>
				<Items>
					<Open />
					<_SEPARATOR_0 />
					<QuickSearch />
					<_SEPARATOR_1 />
					<Print />
					<QuickPrint />
					<_SEPARATOR_2 />
					<Refresh />
					<_SEPARATOR_3 />
					<Import />
					<Export />
					<_SEPARATOR_5 />
					<CloseWindow />
				</Items>
			</_MENU_0>
			<_MENU_1>
				<MergeAction>Replace</MergeAction>
				<Text>
					<Vietnamese>Tùy chọn</Vietnamese>
					<English>View</English>
					<Chinese>视图</Chinese>
					<Japanese>ビュー</Japanese>
					<Korean>보기입니다</Korean>
				</Text>
				<Items>
					<Calculator />
					<_SEPARATOR_8 />
					<ChangeTextSize />
					<_SEPARATOR_9 />
					<SelectLanguage />
				</Items>
			</_MENU_1>
		</Items>
	</menuStrip1>
	<DataSource>
		<Tables>
			<ParametersTable>
				<DefaultValues>
					<BranchCode>BRANCH()</BranchCode>
					<nUserId>USER('Id')</nUserId>
					<LangId>LANGID()</LangId>
				</DefaultValues>
			</ParametersTable>
		</Tables>
	</DataSource>
	<Report>
		<Title>
			<Rows>
				<Row_0>
					<Height>26</Height>
				</Row_0>
				<Row_1>
					<Height>21</Height>
				</Row_1>
				<Row_2>
					<Height>10</Height>
				</Row_2>
			</Rows>
			<Cols>
				<Column_0>
					<Width>-1</Width>
					<Rows>
						<Row_0>
							<Text>
								<Vietnamese>{=UPPER(Text())}</Vietnamese>
								<English>{=UPPER(Text())}</English>
								<Chinese>{=UPPER(Text())}</Chinese>
								<Japanese>{=UPPER(Text())}</Japanese>
								<Korean>{=UPPER(Text())}.</Korean>
							</Text>
							<Style>Font:,14.25pt,style=Bold;TextAlign:CenterCenter;</Style>
						</Row_0>
						<Row_1>
							<Text>
								<Vietnamese>{=FORMATDATERANGE(@_DocDate1, @_DocDate2)} </Vietnamese>
								<English>{=FORMATDATERANGE(@_DocDate1, @_DocDate2)}</English>
								<Chinese>{=FORMATDATERANGE(@_DocDate1, @_DocDate2)}</Chinese>
								<Japanese>{=FORMATDATERANGE(@_DocDate1, @_DocDate2)}</Japanese>
								<Korean>{=FORMATDATERANGE(@_DocDate1, @_DocDate2)}.</Korean>
							</Text>
							<Style>Font:,,style=Bold, Italic;TextAlign:CenterCenter;</Style>
						</Row_1>
					</Rows>
				</Column_0>
			</Cols>
		</Title>
		<PrintSettings>
			<PaperSize>
				<PaperName>A4</PaperName>
				<Width>827</Width>
				<Height>1169</Height>
				<RawKind>9</RawKind>
			</PaperSize>
			<Landscape>False</Landscape>
			<MeasuringUnit>Cm</MeasuringUnit>
			<Printer />
			<Margins>
				<Bottom>59</Bottom>
				<Left>59</Left>
				<Right>39</Right>
				<Top>59</Top>
			</Margins>
		</PrintSettings>
		<ExportSettings>
			<formatType>Xls</formatType>
		</ExportSettings>
		<Content>
			<Styles>
				<RedColor>ForeColor:255,0,0;Font:,,;</RedColor>
				<BOLD>Font:,,style=Bold;</BOLD>
				<BOLDRED>BackColor:250,250,210;ForeColor:255,0,0;Font:,,style=Bold;</BOLDRED>
				<BOLDBCOLOR>BackColor:241,239,226;Font:,,style=Bold;</BOLDBCOLOR>
				<BOLDGCOLOR>BackColor:224, 224, 224;Font:,,style=Bold;</BOLDGCOLOR>
				<BOLDITALIC>Font:,,style=Bold,Italic;</BOLDITALIC>
				<ITALIC>Font:,,style=Italic;</ITALIC>
				<BOLDUNDERLINE>Font:,,style=Bold,Underline;</BOLDUNDERLINE>
				<BOLDYCOLOR>BackColor:250,250,210;Font:,,style=Bold;</BOLDYCOLOR>
			</Styles>
		</Content>
	</Report>
	<transactionLock>Unspecified</transactionLock>
</root>
		`
    };

    ngOnInit(): void {}
}
