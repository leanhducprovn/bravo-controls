import { Component, OnInit } from '@angular/core';
import { BravoMonacoEditorConstructionOptions } from 'src/app/components/bravo.monaco.editor/bravo.monaco.editor.type';

@Component({
    selector: 'app-bravo-monaco-editor-base-demo',
    templateUrl: './bravo.monaco.editor.base.demo.html',
    styleUrls: ['./bravo.monaco.editor.base.demo.scss']
})
export class BravoMonacoEditorBaseDemo implements OnInit {
    constructor() {}

    public editor: BravoMonacoEditorConstructionOptions = {
        theme: 'vs-dark',
        language: 'xml',
        value: `<root>
	<panelParameters>
		<Controls>
			<lblDocDate1>
				<Text>
					<Vietnamese>Từ ngày</Vietnamese>
					<English>Start date</English>
					<Japanese>開始日</Japanese>
					<Chinese>开始日期</Chinese>
					<Korean>날짜를 시작합니다.</Korean>
				</Text>
				<Row />
				<Column>0</Column>
			</lblDocDate1>
			<txtDocDate1>
				<ClassName>BravoDateInputBox</ClassName>
				<DataMember>DocDate1</DataMember>
				<Column>1</Column>
			</txtDocDate1>
			<lblDocDate2>
				<Text>
					<Vietnamese>Đến ngày</Vietnamese>
					<English>End date</English>
					<Japanese>終了日</Japanese>
					<Chinese>结束日期</Chinese>
					<Korean>종말 날짜.</Korean>
				</Text>
				<Row />
				<Column>0</Column>
			</lblDocDate2>
			<txtDocDate2>
				<ClassName>BravoDateInputBox</ClassName>
				<DataMember>DocDate2</DataMember>
				<Column>1</Column>
			</txtDocDate2>
			<lblWarehouseId>
				<Text>
					<Vietnamese>Kho hàng</Vietnamese>
					<English>Warehouse</English>
					<Chinese>仓库</Chinese>
					<Japanese>倉庫</Japanese>
					<Korean>창고</Korean>
				</Text>
				<Row />
				<Column>0</Column>
			</lblWarehouseId>
			<lookupWarehouseId>
				<ClassName>BravoLookupBox</ClassName>
				<LookupKey>Warehouse</LookupKey>
				<DataMember>WarehouseId</DataMember>
				<lookupMode>ChecklistValueMember</lookupMode>
				<Column>1</Column>
				<bAutoSwitchChecklistMode>True</bAutoSwitchChecklistMode>
			</lookupWarehouseId>
			<lblWarehouseOwnerCode>
				<Text>
					<Vietnamese>Chủ sở hữu kho</Vietnamese>
					<English>Warehouse owner</English>
					<Chinese>仓库主人</Chinese>
					<Japanese>倉庫の所有者</Japanese>
					<Korean>창고 소유자</Korean>
				</Text>
				<Row />
				<Column>0</Column>
			</lblWarehouseOwnerCode>
			<lookupWarehouseOwnerCode>
				<ClassName>BravoLookupBox</ClassName>
				<LookupKey>Customer</LookupKey>
				<SelectKey>IsGroup=0</SelectKey>
				<DataMember>WarehouseOwnerCode</DataMember>
				<Column>1</Column>
			</lookupWarehouseOwnerCode>
			<lblDeptId>
				<Text>
					<Vietnamese>Bộ phận</Vietnamese>
					<English>Department</English>
					<Chinese>部门</Chinese>
					<Japanese>部門</Japanese>
					<Korean>부입니다.</Korean>
				</Text>
				<Row />
				<Column>0</Column>
			</lblDeptId>
			<lookupDeptId>
				<ClassName>BravoLookupBox</ClassName>
				<LookupKey>Dept</LookupKey>
				<DataMember>DeptId</DataMember>
				<!--lookupMode>1</lookupMode-->
				<Column>1</Column>
			</lookupDeptId>
			<lblJobCode>
				<Text>
					<Vietnamese>Vụ việc</Vietnamese>
					<English>Job</English>
					<Japanese>ジョブ</Japanese>
					<Chinese>工作</Chinese>
					<Korean>일</Korean>
				</Text>
				<Row />
				<Column>0</Column>
			</lblJobCode>
			<lookupJobCode>
				<ClassName>BravoLookupBox</ClassName>
				<LookupKey>Job</LookupKey>
				<DataMember>JobCode</DataMember>
				<!--lookupMode>1</lookupMode-->
				<Column>1</Column>
			</lookupJobCode>
			<lblEmployeeId>
				<Text>
					<Vietnamese>Nhân viên</Vietnamese>
					<English>Salesman</English>
					<Chinese>业务员</Chinese>
					<Japanese>セールスマン</Japanese>
					<Korean>"세일즈 맨.</Korean>
				</Text>
				<Row />
				<Column>0</Column>
			</lblEmployeeId>
			<lookupEmployeeId>
				<ClassName>BravoLookupBox</ClassName>
				<LookupKey>Employee</LookupKey>
				<DataMember>EmployeeId</DataMember>
				<lookupMode>2</lookupMode>
				<Column>1</Column>
				<bAutoSwitchChecklistMode>True</bAutoSwitchChecklistMode>
			</lookupEmployeeId>
			<lblItemId>
				<Text>
					<Vietnamese>Vật tư</Vietnamese>
					<English>Item</English>
					<Chinese>项目</Chinese>
					<Japanese>アイテム</Japanese>
					<Korean>항목.</Korean>
				</Text>
				<Row />
				<Column>0</Column>
			</lblItemId>
			<lookupItemId>
				<ClassName>BravoLookupBox</ClassName>
				<LookupKey>Item0</LookupKey>
				<DataMember>ItemId</DataMember>
				<bAutoSwitchChecklistMode>True</bAutoSwitchChecklistMode>
				<Column>1</Column>
			</lookupItemId>
			<lblItemClassCode>
				<Text>
					<Vietnamese>Phân loại vật tư</Vietnamese>
					<English>Item classification</English>
					<Chinese>产品分类</Chinese>
					<Japanese>アイテムの分類</Japanese>
					<Korean>상품 분류</Korean>
				</Text>
				<Row />
				<Column>0</Column>
			</lblItemClassCode>
			<lookupItemClassCode>
				<ClassName>BravoLookupBox</ClassName>
				<LookupKey>ItemClass</LookupKey>
				<SelectKey>IsGroup=0</SelectKey>
				<DataMember>ItemClassCode</DataMember>
				<Column>1</Column>
			</lookupItemClassCode>
			<lblCustomerId>
				<Text>
					<Vietnamese>Khách hàng</Vietnamese>
					<English>Customer</English>
					<Chinese>顾客</Chinese>
					<Japanese>顧客</Japanese>
					<Korean>고객.</Korean>
				</Text>
				<Row />
				<Column>0</Column>
			</lblCustomerId>
			<lookupCustomerId>
				<ClassName>BravoLookupBox</ClassName>
				<LookupKey>Customer</LookupKey>
				<DataMember>CustomerId</DataMember>
				<lookupMode>ChecklistValueMember</lookupMode>
				<Column>1</Column>
			</lookupCustomerId>
			<lblCustomerClassCode>
				<Text>
					<Vietnamese>Phân loại khách hàng</Vietnamese>
					<English>Customer classification</English>
					<Chinese>客户分类</Chinese>
					<Japanese>顧客の分類</Japanese>
					<Korean>고객 분류</Korean>
				</Text>
				<Row />
				<Column>0</Column>
			</lblCustomerClassCode>
			<lookupCustomerClassCode>
				<ClassName>BravoLookupBox</ClassName>
				<LookupKey>CustomerClass</LookupKey>
				<SelectKey>IsGroup=0</SelectKey>
				<DataMember>CustomerClassCode</DataMember>
				<Column>1</Column>
			</lookupCustomerClassCode>
			<lblTransCode>
				<Text>
					<Vietnamese>Giao dịch</Vietnamese>
					<English>Transaction</English>
					<Chinese>交易</Chinese>
					<Japanese>トランザクション</Japanese>
					<Korean>거래.</Korean>
				</Text>
				<Row />
				<Column>0</Column>
			</lblTransCode>
			<lookupTransCode>
				<ClassName>BravoLookupBox</ClassName>
				<LookupKey>Trans</LookupKey>
				<DataMember>TransCode</DataMember>
				<lookupMode>1</lookupMode>
				<Column>1</Column>
			</lookupTransCode>
			<lblTerritoryCode>
				<Text>
					<Vietnamese>Vùng miền</Vietnamese>
					<English>Area</English>
					<Chinese>区域</Chinese>
					<Japanese>エリア</Japanese>
					<Korean>area입니다.</Korean>
				</Text>
				<Row />
				<Column>0</Column>
			</lblTerritoryCode>
			<lookupTerritoryCode>
				<ClassName>BravoLookupBox</ClassName>
				<LookupKey>Territory</LookupKey>
				<DataMember>TerritoryCode</DataMember>
				<lookupMode>1</lookupMode>
				<Column>1</Column>
			</lookupTerritoryCode>
			<lblGroupBy>
				<Text>
					<Vietnamese>Nhóm theo</Vietnamese>
					<English>Group</English>
					<Chinese>组</Chinese>
					<Japanese>グループ</Japanese>
					<Korean>그룹.</Korean>
				</Text>
				<Row />
				<Column>0</Column>
			</lblGroupBy>
			<lookupGroupBy>
				<ClassName>BravoLookupBox</ClassName>
				<LookupKey>Class</LookupKey>
				<FilterKey>ParentCode='REP04_PT_BH'</FilterKey>
				<DataMember>GroupBy</DataMember>
				<Column>1</Column>
			</lookupGroupBy>
			<lblType>
				<Text>
					<Vietnamese>Chi tiết</Vietnamese>
					<English>Detail</English>
					<Chinese>细节</Chinese>
					<Japanese>詳細</Japanese>
					<Korean>가까이서 보세요.</Korean>
				</Text>
				<Row />
				<Column>0</Column>
			</lblType>
			<lookupType>
				<ClassName>BravoLookupBox</ClassName>
				<LookupKey>Class</LookupKey>
				<FilterKey>ParentCode='REP04_PT_BH'</FilterKey>
				<DataMember>Type</DataMember>
				<Column>1</Column>
			</lookupType>
			<lblForeignCurrencyOnly>
				<Text>
					<Vietnamese>Ngoại tệ</Vietnamese>
					<English>Foreign currency</English>
					<Chinese>外币</Chinese>
					<Japanese>外貨</Japanese>
					<Korean>외화.</Korean>
				</Text>
				<Row />
				<Column>0</Column>
			</lblForeignCurrencyOnly>
			<chkForeignCurrencyOnly>
				<ClassName>BravoCheckBox</ClassName>
				<DataMember>ForeignCurrencyOnly</DataMember>
				<Column>1</Column>
			</chkForeignCurrencyOnly>
		</Controls>
	</panelParameters>
	<panelReporter>
		<Controls>
			<Report_0>
				<Title>
					<Rows>
						<Row_0>
							<Height>26</Height>
						</Row_0>
						<Row_1>
							<Height>21</Height>
						</Row_1>
						<Row_2>
							<Height>21</Height>
						</Row_2>
						<Row_3>
							<Height>22</Height>
						</Row_3>
						<Row_4>
							<Height>21</Height>
						</Row_4>
						<Row_5>
							<Height>21</Height>
						</Row_5>
						<Row_6>
							<Height>21</Height>
						</Row_6>
						<Row_7>
							<Height>22</Height>
						</Row_7>
						<Row_8>
							<Height>21</Height>
						</Row_8>
						<Row_9>
							<Height>22</Height>
						</Row_9>
						<Row_10>
							<Height>21</Height>
						</Row_10>
						<Row_11>
							<Height>21</Height>
						</Row_11>
						<Row_12>
							<Height>21</Height>
						</Row_12>
						<Row_13>
							<Height>12</Height>
						</Row_13>
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
								<Row_2>
									<Text>
										<Vietnamese>Kho: {=TEXT('@_WarehouseId')}</Vietnamese>
										<English>Warehouse: {=TEXT('@_WarehouseId')}</English>
										<Chinese>仓库： {=TEXT('@_WarehouseId')}</Chinese>
										<Japanese>倉庫： {=TEXT('@_WarehouseId')}</Japanese>
										<Korean>창고 : {=TEXT('@_WarehouseId')}</Korean>
									</Text>
									<Style>Font:,,style=Bold;TextAlign:CenterCenter;</Style>
								</Row_2>
								<Row_3>
									<Text>
										<Vietnamese>Chủ sở hữu kho: {=TEXT('@_WarehouseOwnerCode')}</Vietnamese>
										<English>Warehouse owner: {=TEXT('@_WarehouseOwnerCode')}</English>
										<Japanese>倉庫の所有者： {=TEXT('@_WarehouseOwnerCode')}</Japanese>
										<Chinese>仓库主人： {=TEXT('@_WarehouseOwnerCode')}</Chinese>
										<Korean>창고 주인 : {=TEXT('@_WarehouseOwnerCode')}</Korean>
									</Text>
									<Style>Font:,,style=Bold;TextAlign:CenterTop;</Style>
								</Row_3>
								<Row_4>
									<Text>
										<Vietnamese>Bộ phận: {=TEXT('@_DeptId')}</Vietnamese>
										<English>Department: {=TEXT('@_DeptId')}</English>
										<Chinese>部门： {=TEXT('@_DeptId')}</Chinese>
										<Japanese>部門： {=TEXT('@_DeptId')}</Japanese>
										<Korean>부서:{=TEXT('@_DeptId')}.</Korean>
									</Text>
									<Style>Font:,,style=Bold;TextAlign:CenterCenter;</Style>
								</Row_4>
								<Row_5>
									<Text>
										<Vietnamese>Nhân viên bán hàng: {=TEXT('@_EmployeeId')}</Vietnamese>
										<English>Salespeople: {=TEXT('@_EmployeeId')}</English>
										<Chinese>销售人员： {=TEXT('@_EmployeeId')}</Chinese>
										<Japanese>営業担当者： {=TEXT('@_EmployeeId')}</Japanese>
										<Korean>영업 사원 : {=TEXT('@_EmployeeId')}</Korean>
									</Text>
									<Style>Font:,,style=Bold;TextAlign:CenterCenter;</Style>
								</Row_5>
								<Row_6>
									<Text>
										<Vietnamese>Mã vật tư: {=TEXT('@_ItemId')}</Vietnamese>
										<English>Item: {=TEXT('@_ItemId')}</English>
										<Chinese>货号： {=TEXT('@_ItemId')}</Chinese>
										<Japanese>アイテム： {=TEXT('@_ItemId')}</Japanese>
										<Korean>품목 : {=TEXT('@_ItemId')}</Korean>
									</Text>
									<Style>Font:,,style=Bold;TextAlign:CenterCenter;</Style>
								</Row_6>
								<Row_7>
									<Text>
										<Vietnamese>Phân loại vật tư: {=TEXT('@_ItemClassCode')}</Vietnamese>
										<English>Classification of items : {=TEXT('@_ItemClassCode')}</English>
										<Japanese>項目の分類： {=TEXT('@_ItemClassCode')}</Japanese>
										<Chinese>项目分类： {=TEXT('@_ItemClassCode')}</Chinese>
										<Korean>항목 의 분류 : {=TEXT('@_ItemClassCode')}</Korean>
									</Text>
									<Style>Font:,,style=Bold;TextAlign:CenterTop;</Style>
								</Row_7>
								<Row_8>
									<Text>
										<Vietnamese>Khách hàng: {=TEXT('@_CustomerId')}</Vietnamese>
										<English>Customer: {=TEXT('@_CustomerId')}</English>
										<Chinese>客户： {=TEXT('@_CustomerId')}</Chinese>
										<Japanese>顧客： {=TEXT('@_CustomerId')}</Japanese>
										<Korean>고객:{=TEXT('@_CustomerId')}.</Korean>
									</Text>
									<Style>Font:,,style=Bold;TextAlign:CenterCenter;</Style>
								</Row_8>
								<Row_9>
									<Text>
										<Vietnamese>Phân loại khách hàng: {=TEXT('@_CustomerClassCode')}</Vietnamese>
										<English>Customer classification : {=TEXT('@_CustomerClassCode')}</English>
										<Japanese>顧客の分類： {=TEXT('@_CustomerClassCode')}</Japanese>
										<Chinese>客户分类： {=TEXT('@_CustomerClassCode')}</Chinese>
										<Korean>고객 구분 : {=TEXT('@_CustomerClassCode')}</Korean>
									</Text>
									<Style>Font:,,style=Bold;TextAlign:CenterTop;</Style>
								</Row_9>
								<Row_10>
									<Text>
										<Vietnamese>Mã giao dịch: {=TEXT('@_TransCode')}</Vietnamese>
										<English>Transaction type: {=TEXT('@_TransCode')}</English>
										<Chinese>交易类型： {=TEXT('@_TransCode')}</Chinese>
										<Japanese>トランザクション·タイプ： {=TEXT('@_TransCode')}</Japanese>
										<Korean>거래 유형:{=TEXT('@_TransCode')}.</Korean>
									</Text>
									<Style>Font:,,style=Bold;TextAlign:CenterCenter;</Style>
								</Row_10>
								<Row_11>
									<Text>
										<Vietnamese>Vùng tiêu thụ: {=TEXT('@_TerritoryCode')}</Vietnamese>
										<English>Trade area: {=TEXT('@_TerritoryCode')}</English>
										<Chinese>贸易地区： {=TEXT('@_TerritoryCode')}</Chinese>
										<Japanese>貿易地域： {=TEXT('@_TerritoryCode')}</Japanese>
										<Korean>무역 지역:{=TEXT('@_TerritoryCode')}.</Korean>
									</Text>
									<Style>Font:,,style=Bold;TextAlign:CenterCenter;</Style>
								</Row_11>
								<Row_12>
									<Text>
										<Vietnamese>Mã vụ việc: {=TEXT('@_JobCode')}</Vietnamese>
										<English>Job code: {=TEXT('@_JobCode')}</English>
										<Japanese>ジョブコード： {=TEXT('@_JobCode')}</Japanese>
										<Chinese>工作代码： {=TEXT('@_JobCode')}</Chinese>
										<Korean>직업 코드:{=TEXT('@_JobCode')}.</Korean>
									</Text>
									<Style>Font:,,style=Bold;TextAlign:CenterCenter;</Style>
								</Row_12>
							</Rows>
						</Column_0>
					</Cols>
				</Title>
				<Content>
					<Rows>
						<Row_0>
							<Height>22</Height>
						</Row_0>
						<Row_1>
							<Height>28</Height>
						</Row_1>
					</Rows>
					<Cols>
						<GroupCode>
							<Width>90</Width>
							<Rows>
								<Row_0>
									<Text>
										<Vietnamese>Mã số</Vietnamese>
										<English>Code</English>
										<Chinese>码</Chinese>
										<Japanese>コード</Japanese>
										<Korean>법전입니다.</Korean>
									</Text>
									<Style>UserData:fxqkkgrz;</Style>
								</Row_0>
								<Row_1>
									<Style>UserData:fxqkkgrz;</Style>
								</Row_1>
							</Rows>
							<Style>TextAlign:LeftTop;</Style>
						</GroupCode>
						<GroupName>
							<Width>174</Width>
							<Rows>
								<Row_0>
									<Text>
										<English>Items name</English>
										<Vietnamese>Chỉ tiêu</Vietnamese>
										<Chinese>项目名称</Chinese>
										<Japanese>項目名</Japanese>
										<Korean>항목 이름입니다.</Korean>
									</Text>
									<Style>UserData:inixepv1;</Style>
								</Row_0>
								<Row_1>
									<Style>UserData:inixepv1;</Style>
								</Row_1>
							</Rows>
							<Style>TextAlign:LeftTop;WordWrap:True;</Style>
						</GroupName>
						<Unit>
							<Width>40</Width>
							<Rows>
								<Row_0>
									<Text>
										<Vietnamese>Đvt</Vietnamese>
										<English>Unit</English>
										<Chinese>单位</Chinese>
										<Japanese>ユニット</Japanese>
										<Korean>단위</Korean>
									</Text>
									<Style>UserData:sott25dv;</Style>
								</Row_0>
								<Row_1>
									<Style>UserData:sott25dv;</Style>
								</Row_1>
							</Rows>
							<Style>TextAlign:LeftTop;</Style>
						</Unit>
						<Quantity>
							<Width>86</Width>
							<Rows>
								<Row_0>
									<Text>
										<Vietnamese>Số lượng</Vietnamese>
										<English>Quantity</English>
										<Chinese>数量</Chinese>
										<Japanese>数量</Japanese>
										<Korean>양이냐.</Korean>
									</Text>
									<Style>UserData:ckg1kqdu;</Style>
								</Row_0>
								<Row_1>
									<Style>UserData:ckg1kqdu;</Style>
								</Row_1>
							</Rows>
							<Style>TextAlign:RightTop;Format:"Q";</Style>
							<Editor>
								<ClassName>BravoQuantityInputBox</ClassName>
							</Editor>
						</Quantity>
						<Amount2>
							<Width>100</Width>
							<Rows>
								<Row_0>
									<Text>
										<Vietnamese>Doanh số
(chưa thuế)</Vietnamese>
										<English>Sales without VAT</English>
										<Chinese>不含增值税销售</Chinese>
										<Japanese>付加価値税なしで販売</Japanese>
										<Korean>부가 가치세 없이 판매.</Korean>
									</Text>
									<Style>UserData:tftob45m;</Style>
								</Row_0>
								<Row_1>
									<Style>UserData:tftob45m;</Style>
								</Row_1>
							</Rows>
							<Style>TextAlign:RightTop;Format:"C";</Style>
						</Amount2>
						<TotalAmount>
							<Width>100</Width>
							<Rows>
								<Row_0>
									<Text>
										<Vietnamese>Tiền thanh toán</Vietnamese>
										<English>Sales</English>
										<Chinese>销售</Chinese>
										<Japanese>販売の</Japanese>
										<Korean>판매.</Korean>
									</Text>
									<Style>UserData:u0cogbmo;</Style>
								</Row_0>
								<Row_1>
									<Text>
										<Vietnamese>Tổng cộng</Vietnamese>
										<English>Total</English>
										<Chinese>总</Chinese>
										<Japanese>合計</Japanese>
										<Korean>합계</Korean>
									</Text>
								</Row_1>
							</Rows>
							<Style>TextAlign:RightTop;Format:"C";</Style>
						</TotalAmount>
						<Amount111>
							<Width>100</Width>
							<Rows>
								<Row_0>
									<Style>UserData:u0cogbmo;</Style>
								</Row_0>
								<Row_1>
									<Text>
										<Vietnamese>Thu tiền ngay</Vietnamese>
										<English>Cash sales</English>
										<Chinese>现金销售</Chinese>
										<Japanese>現金販売</Japanese>
										<Korean>현금 판매.</Korean>
									</Text>
								</Row_1>
							</Rows>
							<Style>TextAlign:RightTop;Format:"C";</Style>
						</Amount111>
						<Amount131>
							<Width>100</Width>
							<Rows>
								<Row_0>
									<Style>UserData:u0cogbmo;</Style>
								</Row_0>
								<Row_1>
									<Text>
										<Vietnamese>Công nợ</Vietnamese>
										<English>Receivable</English>
										<Chinese>应收账款</Chinese>
										<Japanese>債権</Japanese>
										<Korean>매출 채권.</Korean>
									</Text>
								</Row_1>
							</Rows>
							<Style>TextAlign:RightTop;Format:"C";</Style>
						</Amount131>
						<Profit>
							<Width>95</Width>
							<Rows>
								<Row_0>
									<Text>
										<Vietnamese>Lãi gộp
(Doanh số - tiền vốn)</Vietnamese>
										<English>Net profit
(Sales - Cost price)</English>
										<Chinese>纯利
（销售收入 - 成本价）</Chinese>
										<Japanese>純利益
（売上 - 原価）</Japanese>
										<Korean>순익.
(매출-비용 가격).</Korean>
									</Text>
									<Style>UserData:m314ska0;</Style>
								</Row_0>
								<Row_1>
									<Style>UserData:m314ska0;</Style>
								</Row_1>
							</Rows>
							<Style>TextAlign:RightTop;Format:"C";</Style>
						</Profit>
						<DiscountAmount>
							<Width>96</Width>
							<Rows>
								<Row_0>
									<Text>
										<Vietnamese>Chiết khấu</Vietnamese>
										<English>Discount</English>
										<Chinese>折扣</Chinese>
										<Japanese>割引</Japanese>
										<Korean>할인.</Korean>
									</Text>
									<Style>UserData:kve4yezl;</Style>
								</Row_0>
								<Row_1>
									<Style>UserData:kve4yezl;</Style>
								</Row_1>
							</Rows>
							<Style>TextAlign:RightTop;Format:"C";</Style>
						</DiscountAmount>
						<SubTotalName>
							<Width>97</Width>
							<Rows>
								<Row_0>
									<Text>
										<Vietnamese>SubTotalName</Vietnamese>
										<English>SubTotalName</English>
										<Japanese>SubTotalName</Japanese>
										<Chinese>SubTotalName</Chinese>
										<Korean>SubTotalName</Korean>
									</Text>
								</Row_0>
							</Rows>
							<Style>TextAlign:LeftTop;</Style>
							<Visible>False</Visible>
						</SubTotalName>
						<OriginalAmount2>
							<Width>96</Width>
							<Rows>
								<Row_0>
									<Text>
										<Vietnamese>Doanh số NT (chưa thuế)</Vietnamese>
										<English>FC Sales without VAT</English>
										<Chinese>外币销售（不含增值税）</Chinese>
										<Japanese>付加価値税（VAT）なしの外国通貨建て売上高</Japanese>
										<Korean>VAT 없이 외화 판매</Korean>
									</Text>
									<Style>UserData:4ezpeemv;</Style>
								</Row_0>
								<Row_1>
									<Style>UserData:4ezpeemv;</Style>
								</Row_1>
							</Rows>
							<Style>TextAlign:RightTop;</Style>
						</OriginalAmount2>
						<OriginalTotalAmount>
							<Width>97</Width>
							<Rows>
								<Row_0>
									<Text>
										<Vietnamese>Tiền thanh toán NT</Vietnamese>
										<English>FC Sales</English>
										<Chinese>外币销售</Chinese>
										<Japanese>外国通貨建て売上高</Japanese>
										<Korean>외화 판매</Korean>
									</Text>
									<Style>UserData:lsejaeky;</Style>
								</Row_0>
								<Row_1>
									<Text>
										<Vietnamese>Tổng cộng</Vietnamese>
										<English>Total</English>
										<Chinese>总</Chinese>
										<Japanese>合計</Japanese>
										<Korean>합계</Korean>
									</Text>
								</Row_1>
							</Rows>
							<Style>TextAlign:RightTop;</Style>
						</OriginalTotalAmount>
						<OriginalAmount111>
							<Width>97</Width>
							<Rows>
								<Row_0>
									<Style>UserData:lsejaeky;</Style>
								</Row_0>
								<Row_1>
									<Text>
										<Vietnamese>Thu tiền ngay</Vietnamese>
										<English>FC Cash sales</English>
										<Chinese>外币现金销售</Chinese>
										<Japanese>外貨現金販売</Japanese>
										<Korean>외화 현금 판매</Korean>
									</Text>
								</Row_1>
							</Rows>
							<Style>TextAlign:RightTop;</Style>
						</OriginalAmount111>
						<OriginalAmount131>
							<Width>97</Width>
							<Rows>
								<Row_0>
									<Style>UserData:lsejaeky;</Style>
								</Row_0>
								<Row_1>
									<Text>
										<Vietnamese>Công nợ</Vietnamese>
										<English>FC Receivable</English>
										<Chinese>外币应收账款</Chinese>
										<Japanese>外貨債権</Japanese>
										<Korean>외화 채권</Korean>
									</Text>
								</Row_1>
							</Rows>
							<Style>TextAlign:RightTop;</Style>
						</OriginalAmount131>
						<OriginalProfit>
							<Width>97</Width>
							<Rows>
								<Row_0>
									<Text>
										<Vietnamese>Lãi gộp NT 
(Doanh số - tiền vốn)</Vietnamese>
										<English>FC Net profit
(Sales - Cost price)</English>
										<Chinese>外币净利润
（销售收入 - 成本价）</Chinese>
										<Japanese>外貨純利益
（売上 - 原価）</Japanese>
										<Korean>외환 순이익
( 매출액 - 원가 )</Korean>
									</Text>
									<Style>UserData:xyqxtldg;</Style>
								</Row_0>
								<Row_1>
									<Style>UserData:xyqxtldg;</Style>
								</Row_1>
							</Rows>
							<Style>TextAlign:RightTop;</Style>
						</OriginalProfit>
						<OriginalDiscountAmount>
							<Width>97</Width>
							<Rows>
								<Row_0>
									<Text>
										<Vietnamese>Chiết khấu NT</Vietnamese>
										<English>FC Discount</English>
										<Chinese>外币优惠</Chinese>
										<Japanese>外貨割引</Japanese>
										<Korean>외화 할인</Korean>
									</Text>
									<Style>UserData:u4msttwe;</Style>
								</Row_0>
								<Row_1>
									<Style>UserData:u4msttwe;</Style>
								</Row_1>
							</Rows>
							<Style>TextAlign:RightTop;</Style>
						</OriginalDiscountAmount>
					</Cols>
					<zTreeColName>GroupName</zTreeColName>
					<bAllowGrandTotal>True</bAllowGrandTotal>
					<SumColumns>
						<Amount2 />
						<TotalAmount />
						<Amount111 />
						<Amount131 />
						<Profit />
						<DiscountAmount />
						<OriginalAmount2 />
						<OriginalTotalAmount />
						<OriginalAmount111 />
						<OriginalAmount131 />
						<OriginalProfit />
						<OriginalDiscountAmount />
					</SumColumns>
				</Content>
				<Summary>
					<Rows>
						<Row_0>
							<Height>27</Height>
						</Row_0>
						<Row_1>
							<Height>19</Height>
						</Row_1>
						<Row_2>
							<Height>29</Height>
						</Row_2>
					</Rows>
					<Cols>
						<Column_0>
							<Width>300</Width>
							<Rows>
								<Row_1>
									<Text>
										<Vietnamese>Người lập</Vietnamese>
										<English>Prepared by</English>
										<Chinese>编制</Chinese>
										<Japanese>により作製</Japanese>
										<Korean>마련한 이 분향소.</Korean>
									</Text>
									<Style>Font:,,style=Bold;TextAlign:CenterTop;</Style>
								</Row_1>
								<Row_2>
									<Text>
										<Vietnamese>(Ký, họ tên)</Vietnamese>
										<English>(Sign, fullname)</English>
										<Japanese>（サイン、フルネーム）</Japanese>
										<Chinese>（登录，全名）</Chinese>
										<Korean>( 서명, 전체 이름 )</Korean>
									</Text>
									<Style>Font:,,style=Italic;TextAlign:CenterTop;</Style>
								</Row_2>
							</Rows>
						</Column_0>
						<Column_1>
							<Width>-1</Width>
							<Rows>
								<Row_2>
									<Text>
										<Vietnamese />
									</Text>
								</Row_2>
							</Rows>
						</Column_1>
						<Column_2>
							<Width>300</Width>
							<Rows>
								<Row_0>
									<Text>
										<Vietnamese>Ngày . . . . . tháng . . . . . năm . . . . . . . </Vietnamese>
										<English>Day . . . . . month . . . . . year . . . . . . . </English>
										<Chinese>日。 。 。 。 。一个月。 。 。 。 。年。 。 。 。 。 。 。</Chinese>
										<Japanese>一日。 。 。 。 。今月。 。 。 。 。年。 。 。 。 。 。 。</Japanese>
										<Korean>날. . . . . 시기. . . . . 해이다. . . . . . . </Korean>
									</Text>
									<Style>Font:,,style=Italic;TextAlign:CenterBottom;</Style>
								</Row_0>
								<Row_1>
									<Text>
										<Vietnamese>Kế toán trưởng</Vietnamese>
										<English>Chief accountant</English>
										<Chinese>总会计师</Chinese>
										<Japanese>会計主任</Japanese>
										<Korean>최고 회계원입니다.</Korean>
									</Text>
									<Style>Font:,,style=Bold;TextAlign:CenterTop;</Style>
								</Row_1>
								<Row_2>
									<Text>
										<Vietnamese>(Ký, họ tên)</Vietnamese>
										<English>(Sign, fullname)</English>
										<Chinese>（登录，全名）</Chinese>
										<Japanese>（サイン、フルネーム）</Japanese>
										<Korean>( 서명, 전체 이름 )</Korean>
									</Text>
									<Style>Font:,,style=Italic;TextAlign:CenterTop;</Style>
								</Row_2>
							</Rows>
						</Column_2>
					</Cols>
				</Summary>
				<PrintSettings>
					<PaperSize>
						<PaperName>A4</PaperName>
						<Width>827</Width>
						<Height>1169</Height>
						<RawKind>9</RawKind>
					</PaperSize>
					<Landscape>True</Landscape>
					<Margins>
						<Bottom>59</Bottom>
						<Left>59</Left>
						<Right>39</Right>
						<Top>59</Top>
					</Margins>
				</PrintSettings>
				<ReportSetup>
					<printExtraWidth>Content</printExtraWidth>
				</ReportSetup>
			</Report_0>
		</Controls>
	</panelReporter>
	<bDisplayError>True</bDisplayError>
</root>
        `
    };

    ngOnInit(): void {}
}
