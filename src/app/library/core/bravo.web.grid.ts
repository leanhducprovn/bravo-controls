import {
	Component,
	forwardRef,
	Inject,
	ElementRef,
	Injector,
	SkipSelf,
	Optional,
	ChangeDetectorRef,
	Input
} from '@angular/core';
import { WjFlexGrid, wjFlexGridMeta } from '@grapecity/wijmo.angular2.grid';
import { CellEditEndingEventArgs, GridPanel, _NewRowTemplate } from '@grapecity/wijmo.grid';
import { Subject, Subscription } from 'rxjs';
import * as wjc from '@grapecity/wijmo';
import * as wjg from '@grapecity/wijmo.grid';
import * as wjChart from '@grapecity/wijmo.chart';
import {
	AggregateEnum,
	SortOrder,
	Dictionary,
	ExtensionsMethod,
	WebDataTable,
	BravoCore,
	Image,
	WebDataRow,
	BravoDataTypeConverter,
	// BravoExpressionEvaluator,
	// INVALID_VALUE,
	TypeCode,
	MouseButtons,
	asEnum,
	StringBuilder,
	BravoClientSettings,
	WebDataColumn,
	// Enum,
	DataRowState,
	// ParameterValueEventArgs,
	BravoFileTypeDetector,
	FileTypeEnum,
	Padding,
	Convert,
	DefaultPadding,
	TimeSpan,
	DateTime,
	OperatorEnum,
	Timer,
	DisplayEnum,
	isMobile,
	sanitizeHtml,
	compareStrings
	// formatBytes,
	// setCurrentEditItem
} from 'src/app/core/lib/core';
// import { Resources } from '../resources/message.resources';
import {
	CellStyleEnum,
	GridAutoTextContentEnum,
	GridDataCellEnum,
	GridAutoFitRowHeightEnum,
	RowHeaderNumberingEnum,
	ScrollBars,
	StyleElementFlags,
	GridCellTypeEnum,
	GridCountGroupChildEnum,
	GridBuiltInContextMenuEnum,
	SubtotalPositionEnum,
	RestrictedColumnEnum,
	GridBorderStyle,
	SortFlags,
	TextDirectionEnum,
	ImageAlignEnum,
	StyleTextImageAlign,
	AnchorStyles,
	DockStyle,
	ShowAddNewRowEnum,
	GridModeEnum,
	TimeScaleEnum,
	GanttBarColorTypeEnum,
	AutoMinMaxTimeEnum,
	GanttGroupTypeEnum,
	ShowExcludedTimeEnum,
	TimeMarkingEnum,
	AllowEditingMultiCellEnum,
	StringSplitOptions,
	LookupModeEnum,
	CharacterCasing,
	CodeType,
	ContentAlignment,
	BorderStyle
} from '../../types/enums';

// import { BravoNumericScale, NumericScaleUnitEnum } from '../bravo.numeric.scale';
// import { BravoContextMenu } from './bravo.web.contextMenu';
// import { Font } from '../font';
// import { ToolStrip } from '../toolstrip/toolstrip';
// import { Spliter, ItemDropDownEventArgs } from './dropdown';
// import { DropDownToolStrip } from '../toolstrip/dropdown.toolstrip';
// import { BravoResourceManager } from '../bravo.resource.manager';
// import { BravoSettings } from '../bravo.settings';
// import { GridCellInfo } from '../dto/grid.cell.info';
import {
	getCellType,
	pxToPt,
	buildHashName,
	isIgnored,
	fontSizeToPxConvert,
	indexOfRule,
	BravoWebGridRender,
	isCellInValid,
	isCellValid,
	isRowInValid,
	setIgnored,
	findForm,
	BravoDataMap,
	toAggregateWijmo,
	BravoUIExtension
} from '../bravo.ui.extensions';
import { BravoProgressBarControl } from './bravo.progressbar.control';
import { BravoPictureBoxControl } from './bravo.picture.box.control';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { HighlightColumnEventArgs } from '../eventArgs/highlight.column.event.args';
import { BravoGraphicsRenderer } from '../graphics/bravo.graphics.renderer';
import { BravoGlobalize } from 'src/app/core/bravo.globalize';
import { DataRowStateEventArgs } from '../eventArgs/datarowstate.event.args';
import { UnboundValueEventArgs } from '../eventArgs/unbound.value.event.args';
import { BravoBindingSource } from '../components/bravo.binding.source';
import { BravoButton } from './bravo.button';
import * as clrFormat from 'clr-format';
import { BravoCustomColorTheme } from './bravo.chart/bravo.chart.extension';
import { BravoForm } from '../bravo.form';
import { RowColEventArgs } from '../eventArgs/row.col.event.args';
import { CustomToolTipEventArgs } from '../eventArgs/custom.tooltip.event.args';
import {
	IBravoControlBase,
	IBravoDocInputBox,
	IBravoPictureInputBox
} from '../interface/interfaces';
import { WebDataView } from 'src/app/core/data/bravo.web.dataview';
import { BravoNumericInputBox } from './bravo.numeric.input.box';
import { BravoDateBox } from './bravo.date.box';
import { BravoTextBox } from './bravo.text.box/bravo.text.box';
import { BravoComboBox } from './bravo.combobox/bravo.combobox';
import { BravoBarCodeBox } from './bravo.bar.code.box';
import { BeforeMouseDownEventArgs } from '../eventArgs/before.mouse.down.event.args';
import { BravoLabel } from './bravo.label/bravo.label';
import { ValidateEditEventArgs } from '../eventArgs/validate.edit.event.args';
import { CommandStrings } from 'src/app/global.command.strings';

const NoDisplayPermissionContent: string = '●●●';
const COLUMN_NAME_PATTERN_FORMAT = '(?:\\b){0}(?:\\b)';
const DESC_SORT_COLUMN_NAME_PATTERN_FORMAT = '(?:\\b){0}\\s+DESC(?:\\b)';

export const GridMergeStyleElement = 'Merge';
const GridStyleElementPatternFormat = '(?:\\b)(?<name>{0})(?:\\s*):(?:\\s*)(?<value>[^;]*);';
const GridStyleElementPatternFormatFireFox = '(?:\\b)({0})(?:\\s*):(?:\\s*)([^;]*);';
const CellPadding = 1;
const DefaultDataViewSortExprFormat = '{0}';

export const ColHeadersStyleName = 'wj-colheaders';
export const RowolHeadersStyleName = 'wj-rowheaders';
export const CellsStyleName = 'wj-cells';
export const MultiSelectedStyleName = 'wj-state-multi-selected';
export const StateSelectedStyleName = 'wj-state-selected';
export const StateFocusStyleName = 'wj-state-focus';
export const CustomFocusStyleName = 'bravo-focused';
export const CellRtfStyleName = 'cell-rtf';
export const HeaderStyleName = 'wj-header';
export const GroupInColumnStyle = 'bravo-group-in-column';

export const GanttBarStyle = 'GanttBarStyle';
export const GanttTimeScaleStyle = 'GanttTimeScaleStyle';
export const GanttGroupTimeScaleStyle = 'GanttGroupTimeScaleStyle';
export const WeekendStyle = 'WeekendStyle';
export const SpecialDayStyle = 'SpecialDayStyle';
export const MarkingStyle = 'MarkingStyle';

export const NullStyleName = 'NullStyle';

@Component({
	selector: 'bravo-web-grid',
	styleUrls: ['./bravo.web.grid.css'],
	template: '',
	providers: [
		{ provide: 'WjComponent', useExisting: forwardRef(() => BravoWebGrid) },
		...wjFlexGridMeta.providers
	]
})
export class BravoWebGrid extends WjFlexGrid implements IBravoControlBase {
	public static readonly BRC_PREFIX_CLASS = 'bravo-';
	public static readonly AllColumnValue: string = '*';
	public static readonly TreeSeparate: string = ',';

	public static readonly DataTypeSource = 'dataTypeSrc';

	public static bComboBoxStartEditFlag: boolean = null;

	public static UserDataProp = 'UserData';
	public static StyleProp: string = 'Style';
	public static GridColumEditorProp = '_GridColumnEditor';

	protected static CollapseMenuItem = 'CollapseMenuItem';
	protected static ExpandMenuItem = 'ExpandMenuItem';
	protected static AddRowColMenuItem = 'AddRowColMenuItem';
	protected static DeleteRowColMenuItem = 'DeleteRowColMenuItem';
	protected static InsertRowColMenuItem = 'InsertRowColMenuItem';
	protected static GroupColumnMenuItem = 'GroupColumnMenuItem';
	protected static SumColumnMenuItem = 'SumColumnMenuItem';
	protected static GrandTotalMenuItem = 'GrandTotalMenuItem';
	protected static HideGrandTotalMenuItem = 'HideGrandTotalMenuItem';
	protected static TopGrandTotalMenuItem = 'TopGrandTotalMenuItem';
	protected static BottomGrandTotalMenuItem = 'BottomGrandTotalMenuItem';
	protected static CombinedGroupColumnMenuItem = 'CombinedGroupColumnMenuItem';
	protected static ClearGroupColumnMenuItem = 'ClearGroupColumnMenuItem';
	protected static SortAscendingMenuItem = 'SortAscendingMenuItem';
	protected static SortDescendingMenuItem = 'SortDescendingMenuItem';
	protected static CombineSortColumnMenuItem = 'CombineSortColumnMenuItem';
	protected static ClearSortColumnMenuItem = 'ClearSortColumnMenuItem';
	protected static FitSizeMenuItem = 'FitSizeMenuItem';
	protected static DefaultSizeMenuItem = 'DefaultSizeMenuItem';
	protected static FreezeMenuItem = 'FreezeMenuItem';
	protected static GroupInColumnSettingMenuItem = 'GroupInColumnSettingMenuItem';
	protected static DataTreeMenuItem = 'DataTreeMenuItem';

	private _nContextCol = -1;
	private _nContextRow = -1;
	private _nLstSort = -1;
	protected _bAllowSortingBase = true;
	private _lastStartEditResult: any;

	private _ignoreDiacritics: boolean = false;

	public get ignoreDiacritics(): boolean {
		return this._ignoreDiacritics;
	}

	public set ignoreDiacritics(value: boolean) {
		this._ignoreDiacritics = value;
	}

	private _lastScrollYSize: number = 0;

	public get lastScrollYSize(): number {
		return this._lastScrollYSize;
	}

	public set lastScrollYSize(value: number) {
		if (this._lastScrollYSize == value) return;

		this._lastScrollYSize = value;
	}

	//#region static method

	public static isCurrentGridEditor(pControl: IBravoControlBase, pbIgnoreChildControl: boolean) {
		if (pControl == null) return;

		let _grid: wjg.FlexGrid;

		let _p = pControl.parent;
		while (_p && _grid == null) {
			_grid = _p instanceof wjg.FlexGrid ? _p : null;
			_p = _p.parent;
		}

		if (_grid == null || _grid.isReadOnly) return;

		return _grid;
	}

	public static getCellType(style: CellStyle): GridCellTypeEnum {
		if (style == null) return GridCellTypeEnum.Normal;

		let _dt = style['DataType'];
		if (_dt == 'System.Boolean') return GridCellTypeEnum.Check;

		if (String.isNullOrEmpty(style['Format'])) return GridCellTypeEnum.Normal;

		let _zFormat = style['Format'];

		if (String.compare(_zFormat, GridCellTypeEnum[GridCellTypeEnum.img]) == 0)
			return GridCellTypeEnum.img;

		if (String.compare(_zFormat, GridCellTypeEnum[GridCellTypeEnum.rtf]) == 0)
			return GridCellTypeEnum.rtf;

		if (String.compare(_zFormat, GridCellTypeEnum[GridCellTypeEnum.html]) == 0)
			return GridCellTypeEnum.html;

		if (_zFormat.startsWith(GridCellTypeEnum[GridCellTypeEnum.barcode]))
			return GridCellTypeEnum.barcode;

		if (_zFormat.startsWith(GridCellTypeEnum[GridCellTypeEnum.qrcode]))
			return GridCellTypeEnum.qrcode;

		if (_zFormat.startsWith(GridCellTypeEnum[GridCellTypeEnum.progress]))
			return GridCellTypeEnum.progress;

		if (_zFormat.startsWith(GridCellTypeEnum[GridCellTypeEnum.link]))
			return GridCellTypeEnum.link;

		return GridCellTypeEnum.Normal;
	}

	public static getCellRangeStyle(
		pPanel: GridPanel,
		pnTopRow: number,
		pnLeftCol: number,
		pnBottomRow: number,
		pnRightCol: number
	) {
		if (pnTopRow > pnBottomRow || pnLeftCol > pnRightCol) return;

		if (pnTopRow == pnBottomRow && pnLeftCol == pnRightCol)
			return BravoWebGrid.getCellStyle(pPanel, pnTopRow, pnLeftCol, false);

		let _cs = new CellStyle();
		for (let _nRow = pnTopRow; _nRow <= pnBottomRow; _nRow++) {
			for (let _nCol = pnLeftCol; _nCol <= pnRightCol; _nCol++) {
				let _col = pPanel.columns[_nCol],
					_row = pPanel.columns[_nRow];

				if (_nRow == pnTopRow) _cs.mergeWith(_col[BravoWebGrid.StyleProp]);

				if (_row && _row[BravoWebGrid.StyleProp]) {
					let _zStyle = _row[BravoWebGrid.StyleProp][_col.binding];
					let _cs1 = CellStyle.parseString(_zStyle);
					_cs.mergeWith(_cs1);
				}
			}
		}

		return _cs;
	}

	public static getCellStyle(
		pPanel: GridPanel,
		pnRow: number,
		pnCol: number,
		pbSingleCell: boolean = true
	): CellStyle {
		if (!isCellValid(pPanel, pnRow, pnCol)) return new CellStyle();

		let _grid = <BravoWebGrid>pPanel.grid,
			_row: wjg.Row = pPanel.rows[pnRow],
			_col: wjg.Column = pPanel.columns[pnCol],
			_cs = new CellStyle();

		if (!pbSingleCell) {
			switch (pPanel.cellType) {
				case wjg.CellType.ColumnHeader:
					_cs.mergeWith(_grid.styles.get(CellStyleEnum.Fixed));
					break;
				case wjg.CellType.Cell:
					_cs.mergeWith(_grid.styles.get(CellStyleEnum.Normal));

					if (_row instanceof wjg.GroupRow) {
						let _cellStyleKey = String.format('Subtotal{0}', _row.level);
						_cs.mergeWith(_grid.styles.get(CellStyleEnum[_cellStyleKey]));
					}

					break;
			}

			if (pPanel.cellType == wjg.CellType.Cell) {
				if (_col && _col[BravoWebGrid.StyleProp]) {
					let _cs0 = _col[BravoWebGrid.StyleProp];
					_cs.mergeWith(_cs0);
				}
			}
		}

		let _binding = pPanel.columns[pnCol].binding;

		if (_row && _row[BravoWebGrid.StyleProp]) {
			let _zStyle: string = _row[BravoWebGrid.StyleProp][_binding],
				_cs1 = CellStyle.parseString(_zStyle);

			_cs.mergeWith(_cs1);
		}

		return _cs;
	}

	public static resetRowColDefaultSize(
		grid: BravoWebGrid,
		pnHeightPadding: number = 0,
		pnWidthPadding: number = 0
	) {
		if (grid == null || grid.hostElement == null) return;

		let _nFontHeight = 22;

		let _nSize = _nFontHeight + pnHeightPadding * 2;

		if (grid.rows.defaultSize != _nSize) grid.rows.defaultSize = _nSize;
	}

	public static getColumnStyle(column: wjg.Column) {
		return column[this.StyleProp];
	}

	public static isMatchColName(
		pzColName: string,
		pzPattern: string,
		pEvalExpr: BravoExpressionEvaluator
	) {
		if (!pzColName || !pzPattern) return;

		try {
			if (new RegExp('\b' + pzColName + '\b', 'i').test(pzPattern)) return true;
		} catch {}

		try {
			if (new RegExp('\b' + pzPattern + '\b', 'i').test(pzColName)) return true;
		} catch {}

		try {
			if (pEvalExpr.isTrue(String.format("'{0}' LIKE '{1}'", pzColName, pzPattern)))
				return true;
		} catch {}

		return false;
	}

	//#endregion static method

	//#region custom properties

	/* private _mapAllowWinform(value: AllowMergingEnum) {
        switch (value) {
            case AllowMergingEnum.None:
                return wjg.AllowMerging.None;
            case AllowMergingEnum.FixedOnly:
                return wjg.AllowMerging.AllHeaders;
            case AllowMergingEnum.RestrictCols:
                return wjg.AllowMerging.RowHeaders;
            case AllowMergingEnum.RestrictRows:
                return wjg.AllowMerging.ColumnHeaders;
            default:
                return wjg.AllowMerging.AllHeaders;
        }
    } */

	private _dtAutoMinTime = Date.minValue;
	private _minimumTime = Date.minValue;

	public get minimumTime(): Date {
		return (this.autoMinMaxTime & AutoMinMaxTimeEnum.MinimumTime) != 0
			? this._dtAutoMinTime
			: this._minimumTime;
	}

	public set minimumTime(value: Date) {
		const outArgs: { datetime: Date } = { datetime: null };
		if (BravoDataTypeConverter.isDateTimeValue(value, outArgs))
			this._minimumTime = outArgs.datetime;
	}

	private _dtAutoMaxTime = Date.minValue;
	private _maximumTime = Date.minValue;

	public get maximumTime(): Date {
		return (this.autoMinMaxTime & AutoMinMaxTimeEnum.MaximumTime) != 0
			? this._dtAutoMaxTime
			: this._maximumTime;
	}

	public set maximumTime(value: Date) {
		const outArgs: { datetime: Date } = { datetime: null };
		if (BravoDataTypeConverter.isDateTimeValue(value, outArgs))
			this._maximumTime = outArgs.datetime;
	}

	public defaultPadding: Padding = new Padding(1, 1, 1, 1);

	public accessibleDescription: string;

	private _allowEditing: boolean;

	public get allowEditing(): boolean {
		if (this._allowEditing == null) return !this.isReadOnly;

		return this._allowEditing;
	}

	/**
	 * Gets or sets whether the user is allowed to edit grid contents.
	 */
	public set allowEditing(value: boolean) {
		this.isReadOnly = !value;
		this._allowEditing = value;
	}

	private _autoFitRowHeight: GridAutoFitRowHeightEnum = GridAutoFitRowHeightEnum.None;

	/**
	 * Auto fit height of rows to their contents when they are drawn.
	 */
	@Enum(GridAutoFitRowHeightEnum)
	public get autoFitRowHeight(): GridAutoFitRowHeightEnum {
		return this._autoFitRowHeight;
	}

	public set autoFitRowHeight(value: GridAutoFitRowHeightEnum) {
		this._autoFitRowHeight = value;
	}

	private _autoTextMode: GridAutoTextContentEnum = GridAutoTextContentEnum.Fixed;

	/**
	 * Indicate which cell content will be translated autotext automatically.
	 */
	@Enum(GridAutoTextContentEnum)
	public get autoTextMode(): GridAutoTextContentEnum {
		return this._autoTextMode;
	}

	public set autoTextMode(value: GridAutoTextContentEnum) {
		this._autoTextMode = value;
	}

	private _allowBuiltInContextMenu = GridBuiltInContextMenuEnum.Automatic;

	/**
	 * Allow showing builtin context menu when user clicks right mouse button on some special areas in grid.
	 */
	@Enum(GridBuiltInContextMenuEnum)
	public get allowBuiltInContextMenu(): GridBuiltInContextMenuEnum {
		return this._allowBuiltInContextMenu;
	}

	public set allowBuiltInContextMenu(value: GridBuiltInContextMenuEnum) {
		value = asEnum(value, GridBuiltInContextMenuEnum);
		if (this._allowBuiltInContextMenu != value) this._allowBuiltInContextMenu = value;
	}

	private _allowEditingMultiCells = AllowEditingMultiCellEnum.None;

	/**
	 * Allow user pasting multi cells from clipboard to grid.
	 */
	public get allowEditingMultiCells(): AllowEditingMultiCellEnum {
		return this._allowEditingMultiCells;
	}

	public set allowEditingMultiCells(v: AllowEditingMultiCellEnum) {
		this._allowEditingMultiCells = v;
	}

	private _bExcludeSumColumns: boolean = false;

	/**
	 * Determine whether sum numeric columns including or excluding sumColumns collection.
	 */
	public get bExcludeSumColumns(): boolean {
		return this._bExcludeSumColumns;
	}

	public set bExcludeSumColumns(value: boolean) {
		this._bExcludeSumColumns = value;
	}

	/**
	 * Handle Enter key in editing mode to auto find and move to next editable cell when finish editing at current cell.
	 */
	public get bHandleEnterKeyEdit(): boolean {
		return this.keyActionEnter == wjg.KeyAction.CycleOut;
	}

	public set bHandleEnterKeyEdit(value: boolean) {
		if (this.keyActionEnter == wjg.KeyAction.CycleOut) return;

		this.keyActionEnter = value ? wjg.KeyAction.CycleOut : wjg.KeyAction.None;
	}

	private _bToggleNodeStateOnCellActivated: boolean = true;

	/**
	 * Indicate if activated cell is a parent node, it's state will be toggled between collapsing and expanding.
	 */
	public get bToggleNodeStateOnCellActivated(): boolean {
		return this._bToggleNodeStateOnCellActivated;
	}

	public set bToggleNodeStateOnCellActivated(value: boolean) {
		this._bToggleNodeStateOnCellActivated = value;
	}

	private _bDoubleClickActivateCell: boolean = true;

	public get bDoubleClickActivateCell(): boolean {
		return this._bDoubleClickActivateCell;
	}

	public set bDoubleClickActivateCell(value: boolean) {
		this._bDoubleClickActivateCell = value;
	}

	private _bAllowGrandTotal: boolean = false;

	/**
	 * Allow grand total row is display by sum numeric columns.
	 */
	public get bAllowGrandTotal(): boolean {
		return this._bAllowGrandTotal;
	}

	public set bAllowGrandTotal(value: boolean) {
		this._bAllowGrandTotal = value;
	}

	private _bAutoFitRowHeight: boolean = true;

	public get bAutoFitRowHeight(): boolean {
		return this._bAutoFitRowHeight;
	}

	public set bAutoFitRowHeight(value: boolean) {
		this._bAutoFitRowHeight = value;
	}

	private _bAllowAddingColumn: boolean = false;

	/**
	 *  Allow column can be added or inserted by user.
	 */
	public get bAllowAddingColumn(): boolean {
		return this._bAllowAddingColumn;
	}

	public set bAllowAddingColumn(value: boolean) {
		this._bAllowAddingColumn = value;
	}

	private _bAllowDeletingColumn: boolean = false;

	/**
	 * Allow column can be deleted by user.
	 */
	public get bAllowDeletingColumn(): boolean {
		return this._bAllowDeletingColumn;
	}

	public set bAllowDeletingColumn(value: boolean) {
		this._bAllowDeletingColumn = value;
	}

	private _bAllowGrouping: boolean = true;

	/**
	 * Allow user to group data.
	 */
	public get bAllowGrouping(): boolean {
		return this._bAllowGrouping;
	}

	public set bAllowGrouping(value: boolean) {
		this._bAllowGrouping = value;
	}

	/**
	 * Allow user to sort data at indicated column.
	 */
	public get bAllowSorting(): boolean {
		return this.allowSorting != wjg.AllowSorting.None;
	}

	public set bAllowSorting(value: boolean) {
		this.allowSorting = value ? wjg.AllowSorting.SingleColumn : wjg.AllowSorting.None;
	}

	private _bAllowRaisingUpdateGroupsEvents = false;

	/**
	 * Determine whether onBeforeUpdateGroups/onAfterUpdateGroups events will be raised or not.
	 */
	public get bAllowRaisingUpdateGroupsEvents(): boolean {
		return this._bAllowRaisingUpdateGroupsEvents;
	}

	public set bAllowRaisingUpdateGroupsEvents(val: boolean) {
		this._bAllowRaisingUpdateGroupsEvents = val;
	}

	private _bMarkDataRowState: boolean = false;

	/**
	 * Color mark row header for error and changed data rows.
	 */
	public get bMarkDataRowState(): boolean {
		return this._bMarkDataRowState;
	}

	public set bMarkDataRowState(value: boolean) {
		this._bMarkDataRowState = value;
	}

	private _bManualSumForGroup: boolean = false;

	/**
	 * Indicate manual handle sum total for subtotal nodes.
	 */
	public get bManualSumForGroup(): boolean {
		return this._bManualSumForGroup;
	}

	public set bManualSumForGroup(value: boolean) {
		this._bManualSumForGroup = value;
	}

	private _bGroupInColumn = false;

	/**
	 * Indicate grouping data by merging row at specified column.
	 */
	public get bGroupInColumn(): boolean {
		return this._bGroupInColumn;
	}

	public set bGroupInColumn(value: boolean) {
		if (this._bGroupInColumn == value) return;
		this._bGroupInColumn = value;
	}

	protected _bDrawContentBorders: boolean = false;

	public get bDrawContentBorders(): boolean {
		return this._bDrawContentBorders;
	}

	public set bDrawContentBorders(value: boolean) {
		if (this._bDrawContentBorders == value) return;
		this._bDrawContentBorders = value;
		this.refreshCssBorder();
	}

	private _bContentBorderForColumnHeaders: boolean = true;

	/**
	 * Use if bDrawContentBorders=True indicates content includes column headers.
	 */
	public get bContentBordersForColumnHeaders(): boolean {
		return this._bContentBorderForColumnHeaders;
	}

	public set bContentBordersForColumnHeaders(value: boolean) {
		if (this._bContentBorderForColumnHeaders == value) return;
		this._bContentBorderForColumnHeaders = value;
	}

	private _bCreateTreeNodeAsSubtotal: boolean = true;

	/**
	 * Apply subtotal style for created tree node and not binding to data source.
	 */
	public get bCreateTreeNodeAsSubtotal(): boolean {
		return this._bCreateTreeNodeAsSubtotal;
	}

	public set bCreateTreeNodeAsSubtotal(value: boolean) {
		this._bCreateTreeNodeAsSubtotal = value;
	}

	private _bHeaderNumberingAutoSize: boolean = false;

	/**
	 * Auto fit column width to header numbering content.
	 */
	public get bHeaderNumberingAutoSize(): boolean {
		return this._bHeaderNumberingAutoSize;
	}

	public set bHeaderNumberingAutoSize(value: boolean) {
		this._bHeaderNumberingAutoSize = value;
	}

	private _bAllowRaisingOnActiveItemChangedEvent: boolean = true;

	public get bAllowRaisingOnActiveItemChangedEvent(): boolean {
		return this._bAllowRaisingOnActiveItemChangedEvent;
	}

	public set bAllowRaisingOnActiveItemChangedEvent(value: boolean) {
		this._bAllowRaisingOnActiveItemChangedEvent = value;

		if (!this._bAllowRaisingOnActiveItemChangedEvent) {
			if (this._subSelectionChanged) {
				this._subSelectionChanged.unsubscribe();
				this._subSelectionChanged = null;
			}
		} else {
			this.handleSelectionChanged();
		}

		if (
			!this._bAllowRaisingOnActiveItemChangedEvent &&
			this._activeItemTimer != null &&
			this._activeItemTimer.enabled
		)
			this.activeItemTimer.stop();
	}

	/**
	 * Determine whether alternative rows are displayed in different background color or not.
	 */
	public get bShowAlternateRows(): boolean {
		return this.alternatingRowStep > 0;
	}

	public set bShowAlternateRows(value: boolean) {
		if (!value) this.alternatingRowStep = 0;
		else if (this.alternatingRowStep == 0) this.alternatingRowStep = 1;
	}

	private _bHighlightEntireCurrentRow: boolean = true;

	public get bHighlightEntireCurrentRow(): boolean {
		return this._bHighlightEntireCurrentRow;
	}

	public set bHighlightEntireCurrentRow(value: boolean) {
		if (this._bHighlightEntireCurrentRow == value) return;
		this._bHighlightEntireCurrentRow = value;
	}

	private _contentBorderColor: wjc.Color = wjc.Color.fromString('#333');

	public get contentBorderColor(): wjc.Color {
		return this._contentBorderColor;
	}

	public set contentBorderColor(value: wjc.Color) {
		if (this._contentBorderColor.equals(value)) return;
		this._contentBorderColor = value;
		if (this.bDrawContentBorders) this.refreshCssBorder();
	}

	private _contentBorderStyle: GridBorderStyle = GridBorderStyle.Solid;

	public get contentBorderStyle(): GridBorderStyle {
		return this._contentBorderStyle;
	}

	public set contentBorderStyle(value: GridBorderStyle) {
		if (this._contentBorderStyle == value) return;
		this._contentBorderStyle = value;
		this.refreshCssBorder();
	}

	protected _defaultBorderColor = wjc.Color.fromString('#dddddd');

	public get defaultBorderColor(): wjc.Color {
		return this._defaultBorderColor;
	}

	public set defaultBorderColor(value: wjc.Color) {
		this._defaultBorderColor = value;
	}

	private _dataSource: any;

	public get dataSource(): any {
		return this._dataSource;
	}

	public setDataSource(pSource: any) {
		this._dataSource = pSource;
	}

	private _endTimeMarking: TimeMarkingEnum = TimeMarkingEnum.Base;

	/** Marking end time. */
	@Enum(TimeMarkingEnum)
	public get endTimeMarking(): TimeMarkingEnum {
		return this._endTimeMarking;
	}

	public set endTimeMarking(value: TimeMarkingEnum) {
		this._endTimeMarking = value;
	}

	private _ganttChartAutoGroup: GanttGroupTypeEnum = GanttGroupTypeEnum.Merged;

	/** Auto merging gantt chart bar at last-level group. */
	@Enum(GanttGroupTypeEnum)
	public get ganttChartAutoGroup(): GanttGroupTypeEnum {
		return this._ganttChartAutoGroup;
	}

	public set ganttChartAutoGroup(value: GanttGroupTypeEnum) {
		this._ganttChartAutoGroup = value;
	}

	private _ganttBarPadding: wjc.Size = new wjc.Size(1, 4);

	/** Padding of gantt bar. */
	public get ganttBarPadding(): wjc.Size {
		return this._ganttBarPadding;
	}

	public set ganttBarPadding(value: wjc.Size) {
		this._ganttBarPadding = value;
	}

	protected _padding: Padding = new Padding(0, 0, 0, 0);

	public get padding(): Padding {
		return this._padding;
	}

	public set padding(value: Padding) {
		if (this._padding && this._padding.equals(value)) return;

		this._padding = value;
		this.invalidate();
	}

	private _margin: Padding = new Padding(0, 0, 0, 0);

	public get margin(): Padding {
		return this._margin;
	}

	public set margin(value: Padding) {
		if (this._margin && this._margin.equals(value)) return;

		this._margin = value;
		this.invalidate();
	}

	private _controls: wjc.ObservableArray;

	public get controls(): wjc.ObservableArray {
		if (this._controls == null) this._controls = new wjc.ObservableArray();

		return this._controls;
	}

	private _countGroupChilds = GridCountGroupChildEnum.Hide;

	/**
	 * Determine whether total childs is displayed at group nodes or not.
	 */
	@Enum(GridCountGroupChildEnum)
	public get countGroupChilds(): GridCountGroupChildEnum {
		return this._countGroupChilds;
	}

	public set countGroupChilds(value: GridCountGroupChildEnum) {
		if (this._countGroupChilds != value) this._countGroupChilds = value;
	}

	private _expressionEvaluator: BravoExpressionEvaluator = null;

	public get expressionEvaluator(): BravoExpressionEvaluator {
		if (!this._expressionEvaluator) this._expressionEvaluator = new BravoExpressionEvaluator();

		return this._expressionEvaluator;
	}

	public set expressionEvaluator(value: BravoExpressionEvaluator) {
		this._expressionEvaluator = value;
	}

	private _editableColumns: Map<string, string> = null;

	/**
	 * Collection of expression to check before editing a column.
	 */
	public get editableColumns(): Map<string, string> {
		if (this._editableColumns == null) this._editableColumns = new Map();

		return this._editableColumns;
	}

	private _groups: Map<string, GroupColumnItem> = null;

	public get groups(): Map<string, GroupColumnItem> {
		if (this._groups == null) this._groups = new Map<string, GroupColumnItem>();

		return this._groups;
	}

	private _hideZeroValue: GridDataCellEnum = GridDataCellEnum.Bound;

	@Enum(GridDataCellEnum)
	public get hideZeroValue(): GridDataCellEnum {
		return this._hideZeroValue;
	}

	public set hideZeroValue(value: GridDataCellEnum) {
		this._hideZeroValue = value;
	}

	private _highlightColumns: Map<string, Array<string>>;

	public get highlightColumns(): Map<string, Array<string>> {
		if (this._highlightColumns == null) this._highlightColumns = new Map();

		return this._highlightColumns;
	}

	private _treeColumnPos: number = -1;

	public get treeColumnPos(): number {
		if (this._treeColumnPos == -1 && !String.isNullOrEmpty(this.zTreeColName))
			this._treeColumnPos = this.columns.indexOf(this.zTreeColName);

		if (this._treeColumnPos == -1) return this.columns.firstVisibleIndex;

		return this._treeColumnPos;
	}

	public set treeColumnPos(value: number) {
		if (this._treeColumnPos == value) return;

		if (value < 0 || value >= this.columns.length - 1) return;

		this._zTreeColName = (<wjg.Column>this.columns[value]).name;
		this._treeColumnPos = value;
	}

	/**
	 * Indicate number of columns is frozen.
	 */
	public get nFreezeCols(): number {
		return this.frozenColumns;
	}

	public set nFreezeCols(value: number) {
		// this.frozenColumns = value;
	}

	/**
	 * Indicate number of rows is frozen.
	 */
	public get nFreezeRows(): number {
		return this.frozenRows;
	}

	public set nFreezeRows(value: number) {
		this.frozenRows = value;
	}

	private _nTimeScaleColumnWidthPadding: number = 2;

	/** Padding to auto width of time scale column. */
	public get nTimeScaleColumnWidthPadding(): number {
		return this._nTimeScaleColumnWidthPadding;
	}

	public set nTimeScaleColumnWidthPadding(value: number) {
		this._nTimeScaleColumnWidthPadding = value;
	}

	private _nHeaderNumberingCol: number = -1;

	public get nHeaderNumberingCol(): number {
		return this._nHeaderNumberingCol;
	}

	public set nHeaderNumberingCol(value: number) {
		this._nHeaderNumberingCol = value;
	}

	protected get nHeaderNumberingPadding(): number {
		return 0;
	}

	private _nMarkingBarWidth: number = 2;

	public get nMarkingBarWidth(): number {
		return this._nMarkingBarWidth;
	}

	public set nMarkingBarWidth(value: number) {
		this._nMarkingBarWidth = value;
	}

	private _showSpecialDay: ShowExcludedTimeEnum = ShowExcludedTimeEnum.Both;

	/** Determine how special day is shown. */
	@Enum(ShowExcludedTimeEnum)
	public get showSpecialDay(): ShowExcludedTimeEnum {
		return this._showSpecialDay;
	}

	public set showSpecialDay(value: ShowExcludedTimeEnum) {
		this._showSpecialDay = value;
	}

	private _showWeekend: ShowExcludedTimeEnum = ShowExcludedTimeEnum.Fixed;

	/** Determine how weekend is shown. */
	@Enum(ShowExcludedTimeEnum)
	public get showWeekend(): ShowExcludedTimeEnum {
		return this._showWeekend;
	}

	public set showWeekend(value: ShowExcludedTimeEnum) {
		this._showWeekend = value;
	}

	private _sumColumns: Map<string, string> = null;

	public get sumColumns(): Map<string, string> {
		if (!this._sumColumns) {
			this._sumColumns = new Map();
			this._sumColumns.set(BravoWebGrid.AllColumnValue, null);
		}

		return this._sumColumns;
	}

	private _zTreeColName: string = null;

	public get zTreeColName(): string {
		return this._zTreeColName;
	}

	public set zTreeColName(value: string) {
		if (this._zTreeColName == value) return;

		this._zTreeColName = value;

		if (this.columns.indexOf(value) == -1) return;

		this._treeColumnPos = this.columns.indexOf(value);
	}

	private _zMakingTreeNodeKeyColName: string = null;

	public get zMakingTreeNodeKeyColName(): string {
		return this._zMakingTreeNodeKeyColName;
	}

	public set zMakingTreeNodeKeyColName(val: string) {
		this._zMakingTreeNodeKeyColName = val;

		if (!String.isNullOrEmpty(this._zMakingTreeNodeKeyColName)) this.treeIndent = 0;
	}

	private _zDataViewSortExprFormat: string = DefaultDataViewSortExprFormat;

	public get zDataViewSortExprFormat(): string {
		return this._zDataViewSortExprFormat;
	}

	public set zDataViewSortExprFormat(val: string) {
		this._zDataViewSortExprFormat = val;
	}

	private _zDisplayTextMember: string;

	/** Binding member of display text. */
	public get zDisplayTextMember(): string {
		return this._zDisplayTextMember;
	}

	public set zDisplayTextMember(value: string) {
		this._zDisplayTextMember = value;
	}

	private _restrictedColumns: Map<string, RestrictedColumnEnum> = null;

	public get restrictedColumns(): Map<string, RestrictedColumnEnum> {
		if (!this._restrictedColumns)
			this._restrictedColumns = new Map<string, RestrictedColumnEnum>();

		return this._restrictedColumns;
	}

	private _rowHeaderNumbering: RowHeaderNumberingEnum = RowHeaderNumberingEnum.None;

	@Enum(RowHeaderNumberingEnum)
	public get rowHeaderNumbering(): RowHeaderNumberingEnum {
		return this._rowHeaderNumbering;
	}

	public set rowHeaderNumbering(value: RowHeaderNumberingEnum) {
		this._rowHeaderNumbering = value;
	}

	private _rowLayout: Array<any> = null;

	public get rowLayout(): Array<any> {
		if (this._rowLayout == null) this._rowLayout = new Array();

		return this._rowLayout;
	}

	private _dynamicStyles: Array<DynamicStyleItem> = null;

	public get dynamicStyles(): Array<DynamicStyleItem> {
		if (!this._dynamicStyles) this._dynamicStyles = new Array<DynamicStyleItem>();

		return this._dynamicStyles;
	}

	private _bShowCellLabels: boolean = true;

	public get showCellLabels(): boolean {
		return this._bShowCellLabels;
	}

	public set showCellLabels(v: boolean) {
		this._bShowCellLabels = v;
	}

	private _toolTip: wjc.Tooltip;

	public get toolTip(): wjc.Tooltip {
		return this._toolTip;
	}

	public set toolTip(v: wjc.Tooltip) {
		this._toolTip = v;
	}

	private _styles: Map<any, CellStyle> = null;

	public get styles(): Map<any, CellStyle> {
		if (!this._styles) this._styles = new Map<any, CellStyle>();

		return this._styles;
	}

	public get readOnly(): boolean {
		return this.isReadOnly;
	}

	public set readOnly(value: boolean) {
		this.isReadOnly = value;
	}

	private _font: Font = null;

	public get font(): Font {
		return this._font;
	}

	public set font(pValue: Font) {
		this._font = pValue;
	}

	private _name: string = '';

	@Input()
	public get name(): string {
		return this._name;
	}

	public set name(val: string) {
		this._name = val;
	}

	private _visible: boolean = true;

	public get visible(): boolean {
		return this._visible;
	}

	public set visible(val: boolean) {
		if (this._visible == val) return;

		this._visible = val;
		this.invalidate();
	}

	// private _bHeightChanged = false;

	private _height: number = -1;

	public get height(): number {
		if (this._eSz != null && this._height == -1) this._height = this._eSz.clientHeight;

		return this._height;
	}

	public set height(value: number) {
		if (this._height == value) return;
		this._height = value;

		// this._bHeightChanged = true;
		this.invalidate();
	}

	// private _bWidthChanged = false;

	private _width: number = -1;

	public get width(): number {
		if (this._eSz != null && this._width == -1) this._width = this._eSz.clientWidth;

		return this._width;
	}

	public set width(value: number) {
		if (value == this._width) return;
		this._width = value;

		this.invalidate();
	}

	private _dock: DockStyle = DockStyle.None;

	@Enum(DockStyle)
	public get dock(): DockStyle {
		return this._dock;
	}

	public set dock(value: DockStyle) {
		this._dock = value;
		this.invalidate();
	}

	private _anchor: AnchorStyles = AnchorStyles.Top | AnchorStyles.Left;

	@Enum(AnchorStyles)
	public get anchor(): AnchorStyles {
		return this._anchor;
	}

	public set anchor(value: AnchorStyles) {
		if (Object.is(this._anchor, value)) return;

		this._anchor = value;

		/*  if ((this._anchor & AnchorStyles.Left) != 0 && (this._anchor & AnchorStyles.Right) != 0)
             this._bWidthChanged = true;
 
         if ((this._anchor & AnchorStyles.Top) != 0 && (this._anchor & AnchorStyles.Bottom) != 0)
             this._bHeightChanged = true; */

		this.invalidate();
	}

	public get top(): number {
		return this.hostElement ? this.hostElement.offsetTop : 0;
	}

	public get bottom(): number {
		return this.hostElement ? this.hostElement.offsetTop + this.hostElement.offsetHeight : 0;
	}

	public get left(): number {
		return this.hostElement ? this.hostElement.offsetLeft : 0;
	}

	public get right(): number {
		return this.hostElement ? this.hostElement.offsetLeft + this.hostElement.offsetWidth : 0;
	}

	private _tabStop: boolean = true;

	public get tabStop(): boolean {
		return this._tabStop;
	}

	public set tabStop(value: boolean) {
		if (this._tabStop == value) return;
		this._tabStop = value;
		this.invalidate();
	}

	private _scrollBars: ScrollBars = ScrollBars.Both;

	public get scrollBars(): ScrollBars {
		return this._scrollBars;
	}

	public set scrollBars(value: ScrollBars) {
		this._scrollBars = value;

		if (this._root) {
			switch (this._scrollBars) {
				case ScrollBars.None:
					this._root.style.overflow = 'hidden';
					break;
				case ScrollBars.Horizontal:
					this._root.style.overflowX = 'auto';
					this._root.style.overflowY = 'hidden';
					break;
				case ScrollBars.Vertical:
					this._root.style.overflowX = 'hidden';
					this._root.style.overflowY = 'auto';
					break;
				case ScrollBars.Both:
					this._root.style.overflow = 'auto';
					break;
			}
		}
	}

	public get enabled(): boolean {
		return !this.isDisabled;
	}

	public set enabled(value: boolean) {
		if (this.isDisabled == !value) return;

		this.isDisabled = !value;
	}

	private _text: string;

	public get text(): string {
		return this._text;
	}

	public set text(value: string) {
		if (this._text == value) return;
		this._text = value;

		this.onTextChanged.raise(this, wjc.EventArgs.empty);
	}

	private _bShowNullValueCell: boolean = false;

	public get bShowNullValueCell(): boolean {
		return this._bShowNullValueCell;
	}

	public set bShowNullValueCell(pbValue: boolean) {
		this._bShowNullValueCell = pbValue;
		this.invalidate();
	}

	protected _showAddNewRow: ShowAddNewRowEnum = ShowAddNewRowEnum.EditableCell;

	public get showAddNewRow(): ShowAddNewRowEnum {
		return this._showAddNewRow;
	}

	public set showAddNewRow(value: ShowAddNewRowEnum) {
		this._showAddNewRow = value;
	}

	private _nNumericScale: number = 1;

	public get nNumericScale(): number {
		return this._nNumericScale;
	}

	public set nNumericScale(value: number) {
		this._nNumericScale = value;
	}

	private _nDefaultRowHeightPadding: number = 0;

	public get nDefaultRowHeightPadding(): number {
		return this._nDefaultRowHeightPadding;
	}

	public set nDefaultRowHeightPadding(value: number) {
		this._nDefaultRowHeightPadding = value;
		BravoWebGrid.resetRowColDefaultSize(this, value);
	}

	private _numericScaleUnit: NumericScaleUnitEnum = NumericScaleUnitEnum.None;

	@Enum(NumericScaleUnitEnum)
	public get numericScaleUnit(): NumericScaleUnitEnum {
		return this._numericScaleUnit;
	}

	public set numericScaleUnit(value: NumericScaleUnitEnum) {
		this._numericScaleUnit = value;
		this.nNumericScale = BravoNumericScale.getNumericScaleUnitValue(this._numericScaleUnit);
	}

	private _zNumericScaleFormat: string = 'N2';

	public get zNumericScaleFormat(): string {
		return this._zNumericScaleFormat;
	}

	public set zNumericScaleFormat(value: string) {
		this._zNumericScaleFormat = value;
	}

	private _zNumericScaleMember: string = String.empty;

	public get zNumericScaleMember(): string {
		return this._zNumericScaleMember;
	}

	public set zNumericScaleMember(value: string) {
		this._zNumericScaleMember = value;
	}

	protected _zNewRowText: string;

	public get zNewRowText(): string {
		return this._zNewRowText;
	}

	public set zNewRowText(value: string) {
		this._zNewRowText = value;
	}

	private _mergedRanges: Array<wjg.CellRange> = null;

	public get mergedRanges(): Array<wjg.CellRange> {
		if (!this._mergedRanges) this._mergedRanges = new Array();

		return this._mergedRanges;
	}

	private _autoMinMaxTime: AutoMinMaxTimeEnum = AutoMinMaxTimeEnum.Both;

	@Enum(AutoMinMaxTimeEnum)
	public get autoMinMaxTime(): AutoMinMaxTimeEnum {
		return this._autoMinMaxTime;
	}

	public set autoMinMaxTime(value: AutoMinMaxTimeEnum) {
		this._autoMinMaxTime = value;
	}

	private _gridMode: GridModeEnum = GridModeEnum.Grid;

	@Enum(GridModeEnum)
	public get gridMode(): GridModeEnum {
		return this._gridMode;
	}

	public set gridMode(value: GridModeEnum) {
		this._gridMode = value;
	}

	private _zStartTimeMember: string;

	public get zStartTimeMember(): string {
		return this._zStartTimeMember;
	}

	public set zStartTimeMember(value: string) {
		this._zStartTimeMember = value;
	}

	private _zEndTimeMember: string;

	public get zEndTimeMember(): string {
		return this._zEndTimeMember;
	}

	public set zEndTimeMember(value: string) {
		this._zEndTimeMember = value;
	}

	private _zBarColorMember: string;

	public get zBarColorMember(): string {
		return this._zBarColorMember;
	}

	public set zBarColorMember(value: string) {
		this._zBarColorMember = value;
	}

	private _ganttBarColorType: GanttBarColorTypeEnum = GanttBarColorTypeEnum.Default;

	@Enum(GanttBarColorTypeEnum)
	public get ganttBarColorType(): GanttBarColorTypeEnum {
		return this._ganttBarColorType;
	}

	public set ganttBarColorType(value: GanttBarColorTypeEnum) {
		this._ganttBarColorType = value;
	}

	private _timeScale: TimeScaleEnum = TimeScaleEnum.Day;

	@Enum(TimeScaleEnum)
	public get timeScale(): TimeScaleEnum {
		return this._timeScale;
	}

	public set timeScale(value: TimeScaleEnum) {
		this._timeScale = value;
	}

	private _nCollapseCreatedNode: number = -1;

	/**
	 * Determine level of nodes will be collapsed once they have been created.
	 */
	public get nCollapseCreatedNode(): number {
		return this._nCollapseCreatedNode;
	}

	public set nCollapseCreatedNode(value: number) {
		this._nCollapseCreatedNode = value;
	}

	private _nAutoMinimumTimeOffset: number = -1;

	/** Offset value of auto miniimum time of gantt chart. */
	public get nAutoMinimumTimeOffset(): number {
		return this._nAutoMinimumTimeOffset;
	}

	public set nAutoMinimumTimeOffset(value: number) {
		this._nAutoMinimumTimeOffset = value;
	}

	private _nAutoMaximumTimeOffset: number = 1;

	/** Offset value of auto maximum time of gantt chart. */
	public get nAutoMaximumTimeOffset(): number {
		return this._nAutoMaximumTimeOffset;
	}

	public set nAutoMaximumTimeOffset(value: number) {
		this._nAutoMaximumTimeOffset = value;
	}

	private _nTimeScaleLimit: number = 31;

	public get nTimeScaleLimit(): number {
		return this._nTimeScaleLimit;
	}

	public set nTimeScaleLimit(value: number) {
		if (this._nTimeScaleLimit == value) return;

		this._nTimeScaleLimit = value;
		this.invalidate();
	}

	private _timeScaleExact: boolean = true;

	/** Exact drawing time scale by smaller unit of gantt chart. */
	public get timeScaleExact(): boolean {
		return this._timeScaleExact;
	}

	public set timeScaleExact(value: boolean) {
		this._timeScaleExact = value;
	}

	/**
	 * Custom text for grand total label.
	 */
	private _zGrandTotalText: string = String.empty;

	public get zGrandTotalText(): string {
		return this._zGrandTotalText;
	}

	public set zGrandTotalText(value: string) {
		this._zGrandTotalText = value;
	}

	private _zCellToolTipText: string;

	public get zCellToolTipText(): string {
		return this._zCellToolTipText;
	}

	public set zCellToolTipText(v: string) {
		this._zCellToolTipText = v;
	}

	public bExistsColumnWordWrap: boolean = false;

	private _grandTotalPosition: SubtotalPositionEnum = SubtotalPositionEnum.BelowData;

	/**
	 * Determine whether position of grand total row is at top or bottom.
	 */
	@Enum(SubtotalPositionEnum)
	public get grandTotalPosition(): SubtotalPositionEnum {
		return this._grandTotalPosition;
	}

	public set grandTotalPosition(value: SubtotalPositionEnum) {
		this._grandTotalPosition = value;
	}

	private _subtotalPosition: SubtotalPositionEnum = SubtotalPositionEnum.AboveData;

	@Enum(SubtotalPositionEnum)
	public get subtotalPosition(): SubtotalPositionEnum {
		return this._subtotalPosition;
	}

	public set subtotalPosition(value: SubtotalPositionEnum) {
		this._subtotalPosition = value;
	}

	private _startTimeMarking: TimeMarkingEnum = TimeMarkingEnum.Base;

	/** Marking start time. */
	@Enum(TimeMarkingEnum)
	public get startTimeMarking(): TimeMarkingEnum {
		return this._startTimeMarking;
	}

	public set startTimeMarking(value: TimeMarkingEnum) {
		this._startTimeMarking = value;
	}

	public parent: any;

	public ownerForm: any;

	private _bIsCacheStyle: boolean = false;

	public get bIsCacheStyle() {
		return this._bIsCacheStyle;
	}

	public set bIsCacheStyle(pbCache: boolean) {
		this._bIsCacheStyle = pbCache;
	}

	private _cacheStyleGrid: Map<string, any>;

	public get cacheStyleGrid() {
		if (!this._cacheStyleGrid) this._cacheStyleGrid = new Map<string, any>();
		return this._cacheStyleGrid;
	}

	public set cacheStyleGrid(pCacheSyle: any) {
		this._cacheStyleGrid = pCacheSyle;
	}
	//#endregion custom properties

	public readonly onLostGridEditing = new wjc.Event();

	public readonly onTextChanged = new wjc.Event();

	public readonly onAfterUpdateGroups = new wjc.Event();

	public readonly onBeforeUpdateGroups = new wjc.Event();

	public readonly evaluatingAutoTextCell = new wjc.Event();
	public onEvaluatingAutoTextCell(e?: wjg.FormatItemEventArgs) {
		this.evaluatingAutoTextCell.raise(this, e);
	}

	public readonly onRestrictedDOUColumn = new wjc.Event();
	public raiseOnRestrictedDOUColumn(e: RowColEventArgs) {
		e.cancel = true;
		this.onRestrictedDOUColumn.raise(this, e);
	}

	public readonly onContentWidthChanged = new wjc.Event();
	public raiseOnContentWidthChanged(e?: RowColEventArgs) {
		if (!e) e = new RowColEventArgs(null, -1, -1);
		this.onContentWidthChanged.raise(this, e);
	}

	public readonly onContentHeightChanged = new wjc.Event();
	public raiseOnContentHeightChanged(e?: RowColEventArgs) {
		if (this.isUpdating) return;
		if (!e) e = new RowColEventArgs(null, -1, -1);
		this.onContentHeightChanged.raise(this, e);
	}

	public readonly onTreeNodeInserted = new wjc.Event();

	public readonly onHighlightColumnRequired = new wjc.Event();

	public readonly onDataRowStateRequired = new wjc.Event();

	public readonly addingNewRow = new wjc.Event();

	public readonly insertingNewRow = new wjc.Event();

	public readonly onActiveItemChanged = new wjc.Event();

	public readonly onCellActivated = new wjc.Event();

	public readonly onCheckCellButton = new wjc.Event();

	public readonly onCheckCellButtonEnabled = new wjc.Event();

	public readonly beforeMouseDown = new wjc.Event();

	public readonly onCellLabelOn = new wjc.Event();
	protected raiseOnCellLabelOn(e: CustomToolTipEventArgs) {
		if (
			e.panel &&
			e.panel.cellType == wjg.CellType.Cell &&
			this.isCellValid(e.row, e.col) &&
			!String.isNullOrEmpty(this.columns[e.col].name) &&
			this.restrictedColumns.has(this.columns[e.col].name)
		) {
			let _bRestricted =
				(this.restrictedColumns.get(this.columns[e.col].name) &
					RestrictedColumnEnum.NoOpen) !=
				0;
			if (
				!_bRestricted &&
				!this.isAddNewRow(e.row) &&
				(this.restrictedColumns.get(this.columns[e.col].name) &
					RestrictedColumnEnum.NoOpenDOU) !=
					0
			) {
				const _r = new RowColEventArgs(e.panel, e.row, e.col);
				_r.cancel = true;
				this.raiseOnRestrictedDOUColumn(_r);
				_bRestricted = _r.cancel;
			}

			if (_bRestricted) return;
		}

		this.onCellLabelOn.raise(this, e);
	}

	public readonly onCellLabelOff = new wjc.Event();

	public readonly onValidateEditNextCell = new wjc.Event();

	private _styleCss: Dictionary<string, StyleCssData>;

	public get styleCss(): Dictionary<string, StyleCssData> {
		if (this._styleCss == null) {
			this._styleCss = new Dictionary();
			this._styleCss.dataChanged.addHandler((s, e) => {
				if (this.isUpdating) return;
				this.refreshStyle();
			});
		}

		return this._styleCss;
	}

	public get styleElement(): HTMLStyleElement {
		let _selectorId = String.format('Grid{0}', this.id);
		let _selectorStyle = String.format('style#{0}', _selectorId);

		let style = <HTMLStyleElement>document.head.querySelector(_selectorStyle);
		if (style == null) {
			style = document.createElement('style');
			style.id = _selectorId;

			document.head.appendChild(style);
		}

		return style;
	}

	protected ngUnsubscribe = new Subject();

	constructor(
		@Inject(ElementRef) elRef: ElementRef,
		@Inject(Injector) injector: Injector,
		@Inject('WjComponent') @SkipSelf() @Optional() parentCmp: any,
		@Inject(ChangeDetectorRef) cdRef: ChangeDetectorRef
	) {
		super(elRef, injector, parentCmp, cdRef);

		new BravoDirectiveCellFactory(this);

		wjc.addClass(this.hostElement, 'bravo-web-grid');

		this.handleSelectionChanged();

		this.internalCreated();

		this.initDefaultStyle();
	}

	getTemplate() {
		new CustomKeyboardHandler(this);

		this.addEventListener(this.hostElement, 'mousedown', this.onBeforeMouseDown.bind(this));
		this.addEventListener(this.hostElement, 'keydown', this.BravoWebGrid_keydown.bind(this));

		return super.getTemplate();
	}

	ngOnInit() {
		super.ngOnInit();

		let _host = this.hostElement;

		this.addEventListener(_host, 'mousedown', this._handleMouseDown.bind(this));
		this.addEventListener(_host, 'mouseup', this.BravoWebGrid_MouseUp.bind(this));
		this.addEventListener(_host, 'dblclick', this.BravoWebGrid_doubleClick.bind(this));
		this.addEventListener(_host, 'contextmenu', this.handleRightMouseButtonUp.bind(this));
		this.addEventListener(_host, 'mouseover', this.bravoWebGrid_mouseOver.bind(this));
		this.addEventListener(
			this.hostElement,
			'mouseleave',
			this.bravoWebGrid_mouseLeave.bind(this)
		);

		this.gotFocusNg.subscribe(() => {
			if (!this._root.classList.contains(CustomFocusStyleName))
				wjc.addClass(this._root, CustomFocusStyleName);
		});

		this.lostFocusNg.subscribe(() => {
			setTimeout(() => {
				if (this._root.classList.contains(CustomFocusStyleName) && !this.containsFocus())
					wjc.removeClass(this._root, CustomFocusStyleName);
			}, wjc.Control._CLIPBOARD_DELAY + 10);
		});

		if (isMobile()) {
			this.nDefaultRowHeightPadding = 5;
		}

		this.scrollPositionChanged.addHandler((s, e) => {
			if (this.allowAddNew) {
				if (this._e) {
					const _newRow = this._e.querySelector('.bravo-new-row');
					if (_newRow) _newRow.remove();
				}
			}
		});

		/* this.resizedRowNg
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((e) => {
                if (e instanceof wjg.CellRangeEventArgs) {
                    this.writeRowLayout(e.panel.rows[e.row]);
    
                    this.raiseOnContentHeightChanged(new RowColEventArgs(e.panel, e.row, -1));
                }
            }); */

		if (this.bDrawContentBorders) this.refreshCssBorder();
	}

	protected internalCreated() {}

	created() {
		this.columns.defaultSize = 100;

		this.columnHeaders.rows.defaultSize = 21;
		this.columnFooters.rows.defaultSize = 21;
		this.rowHeaders.columns.defaultSize = 20;
		this.treeIndent = 0;
		this.autoGenerateColumns = false;
		this.groupHeaderFormat = '{name}: {value}';
		this.keyActionEnter = wjg.KeyAction.None;
		this.anchorCursor = false;

		this.showSelectedHeaders = wjg.HeadersVisibility.All;

		this.formatItem.addHandler(this.bravoWebGrid_OwnerDrawGanttCell, this);
		// this.cellFactory = new BravoCellFactory();
	}

	invalidate(fullUpdate?: boolean) {
		if (this._bCopying) return;

		super.invalidate(fullUpdate);

		if (this.font != null) {
			if (this.hostElement) {
				this.hostElement.style.fontFamily = this.font.FontFamily;
				this.hostElement.style.fontSize = this.font.Size;

				if (this.font.FontStyle && this.hostElement.style.fontStyle != this.font.FontStyle)
					this.hostElement.style.fontStyle = this.font.FontStyle;

				if (
					this.font.textDecoration &&
					this.hostElement.style.textDecoration != this.font.textDecoration
				)
					this.hostElement.style.textDecoration = this.font.textDecoration;
			}
		}
	}

	protected onBeforeMouseDown(e: MouseEvent) {
		//B0148-641
		const _h = this.hitTest(e);
		if (_h.cellType == wjg.CellType.Cell && _h.range.isValid) {
			const _col = this.columns[_h.col];
			if (_col.dataType == wjc.DataType.Boolean) {
				if (this.selection.intersects(_h.range) && !_isNativeCheckbox(this, e.target)) {
					e.preventDefault();
					return;
				}
			}
		}

		const _e = new BeforeMouseDownEventArgs(e);
		this.beforeMouseDown.raise(_e);
		if (_e.cancel) e.preventDefault();
	}

	private getInputCheckbox(pElement: HTMLElement) {
		if (!pElement) return;

		if (pElement instanceof HTMLInputElement && pElement.type == 'checkbox') return pElement;

		const _input = pElement.firstElementChild;
		if (_input instanceof HTMLInputElement && _input.type == 'checkbox') return _input;
	}

	private _subSelectionChanged: Subscription;
	private handleSelectionChanged() {
		if (this._subSelectionChanged) {
			this._subSelectionChanged.unsubscribe();
			this._subSelectionChanged = null;
		}

		this._subSelectionChanged = this.selectionChangedNg
			.pipe(
				debounceTime(BravoClientSettings.nActiveItemDelayTime),
				takeUntil(this.ngUnsubscribe)
			)
			.subscribe((e) => {
				const _oldRange = wjc.tryCast(e['oldRange'], wjg.CellRange) as wjg.CellRange;
				if (this.allowAddNew && _oldRange && _oldRange.containsRow(this.rows.length - 1))
					this.refreshRange(_oldRange);

				this.raiseOnActiveItemChanged(e);
			});
	}

	protected raiseOnActiveItemChanged(e?: wjc.EventArgs) {
		if (this.bAllowRaisingOnActiveItemChangedEvent) this.onActiveItemChanged.raise(this, e);
	}

	public raiseOnCellActivated(e?: MouseEvent) {
		if (!this.containsFocus()) {
			this.focus();
			if (!this.containsFocus()) return;
		}

		let _nRow = -1,
			_nCol;
		if (e) {
			const _ht = this.hitTest(e);
			if (_ht) {
				_nRow = _ht.row;
				_nCol = _ht.col;
			}
		}

		if (_nRow == -1) {
			let _sel = this.selection;
			if (!this.isCellValid(_sel.row, _sel.col)) return;

			if (this.isCellButton(_sel.row, _sel.col)) return;

			_nRow = _sel.row;
			_nCol = _sel.col;
		}

		if (this.isCellButton(_nRow, _nCol)) return;

		const _row = this.rows[_nRow];
		const _node = _row instanceof wjg.GroupRow && _row.hasChildren ? _row : null;
		if (_node && _node.level >= 0 && this.bToggleNodeStateOnCellActivated) {
			let _bLastState = _node.isCollapsed;
			_node.isCollapsed = !_node.isCollapsed;

			if (_bLastState != _node.isCollapsed) return;
		}

		if (this.openCellLink(_nRow, _nCol)) return;

		this.onCellActivated.raise(this, wjc.EventArgs.empty);
	}

	private _toolTipTimer: Timer = null;

	public get toolTipTimer(): Timer {
		if (this._toolTipTimer == null) {
			this._toolTipTimer = new Timer();
			this._toolTipTimer.interval = BravoClientSettings.nAutoTooltipDelayTime;
			this._toolTipTimer.tick.addHandler(this.toolTipTimer_Tick, this);
		}

		return this._toolTipTimer;
	}

	private _activeItemTimer: Timer = null;

	public get activeItemTimer(): Timer {
		if (this._activeItemTimer == null) {
			this._activeItemTimer = new Timer();
			this._activeItemTimer.interval = BravoClientSettings.nActiveItemDelayTime;
			this._activeItemTimer.tick.addHandler(this.activeItemTimer_Tick, this);
		}

		return this._activeItemTimer;
	}

	private activeItemTimer_Tick(s, e) {
		if (!this.hostElement) return;

		let _tmr = s as Timer;
		if (_tmr != null) _tmr.stop();

		this.raiseOnActiveItemChanged(wjc.EventArgs.empty);
	}

	private toolTipTimer_Tick(s, e) {
		if (!this.hostElement) return;

		const _tmr = s instanceof Timer ? s : null;
		if (_tmr) _tmr.stop();

		if (this.isUpdating) {
			this.stopTooltip();
			return;
		}

		if (_tmr.tag == null) {
			if (this.selection.isValid) this.stopTooltip();
		} else {
			this.toggleCellToolTip(_tmr.tag);
		}
	}

	public delayRaiseOnActiveItemChanged(pnDelay?: number) {
		let _nDelay = pnDelay;
		if (!_nDelay && _nDelay !== 0) _nDelay = BravoClientSettings.nActiveItemDelayTime;

		this.internalStartTimer(this.activeItemTimer, Math.max(1, _nDelay));
	}

	private internalStartTimer(pTimer: Timer, pnInterval: number) {
		if (!pTimer || (!pnInterval && pnInterval !== 0)) return;

		pTimer.stop();
		pTimer.interval = pnInterval;
		pTimer.start();
	}

	protected openCellLink(row: number, col: number) {
		try {
			if (!this.enabled || this.isHiddenRow(row) || this.isAddNewRow(row)) return false;

			const _col = this.columns[col] as wjg.Column;
			const _row = this.rows[row] as wjg.Row;
			const _colType = BravoWebGrid.getColumnDataType(_col);

			let _cellType = getCellType(_col[BravoWebGrid.StyleProp]);
			if (_col && compareStrings(_col.format, GridCellTypeEnum[GridCellTypeEnum.link], true))
				_cellType = GridCellTypeEnum.link;

			const _pic = wjc.tryCast(
				_col[BravoWebGrid.GridColumEditorProp],
				'IBravoPictureInputBox'
			) as IBravoPictureInputBox;
			const _doc = wjc.tryCast(
				_col[BravoWebGrid.GridColumEditorProp],
				'IBravoDocInputBox'
			) as IBravoDocInputBox;
			if (_pic != null || _doc != null) {
				if (_doc) {
					_doc.value = this.getCellData(row, col, false);
					_doc.openLink();
				} else if (_pic) {
					_pic.value = this.getCellData(row, col, false);
					_pic.openLink();
				}

				return true;
			} else if (
				_cellType == GridCellTypeEnum.link &&
				(_colType == wjc.DataType.String || _colType == null)
			) {
				let _zLink = this.getCellData(row, col, false);

				if (!String.isNullOrEmpty(_zLink)) {
					ExtensionsMethod.openLink(_zLink);
					return true;
				}
			}
		} catch (_ex) {
			console.warn(_ex);
			return false;
		}
	}

	public onDeletingRow(e: wjg.CellRangeEventArgs) {
		if (!this.allowDelete || this.readOnly) return false;

		const _bLastUpdating = this.isUpdating;
		if (!_bLastUpdating) this.beginUpdate();

		try {
			this.deletingRow.raise(this, e);
			this.raiseOnContentHeightChanged();
			return !e.cancel;
		} finally {
			if (!_bLastUpdating && this.hostElement) this.endUpdate();
		}
	}

	public onAddingNewRow() {
		if (!this.allowAddNew || this.readOnly) return;

		const _e = new UnboundValueEventArgs(this.rows.length - 1, -1, null);

		const _bLastUpdating = this.isUpdating;
		if (!_bLastUpdating) this.beginUpdate();

		try {
			this.addingNewRow.raise(this, _e);
			this.raiseOnContentHeightChanged();
			return _e.value;
		} finally {
			if (this.hostElement) {
				if (!_bLastUpdating) this.endUpdate();
			}
		}
	}

	private bravoWebGrid_OwnerDrawGanttCell(s, e: wjg.FormatItemEventArgs) {
		if (this.gridMode != GridModeEnum.GanttChart || !this.isGanttChartCol(e.col)) return;

		if (e.panel.cellType == wjg.CellType.ColumnHeader) {
			e.cell.textContent = this.getGanttChartColumnHeader(e.row, e.col);

			const _cs = this.styles.get(GanttGroupTimeScaleStyle);
			const _nGlyphRow = this.getGlyphRow();
			if (
				e.row == _nGlyphRow - 1 &&
				_cs &&
				!String.isNullOrEmpty(_cs[StyleElementFlags[StyleElementFlags.Format]])
			) {
				wjc.addClass(e.cell, GanttGroupTimeScaleStyle);
			} else {
				wjc.addClass(e.cell, GanttTimeScaleStyle);

				if (
					(this.showSpecialDay & ShowExcludedTimeEnum.Fixed) != 0 &&
					this.isSpecialDay(this.getDateTimeFromCol(e.col))
				)
					wjc.addClass(e.cell, SpecialDayStyle);
				else if (
					(this.showWeekend & ShowExcludedTimeEnum.Fixed) != 0 &&
					this.isWeekend(this.getDateTimeFromCol(e.col))
				)
					wjc.addClass(e.cell, WeekendStyle);
			}

			e.cancel = true;
		} else if (
			!String.isNullOrEmpty(this.zStartTimeMember) &&
			!String.isNullOrEmpty(this.zEndTimeMember)
		) {
			let _gt = this.getGanttGroupType(e.row);
			let _dr = _gt == GanttGroupTypeEnum.Merged ? null : this.getDataRow(e.row);
			if (_dr || _gt == GanttGroupTypeEnum.Merged) {
				e.cancel = true;

				if (
					(this.showSpecialDay & ShowExcludedTimeEnum.NonFixed) != 0 &&
					this.isSpecialDay(this.getDateTimeFromCol(e.col))
				)
					wjc.addClass(e.cell, SpecialDayStyle);
				else if (
					(this.showWeekend & ShowExcludedTimeEnum.NonFixed) != 0 &&
					this.isWeekend(this.getDateTimeFromCol(e.col))
				)
					wjc.addClass(e.cell, WeekendStyle);

				let _gr = e.panel.rows[e.row] instanceof wjg.GroupRow ? e.panel.rows[e.row] : null;
				if (_dr) {
					this.drawGanttCell(e, _dr);
				} else if (_gr instanceof wjg.GroupRow) {
					let _rg = _gr.getCellRange();
					for (let _i = _rg.topRow + 1; _i <= _rg.bottomRow; _i++) {
						let _row = e.panel.rows[_i] as wjg.Row;
						if (_row instanceof wjg.GroupRow && _row.level <= _gr.level) continue;

						let _drChild = this.getDataRow(_i);
						if (
							_drChild == null ||
							_drChild.isNull(this.zStartTimeMember) ||
							_drChild.isNull(this.zEndTimeMember)
						)
							continue;

						let _dtStart = Date.asDate(_drChild.getValue(this.zStartTimeMember));
						let _nStartCol = this.getColFromDateTime(_dtStart);

						if (e.col < _nStartCol) continue;

						let _dtEnd = Date.asDate(_drChild.getValue(this.zEndTimeMember));
						let _nEndCol = this.getColFromDateTime(_dtEnd);

						if (e.col > _nEndCol) continue;

						this.drawGanttCell(e, _drChild, _row.index);
					}
				}
			}
		}
	}

	private _colorDictionary: Map<any, wjc.Color>;

	private drawGanttCell(
		e: wjg.FormatItemEventArgs,
		dr: WebDataRow,
		pnChildRowIndex: number = -1
	) {
		let _bHandled = false;

		if (
			dr == null ||
			String.isNullOrEmpty(this.zStartTimeMember) ||
			String.isNullOrEmpty(this.zEndTimeMember)
		)
			return _bHandled;

		if (dr.isNull(this.zStartTimeMember) || dr.isNull(this.zEndTimeMember)) return false;

		let _dtStart = Date.asDate(dr.getValue(this.zStartTimeMember));
		let _dtEnd = Date.asDate(dr.getValue(this.zEndTimeMember));
		let _nStartCol = this.getColFromDateTime(_dtStart);
		let _nEndCol = this.getColFromDateTime(_dtEnd);

		const _bDrawMultiCells = e.col == -1;

		if (e.col < _nStartCol && !_bDrawMultiCells) return _bHandled;

		try {
			let _nStartMarkWidth =
				(this.startTimeMarking & TimeMarkingEnum.Arrow) != 0 ||
				(this.startTimeMarking & TimeMarkingEnum.Bar) != 0 ||
				(this.startTimeMarking & TimeMarkingEnum.Base) != 0
					? this.nMarkingBarWidth
					: 0;
			let _nEndMarkWidth =
				(this.endTimeMarking & TimeMarkingEnum.Arrow) != 0 ||
				(this.endTimeMarking & TimeMarkingEnum.Bar) != 0 ||
				(this.endTimeMarking & TimeMarkingEnum.Base) != 0
					? this.nMarkingBarWidth
					: 0;

			let _dtCol = _bDrawMultiCells ? Date.minValue : this.getDateTimeFromCol(e.col);
			let _bIsSpecialDay =
				(this.showSpecialDay & ShowExcludedTimeEnum.NonFixed) != 0 &&
				this.isSpecialDay(_dtCol);
			let _bIsWeekend =
				(this.showWeekend & ShowExcludedTimeEnum.NonFixed) != 0 && this.isWeekend(_dtCol);
			let _csGanttBar = this.styles.get(GanttBarStyle);
			let _clrBack =
				_csGanttBar && _csGanttBar[StyleElementFlags[StyleElementFlags.BackColor]]
					? wjc.Color.fromString(
							_csGanttBar[StyleElementFlags[StyleElementFlags.BackColor]]
					  )
					: wjc.Color.fromString('DodgerBlue');
			let _p = this.ganttBarPadding;

			let _nShiftStart = 0,
				_nShiftEnd = 0;
			if (this.timeScaleExact) {
				let _nStartColWidth =
					Math.round(this.getCurrentWidthOfCol(e.panel, _nStartCol)) - 2;
				_nStartColWidth -= _p.width;
				let _nEndColWidth = 0;

				if (_nStartCol == _nEndCol) {
					_nStartColWidth -= _p.width;
					_nEndColWidth = _nStartColWidth;
				} else {
					_nEndColWidth = Math.round(this.getCurrentWidthOfCol(e.panel, _nEndCol)) - 2;
					_nEndColWidth -= _p.width;
				}

				switch (this.timeScale) {
					case TimeScaleEnum.QuarterHour:
						_nShiftStart = Math.round(
							(_dtStart.getMinutes() % 15) * (_nStartColWidth / 15)
						);
						_nShiftEnd =
							_nEndColWidth -
							Math.round((_dtEnd.getMinutes() % 15) * (_nEndColWidth / 15));
						break;
					case TimeScaleEnum.HalfHour:
						_nShiftStart = Math.round(
							(_dtStart.getMinutes() % 30) * (_nStartColWidth / 30)
						);
						_nShiftEnd =
							_nEndColWidth -
							Math.round((_dtEnd.getMinutes() % 30) * (_nEndColWidth / 30));
						break;
					case TimeScaleEnum.Hour:
						_nShiftStart = Math.round(_dtStart.getMinutes() * (_nStartColWidth / 60));
						_nShiftEnd = Math.round(
							(60 - (_dtEnd.getMinutes() + 1)) * (_nEndColWidth / 60)
						);
						break;
					case TimeScaleEnum.HalfDay:
						_nShiftStart = Math.round(
							(_dtStart.getHours() % 12) * (_nStartColWidth / 12)
						);
						_nShiftEnd =
							_nEndColWidth -
							Math.round((_dtEnd.getHours() % 12) * (_nEndColWidth / 12));
						break;
					case TimeScaleEnum.Day:
					case TimeScaleEnum.DayOfWeek:
						_nShiftStart = Math.round(_dtStart.getHours() * (_nStartColWidth / 24));
						_nShiftEnd = Math.round(
							(24 - (_dtEnd.getHours() + 1)) * (_nEndColWidth / 24)
						);
						break;
					case TimeScaleEnum.Month:
						let _nDaysInMonth = new Date(
							_dtStart.getFullYear(),
							_dtStart.getMonth(),
							0
						).getDate();
						_nShiftStart = Math.round(
							(_dtStart.getDay() - 1) * (_nStartColWidth / _nDaysInMonth)
						);

						_nDaysInMonth = new Date(
							_dtEnd.getFullYear(),
							_dtEnd.getMonth(),
							0
						).getDate();
						_nShiftEnd = Math.round(
							(_nDaysInMonth - _dtEnd.getDay()) * (_nEndColWidth / _nDaysInMonth)
						);
						break;
					case TimeScaleEnum.Quarter:
						let _nQuarterNo = (_dtStart.getMonth() + 1) % 3;
						if (_nQuarterNo == 2) _nShiftStart = Math.round(_nStartColWidth / 3);
						_nQuarterNo = (_dtEnd.getMonth() + 1) % 3;
						if (_nQuarterNo == 2) _nShiftEnd = Math.round(_nEndColWidth / 3);
						break;
					case TimeScaleEnum.Year:
						_nShiftStart = Math.round(
							(_dtStart.getMonth() - 1) * (_nStartColWidth / 12)
						);
						_nShiftEnd = Math.round((12 - _dtEnd.getMonth()) * (_nEndColWidth / 12));
						break;
				}

				if (_nShiftStart > _nStartColWidth - _nStartMarkWidth)
					_nShiftStart = _nStartColWidth - _nStartMarkWidth;
				if (_nShiftEnd > _nEndColWidth - _nEndMarkWidth)
					_nShiftEnd = _nEndColWidth - _nEndMarkWidth;
			}

			if (_bDrawMultiCells || (e.col >= _nStartCol && e.col <= _nEndCol)) {
				if (this.ganttBarColorType != GanttBarColorTypeEnum.Default) {
					if (
						this.ganttBarColorType == GanttBarColorTypeEnum.AbsoluteValue &&
						!dr.isNull(this.zBarColorMember)
					) {
						const _clr = wjc.Color.fromString(dr.getValue(this.zBarColorMember));
						if (_clr instanceof wjc.Color && !_clrBack.equals(_clr)) _clrBack = _clr;
					} else if (this.ganttBarColorType == GanttBarColorTypeEnum.AutoValue) {
						if (!this._colorDictionary) this._colorDictionary = new Map();

						let _zColorKey: string = '';
						let _zKeyColName = !String.isNullOrEmpty(this.zBarColorMember)
							? this.zBarColorMember
							: this.zDisplayTextMember;
						if (!String.isNullOrEmpty(_zKeyColName))
							_zColorKey = dr.getValue(_zKeyColName);

						if (String.isNullOrEmpty(_zColorKey))
							_zColorKey = String.format(
								'{0}',
								(pnChildRowIndex == -1 ? e.row : pnChildRowIndex) + 1
							);

						if (this._colorDictionary.has(_zColorKey)) {
							_clrBack = this._colorDictionary.get(_zColorKey);
						} else {
							let _clr = wjc.Color.fromString('transparent');
							let _nIndex = this._colorDictionary.size;
							if (
								_nIndex >= 0 &&
								_nIndex < BravoCustomColorTheme.customColorTheme.length
							)
								_clr = BravoCustomColorTheme.customColorTheme[_nIndex];

							if (!this.isValidRandomColor(_clr)) {
								while (
									!this.isValidRandomColor(_clr) ||
									_clr.equals(
										_csGanttBar[StyleElementFlags[StyleElementFlags.BackColor]]
									) ||
									_clr.equals(
										_csGanttBar[StyleElementFlags[StyleElementFlags.ForeColor]]
									) ||
									_clr.equals(_clrBack)
								)
									_clr = wjc.Color.fromRgba(
										Math.random() * 256 + 1,
										Math.random() * 256 + 1,
										Math.random() * 256 + 1
									);
							}

							this._colorDictionary.set(_zColorKey, _clr);
							_clrBack = _clr;
						}
					}
				}

				let _csSpecialStyle = this.styles.get(SpecialDayStyle),
					_csWeekendStyle = this.styles.get(WeekendStyle);

				if (
					_bIsSpecialDay &&
					_csSpecialStyle &&
					_csSpecialStyle[StyleElementFlags[StyleElementFlags.BackColor]]
				)
					_clrBack = wjc.Color.fromString(
						_csSpecialStyle[StyleElementFlags[StyleElementFlags.BackColor]]
					);
				else if (
					_bIsWeekend &&
					_csWeekendStyle &&
					_csWeekendStyle[StyleElementFlags[StyleElementFlags.BackColor]]
				)
					_clrBack = wjc.Color.fromString(
						_csWeekendStyle[StyleElementFlags[StyleElementFlags.BackColor]]
					);

				let _rec = e.panel.getCellBoundingRect(e.row, e.col, true);

				let _recCell = _rec.clone();
				_recCell.height -= 1;

				let _recBar = _recCell.clone();
				_recBar.top += _p.height;
				_recBar.height -= _p.height * 2;

				let _svgEngine = new wjChart._SvgRenderEngine(e.cell);
				// _svgEngine.setViewportSize(_rec.width, _rec.height);
				_svgEngine.element.setAttribute('style', 'position:absolute;top:0;left:0');
				_svgEngine.beginRender();

				try {
					let _recFill = _recBar.inflate(0, -1);

					if (e.col == _nStartCol || _bDrawMultiCells) {
						_recBar.left += _nShiftStart;
						_recFill.left += _nShiftStart;

						_recBar.width -= _nShiftStart;
						_recFill.width -= _nShiftStart;

						_recBar.left += _p.width;
						_recBar.width -= _p.width;

						_recFill.left += _p.width + _nStartMarkWidth;
						_recFill.width -= _p.width + _nStartMarkWidth;
					}

					if (e.col == _nEndCol || _bDrawMultiCells) {
						_recBar.width -= _nShiftEnd;
						_recFill.width -= _nShiftEnd;

						_recBar.width -= _p.width;
						_recFill.width -= _p.width + _nEndMarkWidth;
					}

					if (_recFill.width > 0 && _recFill.height > 0) {
						e.cell.style.padding = '0';
						if (e.col >= _nStartCol && e.col < _nEndCol)
							e.cell.classList.add('no-border-right');

						_svgEngine.drawRect(
							_recFill.left - _rec.left,
							_recFill.top - _rec.top,
							Math.round(_recFill.width) + 1,
							_recFill.height,
							null,
							{ fill: _clrBack.toString() }
						);
					}

					if (e.col == _nStartCol || e.col == _nEndCol || _bDrawMultiCells) {
						let _cs = this.styles.get(MarkingStyle);
						if (_cs && _cs[StyleElementFlags[StyleElementFlags.BackColor]])
							_clrBack = wjc.Color.fromString(
								_cs[StyleElementFlags[StyleElementFlags.BackColor]]
							);

						if (e.col == _nStartCol || _bDrawMultiCells) {
							if ((this.startTimeMarking & TimeMarkingEnum.Cell) != 0) {
								let _r1 = _recFill.clone();
								if (_nStartCol == _nEndCol) _r1.width -= 1;

								_svgEngine.drawRect(
									_r1.left - _rec.left,
									_r1.top - _rec.top,
									_r1.width,
									_r1.height,
									null,
									{ fill: _clrBack.toString() }
								);
							} else if (
								(this.startTimeMarking & TimeMarkingEnum.Base) != 0 ||
								(this.startTimeMarking & TimeMarkingEnum.Arrow) != 0
							) {
								let _r1 = new wjc.Rect(
									_recBar.left - _rec.left,
									_recCell.top - _rec.top,
									_nStartMarkWidth,
									_recCell.height
								);
								let _points = new Array<wjc.Point>();

								if ((this.startTimeMarking & TimeMarkingEnum.Base) != 0) {
									_points.push(
										...[
											new wjc.Point(_r1.left, _r1.top),
											new wjc.Point(_r1.right, _recBar.top - _rec.top),
											new wjc.Point(
												_r1.right,
												_recBar.top - _rec.top + _recBar.height - 1
											),
											new wjc.Point(_r1.left, _r1.bottom - 1)
										]
									);
								} else if ((this.startTimeMarking & TimeMarkingEnum.Arrow) != 0) {
									_r1.inflate(1, 1);
									_points.push(
										...[
											new wjc.Point(_r1.right, _r1.top),
											new wjc.Point(_r1.left, _r1.top + _r1.height / 2),
											new wjc.Point(_r1.right, _r1.bottom - 1)
										]
									);
								}

								if (_points.length > 0) {
									let _xs = new Array<number>(),
										_ys = new Array<number>();
									_points.map((p) => {
										_xs.push(p.x);
										_ys.push(p.y);
									});
									_svgEngine.drawPolygon(_xs, _ys, null, {
										fill: _clrBack.toString()
									});
								}
							} else if ((this.startTimeMarking & TimeMarkingEnum.Bar) != 0) {
								const _r1 = new wjc.Rect(
									_recBar.left - _rec.left,
									_recCell.top - _rec.top,
									_nStartMarkWidth,
									_recCell.height
								);
								_svgEngine.drawRect(
									_r1.left,
									_r1.top,
									_r1.width,
									_r1.height,
									null,
									{ fill: _clrBack.toString() }
								);
							}
						}

						if (e.col == _nEndCol || _bDrawMultiCells) {
							if ((this.endTimeMarking & TimeMarkingEnum.Cell) != 0) {
								let _r1 = _recFill.clone();
								if (_nStartCol == _nEndCol) _r1.width -= 1;

								_svgEngine.drawRect(
									_r1.left - _rec.left,
									_r1.top - _rec.top,
									_r1.width,
									_r1.height,
									null,
									{ fill: _clrBack.toString() }
								);
							} else if (
								(this.endTimeMarking & TimeMarkingEnum.Base) != 0 ||
								(this.endTimeMarking & TimeMarkingEnum.Arrow) != 0
							) {
								let _r1 = new wjc.Rect(
									_recBar.right - _rec.left - _nEndMarkWidth,
									_recCell.top - _rec.top,
									_nEndMarkWidth,
									_recCell.height
								);

								let _points = new Array<wjc.Point>();

								if ((this.endTimeMarking & TimeMarkingEnum.Base) != 0) {
									_points.push(
										...[
											new wjc.Point(_r1.left, _recBar.top - _rec.top),
											new wjc.Point(_r1.right, _r1.top),
											new wjc.Point(_r1.right, _r1.bottom - 1),
											new wjc.Point(_r1.left, _recBar.bottom - _rec.top - 1)
										]
									);
								} else if ((this.endTimeMarking & TimeMarkingEnum.Arrow) != 0) {
									_r1.inflate(1, 1);
									_points.push(
										...[
											new wjc.Point(_r1.left, _r1.top),
											new wjc.Point(_r1.right, _r1.top + _r1.height / 2),
											new wjc.Point(_r1.left, _r1.bottom - 1)
										]
									);
								}

								if (_points.length > 0) {
									let _xs = new Array<number>(),
										_ys = new Array<number>();
									_points.map((p) => {
										_xs.push(p.x);
										_ys.push(p.y);
									});
									_svgEngine.drawPolygon(_xs, _ys, null, {
										fill: _clrBack.toString()
									});
								}
							} else if ((this.endTimeMarking & TimeMarkingEnum.Bar) != 0) {
								const _r1 = new wjc.Rect(
									_recBar.right - _rec.left - _nEndMarkWidth,
									_recCell.top - _rec.top,
									_nEndMarkWidth,
									_recCell.height
								);

								_svgEngine.drawRect(
									_r1.left,
									_r1.top,
									_r1.width,
									_r1.height,
									null,
									{ fill: _clrBack.toString() }
								);
							}
						}
					}

					if (
						(e.col >= _nStartCol || _bDrawMultiCells) &&
						this.isCellValid(e.row, _nStartCol) &&
						!String.isNullOrEmpty(this.zDisplayTextMember)
					) {
						let _zText = dr.getValue(this.zDisplayTextMember);

						let _nTextCol2 = _nEndCol;
						if (_nTextCol2 > e.panel.columns.length - 1)
							_nTextCol2 = e.panel.columns.length - 1;

						if (_nTextCol2 > this.nEndGanttCol) _nTextCol2 = this.nEndGanttCol;

						let _nTextCol1 = _nStartCol;
						if (_nTextCol1 < this.nStartGanttCol) _nTextCol1 = this.nStartGanttCol;

						let _rec1 = _bDrawMultiCells
							? _rec
							: e.panel.getCellBoundingRect(e.row, _nTextCol1, true);

						let _rectText = _rec1.clone();
						_rectText.width =
							(e.panel.columns[_nTextCol2] as wjg.Column).renderWidth +
							(e.panel.columns[_nTextCol2] as wjg.Column).pos -
							(e.panel.columns[_nTextCol1] as wjg.Column).pos;

						if (_nTextCol1 == _nStartCol) {
							_rectText.left +=
								_nStartMarkWidth + this.ganttBarPadding.width + _nShiftStart;
							_rectText.width -=
								_nStartMarkWidth + this.ganttBarPadding.width + _nShiftStart;
						}

						if (_nTextCol2 == _nEndCol)
							_rectText.width -=
								_nEndMarkWidth + this.ganttBarPadding.width + _nShiftEnd;

						if (e.col == _nTextCol1) {
							let _cs = _csGanttBar.clone();
							_cs[StyleElementFlags[StyleElementFlags.BackColor]] = 'transparent';
							let _css = CellStyle.buildCss(_cs, null, this.defaultBorderColor);
							if (_css == null) _css = {};
							_css['position'] = 'absolute';
							_css['top'] = '2px';
							_css['left'] = _rectText.left - _rec1.left;
							_css['width'] = Math.max(_rectText.width, 0);
							_css['height'] = `${
								_rectText.height - this.ganttBarPadding.height * 2
							}px`;
							_css['zIndex'] = 1;
							_css['white-space'] = 'pre';
							_css['overflow'] = 'hidden';

							delete _css['display'];
							delete _css['justify-content'];

							let _div = document.createElement('div');
							_div.textContent = _zText;
							wjc.setCss(_div, _css);

							e.cell.appendChild(_div);

							if (
								(e.panel.columns[e.col] as wjg.Column).renderWidth <
								_rectText.left - _rec1.left + _rectText.width
							)
								e.cell.style.width = `${
									_rectText.left - _rec1.left + _rectText.width
								}px`;
						}
					}
				} finally {
					_svgEngine.endRender();
				}
			}
		} finally {
		}
	}

	private isValidRandomColor(pColor: wjc.Color) {
		if (pColor.equals(wjc.Color.fromString('transparent'))) return false;

		if (this._colorDictionary) {
			const _colors = Array.from(this._colorDictionary.values());
			if (_colors.findIndex((c) => c.equals(pColor)) >= 0) return false;
		}

		let _styles = this.styles.values();
		for (const _cs of _styles) {
			if (
				pColor.equals(_cs[StyleElementFlags[StyleElementFlags.ForeColor]]) ||
				pColor.equals(_cs[StyleElementFlags[StyleElementFlags.BackColor]])
			)
				return false;
		}

		return true;
	}

	private getGanttGroupType(pnRow: number) {
		let _gr = wjc.tryCast(this.rows[pnRow], wjg.GroupRow) as wjg.GroupRow;
		if (
			this.ganttChartAutoGroup == GanttGroupTypeEnum.None ||
			!_gr ||
			_gr.level == -1 ||
			this.isTreeNodeMode()
		)
			return GanttGroupTypeEnum.None;

		return _gr.level == this.groups.size - 1
			? GanttGroupTypeEnum.Merged
			: GanttGroupTypeEnum.None;
	}

	private getGanttChartColumnHeader(pnRow: number, pnCol: number) {
		if (this.gridMode != GridModeEnum.GanttChart || !this.isGanttChartCol(pnCol) || pnCol < 0)
			return String.empty;

		const _gr = this.getGlyphRow();
		const _bIsGroupText = _gr - 1 == pnRow;

		let _zFormat: string;
		let _cs = this.styles.get(GanttGroupTimeScaleStyle);
		if (
			_bIsGroupText &&
			_cs &&
			!String.isNullOrEmpty(_cs[StyleElementFlags[StyleElementFlags.Format]])
		) {
			_zFormat = _cs[StyleElementFlags[StyleElementFlags.Format]];
		} else {
			_cs = this.styles.get(GanttTimeScaleStyle);
			if (_cs) _zFormat = _cs[StyleElementFlags[StyleElementFlags.Format]];

			if (String.isNullOrEmpty(_zFormat)) {
				switch (this.timeScale) {
					case TimeScaleEnum.QuarterHour:
					case TimeScaleEnum.HalfHour:
						_zFormat = 'HH:mm';
						break;
					case TimeScaleEnum.Hour:
						_zFormat = 'HH';
						break;
					case TimeScaleEnum.HalfDay:
						_zFormat = 'tt';
						break;
					case TimeScaleEnum.Day:
						_zFormat = 'dd';
						break;
					case TimeScaleEnum.DayOfWeek:
						_zFormat = 'ddd';
						break;
					case TimeScaleEnum.Month:
					case TimeScaleEnum.Quarter:
						_zFormat = 'MMM';
						break;
					case TimeScaleEnum.Year:
						_zFormat = 'yyyy';
						break;
				}
			}
		}

		if (String.isNullOrEmpty(_zFormat)) return String.empty;

		const _culture = new clrFormat.Globalization.CultureInfo(
			BravoResourceManager.current.currentLang
		);
		return clrFormat(_culture, `{0:${_zFormat}}`, this.getDateTimeFromCol(pnCol));
	}

	public getDateTimeFromCol(col: number) {
		let _nVal = col - this.nStartGanttCol;
		switch (this.timeScale) {
			case TimeScaleEnum.QuarterHour: {
				let _dt = DateTime.addMinutes(this.minimumTime, _nVal * 15);
				if (_dt.getMinutes() < 15)
					return new Date(_dt.year(), _dt.getMonth(), _dt.day(), _dt.getHours(), 0, 0);
				else if (_dt.getMinutes() >= 15 && _dt.getMinutes() < 30)
					return new Date(_dt.year(), _dt.getMonth(), _dt.day(), _dt.getHours(), 15, 0);
				else if (_dt.getMinutes() >= 30 && _dt.getMinutes() < 45)
					return new Date(_dt.year(), _dt.getMonth(), _dt.day(), _dt.getHours(), 30, 0);
				else if (_dt.getMinutes() >= 45 && _dt.getMinutes() < 60)
					return new Date(_dt.year(), _dt.getMonth(), _dt.day(), _dt.getHours(), 45, 0);

				return _dt;
			}
			case TimeScaleEnum.HalfHour: {
				let _dt = DateTime.addMinutes(this.minimumTime, _nVal * 30);
				if (_dt.getMinutes() < 30)
					return new Date(_dt.year(), _dt.getMonth(), _dt.day(), _dt.getHours(), 0, 0);

				return new Date(_dt.year(), _dt.getMonth(), _dt.day(), _dt.getHours(), 30, 0);
			}
			case TimeScaleEnum.Hour:
				return DateTime.addHours(this.minimumTime, _nVal);

			case TimeScaleEnum.HalfDay:
				return DateTime.addHours(this.minimumTime.date(), _nVal * 12);

			case TimeScaleEnum.Day:
			case TimeScaleEnum.DayOfWeek:
				return DateTime.addDays(this.minimumTime, _nVal);

			case TimeScaleEnum.Month:
				return DateTime.addMonths(this.minimumTime, _nVal);

			case TimeScaleEnum.Quarter:
				return DateTime.addMonths(this.minimumTime, _nVal * 3);

			case TimeScaleEnum.Year:
				return DateTime.addYears(this.minimumTime, _nVal);
		}

		return Date.minValue;
	}

	private getColFromDateTime(pdtDateTime: Date) {
		let _ts = new TimeSpan(pdtDateTime.getTime() - this.minimumTime.getTime());
		if (this.autoMinMaxTime == AutoMinMaxTimeEnum.None) {
			if (
				(this.timeScale == TimeScaleEnum.HalfHour ||
					this.timeScale == TimeScaleEnum.QuarterHour ||
					this.timeScale == TimeScaleEnum.Hour) &&
				DateTime.equals(this.minimumTime.date(), this.maximumTime.date())
			) {
				const _dt = new Date(
					this.minimumTime.year(),
					this.minimumTime.getMonth(),
					this.minimumTime.getDate(),
					pdtDateTime.getHours(),
					pdtDateTime.getMinutes(),
					pdtDateTime.getSeconds(),
					pdtDateTime.getMilliseconds()
				);
				_ts = new TimeSpan(_dt.getTime() - this.minimumTime.getTime());
			}
		}

		switch (this.timeScale) {
			case TimeScaleEnum.QuarterHour:
				return (
					this.nStartGanttCol +
					Math.floor(_ts.totalMinutes / 15) +
					Math.floor(pdtDateTime.getMinutes() / 15)
				);

			case TimeScaleEnum.HalfHour:
				return (
					this.nStartGanttCol +
					Math.floor(_ts.totalMinutes / 30) +
					Math.floor(pdtDateTime.getMinutes() / 30)
				);

			case TimeScaleEnum.Hour:
				let _nHours = Math.ceil(_ts.totalHours);
				return this.nStartGanttCol + _nHours;

			case TimeScaleEnum.HalfDay:
				_ts = new TimeSpan(pdtDateTime.getTime() - this.minimumTime.date().getTime());
				return this.nStartGanttCol + Math.floor(_ts.totalHours / 12);

			case TimeScaleEnum.Day:
			case TimeScaleEnum.DayOfWeek:
				let _nDays = Math.ceil(_ts.totalDays);
				return this.nStartGanttCol + _nDays;

			case TimeScaleEnum.Month:
				let _nMonths =
					12 * pdtDateTime.year() +
					pdtDateTime.month() -
					(12 * this.minimumTime.year() + this.minimumTime.month());
				return this.nStartGanttCol + _nMonths;

			case TimeScaleEnum.Quarter:
				let _nQuarters = Math.ceil(
					(12 * pdtDateTime.year() +
						pdtDateTime.month() -
						(12 * this.minimumTime.year() + this.minimumTime.month())) /
						3
				);
				return this.nStartGanttCol + _nQuarters;

			case TimeScaleEnum.Year:
				let _nYears = pdtDateTime.year() - this.minimumTime.year();
				return this.nStartGanttCol + _nYears;
		}

		return -1;
	}

	_cvCollectionChanged(s, e: wjc.NotifyCollectionChangedEventArgs) {
		if (this.gridMode == GridModeEnum.GanttChart) this.calcAutoMinMaxTime();

		super._cvCollectionChanged(s, e);
	}

	protected nStartGanttCol: number = -1;
	protected nEndGanttCol: number = -1;

	private _zCurrentGanttColumns: string = null;

	protected calcAutoMinMaxTime(pbReset?: boolean) {
		if (
			String.isNullOrEmpty(this.zStartTimeMember) ||
			String.isNullOrEmpty(this.zEndTimeMember)
		)
			return;

		let _bNeedToReset = false;

		const _bCaclMinTime = (this.autoMinMaxTime & AutoMinMaxTimeEnum.MinimumTime) != 0;
		const _bCaclMaxTime = (this.autoMinMaxTime & AutoMinMaxTimeEnum.MaximumTime) != 0;
		if (_bCaclMinTime || _bCaclMaxTime) {
			const _cv = this.collectionView;
			if (!_cv) return;

			if (_bCaclMinTime) {
				this._dtAutoMinTime = Date.minValue;
				const _o = wjc.getAggregate(wjc.Aggregate.Min, _cv.items, this.zStartTimeMember);
				if (_o) {
					let _dt1 = Date.asDate(_o);
					if (this.nAutoMinimumTimeOffset != 0)
						_dt1 = this.calcOffset(_dt1, this.nAutoMinimumTimeOffset);

					if (_dt1 != this._dtAutoMinTime) {
						this._dtAutoMinTime = _dt1;
						_bNeedToReset = true;
					}
				}
			}

			if (_bCaclMaxTime) {
				this._dtAutoMaxTime = Date.minValue;
				const _o = wjc.getAggregate(wjc.Aggregate.Max, _cv.items, this.zEndTimeMember);
				if (_o) {
					let _dt2 = Date.asDate(_o);
					if (this.nAutoMaximumTimeOffset != 0)
						_dt2 = this.calcOffset(_dt2, this.nAutoMaximumTimeOffset);

					if (_dt2 != this._dtAutoMaxTime) {
						this._dtAutoMaxTime = _dt2;
						_bNeedToReset = true;
					}
				}
			}
		}

		if (pbReset) this._zCurrentGanttColumns = null;

		if (
			!_bNeedToReset &&
			String.compare(
				this._zCurrentGanttColumns,
				String.format('{0}_{1:G}_{2:G}', this.timeScale, this.minimumTime, this.maximumTime)
			) != 0
		)
			_bNeedToReset = true;

		if (!_bNeedToReset) return;

		this.setupGanttColumns();
	}

	private calcOffset(dt: Date, offset: number) {
		switch (this.timeScale) {
			case TimeScaleEnum.QuarterHour:
				return DateTime.addMinutes(dt, Math.round((offset / 4) * 60));

			case TimeScaleEnum.HalfHour:
				return DateTime.addMinutes(dt, Math.round((offset / 2) * 60));

			case TimeScaleEnum.Hour:
				return DateTime.addHours(dt, offset);

			case TimeScaleEnum.HalfDay:
				return DateTime.addDays(dt, offset / 2);

			case TimeScaleEnum.Day:
			case TimeScaleEnum.DayOfWeek:
				return DateTime.addDays(dt, offset);

			case TimeScaleEnum.Month:
				return DateTime.addMonths(dt, offset);

			case TimeScaleEnum.Quarter:
				return DateTime.addMonths(dt, offset * 3);

			case TimeScaleEnum.Year:
				return DateTime.addYears(dt, offset);
		}

		return dt;
	}

	private setupGanttColumns() {
		let _nTotalCol = -1;

		switch (this.timeScale) {
			case TimeScaleEnum.QuarterHour:
				{
					let _ts = new TimeSpan(this.maximumTime.getTime() - this.minimumTime.getTime());
					_nTotalCol = (Math.ceil(_ts.totalHours) + 1) * 4;
				}
				break;
			case TimeScaleEnum.HalfHour:
				{
					let _ts = new TimeSpan(this.maximumTime.getTime() - this.minimumTime.getTime());
					_nTotalCol = (Math.ceil(_ts.totalHours) + 1) * 2;
				}

				break;
			case TimeScaleEnum.Hour:
				{
					let _ts = new TimeSpan(this.maximumTime.getTime() - this.minimumTime.getTime());
					_nTotalCol = Math.ceil(_ts.totalHours) + 1;
				}

				break;
			case TimeScaleEnum.HalfDay:
				{
					let _ts = new TimeSpan(
						this.maximumTime.date().getTime() - this.minimumTime.date().getTime()
					);
					_nTotalCol = (Math.ceil(_ts.totalDays) + 1) * 2;
				}
				break;
			case TimeScaleEnum.Day:
			case TimeScaleEnum.DayOfWeek:
				{
					let _ts = new TimeSpan(this.maximumTime.getTime() - this.minimumTime.getTime());
					_nTotalCol = Math.ceil(_ts.totalDays * 2) + 1;
				}

				break;
			case TimeScaleEnum.Month:
				{
					let _nMonths =
						12 * this.maximumTime.year() +
						this.maximumTime.month() -
						(12 * this.minimumTime.year() + this.minimumTime.month());
					_nTotalCol = _nMonths + 1;
				}

				break;
			case TimeScaleEnum.Quarter:
				{
					let _nMonths =
						12 * this.maximumTime.year() +
						this.maximumTime.month() -
						(12 * this.minimumTime.year() + this.minimumTime.month());
					_nTotalCol = Math.ceil(_nMonths / 3) + 1;
				}

				break;
			case TimeScaleEnum.Year:
				_nTotalCol = this.maximumTime.year() - this.minimumTime.year();
				break;
		}

		if (_nTotalCol == -1) return;

		if (this.nTimeScaleLimit > 0 && _nTotalCol > this.nTimeScaleLimit)
			_nTotalCol = this.nTimeScaleLimit;

		let _bLastUpdate = this.isUpdating;
		if (!_bLastUpdate) this.beginUpdate();

		try {
			for (let _nCol = this.columns.length - 1; _nCol >= 0; _nCol--) {
				if (this.isGanttChartCol(_nCol)) {
					if (_nTotalCol > 0) _nTotalCol--;
					else this.columns.removeAt(_nCol);
				}
			}

			if (_nTotalCol > 0) {
				let _nCount = this.columns.length + _nTotalCol;

				for (let _nCol = 0; _nCol < _nCount; _nCol++) {
					let _col: wjg.Column = this.columns[_nCol];
					if (_col && !String.isNullOrEmpty(_col.name)) continue;

					if (_col == null) {
						_col = new wjg.Column();
						this.columns.push(_col);
					}

					_col.allowDragging = false;
					_col.allowResizing = false;

					setIgnored(_col, true);
				}
			}

			let _nDefaultSize = -1;
			for (let _nCol = 0; _nCol < this.columns.length; _nCol++) {
				if (this.isGanttChartCol(_nCol)) {
					if (this.nStartGanttCol == -1) this.nStartGanttCol = _nCol;

					this.nEndGanttCol = _nCol;

					if (_nDefaultSize == -1) _nDefaultSize = this.getGanttColSize();

					this.columns[_nCol].width = _nDefaultSize;
				}
			}

			this._zCurrentGanttColumns = String.format(
				'{0}_{1:G}_{2:G}',
				this.timeScale,
				this.minimumTime,
				this.maximumTime
			);
		} finally {
			if (!_bLastUpdate) this.endUpdate();
		}
	}

	private getGanttColSize() {
		const _gr = this.getGlyphRow();
		const _cs = this.styles.get(GanttTimeScaleStyle);

		const _font =
			_cs && _cs[StyleElementFlags[StyleElementFlags.Font]]
				? Font.parseFont(_cs[StyleElementFlags[StyleElementFlags.Font]])
				: new Font(BravoSettings.current.zDefaultFontName, BravoSettings.current.nFontSize);

		let _nPadding = this.nTimeScaleColumnWidthPadding;

		let _zCaption = this.getGanttChartColumnHeader(_gr, this.nStartGanttCol);
		if (String.isNullOrEmpty(_zCaption)) return -1;

		let _sF = BravoGraphicsRenderer.measureString(_zCaption, _font);
		let _nWidth =
			!_cs ||
			!_cs[StyleElementFlags[StyleElementFlags.TextDirection]] ||
			_cs[StyleElementFlags[StyleElementFlags.TextDirection]] == TextDirectionEnum.Normal
				? _sF.width
				: _sF.height;

		if (this.timeScale == TimeScaleEnum.HalfDay) {
			const _zCaption1 = String.format('{0:dd/MM/yy}', DateTime.now);
			const _sF1 = BravoGraphicsRenderer.measureString(_zCaption1, _font);
			const _nWidth1 =
				!_cs ||
				!_cs[StyleElementFlags[StyleElementFlags.TextDirection]] ||
				_cs[StyleElementFlags[StyleElementFlags.TextDirection]] == TextDirectionEnum.Normal
					? _sF1.width
					: _sF1.height;
			if (_nWidth < _nWidth1) _nWidth = _nWidth1;
		}

		return _nWidth + 4 + _nPadding;

		/* switch (this.timeScale) {
            case TimeScaleEnum.Hour:
            case TimeScaleEnum.Day:
            case TimeScaleEnum.DayOfWeek:
            case TimeScaleEnum.QuarterHour:
            case TimeScaleEnum.HalfHour:
            case TimeScaleEnum.Month:
            case TimeScaleEnum.Quarter:
            case TimeScaleEnum.Year: {
                let _sF = BravoGraphicsRenderer.measureString(this.getGanttChartColumnHeader(_gr, this.nStartGanttCol),
                    _font);
                return _sF.width + 4 + _nPadding;
            }
            default:
                return -1;
        } */
	}

	public raiseOnInsertingNewRow() {
		if (!this.allowAddNew || this.readOnly || !this.insertingNewRow.hasHandlers) return;

		const _e = new UnboundValueEventArgs(this.selection.row, -1, null);

		let _bLastUpdating = this.isUpdating;
		if (!_bLastUpdating) this.beginUpdate();

		try {
			this.insertingNewRow.raise(this, _e);
			this.raiseOnContentHeightChanged();
			return _e.value;
		} finally {
			if (this.hostElement) {
				if (this.selection.isValid)
					this.scrollIntoView(this.selection.row, this.selection.col);

				if (!_bLastUpdating) this.endUpdate();
			}
		}
	}

	public refreshCells(fullUpdate: boolean, recycle?: boolean, state?: boolean) {
		super.refreshCells(fullUpdate, recycle, state);
		this.refreshStyle();
	}

	private refreshStyle() {
		if (this._styleCss && this.styleCss.count > 0) {
			let _sb: StringBuilder, _zSelector: string, _index: number, _styleSheet: CSSStyleSheet;
			for (let _i = 0; _i < this.styleCss.count; _i++) {
				let _style = this.styleCss.get(_i);
				if (_style != null) {
					let _css: StyleCssData =
						_style.value instanceof StyleCssData ? _style.value : null;
					if (_css == null) continue;

					_sb = new StringBuilder();
					_zSelector = String.format(
						'#{0} .{1} .wj-cell.{2}:not(.cell-rtf1)',
						this.id,
						_css.cellType == wjg.CellType.ColumnHeader ? 'wj-colheaders' : 'wj-cells',
						_style.key
					);

					_sb.append(_zSelector);
					_sb.append('{');
					_sb.append(BravoCore.toCssString(_css.data));
					_sb.appendLine('}');

					_styleSheet = <CSSStyleSheet>this.styleElement.sheet;
					if (_styleSheet == null) continue;

					try {
						_index = indexOfRule(_zSelector, _styleSheet.cssRules);

						if (_index != -1) _styleSheet.deleteRule(_index);

						(<CSSStyleSheet>this.styleElement.sheet).insertRule(
							_sb.toString(),
							_styleSheet.cssRules.length
						);
					} catch (_ex) {
						console.log(_ex);
					}
				}
			}
		}
	}

	public collapseGroupsToLevel(level: number, pIsDeep?: boolean) {
		try {
			/*if (!this.bGroupInColumn && pIsDeep == null) {
               super.collapseGroupsToLevel(level);
               return;
            }
     
            if (this.finishEditing()) {
               this.deferUpdate(() => {
                  let rows = this.rows;
                  rows.deferUpdate(() => {
                     for (let r = 0; r < rows.length; r++) {
                        let gr = rows[r];
                        if (gr instanceof wjg.GroupRow) {
                           let _flag = pIsDeep ? gr.level < level : gr.level == level;
                           gr.isCollapsed = _flag;
                        }
                     }
                  });
               });
            }*/

			if (this.finishEditing()) {
				this.deferUpdate(() => {
					let rows = this.rows;
					rows.deferUpdate(() => {
						for (let r = rows.length - 1; r >= 0; r--) {
							let gr = rows[r];
							if (gr instanceof wjg.GroupRow) {
								let _flag = pIsDeep ? gr.level < level : gr.level == level;

								if (!this.bGroupInColumn && this.isHiddenRow(gr)) continue;

								if (gr.level > level) continue;

								gr.isCollapsed = _flag;
							}
						}
					});
				});
			}
		} finally {
			this.raiseOnContentHeightChanged(new RowColEventArgs(this.cells, -1, -1));
		}
	}

	public isGanttChartCol(col: number) {
		if (col < 0 || col >= this.columns.length) return false;

		return String.isNullOrEmpty(this.columns[col].name) && isIgnored(this.columns[col]);
	}

	public isAddNewRow(row: number | wjg.Row) {
		if (row instanceof wjg.Row) return row instanceof _NewRowTemplate;

		if (row < 0 || row >= this.rows.length) return false;

		return this.isAddNewRow(this.rows[row]);
	}

	public isCellButton(pnRow: number, pnCol: number) {
		if (!this.isCellValid(pnRow, pnCol)) return false;

		if (this.onCheckCellButton.hasHandlers) {
			let _e = new RowColEventArgs(this.cells, pnRow, pnCol);
			this.onCheckCellButton.raise(this, _e);
			return !_e.cancel;
		}

		const _row = this.rows[pnRow];
		if (!this.isAddNewRow(pnRow)) {
			if (_row instanceof wjg.GroupRow) return false;
			if (this.itemsSource && this.getDataIndex(pnRow) < 0) return false;
		}

		const _col = this.columns[pnCol];
		const _editor = _col[BravoWebGrid.GridColumEditorProp];
		const _label = wjc.tryCast(_editor, 'IBravoLabel');

		return _editor instanceof BravoButton || _label != null;
	}

	public isHiddenRow(row: wjg.Row | number) {
		let _nRowIndex = row instanceof wjg.Row ? row.index : row;
		if (_nRowIndex < 0 || _nRowIndex > this.rows.length) return false;

		let _row = <wjg.Row>this.rows[_nRowIndex];
		if (_row == null) return false;

		return !_row.allowDragging && !_row.allowResizing && !_row.isReadOnly; //&& !_row.visible;
	}

	public isCellCursor(pnRow: number, pnCol: number) {
		if (!this.selection && !this.selection.isValid) return false;

		if (this.selection.row2 == pnRow && this.selection.col2 == pnCol) return true;

		return false;
	}

	public getParentNode(row) {
		// get row level
		let startLevel = row instanceof wjg.GroupRow ? row.level : null;
		let startIndex = row.index;

		// travel up to find parent node
		for (let i = startIndex - 1; i >= 0; i--) {
			let thisRow = row.grid.rows[i],
				thisLevel = thisRow instanceof wjg.GroupRow ? thisRow.level : null;

			if (thisLevel != null) {
				if (startLevel == null || (startLevel > -1 && thisLevel < startLevel))
					return thisRow;
			}
		}

		// not found
		return null;
	}

	public getChildNodes(row: wjg.Row | number) {
		if (Number.isNumber(row)) row = this.rows[row as number];

		const _groupRow = row instanceof wjg.GroupRow ? row : null;
		if (_groupRow == null || !_groupRow.hasChildren) return;

		return BravoWebGrid.getChildNodes(_groupRow);
	}

	public static getChildNodes(row: wjg.GroupRow) {
		let _g = row.grid;

		const _arr = new Array();
		const _rg = row.getCellRange();
		for (let _i = _rg.topRow + 1; _i <= _rg.bottomRow; _i++) {
			const _row = _g.rows[_i];
			if (_row instanceof wjg.GroupRow && row.level + 1 == _row.level) _arr.push(_row);
		}

		return _arr;
	}

	public static getAllChildNodes(row: wjg.GroupRow) {
		let _g = row.grid;

		const _arr = new Array();
		const _rg = row.getCellRange();
		for (let _i = _rg.topRow + 1; _i <= _rg.bottomRow; _i++) {
			const _row = _g.rows[_i];
			if (_row instanceof wjg.GroupRow) _arr.push(_row);
		}

		return _arr;
	}

	public onSelectionChanging(e: wjg.CellRangeEventArgs) {
		if (this.selection) e['oldRange'] = this.selection.clone();

		if (!this._bAllowSortingBase) return super.onSelectionChanging(e);

		let _bSelection = super.onSelectionChanging(e);

		if (e.panel.cellType == wjg.CellType.Cell) {
			if (
				e.range.isValid &&
				!e.range.isSingleCell &&
				this.selectionMode != wjg.SelectionMode.CellRange
			) {
				this.selectionMode = wjg.SelectionMode.CellRange;
			} else if (
				this.bHighlightEntireCurrentRow &&
				(!e.range.isValid || e.range.isSingleCell) &&
				this.selectionMode == wjg.SelectionMode.CellRange
			) {
				this._selHdl['_sel'] = e.range;
				this.selectionMode = wjg.SelectionMode.RowRange;
			}
		}

		const _sel = this.selection;
		if (_sel.isValid && this.allowEditing && _sel.isSingleCell) {
			const _col = this.columns[_sel.col];
			if (
				_col &&
				_col[BravoWebGrid.GridColumEditorProp] &&
				this.canEditCell(_sel.row, _sel.col)
			)
				this._edtHdl['_bEditing'] = undefined;
		}

		return _bSelection;
	}

	public onGroupCollapsedChanged(e: wjg.CellRangeEventArgs) {
		super.onGroupCollapsedChanged(e);

		let _node = wjc.tryCast(e.panel.rows[e.row], wjg.GroupRow) as wjg.GroupRow;
		if (_node == null) return;

		if (this.bGroupInColumn) this.toggleRowVisibility(_node, _node.isCollapsed);

		if (_node.level >= 0 && !this._bUpdateGroupFlag) this.saveNodeState(_node);

		if (!this.isUpdating)
			this.raiseOnContentHeightChanged(new RowColEventArgs(e.panel, e.row, -1));
	}

	public onResizedColumn(e: wjg.CellRangeEventArgs) {
		super.onResizedColumn(e);
		if (!this.isUpdating)
			this.raiseOnContentWidthChanged(new RowColEventArgs(e.panel, -1, e.col));
	}

	public onResizedRow(e: wjg.CellRangeEventArgs) {
		super.onResizedRow(e);
		if (!this.isUpdating)
			this.raiseOnContentHeightChanged(new RowColEventArgs(e.panel, e.row, -1));
	}

	public onFormatItem(e: BravoFormatItemEventArgs) {
		const _bMeasure = Boolean.asBoolean(e.cell.getAttribute(wjg.FlexGrid._WJS_MEASURE));
		const _bNoDrawing =
			this.isUpdating || e instanceof RaiseOwnerDrawCellEventArgs || _bMeasure;
		const _columns = e.panel.columns,
			_rows = e.panel.rows,
			_col = _columns[e.col] as wjg.Column,
			_row = _rows[e.row] as wjg.Row,
			_ct = e.panel.cellType,
			_groupRow = _row instanceof wjg.GroupRow ? _row : null;

		let _bExcludeEscHtml = false;

		const _drawCellInfo = new DrawCellInfo();
		const _customDraw = e instanceof CustomOwnerDrawCellEventArgs ? e : null;
		const _bIsFixed = _customDraw ? _customDraw.bIsFixedCell : _ct == wjg.CellType.ColumnHeader;
		const _bIsNew = _customDraw ? _customDraw.bIsAddNewRow : this.isAddNewRow(e.row);

		BravoFormatItemEventArgs.reset(e);

		if (this.allowAddNew) {
			const _bNewRow = _bIsNew && _row instanceof _NewRowTemplate;
			if (_bNewRow) {
				if (_ct == wjg.CellType.Cell) {
					super.onFormatItem(e);

					if (e.cancel) return;
					e.cancel = true;

					if (!_bNoDrawing) {
						if (
							(!this.selection.isValid || !this.selection.containsRow(e.row)) &&
							!String.isNullOrEmpty(this.zNewRowText)
						) {
							const _rect = new wjc.Rect(
								this._eCt.offsetLeft,
								_row.pos + this._eCHdr.scrollHeight + this.scrollPosition.y,
								this.cells.width,
								_row.renderSize
							);

							this.renderCellNewRow(e, _rect);
							return;
						}

						if (_col.dataType == wjc.DataType.Boolean) {
							e.cell.textContent = null;
							return;
						}
					}
				}
			}
		}

		if (!e.cellStyle) e.cellStyle = BravoWebGrid.getCellStyle(e.panel, e.row, e.col);

		this.formatAutoTextCell(e, _drawCellInfo);

		let _zText: string = e.cell.textContent,
			_image: any,
			_glyph: string;

		let _bIsColGroupCell = _customDraw
			? _customDraw.bIsColGroupCell
			: _ct == wjg.CellType.Cell &&
			  this.bGroupInColumn &&
			  this.groups.size > 0 &&
			  !String.isNullOrEmpty(_col.name) &&
			  this.groups.has(_col.name) &&
			  (_groupRow == null || _groupRow.level >= 0);
		let _bIsTreeNodeCell = _customDraw
			? _customDraw.bIsTreeNodeCell
			: !_bIsColGroupCell &&
			  _ct == wjg.CellType.Cell &&
			  _groupRow != null &&
			  _groupRow.hasChildren &&
			  _groupRow.level >= 0 &&
			  e.col == this.treeColumnPos;
		let _nCellIndent = _customDraw
			? _customDraw.nCellIndent
			: e.panel.cellType == wjg.CellType.Cell
			? this.getCellIndent(e.row, e.col)
			: 0;

		let _bIsButton = _customDraw
			? _customDraw.bIsButtonCell
			: !_bIsFixed && !_bIsColGroupCell && this.isCellButton(e.row, e.col);

		let _bIsGrandTotalCell =
			this.bAllowGrandTotal &&
			_row.cssClass &&
			_row.cssClass.includes(CellStyleEnum[CellStyleEnum.GrandTotal]);

		if (_bIsColGroupCell && _groupRow && !_groupRow.isCollapsed && !this.isHiddenRow(e.row))
			this.toggleRowVisibility(_groupRow, false);

		let _zAutoHeaderNumberingText: string;
		if (
			_ct == wjg.CellType.RowHeader &&
			e.col >= 0 &&
			this.rowHeaderNumbering != RowHeaderNumberingEnum.None
		) {
			let _nPos = this.nHeaderNumberingCol;
			if (_nPos < 0) _nPos = 0;

			if (_nPos >= 0 && _nPos < this.rowHeaders.columns.length && e.col == _nPos) {
				_zText = e.panel.getCellData(e.row, e.col, true);
				if (String.isNullOrEmpty(_zText)) {
					if (
						this.rowHeaderNumbering == RowHeaderNumberingEnum.DataOnly ||
						this.isTreeNodeMode() ||
						(this.groups.size > 0 && this.bGroupInColumn)
					) {
						let _nDataIndex = this.getDataIndex(e.row);
						if (_nDataIndex >= 0)
							_zAutoHeaderNumberingText = e.cell.textContent = `${_nDataIndex + 1}`;
					} else {
						_zAutoHeaderNumberingText = e.cell.textContent = `${e.row + 1}`;
					}
				}

				if (String.isNullOrEmpty(_zAutoHeaderNumberingText))
					_zAutoHeaderNumberingText = String.format('{0}', e.row + 1);
			}
		}

		if (_bIsTreeNodeCell && this.isTreeNodeMode() && !this.isHiddenRow(e.row)) {
			if (this.countGroupChilds != GridCountGroupChildEnum.Hide) {
				let _nChildCount = this.childCount(_groupRow);
				if (_nChildCount > 0) _zText = _zText + String.format(' ({0})', _nChildCount);
			}

			_glyph = this.getTreeIcon(_groupRow);
		}

		let _cellStyle = _customDraw
			? _customDraw.cellStyle
			: e.cellStyle
			? e.cellStyle
			: BravoWebGrid.getCellStyle(e.panel, e.row, e.col);

		let _cellType = _customDraw
			? _customDraw.cellType
			: this.getCellType(e.panel, e.row, e.col, _cellStyle);

		let _fic: BravoFormatItemEventArgs;
		if (_bNoDrawing) {
			super.onFormatItem(e);

			// e.cancel = _bMeasure;
			_fic = e;

			if (e.cancel || _bMeasure) {
				this.applyStyleInCell(e.cell, _drawCellInfo);
				return;
			}
		} else {
			if (_customDraw != null) _fic = _customDraw;
			else
				_fic = new CustomOwnerDrawCellEventArgs(
					e.panel,
					e.range,
					e.cell,
					_bIsFixed,
					_cellType,
					_cellStyle,
					_bIsButton,
					false,
					false,
					false,
					_bIsColGroupCell,
					_bIsTreeNodeCell,
					_nCellIndent,
					false,
					_drawCellInfo.classStyle
				);

			_fic.data = e.data;
			_fic.cancel = e.cancel;

			super.onFormatItem(_fic);

			e.cancel = _fic.cancel;
			e.image = _fic.image;
			e.data = _fic.data;

			if (_fic.html) {
				e.html = _fic.html;
				e.bAppendHtml = _fic.bAppendHtml;
			}

			this.drawContentBorder(e, _drawCellInfo);

			if (e.cancel) {
				this.applyStyleInCell(e.cell, _drawCellInfo);
				return;
			}
		}

		if (e.image) _image = e.image;

		if (e.cell.textContent && _zText !== e.cell.textContent) _zText = e.cell.textContent;

		if (
			!_bNoDrawing &&
			this.bHeaderNumberingAutoSize &&
			e.row == e.panel.viewRange.bottomRow &&
			_zAutoHeaderNumberingText
		) {
			const _nFontSize = BravoCore.convertPxStringToNumber(e.cell.style.fontSize) || 11;
			const _zFontName = e.cell.style.fontFamily;

			const _s = BravoGraphicsRenderer.measureString(
				_zAutoHeaderNumberingText,
				new Font(_zFontName, pxToPt(_nFontSize))
			);

			let _nNeedWidth = Math.max(_s.width + 3, 14);
			_nNeedWidth += this.nHeaderNumberingPadding;

			// if (_col.width != _nNeedWidth || e.panel.height > e.panel.grid.hostElement.clientHeight) {
			//     _col.width = _nNeedWidth;
			//     this.raiseOnContentWidthChanged(
			//         new RowColEventArgs(e.panel, -1, e.col)
			//     );
			// }
		}

		const _bIsNewLine = String.includeNewLine(_zText);
		const _bFitRowHeightCells =
			(this.autoFitRowHeight == GridAutoFitRowHeightEnum.All ||
				this.autoFitRowHeight == GridAutoFitRowHeightEnum.NonFixed) &&
			(this.bExistsColumnWordWrap || _bIsNewLine) &&
			_ct == wjg.CellType.Cell;
		const _bFitRowHeightFixed =
			(this.autoFitRowHeight == GridAutoFitRowHeightEnum.All ||
				this.autoFitRowHeight == GridAutoFitRowHeightEnum.Fixed) &&
			_ct != wjg.CellType.Cell;
		const _bIsHTML = _cellType == GridCellTypeEnum.html;

		if (
			this.bAutoFitRowHeight &&
			e.panel.cellType != wjg.CellType.TopLeft &&
			e.panel.cellType != wjg.CellType.RowHeader
		) {
			if (!this.bGroupInColumn || (this.bGroupInColumn && e.col != this.treeColumnPos)) {
				if (
					_row.height == null &&
					(_bFitRowHeightCells || _bFitRowHeightFixed || _bIsHTML)
				) {
					this.fitRowHeight(e.row, 0, _columns.length - 1, _fic);
					// if (_rows[e.row].height != null || _rows[e.row].height != _rows.defaultSize)
					//     this.raiseOnContentHeightChanged(new RowColEventArgs(e.panel, e.row, e.col));
				}
			}
		}

		let _css = {};

		if (_bIsButton) {
			if (!_bIsNew) {
				this.renderButtonCell(e);
				_drawCellInfo.styleCss.padding = '1px';
			}
		}
		//#region column group cell
		else if (_bIsColGroupCell) {
			e.cancel = _fic.cancel = true;

			let _parentRow: wjg.GroupRow = this.getParentNode(_row);
			if (_parentRow instanceof wjg.GroupRow && _parentRow.hasChildren) {
				if (e.col == this.treeColumnPos) _glyph = this.getTreeIcon(_parentRow);

				_drawCellInfo.styleCss.padding = '0';
				_drawCellInfo.classStyle.push(GroupInColumnStyle);
			}

			if (_groupRow == null) {
				let _zStyleName = GroupInColumnStyle + _col.name;

				let _cs = this.styles.has(_zStyleName)
					? this.styles.get(_zStyleName)
					: this.styles.has(CellStyleEnum.Subtotal0)
					? this.styles.get(CellStyleEnum.Subtotal0)
					: null;

				if (_cs instanceof CellStyle) _cs = _cs.clone();
				else _cs = new CellStyle();

				delete _cs[StyleElementFlags[StyleElementFlags.Font]];

				let _csColumn = BravoWebGrid.getColumnStyle(_col);
				if (_csColumn) _cs.mergeWith(_csColumn);

				let textAlignProp = StyleElementFlags[StyleElementFlags.TextAlign],
					_zTextAlign: string = _cs[textAlignProp];

				if (_zTextAlign && _zTextAlign.startsWith('Right'))
					_cs[textAlignProp] = 'RightCenter';
				else if (_zTextAlign && _zTextAlign.startsWith('Center'))
					_cs[textAlignProp] = 'CenterCenter';
				else _cs[textAlignProp] = 'LeftCenter';

				if (_col.dataType == wjc.DataType.String) _cs['WordWrap'] = true;

				this.addStyle(_zStyleName, _cs);

				_drawCellInfo.classStyle.push(_zStyleName);
			} else if (!_zText && _groupRow.isCollapsed) {
				_glyph = this.getTreeIcon(_groupRow);
				_zText = BravoWebGrid.getGroupHeader(_groupRow);
				_bExcludeEscHtml = true;
			}
		}
		//#endregion column group cell
		else if (_ct == wjg.CellType.Cell) {
			let _highlightTexts: Array<string>;

			if (!e.cancel && !_bNoDrawing && _zText) {
				if (this.onHighlightColumnRequired.hasHandlers) {
					let _e = new HighlightColumnEventArgs(e.row, e.col);

					this.onHighlightColumnRequired.raise(this, _e);
					if (_e.bHandled) _drawCellInfo.classStyle.push('bravo-highlight-cell');
				}

				if (
					_highlightTexts == null &&
					this.highlightColumns.size > 0 &&
					(this.highlightColumns.has(BravoWebGrid.AllColumnValue) ||
						this.highlightColumns.has(_col.name))
				) {
					_highlightTexts = this.highlightColumns.has(BravoWebGrid.AllColumnValue)
						? this.highlightColumns.get(BravoWebGrid.AllColumnValue)
						: this.highlightColumns.get(_col.name);
				}
			}

			if (!e.cancel && !_bNoDrawing && _zText && _highlightTexts) {
				const _bIsSubtotal =
					_groupRow &&
					((this.groups.size > 0 && !this.isTreeNodeMode() && !this.bGroupInColumn) ||
						_bIsGrandTotalCell);
				if (!_bIsSubtotal)
					BravoWebGridRender.fillSearchedText1(
						this,
						e,
						_highlightTexts,
						_drawCellInfo.styleCss
					);
			}

			if (e.image == null && _row['_cimg'] && _row['_cimg'][e.col]) {
				let _obj = _row['_cimg'][e.col];
				e.image = _obj;
				if (_obj instanceof HTMLElement) {
					_image = _obj;
				} else if (_obj instanceof Image) {
					_image = ExtensionsMethod.renderImage(
						_obj.src,
						_obj.extension,
						_obj.base64,
						_obj.width || 12
					);
				} else {
					_image = ExtensionsMethod.renderImage(_obj, 'svg', null, 16);
				}

				_image.style.marginRight = '3px';
			}

			let _cs = _cellStyle.clone();
			if (_cs) {
				_cs.mergeWith(this.styles.get(CellStyleEnum.Normal));
				if (_cs[StyleElementFlags[StyleElementFlags.Margins]]) {
					let _zPadding: string = _cs[StyleElementFlags[StyleElementFlags.Margins]];
					if (!String.isNullOrEmpty(_zPadding)) {
						let _margins = _zPadding.split(',');
						if (_margins.length == 4) {
							_drawCellInfo.styleCss['padding-left'] =
								+_margins[0] + this.defaultPadding.left + 'px';
							_drawCellInfo.styleCss['padding-right'] =
								+_margins[1] + this.defaultPadding.right + 'px';
							_drawCellInfo.styleCss['padding-top'] =
								+_margins[2] + this.defaultPadding.top + 'px';
							_drawCellInfo.styleCss['padding-bottom'] =
								+_margins[3] + this.defaultPadding.bottom + 'px';
						}
					}
				}
			}

			if (e.col == this.treeColumnPos && !this.bGroupInColumn) {
				if (this.rightToLeft) {
					// let _pR = BravoCore.convertPxStringToNumber(e.cell.style.paddingRight) || this.defaultPadding.right;
					_drawCellInfo.styleCss['padding-right'] = `${
						_nCellIndent + this.defaultPadding.right
					}px`;
				} else {
					// let _pL = BravoCore.convertPxStringToNumber(e.cell.style.paddingLeft) || this.defaultPadding.left;
					_drawCellInfo.styleCss['padding-left'] = `${
						_nCellIndent + this.defaultPadding.left
					}px`;
				}
			}

			if (
				_groupRow != null &&
				_groupRow.hasChildren &&
				e.col == this.treeColumnPos &&
				!this.isTreeNodeMode() &&
				!_bIsGrandTotalCell
			) {
				let _groupText: string = null;
				let _bIsUnbound = this.itemsSource == null;
				if (!_bIsUnbound) {
					let group = wjc.tryCast(
						_groupRow.dataItem,
						wjc.CollectionViewGroup
					) as wjc.CollectionViewGroup;
					if (group && group.groupDescription)
						_groupText = BravoWebGrid.getGroupHeader(_groupRow);

					if (_groupText == null) _groupText = String.empty;

					/* if (String.compare(this.zTreeColName, group.groupDescription['propertyName']) != 0 && this.isSumCol(e.col))
                        _groupText = _zText;
                    else
                        _groupText = BravoWebGrid.getGroupHeader(_groupRow); */
				} else {
					_groupText = wjc.escapeHtml(_zText);
				}

				_drawCellInfo.styleCss['display'] = 'flex';
				_drawCellInfo.styleCss['align-items'] = 'center';

				_glyph = this.getTreeIcon(_groupRow);
				_zText = _groupText;

				_bExcludeEscHtml = true;
			}

			if (_groupRow != null) {
				let _zColName = null;

				if (e.range && !e.range.isSingleCell) {
					let _leftCol = _columns[e.range.leftCol];
					if (_leftCol instanceof wjg.Column) _zColName = _leftCol.name;
				} else {
					_zColName = _col.name;
				}

				if (e.col == this.treeColumnPos && !this.isTreeNodeMode()) {
					let _nodeImg = this.getRowImage(e.panel, e.row);
					if (_nodeImg instanceof Image) {
						const _html = _nodeImg.render();
						if (_html) _glyph = _html.outerHTML;
					}
				}

				_drawCellInfo.classStyle.push(String.format('Column_{0}', _zColName));
			} else if (_col.dataType == wjc.DataType.Boolean && !_col.dataMap) {
				let _chk = e.cell.firstChild as HTMLInputElement;
				if (_chk instanceof HTMLInputElement && _chk.type == 'checkbox') {
					let _bReadOnly = this.isReadOnly || _col.isReadOnly || _row.isReadOnly;
					if (_bReadOnly) {
						_chk.removeAttribute('disabled');
						_chk.setAttribute('readOnly', 'true');
						_chk.style.pointerEvents = 'none';
					} else {
						_chk.removeAttribute('readOnly');
						_chk.style.pointerEvents = 'all';
					}

					_chk.checked = e.data == false ? false : true;
				}

				// assign editor to grid
				if (this.editRange && this.editRange.contains(e.row, e.col)) {
					this._edtHdl._edt = _chk;
				}
			}

			/* if (!ExtensionsMethod.isRtfString(_zText) && _cellType != GridCellTypeEnum.rtf && _cellType != GridCellTypeEnum.html &&
                    _zText.includes('\n') && !_zText.endsWith('\n')) {
                    wjc.setCss(e.cell, { whiteSpace: 'pre' });
                }
                else */ if (_cellType == GridCellTypeEnum.html) {
				wjc.setCss(e.cell, { whiteSpace: 'normal', display: 'flex' });
			}
		}

		if (this.autoTextMode == GridAutoTextContentEnum.NonFixed) {
			let _bIsRtfContent =
				_cellType == GridCellTypeEnum.rtf && ExtensionsMethod.isRtfString(_zText);

			_css = CellStyle.buildCss(_cellStyle, null, this.defaultBorderColor, _bIsRtfContent);
			_css['text-overflow'] = 'clip';
		}

		if (
			_bIsGrandTotalCell &&
			e.col == _columns.firstVisibleIndex &&
			e.col != this.treeColumnPos
		)
			_zText = null;

		if (_image || _glyph || e.html || String.compare(e.cell.textContent, _zText) != 0) {
			if (_image == null && _glyph == null && e.html == null) {
				e.cell.textContent = _zText;
			} else {
				let _zContent = e.html || wjc.escapeHtml(_zText);
				if (_bExcludeEscHtml) _zContent = _zText;

				if (e.bAppendHtml) {
					_zContent = String.format(
						'<div>{0} {1}</div>',
						'<div>' + wjc.escapeHtml(_zText) + '</div>',
						e.html
					);
				}

				if (_image instanceof HTMLElement)
					e.cell.innerHTML = String.format(
						'{0}{1}{2}',
						_glyph,
						_image ? _image.outerHTML : null,
						_zContent
					);
				else
					e.cell.innerHTML = String.format(
						'{0}{1}{2}',
						_glyph,
						_image,
						e.html || _zContent
					);

				if (_image instanceof HTMLInputElement) {
					let _i = e.cell.querySelector('input');
					if (_i) _i.checked = e.data;
				}

				/* if (_image instanceof HTMLElement) {
                    if (_image.outerHTML != _glyph)
                        e.cell.innerHTML = String.format("{0}{1}{2}",
                            _glyph, _image ? _image.outerHTML : null, e.html || _zText);
                    else
                        e.cell.innerHTML = String.format("{0}{1}",
                            _glyph, e.html || _zText);
                }
                else {
                    e.cell.innerHTML = String.format("{0}{1}{2}",
                        _glyph, _image, e.html || _zText);
                }
     
                if (_image instanceof HTMLInputElement) {
                    let _i = e.cell.querySelector('input');
                    if (_i) _i.checked = e.data;
                } */
			}
		}

		//#region check at tree node cell
		if (_bIsTreeNodeCell && _cellType == GridCellTypeEnum.Check) {
		}
		//#endregion check at tree node cell
		else if (_ct == wjg.CellType.ColumnHeader) {
			e.cancel = _fic.cancel = true;

			_css = CellStyle.buildCss(_cellStyle, null, this.defaultBorderColor);

			if (!_bNoDrawing) this.renderCellBackground(_fic);

			this.renderCellDirection(e.cell, _cellStyle, _col.wordWrap);

			if ((_cellStyle && !_cellStyle['TextDirection']) || !_cellStyle) {
				let _zFontSize = e.cell.style.fontSize || '9.75pt';
				let _nLine =
					Math.floor((e.cell.clientHeight - 4) / (fontSizeToPxConvert(_zFontSize) + 1)) ||
					1;

				let _css0 = {
					display: '-webkit-box',
					webkitBoxOrient: 'vertical',
					webkitLineClamp: _nLine.toString(),
					overflow: 'hidden'
				};

				if (!e.cell.firstElementChild) {
					let _oldHTML = e.cell.innerHTML;
					e.cell.innerHTML = `<span>${_oldHTML}</span>`;
				}

				wjc.setCss(e.cell.firstElementChild, _css0);
			}

			this.renderSpecialCell1(e);
		} else if (_ct == wjg.CellType.RowHeader) {
			e.cancel = _fic.cancel = true;
			if (this.bMarkDataRowState) {
				let _nPos = this.nHeaderNumberingCol;
				if (_nPos < 0 && e.col == e.panel.columns.length - 1) _nPos = e.col;

				if (_nPos >= 0 && _nPos < e.panel.columns.length && e.col == _nPos) {
					const _dr = this.getDataRowFromCell(e.row, e.col);
					const _args = new DataRowStateEventArgs(e.row, e.col);

					if (_dr) {
						_args.bHasError = _dr.hasErrors;
						_args.state = _dr.rowState;
					}

					this.onDataRowStateRequired.raise(this, _args);

					if (_args.bHasError || _args.state != DataRowState.Unchanged) {
						if (_args.bHasError) _drawCellInfo.classStyle.push('bravo-row-state-error');
						else if (_args.state != DataRowState.Unchanged)
							_drawCellInfo.classStyle.push(
								_args.state == DataRowState.Added
									? 'bravo-row-state-added'
									: 'bravo-row-state-modified'
							);
					}
				}
			}
		} else if (_ct == wjg.CellType.Cell) {
			e.cancel = _fic.cancel = this.renderSpecialCell1(_fic, _drawCellInfo);

			if (
				_col.dataType == wjc.DataType.Number &&
				String.isNullOrEmpty(_drawCellInfo.styleCss['text-align'])
			)
				_drawCellInfo.styleCss['text-align'] = 'right';
		}

		if (_image && _glyph == null) {
			if (!_drawCellInfo.styleCss['display']) _drawCellInfo.styleCss['display'] = 'flex';

			if (this.itemsSource == null) _drawCellInfo.styleCss['align-items'] = 'center';

			if (
				e.col == this.treeColumnPos &&
				(this.collectionView == null || this.groups.size > 0)
			) {
				let _pL =
					BravoCore.convertPxStringToNumber(e.cell.style.paddingLeft) ||
					this.defaultPadding.left;
				_drawCellInfo.styleCss['padding-left'] = `${
					_nCellIndent + (_groupRow ? 14 : _pL)
				}px`;
			}
		}

		let _zPt, _zPl, _zPb, _zPr, _pT, _pL, _pB, _pR;

		_zPt = _drawCellInfo.styleCss['padding-top'];
		_zPl = _drawCellInfo.styleCss['padding-left'];
		_zPb = _drawCellInfo.styleCss['padding-bottom'];
		_zPr = _drawCellInfo.styleCss['padding-right'];

		_pT = BravoCore.convertPxStringToNumber(_zPt) || 1;
		_pL = BravoCore.convertPxStringToNumber(_zPl) || 1;
		_pB = BravoCore.convertPxStringToNumber(_zPb) || 1;
		_pR = BravoCore.convertPxStringToNumber(_zPr) || 1;

		if (_row.renderHeight <= _pT + _pB)
			_drawCellInfo.styleCss['padding-top'] = _drawCellInfo.styleCss['padding-bottom'] = 0;

		if (_col.renderWidth <= _pL + _pR - _nCellIndent) {
			_drawCellInfo.styleCss['padding-left'] = _drawCellInfo.styleCss['padding-right'] = 0;
		}

		let _css0 = _drawCellInfo.styleCss;
		if (_css && Object.keys(_css).length > 0) {
			if (!_css0) _css0 = {};
			Object.assign(_css0, _css);
		}

		if (_css0 && Object.keys(_css0).length > 0) {
			let _zStyleName = String.format('s{0}', buildHashName(_css0));
			if (!_drawCellInfo.classStyle.includes(_zStyleName)) {
				_drawCellInfo.classStyle.push(_zStyleName);
				let _cssData = new StyleCssData(e.panel.cellType, _css0);
				if (this.styleCss.containsKey(_zStyleName))
					this.styleCss.get(_zStyleName).value = _cssData;
				else this.styleCss.add(_zStyleName, _cssData);
			}
		}

		// border width
		/* if (_col.renderWidth == 1) {
            _drawCellInfo.styleCss['width'] = `${BravoSettings.toCurrentDpiXWithBorder(1)}px`;
        } */

		//for test
		this.applyStyleInCell(_bNoDrawing ? e.cell : _fic.cell, _drawCellInfo);
	}

	private applyStyleInCell(cell: HTMLElement, cellInfo: DrawCellInfo) {
		if (cell == null) return;

		/* for (const k in cellInfo.styleCss) {
            cell.style[k] = cellInfo.styleCss[k];
        } */

		if (cellInfo.classStyle.length > 0)
			cell.className = String.format(
				'{0} {1}',
				cell.className,
				cellInfo.classStyle.join(' ')
			);
	}

	public refreshRange(e?: wjg.CellRange);
	public refreshRange(panel: wjg.GridPanel, e: wjg.CellRange);
	public refreshRange(arg: any, e?: wjg.CellRange) {
		if (arg instanceof wjg.CellRange) {
			super.refreshRange(arg);
			return;
		}

		let panel = arg;
		for (let _nRow = e.topRow; _nRow <= e.bottomRow; _nRow++) {
			for (let _nCol = e.leftCol; _nCol <= e.rightCol; _nCol++) {
				const o = panel.getCellElement(_nRow, _nCol);
				if (o) {
					var n = o[wjg.GridPanel._INDEX_KEY];
					this.cellFactory.updateCell(panel, _nRow, _nCol, o, n.rng);
				}
			}
		}
	}

	private renderButtonCell(e: BravoFormatItemEventArgs) {
		const _col = e.panel.columns[e.col];
		let _bNoDrawing = !_col || e.cell == null;
		if (_bNoDrawing) return _bNoDrawing;

		const _btnLink = wjc.tryCast(
			_col[BravoWebGrid.GridColumEditorProp],
			BravoButton
		) as BravoButton;
		const _bIsLink = //(_btnLink != null && _btnLink.bIsLink) ||
			_col[BravoWebGrid.GridColumEditorProp] instanceof BravoLabel ||
			this.getCellType(e.panel, e.row, e.col) == GridCellTypeEnum.link;

		if (!_bIsLink && _btnLink && _btnLink.hostElement) {
			const _zOldText = _btnLink.text;

			try {
				_btnLink.anchor =
					AnchorStyles.Top | AnchorStyles.Right | AnchorStyles.Bottom | AnchorStyles.Left;
				_btnLink.readOnly = this.readOnly;
				_btnLink.enabled = this.enabled;

				if (!_btnLink.bIsLink) {
					_btnLink.backColor = this.isCellButtonEnabled(e.row, e.col)
						? wjc.Color.fromRgba(240, 240, 240)
						: wjc.Color.fromRgba(198, 198, 198);
				} else {
					_btnLink.backColor = wjc.Color.fromString('transparent');
					_btnLink.borderStyle = BorderStyle.None;

					wjc.setAttribute(
						_btnLink.hostElement,
						'button-data',
						e.panel.getCellData(e.row, e.col, false)
					);
				}

				let _cellStyle = BravoWebGrid.getCellStyle(e.panel, e.row, e.col, false);
				let _css = {};

				if (_cellStyle) {
					let _imgAlign = _cellStyle[StyleElementFlags[StyleElementFlags.ImageAlign]];
					if (_imgAlign) {
						switch (_imgAlign) {
							case ImageAlignEnum[ImageAlignEnum.CenterTop]:
								_css['alignItems'] = 'start';
								_css['justifyContent'] = 'center';
								_btnLink.imageAlign = ContentAlignment.TopCenter;
								break;
							case ImageAlignEnum[ImageAlignEnum.CenterBottom]:
								_css['alignItems'] = 'end';
								_css['justifyContent'] = 'center';
								_btnLink.imageAlign = ContentAlignment.BottomCenter;
								break;
							case ImageAlignEnum[ImageAlignEnum.LeftTop]:
								_css['alignItems'] = 'start';
								_css['justifyContent'] = 'start';
								_css['paddingLeft'] = 0;
								_btnLink.imageAlign = ContentAlignment.TopLeft;
								break;
							case ImageAlignEnum[ImageAlignEnum.LeftBottom]:
								_css['alignItems'] = 'end';
								_css['justifyContent'] = 'start';
								_css['paddingLeft'] = 0;
								_btnLink.imageAlign = ContentAlignment.BottomLeft;
								break;
							case ImageAlignEnum[ImageAlignEnum.LeftCenter]:
								_css['alignItems'] = 'center';
								_css['justifyContent'] = 'start';
								_css['paddingLeft'] = 0;
								_btnLink.imageAlign = ContentAlignment.MiddleLeft;
								break;
							case ImageAlignEnum[ImageAlignEnum.RightTop]:
								_css['alignItems'] = 'start';
								_css['justifyContent'] = 'end';
								_css['paddingRight'] = 0;
								_btnLink.imageAlign = ContentAlignment.TopRight;
								break;
							case ImageAlignEnum[ImageAlignEnum.RightBottom]:
								_css['alignItems'] = 'end';
								_css['justifyContent'] = 'end';
								_css['paddingRight'] = 0;
								_btnLink.imageAlign = ContentAlignment.BottomRight;
								break;
							case ImageAlignEnum[ImageAlignEnum.RightCenter]:
								_css['alignItems'] = 'center';
								_css['justifyContent'] = 'end';
								_css['paddingRight'] = 0;
								_btnLink.imageAlign = ContentAlignment.MiddleRight;
								break;

							default:
								_css['alignItems'] = 'center';
								_css['justifyContent'] = 'center';
								_btnLink.imageAlign = ContentAlignment.MiddleCenter;
						}
					}

					let _display =
						_cellStyle[StyleElementFlags[StyleElementFlags.Display]] ||
						DisplayEnum[DisplayEnum.TextOnly];
					if (_display) {
						switch (_display) {
							case DisplayEnum[DisplayEnum.ImageOnly]:
								_btnLink.text = String.empty;
								break;
							case DisplayEnum[DisplayEnum.TextOnly]:
								_btnLink.image = null;

								const _zText = e.panel.getCellData(e.row, e.col, false);
								if (!String.isNullOrEmpty(_zText)) _btnLink.text = _zText;

								if (_css) {
									let _contentAlign: any = ContentAlignment.TopLeft;
									const _txtAlign =
										_cellStyle[StyleElementFlags[StyleElementFlags.TextAlign]];
									if (_txtAlign && ContentAlignment[_txtAlign] != null)
										_contentAlign = ContentAlignment[_txtAlign];

									_btnLink.textAlign = _contentAlign;
									// _css['justify-content'] = 'flex-start';

									if (_btnLink && _btnLink.bIsLink)
										_css['text-decoration'] = 'underline';
								}

								break;
							case DisplayEnum[DisplayEnum.None]:
								e.html = '<i></i>';
								return;
						}
					}
				}

				let _btn = _btnLink.hostElement.querySelector('button');
				if (_btn) wjc.setCss(_btn, _css);
			} finally {
				_btnLink.refresh();
				_btnLink.text = _zOldText;
			}

			e.html = _btnLink.hostElement.outerHTML;
		} else if (_bIsLink) {
			const _label = wjc.tryCast(
				_col[BravoWebGrid.GridColumEditorProp],
				'IBravoLabel'
			) as BravoLabel;
			if (_label) _label.text = e.panel.getCellData(e.row, e.col, false);

			let _cs = e.cellStyle;
			let _css = {};

			const _drawCellInfo = new DrawCellInfo();

			if (!_cs || !_cs[StyleElementFlags[StyleElementFlags.ForeColor]])
				_css['color'] = '#0066CC';

			_css['text-decoration'] = 'underline';

			if (_css && Object.keys(_css).length > 0) {
				let _zStyleName = String.format('s{0}', buildHashName(_css));
				if (!_drawCellInfo.classStyle.includes(_zStyleName)) {
					_drawCellInfo.classStyle.push(_zStyleName);
					let _css0 = new StyleCssData(e.panel.cellType, _css);
					if (this.styleCss.containsKey(_zStyleName))
						this.styleCss.get(_zStyleName).value = _css0;
					else this.styleCss.add(_zStyleName, _css0);
				}
			}

			this.applyStyleInCell(e.cell, _drawCellInfo);
		}

		return !_bNoDrawing;
	}

	private renderCellNewRow(e: BravoFormatItemEventArgs, rect: wjc.Rect) {
		e.cell.textContent = '';

		const _element = document.createElement('div');
		_element.textContent = this.zNewRowText;

		_element.style.top = String.format('{0}px', rect.top);
		_element.style.left = String.format('{0}px', rect.left);
		_element.style.height = _element.style.lineHeight = String.format('{0}px', rect.height);
		_element.style.width = String.format('{0}px', rect.width);
		_element.style.position = 'absolute';

		this.addEventListener(_element, 'mousedown', this._bindNewRowMouseDown);

		_element.className = 'bravo-new-row';

		const _oldChild = this._e.querySelector('.bravo-new-row');
		if (!_oldChild) {
			this._e.firstChild.appendChild(_element);
		} else {
			this.removeEventListener(_oldChild, 'mousedown', this._bindNewRowMouseDown);
			this._e.firstChild.replaceChild(_element, _oldChild);
		}
	}

	private _bindNewRowMouseDown = this.newRow_mouseDown.bind(this);
	private newRow_mouseDown(e: MouseEvent) {
		if (!this.hostElement) return;
		this.invalidate();
	}

	protected renderCellContent(e: wjg.FormatItemEventArgs) {}

	protected renderCellBackground(e: wjg.FormatItemEventArgs) {}

	protected fitRowHeight(
		pnRow: number,
		pnFromCol: number,
		pnToCol: number,
		e?: wjg.FormatItemEventArgs
	) {
		let _pT = 0,
			_pB = 0,
			_pL = 0,
			_pR = 0;
		let _panel = e ? e.panel : this.cells;

		let _row = <wjg.Row>_panel.rows[pnRow];
		if (!_row || !_row.visible) return;

		let _bFitRowHeightFixed =
			this.autoFitRowHeight == GridAutoFitRowHeightEnum.All ||
			(this.autoFitRowHeight == GridAutoFitRowHeightEnum.Fixed &&
				_panel.cellType != wjg.CellType.Cell);

		const _customDraw = e instanceof CustomOwnerDrawCellEventArgs ? e : null;

		let _nMax = 0,
			_col: wjg.Column;
		for (let _nCol = pnFromCol; _nCol <= pnToCol; _nCol++) {
			if (!isCellValid(_panel, pnRow, _nCol)) continue;

			_col = _panel.columns[_nCol];

			let _ci = new GridCellInfo(pnRow, _nCol);

			try {
				let _bWordWrap = _col.wordWrap;

				let _cs = BravoWebGrid.getCellStyle(
					_panel,
					pnRow,
					_nCol,
					_panel.cellType != wjg.CellType.ColumnHeader
				);
				if (_cs && _cs[StyleElementFlags[StyleElementFlags.WordWrap]] && !_bWordWrap)
					_bWordWrap = Boolean.asBoolean(
						_cs[StyleElementFlags[StyleElementFlags.WordWrap]]
					);

				// _ci.zText = _panel.getCellData(pnRow, _nCol, true);
				// if (_ci.zText && String.includeNewLine(_ci.zText))
				//     _bWordWrap = true;

				const _cellType =
					_customDraw && _customDraw.row == pnRow && _customDraw.col == _nCol
						? _customDraw.cellType
						: this.getCellType(_panel, pnRow, _nCol);

				if (_cellType == GridCellTypeEnum.img) continue;

				const _bIsHTML = _cellType == GridCellTypeEnum.html;

				const _ww = _bWordWrap || _bIsHTML;
				if (!_col || !_col.visible || !_ww) continue;

				const _bIsPictureBox =
					_panel == this.cells &&
					!!wjc.tryCast(_col[BravoWebGrid.GridColumEditorProp], 'IBravoPictureInputBox');
				const _bIsDocInputBox =
					_panel == this.cells &&
					!!wjc.tryCast(_col[BravoWebGrid.GridColumEditorProp], 'IBravoDocInputBox');
				if (!_bIsDocInputBox && !_bIsPictureBox)
					this.readCellData(_panel, pnRow, _nCol, _ci, null, false, true);

				if (_ci.range && !_ci.range.isSingleCell && pnRow != _ci.range.topRow) continue;

				let _nWidth = _ci.bounds ? _ci.bounds.width : 0;
				// if ((_nWidth < 0 ? _panel.columns.defaultSize : _nWidth) < _nMinColWidth)
				//     continue;

				let _zText: string;
				if (_col && _bIsDocInputBox && e.panel.cellType == wjg.CellType.Cell) {
					let _ms = _panel.getCellData(pnRow, _nCol, false);
					if (_ms instanceof Uint8Array) {
						_zText = String.format(
							'{0} ({1})',
							FileTypeEnum[BravoFileTypeDetector.detectFileType(_ms)],
							formatBytes(_ms.length, _ms.length < 1024 ? 2 : 0)
						);
					}
				} else {
					_zText = _ci.zText; /* ? String.format("{0}", _ci.zText) :
                        String.format("{0}", _panel.getCellData(pnRow, _nCol, true)); */
				}

				if (
					!String.isNullOrEmpty(_zText) &&
					_row instanceof wjg.GroupRow &&
					!this.sumColumns.has(_col.name)
				)
					_zText = String.empty;

				if (
					String.isNullOrEmpty(_zText) &&
					_nCol == this.treeColumnPos &&
					_row instanceof wjg.GroupRow
				) {
					_zText = BravoWebGrid.getGroupHeader(_row, false);

					if (String.isNullOrEmpty(_zText) && this.isTreeNodeMode())
						_zText = this.getCellData(pnRow, this._treeColumnPos, false);
				}

				if (
					String.isNullOrEmpty(_zText) &&
					this.isTreeNodeMode() &&
					_row instanceof wjg.GroupRow &&
					_nCol != this.treeColumnPos
				)
					_zText = String.format('{0}', this.getCellData(pnRow, _nCol, true));

				if (String.isNullOrEmpty(_zText)) continue;

				let _css1 = _ci.styleCss;
				_pT = Math.max(
					BravoCore.convertPxStringToNumber(_css1?.paddingTop) || 2,
					this.defaultPadding.top
				);
				_pB = Math.max(
					BravoCore.convertPxStringToNumber(_css1?.paddingBottom) || 2,
					this.defaultPadding.bottom
				);
				_pL = Math.max(
					BravoCore.convertPxStringToNumber(_css1?.paddingLeft) || 2,
					this.defaultPadding.left
				);
				_pR = Math.max(
					BravoCore.convertPxStringToNumber(_css1?.paddingRight) || 2,
					this.defaultPadding.right
				);

				let _font: Font;
				if (_cs && _cs[StyleElementFlags[StyleElementFlags.Font]]) {
					_font = Font.parseFont(
						_cs[StyleElementFlags[StyleElementFlags.Font]],
						this.font
					);
				} else {
					let _zFontName = BravoSettings.current.zDefaultFontName;
					let _nFontSize = BravoSettings.current.nFontSize;
					if (_css1) {
						_nFontSize =
							pxToPt(BravoCore.convertPxStringToNumber(_css1['font-size'])) ||
							BravoSettings.current.nFontSize;
						_zFontName = _css1['font-family'];
					}

					let _fontStyle = Font.getFontStyle(_css1);

					_font = new Font(_zFontName, _nFontSize, _fontStyle);
				}

				let _nIndent =
					_customDraw && _customDraw.row != pnRow && _customDraw.col != _nCol
						? _customDraw.nCellIndent
						: _ci.nIndent;
				if (_nCol == this.treeColumnPos && _panel.cellType == wjg.CellType.Cell)
					_nIndent = this.getCellIndent(pnRow, _nCol);

				if (_bIsHTML) {
					if (_nWidth > _pL + _pR + _nIndent) _nWidth = _nWidth - _pL - _pR - _nIndent;

					let _zHtml = String.format(
						'{0}',
						_ci.zText
							? String.format('{0}', _ci.zText)
							: String.format('{0}', _panel.getCellData(pnRow, _nCol, true))
					);
					const _sz = BravoGraphicsRenderer.measureHtml(_zHtml, _font, _nWidth, true);
					const _nHeight = (_sz ? _sz.height : 0) + _pT + _pB;

					_nMax = Math.max(_nMax, _nHeight);
					continue;
				}

				//for testing not get image width
				if (_ci.image) {
					if (_ci.image instanceof HTMLElement) _nWidth -= 12;
					else if (_ci.image instanceof Image) _nWidth -= _ci.image.width;
				}

				if (_row['_cimg'] && _row['_cimg'][e.col]) {
					let _obj = _row['_cimg'][e.col];

					if (_obj instanceof HTMLElement) _nWidth -= 12;
					else if (_obj instanceof Image) _nWidth -= _obj.width + 3;
				}

				let _nHeight: number = 0;
				if (_nWidth > _pL + _pR + _nIndent) _nWidth = _nWidth - _pL - _pR - _nIndent;

				if (_row instanceof wjg.GroupRow && _row.hasChildren && _nCol == this.treeColumnPos)
					_nWidth -= 12;

				if (_col.minWidth !== null && _nWidth < _col.minWidth) _nWidth = _col.minWidth;

				// B0148-808
				// if (BravoExpressionEvaluator.containsExpression(_zText))
				//     continue;

				const _sz = BravoGraphicsRenderer.measureString(_zText, _font, _nWidth);
				if (!_sz) continue;
				_nHeight = _sz.height;

				_nHeight += _pT + _pB + 2;
				if (_nHeight > 0) {
					if (
						_ci.range &&
						!_ci.range.isSingleCell &&
						_ci.range.topRow < _ci.range.bottomRow
					)
						_nHeight -= this.getCurrentHeightOfRows(
							_ci.range.topRow + 1,
							_ci.range.bottomRow,
							_panel
						);

					if (_nMax < _nHeight) _nMax = _nHeight;
				}
			} finally {
				if (_ci.cellElement) {
					this.cellFactory.disposeCell(_ci.cellElement);
					wjc.removeChild(_ci.cellElement);
				}
			}
		}

		_row.height = Math.max(_nMax, _panel.rows.defaultSize);
	}

	private drawContentBorder(e: wjg.FormatItemEventArgs, pDrawInfo: DrawCellInfo) {
		if (!this.bDrawContentBorders) return;

		let _nTopRow = e.row,
			_nBottomRow = e.row,
			_nLeftCol = e.col,
			_nRightCol = e.col;

		if (e.range != null && !e.range.isSingleCell) {
			_nTopRow = e.range.topRow;
			_nBottomRow = e.range.bottomRow;
			_nLeftCol = e.range.leftCol;
			_nRightCol = e.range.rightCol;
		}

		let _rightCol = <wjg.Column>e.panel.columns[_nRightCol];
		let _bottomRow = <wjg.Row>e.panel.rows[_nBottomRow];
		let _cellSize = e.range
			? e.range.getRenderSize(e.panel)
			: new wjc.Size(_rightCol.renderSize, _bottomRow.renderSize);

		switch (e.panel.cellType) {
			case wjg.CellType.ColumnHeader:
				if (_nLeftCol == e.panel.columns.firstVisibleIndex)
					pDrawInfo.classStyle.push('bravo-border-left');

				if (_nTopRow == 0) pDrawInfo.classStyle.push('bravo-border-top');

				if (
					_rightCol.visibleIndex == e.panel.columns.visibleLength ||
					e.panel.columns.getTotalSize() == _rightCol.pos + _rightCol.renderSize
				) {
					pDrawInfo.classStyle.push('bravo-border-right');
					pDrawInfo.styleCss['width'] = `${
						_cellSize.width - BravoSettings.toCurrentDpiXWithBorder(1)
					}px`;
				}

				if (
					_bottomRow.visibleIndex == e.panel.rows.visibleLength - 1 &&
					this.cells.rows.length == 0
				) {
					pDrawInfo.classStyle.push('bravo-border-bottom');
					pDrawInfo.styleCss['height'] = `${
						_cellSize.height - BravoSettings.toCurrentDpiXWithBorder(1)
					}px`;
				}

				break;
			case wjg.CellType.Cell:
				if (_nLeftCol == e.panel.columns.firstVisibleIndex)
					pDrawInfo.classStyle.push('bravo-border-left');

				if (
					_rightCol.visibleIndex == e.panel.columns.visibleLength ||
					e.panel.columns.getTotalSize() == _rightCol.pos + _rightCol.renderSize
				) {
					pDrawInfo.classStyle.push('bravo-border-right');
					pDrawInfo.styleCss['width'] = `${
						_cellSize.width - BravoSettings.toCurrentDpiXWithBorder(1)
					}px`;
				}

				if (
					_nTopRow == 0 &&
					(this.columnHeaders.rows.length == 0 || this.columnHeaders.height == 0)
				)
					pDrawInfo.classStyle.push('bravo-border-top');

				if (_bottomRow.visibleIndex == e.panel.rows.visibleLength - 1) {
					pDrawInfo.classStyle.push('bravo-border-bottom');
					pDrawInfo.styleCss['height'] = `${
						_cellSize.height - BravoSettings.toCurrentDpiXWithBorder(1)
					}px`;
				}

				break;
		}
	}

	public getTreeIcon(gr: wjg.GroupRow | 'collapsed' | 'expanded', image?: HTMLElement): string {
		if (image instanceof HTMLElement) {
			image.classList.add(wjg.CellFactory._WJC_COLLAPSE);
			return image.outerHTML;
		}

		let _glyph = this.getRowImage(this.cells, gr);
		if (_glyph instanceof Image) {
			const _html = _glyph.render();
			if (_html) {
				wjc.addClass(_html, `wj-btn wj-btn-glyph ${wjg.CellFactory._WJC_COLLAPSE}`);
				return _html.outerHTML;
			}
		}

		_glyph = 'fa ';
		if (gr instanceof wjg.GroupRow) _glyph += gr.isCollapsed ? 'fa-plus' : 'fa-minus';
		else if (gr == 'collapsed') _glyph += 'fa-plus';
		else if (gr == 'expanded') _glyph += 'fa-minus';

		let _span = `<span class="${_glyph}"></span>`;

		return `<button class="wj-btn wj-btn-glyph ${wjg.CellFactory._WJC_COLLAPSE}" type = "button" tabindex = "-1">${_span}</button >`;
	}

	public formatAutoTextCell(e: BravoFormatItemEventArgs, pDrawInfo?: DrawCellInfo) {
		if (this.isGanttChartCol(e.col)) return;

		let _col = <wjg.Column>e.panel.columns[e.col],
			_row = <wjg.Row>e.panel.rows[e.row],
			_groupRow = _row instanceof wjg.GroupRow ? _row : null,
			_cellData: any;

		let _culture = e instanceof RaiseOwnerDrawCellEventArgs ? e.culture : null;
		if (_culture == null && e.panel['culture']) _culture = e.panel['culture'];

		if (this.expressionEvaluator) {
			this._nExpressionUpdatedCol = e.col;
			this.expressionEvaluator.onLocalValueRequired.addHandler(
				this.expressionEvaluator_onLocalValueRequired,
				this
			);
		}

		try {
			if (e.range && !e.range.isSingleCell)
				_cellData = e.data = e.panel.getCellData(e.range.row, e.range.col, false);
			else _cellData = e.data = e.panel.getCellData(e.row, e.col, false);

			if (_cellData instanceof Uint8Array) return;

			let _bIsFixed = e.panel.cellType == wjg.CellType.ColumnHeader,
				_zColName = _col.name;

			if (_col && _col.isVisible) {
				if (
					!_bIsFixed &&
					!String.isNullOrEmpty(_zColName) &&
					this.restrictedColumns.has(_zColName)
				) {
					let _restrictCol = this.restrictedColumns.get(_zColName),
						_bRestricted = _restrictCol
							? ((<RestrictedColumnEnum>_restrictCol) &
									RestrictedColumnEnum.NoOpen) !=
							  0
							: false;

					if (
						!_bRestricted &&
						((<RestrictedColumnEnum>_restrictCol) & RestrictedColumnEnum.NoOpenDOU) != 0
					) {
						const _r = new RowColEventArgs(e.panel, e.row, e.col);
						_r.cancel = true;
						this.raiseOnRestrictedDOUColumn(_r);
						_bRestricted = _r.cancel;
					}

					if (_bRestricted) {
						e.cell.textContent = NoDisplayPermissionContent;
						return;
					}
				}
			}

			let _ct = _col.dataType;
			let _bIsUnbound = this.itemsSource == null;

			//#region Style Dynamic

			let _csDynamicStyle: CellStyle = null,
				_cssDynamicStyle: any = {};

			let _csCell: CellStyle;
			if (_bIsUnbound) _csCell = BravoWebGrid.getCellStyle(e.panel, e.row, e.col);

			if (_csCell && !Object.is(e.cellStyle, _csCell)) e.cellStyle = _csCell.clone();

			if (
				this.dynamicStyles &&
				this.dynamicStyles.length > 0 &&
				this.expressionEvaluator &&
				!_bIsFixed
			) {
				for (const _itemStyle of this.dynamicStyles) {
					if (_bIsUnbound) {
						if (
							!_csCell ||
							String.compare(
								_csCell[StyleElementFlags[StyleElementFlags.ComboList]],
								_itemStyle.Name
							) != 0
						)
							continue;
					} else {
						let _bIsAllCols = _itemStyle.zColumnList === BravoWebGrid.AllColumnValue;
						if (
							!_bIsAllCols &&
							(_itemStyle.zColumnList == null ||
								String.isNullOrEmpty(_zColName) ||
								_itemStyle.zColumnList
									.toLowerCase()
									.match(_zColName.toLowerCase()) == null)
						)
							continue;
					}

					let _zStyleValue: string = null;
					let _key = {
						row: e.row,
						col: e.col,
						value: _itemStyle.Name
					};

					let _zKey = JSON.stringify(_key);

					if (this._cache && this.hasOwnProperty(_zKey)) {
						_zStyleValue = this._cache[_zKey];
					} else {
						try {
							const _dtRow = this.getDataRowFromCell(e.row, e.col);
							_zStyleValue = String.format(
								'{0}',
								_dtRow
									? this.expressionEvaluator.evaluate(
											_itemStyle.zStyleExpr,
											_dtRow
									  )
									: this.expressionEvaluator.evaluate(_itemStyle.zStyleExpr, _row)
							);

							if (!this._cache) this._cache = {};

							this._cache[_zKey] = _zStyleValue;
						} catch (_ex) {
							console.log(_ex);
						}
					}

					if (!_zStyleValue) continue;

					const _cs0 = CellStyle.parseString(_zStyleValue);
					if (_cs0 == null) continue;

					_cssDynamicStyle = CellStyle.buildCss(_cs0) || {};
					_csDynamicStyle = _cs0;

					if (!Object.is(e.cellStyle, _csDynamicStyle) && e.cellStyle)
						e.cellStyle.mergeWith(_csDynamicStyle);

					break;
				}
			}

			if (Object.keys(_cssDynamicStyle).length > 0) {
				const _zStyleName = String.format('s{0}', buildHashName(_cssDynamicStyle));
				if (!e.cell.classList.contains(_zStyleName)) {
					if (pDrawInfo) pDrawInfo.classStyle.push(_zStyleName);
					else e.cell.classList.add(_zStyleName);

					const _css = new StyleCssData(e.panel.cellType, _cssDynamicStyle);
					if (this.styleCss.containsKey(_zStyleName))
						this.styleCss.get(_zStyleName).value = _css;
					else this.styleCss.add(_zStyleName, _css);
				}
			}

			//#endregion Style Dynamic

			let _zText = e.cell.textContent;

			if (
				e.panel.cellType == wjg.CellType.Cell &&
				String.isNullOrEmpty(e.cell.textContent) &&
				this._bShowNullValueCell &&
				(wjc.isUndefined(_cellData) || _cellData == null)
			) {
				e.cell.textContent = 'NULL';
				e.cell.classList.add(CellStyleEnum[CellStyleEnum.NullStyle]);
				return;
			}

			let _bIsUnboundStringCell = _bIsUnbound && wjc.isString(_cellData);
			let _bIsString = _bIsFixed || _ct == wjc.DataType.String || _bIsUnboundStringCell;

			if (_bIsString) {
				if (this.autoTextMode != GridAutoTextContentEnum.None && this.expressionEvaluator) {
					let _bAutoText =
						this.autoTextMode == GridAutoTextContentEnum.All ||
						(this.autoTextMode == GridAutoTextContentEnum.Fixed && _bIsFixed) ||
						(this.autoTextMode == GridAutoTextContentEnum.NonFixed && !_bIsFixed);

					if (_bAutoText) {
						try {
							if (this.evaluatingAutoTextCell.hasHandlers) {
								let _e = new RaiseOwnerDrawCellEventArgs(e.panel, e.range, e.cell);
								this.onEvaluatingAutoTextCell(_e);
								_zText = _e.cell.textContent;

								if (_e.cancel) {
									e.cell.textContent = _zText;
									return;
								}
							}

							if (BravoExpressionEvaluator.containsExpression(_zText)) {
								let _dataRow = this.getDataRow(e.row);

								if (ExtensionsMethod.isRtfString(_zText))
									_zText = this.expressionEvaluator.evaluateRtfText(
										_zText,
										_dataRow,
										_culture
									);
								else
									_zText = this.expressionEvaluator.evaluateText(
										_zText,
										_dataRow,
										_culture
									);

								e.data = null;
							}
						} catch (_ex) {
							console.log(_ex);
							_zText = _zText.substring(0, _zText.indexOf('{')) + INVALID_VALUE;
						}
					}
				}

				if (String.includeNewLine(_zText) || _zText.includes('  ')) _row.multiLine = true;

				if (_zText.endsWith(' ') && !ExtensionsMethod.isRtfString(_cellData))
					_zText = _zText.trimEnd();
			}

			if (_bIsFixed) {
				let _hdr = String.format('{0}', _col.header).trimEnd();
				if (String.isNullOrEmpty(_zText) && !String.isNullOrEmpty(_hdr)) _zText = _col.name;

				if (e.cell.textContent != _zText) e.cell.textContent = _zText;

				return;
			}

			if (e.panel.cellType == wjg.CellType.Cell && !_bIsUnbound) {
				let _nFirstVisible = e.panel.columns.firstVisibleIndex;
				if (_groupRow && e.col != this.treeColumnPos && this.isTreeNodeMode()) {
					/* if (_ct == wjc.DataType.Boolean) {
                        let chk = e.cell.firstChild as HTMLInputElement;
                        if (!(chk instanceof HTMLInputElement) || chk.type != 'checkbox') {
                            e.cell.innerHTML = '<label><input type="checkbox" class="wj-cell-check" tabindex="-1"/></label>';
                            chk = e.cell.firstChild as HTMLInputElement;
                        }

                        // initialize/update checkbox value
                        chk.checked = _cellData == true ? true : false;
                        chk.indeterminate = _cellData == null;

                        // disable checkbox if it is not editable (so user can't click it)
                        chk.readOnly = !this.canEditCell(e.row, e.col);
                        if (chk.readOnly)
                            wjc.addClass(chk, 'group-checkbox');

                        return;
                    }
                    else */ if (e.col == _nFirstVisible) {
						_zText = e.panel.getCellData(e.row, e.col, true);
					}
				} else if (_groupRow && e.col == _nFirstVisible && !this.isTreeNodeMode()) {
					_zText = e.panel.getCellData(e.row, e.col, true);
				}
			}

			let _bIsNumCol = _ct == wjc.DataType.Number;
			let _bIsDateCol = _ct == wjc.DataType.Date;
			let _zRawText = _bIsUnbound ? _zText : `${_cellData}`;

			if ((_bIsUnbound || _bIsNumCol || _bIsDateCol) && _zRawText) {
				if ((this.hideZeroValue & GridDataCellEnum.Bound) != 0) {
					let _nVal = parseFloat(_zRawText);
					let _bIsHideDataBoundZero =
						_bIsNumCol && !_bIsUnbound && !isNaN(_nVal) && _nVal == 0;
					if (_bIsHideDataBoundZero) {
						e.cell.textContent = '';
						return;
					}
				}

				let _zFixedFormat: string = String.empty;
				const FormatProp = StyleElementFlags[StyleElementFlags.Format];
				if (_bIsUnbound && _csCell && _csCell[FormatProp])
					_zFixedFormat = _csCell[FormatProp];
				else if (_col.format) _zFixedFormat = _col.format;

				let _zFormat: string = String.empty;
				if (_csDynamicStyle && _csDynamicStyle[FormatProp])
					_zFormat = this.expressionEvaluator.getFormat(_csDynamicStyle[FormatProp]);
				else _zFormat = this.expressionEvaluator.getFormat(_zFixedFormat);

				let _bIsAdjustFormat = String.compare(_zFixedFormat, _zFormat) != 0;
				let _bIsScaleNum =
					!_bIsUnbound &&
					_bIsNumCol &&
					this.nNumericScale != 1 &&
					(String.compare(this.zNumericScaleMember, BravoWebGrid.AllColumnValue) == 0 ||
						(_zColName && this.zNumericScaleMember.indexOf(_zColName) > -1));

				let _bIsAdjustTime = false;
				if (!_bIsUnbound && _bIsDateCol && _col[BravoWebGrid.GridColumEditorProp]) {
					let _editor = _col[BravoWebGrid.GridColumEditorProp];
					if (_editor && !_editor.currentTimeZone) _bIsAdjustTime = true;
				}

				try {
					let _nVal = Number(_zRawText);

					if (
						_bIsNumCol ||
						(_bIsUnbound &&
							(!_bIsUnboundStringCell || (!isNaN(_nVal) && _nVal == 0))) ||
						(_bIsUnbound && _bIsUnboundStringCell && !String.isNullOrEmpty(_zFormat))
					) {
						if (!isNaN(_nVal) && !(_col.dataMap instanceof BravoDataMap)) {
							if (
								(this.hideZeroValue & GridDataCellEnum.Unbound) != 0 &&
								_bIsUnbound &&
								_nVal == 0
							) {
								_zText = String.empty;
							} else {
								if (_bIsScaleNum) {
									_nVal = _nVal / this.nNumericScale;

									if (this.zNumericScaleFormat)
										_zFormat = this.expressionEvaluator.getFormat(
											this.zNumericScaleFormat
										);

									if (!_bIsAdjustFormat) _bIsAdjustFormat = true;
								}

								if (
									_culture ||
									_bIsAdjustFormat ||
									(_zFormat && _zFormat.includes('#'))
								)
									_zText = BravoGlobalize.format(_nVal, _zFormat, _culture);
							}

							if (
								(!String.isNullOrEmpty(_zFormat) && _nVal >= 0 && _nVal < 1) ||
								(_nVal < 0 && _nVal > -1)
							) {
								if (wjc.Globalize.parseFloat(_zText, _zFormat) == 0)
									_zText =
										(this.hideZeroValue & GridDataCellEnum.Unbound) != 0
											? String.empty
											: BravoGlobalize.format(
													0,
													_zFormat == 'P' ? 'P2' : _zFormat,
													_culture
											  );
								else _zText = BravoGlobalize.format(_nVal, _zFormat, _culture);
								/* if (wjc.Globalize.parseFloat(_zText, _zFormat) == 0)
                                    _zText = (this.hideZeroValue & GridDataCellEnum.Unbound) != 0 ? String.empty :
                                        BravoGlobalize.formatNumber(0, _zFormat == 'P' ? 'P2' : _zFormat, _culture);
                                else
                                    _zText = BravoGlobalize.formatNumber(_nVal, _zFormat, _culture); */
							}

							if (_groupRow && _zFormat.includes('N')) {
								if (_nVal > Math.pow(1000, 5) && _nVal < Math.pow(10000, 4)) {
									if (
										_nVal.toString().length ===
										Math.pow(1000, 5).toString().length
									)
										_nVal = ExtensionsMethod.significantFigures(_nVal, 15);

									_zText = BravoGlobalize.format(_nVal, _zFormat, _culture);
								} else if (_nVal > Math.pow(10000, 4)) {
									if (
										_nVal.toString().length ===
										Math.pow(10000, 4).toString().length
									)
										_nVal = ExtensionsMethod.significantFigures(_nVal, 15);

									_zText = BravoGlobalize.format(_nVal, _zFormat, _culture);
								}
							}
						}

						if (_bIsUnbound && Number.isNumber(_zRawText) && !_ct)
							e.cell.classList.add('wj-align-right');
					} else if (
						(_bIsDateCol && Date.isDate(_cellData)) ||
						(_bIsUnbound && Date.isDate(_zRawText))
					) {
						let _dtValue = _bIsDateCol
							? Date.asDate(_cellData)
							: Date.asDate(_zRawText);

						if (_bIsAdjustTime) {
							_dtValue = _dtValue.toLocalTime();

							if (!_bIsAdjustFormat) _bIsAdjustFormat = true;
						}

						if (_bIsAdjustFormat)
							_zText = BravoGlobalize.format(_dtValue, _zFormat, _culture);
					}
				} catch (_ex) {
					// _zText = INVALID_VALUE;
				}
			}

			if (e.cell.textContent != _zText) e.cell.textContent = _zText;
		} finally {
			this._nExpressionUpdatedCol = -1;
			if (this.expressionEvaluator != null)
				this.expressionEvaluator.onLocalValueRequired.removeHandler(
					this.expressionEvaluator_onLocalValueRequired,
					this
				);
		}
	}

	private _cache = {};

	public get cache() {
		return this._cache;
	}

	public getCellIndent(row: number, col: number, parentRow?: wjg.GroupRow) {
		if (row < 0) return 0;

		if (!this.isCellValid(row, col) || col != this.treeColumnPos) return 0;

		let _row: wjg.Row = this.rows[row];

		if (!parentRow) parentRow = this.getParentNode(_row);

		if (parentRow == null || parentRow.level < 0) return 0;

		if (
			this.bGroupInColumn &&
			this.groups.size > 0 &&
			!String.isNullOrEmpty(this.columns[col].name) &&
			this.groups.has(this.columns[col].name)
		)
			return 0;

		return 12 * (parentRow.level + 1);
	}

	private writeRowLayout(row: wjg.Row) {
		if (row == null) return;

		let _it = this.rowLayout.find((it) => it.index == row.index);
		if (_it) _it.renderSize = row.renderSize;
		else this.rowLayout.push({ index: row.index, renderSize: row.renderSize });
	}

	ngOnDestroy(): void {
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();

		if (this._styles) {
			this._styles.clear();
			this._styles = null;
		}

		if (this._dynamicStyles) {
			this.clearDynamicStyles();
			this._dynamicStyles = null;
		}

		if (this._sumColumns) {
			this._sumColumns.clear();
			this._sumColumns = null;
		}

		if (this._restrictedColumns) {
			this._restrictedColumns.clear();
			this._restrictedColumns = null;
		}

		if (this._groups) {
			this._groups.clear();
			this._groups = null;
		}

		if (this._styleCss) {
			this._styleCss.clear();
			this._styleCss = null;
		}

		if (this._mergedRanges) {
			this._mergedRanges.clear();
			this._mergedRanges = null;
		}

		if (this._rMerge) {
			this._rMerge.clear();
			this._rMerge = null;
		}

		if (this.styleElement) this.styleElement.remove();

		if (this._autoContextMenu) {
			this._autoContextMenu.dispose();
			this._autoContextMenu = null;
		}

		if (this._styleCss) {
			this._styleCss.clear();
			this._styleCss = null;
		}

		if (this._editableColumns) {
			this._editableColumns.clear();
			this._editableColumns = null;
		}

		if (this._activeItemTimer !== null) {
			if (this._activeItemTimer.enabled) this._activeItemTimer.stop();

			this._activeItemTimer.dispose();
			this._activeItemTimer = null;
		}

		if (this._colorDictionary) {
			this._colorDictionary.clear();
			this._colorDictionary = null;
		}

		if (this._cache) this._cache = null;

		if (this._cachedSpecialDay) {
			this._cachedSpecialDay.clear();
			this._cachedSpecialDay = null;
		}

		if (this._barCodeCtrl) {
			this._barCodeCtrl.dispose();
			this._barCodeCtrl = null;
		}

		super.ngOnDestroy();
	}

	public get bIsEditing(): boolean {
		return this._edtHdl['_bEditing'];
	}

	public beginEditing() {
		const _bEditing = this._edtHdl['_bEditing'];
		if (!_bEditing) this._edtHdl['_bEditing'] = true;
	}

	public endEditing() {
		const _bEditing = this._edtHdl['_bEditing'];
		if (_bEditing) this._edtHdl['_bEditing'] = false;
	}

	private _bEditing: boolean = false;

	public onCellEditEnding(e: CellEditEndingEventArgs) {
		if (this._bEditing) return;
		this._bEditing = true;

		let _ecv = this.tryGetItemSourceAsWebTable(); //this.editableCollectionView;
		const _row = wjc.tryCast(this.rows[e.row], wjg.Row) as wjg.Row;
		if (_row && _row.dataItem) {
			if (!Object.is(_row.dataItem, _ecv.currentItem)) _ecv.moveCurrentTo(_row.dataItem);
		}

		if (_ecv) _ecv.editItem(_ecv.currentItem);

		return super.onCellEditEnding(e);
	}

	public bPreventAddingRow: boolean = false;

	public onCellEditEnded(e: CellEditEndingEventArgs) {
		if (!this._bEditing) return;
		this._bEditing = false;

		if (this.isAddNewRow(e.row)) {
			e.cancel = true;

			if (!String.isNullOrEmpty(e.data) && !this.bPreventAddingRow) {
				if (this.addingNewRow.hasHandlers) {
					const _e = new UnboundValueEventArgs(e.row, e.col, e.data);

					const _bLastUpdating = this.isUpdating;
					if (!_bLastUpdating) this.beginUpdate();
					this.rows.removeAt(e.row);

					try {
						this.addingNewRow.raise(this, _e);
					} finally {
						if (this.hostElement) {
							if (this._addHdl) this._addHdl.updateNewRowTemplate();

							if (!_bLastUpdating) this.endUpdate();
						}
					}
				}
			}

			return;
		}

		let _ecv = this.tryGetItemSourceAsWebTable(); //this.editableCollectionView;
		if (_ecv) {
			const _col = e.panel.columns[e.col];
			if (
				_col instanceof wjg.Column &&
				_col.dataType == wjc.DataType.Boolean &&
				_col.binding &&
				_ecv.currentItem
			) {
				const _val = _ecv.currentItem[_col.binding];
				_ecv.currentItem[_col.binding] = Boolean.asBoolean(_val) ? 1 : 0;
			}

			setCurrentEditItem(_ecv, _ecv.row, _ecv.currentItem, _col?.binding);
		}

		super.onCellEditEnded(e);
	}

	public onSortingColumn(e: wjg.CellRangeEventArgs) {
		if (this.isTreeNodeMode()) e.cancel = true;

		let _order: SortFlags;
		if (e.range.isSingleCell || e.range.col == e.range.col2) {
			let _srtDes = this.getSortColumn(e.col);
			if (_srtDes == null) _order = SortFlags.Ascending;
			else if (_srtDes.ascending) _order = SortFlags.Descending;
			else if (!_srtDes.ascending) _order = SortFlags.None;
		}

		if (
			this.selection.isValid &&
			this.selection.topRow == 0 &&
			this.selection.bottomRow == this.rows.length - 1
		) {
			this.sortColumn(e.col, _order, true);
			return false;
		} else {
			this.selectCol(e.col);
			return false;
		}
	}

	public readonly setupEditor = new wjc.Event();
	protected onSetupEditor(e: wjg.CellRangeEventArgs) {
		this.setupEditor.raise(this, e);
	}

	public canStartEdit(r: number, c: number) {
		const _bCanCell = this.canEditCell(r, c);
		const _col: wjg.Column = this.columns[c];
		if (
			_bCanCell &&
			_col.name &&
			this._editableColumns &&
			this.editableColumns.has(_col.name)
		) {
			let _result = null;
			let _bCreated: boolean = false;

			let _dataRow = this.getDataRowFromCell(r, c);
			const _bAddingNewRow = this.isAddNewRow(this.rows[r]);

			if (_bAddingNewRow && _dataRow == null && this.itemsSource) {
				const _tb = this.tryGetItemSourceAsWebTable();
				if (_tb) {
					_dataRow = _tb.newRow0();
					_bCreated = true;
				}
			}

			this.expressionEvaluator.onParentRowRequired.addHandler(
				this.expressionEvaluator_onParentRowRequired,
				this
			);

			try {
				_result = this.expressionEvaluator.evaluate(
					this.editableColumns.get(_col.name),
					_dataRow
				);
			} catch (_ex) {
				console.log(_ex);
			} finally {
				this.expressionEvaluator.onParentRowRequired.removeHandler(
					this.expressionEvaluator_onParentRowRequired,
					this
				);

				if (_bCreated && _dataRow) {
					_dataRow.delete();
					_dataRow = null;
				}
			}

			if (_result == null || String.isNullOrEmpty(_result) || Object.is(_result, false))
				return false;
		}

		return _bCanCell;
	}

	startEditing(
		fullEdit?: boolean,
		r?: number,
		c?: number,
		focus?: boolean,
		evt?: any,
		pbInternalCall?: boolean
	): boolean {
		try {
			if (pbInternalCall) {
				const _t = BravoWebGrid.getColumnDataType(this.columns[c]);
				if (_t == wjc.DataType.Boolean) {
					return (
						!this.readOnly && !this.rows[r].isReadOnly && !this.columns[c].isReadOnly
					);
				}
			}

			return super.startEditing(fullEdit, r, c, focus, evt);
		} catch (_ex) {
			return false;
		}
	}

	public onBeginningEdit(e: wjg.CellRangeEventArgs) {
		this.setControlEditor(null);

		if (!this.canStartEdit(e.row, e.col)) {
			e.cancel = true;

			/* if (e.data instanceof MouseEvent) {
                let edt = wjc.tryCast(e.data.target, HTMLInputElement) as HTMLInputElement;
                if (edt && edt.type == 'checkbox' && !edt.disabled && !edt.readOnly)
                    edt.checked = !edt.checked;
            } */

			return false;
		}

		if (this.itemsSource == null) return super.onBeginningEdit(e);

		const _col: wjg.Column = this.columns[e.col];

		if (this.isCellButton(e.row, e.col)) {
			e.cancel = true;
			return;
		}

		let _flags = RestrictedColumnEnum.None;
		if (!String.isNullOrEmpty(_col.name) && this.restrictedColumns.has(_col.name))
			_flags |= Number.asNumber(this.restrictedColumns.get(_col.name));
		if ((_flags & RestrictedColumnEnum.NoOpen) != 0) {
			e.cancel = true;
			return;
		}

		let _dataRow = this.getDataRowFromCell(e.row, e.col);
		const _bAddingNewRow = this.isAddNewRow(e.row);

		if (_bAddingNewRow) {
			if ((_flags & RestrictedColumnEnum.NoAddNew) != 0) {
				e.cancel = true;
				return;
			}

			const _column: wjg.Column = this.columns[e.col];

			// Handle editing check column at add-new row
			if (
				BravoWebGrid.getColumnDataType(_column) == wjc.DataType.Boolean &&
				_column[BravoWebGrid.GridColumEditorProp] == null
			) {
				super.onBeginningEdit(e);

				if (e.cancel) return;

				e.cancel = true;
				return;
			}
		} else {
			if (this.itemsSource == null && _dataRow == null) {
				e.cancel = true;
				return;
			}

			if (this.isHiddenRow(e.row) && !this.rows[e.row].visible) {
				e.cancel = true;
				return;
			}

			if (_dataRow && _dataRow.rowState == DataRowState.Added) {
				if ((_flags & RestrictedColumnEnum.NoAddNew) != 0) {
					e.cancel = true;
					return;
				}
			} else {
				if ((_flags & RestrictedColumnEnum.NoEdit) != 0) {
					e.cancel = true;
					return;
				}

				if (
					(_flags & RestrictedColumnEnum.NoOpenDOU) != 0 ||
					(_flags & RestrictedColumnEnum.NoEditDOU) != 0
				) {
					this.raiseOnRestrictedDOUColumn(e);

					if (e.cancel) {
						return;
					}
				}
			}
		}

		if (e.data instanceof MouseEvent && _isNativeCheckbox(this, e.data.target)) {
			const _chk = wjc.tryCast(e.data.target, HTMLInputElement) as HTMLInputElement;
			const _ecv = this.editableCollectionView;

			if (_ecv) {
				let _e = new wjg.CellEditEndingEventArgs(e.panel, e.range, e.data);

				const _col = e.panel.columns[e.col];
				if (_col && _col.binding) {
					_ecv.currentItem[_col.binding] = _chk.checked;
				}

				if (this.onCellEditEnding(_e)) {
					_ecv.commitEdit();
					this.onCellEditEnded(_e);
				}
			}

			e.cancel = true;
			return;
		}

		// if(this._edtHdl._isNativeCheckbox())

		/* if (e.data instanceof MouseEvent && this._edtHdl._isNativeCheckbox(e.data.target)) {
            const _chk = wjc.tryCast(e.data.target, HTMLInputElement) as HTMLInputElement;
            const _ecv = this.editableCollectionView;
            if (_ecv) {
                let _e = new wjg.CellEditEndingEventArgs(e.panel, e.range, e.data);
    
                if (this.onCellEditEnding(_e)) {
                    _ecv.commitEdit();
                    this.onCellEditEnded(_e);
                }
            }
    
            e.cancel = true;
            return;
        } */

		if (_col.name && this._editableColumns && this.editableColumns.has(_col.name)) {
			let _result = null;

			if (BravoWebGrid.bComboBoxStartEditFlag) {
				_result = this._lastStartEditResult;
			} else {
				let _bCreated: boolean = false;

				if (_bAddingNewRow && _dataRow == null && this.itemsSource) {
					const _tb = this.tryGetItemSourceAsWebTable();
					if (_tb) {
						_dataRow = _tb.newRow0();
						_bCreated = true;
					}
				}

				this.expressionEvaluator.onParentRowRequired.addHandler(
					this.expressionEvaluator_onParentRowRequired,
					this
				);

				try {
					this._lastStartEditResult = _result = this.expressionEvaluator.evaluate(
						this.editableColumns.get(_col.name),
						_dataRow
					);
				} catch (_ex) {
					console.log(_ex);
				} finally {
					this.expressionEvaluator.onParentRowRequired.removeHandler(
						this.expressionEvaluator_onParentRowRequired,
						this
					);

					if (_bCreated && _dataRow) {
						_dataRow.delete();
						_dataRow = null;
					}
				}
			}

			if (_result == null || String.isNullOrEmpty(_result) || Object.is(_result, false)) {
				e.cancel = true;
				return;
			}

			let _editor = null;
			let _zCtrlKey = String.format('{0}_{1}', _col.name, _result);
			if (
				this._controls &&
				this.controls.findIndex((editor) => editor && editor.name == _zCtrlKey) != -1
			) {
				_editor = this.controls.find((editor) => editor && editor.name == _zCtrlKey);
			} else {
				_zCtrlKey = String.format('{0}_Default', _col.name);
				if (
					this._controls &&
					this.controls.findIndex((editor) => editor && editor.name == _zCtrlKey) != -1
				)
					_editor = this.controls.find((editor) => editor && editor.name == _zCtrlKey);
			}

			if (_editor) {
				_editor.visible = true;
				_col[BravoWebGrid.GridColumEditorProp] = _editor;
			}
		}

		this.onSetupEditor(e);
		if (e.data instanceof wjc.Control) this.setControlEditor(e.data);

		if (_bAddingNewRow) {
			e.cancel = true;
			return;
		}

		return super.onBeginningEdit(e);
	}

	private expressionEvaluator_onParentRowRequired(s, e: ParameterValueEventArgs) {
		const _bs = this.dataSource instanceof BravoBindingSource ? this.dataSource : null;
		if (_bs) {
			const _bsParent = _bs.dataSource instanceof BravoBindingSource ? _bs.dataSource : null;
			if (_bsParent && !_bsParent.isBindingSuspended && _bsParent.currentRow)
				e.value = _bsParent.currentRow;
		}
	}

	public restoreDefaultSumColumns() {
		this.sumColumns.clear();
		this.sumColumns.set(BravoWebGrid.AllColumnValue, null);
	}

	public clearDynamicStyles() {
		if (this._dynamicStyles) this._dynamicStyles.clear();
	}

	public addDynamicStyle(pzName: string, pzStyleExpression: string, pzColumnList: string) {
		this.dynamicStyles.push(new DynamicStyleItem(pzName, pzStyleExpression, pzColumnList));
	}

	public getMergedRange(p: wjg.GridPanel, r: number, c: number, clip?: boolean) {
		if (
			!BravoCore.isDefined(p) ||
			!BravoCore.isDefined(r) ||
			!BravoCore.isDefined(c) ||
			r == -1 ||
			c == -1
		)
			return super.getMergedRange(p, r, c, clip);

		let _rng: wjg.CellRange,
			_rows = p.rows,
			_columns = p.columns,
			_row: wjg.Row = _rows ? _rows[r] : null,
			_col: wjg.Column = _columns ? _columns[c] : null,
			_al = this.allowMerging,
			_bIsFixed = p.cellType != wjg.CellType.Cell;

		if (p.cellType == wjg.CellType.Cell && this.mergedRanges.length > 0) {
			for (const _rg of this.mergedRanges) {
				if (_rg.containsColumn(c) && _rg.containsRow(r)) {
					let _rng = new wjg.CellRange(r, c);
					for (let _i = _rng.col; _i < _rg.col2; _i++) _rng.col2 = _i + 1;

					for (let _i = _rng.col; _i > _rg.col; _i--) _rng.col = _i - 1;

					return _rng;
				}
			}
		}

		/* if (this.isAddNewRow(r) && p.cellType == wjg.CellType.Cell &&
            this.showAddNewRow != ShowAddNewRowEnum.None) {
            if (!this.selection.containsRow(r))
                return new wjg.CellRange(r, 0, r, p.columns.length - 1);
        } */

		if (
			this.gridMode == GridModeEnum.GanttChart &&
			c >= this.nStartGanttCol &&
			c <= this.nEndGanttCol
		) {
			if (p.cellType == wjg.CellType.ColumnHeader) {
				let _gr = this.getGlyphRow();
				let _rg = super.getMergedRange(p, r, c, clip) || new wjg.CellRange(r, c);
				let _z = this.getGanttChartColumnHeader(r, c);
				let _nGroupRow = -1;
				let _i = 0;

				let _cs = this.styles.get(GanttGroupTimeScaleStyle);
				if (
					_cs &&
					!String.isNullOrEmpty(_cs[StyleElementFlags[StyleElementFlags.Format]])
				) {
					_nGroupRow = _gr - 1;
					if (r <= _nGroupRow) {
						for (_i = r - 1; _i >= 0; _i--)
							if (String.compare(this.getGanttChartColumnHeader(_i, c), _z) == 0)
								_rg.row--;
						for (_i = r + 1; _i <= _nGroupRow; _i++)
							if (
								String.compare(this.getGanttChartColumnHeader(_i, c), _z) == 0 &&
								_rg.row2 < p.rows.length - 1
							)
								_rg.row2++;
					}
				}

				if (r > _nGroupRow) {
					for (_i = r - 1; _i > _nGroupRow; _i--)
						if (String.compare(this.getGanttChartColumnHeader(_i, c), _z) == 0)
							_rg.row--;
					for (_i = r + 1; _i < p.rows.length; _i++)
						if (
							String.compare(this.getGanttChartColumnHeader(_i, c), _z) == 0 &&
							_rg.row2 < p.rows.length - 1
						)
							_rg.row2++;
				}

				if (
					r == _gr - 1 &&
					_cs &&
					!String.isNullOrEmpty(_cs[StyleElementFlags[StyleElementFlags.Format]])
				) {
					let _zCap = this.getGanttChartColumnHeader(r, c);
					if (!String.isNullOrEmpty(_zCap)) {
						for (_i = c - 1; _i >= 0; _i--) {
							if (!this.isGanttChartCol(_i)) break;

							if (String.compare(_zCap, this.getGanttChartColumnHeader(r, _i)) != 0)
								break;

							_rg.col--;
						}

						for (_i = c + 1; _i < p.columns.length; _i++) {
							if (!this.isGanttChartCol(_i)) break;

							if (String.compare(_zCap, this.getGanttChartColumnHeader(r, _i)) != 0)
								break;

							_rg.col2++;
						}
					}
				}

				return _rg;
			}

			return new wjg.CellRange(r, c);
		}

		if (!_col.name) return super.getMergedRange(p, r, c, clip);

		if (!_bIsFixed && this.bGroupInColumn && this.groups.size > 0) {
			/* if (_row instanceof wjg.GroupRow) {
                return super.getMergedRange(p, r, c, clip);
            }
            else */
			if (!(_row instanceof wjg.GroupRow) && this.groups.has(_col.name)) {
				// let _merged = this.groupInColumnMergedRanges.find(rng => rng.contains(r, c));
				// if (_merged) return _merged;

				let _rng = super.getMergedRange(p, r, c, clip);
				if (!_rng) _rng = new wjg.CellRange(r, c);

				let _data = null,
					_data1 = null;

				for (let _i = _rng.row; _rows && _i < _rows.length - 1; _i++) {
					if (_i > _rng.row && _rows[_i] instanceof wjg.GroupRow) break;

					_data = this.getCellData(_i, _rng.col, true);
					_data1 = this.getCellData(_i + 1, _rng.col, true);
					if (_data == null || _data1 == null) break;

					let _bMatch = true;
					let _keys = Array.from(this._groups.keys());
					for (let _n = 0; _n < _keys.length; _n++) {
						let _zKey = _keys[_n],
							_col1 = <wjg.Column>_columns.find((c) => c.name == _zKey);
						if (_col1 == null) break;

						_data = this.getCellData(_i, _col1.index, true);
						_data1 = this.getCellData(_i + 1, _col1.index, true);

						if (!(_data === _data1)) {
							_bMatch = false;
							break;
						}

						if (_col.name == _zKey) break;
					}

					if (!_bMatch) break;

					_rng.row2 = _i + 1;
				}

				for (let _i = _rng.row; _i > 0; _i--) {
					if (_rows[_i] instanceof wjg.GroupRow) break;
					_data = this.getCellData(_i, _rng.col, true);
					_data1 = this.getCellData(_i - 1, _rng.col, true);
					if (_data == null || _data1 == null) break;

					let _bMatch = true;
					let _keys = Array.from(this._groups.keys());
					for (let _n = 0; _n < _keys.length; _n++) {
						let _zKey = _keys[_n],
							_col1 = <wjg.Column>_columns.find((c) => c.name == _zKey);
						if (_col1 == null) break;

						_data = this.getCellData(_i, _col1.index, true);
						_data1 = this.getCellData(_i - 1, _col1.index, true);
						if (!(_data === _data1)) {
							_bMatch = false;
							break;
						}

						if (_col.name == _zKey) break;
					}

					if (!_bMatch) break;

					_rng.row = _i - 1;
				}

				// this.groupInColumnMergedRanges.push(_rng);

				return _rng;
			}
		}

		if (
			p.cellType == wjg.CellType.ColumnHeader ||
			(_al == wjg.AllowMerging.Cells && p.cellType == wjg.CellType.Cell)
		) {
			_rng = new wjg.CellRange(r, c);

			const UserDataProp = StyleElementFlags[StyleElementFlags.UserData];
			let _cs1 = null,
				_cs2 = null;

			for (let i = _rng.col; i < p.columns.length - 1; i++) {
				_cs1 = BravoWebGrid.getCellStyle(p, _rng.row, i);
				if (!_cs1 || !_cs1[UserDataProp]) break;

				_cs2 = BravoWebGrid.getCellStyle(p, _rng.row, i + 1);
				if (!_cs2 || !_cs2[UserDataProp]) break;

				if (_cs1[UserDataProp] !== _cs2[UserDataProp]) break;

				_rng.col2 = i + 1;
			}

			for (let i = _rng.col; i > 0; i--) {
				_cs1 = BravoWebGrid.getCellStyle(p, _rng.row, i);
				if (!_cs1 || !_cs1[UserDataProp]) break;

				_cs2 = BravoWebGrid.getCellStyle(p, _rng.row, i - 1);
				if (!_cs2 || !_cs2[UserDataProp]) break;

				if (_cs1[UserDataProp] !== _cs2[UserDataProp]) break;

				_rng.col = i - 1;
			}

			for (let i = _rng.row; i < p.rows.length - 1; i++) {
				_cs1 = BravoWebGrid.getCellStyle(p, i, _rng.col);
				if (!_cs1 || !_cs1[UserDataProp]) break;

				_cs2 = BravoWebGrid.getCellStyle(p, i + 1, _rng.col);
				if (!_cs2 || !_cs2[UserDataProp]) break;

				if (_cs1[UserDataProp] !== _cs2[UserDataProp]) break;

				_rng.row2 = i + 1;
			}

			for (let i = _rng.row; i > 0; i--) {
				_cs1 = BravoWebGrid.getCellStyle(p, i, _rng.col);
				if (!_cs1 || !_cs1[UserDataProp]) break;

				_cs2 = BravoWebGrid.getCellStyle(p, i - 1, _rng.col);
				if (!_cs2 || !_cs2[UserDataProp]) break;

				if (_cs1[UserDataProp] !== _cs2[UserDataProp]) break;

				_rng.row = i - 1;
			}

			return _rng;
		}

		if (
			_row instanceof wjg.GroupRow &&
			(p.cellType == wjg.CellType.Cell || p.cellType == wjg.CellType.ColumnFooter)
		) {
			_rng = new wjg.CellRange(r, c);

			if (this.isTreeNodeMode()) return _rng;

			if (
				this.treeColumnPos != -1 &&
				c >= this.treeColumnPos &&
				_col.aggregate == wjc.Aggregate.None
			) {
				if (c != this.treeColumnPos && p.getCellData(r, c, false)) {
					if (!this._rMerge) this._rMerge = [];
					this._rMerge[r] = c;
					return super.getMergedRange(p, r, c, clip);
				}

				if (this._rMerge && this._rMerge[r] != null && this._rMerge[r] < c) {
					return null;
				}

				while (
					_rng.col > this.treeColumnPos &&
					_columns[_rng.col - 1] &&
					_columns[_rng.col - 1].aggregate == wjc.Aggregate.None &&
					!this.isGanttChartCol(_rng.col - 1) &&
					_rng.col != _columns.frozen
				)
					_rng.col--;

				while (
					_rng.col2 < _columns.length - 1 &&
					_columns[_rng.col2 + 1] &&
					_columns[_rng.col2 + 1].aggregate == wjc.Aggregate.None &&
					!this.isGanttChartCol(_rng.col2 + 1) &&
					_rng.col2 + 1 != _columns.frozen &&
					!p.getCellData(_rng.row, _rng.col2 + 1, false)
				)
					_rng.col2++;
			}

			return _rng.isSingleCell ? null : _rng;
		}

		return super.getMergedRange(p, r, c, clip);
	}

	public getGlyphRow() {
		if (this.columnHeaders.rows.length < 1) return 0;

		for (let _nRow = this.columnHeaders.rows.length - 1; _nRow >= 0; _nRow--) {
			let _row: wjg.Row = this.columnHeaders.rows[_nRow];
			if (!_row.visible || isIgnored(_row)) continue;

			return _nRow;
		}

		return 0;
	}

	private isEmptyArrayString(arr: Array<string>) {
		if (!arr || arr.length < 1) return true;

		for (const _v of arr) {
			if (!String.isNullOrEmpty(_v)) return false;
		}

		return true;
	}

	public setClipString(text: string, rng?: wjg.CellRange) {
		if (!this.selection.isValid || !this.itemsSource) return;

		if (String.isNullOrEmpty(text)) return;

		const tsvStringToArray = (data) => {
			const re = /(\t|\r?\n|\r|^)(?:"([^"]*(?:""[^"]*)*)"|([^\t\r\n]*))/gi;
			const result = [[]];
			let matches;
			while ((matches = re.exec(data))) {
				if (matches[1].length && matches[1] !== '\t') result.push([]);
				result[result.length - 1].push(
					matches[2] !== undefined ? matches[2].replace(/""/g, '"') : matches[3]
				);
			}
			return result;
		};

		let _opt = StringSplitOptions.None;
		if ((this.allowEditingMultiCells & AllowEditingMultiCellEnum.TrimEmptyRow) != 0)
			_opt = StringSplitOptions.RemoveEmptyEntries;

		let _lines = tsvStringToArray(text); //text.split(/\r?\n/gi);

		let _nLineCount = _lines.length;
		if (_nLineCount < 1) return;

		if ((this.allowEditingMultiCells & AllowEditingMultiCellEnum.TrimEmptyRow) != 0) {
			const _l = new Array<Array<string>>();
			for (const _z of _lines) {
				if (!this.isEmptyArrayString(_z)) _l.push(_z);
			}

			_lines = _l;
			_nLineCount = _lines.length;
		} else if (_nLineCount > 1 && this.isEmptyArrayString(_lines[_nLineCount - 1])) {
			_nLineCount--;
		}

		const _rgSelection = this.selection;

		let _bPasted = false;
		let _nStartRow = _rgSelection.topRow;
		let _nStartCol = _rgSelection.leftCol;
		let _cells = new Array<Array<string>>();
		let _nMaxCells = 0;

		for (const _z of _lines) {
			_cells.push(_z);
			let _n = _cells[_cells.length - 1].length;
			if (_nMaxCells < _n) _nMaxCells = _n;
		}

		let _bAddNewRow = false;
		let _nSelectedRows = 0;
		for (let _n = _rgSelection.topRow; _n <= _rgSelection.bottomRow; _n++) {
			if (this.isHiddenRow(_n) || this.getCurrentHeightOfRow(this.cells, _n) < 1) continue;

			if (this.isAddNewRow(_n)) {
				_nSelectedRows++;
				_bAddNewRow = true;
				break;
			} else if (this.getDataRowFromCell(_n, _nStartCol) != null) {
				_nSelectedRows++;
			}
		}

		let _nSelectedCols = 0;
		for (let _n = _rgSelection.leftCol; _n < _rgSelection.rightCol; _n++) {
			if (this.getCurrentWidthOfCol(this.cells, _n) < 1) continue;

			_nSelectedCols++;
		}

		let _nEndRow =
			_nStartRow +
			Math.max(_rgSelection.bottomRow - _rgSelection.topRow + 1, _nLineCount) -
			1;
		let _nEndCol =
			_nStartCol + Math.max(_rgSelection.rightCol - _rgSelection.leftCol + 1, _nMaxCells) - 1;

		let _bCanDuplicate =
			(_bAddNewRow || (_nSelectedRows >= _nLineCount && _nSelectedRows % _nLineCount == 0)) &&
			_nSelectedCols >= _nMaxCells &&
			_nSelectedCols % _nMaxCells == 0 &&
			(_nSelectedCols > _nMaxCells || _nSelectedRows > _nLineCount || _bAddNewRow);

		if (!_bCanDuplicate) {
			_nEndRow = this.rows.length - 1;
			_nEndCol = this.columns.length - 1;
		}

		let _nMaxNewRows = Math.max(_nSelectedRows, _nLineCount);
		if (
			_bCanDuplicate &&
			_nSelectedRows > _nLineCount &&
			_bAddNewRow &&
			_nSelectedRows % _nLineCount != 0
		) {
			_nMaxNewRows = (_nSelectedRows / _nLineCount + 1) * _nLineCount;
		}

		let _nAddedRows = 0,
			_nLine = 0;

		for (let _n = _nStartRow; _n <= _nEndRow; _n++) {
			if (this.isHiddenRow(_n) || this.getCurrentHeightOfRow(this.cells, _n) < 1) continue;

			if (this.isAddNewRow(_n)) {
				while (_nAddedRows < _nMaxNewRows) {
					const _drv = this.onAddingNewRow();
					if (!_drv) break;

					_nAddedRows++;
					if (
						this.pasteColumnValues(
							_drv,
							_cells[_nLine],
							_nMaxCells,
							_nStartCol,
							_nEndCol,
							_bCanDuplicate
						)
					)
						_bPasted = true;

					_nLine++;
					if (_nLine >= _nLineCount) {
						if (_bCanDuplicate) _nLine = 0;
						else break;
					}
				}

				break;
			} else {
				const _dr = this.getDataRowFromCell(_n, _nStartCol);
				if (_dr != null) {
					_nAddedRows++;
					if (
						this.pasteColumnValues(
							_dr,
							_cells[_nLine],
							_nMaxCells,
							_nStartCol,
							_nEndCol,
							_bCanDuplicate
						)
					)
						_bPasted = true;

					_nLine++;
					if (_nLine >= _nLineCount) {
						if (_bCanDuplicate) _nLine = 0;
						else break;
					}
				}
			}
		}

		return _bPasted;
	}

	private pasteColumnValues(
		pDataRow: WebDataRow,
		pPasteCells: Array<string>,
		pnMaxCells: number,
		pnStartCol: number,
		pnEndCol: number,
		pbCanDuplicate: boolean
	) {
		let _bPasted = false;
		let _nRow = -1;
		for (let _n = 0; _n < this.rows.length; _n++) {
			if (Object.is(pDataRow, this.getDataRowFromCell(_n, pnStartCol))) {
				_nRow = _n;
				break;
			}
		}

		if (_nRow < 0 || _nRow >= this.rows.length) return _bPasted;

		let _nCell = 0;
		const _eh = (s, e: ParameterValueEventArgs) => {
			e.value = pDataRow;
		};
		this.expressionEvaluator.dataRowRequired.addHandler(_eh);

		try {
			for (let _nCol = pnStartCol; _nCol <= pnEndCol; _nCol++) {
				if (this.getCurrentWidthOfCol(this.cells, _nCol) < 1) continue;

				const _zPasteString = pPasteCells[_nCell];
				if (!String.isNullOrEmpty(_zPasteString) && this.canStartEdit(_nRow, _nCol)) {
					const _pasteValue = { value: null };
					const _editor = this.getColumnEditor(_nRow, _nCol);

					if (this.pasteCellEditorValue(_editor, _zPasteString, _pasteValue)) {
						const _zColName = this.columns[_nCol].binding;
						const _dataCol = pDataRow.table.columns.get(_zColName);

						if (
							_dataCol &&
							!_dataCol.readOnly &&
							!BravoDataTypeConverter.compareValue(
								pDataRow.getValue(_zColName),
								_pasteValue.value,
								_dataCol.dataType
							)
						) {
							try {
								pDataRow.setValue(
									_zColName,
									BravoDataTypeConverter.convertValue(
										_pasteValue.value,
										_dataCol.dataType
									)
								);
								if (!_bPasted) _bPasted = true;
							} catch (_ex) {
								console.warn(
									String.format(
										"Cannot assign value {0:G} to column '{1}' ('{2}') of table '{3}' cause error: {4}",
										_pasteValue.value,
										_zColName,
										_dataCol.dataType,
										pDataRow.table.name,
										_ex.message
									)
								);
							}
						}
					}
				}

				_nCell++;

				if (_nCell >= pPasteCells.length) {
					if (_nCell < pnMaxCells) continue;
					else if (pbCanDuplicate) _nCell = 0;
					else break;
				}
			}

			return false;
		} finally {
			this.expressionEvaluator.dataRowRequired.removeHandler(_eh);
		}
	}

	protected pasteCellEditorValue(pEditor: any, pzInValue: string, pOutValue = { value: null }) {
		pOutValue.value = pzInValue;

		const _txt = wjc.tryCast(pEditor, BravoTextBox) as BravoTextBox;
		const _cbo = wjc.tryCast(pEditor, 'IBravoComboBox') as BravoComboBox;
		if (_txt || _cbo) {
			let _z = pzInValue;

			if (_txt) {
				if (_txt.characterCasing == CharacterCasing.Lower) _z = _z.toLowerCase();
				else if (_txt.characterCasing == CharacterCasing.Upper) _z = _z.toUpperCase();

				if (_txt.trimStart) _z = _z.trimStart();
				if (_txt.trimEnd) _z = _z.trimEnd();
			}

			if (_cbo) {
			} else if (_txt) {
				const _out = { pzText: _z };
				BravoTextBox.autoCorrectText(_txt.autoCorrectOptions, _out);
				_z = _out.pzText;
				if (!BravoTextBox.validateChars(_z, _txt.zRestrictedChars, _txt.bRestrictedUnicode))
					return false;
			}

			pOutValue.value = _z;
		} else if (pEditor instanceof BravoNumericInputBox) {
			let _out = { num: null };
			if (BravoDataTypeConverter.isNumericValue(pzInValue, _out)) {
				pOutValue.value = _out.num;
			}

			return true;
		} else if (pEditor instanceof BravoDateBox) {
			const _out = { datetime: null };
			if (BravoDataTypeConverter.isDateTimeValue(pzInValue, _out, 'vi-VN'))
				pOutValue.value = _out.datetime;

			return true;
		}

		if (_cbo && !String.isNullOrEmpty(_cbo.zHiddenValueMember)) {
			_cbo.bTextHasChanged = true;
			let _values = [pzInValue];
			if (
				(_cbo.lookupMode == LookupModeEnum.ChecklistValueMember ||
					((_cbo.lookupMode == LookupModeEnum.PartialValueMember ||
						_cbo.lookupMode == LookupModeEnum.ExactValueMember) &&
						_cbo.bAutoSwitchChecklistMode)) &&
				pzInValue.includes(_cbo.zValueListSeparator)
			)
				_values = pzInValue.split(_cbo.zValueListSeparator);

			const _bExisted = _cbo.queryDataExist(_values, true);
			if (_bExisted && _cbo.valueItem.length > 0) {
				let _zValStr = String.empty;
				for (let _i = 0; _i < _cbo.valueItem.length; _i++) {
					const _z = _cbo.valueItem[_i].getValueText(_cbo.zHiddenValueMember);
					if (String.isNullOrEmpty(_z)) continue;

					if (!String.isNullOrEmpty(_zValStr)) _zValStr += _cbo.zValueListSeparator;

					_zValStr += _z;
				}

				pOutValue.value = _zValStr;
			}
		}

		return true;
	}

	private _rMerge = [];

	public readCellData(
		panel: GridPanel,
		row: number,
		col: number,
		pCellInfo: GridCellInfo,
		pCulture?: any,
		bUsingElementExist: boolean = true,
		pbBasedOwnerDraw = false
	) {
		if (panel == null || pCellInfo == null) return;

		pCellInfo.range = this.getMergedRange(panel, row, col) || new wjg.CellRange(row, col);

		if (pCellInfo.cellType == GridCellTypeEnum.rtf && !bUsingElementExist)
			bUsingElementExist = true;

		let _elementExist = panel.getCellElement(row, col);
		let _cellElement = bUsingElementExist ? _elementExist : null;

		if (
			_cellElement ==
			null /* || BravoExpressionEvaluator.containsExpression(panel.getCellData(
         pCellInfo.range.row, pCellInfo.range.col, false)) */
		) {
			_cellElement = document.createElement('div');
			_cellElement.style.visibility = 'hidden';
			_cellElement.setAttribute(wjg.FlexGrid._WJS_MEASURE, `${pbBasedOwnerDraw}`);

			panel.hostElement.appendChild(_cellElement);

			let _oArgs = new RaiseOwnerDrawCellEventArgs(panel, pCellInfo.range, _cellElement);
			_oArgs.culture = pCulture;
			_oArgs.cancel = pbBasedOwnerDraw;

			if (pCulture) panel['culture'] = pCulture;

			this.cellFactory.updateCell(panel, row, col, _cellElement, pCellInfo.range, true);

			/* if (pbBasedOwnerDraw) {
                this.formatAutoTextCell(_oArgs);
                super.onFormatItem(_oArgs);
            }
            else {
                this.onFormatItem(_oArgs);
            } */

			if (panel['culture']) delete panel['culture'];

			if (_oArgs.image) pCellInfo.image = _oArgs.image;

			if (_oArgs.cellStyle) pCellInfo.style = _oArgs.cellStyle;
		}

		if (!pCellInfo.style) pCellInfo.style = BravoWebGrid.getCellStyle(panel, row, col, false);

		if (_cellElement && _cellElement.className) {
			_cellElement.className = _cellElement.className.replace(StateSelectedStyleName, '');
			_cellElement.className = _cellElement.className.replace(MultiSelectedStyleName, '');
		}

		pCellInfo.bounds = this.getCellRectDisplay(panel, row, col, true);
		pCellInfo.cellElement = _cellElement;

		if (_elementExist && bUsingElementExist) {
			pCellInfo.styleCss = getComputedStyle(_elementExist);
		} else {
			pCellInfo.styleCss = {};
			let _zKey: string;

			if (this._bIsCacheStyle) {
				let _row = panel.grid.rows[row] as wjg.Row;

				if (
					_row &&
					_row.cssClass &&
					_row.cssClass.includes(CellStyleEnum[CellStyleEnum.GrandTotal])
				)
					_zKey = String.format(
						'{0}.{1}.{2}.{3}',
						this.name,
						wjg.CellType[panel.cellType],
						CellStyleEnum[CellStyleEnum.GrandTotal],
						col
					);
				else
					_zKey = String.format(
						'{0}.{1}.{2}.{3}',
						this.name,
						wjg.CellType[panel.cellType],
						row,
						col
					);

				if (this.cacheStyleGrid.has(_zKey))
					pCellInfo.styleCss = this.cacheStyleGrid.get(_zKey);
			}

			if (!this._bIsCacheStyle || !this.cacheStyleGrid.has(_zKey)) {
				let _css = null;
				let _row = panel.grid.rows[row] as wjg.Row;

				if (panel.cellType == wjg.CellType.ColumnHeader) _row = panel.rows[row];

				if (pCellInfo.style) {
					_css = CellStyle.buildCss(pCellInfo.style);
					if (_css) {
						for (const _z in _css) {
							pCellInfo.styleCss[_z] = _css[_z];
						}
					}
				}

				let _computedStyle = getComputedStyle(_cellElement);

				if (_computedStyle && _computedStyle.length > 0) {
					for (const _p in _computedStyle) {
						let _idx = Number.asNumber(_p);
						if (!isNaN(_idx)) {
							let _prop = _computedStyle[_idx];

							if (
								!String.isNullOrEmpty(_prop) &&
								(_css == null ||
									_css[_prop] == undefined ||
									_prop.includes('padding') ||
									(_row &&
										((_row.cssClass &&
											_row.cssClass.includes(
												CellStyleEnum[CellStyleEnum.GrandTotal]
											)) ||
											(_row.cssClassAll &&
												_row.cssClassAll.includes('AutoCountRowStyle')))) ||
									(_row instanceof wjg.Row &&
										_row.dataItem &&
										!String.isNullOrEmpty(
											_row.dataItem[CommandStrings.RepFormatStyleKeyColumn]
										)))
							)
								pCellInfo.styleCss[_prop] = _computedStyle[_prop];
						}
					}
				}

				if (this._bIsCacheStyle) this.cacheStyleGrid.set(_zKey, pCellInfo.styleCss);
			}
		}

		let _zBgImage = pCellInfo.styleCss['background-image'];
		let _bIsCellImage =
			pCellInfo.cellType == GridCellTypeEnum.img || (_zBgImage && _zBgImage != 'none');

		if (_bIsCellImage) {
			let _imgData = panel.getCellData(row, col, false);
			if (BravoExpressionEvaluator.containsExpression(_imgData)) {
				let _dataRow = this.getDataRowFromCell(row, col);
				_imgData = this.expressionEvaluator.evaluateText(_imgData, _dataRow);
			}

			if (String.isNullOrEmpty(_imgData) && _zBgImage && _zBgImage != 'none')
				_imgData = _zBgImage.substring(
					_zBgImage.indexOf('base64,') + 'base64,'.length,
					_zBgImage.indexOf('")')
				);

			pCellInfo.image = _imgData;
		}

		let _col = <wjg.Column>panel.columns[col];

		if (_cellElement && _cellElement.querySelector('br'))
			pCellInfo.zRawText = panel.getCellData(pCellInfo.range.row, pCellInfo.range.col, false);
		else if (
			_col != null &&
			panel.cellType == wjg.CellType.Cell &&
			_col.dataType == wjc.DataType.Number
		)
			pCellInfo.zRawText = panel.getCellData(row, col, false);

		if (_cellElement && _cellElement.querySelector('span'))
			_cellElement.querySelectorAll('span').forEach((e) => {
				if (e && e.classList.contains('wj-sort-index')) e.remove();
			});

		if (_cellElement && _cellElement.textContent)
			pCellInfo.zText = _cellElement.textContent.trimEnd().replace(/\r\n/g, '\n');

		if (
			!bUsingElementExist &&
			!panel.grid.itemsSource &&
			_elementExist &&
			_cellElement &&
			String.compare(_elementExist.textContent, _cellElement.textContent) !== 0
		) {
			pCellInfo.zText = _elementExist.textContent.trimEnd().replace(/\r\n/g, '\n');
		}

		if (wjc.isString(pCellInfo.zText) && pCellInfo.zText.indexOf('[...]') > -1)
			pCellInfo.zText = panel.getCellData(row, col, false);
	}

	protected getColumnEditor(pnRow: number, pnCol: number) {
		const _col = this.columns[pnCol] as wjg.Column;
		if (!_col) return;

		let _editor = _col[BravoWebGrid.GridColumEditorProp];
		if (_editor) {
			let _zColName = _col.binding;
			if (!String.isNullOrEmpty(_zColName) && this.editableColumns.has(_zColName)) {
				let _result = null;
				let _dataRow = this.getDataRowFromCell(pnRow, pnCol);

				this._nExpressionUpdatedCol = pnCol;
				this.expressionEvaluator.onLocalValueRequired.addHandler(
					this.expressionEvaluator_onLocalValueRequired,
					this
				);
				this.expressionEvaluator.onParentRowRequired.addHandler(
					this.expressionEvaluator_onParentRowRequired,
					this
				);

				try {
					_result = this.expressionEvaluator.evaluate(
						this.editableColumns.get(_zColName),
						_dataRow
					);
				} finally {
					this._nExpressionUpdatedCol = -1;
					this.expressionEvaluator.onLocalValueRequired.removeHandler(
						this.expressionEvaluator_onLocalValueRequired,
						this
					);
					this.expressionEvaluator.onParentRowRequired.removeHandler(
						this.expressionEvaluator_onParentRowRequired,
						this
					);
				}

				if (
					_result == null ||
					String.isNullOrEmpty(String.format('{0}', _result).trim()) ||
					Object.is(false, _result)
				) {
					return null;
				}

				let _zCtrlKey = String.format('{0}_{1}', _col._binding, _result);
				if (
					this._controls &&
					this.controls.findIndex((editor) => editor && editor.name == _zCtrlKey) != -1
				) {
					_editor = this.controls.find((editor) => editor && editor.name == _zCtrlKey);
				} else {
					_zCtrlKey = String.format('{0}_Default', _col.name);
					if (
						this._controls &&
						this.controls.findIndex((editor) => editor && editor.name == _zCtrlKey) !=
							-1
					)
						_editor = this.controls.find(
							(editor) => editor && editor.name == _zCtrlKey
						);
				}
			}
		}

		return _editor;
	}

	public getCellRectDisplay(panel: wjg.GridPanel, row: number, col: number, raw?: boolean) {
		let _rng = this.getMergedRange(panel, row, col, true) || new wjg.CellRange(row, col);
		if (!_rng.isValid) return null;

		if (_rng.isSingleCell) return panel.getCellBoundingRect(row, col, raw);

		let _rowTop = <wjg.Row>panel.rows[_rng.topRow],
			_colLeft = <wjg.Column>panel.columns[_rng.leftCol],
			_nHeight = 0,
			_nWidth = 0;

		for (let _nCol = _rng.leftCol; _nCol <= _rng.rightCol; _nCol++)
			_nWidth += panel.columns[_nCol].renderSize;

		for (let _nRow = _rng.topRow; _nRow <= _rng.bottomRow; _nRow++)
			_nHeight += panel.rows[_nRow].renderSize;

		let _rc = new wjc.Rect(_colLeft.pos, _rowTop.pos, _nWidth, _nHeight);

		if (!raw) {
			let rcp = this.hostElement.getBoundingClientRect();
			_rc.left += rcp.left;
			_rc.top += rcp.top - this._offsetY;
		}

		if (row < this.rows.frozen) {
			_rc.top -= this.scrollPosition.y;
		}
		if (col < this.columns.frozen) {
			_rc.left -= this.scrollPosition.x * (this.rightToLeft ? -1 : +1);
		}

		// done
		return _rc;
	}

	public getDataIndex(row: wjg.Row | number) {
		let _nRowIndex: number = row instanceof wjg.Row ? row.index : row;
		if (_nRowIndex < 0 || _nRowIndex >= this.rows.length) return -1;

		let _cv = this.collectionView;
		if (_cv == null) return -1;

		let _row = this.rows[_nRowIndex];
		if (_row instanceof wjg.GroupRow && !this.isTreeNodeMode()) return -1;

		return _cv.items.indexOf(_row.dataItem);
	}

	public getDataRowFromCell(pnRow: number, pnCol: number): WebDataRow {
		return this.getDataRowFromIndex(this.getDataIndex(pnRow));
	}

	public getDataRowFromIndex(pnDataIndex: number) {
		if (!this.collectionView || pnDataIndex < 0) return null;

		try {
			const _cv = this.collectionView;
			if (_cv) {
				const _currentItem = _cv.items[pnDataIndex];
				if (_currentItem) {
					const _tb = this.tryGetItemSourceAsWebTable();
					return _tb.rows.find((r) => r.item == _currentItem);
				}
			}
		} catch {}

		return null;
	}

	public getDataRow(row: wjg.Row | number) {
		let _nRowIndex: number = row instanceof wjg.Row ? row.index : row;
		return this.getDataRowFromIndex(this.getDataIndex(_nRowIndex));
	}

	public findRow(
		pzConent: string,
		pnRowStart: number,
		pnCol: number,
		pbCaseSensitive: boolean
	): number {
		let _nRows = this.rows.length;
		let _zColName = this.columns[pnCol].name;

		if (_nRows < 1 || String.isNullOrEmpty(_zColName)) return -1;

		for (let _nRow = pnRowStart; _nRow < _nRows; _nRow++) {
			let _val = this.getCellData(_nRow, _zColName, false); // _row.dataItem[_zColName];
			if (!_val) continue;

			if (compareStrings(pzConent, _val.toString(), pbCaseSensitive)) return _nRow;
		}

		return -1;
	}

	protected initDefaultStyle(pbManualInitClass: boolean = true) {
		this.nDefaultRowHeightPadding = this.nDefaultRowHeightPadding;

		wjc.addClass(this.hostElement, 'bravo-control');

		let _cs = CellStyle.parseString(
			'TextAlign:LeftCenter;Font:,,style=Regular;Border:Flat,,#aaa,;WordWrap:True;ForeColor:#000000;'
		);
		if (!this.styles.has(CellStyleEnum.Fixed)) this.styles.set(CellStyleEnum.Fixed, _cs);
		else this.styles.get(CellStyleEnum.Fixed).mergeWith(_cs);

		_cs = CellStyle.parseString(
			'Font:,,style=Bold;BackColor:OldLace;Border:Flat,,,;Margins:1,1,1,1;'
		);
		if (!this.styles.has(CellStyleEnum.Subtotal0))
			this.styles.set(CellStyleEnum.Subtotal0, _cs);
		else this.styles.get(CellStyleEnum.Subtotal0).mergeWith(_cs);

		_cs = _cs.clone();
		if (!this.styles.has(CellStyleEnum.Subtotal1))
			this.styles.set(CellStyleEnum.Subtotal1, _cs);
		else this.styles.get(CellStyleEnum.Subtotal1).mergeWith(_cs);

		_cs = _cs.clone();
		if (!this.styles.has(CellStyleEnum.Subtotal2))
			this.styles.set(CellStyleEnum.Subtotal2, _cs);
		else this.styles.get(CellStyleEnum.Subtotal2).mergeWith(_cs);

		_cs = _cs.clone();
		if (!this.styles.has(CellStyleEnum.Subtotal3))
			this.styles.set(CellStyleEnum.Subtotal3, _cs);
		else this.styles.get(CellStyleEnum.Subtotal3).mergeWith(_cs);

		_cs = _cs.clone();
		if (!this.styles.has(CellStyleEnum.Subtotal4))
			this.styles.set(CellStyleEnum.Subtotal4, _cs);
		else this.styles.get(CellStyleEnum.Subtotal4).mergeWith(_cs);

		_cs = _cs.clone();
		if (!this.styles.has(CellStyleEnum.Subtotal5))
			this.styles.set(CellStyleEnum.Subtotal5, _cs);
		else this.styles.get(CellStyleEnum.Subtotal5).mergeWith(_cs);

		_cs = CellStyle.parseString(
			'Font:,,style=Bold;BackColor:LightGoldenrodYellow;Border:Flat,,,;'
		);
		if (!this.styles.has(CellStyleEnum.GrandTotal))
			this.styles.set(CellStyleEnum.GrandTotal, _cs);
		else this.styles.get(CellStyleEnum.GrandTotal).mergeWith(_cs);

		_cs = CellStyle.parseString('BackColor:236,242,254;Border:Flat,,,;');
		if (!this.styles.has(CellStyleEnum.Alternate))
			this.styles.set(CellStyleEnum.Alternate, _cs);
		else this.styles.get(CellStyleEnum.Alternate).mergeWith(_cs);

		_cs = CellStyle.parseString(
			'Font:Segoe UI,11px,style=Regular;TextAlign:CenterCenter;Border:Flat,,#cccccc,;Margins:3,3,3,3;'
		);
		if (!this.styles.has(CellStyleEnum.RowHeader))
			this.styles.set(CellStyleEnum.RowHeader, _cs);
		else this.styles.get(CellStyleEnum.RowHeader).mergeWith(_cs);

		_cs = CellStyle.parseString(
			'BackColor:None;Border:Flat,1,#dddddd,;Margins:1,1,1,1;ForeColor:#000000;'
		);
		if (!this.styles.has(CellStyleEnum.Normal)) this.styles.set(CellStyleEnum.Normal, _cs);
		else this.styles.get(CellStyleEnum.Normal).mergeWith(_cs);

		_cs = CellStyle.parseString('BackColor:204,232,255;Border:Flat,1,153,209,255,;');
		if (!this.styles.has(CellStyleEnum.Highlight))
			this.styles.set(CellStyleEnum.Highlight, _cs);
		else this.styles.get(CellStyleEnum.Highlight).mergeWith(_cs);

		_cs = CellStyle.parseString('BackColor:#0085c7;ForeColor:#ffffff;');
		if (!this.styles.has(CellStyleEnum.Focus)) this.styles.set(CellStyleEnum.Focus, _cs);
		else this.styles.get(CellStyleEnum.Focus).mergeWith(_cs);

		_cs = CellStyle.parseString('BackColor:Red;');
		if (!this.styles.has(MarkingStyle)) this.styles.set(MarkingStyle, _cs);
		else this.styles.get(MarkingStyle).mergeWith(_cs);

		_cs = CellStyle.parseString('BackColor:DodgerBlue;ForeColor:White;');
		if (!this.styles.has(GanttBarStyle)) this.styles.set(GanttBarStyle, _cs);
		else this.styles.get(GanttBarStyle).mergeWith(_cs);

		_cs = CellStyle.parseString('ForeColor:Red;');
		if (!this.styles.has(WeekendStyle)) this.styles.set(WeekendStyle, _cs);
		else this.styles.get(WeekendStyle).mergeWith(_cs);

		_cs = CellStyle.parseString('BackColor:DimGray;ForeColor:Yellow;');
		if (!this.styles.has(SpecialDayStyle)) this.styles.set(SpecialDayStyle, _cs);
		else this.styles.get(SpecialDayStyle).mergeWith(_cs);

		_cs = CellStyle.parseString('Font:Segoe UI,,style=Italic;ForeColor:#6D6D6D;');
		if (!this.styles.has(NullStyleName)) this.styles.set(NullStyleName, _cs);
		else this.styles.get(SpecialDayStyle).mergeWith(_cs);

		if (pbManualInitClass) this.refreshCssStyle();
	}

	private _id: string = null;

	public get id(): string {
		if (String.isNullOrEmpty(this._id)) this._id = ExtensionsMethod.getTempName();

		return this._id;
	}

	public refreshCssStyle() {
		let _css = null,
			_zId = this.id;

		this.hostElement.id = _zId;

		let _sbSelector: StringBuilder, _sbClone: StringBuilder;
		let _keys = Array.from(this.styles.keys());
		for (let i = _keys.length - 1; i >= 0; i--) {
			const _key = _keys[i];
			let _bImportant = false;

			_sbSelector = new StringBuilder();
			_sbSelector.appendFormat('#{0}', _zId);

			if (_key == CellStyleEnum.Fixed || _key == CellStyleEnum.RowHeader) {
				_sbSelector.appendFormat(
					' .{0} .{1}',
					_key == CellStyleEnum.Fixed ? ColHeadersStyleName : RowolHeadersStyleName,
					HeaderStyleName
				);
			} else if (_key == CellStyleEnum.Normal || _key == CellStyleEnum.Alternate) {
				_sbSelector.appendFormat(' .{0}', CellsStyleName);
				_sbSelector.appendFormat(
					' .{0}',
					_key == CellStyleEnum.Normal ? 'wj-cell' : 'wj-alt'
				);
			} else if (_key == CellStyleEnum.Highlight) {
				_sbSelector.appendFormat(' .{0}', CellsStyleName);
				_sbSelector.appendFormat(' .wj-cell.{0}', MultiSelectedStyleName);
			} else if (_key == CellStyleEnum.Focus) {
				_sbSelector.appendFormat(
					' .{0} .{1}',
					CustomFocusStyleName,
					StateSelectedStyleName
				);
				_bImportant = true;
			} else if (_key == WeekendStyle || _key == SpecialDayStyle) {
				_sbSelector.appendFormat(' .{0}', _key);
				_bImportant = true;
			} else if (_key == CellStyleEnum.NoCaptionColumn) {
				_sbSelector.appendFormat(
					' .{0}.{1}.{2}',
					'wj-cell',
					'wj-header',
					CellStyleEnum[_key]
				);
				_bImportant = true;
			} else {
				_sbSelector.appendFormat(' .{0}', CellsStyleName);
				if (Number.isNumber(_key))
					_sbSelector.appendFormat(' .{0}.{1}', 'wj-cell', CellStyleEnum[_key]);
				else _sbSelector.appendFormat(' .{0}', _key);
			}

			if (_key == CellStyleEnum.Highlight) {
				_sbClone = _sbSelector.clone();
				_sbClone.strings.remove(String.format(' .wj-cell.{0}', MultiSelectedStyleName));
				_sbClone.appendFormat(' .{0}', StateSelectedStyleName);
			} else {
				_sbClone = null;
			}

			_sbSelector.appendFormat(':not(.{0})', CellRtfStyleName);
			if (_sbSelector.length < 3) continue;

			_css = CellStyle.buildCss(
				this.styles.get(_key),
				null,
				this.defaultBorderColor,
				false,
				_bImportant
			);

			if (!_css || Object.keys(_css).length < 1) continue;

			this.addRuleStyle(_sbSelector.toString(), _css);

			if (_sbClone && _sbClone.length > 0) {
				_sbClone.appendFormat(':not(.{0})', CellRtfStyleName);
				this.addRuleStyle(_sbClone.toString(), _css);
			}
		}
	}

	private addRuleStyle(pzSelector: string, pCss: any) {
		let _sb = new StringBuilder();
		_sb.append(pzSelector.toString());
		_sb.append('{');
		_sb.append(BravoCore.toCssString(pCss));
		_sb.append('}');

		let _styleSheet = <CSSStyleSheet>this.styleElement.sheet;
		let _index = indexOfRule(pzSelector.toString(), _styleSheet.cssRules);
		if (_index != -1) _styleSheet.deleteRule(_index);

		_styleSheet.insertRule(_sb.toString());
	}

	private refreshCssBorder() {
		if (this.hostElement == null) return;

		if (!this.bDrawContentBorders || this.contentBorderStyle == GridBorderStyle.None) return;

		let _style: HTMLStyleElement = this.hostElement.querySelector('style#style_ContentBorder');
		if (_style == null) {
			_style = document.createElement('style');
			_style.type = 'text/css';
			_style.id = 'style_ContentBorder';
		} else {
			_style.innerText = null;
		}

		let _zStyle;
		let _nBorderSize = BravoSettings.toCurrentDpiXWithBorder(1);
		let _zBorderColor = this.contentBorderColor.toString();

		let _zBorderStyle = 'dashed';
		switch (this.contentBorderStyle) {
			case GridBorderStyle.Dash:
			case GridBorderStyle.DashDot:
			case GridBorderStyle.DashDotDot:
				_zBorderStyle = 'dashed';
				break;
			case GridBorderStyle.Dot:
				_zBorderStyle = 'dotted';
				break;
			case GridBorderStyle.Double:
				_zBorderStyle = 'double';
				break;
			case GridBorderStyle.Solid:
				_zBorderStyle = 'solid';
				break;
		}

		_zStyle = `
                .bravo-border-right {border-right: ${_nBorderSize}px ${_zBorderStyle} ${_zBorderColor} !important;}
                .bravo-border-left {border-left: ${_nBorderSize}px ${_zBorderStyle} ${_zBorderColor} !important;}
                .bravo-border-top {border-top: ${_nBorderSize}px ${_zBorderStyle} ${_zBorderColor} !important;}
                .bravo-border-bottom {border-bottom: ${_nBorderSize}px ${_zBorderStyle} ${_zBorderColor} !important;}
            `;

		_style.appendChild(document.createTextNode(_zStyle));
		this.hostElement.appendChild(_style);
	}

	public addStyle(
		pzStyleName: string,
		pCellStyle: CellStyle,
		pCellType: wjg.CellType = wjg.CellType.Cell
	) {
		const _css = CellStyle.buildCss(pCellStyle, null, this.defaultBorderColor);
		if (_css == null) return;

		const _parentSelector =
			pCellType == wjg.CellType.ColumnHeader ? '.wj-colheaders' : '.wj-cells';

		const _zSelector = `#${this.id} ${_parentSelector} .wj-cell.${pzStyleName}:not(.cell-rtf)`;
		const _zCss = `${_zSelector} {${BravoCore.toCssString(_css)}}`;

		const _styleSheet = <CSSStyleSheet>this.styleElement.sheet;
		const _index = indexOfRule(_zSelector, _styleSheet.cssRules);

		if (_index != -1) _styleSheet.deleteRule(_index);
		_styleSheet.insertRule(_zCss, _styleSheet.cssRules.length);

		return pCellStyle;
	}

	public getCellStyle(pnRow: number, pnCol: number) {
		return BravoWebGrid.getCellStyle(this.cells, pnRow, pnCol);
	}

	public getCellRangeStyle(
		pnTopRow: number,
		pnLeftCol: number,
		pnBottomRow: number,
		pnRightCol: number
	) {
		return BravoWebGrid.getCellRangeStyle(
			this.cells,
			pnTopRow,
			pnLeftCol,
			pnBottomRow,
			pnRightCol
		);
	}

	private updateGrandTotalRow(pbSum: boolean = true): void {
		if (this.rows.length <= 0) return;

		let _zClassName = CellStyleEnum[CellStyleEnum.GrandTotal];
		let _grandTotalRow = wjc.tryCast(
			this.rows.find(
				(row) => row instanceof wjg.GroupRow && row.cssClass?.includes(_zClassName)
			),
			wjg.GroupRow
		) as wjg.GroupRow;
		if (_grandTotalRow) this.rows.remove(_grandTotalRow);

		if (!this.bAllowGrandTotal) return;

		let _nRow =
			this.grandTotalPosition == SubtotalPositionEnum.AboveData ? 0 : this.cells.rows.length;

		_grandTotalRow = new wjg.GroupRow();
		_grandTotalRow.cssClass = _zClassName;

		if (_nRow == 0) this.rows.insert(0, _grandTotalRow);
		else this.rows.push(_grandTotalRow);

		let _zGrdTxt = this.zGrandTotalText;
		if (String.isNullOrEmpty(_zGrdTxt))
			BravoResourceManager.getString('GrandTotalItemText').subscribe(
				(text) => (_zGrdTxt = text)
			);

		let _col = this.columns[this.treeColumnPos];
		let _lastDataType: wjc.DataType;
		if (_col instanceof wjg.Column && _col.dataType != wjc.DataType.String) {
			_lastDataType = _col.dataType;
			_col.dataType = wjc.DataType.String;
		}

		try {
			this.cells.setCellData(_nRow, this.treeColumnPos, _zGrdTxt);
		} finally {
			if (_col instanceof wjg.Column && _lastDataType != null) {
				_col.dataType = _lastDataType;
			}
		}

		if (pbSum) {
			let _sumCols = this.createOrderedSumCols();
			if (_sumCols && _sumCols.length > 0) {
				if (_sumCols.indexOf(this.treeColumnPos) > -1)
					_sumCols = _sumCols.splice(_sumCols.indexOf(this.treeColumnPos), 1);

				this.sumTreeNode(_grandTotalRow, _sumCols);
			}
		}
	}

	private createOrderedSumCols(): Array<number> {
		if (!this.bExcludeSumColumns && this.sumColumns.size < 1) return new Array<number>(0);

		let _colsSum = new Array<number>(),
			_col: wjg.Column;
		for (let _nCol = this.columns.length - 1; _nCol >= 0; _nCol--) {
			_col = this.columns[_nCol] as wjg.Column;

			if (!this.isSumCol(_nCol)) continue;

			// if (!isIgnored(_col) && _col.format && !_col.format.startsWith('P'))
			_col.aggregate = wjc.Aggregate.Sum;
			if (this.isExpressionColumn(_nCol) && !this.isFunctionExpressionColumn(_nCol))
				_colsSum.push(_nCol);
			else _colsSum.splice(0, 0, _nCol);
		}

		return _colsSum;
	}

	public getCurrentWidthOfCols(panel: GridPanel, fromCol: number, toCol: number) {
		if (
			toCol < 0 ||
			toCol >= panel.columns.length ||
			fromCol < 0 ||
			fromCol >= panel.columns.length
		)
			return 0;

		let _nTotalWidth = 0;
		for (let _nCol = fromCol; _nCol <= toCol; _nCol++) {
			const _col = panel.columns[_nCol];

			if (_col instanceof wjg.Column) _nTotalWidth += this.getCurrentWidthOfCol(panel, _nCol);
		}

		return _nTotalWidth;
	}

	public getCurrentWidthOfCol(panel: GridPanel, pnIndex: number) {
		if (pnIndex < 0 || pnIndex >= panel.columns.length) return 0;

		return panel.columns[pnIndex].renderWidth;
	}

	public getCurrentHeightOfRow(panel: GridPanel, pnIndex: number) {
		if (pnIndex < 0 || pnIndex >= panel.rows.length) return 0;

		return (<wjg.Row>panel.rows[pnIndex]).renderHeight;
	}

	public getCurrentHeightOfRows(fromRow?: number, toRow?: number, panel?: GridPanel) {
		let _nHeight = 0;

		if (fromRow == null && toRow == null) {
			for (const row of this.columnHeaders.rows) {
				if (row instanceof wjg.Row) _nHeight += row.renderHeight;
			}

			for (const row of this.rows) {
				if (row instanceof wjg.Row) _nHeight += row.renderHeight;
			}

			for (const row of this.columnFooters.rows) {
				if (row instanceof wjg.Row) _nHeight += row.renderHeight;
			}

			return _nHeight;
		}

		const _p = panel || this.cells;
		for (let _nRow = fromRow; _nRow <= toRow; _nRow++) {
			_nHeight += this.getCurrentHeightOfRow(_p, _nRow);
		}

		return _nHeight;
	}

	public isVerticalScrollable(delta: number) {
		if (this.rows.length < 0) return;

		if (delta > 0) {
			let _r = <wjg.Row>this.rows[this.rows.length - 1];
			let _srtg = <wjg.Row>this.rows[this.viewRange.bottomRow];
			return Math.abs(this.scrollPosition.y) < _r.pos - _srtg.pos;
		} else if (delta < 0) {
			return this.scrollPosition.y < 0;
		} else {
			let _r = <wjg.Row>this.rows[this.rows.length - 1];
			let _srtg = <wjg.Row>this.rows[this.viewRange.bottomRow];
			return _r.pos > _srtg.pos;
		}
	}

	public static getCheckColumnWidth(): number {
		return 23;
	}

	public groupBy(
		pzColName: string,
		pbManualUpdateGroup: boolean = false,
		pzText: string = '',
		pOrder: SortOrder = SortOrder.Ascending,
		pFunction: AggregateEnum = AggregateEnum.Sum
	): GroupColumnItem {
		if (!pzColName) throw new Error('pzColName');

		if (this.groups.has(pzColName))
			throw new Error(String.format(Resources.GroupAlreadyExisted, pzColName));

		this.groups.set(pzColName, new GroupColumnItem(pzText, pOrder, pFunction));

		if (!pbManualUpdateGroup) this.updateGroup(false);

		return this.groups.get(pzColName);
	}

	private _bUpdateGroupFlag: boolean = false;

	public get bSuppressUpdateGroup(): boolean {
		return this._bUpdateGroupFlag;
	}

	public set bSuppressUpdateGroup(value: boolean) {
		this._bUpdateGroupFlag = value;
	}

	public clearGroup(pzColName: string, pbManualUpdateGroup: boolean = false) {
		if (
			String.isNullOrEmpty(pzColName) ||
			!this.groups.has(pzColName) ||
			this.isFixedGroup(pzColName)
		)
			return;

		this.groups.delete(pzColName);

		if (
			this.columns.indexOf(pzColName) != -1 &&
			this.isDefaultSortedColumn(pzColName) == SortFlags.None
		) {
			let _colSortDesc = this.getSortColumn(pzColName);
			if (_colSortDesc) this.collectionView.sortDescriptions.remove(_colSortDesc);
		}

		if (pbManualUpdateGroup) return;

		this.updateGroup(false);
	}

	public clearGroups(pbManualUpdateGroup: boolean = false) {
		if (this.groups.size < 1) return;

		let _keys = Array.from(this._groups.keys());
		for (let _n = _keys.length - 1; _n >= 0; _n--) {
			let _key = _keys[_n];
			if (this.columns.indexOf(_key) != -1) {
				let _groupItem = this._groups.get(_key);
				if (_groupItem.bFixed) continue;

				if (this.isDefaultSortedColumn(_key) != SortFlags.None) {
					let _colSortDesc = this.getSortColumn(_key);
					if (_colSortDesc) this.collectionView.sortDescriptions.remove(_colSortDesc);
				}
			}

			this.groups.delete(_key);
		}

		if (pbManualUpdateGroup) return;

		this.updateGroup(false);
	}

	public clearSort() {
		let _cv = this.collectionView;
		if (_cv == null) return;

		_cv.deferUpdate(() => {
			let _bHasSorted = false;
			for (let _nCol = 0; _nCol < this.columns.length; _nCol++) {
				const _col = <wjg.Column>this.columns[_nCol];

				if (
					String.isNullOrEmpty(_col.name) ||
					!this.isSortableCol(_nCol) ||
					this.groups.has(_col.name)
				)
					continue;

				let _colSortDesc = this.getSortColumn(_col.name);
				if (_colSortDesc == null) continue;

				if (!_bHasSorted) _bHasSorted = true;

				_cv.sortDescriptions.remove(_colSortDesc);
			}
		});

		this.updateGroupRowCssClass();

		// if (!_bHasSorted) return;
	}

	public select(rng?: any, show?: any) {
		if (rng == null) {
			let _nRow = 0;
			let _nCol = this.columns.firstVisibleIndex;
			for (const row of this.rows) {
				if (row instanceof wjg.Row && !this.isHiddenRow(row)) {
					_nRow = row.index;
					break;
				}
			}

			rng = new wjg.CellRange(_nRow, _nCol);
		}

		return super.select(rng, show);
	}

	public selectDataFromCell(pnRow: number, pnCol: number) {
		const _dr = this.getDataRowFromCell(pnRow, pnCol);
		if (_dr) return this.select(new wjg.CellRange(pnRow, pnCol));

		const _gr = wjc.tryCast(this.rows[pnRow], wjg.GroupRow) as wjg.GroupRow;
		if (_gr) {
			const _rg = _gr.getCellRange();
			for (let _i = _rg.topRow + 1; _i <= _rg.bottomRow; _i++) {
				const _rs = this.selectDataFromCell(_i, pnCol);
				if (_rs) return _rs;
			}
		}
	}

	private _nTotalNodes: number = 0;

	/* _addBoundRow(items: any[], index: number) {
       super._addBoundRow(items, index);
       this.rows[this.rows.length - 1]['_idxdt'] = index;
    } */

	public updateGroup(pbIsSorted: boolean = false, pbRestoreLastNodeState: boolean = true) {
		if (this.columns.length <= 0) return;

		if (this.isTreeNodeMode() && this.rows.length <= 0) return;

		if (this._bUpdateGroupFlag) return;
		this._bUpdateGroupFlag = true;

		if (this.bAllowRaisingUpdateGroupsEvents && this.onBeforeUpdateGroups.hasHandlers) {
			const _e = new wjc.CancelEventArgs();
			this.onBeforeUpdateGroups.raise(this, _e);
			if (_e.cancel) {
				this._bUpdateGroupFlag = false;
				return;
			}
		}

		//clear all groups
		if (this.isTreeNodeMode()) {
			let _nLen = this.rows.length;
			for (let _i = 0; _i < _nLen; _i++) {
				const _node = this.rows[_i] instanceof wjg.GroupRow ? this.rows[_i] : null;
				if (_node) this.rows.removeAt(_i);
			}
		}

		let _cv = <wjc.CollectionView>this.collectionView;
		if (_cv == null) return;

		if (_cv.groupDescriptions.length > 0) _cv.deferUpdate(() => _cv.groupDescriptions.clear());

		this._nTotalNodes = 0;

		let _bLastUpdate = this.isUpdating;
		if (!_bLastUpdate) this.beginUpdate();

		try {
			// if (this.groupInColumnMergedRanges) this.groupInColumnMergedRanges.clear();

			if (!pbIsSorted) this.sort(SortFlags.UseColSort);

			if (!this.zTreeColName || this.columns.indexOf(this.zTreeColName) == -1)
				this._treeColumnPos = this.columns.firstVisibleIndex;
			else this._treeColumnPos = this.columns.indexOf(this.zTreeColName);

			if (this.isTreeNodeMode()) {
				let _nLevel = -1,
					_row: wjg.Row = null,
					_zTreeKeyValue: string = null;

				let _insertedNodeEventArgs: RowColEventArgs;

				let _nTreeNodeKeyColIndex = -1;
				if (!String.isNullOrEmpty(this.zMakingTreeNodeKeyColName))
					_nTreeNodeKeyColIndex = this.columns.indexOf(this.zMakingTreeNodeKeyColName);

				let _lastNode: BravoGroupRow = null;
				for (let _nRow = 0; _nRow < this.rows.length; _nRow++) {
					_row = this.rows[_nRow];

					_zTreeKeyValue =
						_nTreeNodeKeyColIndex > -1
							? String.format(
									'{0}',
									this.getCellData(_nRow, _nTreeNodeKeyColIndex, false)
							  )
							: this.getTreeNodeKeyValue(_row);

					if (String.isNullOrEmpty(_zTreeKeyValue)) continue;

					let _treeNodes: string[] = null,
						_insertNode: BravoGroupRow = null,
						_zNextTreeKeyVal: string = '';
					if (_nRow + 1 < this.rows.length)
						_zNextTreeKeyVal =
							_nTreeNodeKeyColIndex > -1
								? String.format(
										'{0}',
										this.getCellData(_nRow + 1, _nTreeNodeKeyColIndex, false)
								  )
								: this.getTreeNodeKeyValue(_nRow + 1);

					if (_zNextTreeKeyVal.startsWith(_zTreeKeyValue + ',')) {
						_treeNodes = _zTreeKeyValue.split(',');

						let _nNodeLevel = _treeNodes.length - 1;
						if (_nNodeLevel > _nLevel + 1) _nNodeLevel = 0;

						let _treeColVal = this.getCellData(_nRow, this._treeColumnPos, false);
						let _nInsertNodeIndex = _nRow;
						let _bIsSelectedRow = this.selection.row == _nRow;

						_insertNode = _lastNode = new BravoGroupRow();
						_insertNode.level = _nNodeLevel;

						this.rows.insert(_nInsertNodeIndex, _insertNode);

						this.toggleRowVisibility(_row, false);

						if (_bIsSelectedRow) this.selection.row = _nInsertNodeIndex;

						_nRow += 1;

						if (!_insertNode.dataItem) _insertNode.dataItem = {};
						_insertNode.dataItem = _row.dataItem;

						this.setUserData(this.cells, _insertNode.index, -1, _row);
						this.setCellData(_nInsertNodeIndex, this._treeColumnPos, _treeColVal);

						if (this.bCreateTreeNodeAsSubtotal)
							_insertNode.cssClass = CellStyleEnum[CellStyleEnum.Subtotal0];

						if (_insertedNodeEventArgs)
							this.onTreeNodeInserted.raise(this, _insertedNodeEventArgs);

						_insertedNodeEventArgs = new RowColEventArgs(
							this.cells,
							_nInsertNodeIndex,
							this._treeColumnPos
						);

						this._nTotalNodes++;
					} else if (_lastNode != null) {
						_treeNodes = _zTreeKeyValue.split(',');

						if (_treeNodes.length < 2) {
							if (_lastNode == null || _lastNode.level != -1) {
								_insertNode = _lastNode = new BravoGroupRow();
								_insertNode.level = -1;
								this.rows.insert(_nRow, _insertNode);

								this._nTotalNodes++;
							}
						} else if (_treeNodes.length - 2 != _nLevel) {
							_insertNode = _lastNode = new BravoGroupRow();
							_insertNode.level = _treeNodes.length - 2;
							this.rows.insert(_nRow, _insertNode);
							this._nTotalNodes++;
						}

						if (_insertNode != null) {
							_nRow++;
							this.toggleRowVisibility(_insertNode, false);
						}
					}

					if (_insertNode != null) _nLevel = _insertNode.level;
				}

				if (_insertedNodeEventArgs)
					this.onTreeNodeInserted.raise(this, _insertedNodeEventArgs);
			} else if (this.groups.size > 0 && this.bGroupInColumn) {
				let _bLastUpdate = _cv.isUpdating;
				if (!_bLastUpdate) _cv.beginUpdate();

				try {
					let _keys = Array.from(this.groups.keys());
					for (let _n = 0; _n < _keys.length; _n++) {
						let _key = _keys[_n],
							_groupItem = this.groups.get(_key),
							_colGrp = this.getColumn(_key);
						if (!_colGrp) continue;

						// Override current tree column with first group column
						this.treeColumnPos = _colGrp.index;

						let _zColCaption = String.empty;
						if (_groupItem.text) _zColCaption = _groupItem.text;

						if (!_zColCaption) _zColCaption = this.getColumnCaption(_colGrp.index);

						_colGrp.header = _zColCaption;

						let _groupDesc = new wjc.PropertyGroupDescription(_key);
						_cv.groupDescriptions.push(_groupDesc);

						break;
					}
				} finally {
					if (!_bLastUpdate) _cv.endUpdate();
				}
			} else if (this.groups.size > 0) {
				let _bLastUpdate = _cv.isUpdating;
				if (!_bLastUpdate) _cv.beginUpdate();

				try {
					let _keys = Array.from(this.groups.keys());
					for (let _n = 0; _n < _keys.length; _n++) {
						let _groupDesc = new wjc.PropertyGroupDescription(_keys[_n]);
						_cv.groupDescriptions.push(_groupDesc);
					}
				} finally {
					if (!_bLastUpdate) _cv.endUpdate();
				}
			}

			if (this.nCollapseCreatedNode >= 0)
				super.collapseGroupsToLevel(this.nCollapseCreatedNode);

			if (pbRestoreLastNodeState) this.restoreNodeState();

			if (this.bAllowGrandTotal) this.updateGrandTotalRow(this.bManualSumForGroup);

			if (!this.bManualSumForGroup) this.updateSumCols();
		} finally {
			if (!_bLastUpdate) this.endUpdate();

			if (this.selection.isValid) this.scrollIntoView(this.selection.row, this.selection.col);

			this._bUpdateGroupFlag = false;

			this.raiseOnContentHeightChanged();

			if (this.bAllowRaisingUpdateGroupsEvents)
				this.onAfterUpdateGroups.raise(this, wjc.EventArgs.empty);
		}
	}

	public onLoadedRows(e?: wjc.EventArgs) {
		if (!this.isTreeNodeMode()) this.updateGroupRowCssClass();

		super.onLoadedRows(e);
	}

	public static getGroupHeader(pGroup: wjg.GroupRow, pbEscapeHtml: boolean = true): string {
		let grid = <BravoWebGrid>pGroup.grid,
			fmt = grid.groupHeaderFormat || wjc.culture.FlexGrid.groupHeaderFormat,
			group = wjc.tryCast(
				pGroup.dataItem,
				wjc.CollectionViewGroup
			) as wjc.CollectionViewGroup;

		if (group && fmt) {
			// get group info
			let propName = group.groupDescription['propertyName'];
			let value = group.name,
				col = grid.getColumn(propName);

			// if (String.compare(propName, grid.zTreeColName) != 0)
			//     value = wjc.getAggregate(wjc.Aggregate.Sum, group.items, grid.zTreeColName);

			let _grp = grid.groups.get(propName);
			if (_grp) {
				if (String.isNullOrEmpty(_grp.text)) {
					fmt = '{value}';
				} else {
					if (
						!grid.isTreeNodeMode() &&
						group.level >= 0 &&
						BravoExpressionEvaluator.containsExpression(_grp.text)
					) {
						try {
							const _dr = grid.getDataRowFromIndex(pGroup.index);
							if (_dr) fmt = grid.expressionEvaluator.evaluateText(_grp.text, _dr);
						} catch (_ex) {
							fmt = INVALID_VALUE;
							console.warn(_ex);
						}
					} else {
						fmt = _grp.text + '{value}';
					}
				}
			}

			// customize with column info if possible
			let isHtml = pGroup.isContentHtml; // TFS 114902
			if (col) {
				if (propName && grid.restrictedColumns.has(propName)) {
					let _restrictCol = grid.restrictedColumns.get(propName),
						_bRestricted = _restrictCol
							? ((<RestrictedColumnEnum>_restrictCol) &
									RestrictedColumnEnum.NoOpen) !=
							  0
							: false;
					if (
						!_bRestricted &&
						((<RestrictedColumnEnum>_restrictCol) & RestrictedColumnEnum.NoOpenDOU) != 0
					) {
						const _r = new RowColEventArgs(grid.cells, pGroup.index, col.index);
						_r.cancel = true;
						grid.raiseOnRestrictedDOUColumn(_r);
						_bRestricted = _r.cancel;
					}

					if (_bRestricted) return NoDisplayPermissionContent;
				}

				isHtml = isHtml || col.isContentHtml;

				let _zCaption = grid.getColumnCaption(col.index);
				if (_zCaption) {
					propName = _zCaption;
				}

				if (col.dataMap) value = col.dataMap.getDisplayValue(value);
				else if (col.format) value = wjc.Globalize.format(value, col.format);

				let _cs = BravoWebGrid.getColumnStyle(col);
				let _cellType = BravoWebGrid.getCellType(_cs);

				if (_cellType == GridCellTypeEnum.Check)
					return `<input type="checkbox" ${
						Boolean.asBoolean(value) ? 'checked' : ''
					} class="group-checkbox" />`;
			}

			let count = 0;
			if (grid.countGroupChilds != GridCountGroupChildEnum.Hide) {
				count = grid.childCount(pGroup);
				if (count > 0) fmt += ' ({count})';
			}

			// build header text
			return wjc.format(fmt, {
				name: pbEscapeHtml ? wjc.escapeHtml(propName) : propName,
				value: isHtml || !pbEscapeHtml ? value : wjc.escapeHtml(value),
				level: group.level,
				count: count
			});
		}

		return '';
	}

	public childCount(pGroupRow: wjg.GroupRow): number {
		let grid = pGroupRow.grid,
			fmt = grid.groupHeaderFormat || wjc.culture.FlexGrid.groupHeaderFormat;

		let _nChildCount = 0;
		if (
			fmt &&
			grid instanceof BravoWebGrid &&
			grid.countGroupChilds != GridCountGroupChildEnum.Hide
		) {
			let _range = pGroupRow.getCellRange();
			if (_range && !_range.isSingleCell && _range.topRow < _range.bottomRow) {
				for (let _i = _range.topRow + 1; _i <= _range.bottomRow; _i++) {
					const _row: wjg.Row = grid.rows[_i];

					if (grid.isHiddenRow(_i) || !_row || (_row && !_row.visible)) continue;

					if (grid.countGroupChilds == GridCountGroupChildEnum.GroupOnly) {
						if (_row instanceof wjg.GroupRow && pGroupRow.level + 1 == _row.level)
							_nChildCount++;
					} else {
						if (
							_row instanceof wjg.GroupRow &&
							grid.countGroupChilds != GridCountGroupChildEnum.All
						)
							continue;

						_nChildCount++;
					}
				}
			}
		}

		return _nChildCount;
	}

	private sort(order: SortFlags = SortFlags.Descending, rg?: wjg.CellRange) {
		const _cv = <wjc.CollectionView>this.collectionView;
		if (_cv == null) return;

		let _bSorted = false;
		const _sortDescs = _cv.sortDescriptions;
		const _sbSortExpr = new StringBuilder();

		const _bIsUpdating = _cv.isUpdating;
		if (!_bIsUpdating) _cv.beginUpdate();

		try {
			if (this.isTreeNodeMode()) {
				if (this.isDefaultSortedColumn(this.zMakingTreeNodeKeyColName) == SortFlags.None) {
					let _treeSortDesc = this.getSortColumn(this.zMakingTreeNodeKeyColName);
					if (
						this.columns.indexOf(this.zMakingTreeNodeKeyColName) != -1 &&
						_treeSortDesc &&
						!_treeSortDesc.ascending
					) {
						_treeSortDesc._asc = true;
					} else {
						_treeSortDesc = new wjc.SortDescription(
							this.zMakingTreeNodeKeyColName,
							true
						);
						_sbSortExpr.append(this.zMakingTreeNodeKeyColName);
					}
				}
			} else {
				let _treeSortDesc = this.getSortColumn(this.zMakingTreeNodeKeyColName);
				if (
					this.zMakingTreeNodeKeyColName &&
					this.columns.indexOf(this.zMakingTreeNodeKeyColName) != -1 &&
					_treeSortDesc &&
					this.isDefaultSortedColumn(this.zMakingTreeNodeKeyColName) == SortFlags.None
				)
					_sortDescs.remove(_treeSortDesc);

				let _keys = Array.from(this.groups.keys());

				for (let _n = 0; _n < _keys.length; _n++) {
					let _key = _keys[_n];

					if (
						this.columns.indexOf(_key) == -1 ||
						this.isDefaultSortedColumn(_key) != SortFlags.None
					)
						continue;

					let _groupValue = this.groups.get(_key),
						_groupOrder = _groupValue.order;

					let _treeDesc: wjc.SortDescription = _sortDescs.find((g) => g.property == _key);
					if (_treeDesc && !_groupValue.bOrderDefaultChange)
						_groupOrder = _treeDesc.ascending
							? SortOrder.Ascending
							: SortOrder.Descending;

					if (_groupOrder == SortOrder.None) continue;

					if (_sbSortExpr.length > 0) _sbSortExpr.append(',');
					_sbSortExpr.append(_key);

					if (_groupOrder == SortOrder.Descending) _sbSortExpr.append(' DESC');
				}
			}

			if (_sbSortExpr.length > 0) {
				_sbSortExpr.insert(0, ',');
				_sbSortExpr.append(',');
			}

			const _zSortExpr = String.format(this.zDataViewSortExprFormat, _sbSortExpr.toString())
				.replace(',,', ',')
				.trimChars(',');
			const _exprs = _zSortExpr.split(',');
			let _zExpr: string, _asc: boolean;
			const _nLen = _exprs.length;
			for (let _i = 0; _i < _nLen; _i++) {
				const _expr = _exprs[_i].trim();
				if (!_expr.includes(' ')) {
					_zExpr = _expr;
					_asc = true;
				} else {
					let _args = _expr.split(' ');
					if (_args.length == 2) {
						_zExpr = _args[0];
						if (_args[1] == 'DESC') _asc = false;
					}
				}

				const _nIndexSort = _sortDescs.findIndex((s) => s.property == _zExpr);
				if (_nIndexSort != -1) _sortDescs.removeAt(_nIndexSort);

				_sortDescs.insert(_i, new wjc.SortDescription(_zExpr, _asc));

				_bSorted = true;
			}

			const _tb = this.tryGetItemSourceAsWebTable();
			if (rg != null) {
				for (let _nCol = rg.leftCol; _nCol <= rg.rightCol; _nCol++) {
					const _col = <wjg.Column>this.columns[_nCol];

					if (this.isDefaultSortedColumn(_col.name) != SortFlags.None) continue;

					// if (this.groups.has(_col.name))
					//     continue;

					let _bindingSort = _col ? _col._getBindingSort() : null;
					if (!_col.allowSorting || String.isNullOrEmpty(_bindingSort)) continue;

					if (_tb != null && !_tb.columns.contains(_col.name)) continue;

					let _desc = <wjc.SortDescription>(
						_sortDescs.find((s) => s.property == _col.name)
					);

					if (_desc) _desc._asc = order != SortFlags.Descending; //!_desc.ascending;
					else _desc = new wjc.SortDescription(_col.name, order != SortFlags.Descending);

					if (order == SortFlags.None) continue;

					if (
						_sortDescs.findIndex((s) => compareStrings(s.property, _desc.property)) ==
						-1
					)
						_sortDescs.push(_desc);

					if (!_bSorted) _bSorted = true;
				}
			}

			if (_tb && !_tb._bOverideCreateGroup) _tb._bOverideCreateGroup = _bSorted;
		} finally {
			if (!_bIsUpdating) _cv.endUpdate();

			if (_bSorted && !this._bUpdateGroupFlag) this.updateGroup(true);
		}
	}

	public isDefaultSortedColumn(pzColName: string): SortFlags {
		if (!pzColName) return SortFlags.None;

		if (this.zDataViewSortExprFormat == '{0}' || !this.zDataViewSortExprFormat)
			return SortFlags.None;

		if (
			this.zDataViewSortExprFormat.match(
				new RegExp(String.format(DESC_SORT_COLUMN_NAME_PATTERN_FORMAT, pzColName), 'gi')
			)
		)
			return SortFlags.Descending;

		if (
			this.zDataViewSortExprFormat.match(
				new RegExp(String.format(COLUMN_NAME_PATTERN_FORMAT, pzColName), 'gi')
			)
		)
			return SortFlags.Ascending;

		return SortFlags.None;
	}

	public toggleRowVisibility(row: wjg.Row, pbVisible: boolean) {
		row.height = pbVisible ? -1 : 0;
		row.allowDragging = row.allowResizing = row.isReadOnly = pbVisible;
		// row.visible = pbVisible;
	}

	private _bCopying = false;

	onCopying(e: wjg.CellRangeEventArgs) {
		let _f = super.onCopying(e);
		this._bCopying = _f;

		return _f;
	}

	onCopied(e: wjg.CellRangeEventArgs) {
		if (this._bCopying) this._bCopying = false;
		super.onCopied(e);
	}

	public getClipString(rng?: wjg.CellRange, csv?: boolean, headers?: boolean) {
		if (!this.selection.isValid) return super.getClipString(rng, csv, headers);

		let _lastSelectionMode = this.selectionMode;
		if (this.bHighlightEntireCurrentRow) this.selectionMode = wjg.SelectionMode.CellRange;

		let _rgSelection = rng;
		if (!_rgSelection) _rgSelection = this.selection;

		try {
			const _p = headers ? this.columnHeaders : this.cells;

			const _sbText = new StringBuilder();
			const _sbRtf = new StringBuilder();

			let _nRow = _rgSelection.topRow;
			let _nCol = _rgSelection.leftCol;

			let _rg: wjg.CellRange;

			while (_nRow <= _rgSelection.bottomRow) {
				if (this.getCurrentHeightOfRow(_p, _nRow) < 1) {
					_nRow++;
					continue;
				}

				if (_sbText.length > 0) _sbText.append('\r\n');

				_nCol = _rgSelection.leftCol;
				_rg = new wjg.CellRange(_nRow, _nCol);

				let _nFirstCol = -1;
				while (_nCol <= _rgSelection.rightCol) {
					_rg =
						this.mergeManager.getMergedRange(_p, _nRow, _nCol, false) ||
						new wjg.CellRange(_nRow, _nCol);

					const _ci = new GridCellInfo(_rg.topRow, _rg.leftCol);
					this.readCellData(_p, _rg.topRow, _rg.leftCol, _ci, null, false);

					if (_ci.bounds?.height < 1 || _ci.bounds?.width < 1) {
						_nCol = _rg.rightCol + 1;
						continue;
					}

					if (_nFirstCol > -1 && _nCol > _nFirstCol) _sbText.append('\t');
					if (_nFirstCol == -1) _nFirstCol = _nCol;

					const _cellType = this.getCellType(_p, _rg.topRow, _rg.leftCol);
					if (!String.isNullOrEmpty(_ci.zText)) {
						_sbText.append(_ci.zText);
					}

					_nCol = _rg.rightCol + 1;
				}

				_nRow = _rg.bottomRow + 1;
			}

			if (_sbText.length > 0) return _sbText.toString();

			return super.getClipString(rng, csv, headers);
		} finally {
			if (this.bHighlightEntireCurrentRow) this.selectionMode = _lastSelectionMode;
		}
	}

	/* public getClipString1(rng?: wjg.CellRange, csv?: boolean, headers?: boolean) {
        let _lastSelectionMode = this.selectionMode;
        if (this.bHighlightEntireCurrentRow)
            this.selectionMode = wjg.SelectionMode.CellRange;

        try {
            let _zCopyInfo = super.getClipString(rng, csv, headers);
            if (!rng) rng = this.selection;

            if (!rng || !rng.isSingleCell)
                return _zCopyInfo;

            const _p = headers ? this.columnHeaders : this.cells;
            if (rng.topRow >= 0 && rng.topRow < _p.rows.length && !this.isTreeNodeMode()) {
                let _groupRow = wjc.tryCast(_p.rows[rng.topRow], wjg.GroupRow) as wjg.GroupRow;
                if (_groupRow && rng.containsColumn(this.treeColumnPos))
                    return BravoWebGrid.getGroupHeader(_groupRow);
            }

            let _editor;

            if (rng.leftCol >= 0 && rng.leftCol < _p.columns.length) {
                const _col = _p.columns[rng.leftCol];
                _editor = _col[BravoWebGrid.GridColumEditorProp];
            }

            if (BravoExpressionEvaluator.containsExpression(_zCopyInfo) || (_editor && !_editor.currentTimeZone)) {
                let _ci = new GridCellInfo(rng.topRow, rng.leftCol)
                this.readCellData(_p, rng.topRow, rng.leftCol, _ci, null, false, true);
                _zCopyInfo = _ci.zText;
            }

            return _zCopyInfo;
        }
        finally {
            if (this.bHighlightEntireCurrentRow)
                this.selectionMode = _lastSelectionMode;
        }
    } */

	public getTreeDataRow(row: number | wjg.Row): wjg.Row {
		let _row: wjg.Row;
		if (Number.isNumber(row)) _row = this.rows[row as number];
		else _row = row as wjg.Row;

		if (this.isTreeNodeMode() && wjc.tryCast(_row, wjg.GroupRow) && !this.isAddNewRow(row))
			return this.getUserData(this.cells, _row.index);

		return null;
	}

	public saveNodeState(...nodes: Array<wjg.GroupRow>) {
		if (this.groups.size < 1) return;

		if (nodes == null || nodes.length < 1) {
			let _nodeCollection = new Array<wjg.GroupRow>();
			for (const _row of this.rows) {
				const _index = this.rows.indexOf(_row);
				const _groupRow = wjc.tryCast(_row, wjg.GroupRow) as wjg.GroupRow;
				if (!_groupRow /* || this.isHiddenRow(_index) */) continue;

				if (_groupRow.level >= 0 && _groupRow.level < this.groups.size)
					_nodeCollection.push(_groupRow);
			}

			nodes = _nodeCollection;
		}

		const _values = Array.from(this.groups.values());
		for (const _n of nodes) {
			if (
				_n.level < 0 ||
				_n.level >= this.groups.size ||
				!(_n.dataItem instanceof wjc.CollectionViewGroup)
			)
				continue;

			const _g = _values[_n.level];
			const _zNodeKey = (_n.dataItem as wjc.CollectionViewGroup)._path;

			if (_g.nodeStateCollection.includes(_zNodeKey)) {
				if (!_n.isCollapsed)
					_g.nodeStateCollection.splice(_g.nodeStateCollection.indexOf(_zNodeKey), 1);
			} else {
				if (_n.isCollapsed) _g.nodeStateCollection.push(_zNodeKey);
			}
		}
	}

	public restoreDefaultDataViewSortExprFormat() {
		this.zDataViewSortExprFormat = '{0}';
	}

	public resetDefaultGroups() {
		this.groups.clear();
	}

	public restoreNodeState(...nodes: Array<wjg.GroupRow>) {
		let _nCountGroup = this.groups.size;
		if (_nCountGroup < 1) return;

		if (nodes == null || nodes.length < 1) {
			let _nodeCollection = new Array<wjg.GroupRow>();
			for (let _nRow = 0; _nRow < this.rows.length; _nRow++) {
				const _groupRow = this.rows[_nRow];
				if (
					_groupRow instanceof wjg.GroupRow &&
					_groupRow.level >= 0 &&
					_groupRow.level < _nCountGroup
				)
					_nodeCollection.push(_groupRow);
			}

			nodes = _nodeCollection;
		}

		const _bLastUpdateGroupFlag = this._bUpdateGroupFlag;
		if (!_bLastUpdateGroupFlag) this._bUpdateGroupFlag = true;

		try {
			const _values = Array.from(this.groups.values());
			for (const _n of nodes) {
				if (
					_n.level < 0 ||
					_n.level >= this.groups.size ||
					!(_n.dataItem instanceof wjc.CollectionViewGroup)
				)
					continue;

				const _g = _values[_n.level];
				const _zNodeKey = (_n.dataItem as wjc.CollectionViewGroup)._path;
				if (_g.nodeStateCollection.includes(_zNodeKey))
					if (!_n.isCollapsed) _n.isCollapsed = true;
			}
		} finally {
			if (!_bLastUpdateGroupFlag) this._bUpdateGroupFlag = false;
		}
	}

	public aggregate(aggType: AggregateEnum, topRow: number, bottomRow: number, binding?: string) {
		let cnt = 0,
			cntn = 0,
			sum = 0,
			sum2 = 0,
			min = null,
			max = null,
			bnd = binding ? new wjc.Binding(binding) : null;

		for (let i = topRow; i <= bottomRow; i++) {
			let _row = this.rows[i];
			if (_row instanceof wjg.GroupRow || _row.height == 0) {
				continue;
			}

			let val = _row.dataItem;
			if (bnd) {
				val = bnd.getValue(val);
			}

			// aggregate
			if (val != null) {
				cnt++;
				if (min == null || val < min) {
					min = val;
				}
				if (max == null || val > max) {
					max = val;
				}
				if (Number.isNumber(val) && !isNaN(val)) {
					cntn++;
					sum += val;
					sum2 += val * val;
				} else if (wjc.isBoolean(val)) {
					cntn++;
					if (val == true) {
						sum++;
						sum2++;
					}
				}
			}
		}

		// return result
		let avg = cntn == 0 ? 0 : sum / cntn;
		switch (aggType) {
			case AggregateEnum.Average:
				return avg;
			case AggregateEnum.Count:
				return cnt;
			case AggregateEnum.Max:
				return max;
			case AggregateEnum.Min:
				return min;
			case AggregateEnum.Sum:
				return sum;
			case AggregateEnum.VarPop:
				return cntn <= 1 ? 0 : sum2 / cntn - avg * avg;
			case AggregateEnum.StdPop:
				return cntn <= 1 ? 0 : Math.sqrt(sum2 / cntn - avg * avg);
			case AggregateEnum.Var:
				return cntn <= 1 ? 0 : ((sum2 / cntn - avg * avg) * cntn) / (cntn - 1);
			case AggregateEnum.Std:
				return cntn <= 1 ? 0 : Math.sqrt(((sum2 / cntn - avg * avg) * cntn) / (cntn - 1));
		}

		// should never get here...
		throw 'Invalid aggregate type.';
	}

	private BravoWebGrid_doubleClick(e: MouseEvent) {
		if (this.hostElement == null) return;

		if (e.buttons == MouseButtons.Left && this.bDoubleClickActivateCell) {
			let _ht = this.hitTest(e);

			if (_ht && _ht.cellType == wjg.CellType.Cell && this.readOnly) {
				this.raiseOnCellActivated(e);
			}
		}
	}

	protected BravoWebGrid_keydown(e: KeyboardEvent) {
		let _modifier = e.altKey || e.ctrlKey; // || e.shiftKey;
		if (e.keyCode == wjc.Key.Enter && !_modifier && this.selection.isValid) {
			const _row = this.rows[this.selection.row];
			const _bIsNode = _row instanceof wjg.GroupRow;

			if (
				this.allowEditing &&
				!this.readOnly &&
				this.bHandleEnterKeyEdit &&
				(!_bIsNode || this.isAddNewRow(this.selection.row))
			) {
				if (!this.bIsEditing) {
					const _bEditNext = this.editNextCell(this.selection.row, this.selection.col);
					if (_bEditNext) e.preventDefault();
				}

				return;
			}

			if (this.keyActionEnter == wjg.KeyAction.None) this.raiseOnCellActivated();
		}
	}

	private _bIsEditNextCell: boolean = false;

	public get bIsEditNextCell(): boolean {
		return this._bIsEditNextCell;
	}

	private _controlEditor: wjc.Control;

	setControlEditor(pControl: wjc.Control) {
		this._controlEditor = pControl;
	}

	protected editNextCell(row: number, col: number) {
		if (this.bIsEditNextCell) return false;

		const _col = this.columns[col];
		this._bIsEditNextCell = true;

		let _editor = this._controlEditor;
		let _bIsCurrentEditing = _editor != null;

		const _bLastUpdate = this.isUpdating;
		if (!_bLastUpdate) this.beginUpdate();

		let _bEditing = false;

		try {
			let _nRow = row,
				_nCol = col;

			while (this.hostElement && _nCol < this.columns.length) {
				if (!_bIsCurrentEditing) {
					_nCol++;

					if (_nCol < 0) _nCol = 0;

					if (_nRow < 0) _nRow = 0;

					if (_nRow >= this.rows.length) break;

					if (
						_nCol >= this.columns.length ||
						!this.rows[_nRow].visible ||
						this.rows[_nRow].isReadOnly ||
						this.isHiddenRow(_nRow) ||
						this.getCurrentHeightOfRow(this.cells, _nRow) < 1
					) {
						_nCol = 0;
						_nRow++;

						if (_nRow >= this.rows.length) break;
					}

					if (
						!this.columns[_nCol].visible ||
						this.columns[_nCol].isReadOnly ||
						this.getCurrentWidthOfCol(this.cells, _nCol) < 1
					)
						continue;

					const _editor0 = this.columns[_nCol][BravoWebGrid.GridColumEditorProp];
					if (_editor0 && !_editor0.enabled) continue;
				}

				let _nCurrentRow = this.selection.row;
				let _bResult = true;
				if (this._controlEditor) {
					_bResult = this.finishEditing(false);
					if (
						_bResult &&
						_nCurrentRow == this.selection.row &&
						this.isCellValid(_nCurrentRow, _nCol) &&
						this.onValidateEditNextCell.hasHandlers
					) {
						const _e = new ValidateEditEventArgs(_nCurrentRow, _nCol);
						this.onValidateEditNextCell.raise(this, _e);
						if (_e.cancel) {
							_bResult = false;
							this.startEditing(true, _nCurrentRow, _nCol, false, null, true);
							return true;
						}
					}
				}

				if (!_bResult || _nCurrentRow != this.selection.row) return false;

				if (_bIsCurrentEditing) {
					_bIsCurrentEditing = false;
					continue;
				}

				_bResult = this.startEditing(true, _nRow, _nCol, false, null, true);
				if (
					(_bResult && this.columns[_nCol].dataType == wjc.DataType.Boolean) ||
					this._controlEditor
				) {
					_bEditing =
						_bResult && this.columns[_nCol].dataType == wjc.DataType.Boolean
							? false
							: true;
					break;
				}
			}

			return _bEditing;
		} finally {
			if (
				!_bEditing &&
				this.ownerForm &&
				this.selection.isValid &&
				this.rows[this.selection.row].pos == this.rows[this.rows.length - 1].pos
			) {
				BravoForm.selectNextControl(this.ownerForm.hostElement, this, true);
			}

			if (!_bLastUpdate) this.endUpdate();

			this._bIsEditNextCell = false;
		}
	}

	private _nButtonDownRow = -1;
	private _nButtonDownCol = -1;

	private _handleMouseDown(e: MouseEvent) {
		if (e.button == MouseButtons.Left) {
			let _ht = this.hitTest(e);

			this._nButtonDownRow = _ht.row;
			this._nButtonDownCol = _ht.col;

			if (this.bGroupInColumn && this.groups.size > 0) {
				let _ctrlKey = e.ctrlKey || e.metaKey;
				if (_ht.cellType == wjg.CellType.Cell) {
					if (
						wjc.closestClass(e.target, GroupInColumnStyle) &&
						wjc.closestClass(e.target, 'wj-btn-glyph')
					) {
						let _gr = this.getParentNode(_ht.panel.rows[_ht.row]);
						if (_gr instanceof wjg.GroupRow) {
							if (_ctrlKey) {
								// ctrl+click: collapse/expand entire outline to this level
								this.collapseGroupsToLevel(
									_gr.isCollapsed ? _gr.level + 1 : _gr.level
								);
							} else {
								// simple click: toggle this group
								_gr.isCollapsed = !_gr.isCollapsed;
							}
						}
					}
				}
			}

			if (!this.bDoubleClickActivateCell) {
				if (_ht.cellType == wjg.CellType.Cell) this.raiseOnCellActivated(e);
			}
		}
	}

	private BravoWebGrid_MouseUp(e: MouseEvent) {
		if (this.isCellValid(this._nButtonDownRow, this._nButtonDownCol)) {
			let _nRow = this._nButtonDownRow,
				_nCol = this._nButtonDownCol;

			this._nButtonDownRow = this._nButtonDownCol = -1;

			if (e.button == MouseButtons.Left && this.isCellButtonEnabled(_nRow, _nCol))
				this.performButtonClick(_nRow, _nCol, e);
		}
	}

	private bravoWebGrid_mouseOver(e: MouseEvent) {
		if (!this.hostElement || this.isUpdating || !this.showCellLabels || isMobile()) return;

		const _h = this.hitTest(e);
		if (!_h) return;

		if (this.bIsEditing && this.selection.row == _h.row && this.selection.col == _h.col) return;

		if (this._toolTipTimer && this.toolTipTimer.tag instanceof MouseEvent) {
			const _h1 = this.hitTest(this.toolTipTimer.tag);
			if (_h1 && _h1.range && _h1.range.contains(_h.row, _h.col)) return;
		}

		this.stopTooltip();

		this.toolTipTimer.tag = e;
		this.toolTipTimer.start();
	}

	private bravoWebGrid_mouseLeave(e: MouseEvent) {
		this.stopTooltip();
	}

	protected toggleCellToolTip(e: MouseEvent) {
		if (!this.hostElement) return false;

		const pCell = this.hitTest(e);
		if (!pCell) return;

		try {
			if (pCell.cellType != wjg.CellType.Cell) return;

			if (!pCell.range.isValid) {
				this.stopTooltip();
				return false;
			}

			if (this.bIsEditing && pCell.range.contains(this.selection.row, this.selection.col)) {
				this.stopTooltip();
				return false;
			}

			let _element = pCell.panel.getCellElement(pCell.row, pCell.col);
			if (!_element && e.target instanceof HTMLElement) _element = e.target;

			if (this.onCellLabelOn.hasHandlers) {
				let _e = new CustomToolTipEventArgs(
					pCell.panel,
					pCell.row,
					pCell.col,
					String.empty,
					String.empty,
					_element
				);
				this.raiseOnCellLabelOn(_e);
				if (_e.cancel) {
					if (!String.isNullOrEmpty(_e.content)) {
						this.showToolTip(sanitizeHtml(_e.content), _e.title, _e.element);
						return true;
					}

					return false;
				}
			}

			const _cellData = pCell.panel.getCellData(pCell.row, pCell.col, false);
			const _cellType = this.getCellType(pCell.panel, pCell.row, pCell.col);
			if (
				_cellType == GridCellTypeEnum.img ||
				_cellType == GridCellTypeEnum.Check ||
				_cellData instanceof Uint8Array
			) {
				this.stopTooltip();
				return false;
			}

			let _zText: string;
			if (!String.isNullOrEmpty(this.zCellToolTipText)) {
				const _dr = this.getDataRowFromCell(pCell.row, pCell.col);
				if (
					_dr &&
					this.gridMode == GridModeEnum.GanttChart &&
					this.getGanttGroupType(pCell.row) == GanttGroupTypeEnum.Merged
				) {
				}

				if (_dr) _zText = this.expressionEvaluator.evaluateText(this.zCellToolTipText, _dr);
				else
					_zText = this.expressionEvaluator.evaluateText(
						this.zCellToolTipText,
						(this.rows[pCell.row] as wjg.Row).dataItem
					);

				if (String.isNullOrEmpty(_zText)) {
					this.stopTooltip();
					return false;
				}

				this.showToolTip(sanitizeHtml(_zText), null, _element);
				return true;
			}

			const _ci = new GridCellInfo(pCell.row, pCell.col);
			try {
				this.readCellData(pCell.panel, pCell.row, pCell.col, _ci, null, false, true);

				if (
					_ci.cellType != GridCellTypeEnum.progress &&
					_ci.cellType != GridCellTypeEnum.barcode &&
					_ci.cellType != GridCellTypeEnum.qrcode &&
					(_ci.style[StyleElementFlags[StyleElementFlags.Display]] == DisplayEnum.None ||
						_ci.style[StyleElementFlags[StyleElementFlags.Display]] ==
							DisplayEnum.ImageOnly)
				) {
					this.stopTooltip();
					return false;
				}

				if (!String.isNullOrEmpty(_ci.zText)) _ci.zText = _ci.zText.trim();

				if (
					(_cellType == GridCellTypeEnum.progress ||
						_cellType == GridCellTypeEnum.barcode ||
						_cellType == GridCellTypeEnum.qrcode) &&
					!String.isNullOrEmpty(_zText)
				) {
					this.showToolTip(_zText, null, _element);
					return true;
				}

				if (_cellType == GridCellTypeEnum.html && _ci.zText.isHTML()) {
					this.showToolTip(_ci.zText, null, _element);
					return true;
				} else if (_cellType == GridCellTypeEnum.rtf) {
				} else {
					let _font: Font;
					if (_ci.style[StyleElementFlags[StyleElementFlags.Font]])
						_font = Font.parseFont(
							_ci.style[StyleElementFlags[StyleElementFlags.Font]]
						);

					if (!_font) _font = this.font;

					if (!_font)
						_font = new Font(
							BravoSettings.current.zDefaultFontName,
							BravoSettings.current.nFontSize
						);

					const _sz = BravoGraphicsRenderer.measureString(_ci.zText, _font);
					if (
						_sz &&
						_ci.bounds.width < _sz.width + (this.defaultPadding?.horizontal || 0)
					) {
						this.showToolTip(wjc.escapeHtml(_ci.zText), null, _element);
						return true;
					}
				}
			} finally {
				if (_ci && _ci.cellElement) {
					this.cellFactory.disposeCell(_ci.cellElement);
					wjc.removeChild(_ci.cellElement);
				}
			}
		} catch (e) {
			console.error(e);
			return false;
		}
	}

	protected showToolTip(pzText: string, pzTitle: string, element?: Element) {
		if (this.toolTip) {
		} else {
			let _form = this.ownerForm;
			if (!_form) _form = findForm(this.hostElement);

			if (_form instanceof BravoForm) _form.showToolTip(element, pzText, pzTitle);
		}
	}

	protected stopTooltip() {
		if (!this.hostElement) return;

		if (this._toolTipTimer) {
			if (this.toolTipTimer.enabled) this.toolTipTimer.stop();
			if (this.toolTipTimer.tag) this.toolTipTimer.tag = null;
		}

		if (this.toolTip) {
			this.toolTip.hide();
		} else {
			let _form = this.ownerForm;
			if (!_form) _form = findForm(this.hostElement);

			if (_form instanceof BravoForm) _form.hideToolTip();
		}
	}

	protected isCellButtonEnabled(pnRow: number, pnCol: number) {
		if (!this.isCellValid(pnRow, pnCol)) return false;

		if (this.onCheckCellButtonEnabled.hasHandlers) {
			const _e = new RowColEventArgs(this.cells, pnRow, pnCol);
			this.onActiveItemChanged.raise(this, _e);
			return !_e.cancel;
		}

		const _editor = this.columns[pnCol][BravoWebGrid.GridColumEditorProp];
		return this.enabled && this.isCellButton(pnRow, pnCol) && _editor && _editor.enabled;
	}

	protected performButtonClick(pnRow: number, pnCol: number, e?: MouseEvent) {
		if (this.isCellButtonEnabled(pnRow, pnCol)) {
			const _ctrl = this.columns[pnCol][BravoWebGrid.GridColumEditorProp];
			if (_ctrl == null) return false;

			let _btn = _ctrl instanceof BravoButton ? _ctrl : null;
			if (_btn) {
				_btn.onclick(e);
				return true;
			} else if (!String.isNullOrEmpty(_ctrl.text)) {
				ExtensionsMethod.openLink(_ctrl.text);
				return true;
			}
		}
	}

	private checkGroupRow(pnRow: number): boolean {
		if (isRowInValid(this.cells, pnRow)) return false;
		let _r = this.cells.rows[pnRow];
		if (_r instanceof wjg.GroupRow /* && _r.dataItem instanceof wjc.CollectionViewGroup */)
			return true;

		return false;
	}

	public updateSumCols() {
		if (this.bManualSumForGroup || this.rows.length <= 0) return;

		let _bLastUpdating = this.rows.isUpdating;
		if (!_bLastUpdating) this.rows.beginUpdate();

		try {
			// if (!this.bGroupInColumn)
			this.sumTreeNodes(this.rows.filter((r) => r instanceof wjg.GroupRow));
		} finally {
			if (!_bLastUpdating) this.rows.endUpdate();
		}
	}

	public sumTreeNodes(nodeCollection: any[], sumCols: number[] = null) {
		if (!sumCols) sumCols = this.createOrderedSumCols();

		if (this.bGroupInColumn) {
			let _node: wjg.GroupRow;
			for (_node of nodeCollection) {
				if (!this.isHiddenRow(_node)) this.toggleRowVisibility(_node, _node.isCollapsed);
			}
		}

		for (const _node of nodeCollection) {
			if (!(_node instanceof wjg.GroupRow)) continue;
			this.sumTreeNode(_node, sumCols);
		}
	}

	private sumTreeNode(node: wjg.GroupRow, sumCols: number[]) {
		let _func = AggregateEnum.Sum;
		if (node.level >= 0 && node.level < this.groups.size) {
			const _keys = Array.from(this.groups.keys());
			_func = this.groups.get(_keys[node.level]).function;
		}

		let _nFromRow = -1,
			_nToRow = -1;
		const _bIsGrandTotal =
			node.cssClass && node.cssClass.includes(CellStyleEnum[CellStyleEnum.GrandTotal]);
		if (_bIsGrandTotal) {
			_nFromRow = 0;
			_nToRow = this.rows.length - 1;
		} else if (this.isTreeNodeMode()) {
			node.cssClass = CellStyleEnum[CellStyleEnum.Subtotal0];
			const _rg = node.getCellRange();
			_nFromRow = _rg.topRow;
			_nToRow = _rg.bottomRow;
		}

		for (const _nCol of sumCols) {
			const _col = this.columns[_nCol];
			if (!(_col instanceof wjg.Column)) continue;

			if (this.isFunctionExpressionColumn(_nCol)) {
				this.sumExpressionColumn(node, _nCol);
				continue;
			}

			if (this.isExpressionColumn(_nCol)) continue;

			if (_bIsGrandTotal) {
				const _val = this.aggregate(_func, _nFromRow, _nToRow, _col.binding);
				this.setCellData(node.index, _nCol, _val);
			} else if (this.isTreeNodeMode()) {
				const _val = this.aggregate(_func, _nFromRow, _nToRow, _col.binding);
				if (node && node.dataItem) node.dataItem[_col.binding] = _val;
			}
		}

		for (const _nCol of sumCols) {
			if (!this.isExpressionColumn(_nCol) || this.isFunctionExpressionColumn(_nCol)) continue;

			this.sumExpressionColumn(node, _nCol);
		}
	}

	private _nExpressionUpdatedCol: number = -1;

	private expressionEvaluator_onLocalValueRequired(s, e) {
		if (
			e.Operator == OperatorEnum.UpdatedColumn &&
			this._nExpressionUpdatedCol >= 0 &&
			this._nExpressionUpdatedCol < this.columns.length
		) {
			e.value = this.columns[this._nExpressionUpdatedCol].name;
		}
	}

	private sumExpressionColumn(row: wjg.GroupRow, col: number) {
		if (!this.isExpressionColumn(col)) return false;

		const _col: wjg.Column = this.columns[col];
		if (!_col) return false;

		let _bSummed = false;
		let _zExpr = this.sumColumns.get(_col.name);

		const _outArg = { resultValue: null };
		if (BravoDataTypeConverter.isEnumType(AggregateEnum, _zExpr, _outArg)) {
			if (!BravoWebGrid.isNotSupportedSumFunction(_outArg.resultValue)) {
				const _agt = toAggregateWijmo(_outArg.resultValue);
				if (_col.aggregate != _agt) _col.aggregate = _agt;

				const _rg =
					row.level == -1
						? new wjg.CellRange(0, col, this.rows.length - 1, col)
						: row.getCellRange();

				this.setCellData(
					row.index,
					col,
					this.aggregate(_outArg.resultValue, _rg.topRow, _rg.bottomRow, _col.binding)
				);

				if (!_bSummed) _bSummed = true;
			}
		} else if (this.expressionEvaluator) {
			this._nExpressionUpdatedCol = col;
			this.expressionEvaluator.onLocalValueRequired.addHandler(
				this.expressionEvaluator_onLocalValueRequired
			);

			try {
				let _val = this.expressionEvaluator.evaluate(_zExpr, row);
				this.setCellData(row.index, col, _val);
			} finally {
				this._nExpressionUpdatedCol = -1;
				this.expressionEvaluator.onLocalValueRequired.removeHandler(
					this.expressionEvaluator_onLocalValueRequired
				);
			}

			if (!_bSummed) _bSummed = true;
		}

		return _bSummed;
	}

	private static isNotSupportedSumFunction(pFunction: AggregateEnum): boolean {
		return (
			pFunction == AggregateEnum.None ||
			pFunction == AggregateEnum.Percent ||
			pFunction == AggregateEnum.Clear ||
			pFunction == AggregateEnum.StdPop ||
			pFunction == AggregateEnum.VarPop
		);
	}

	public isTreeNodeMode(): boolean {
		return (
			!String.isNullOrEmpty(this.zMakingTreeNodeKeyColName) &&
			this.groups.has(this.zMakingTreeNodeKeyColName)
		);
	}

	private getTreeNodeKeyValue(row): string {
		if (row instanceof wjg.Row) {
			if (this.columns.getColumn(this.zMakingTreeNodeKeyColName) && row.dataItem)
				return String.format('{0}', row.dataItem[this.zMakingTreeNodeKeyColName]);
		} else {
			return this.getTreeNodeKeyValue(this.rows[row]);
		}

		return '';
	}

	private _cachedSpecialDay: Map<Date, boolean> = new Map();

	public isSpecialDay(dt: Date) {
		if (this.timeScale != TimeScaleEnum.Day && this.timeScale != TimeScaleEnum.DayOfWeek)
			return false;

		if (!this._cachedSpecialDay.has(dt))
			this._cachedSpecialDay.set(
				dt,
				this.expressionEvaluator.isTrue(
					String.format(
						"{0}('{1:dd MMM yyyy}')",
						OperatorEnum[OperatorEnum.IsSpecialDate],
						dt
					)
				)
			);

		return this._cachedSpecialDay.get(dt);
	}

	public isWeekend(dt: Date) {
		if (this.timeScale == TimeScaleEnum.Day || this.timeScale == TimeScaleEnum.DayOfWeek)
			return dt.getDay() == 0;

		return false;
	}

	public isSumCol(pnCol: number) {
		let _col = this.columns[pnCol] as wjg.Column;
		if ((_col && !_col.visible) || !this.isNumericCol(pnCol)) return false;

		if (isIgnored(this.columns[pnCol])) return false;

		if (!this.isExpressionColumn(pnCol) && this.isPercentageCol(pnCol)) return false;

		if (pnCol == this.treeColumnPos || this.groups.has(_col.name)) return false;

		const _bContains = this.sumColumns.has(_col.name);
		if (_bContains && this.isExpressionColumn(pnCol)) return true;

		let _bIsNumCol = false;
		let _type = { resultValue: null };
		if (BravoDataTypeConverter.isEnumType(TypeCode, _col[BravoWebGrid.DataTypeSource], _type)) {
			_bIsNumCol =
				BravoDataTypeConverter.isNumericType(_type.resultValue) &&
				_type.resultValue != TypeCode.Int16 &&
				_type.resultValue != TypeCode.Int32 &&
				_type.resultValue != TypeCode.Int64 &&
				_type.resultValue != TypeCode.Byte &&
				_type.resultValue != TypeCode.UInt16 &&
				_type.resultValue != TypeCode.UInt32 &&
				_type.resultValue != TypeCode.UInt64 &&
				_type.resultValue != TypeCode.Double;
		} else {
			_bIsNumCol = this.isNumericCol(pnCol);
		}

		if (this.sumColumns.has(BravoWebGrid.AllColumnValue))
			return this.bExcludeSumColumns ? false : _bContains ? true : _bIsNumCol;

		if (this.bExcludeSumColumns) return !_bContains && _bIsNumCol;

		return _bContains;
	}

	public isExpressionColumn(col: number) {
		if (col < 0 || col >= this.columns.length) return false;

		const _col = this.columns[col] as wjg.Column;
		return (
			!String.isNullOrEmpty(_col.name) &&
			this.sumColumns.has(_col.name) &&
			!String.isNullOrEmpty(this.sumColumns.get(_col.name))
		);
	}

	public isFunctionExpressionColumn(col: number) {
		if (col < 0 || col >= this.columns.length) return false;

		const _col = this.columns[col] as wjg.Column;

		return (
			!String.isNullOrEmpty(_col.name) &&
			this.sumColumns.has(_col.name) &&
			!String.isNullOrEmpty(this.sumColumns.get(_col.name)) &&
			BravoDataTypeConverter.isEnumType(AggregateEnum, this.sumColumns.get(_col.name))
		);
	}

	public isNumericCol(pnCol: number) {
		if (pnCol < 0 || pnCol >= this.columns.length || !this.columns[pnCol].dataType)
			return false;

		return this.columns[pnCol].dataType == wjc.DataType.Number;
	}

	public isPercentageCol(col: number) {
		if (col < 0 || col >= this.columns.length) return false;

		const _zFormat = (this.columns[col] as wjg.Column).format;
		return (
			!String.isNullOrEmpty(_zFormat) &&
			(_zFormat.includes('%') ||
				_zFormat.includes('‰') ||
				_zFormat.includes('P') ||
				_zFormat.includes('p'))
		);
	}

	public isCellValid(pnRow: number, pnCol: number) {
		return isCellValid(this.cells, pnRow, pnCol);
	}

	public setUserData(
		pPanel: wjg.GridPanel,
		pnRow: number = -1,
		pnCol: number = -1,
		pData: any = null
	) {
		let _r = <wjg.Row>pPanel.rows[pnRow];
		if (!_r) return null;

		if (pnCol == -1) {
			_r['_rud'] = pData;
			return;
		}

		if (isCellInValid(pPanel, pnRow, pnCol)) return;

		if (!_r['_ud']) _r['_ud'] = {};

		_r['_ud'][pnCol] = pData;
	}

	public getUserData(pPanel: wjg.GridPanel, pnRow: number = -1, pnCol: number = -1) {
		let _r = <wjg.Row>pPanel.rows[pnRow];
		if (pnCol == -1 && _r) return _r['_rud'];

		if (isCellInValid(pPanel, pnRow, pnCol)) return null;

		if (!_r || !_r['_ud']) return null;

		return _r['_ud'][pnCol];
	}

	public setCellImage(pnRow: number, pnCol: number, pData: any) {
		let _panel = this.cells;
		if (isCellInValid(_panel, pnRow, pnCol)) return;

		let _r = <wjg.Row>_panel.rows[pnRow];
		if (!_r) return null;

		if (!_r['_cimg']) _r['_cimg'] = {};

		_r['_cimg'][pnCol] = pData;
	}

	public getCellImage(pPanel: wjg.GridPanel, pnRow: number, pnCol: number) {
		if (isCellInValid(pPanel, pnRow, pnCol)) return null;

		let _r = <wjg.Row>pPanel.rows[pnRow];
		if (!_r || !_r['_cimg']) return null;

		return _r['_cimg'][pnCol];
	}

	protected setRowImage(pPanel: wjg.GridPanel, pnRow: number, pImage: any) {
		if (pnRow < 0 || pnRow >= pPanel.rows.length) return;

		const _row = pPanel.rows[pnRow];
		if (_row) _row['_rimg'] = pImage;
	}

	protected getRowImage(pPanel: wjg.GridPanel, pRow: any) {
		if (
			(Number.isNumber(pRow) && (pRow < 0 || pRow >= pPanel.rows.length)) ||
			wjc.isString(pRow)
		)
			return;

		if (Number.isNumber(pRow)) pRow = pPanel.rows[pRow as number];

		return pRow['_rimg'];
	}

	public static parseGridStyleString(pGrid: BravoWebGrid, value: string) {}

	public static getColumnDataType(column: wjg.Column): wjc.DataType {
		if (column == null) return wjc.DataType.String;

		return column.dataType;
	}

	public static getColumnTypeCode(column: wjg.Column): TypeCode {
		if (column == null || column[BravoWebGrid.DataTypeSource] == null) return TypeCode.String;

		if (column.dataType == wjc.DataType.Boolean) return TypeCode.Boolean;

		return column[BravoWebGrid.DataTypeSource];
	}

	public implementsInterface(interfaceName: string) {
		return interfaceName == 'IBravoControlBase';
	}

	public getColumnCaption(pnCol: number) {
		if (wjc.isString(pnCol)) pnCol = this.columns.indexOf(pnCol);

		if (pnCol < 0 || pnCol >= this.columns.length) return String.empty;

		let _col = <wjg.Column>this.columns[pnCol];
		let _zColCaption: string = null;

		for (let _nRow = this.columnHeaders.rows.length - 1; _nRow >= 0; _nRow--) {
			let _zText = String.format('{0}', this.columnHeaders.getCellData(_nRow, pnCol, true));

			try {
				if (BravoExpressionEvaluator.containsExpression(_zText))
					_zText = this.expressionEvaluator.evaluateText(_zText);
			} catch {
				console.warn(_zText);
				_zText = _col.name;
			}

			if (!String.isNullOrEmpty(_zText.trim())) {
				_zColCaption = _zText;
				break;
			}
		}

		if (String.isNullOrEmpty(_zColCaption)) _zColCaption = _col.binding;

		return _zColCaption;
	}

	public static getStyleElementCollection(
		pzStyleString: string,
		pzElementNamePattern: string = null
	): Array<StyleElementMatch> {
		return this.findStyleElements(pzStyleString, pzElementNamePattern);
	}

	public static findStyleElements(
		pzStyle: string,
		pzElementNamePattern: string = null
	): Array<StyleElementMatch> {
		if (String.isNullOrEmpty(pzElementNamePattern)) {
			let _keys = Object.keys(StyleElementFlags).filter((k) =>
				Number.isNumber(StyleElementFlags[k])
			);
			pzElementNamePattern = _keys.join('|');
			pzElementNamePattern += '|' + GridMergeStyleElement;
		}

		if (wjc.isFirefox() || wjc.isEdge() || wjc.isIE()) {
			let _ms0 = pzStyle.match(
				new RegExp(
					String.format(GridStyleElementPatternFormatFireFox, pzElementNamePattern),
					'g'
				)
			);
			if (_ms0 == null || _ms0.length < 1) return new Array();
			let _l = new Array<StyleElementMatch>(_ms0.length);
			for (let _i = 0; _i < _ms0.length; _i++) {
				let _t = _ms0[_i];
				let _ms1 = _t.match(
					new RegExp(
						String.format(GridStyleElementPatternFormatFireFox, pzElementNamePattern)
					)
				);

				if (_ms1.groups == undefined) {
					_ms1.groups = {};
					_ms1.groups['name'] = _ms1[1];
					_ms1.groups['value'] = _ms1[2];
				}

				_l[_i] = new StyleElementMatch(_ms1);
			}

			return _l;
		}

		let _ms = pzStyle.match(
			new RegExp(String.format(GridStyleElementPatternFormat, pzElementNamePattern), 'g')
		);
		if (_ms == null || _ms.length < 1) return new Array();
		let _l = new Array<StyleElementMatch>(_ms.length);
		for (let _i = 0; _i < _ms.length; _i++) {
			let _t = _ms[_i];
			let _ms1 = _t.match(
				new RegExp(String.format(GridStyleElementPatternFormat, pzElementNamePattern))
			);
			_l[_i] = new StyleElementMatch(_ms1);
		}

		return _l;
	}

	public static mergingGridCell(
		pGrid: BravoWebGrid,
		pnRow: number,
		pnCol: number,
		pzMergedKey: string,
		pzStyle: string
	) {
		if (pGrid == null) return null;

		let _p = pGrid.columnHeaders;

		if ((pnRow < 0 && pnRow >= _p.rows.length) || (pnCol < 0 && pnCol >= _p.columns.length))
			return;

		let _row = _p.rows[pnRow],
			_col = _p.columns[pnCol],
			_cs = BravoWebGrid.getCellStyle(_p, pnRow, pnCol, false);

		if (!String.isNullOrEmpty(pzStyle)) {
			let _cs1 = CellStyle.parseString(pzStyle);
			_cs.mergeWith(_cs1);
		}

		_cs[StyleElementFlags[StyleElementFlags.UserData]] = pzMergedKey;

		if (_row[BravoWebGrid.StyleProp] == null) _row[BravoWebGrid.StyleProp] = {};

		_row[BravoWebGrid.StyleProp][_col.name] = _cs.buildString();

		return _cs;
	}

	public sortColumn(pCol: number | string, pFlag: SortFlags, pbSingleColumn: boolean = true) {
		let _zColName: string, _nIndex: number;
		if (Number.isNumber(pCol) && pCol >= 0 && pCol < this.columns.length) {
			_zColName = this.columns[pCol as number].name;
			_nIndex = pCol as number;
		} else {
			_zColName = pCol as string;
			_nIndex = this.columns.indexOf(_zColName);
		}

		if (!this.isSortableCol(pCol) || this.isDefaultSortedColumn(_zColName) != SortFlags.None)
			return;

		this._bAllowSortingBase = false;
		this.selectionMode = wjg.SelectionMode.CellRange;

		try {
			let _e = new wjg.CellRangeEventArgs(this.cells, new wjg.CellRange(-1, _nIndex));
			super.onSortingColumn(_e);

			if (!_e.cancel) {
				let _cv = this.tryGetItemSourceAsWebTable();
				if (_cv == null) return;

				if (
					!this.isSortableCol(pCol) ||
					this.isDefaultSortedColumn(_zColName) != SortFlags.None
				)
					return;

				let _bSorting = _cv.sortDescriptions.isUpdating;
				if (!_bSorting) _cv.sortDescriptions.beginUpdate();

				try {
					if (pbSingleColumn) {
						if (this.isTreeNodeMode()) {
							for (let _n = 0; _n < _cv.columns.length; _n++) {
								const _dataCol = _cv.columns[_n] as WebDataColumn;
								const _col = this.columns.getColumn(_dataCol.columnName);

								if (
									String.isNullOrEmpty(_dataCol.columnName) ||
									(_col && !this.isSortableCol(_col.index)) ||
									this.isDefaultSortedColumn(_dataCol.columnName) !=
										SortFlags.None ||
									this.groups.has(_dataCol.columnName)
								)
									continue;

								let _colSort = this.getSortColumn(_dataCol.columnName);
								if (_colSort) _cv.sortDescriptions.remove(_colSort);
							}
						} else {
							for (let _nCol = 0; _nCol < this.columns.length; _nCol++) {
								const _col: wjg.Column = this.columns[_nCol];

								if (
									String.isNullOrEmpty(_col.name) ||
									!this.isSortableCol(_nCol) ||
									this.isDefaultSortedColumn(_col.name) != SortFlags.None ||
									this.groups.has(_col.name)
								)
									continue;

								let _colSort = this.getSortColumn(_col.name);
								if (_colSort) _cv.sortDescriptions.remove(_colSort);
							}
						}
					}

					this.sort(pFlag, _e.range);
				} finally {
					if (!_bSorting) _cv.sortDescriptions.endUpdate();
				}

				this.selectCol(_nIndex);

				this.onSortedColumn(_e);
			}
		} finally {
			this._nLstSort = _nIndex;
			this._bAllowSortingBase = true;
		}
	}

	public isSelectedColumn(col?: number) {
		if (col == null)
			return (
				this.selection.isValid &&
				this.rows[this.selection.topRow].pos == this.rows[0].pos &&
				this.rows[this.selection.bottomRow].pos == this.rows[this.rows.length - 1].pos
			);

		return this.isSelectedColumn() && this.selection.containsColumn(col);
	}

	public selectCol(col: number, pbShow: boolean = false) {
		return this.selectCols(col, col, false);
	}

	public selectCols(fromCol: number, toCol: number, pbShow: boolean) {
		if (
			this.isSelectedColumn() &&
			this.selection.containsColumn(fromCol) &&
			this.selection.containsColumn(toCol)
		)
			return true;

		if (this.rows.length > 0 && toCol >= fromCol)
			this.select(new wjg.CellRange(0, fromCol, this.rows.length - 1, toCol), pbShow);

		return (
			this.isSelectedColumn() &&
			this.selection.containsColumn(fromCol) &&
			this.selection.containsColumn(toCol)
		);
	}

	private _autoContextMenu: BravoContextMenu;

	protected get autoContextMenu(): BravoContextMenu {
		if (this._autoContextMenu == null) {
			this._autoContextMenu = new BravoContextMenu(this.hostElement, true);

			this._autoContextMenu.itemSelected.addHandler(
				this.autoContextMenu_menuItemSelected,
				this
			);

			let _item = new ToolStrip(BravoWebGrid.CollapseMenuItem, null, 'Collapse');
			this._autoContextMenu.itemsSource.push(_item);

			_item = new ToolStrip(BravoWebGrid.ExpandMenuItem, null, 'Expand');
			this._autoContextMenu.itemsSource.push(_item);

			this._autoContextMenu.itemsSource.push(new Spliter());

			this._autoContextMenu.itemsSource.push(
				new ToolStrip(BravoWebGrid.AddRowColMenuItem, null, 'Add row/column')
			);
			this._autoContextMenu.itemsSource.push(
				new ToolStrip(BravoWebGrid.InsertRowColMenuItem, null, 'Insert row/column')
			);
			this._autoContextMenu.itemsSource.push(
				new ToolStrip(BravoWebGrid.DeleteRowColMenuItem, null, 'Delete row/column')
			);

			this._autoContextMenu.itemsSource.push(new Spliter());

			this._autoContextMenu.itemsSource.push(
				new ToolStrip(BravoWebGrid.SortAscendingMenuItem, null, 'Sort A-Z')
			);
			this._autoContextMenu.itemsSource.push(
				new ToolStrip(BravoWebGrid.SortDescendingMenuItem, null, 'Sort Z-A')
			);

			let _parentItem = new DropDownToolStrip(BravoWebGrid.CombineSortColumnMenuItem);
			_parentItem.isDroppedDownChanging.addHandler(
				this._autoContextMenu_DropDownChanging,
				this
			);
			_parentItem.text = 'Sort by column...';

			this._autoContextMenu.itemsSource.push(_parentItem);

			this._autoContextMenu.itemsSource.push(new Spliter());
			this._autoContextMenu.itemsSource.push(
				new ToolStrip(BravoWebGrid.GroupColumnMenuItem, null, 'Group')
			);

			_parentItem = new DropDownToolStrip(BravoWebGrid.CombinedGroupColumnMenuItem);
			_parentItem.text = 'Combined group...';
			_parentItem.isDroppedDownChanging.addHandler(
				this._autoContextMenu_DropDownChanging,
				this
			);
			this._autoContextMenu.itemsSource.push(_parentItem);

			this._autoContextMenu.itemsSource.push(
				new ToolStrip(BravoWebGrid.SumColumnMenuItem, null, 'Sum total')
			);

			_parentItem = new DropDownToolStrip(BravoWebGrid.GrandTotalMenuItem);
			_parentItem.text = 'Grand total';
			this._autoContextMenu.itemsSource.push(_parentItem);

			_parentItem.itemsSource.push(
				new ToolStrip(BravoWebGrid.HideGrandTotalMenuItem, null, 'None')
			);
			_parentItem.itemsSource.push(
				new ToolStrip(BravoWebGrid.TopGrandTotalMenuItem, null, 'At top')
			);
			_parentItem.itemsSource.push(
				new ToolStrip(BravoWebGrid.BottomGrandTotalMenuItem, null, 'At bottom')
			);

			this._autoContextMenu.itemsSource.push(new Spliter());
			this._autoContextMenu.itemsSource.push(
				new ToolStrip(BravoWebGrid.FreezeMenuItem, null, 'Freeze')
			);
			this._autoContextMenu.itemsSource.push(new Spliter());
			this._autoContextMenu.itemsSource.push(
				new ToolStrip(BravoWebGrid.FitSizeMenuItem, null, 'Autofit size')
			);
			this._autoContextMenu.itemsSource.push(
				new ToolStrip(BravoWebGrid.DefaultSizeMenuItem, null, 'Default size')
			);
		}

		return this._autoContextMenu;
	}

	private _autoContextMenu_DropDownChanging(s: any, e: wjc.CancelEventArgs) {
		if (s.isDroppedDown && !e.cancel) {
			if (s.selectedItem instanceof ToolStrip) {
				let _zGroupName = s.name;
				let _zItemName = s.selectedItem.name;
				if (String.compare(_zGroupName, BravoWebGrid.CombineSortColumnMenuItem) == 0) {
					if (String.compare(_zItemName, BravoWebGrid.ClearSortColumnMenuItem) != 0) {
						e.cancel = true;
					}
				} else if (
					String.compare(_zGroupName, BravoWebGrid.CombinedGroupColumnMenuItem) == 0
				) {
					if (
						!(
							String.compare(_zItemName, BravoWebGrid.GroupInColumnSettingMenuItem) ==
								0 ||
							String.compare(_zItemName, BravoWebGrid.DataTreeMenuItem) == 0 ||
							String.compare(_zItemName, BravoWebGrid.ClearGroupColumnMenuItem) == 0
						)
					) {
						e.cancel = true;
					}
				}
			}
		}
	}

	private autoContextMenu_menuItemSelected(s: BravoContextMenu, e: ItemDropDownEventArgs) {
		let _mi = e.item as ToolStrip;
		if (_mi == null) return;

		let _col = <wjg.Column>this.columns[this._nContextCol];
		let _bChecked = _mi.checked;

		if (String.compare(e.zGroupName, BravoWebGrid.CombineSortColumnMenuItem) == 0) {
			if (String.compare(e.zItemName, BravoWebGrid.ClearSortColumnMenuItem) == 0) {
				this.clearSort();
			} else {
				let _colSortDesc = this.getSortColumn(e.zItemName);

				let _bAsc = _colSortDesc ? _colSortDesc.ascending : null;
				let _order: SortFlags = SortFlags.None;

				if (_bAsc == true) _order = SortFlags.Descending;
				else if (_bAsc == false) _order = SortFlags.None;
				else _order = SortFlags.Ascending;

				this.sortColumn(this.columns.indexOf(e.zItemName), _order, false);

				if (_order == SortFlags.None) _mi.checked = false;
				else _mi.checked = true;
			}
		} else if (String.compare(e.zGroupName, BravoWebGrid.CombinedGroupColumnMenuItem) == 0) {
			if (
				String.compare(e.zItemName, BravoWebGrid.GroupInColumnSettingMenuItem) == 0 ||
				String.compare(e.zItemName, BravoWebGrid.DataTreeMenuItem) == 0 ||
				String.compare(e.zItemName, BravoWebGrid.ClearGroupColumnMenuItem) == 0
			) {
				if (String.compare(e.zItemName, BravoWebGrid.ClearGroupColumnMenuItem) == 0) {
					if (this.groups.size > 0) {
						this.groups.clear();
						this.updateGroup();
					}
				} else if (
					String.compare(e.zItemName, BravoWebGrid.GroupInColumnSettingMenuItem) == 0
				) {
					this.bGroupInColumn = !this.bGroupInColumn;
					this.updateGroup(true);

					_mi.checked = this.bGroupInColumn;
				} else if (String.compare(e.zItemName, BravoWebGrid.DataTreeMenuItem) == 0) {
					if (this.isTreeNodeMode()) {
						this.clearGroups();
					} else {
						this.groupBy(this.zMakingTreeNodeKeyColName);
					}
				}
			} else {
				let _item = e.item;

				if (_item.checked) {
					this.clearGroup(_item.name);
				} else {
					if (this.isTreeNodeMode()) {
						this.groups.clear();
						this.updateGroup();

						let _itemMultiGroup = this._autoContextMenu.itemsSource.find(
							(item) => item.name == BravoWebGrid.CombinedGroupColumnMenuItem
						) as DropDownToolStrip;
						let _dataTreeMenuItem = _itemMultiGroup.itemsSource.find(
							(item) => item.name == BravoWebGrid.DataTreeMenuItem
						) as ToolStrip;

						_dataTreeMenuItem.checked = false;
					}

					// this.sortColumn(this.columns.indexOf(_item.name), SortFlags.Ascending);

					this.groupBy(_item.name);
				}

				_item.checked = this.groups.has(_item.name);
			}
		} else if (String.compare(e.zGroupName, BravoWebGrid.GrandTotalMenuItem) == 0) {
			if (String.compare(e.zItemName, BravoWebGrid.TopGrandTotalMenuItem) == 0) {
				if (
					this.bAllowGrandTotal &&
					this.grandTotalPosition == SubtotalPositionEnum.AboveData
				)
					return;

				this.bAllowGrandTotal = true;
				this.grandTotalPosition = SubtotalPositionEnum.AboveData;
			} else if (String.compare(e.zItemName, BravoWebGrid.BottomGrandTotalMenuItem) == 0) {
				if (
					this.bAllowGrandTotal &&
					this.grandTotalPosition == SubtotalPositionEnum.BelowData
				)
					return;

				this.bAllowGrandTotal = true;
				this.grandTotalPosition = SubtotalPositionEnum.BelowData;
			} else {
				if (!this.bAllowGrandTotal) return;
				this.bAllowGrandTotal = false;
			}

			this.updateGrandTotalRow();

			this.raiseOnContentHeightChanged();
		} else if (
			String.compare(_mi.name, BravoWebGrid.CollapseMenuItem) == 0 ||
			String.compare(_mi.name, BravoWebGrid.ExpandMenuItem) == 0
		) {
			let _bShowCell = false;

			let _rng = this.selection;
			if (
				this.isCellValid(this._nContextRow, this._nContextCol) &&
				!this.selection.contains(this._nContextRow, this._nContextCol)
			) {
				_rng = this.getMergedRange(this.cells, this._nContextRow, this._nContextCol);
				if (this.bGroupInColumn) _bShowCell = true;
			}

			if (String.compare(_mi.name, BravoWebGrid.CollapseMenuItem) == 0) {
				this.changeNodeState(_rng, true);
				if (_bShowCell) this.scrollIntoView(this._nContextRow, this._nContextCol, true);
			} else {
				this.changeNodeState(_rng, false);
			}
		} else if (
			this._autoContextMenu.tag == GridBuiltInContextMenuEnum.ContextMenuForRowHeader
		) {
			let _nStartRow = this.selection.isSingleCell
				? this._nContextRow
				: Math.min(this.selection.topRow, this._nContextRow);
			let _nEndRow = this.selection.isSingleCell
				? this._nContextRow
				: Math.max(this.selection.bottomRow, this._nContextRow);

			if (this._nContextRow >= 0 && this._nContextRow < this.rowHeaders.rows.length)
				_nStartRow = _nEndRow = this._nContextRow;

			const _e = new wjg.CellRangeEventArgs(this.cells, this.selection);

			if (String.compare(_mi.name, BravoWebGrid.FitSizeMenuItem) == 0) {
				this.autoSizeRows(_nStartRow, _nEndRow, false);
			} else if (String.compare(_mi.name, BravoWebGrid.DefaultSizeMenuItem) == 0) {
			} else if (String.compare(_mi.name, BravoWebGrid.FreezeMenuItem) == 0) {
				if (_bChecked) this.frozenRows = _nStartRow;
				else this.frozenRows = _nEndRow + 1;
			} else if (String.compare(_mi.name, BravoWebGrid.DeleteRowColMenuItem) == 0) {
				this.onDeletingRow(_e);
			} else if (String.compare(_mi.name, BravoWebGrid.InsertRowColMenuItem) == 0) {
				this.raiseOnInsertingNewRow();
			} else if (String.compare(_mi.name, BravoWebGrid.AddRowColMenuItem) == 0) {
				this.onAddingNewRow();
			}
		} else if (
			this._autoContextMenu.tag == GridBuiltInContextMenuEnum.ContextMenuForColHeader
		) {
			let _nStartCol = this.selection.isSingleCell
				? this._nContextCol
				: Math.min(this.selection.leftCol, this._nContextCol);
			let _nEndCol = this.selection.isSingleCell
				? this._nContextCol
				: Math.max(this.selection.rightCol, this._nContextRow);

			if (String.compare(_mi.name, BravoWebGrid.SortAscendingMenuItem) == 0) {
				this.sortColumn(
					this._nContextCol,
					_bChecked ? SortFlags.None : SortFlags.Ascending
				);
			} else if (String.compare(_mi.name, BravoWebGrid.SortDescendingMenuItem) == 0) {
				this.sortColumn(
					this._nContextCol,
					_bChecked ? SortFlags.None : SortFlags.Descending
				);
			} else if (String.compare(_mi.name, BravoWebGrid.GroupColumnMenuItem) == 0) {
				let _bGroupChecked = this.groups.has(_col.name);

				if (!_bGroupChecked) {
					if (this.groups.size > 0) this.clearGroups(true);

					this.groupBy(_col.name);
				} else {
					this.clearGroup(_col.name);
				}
			} else if (String.compare(_mi.name, BravoWebGrid.SumColumnMenuItem) == 0) {
				let _bSum = !_bChecked;
				if (this.sumColumns.has(BravoWebGrid.AllColumnValue)) {
					this.sumColumns.clear();

					for (let _nCol = 0; _nCol < this.columns.length; _nCol++)
						if (
							!String.isNullOrEmpty(this.columns[_nCol].name) &&
							this.isNumericCol(_nCol)
						)
							this.sumColumns.set(this.columns[_nCol].name, null);
				}

				if (!String.isNullOrEmpty(_col.name)) {
					if (!_bSum || this.bExcludeSumColumns) {
						if (this.sumColumns.has(_col.name)) {
							if (_col.aggregate != wjc.Aggregate.None)
								_col.aggregate = wjc.Aggregate.None;

							this.sumColumns.delete(_col.name);
						}
					} else {
						if (!this.sumColumns.has(_col.name)) this.sumColumns.set(_col.name, null);
					}
				}

				this.updateGroup(true);
			} else if (String.compare(_mi.name, BravoWebGrid.FitSizeMenuItem) == 0) {
				this.autoSizeColumns(_nStartCol, _nEndCol, false, 4);
				this.raiseOnContentWidthChanged(
					new RowColEventArgs(this.cells, -1, _nStartCol == _nEndCol ? _nStartCol : -1)
				);
			} else if (String.compare(_mi.name, BravoWebGrid.DefaultSizeMenuItem) == 0) {
				let _bWidthChanged = false;
				for (let _nCol = _nStartCol; _nCol <= _nEndCol; _nCol++) {
					if (_col.width > 0) {
						_col.width = this.columns.defaultSize;
						if (!_bWidthChanged) _bWidthChanged = true;
					}
				}

				if (_bWidthChanged)
					this.raiseOnContentWidthChanged(
						new RowColEventArgs(
							this.cells,
							-1,
							_nStartCol == _nEndCol ? _nStartCol : -1
						)
					);
			} else if (String.compare(_mi.name, BravoWebGrid.FreezeMenuItem) == 0) {
				if (_bChecked) this.frozenColumns = _nStartCol;
				else this.frozenColumns = _nEndCol + 1;
			} else if (String.compare(_mi.name, BravoWebGrid.DeleteRowColMenuItem) == 0) {
			} else if (String.compare(_mi.name, BravoWebGrid.InsertRowColMenuItem) == 0) {
			} else if (String.compare(_mi.name, BravoWebGrid.AddRowColMenuItem) == 0) {
			}
		}
	}

	public tryGetItemSourceAsWebTable() {
		if (this.itemsSource == null && this.dataSource == null) return;

		let _tb: WebDataTable;
		if (this.dataSource instanceof WebDataView) _tb = this.dataSource.table;
		else if (this.dataSource instanceof BravoBindingSource)
			_tb = this.dataSource.getDataTable();

		if (!_tb && wjc.tryCast(this.itemsSource, 'IWebDataTable')) _tb = this.itemsSource;

		return _tb;
	}

	public changeNodeState(selection: wjg.CellRange, pbCollapse: boolean) {
		if (!selection.isValid) return;

		let _bLastUpdate = this.isUpdating;
		if (!_bLastUpdate) this.beginUpdate();

		try {
			let _node: wjg.GroupRow = null;
			for (let _nRow = selection.topRow; _nRow <= selection.bottomRow; _nRow++) {
				const _row = <wjg.Row>this.rows[_nRow];

				if (_row instanceof wjg.GroupRow && _row.level < 0) continue;

				if (this.isHiddenRow(_row)) {
					if (!this.bGroupInColumn) continue;

					if (pbCollapse) this.toggleRowVisibility(_row, true);
				} else {
					if (!_row.visible) continue;
				}

				if (_row instanceof wjg.GroupRow) {
					_node = _row;
				} else {
					let _parentNode = this.getParentNode(_row);
					if (_nRow == selection.topRow && _parentNode != null) _node = _parentNode;
					else _node = null;
				}

				if (_node == null || _node.level < 0 || _node.isCollapsed == pbCollapse) continue;

				_node.isCollapsed = pbCollapse;
			}
		} finally {
			if (!_bLastUpdate) this.endUpdate();
			this.raiseOnContentHeightChanged();
		}
	}

	protected handleRightMouseButtonUp(e: MouseEvent) {
		if (this.hostElement == null || isMobile()) return;

		// let _bIsUpdating = this.isUpdating;
		// if (!_bIsUpdating) this.beginUpdate();

		try {
			let _hit = this.hitTest(e);
			let _p = _hit.point;
			let _ct = _hit.cellType;
			let _r: wjc.Rect = null,
				_y = _p.y;

			if (!this.selection.contains(_hit.row, _hit.col)) this.select(_hit.range);

			if (e && e.button == MouseButtons.Right) {
				let _bColMenu =
						(this.allowBuiltInContextMenu &
							GridBuiltInContextMenuEnum.ContextMenuForColHeader) !=
						0,
					_bRowMenu =
						(this.allowBuiltInContextMenu &
							GridBuiltInContextMenuEnum.ContextMenuForRowHeader) !=
						0,
					_bNodeMenu =
						(this.allowBuiltInContextMenu &
							GridBuiltInContextMenuEnum.ContextMenuForNode) !=
						0,
					_bGridMenu =
						(this.allowBuiltInContextMenu &
							GridBuiltInContextMenuEnum.ContextMenuForGridHeader) !=
						0;

				if (this._autoContextMenu != null) {
					this.autoContextMenu.tag = null;
					this.autoContextMenu.selectedValue = -1;
				}

				if (_bColMenu && _ct == wjg.CellType.ColumnHeader) {
					_r = this.columnHeaders.getCellBoundingRect(_hit.row, _hit.col);
					_y = _r.bottom;

					if (this.autoContextMenu.tag == null) {
						this.autoContextMenu.tag =
							GridBuiltInContextMenuEnum.ContextMenuForColHeader;
						_p = new wjc.Point(_p.x - 10, _y);
					}
				} else if (_ct == wjg.CellType.RowHeader && _bRowMenu) {
					_r = this.rowHeaders.getCellBoundingRect(_hit.row, _hit.col);
					_y = _r.bottom;

					this.autoContextMenu.tag = GridBuiltInContextMenuEnum.ContextMenuForRowHeader;
					_p = new wjc.Point(_p.x, _y);
				} else if (_ct == wjg.CellType.Cell && _bNodeMenu) {
					let _cell = this.cells.getCellElement(_hit.row, _hit.col);
					let _btn = _cell ? _cell.querySelector('.wj-btn-glyph') : null;

					if (wjc.contains(_btn, e.target))
						this.autoContextMenu.tag = GridBuiltInContextMenuEnum.ContextMenuForNode;
				}

				if (this._autoContextMenu && this.autoContextMenu.tag != null) {
					this._nContextCol = _hit.col;
					this._nContextRow = _hit.row;

					if (!this.selection.isValid || !this.selection.containsRow(_hit.row))
						this.select(
							new wjg.CellRange(_hit.row, 0, _hit.row, this.columns.length - 1)
						);

					if (this.autoContextMenuOpening()) {
						if (this.autoContextMenu._onLoadComplete()) {
							this.autoContextMenu.show(_p);
							this.autoContextMenu.position = _p;
						}

						e.preventDefault();
						e.stopPropagation();
					}
				}
			}
		} finally {
			// if (!_bIsUpdating) this.endUpdate();
		}
	}

	protected autoContextMenuOpening(): boolean {
		if (
			this.rows.length + this.columnHeaders.rows.length < 1 ||
			this.columns.length < 1 ||
			this._autoContextMenu.tag == null
		)
			return false;

		let _colName = this.columns[this._nContextCol].name;
		let _rgSelect = this.selection;

		try {
			let _itemCollapse = this._autoContextMenu.itemsSource.find(
				(item) => item.name == BravoWebGrid.CollapseMenuItem
			) as ToolStrip;
			let _itemExpand = this._autoContextMenu.itemsSource.find(
				(item) => item.name == BravoWebGrid.ExpandMenuItem
			) as ToolStrip;

			BravoResourceManager.getString('CollapseMenuItemText').subscribe(
				(text) => (_itemCollapse.text = text)
			);
			BravoResourceManager.getString('ExpandMenuItemText').subscribe(
				(text) => (_itemExpand.text = text)
			);

			if (this._autoContextMenu.tag == GridBuiltInContextMenuEnum.ContextMenuForNode) {
				for (let _i = 0; _i < this._autoContextMenu.itemsSource.length; _i++)
					this._autoContextMenu.itemsSource[_i].visible =
						this._autoContextMenu.itemsSource[_i] == _itemCollapse ||
						this._autoContextMenu.itemsSource[_i] == _itemExpand;

				return true;
			}

			let _itemAddRowCol = this._autoContextMenu.itemsSource.find(
				(item) => item.name == BravoWebGrid.AddRowColMenuItem
			) as ToolStrip;
			let _itemInsertRowCol = this._autoContextMenu.itemsSource.find(
				(item) => item.name == BravoWebGrid.InsertRowColMenuItem
			) as ToolStrip;
			let _itemDeleteRowCol = this._autoContextMenu.itemsSource.find(
				(item) => item.name == BravoWebGrid.DeleteRowColMenuItem
			) as ToolStrip;

			let _itemSortAZ = this._autoContextMenu.itemsSource.find(
				(item) => item.name == BravoWebGrid.SortAscendingMenuItem
			) as ToolStrip;
			let _itemSortZA = this._autoContextMenu.itemsSource.find(
				(item) => item.name == BravoWebGrid.SortDescendingMenuItem
			) as ToolStrip;
			let _itemMultiSort = this._autoContextMenu.itemsSource.find(
				(item) => item.name == BravoWebGrid.CombineSortColumnMenuItem
			) as DropDownToolStrip;
			let _itemGroupColumn = this._autoContextMenu.itemsSource.find(
				(item) => item.name == BravoWebGrid.GroupColumnMenuItem
			) as ToolStrip;
			let _itemMultiGroup = this._autoContextMenu.itemsSource.find(
				(item) => item.name == BravoWebGrid.CombinedGroupColumnMenuItem
			) as DropDownToolStrip;
			let _itemSumColumn = this._autoContextMenu.itemsSource.find(
				(item) => item.name == BravoWebGrid.SumColumnMenuItem
			) as ToolStrip;
			let _itemGrandTotal = this._autoContextMenu.itemsSource.find(
				(item) => item.name == BravoWebGrid.GrandTotalMenuItem
			) as DropDownToolStrip;
			let _itemHideGrandTotal = _itemGrandTotal.itemsSource.find(
				(item) => item.name == BravoWebGrid.HideGrandTotalMenuItem
			) as ToolStrip;
			let _itemTopGrandTotal = _itemGrandTotal.itemsSource.find(
				(item) => item.name == BravoWebGrid.TopGrandTotalMenuItem
			) as ToolStrip;
			let _itemBottomGrandTotal = _itemGrandTotal.itemsSource.find(
				(item) => item.name == BravoWebGrid.BottomGrandTotalMenuItem
			) as ToolStrip;
			let _itemFreeze = this._autoContextMenu.itemsSource.find(
				(item) => item.name == BravoWebGrid.FreezeMenuItem
			) as ToolStrip;
			let _itemFitSize = this._autoContextMenu.itemsSource.find(
				(item) => item.name == BravoWebGrid.FitSizeMenuItem
			) as ToolStrip;
			let _itemDefaultSize = this._autoContextMenu.itemsSource.find(
				(item) => item.name == BravoWebGrid.DefaultSizeMenuItem
			) as ToolStrip;

			BravoResourceManager.getString('GrandTotalMenuItemText').subscribe(
				(text) => (_itemGrandTotal.text = text)
			);
			BravoResourceManager.getString('NoneGrandTotalItemText').subscribe(
				(text) => (_itemHideGrandTotal.text = text)
			);
			BravoResourceManager.getString('TopGrandTotalItemText').subscribe(
				(text) => (_itemTopGrandTotal.text = text)
			);
			BravoResourceManager.getString('BottomGrandTotalItemText').subscribe(
				(text) => (_itemBottomGrandTotal.text = text)
			);
			BravoResourceManager.getString('FreezeRowColMenuItemText').subscribe(
				(text) => (_itemFreeze.text = text)
			);
			BravoResourceManager.getString('AutoFitSizeMenuItemText').subscribe(
				(text) => (_itemFitSize.text = text)
			);
			BravoResourceManager.getString('DefaultSizeMenuItemText').subscribe(
				(text) => (_itemDefaultSize.text = text)
			);

			if (this._autoContextMenu.tag == GridBuiltInContextMenuEnum.ContextMenuForColHeader) {
				let _bIsHeaderOnly =
					this._nContextCol >= 0 && this._nContextCol < this.columnHeaders.columns.length;

				_itemDeleteRowCol.visible =
					this.bAllowDeletingColumn && !this.isReadOnly && !_bIsHeaderOnly;
				_itemAddRowCol.visible = this.bAllowAddingColumn && !this.isReadOnly;
				_itemInsertRowCol.visible = this.bAllowAddingColumn && !this.isReadOnly;

				BravoResourceManager.getString('RemoveSelectedColsMenuItemText').subscribe(
					(text) => (_itemDeleteRowCol.text = text)
				);
				BravoResourceManager.getString('AddNewColMenuItemText').subscribe(
					(text) => (_itemAddRowCol.text = text)
				);
				BravoResourceManager.getString('InsertNewColMenuItemText').subscribe(
					(text) => (_itemInsertRowCol.text = text)
				);

				_itemCollapse.visible = _itemExpand.visible = false;

				_itemSortAZ.visible = _itemSortZA.visible =
					this.bAllowSorting &&
					_rgSelect.col == _rgSelect.col2 &&
					this.isSortableCol(_rgSelect.col);
				BravoResourceManager.getString('SortAscendingMenuItemText').subscribe(
					(text) => (_itemSortAZ.text = text)
				);
				BravoResourceManager.getString('SortDescendingMenuItemText').subscribe(
					(text) => (_itemSortZA.text = text)
				);

				_itemMultiSort.visible = this.bAllowSorting;
				BravoResourceManager.getString('AdvancedSortByMenuItemText').subscribe(
					(text) => (_itemMultiSort.text = text)
				);

				_itemGroupColumn.visible =
					this.bAllowGrouping &&
					_rgSelect.col == _rgSelect.col2 &&
					!String.isNullOrEmpty(_colName) &&
					this.isGroupableCol(_rgSelect.col);

				_itemMultiGroup.visible = this.bAllowGrouping;
				BravoResourceManager.getString('AdvancedGroupByMenuItemText').subscribe(
					(text) => (_itemMultiGroup.text = text)
				);

				_itemFreeze.visible = true;

				_itemFitSize.visible = _itemDefaultSize.visible =
					this.allowResizing == wjg.AllowResizing.Both ||
					this.allowResizing == wjg.AllowResizing.BothAllCells ||
					this.allowResizing == wjg.AllowResizing.Columns ||
					this.allowResizing == wjg.AllowResizing.ColumnsAllCells;

				if (_itemSortAZ.visible || _itemSortZA.visible) {
					let _colSortDesc = this.getSortColumn(_colName);

					_itemSortAZ.checked =
						_itemSortAZ.visible && _colSortDesc && _colSortDesc.ascending;
					_itemSortZA.checked =
						_itemSortZA.visible && _colSortDesc && !_colSortDesc.ascending;
				}

				if (_itemGroupColumn.visible) {
					BravoResourceManager.getString(
						String.compare(_colName, this.zMakingTreeNodeKeyColName) == 0
							? 'DataTreeMenuItemText'
							: 'QuickGroupByMenuItemText'
					).subscribe((text) => (_itemGroupColumn.text = text));

					_itemGroupColumn.checked = this.groups.has(_colName);
				}

				if (_itemMultiSort.visible) {
					_itemMultiSort.itemsSource.clear();

					let _nCanSortCol = 0,
						_bHasSorted = false;

					for (let _nCol = 0; _nCol < this.columns.length; _nCol++) {
						let _colName = this.columns[_nCol].name;
						if (String.isNullOrEmpty(_colName)) continue;

						if (!this.isSortableCol(_nCol)) continue;

						let _item = new ToolStrip(_colName, null, this.getColumnCaption(_nCol));
						_itemMultiSort.itemsSource.push(_item);

						let _colSortDesc = this.collectionView
							? <wjc.SortDescription>(
									this.collectionView.sortDescriptions.find(
										(s) => s.property == _colName
									)
							  )
							: null;

						if (!_bHasSorted && _colSortDesc != null) _bHasSorted = true;

						_item.checked = _colSortDesc != null;
						_item.enabled = !(
							this.zDataViewSortExprFormat.match(
								new RegExp(
									String.format(COLUMN_NAME_PATTERN_FORMAT, _colName),
									'gi'
								)
							) != null
						);

						_nCanSortCol++;
					}

					if (_nCanSortCol < 1) {
						_itemMultiSort.visible = false;
					} else if (_bHasSorted) {
						_itemMultiSort.itemsSource.splice(0, 0, new Spliter());
						let _item = new ToolStrip(
							BravoWebGrid.ClearSortColumnMenuItem,
							null,
							'Clear sort'
						);
						BravoResourceManager.getString('ClearSortMenuItemText').subscribe(
							(text) => (_item.text = text)
						);
						_itemMultiSort.itemsSource.splice(0, 0, _item);
					}
				}

				if (_itemMultiGroup.visible) {
					_itemMultiGroup.itemsSource.clear();

					let _item = new ToolStrip(
						BravoWebGrid.DataTreeMenuItem,
						null,
						'DataTreeMenuItemText'
					);
					BravoResourceManager.getString('DataTreeMenuItemText').subscribe(
						(text) => (_item.text = text)
					);
					_itemMultiGroup.itemsSource.push(_item);
					_item.visible = !String.isNullOrEmpty(this.zMakingTreeNodeKeyColName);

					if (_item.visible) _item.checked = this.isTreeNodeMode();

					_itemMultiGroup.itemsSource.push(new Spliter());

					let _nCanGroupCol = 0;
					for (let _nCol = 0; _nCol < this.columns.length; _nCol++) {
						let _colName = this.columns[_nCol].name;
						if (
							String.isNullOrEmpty(_colName) ||
							String.compare(_colName, this.zMakingTreeNodeKeyColName) == 0
						)
							continue;

						if (!this.isGroupableCol(_nCol)) continue;

						_item = new ToolStrip(_colName, null, this.getColumnCaption(_nCol));
						_itemMultiGroup.itemsSource.push(_item);
						_item.checked = this.groups.has(_colName);
						// _item.enabled = this.isFixedGroup(_colName);

						_nCanGroupCol++;
					}

					if (_nCanGroupCol < 1) {
						_itemMultiGroup.visible = false;
					} else {
						if (this.groups.size > 0) {
							_itemMultiGroup.itemsSource.splice(0, 0, new Spliter());
							_item = new ToolStrip(
								BravoWebGrid.ClearGroupColumnMenuItem,
								null,
								'ClearGroupsMenuItemText'
							);
							BravoResourceManager.getString('ClearGroupsMenuItemText').subscribe(
								(text) => (_item.text = text)
							);
							_itemMultiGroup.itemsSource.splice(0, 0, _item);
						}

						_itemMultiGroup.itemsSource.push(new Spliter());

						_item = new ToolStrip(
							BravoWebGrid.GroupInColumnSettingMenuItem,
							null,
							'GroupInColumnMenuItemText'
						);
						BravoResourceManager.getString('GroupInColumnMenuItemText').subscribe(
							(text) => (_item.text = text)
						);

						_item.visible = !this.isTreeNodeMode();
						if (_item.visible) _item.checked = this.bGroupInColumn;

						_itemMultiGroup.itemsSource.push(_item);
					}
				}

				let _bCanSum = false,
					_bCanGrandTotal = false,
					_bNoSumCol = false;
				for (let _nCol = 0; _nCol < this.columns.length; _nCol++) {
					if (!this.isNumericCol(_nCol)) continue;

					if (!this.isExpressionColumn(_nCol) && this.isPercentageCol(_nCol)) continue;

					let _colName = this.columns[_nCol].name;

					if (!_bCanGrandTotal) _bCanGrandTotal = true;
					if (_nCol == this._nContextCol && !String.isNullOrEmpty(_colName)) {
						if (!_bCanSum) _bCanSum = true;
						if (!_bNoSumCol && !this.isSumCol(_nCol)) _bNoSumCol = true;
					}

					if (_bCanGrandTotal && _bCanSum && _bNoSumCol) break;
				}

				_itemSumColumn.visible = _bCanSum;
				if (_itemSumColumn.visible) _itemSumColumn.checked = !_bNoSumCol;
				BravoResourceManager.getString('QuickGroupSumMenuItemText').subscribe(
					(text) => (_itemSumColumn.text = text)
				);

				_itemGrandTotal.visible = _bCanGrandTotal;

				if (_bCanGrandTotal) {
					_itemGrandTotal.deferUpdate(() => {
						_itemHideGrandTotal.checked = !this.bAllowGrandTotal;
						_itemTopGrandTotal.checked =
							this.bAllowGrandTotal &&
							this.grandTotalPosition == SubtotalPositionEnum.AboveData;
						_itemBottomGrandTotal.checked =
							this.bAllowGrandTotal &&
							this.grandTotalPosition == SubtotalPositionEnum.BelowData;
					});
				}

				if (_itemFreeze.visible)
					_itemFreeze.checked =
						this.frozenColumns > 0 && this._nContextCol < this.frozenColumns;
			} else if (
				this._autoContextMenu.tag == GridBuiltInContextMenuEnum.ContextMenuForRowHeader
			) {
				let _rgSelect = this.getMergedRange(
					this.rowHeaders,
					this._nContextRow,
					this._nContextCol
				);
				if (_rgSelect == null)
					_rgSelect = new wjg.CellRange(this._nContextRow, this._nContextCol);

				let _bIsNewRowOnly =
					_rgSelect.topRow == _rgSelect.bottomRow &&
					_rgSelect.topRow == this._nContextRow &&
					this.isAddNewRow(_rgSelect.topRow);
				let _bIsHeaderOnly = !_bIsNewRowOnly && this._nContextRow < 0;

				_itemDeleteRowCol.visible =
					this.allowDelete &&
					!this.isReadOnly &&
					!_bIsNewRowOnly &&
					!_bIsHeaderOnly &&
					this.deletingRow.hasHandlers;
				_itemAddRowCol.visible =
					this.allowAddNew && !this.isReadOnly && this.addingNewRow.hasHandlers;
				_itemInsertRowCol.visible =
					!this.isAddNewRow(this._nContextRow) &&
					this.allowAddNew &&
					!this.isReadOnly &&
					this.insertingNewRow.hasHandlers;

				BravoResourceManager.getString('RemoveSelectedRowsMenuItemText').subscribe(
					(text) => (_itemDeleteRowCol.text = text)
				);
				BravoResourceManager.getString('InsertNewRowMenuItemText').subscribe(
					(text) => (_itemInsertRowCol.text = text)
				);
				BravoResourceManager.getString('AddNewRowMenuItemText').subscribe(
					(text) => (_itemAddRowCol.text = text)
				);

				_itemCollapse.visible = _itemExpand.visible = false;

				_itemSortAZ.visible =
					_itemSortZA.visible =
					_itemMultiSort.visible =
					_itemGroupColumn.visible =
					_itemMultiGroup.visible =
					_itemMultiSort.visible =
					_itemSumColumn.visible =
						false;

				_itemFreeze.visible = true;

				_itemFitSize.visible = _itemDefaultSize.visible =
					this.allowResizing == wjg.AllowResizing.Both ||
					this.allowResizing == wjg.AllowResizing.BothAllCells ||
					this.allowResizing == wjg.AllowResizing.Rows ||
					this.allowResizing == wjg.AllowResizing.RowsAllCells;

				_itemDefaultSize.visible =
					!_bIsNewRowOnly &&
					!Object.is(
						GridBuiltInContextMenuEnum.ContextMenuForGridHeader,
						this._autoContextMenu.tag
					);
				if (!_itemDefaultSize.visible) {
					_itemFitSize.visible = false;
					_itemExpand.visible = _itemCollapse.visible = false;
					_itemFreeze.visible = false;
				}

				let _bCanGrandTotal = false;
				for (let _nCol = 0; _nCol < this.columns.length; _nCol++) {
					const _col = this.columns[_nCol];
					if (isIgnored(_col) || !this.isNumericCol(_nCol)) continue;

					if (!this.isExpressionColumn(_nCol) && this.isPercentageCol(_nCol)) continue;

					if (!_bCanGrandTotal) _bCanGrandTotal = true;
				}

				_itemGrandTotal.visible = _bCanGrandTotal;
				if (_bCanGrandTotal) {
					_itemGrandTotal.deferUpdate(() => {
						_itemHideGrandTotal.checked = !this.bAllowGrandTotal;
						_itemTopGrandTotal.checked =
							this.bAllowGrandTotal &&
							this.grandTotalPosition == SubtotalPositionEnum.AboveData;
						_itemBottomGrandTotal.checked =
							this.bAllowGrandTotal &&
							this.grandTotalPosition == SubtotalPositionEnum.BelowData;
					});
				}

				if (_itemFreeze.visible)
					_itemFreeze.checked =
						this.frozenRows > 0 && this._nContextRow < this.frozenRows;
			}

			BravoWebGrid.autoUpdateSeparators(this._autoContextMenu.itemsSource);

			return true;
		} finally {
			if (this._autoContextMenu && this._autoContextMenu.hostElement)
				this._autoContextMenu.invalidate();

			if (this._autoContextMenu.collectionView)
				this._autoContextMenu.collectionView.refresh();
		}
	}

	protected static autoUpdateSeparators(pItemCollection: Array<any>) {
		for (let _i = 0; _i < pItemCollection.length; _i++) {
			if (pItemCollection[_i] instanceof Spliter) {
				let _bAvailableUp = false;
				let _bAvailableDown = false;

				for (let _j = _i - 1; _j >= 0; _j--) {
					if (!pItemCollection[_j].visible) continue;

					if (pItemCollection[_j] instanceof Spliter) break;

					_bAvailableUp = true;
					break;
				}

				for (let _j = _i + 1; _j < pItemCollection.length; _j++) {
					if (!pItemCollection[_j].visible) continue;

					if (pItemCollection[_j] instanceof Spliter) break;

					_bAvailableDown = true;
					break;
				}

				pItemCollection[_i].visible = _bAvailableDown && _bAvailableUp;
			}
		}
	}

	public isSortableCol(pCol: number | string): boolean {
		let _nCol = -1;

		if (wjc.isString(pCol)) _nCol = this.columns.indexOf(pCol);
		else if (Number.isNumber(pCol)) _nCol = pCol as number;

		if (_nCol < 0 || _nCol >= this.columns.length) return false;

		if (isIgnored(this.columns[_nCol])) return false;

		if (this.isTreeNodeMode() || !this.columns[_nCol].allowSorting) return false;

		return true;
	}

	public isGroupableCol(pzColName: string);
	public isGroupableCol(pnCol: number);
	public isGroupableCol(col: any): boolean {
		if (wjc.isString(col)) {
			if (isIgnored(this.columns.getColumn(col))) return false;
		} else {
			if (col < 0 || col >= this.columns.length) return false;

			if (isIgnored(this.columns[col])) return false;
		}

		return true;
	}

	public isFixedGroup(pzGroupName: string): boolean {
		if (String.isNullOrEmpty(pzGroupName) || this.columns.indexOf(pzGroupName) == -1)
			return false;

		return this.groups.has(pzGroupName) && this.groups.get(pzGroupName).bFixed;
	}

	public getSortColumn(col: string | number | wjg.Column): wjc.SortDescription {
		if (!this.collectionView) return;

		let _zColName: string;
		if (Number.isNumber(col) && col >= 0 && col < this.columns.length)
			_zColName = (<wjg.Column>this.columns[col as number]).name;
		else if (col instanceof wjg.Column) _zColName = col.name;
		else if (wjc.isString(col)) _zColName = col as string;

		if (String.isNullOrEmpty(_zColName)) return;

		let _cv = this.collectionView;
		let _sortCollection = _cv.sortDescriptions;
		if (_sortCollection == null || _sortCollection.length < 1) return null;

		return _sortCollection.find((item) => item.property == _zColName);
	}

	private updateGroupRowCssClass() {
		if (this.rows.length < 1) return;

		let _nodes = <Array<wjg.GroupRow>>this.rows.filter((row) => row instanceof wjg.GroupRow);
		for (let _node of _nodes) {
			if (this.isTreeNodeMode()) _node.cssClass = CellStyleEnum[CellStyleEnum.Subtotal0];
			else
				_node.cssClass = String.format(
					'Subtotal{0}',
					_node.level < 0 || _node.level > 5 ? 0 : _node.level
				);
		}
	}

	public getCellType(
		panel: GridPanel,
		row: number,
		col: number,
		cellStyle?: CellStyle
	): GridCellTypeEnum {
		if (!isCellValid(panel, row, col)) return GridCellTypeEnum.None;

		const _bIsFixed = panel.cellType == wjg.CellType.ColumnHeader;
		const _colStyle = panel.columns[col][BravoWebGrid.StyleProp];
		const _colType = getCellType(_colStyle);
		const _colDataType = BravoWebGrid.getColumnDataType(this.columns[col]);
		const _editor = panel.columns[col][BravoWebGrid.GridColumEditorProp];
		const _colFmt = panel.columns[col].format;

		const _cst =
			cellStyle != null ? cellStyle.clone() : BravoWebGrid.getCellStyle(panel, row, col);
		_cst.mergeWith(_colStyle);

		const _cellType = getCellType(_cst);

		if (
			(!_bIsFixed &&
				(_colType == GridCellTypeEnum.Check || _colDataType == wjc.DataType.Boolean)) ||
			_cellType == GridCellTypeEnum.Check
		)
			return GridCellTypeEnum.Check;

		if (
			(!_bIsFixed &&
				(wjc.tryCast(_editor, 'IBravoPictureInputBox') ||
					_colType == GridCellTypeEnum.img)) ||
			_cellType == GridCellTypeEnum.img
		)
			return GridCellTypeEnum.img;

		if (
			(!_bIsFixed &&
				(wjc.tryCast(_editor, 'IBravoLink') ||
					_colType == GridCellTypeEnum.link ||
					compareStrings(_colFmt, GridCellTypeEnum[GridCellTypeEnum.link], true))) ||
			_cellType == GridCellTypeEnum.link
		)
			return GridCellTypeEnum.link;

		if ((!_bIsFixed && _colType == GridCellTypeEnum.rtf) || _cellType == GridCellTypeEnum.rtf)
			return GridCellTypeEnum.rtf;

		if ((!_bIsFixed && _colType == GridCellTypeEnum.html) || _cellType == GridCellTypeEnum.html)
			return GridCellTypeEnum.html;

		if (
			(!_bIsFixed && _colType == GridCellTypeEnum.barcode) ||
			_cellType == GridCellTypeEnum.barcode
		)
			return GridCellTypeEnum.barcode;

		if (
			(!_bIsFixed && _colType == GridCellTypeEnum.qrcode) ||
			_cellType == GridCellTypeEnum.qrcode
		)
			return GridCellTypeEnum.qrcode;

		if (
			(!_bIsFixed && _colType == GridCellTypeEnum.progress) ||
			_cellType == GridCellTypeEnum.progress
		)
			return GridCellTypeEnum.progress;

		return GridCellTypeEnum.Normal;
	}

	private _barCodeCtrl: BravoBarCodeBox = null;

	public renderSpecialCell1(e: wjg.FormatItemEventArgs, pDrawInfo?: DrawCellInfo) {
		let _customDraw = e instanceof CustomOwnerDrawCellEventArgs ? e : null;
		let _cellStyle = _customDraw ? _customDraw.cellStyle : null;
		let _cellType = _customDraw
			? _customDraw.cellType
			: this.getCellType(e.panel, e.row, e.col, _cellStyle);

		const _col = wjc.tryCast(e.panel.columns[e.col], wjg.Column) as wjg.Column;
		const _bIsDocInputBox =
			_col &&
			wjc.tryCast(_col[BravoWebGrid.GridColumEditorProp], 'IBravoDocInputBox') &&
			e.panel.cellType == wjg.CellType.Cell;

		if (
			_cellType != GridCellTypeEnum.barcode &&
			_cellType != GridCellTypeEnum.qrcode &&
			_cellType != GridCellTypeEnum.rtf &&
			_cellType != GridCellTypeEnum.html &&
			_cellType != GridCellTypeEnum.img &&
			_cellType != GridCellTypeEnum.progress &&
			_cellType != GridCellTypeEnum.Check &&
			_cellType != GridCellTypeEnum.link &&
			!_bIsDocInputBox
		) {
			// this.renderSpecialCell0(e.panel, e.row, e.col, e.cell, e.range, _cellStyle);
			this.renderCellDirection(e.cell, _cellStyle);
			return false;
		}

		const _groupRow = wjc.tryCast(e.panel.rows[e.row], wjg.GroupRow) as wjg.GroupRow;
		if (_groupRow && !this.isTreeNodeMode() && _cellType != GridCellTypeEnum.progress)
			return false;

		try {
			switch (_cellType) {
				case GridCellTypeEnum.img:
					if (e.panel.cellType !== wjg.CellType.ColumnHeader) {
						let _buff = e.panel.getCellData(e.row, e.col, false);
						let _zBase64: string;
						if (_buff instanceof Uint8Array) _zBase64 = Convert.toBase64String(_buff);
						else if (String.isBase64(e.cell.textContent)) _zBase64 = e.cell.textContent;
						else if (String.isBase64(_buff)) _zBase64 = _buff;

						if (!String.isNullOrEmpty(_zBase64)) {
							let _cellStyle = BravoWebGrid.getCellStyle(
								e.panel,
								e.row,
								e.col,
								false
							);
							let _nHeight = null,
								_nWidth = null,
								_imageAlign: ImageAlignEnum;
							if (
								_cellStyle[StyleElementFlags[StyleElementFlags.ImageAlign]] ==
								ImageAlignEnum[ImageAlignEnum.Stretch]
							) {
								_nHeight =
									e.panel.rows[e.row].height || e.panel.rows[e.row].renderHeight;
								_nWidth =
									e.panel.columns[e.col].width ||
									e.panel.columns[e.col].renderWidth;
								_imageAlign = ImageAlignEnum.Stretch;
							} else if (
								_cellStyle[StyleElementFlags[StyleElementFlags.ImageAlign]] ==
								ImageAlignEnum[ImageAlignEnum.Scale]
							) {
								if (e.range && !e.range.isSingleCell)
									_nWidth = this.getCurrentWidthOfCols(
										e.panel,
										e.range.leftCol,
										e.range.rightCol
									);
								else
									_nWidth =
										e.panel.columns[e.col].width ||
										e.panel.columns[e.col].renderWidth;

								if (e.range && !e.range.isSingleCell)
									_nHeight = this.getCurrentHeightOfRows(
										e.range.topRow,
										e.range.bottomRow,
										e.panel
									);
								else
									_nHeight =
										e.panel.rows[e.row].height ||
										e.panel.rows[e.row].renderHeight;

								_imageAlign = ImageAlignEnum.Scale;
								if (pDrawInfo) pDrawInfo.styleCss['justify-content'] = 'center';
							}

							if (!_imageAlign) {
								let _zAlign: string =
									_cellStyle[StyleElementFlags[StyleElementFlags.ImageAlign]];

								if (!String.isNullOrEmpty(_zAlign))
									_imageAlign = ImageAlignEnum[_zAlign];
							}

							if (!this.itemsSource) _nHeight = e.panel.rows[e.row].height;

							let _pictureBoxCtrl = new BravoPictureBoxControl(
								null,
								'jpeg',
								_zBase64,
								_nWidth,
								_nHeight
							);

							e.cell.textContent = '';
							let _range = e.range.clone();

							_pictureBoxCtrl.onLoadImageEnd.addHandler((s, e1) => {
								let _sz = calculateAspectRatioFit(
									_pictureBoxCtrl.size.width,
									_pictureBoxCtrl.size.height,
									_nWidth,
									_nHeight,
									_imageAlign == ImageAlignEnum.Scale
								);

								if (
									_pictureBoxCtrl.imageHTML &&
									(_imageAlign == ImageAlignEnum.Scale ||
										_imageAlign == ImageAlignEnum.Stretch ||
										_imageAlign == ImageAlignEnum.TileStretch)
								) {
									wjc.setCss(_pictureBoxCtrl.imageHTML, _sz);

									if (_imageAlign == ImageAlignEnum.Scale) {
										wjc.setCss(_pictureBoxCtrl.imageHTML, _sz);
									} else {
										wjc.setCss(_pictureBoxCtrl.imageHTML, {
											width: `${
												_sz.width -
												(BravoCore.convertPxStringToNumber(
													e.cell.style.paddingLeft
												) || 2) -
												(BravoCore.convertPxStringToNumber(
													e.cell.style.paddingRight
												) || 2)
											}px`,
											height: `${
												_nHeight -
												(BravoCore.convertPxStringToNumber(
													e.cell.style.paddingTop
												) || 2) -
												(BravoCore.convertPxStringToNumber(
													e.cell.style.paddingBottom
												) || 2)
											}px`
										});
									}

									e.cell.innerHTML = _pictureBoxCtrl.imageHTML.outerHTML;
								} else if (_pictureBoxCtrl.imageHTML && _imageAlign) {
									if (_nHeight > _pictureBoxCtrl.size.height)
										wjc.setCss(_pictureBoxCtrl.imageHTML, { height: '' });

									e.cell.innerHTML = _pictureBoxCtrl.imageHTML.outerHTML;

									if (this.itemsSource)
										this.updateCellImageHeight(_range, _pictureBoxCtrl.size);
								}
							});

							if (
								pDrawInfo &&
								_imageAlign != ImageAlignEnum.Scale &&
								_imageAlign != ImageAlignEnum.Stretch
							) {
								let _css = CellStyle.buildAlignStyle(ImageAlignEnum[_imageAlign]);
								if (_css && Object.keys(_css).length > 0)
									Object.assign(pDrawInfo.styleCss, _css);
							} else if (pDrawInfo) {
								pDrawInfo.styleCss['display'] = 'flex';
							}

							if (this.itemsSource)
								this.updateCellImageHeight(_range, _pictureBoxCtrl.size);
						}
					}
					return false;
				case GridCellTypeEnum.qrcode:
				case GridCellTypeEnum.barcode:
					try {
						let _zOrgText = e.cell.textContent;
						e.cell.textContent = String.empty;

						if (String.isNullOrEmpty(_zOrgText)) return false;

						if (!this._barCodeCtrl) {
							let _cellElement = document.body.querySelector(
								'#barCodeCtrl'
							) as HTMLElement;

							if (!_cellElement) _cellElement = document.createElement('div');

							_cellElement.style.visibility = 'hidden';
							_cellElement.setAttribute('id', 'barCodeCtrl');
							document.body.appendChild(_cellElement);

							this._barCodeCtrl = new BravoBarCodeBox(_cellElement);
						}

						if (_cellType == GridCellTypeEnum.qrcode) {
							this._barCodeCtrl.codeType = CodeType.QRCode;
						} else {
							this._barCodeCtrl.codeType = CodeType.Code39;

							let _zFormat = wjc.asString(_cellStyle['Format']);
							if (
								!String.isNullOrEmpty(_zFormat) &&
								_zFormat
									.toLowerCase()
									.startsWith(GridCellTypeEnum[GridCellTypeEnum.barcode] + '.')
							) {
								let _codeType = CodeType[_zFormat.split('.')[1]];
								if (_codeType != null) this._barCodeCtrl.codeType = _codeType;
							}
						}

						this._barCodeCtrl.value = _zOrgText;

						if (
							DisplayEnum[wjc.asString(_cellStyle['Display'])] ==
								DisplayEnum.ImageOnly ||
							(compareStrings('[...]', _zOrgText) &&
								BravoExpressionEvaluator.containsExpression(e.data))
						)
							this._barCodeCtrl.showLabel = false;
						else this._barCodeCtrl.showLabel = true;

						const _img = this._barCodeCtrl.getDataUrl();
						if (_img) {
							const _e = document.createElement('img');
							_e.src = _img;
							_e.style.width = '100%';

							e.cell.appendChild(_e);
						}

						return false;
					} finally {
					}

				case GridCellTypeEnum.rtf:
					let _zText = e.cell.textContent;
					if (!ExtensionsMethod.isRtfString(_zText)) return;

					if (!_zText.endsWith('}')) _zText += '}';

					ExtensionsMethod.rtfToHtml(_zText, e.cell);

					e.cell.classList.add('cell-rtf');

					return true;
				case GridCellTypeEnum.progress:
					if (e.panel.cellType !== wjg.CellType.ColumnHeader) {
						let _cellData = e.panel.getCellData(e.row, e.col, false);

						let _row = e.panel.rows[e.row];

						if (wjc.isString(_cellData) /* || _row instanceof wjg.GroupRow */) {
							e.cell.innerHTML = '';
							return true;
						}

						let _nPL = BravoCore.convertPxStringToNumber(e.cell.style.paddingLeft) || 2,
							_nPR =
								BravoCore.convertPxStringToNumber(e.cell.style.paddingRight) || 2,
							_nPT = BravoCore.convertPxStringToNumber(e.cell.style.paddingTop) || 2,
							_nPB =
								BravoCore.convertPxStringToNumber(e.cell.style.paddingBottom) || 2;

						e.cell.textContent = '';
						let _rect = e.panel.getCellBoundingRect(e.row, e.col);

						_rect.width -= _nPL + _nPR;
						_rect.height -= _nPT + _nPB;
						_rect.left = (_nPL + _nPR) / 2;
						_rect.top = (_nPT + _nPB) / 2;

						let _progressBarCell = new BravoProgressBarControl(e.cell);

						try {
							let _cellStyle = BravoWebGrid.getCellStyle(
								e.panel,
								e.row,
								e.col,
								false
							);

							_progressBarCell.readFromLayout(_cellStyle);
							_progressBarCell.nPercent = _cellData;
							_progressBarCell.drawProgressBar(_rect);
						} finally {
							// _progressBarCell.dispose();
							_progressBarCell = null;
						}
					}

					return true;

				case GridCellTypeEnum.html:
					if (e.data) {
						let _value: string = e.data;
						if (_value.indexOf('<table') > -1) {
							_value = ExtensionsMethod.tableToDiv(_value);
						}

						let _zHtml = _value; //sanitizeHtml(_value);
						e.cell.innerHTML = _zHtml;

						if (e.data && !e.data.includes('img') && e.data.indexOf('<table') < 0)
							e.cell.style.display = 'block';
					} else if (e.cell.textContent) {
						let _zHtml = sanitizeHtml(e.cell.textContent);

						e.cell.innerHTML = _zHtml;
						e.cell.style.display = 'block';
					}

					const _imgs = e.cell.querySelectorAll('img');
					if (_imgs) {
						const _nRatio = ExtensionsMethod.round(1 / devicePixelRatio, 1);
						_imgs.forEach((img) => {
							wjc.setCss(img, { transform: `scale(${_nRatio})` });
						});
					}

					return true;
				case GridCellTypeEnum.Check:
					if (e.panel.cellType !== wjg.CellType.ColumnHeader) {
						let _firstChild =
							e.cell.firstElementChild instanceof Element
								? e.cell.firstElementChild
								: null;
						let _chk = _firstChild?.querySelector('input');
						if (!_chk || _chk.type != 'checkbox') {
							const _val = e.panel.getCellData(e.row, e.col, false);
							e.cell.innerHTML = `<label style="display: flex"><input type="checkbox" ${
								Boolean.asBoolean(_val) ? 'checked' : ''
							} 
                            ${
								this.canEditCell(e.row, e.col) ? '' : 'disabled'
							} class="group-checkbox" /></label>`;

							_chk = e.cell.querySelector('input');
						}

						_chk.indeterminate = false;

						let _bReadOnly = this.isReadOnly || _col.isReadOnly;
						if (_bReadOnly) {
							_chk.removeAttribute('disabled');
							_chk.setAttribute('readOnly', 'readOnly');
							_chk.addEventListener('click', (e) => {
								e.preventDefault();
							});
						} else {
							_chk.removeAttribute('readOnly');
						}

						const _cs0 = BravoWebGrid.getCellStyle(e.panel, e.row, e.col, false);
						if (!_cellStyle || Object.keys(_cellStyle).length == 0) _cellStyle = _cs0;
						else {
							_cellStyle.mergeWith(_cs0);
						}

						if (
							pDrawInfo &&
							_cellStyle &&
							_cellStyle[StyleElementFlags[StyleElementFlags.ImageAlign]]
						) {
							const _css = CellStyle.buildAlignStyle(
								_cellStyle[StyleElementFlags[StyleElementFlags.ImageAlign]],
								false
							);
							if (_css) Object.assign(pDrawInfo.styleCss, _css);
						}
					}

					return true;
				case GridCellTypeEnum.link:
					if (e instanceof BravoFormatItemEventArgs) e.cancel = this.renderButtonCell(e);

					return e.cancel;
				default:
					if (_bIsDocInputBox) {
						let _buff = e.panel.getCellData(e.row, e.col, false);

						let _ft = FileTypeEnum.Unknown;
						let _ms = String.isBase64(_buff) ? Convert.fromBase64String(_buff) : _buff;
						if (_ms instanceof Uint8Array) {
							const _nSize = _ms.length;
							_ft = BravoFileTypeDetector.detectFileType(_ms);

							e.cell.innerHTML = null;

							let _icon = document.createElement('span');
							e.cell.appendChild(_icon);

							let _fileInfo = document.createElement('span');
							e.cell.appendChild(_fileInfo);

							_fileInfo.textContent = String.format(
								'{0} ({1})',
								FileTypeEnum[_ft],
								formatBytes(_nSize, _nSize < 1024 ? 2 : 0)
							);

							_icon.className = 'fa ' + BravoUIExtension.getFileTypeIcon(_ft);
							_icon.style.marginRight = '5px';

							if (pDrawInfo) pDrawInfo.styleCss['align-items'] = 'center';
						}
					}
			}
		} catch (_ex) {
			console.log(_ex);
			return false;
		}
	}

	public refresh(fullUpdate?: boolean) {
		if (!this.hostElement) return;

		if (this._visible || this._visible == null) wjc.removeClass(this.hostElement, 'hidden');
		else wjc.addClass(this.hostElement, 'hidden');

		if (!this.tabStop) this.hostElement.setAttribute('tabindex', '-1');
		else this.hostElement.removeAttribute('tabindex');

		let _css = {},
			_offsetWidth = 0,
			_offsetHeight = 0;

		if (this.padding && !this.padding.equals(DefaultPadding)) {
			_css['padding-top'] = this.padding.top;
			_css['padding-right'] = this.padding.right;
			_css['padding-bottom'] = this.padding.bottom;
			_css['padding-left'] = this.padding.left;

			_offsetWidth = this.padding.left + this.padding.right;
			_offsetHeight = this.padding.top + this.padding.bottom;
		}

		if (this.margin && !this.margin.equals(DefaultPadding)) {
			_css['margin-top'] = this.margin.top;
			_css['margin-right'] = this.margin.right;
			_css['margin-bottom'] = this.margin.bottom;
			_css['margin-left'] = this.margin.left;

			_offsetWidth = this.margin.left + this.margin.right;
			_offsetHeight = this.margin.top + this.margin.bottom;
		}

		if ((this._anchor & AnchorStyles.Left) != 0 && (this._anchor & AnchorStyles.Right) != 0) {
			_css['width'] = _offsetWidth == 0 ? '100%' : `calc(100% - ${_offsetWidth}px)`;
		} else if (this._width > 0) {
			_css['width'] = this.width;
		}

		if ((this._anchor & AnchorStyles.Top) != 0 && (this._anchor & AnchorStyles.Bottom) != 0) {
			_css['height'] = _offsetHeight == 0 ? '100%' : `calc(100% - ${_offsetHeight}px)`;
		} else if (this._height > 0) {
			_css['height'] = this.height;
		}

		if (_css && Object.keys(_css).length > 0) wjc.setCss(this._e, _css);

		if (this._e) {
			const _newRow = this._e.querySelector('.bravo-new-row');
			if (_newRow) _newRow.remove();
		}

		super.refresh(fullUpdate);
	}

	/* public renderSpecialCell(panel: GridPanel, row: number, col: number, cell: HTMLElement, rng: wjg.CellRange, cellStyle?: CellStyle,
        cellType?: GridCellTypeEnum) {

        if (cellType == undefined)
            cellType = this.getCellType(panel, row, col, cellStyle);

        if (cellType != GridCellTypeEnum.barcode &&
            cellType != GridCellTypeEnum.qrcode &&
            cellType != GridCellTypeEnum.rtf &&
            cellType != GridCellTypeEnum.html &&
            cellType != GridCellTypeEnum.img &&
            cellType != GridCellTypeEnum.progress) {
            // this.renderSpecialCell0(panel, row, col, cell, rng, cellStyle);
            return false;
        }

        try {
            switch (cellType) {
                case GridCellTypeEnum.img:
                    if (panel.cellType !== wjg.CellType.ColumnHeader) {
                        let _zBuff = cell.textContent;

                        if (!String.isNullOrEmpty(_zBuff)) {
                            let _pictureBoxCtrl = new BravoPictureBoxControl(null, 'jpeg', _zBuff);
                            let _divElement = document.createElement('div');

                            _divElement.classList.add('bravo-picture-box')
                            _divElement.innerHTML = _pictureBoxCtrl.imageHTML.outerHTML;
                            cell.innerHTML = _divElement.outerHTML;
                            _divElement.remove();

                            // if (this._bHeightCellImgChanged) return false;

                            let _newHeight = _pictureBoxCtrl.height;
                            let _row = panel.rows[row];

                            if (_row.height !== _newHeight && _row.height < _newHeight) {
                                _row.height = _newHeight;
                                this.raiseOnContentHeightChanged(new RowColEventArgs(panel, row, col));
                            }
                        }
                    }
                    return false;
                case GridCellTypeEnum.qrcode:
                case GridCellTypeEnum.barcode:
                    let _zOrgText = cell.textContent;
                    cell.textContent = String.empty;

                    if (String.isNullOrEmpty(_zOrgText))
                        return false;
    
                    if (this._barCodeCtrl == null)
                        this._barCodeCtrl = new BravoBarCode();
    
                    if (cellType == GridCellTypeEnum.qrcode) {
                        this._barCodeCtrl.barCodeType = BarCodeTypeEnum.QRCode;
                    }
                    else {
                        let _zFormat = wjc.asString(cellStyle['Format']);
                        if (!String.isNullOrEmpty(_zFormat) &&
                            _zFormat.toLowerCase().startsWith(GridCellTypeEnum[GridCellTypeEnum.barcode] + '.')) {
                            let _codeType = BarCodeTypeEnum[_zFormat.split('.')[1]];
                            if (_codeType != null)
                                this._barCodeCtrl.barCodeType = _codeType;
                        }
                    }
    
                    this._barCodeCtrl.codeValue = _zOrgText;
                    this._barCodeCtrl.autoScale = true;
                    this._barCodeCtrl.showLabelText = true;
                    this._barCodeCtrl.height = cell.offsetHeight - 10;
                    this._barCodeCtrl.width = this._barCodeCtrl.height * 3;
    
                    let _img = this._barCodeCtrl.getImage();
                    if (_img == null) return false; 
    
                    cell.appendChild(_img);

                    return false;

                case GridCellTypeEnum.rtf:
                    let _zText = cell.textContent;
                    if (!ExtensionsMethod.isRtfString(_zText))
                        return;

                    if (!_zText.endsWith("}"))
                        _zText += "}";

                    ExtensionsMethod.rtfToHtml(_zText, cell);

                    cell.classList.add('cell-rtf');

                    return true;
                case GridCellTypeEnum.progress:
                    // if (panel.cellType !== wjg.CellType.ColumnHeader) {
                    //     let _cellData = panel.getCellData(row, col, false);
                    //     let _cellStyle = BravoWebGrid.getCellStyle(panel, row, col, false);

                    //     let _progressBarCell = new BravoProgressBarControl();

                    //     try {
                    //         _progressBarCell.readFromLayout(_cellStyle);
                    //         _progressBarCell.nPercent = _cellData;
                    //         _progressBarCell.progressBarTitle = BravoProgressBarControl.formater(
                    //             Number.asNumber(_cellData), _progressBarCell.format);

                    //         _progressBarCell.refresh();
                    //     }
                    //     finally {
                    //         cell.innerHTML = _progressBarCell.hostElement.outerHTML;
                    //         _progressBarCell.dispose();
                    //         _progressBarCell = null;
                    //     }
                    // }

                    return true;

                case GridCellTypeEnum.html:
                    if (cell.textContent)
                        cell.innerHTML = cell.textContent;

                    return true;
            }
        }
        catch (_ex) {
            console.log(_ex);
            return false;
        }
    } */

	public renderCellDirection(pCell: HTMLElement, pCellStyle: any, pWordWrap: boolean = false) {
		let _classList = new StringBuilder();
		let _oldHTML = pCell.innerHTML;

		if (String.isNullOrEmpty(_oldHTML) || pCellStyle == null) return;

		let _textDir = wjc.asString(pCellStyle['TextDirection']);

		if (String.isNullOrEmpty(_textDir)) return;

		switch (TextDirectionEnum[_textDir]) {
			case TextDirectionEnum.Normal:
				break;
			case TextDirectionEnum.Up:
				_classList.append('vertical-up ');
				break;
			case TextDirectionEnum.Down:
				_classList.append('vertical-down ');
				break;
		}

		if (pWordWrap) _classList.append('wj-wrap ');

		if (_classList.length > 0)
			pCell.innerHTML = `<span class='${_classList.toString()}'>${_oldHTML}</span>`;
	}

	public renderSpecialCell0(
		panel: wjg.GridPanel,
		row: number,
		col: number,
		cell: HTMLElement,
		rng: wjg.CellRange,
		cellStyle: CellStyle
	) {
		let _css = {};
		let _grd = <BravoWebGrid>panel.grid;
		if (cellStyle && cellStyle['TextDirection']) {
			let _textDir = wjc.asString(cellStyle['TextDirection']);
			switch (TextDirectionEnum[_textDir]) {
				case TextDirectionEnum.Normal:
					break;
				case TextDirectionEnum.Up:
					_css['text-orientation'] = 'mixed';
					_css['writing-mode'] = 'vertical-rl';
					_css['transform'] = 'rotate(180deg)';
					break;
				case TextDirectionEnum.Down:
					_css['text-orientation'] = 'mixed';
					_css['writing-mode'] = 'vertical-rl';
					break;
			}

			BravoCore.append(cell, `${cell.textContent}`);
			wjc.setCss(cell.firstElementChild, _css);
		}

		if (panel.cellType == wjg.CellType.ColumnHeader) {
			if ((cellStyle && !cellStyle['TextDirection']) || !cellStyle) {
				let _zFontSize = cell.style.fontSize || '9.75pt';
				let _nLine =
					Math.floor((cell.clientHeight - 4) / (fontSizeToPxConvert(_zFontSize) + 1)) ||
					1;

				_css = {
					display: '-webkit-box',
					webkitBoxOrient: 'vertical',
					webkitLineClamp: _nLine.toString(),
					overflow: 'hidden'
				};

				BravoCore.append(cell, `${cell.textContent}`);
				wjc.setCss(cell.firstElementChild, _css);
			}

			let _col = <wjg.Column>panel.columns[col];
			let _bndCol = _grd._getBindingColumn(panel, row, _col);
			let _r2 = row;
			if (rng && !rng.isSingleCell) {
				_r2 = rng.row2;
			}

			if (
				_bndCol.currentSort &&
				_grd.showSort &&
				(_r2 == _grd._getSortRowIndex() || _bndCol != _col)
			) {
				if (cellStyle && cellStyle['TextDirection'])
					cell.insertAdjacentHTML('beforeend', BravoWebGrid._getSortIcon(_col));
				else
					BravoCore.append(
						cell,
						wjc.escapeHtml(cell.textContent.trim()) + BravoWebGrid._getSortIcon(_col)
					);
			}
		}

		// if (Object.keys(_css).length > 0) {
		//     let _zStyleName = String.format("s{0}", buildHashName(_css));
		//     wjc.addClass(cell.firstElementChild, _zStyleName);

		//     let _css0 = new StyleCssData(panel.cellType, _css);

		//     if (_grd.styleCss.containsKey(_zStyleName))
		//         _grd.styleCss.get(_zStyleName).value = _css0;
		//     else
		//         _grd.styleCss.add(_zStyleName, _css0);
		// }
	}

	private updateCellImageHeight(pCellRange: wjg.CellRange, pSizePic: wjc.Size) {
		if (!pCellRange) return;

		let _row = this.cells.rows[pCellRange.row];
		let _col = this.columns[pCellRange.col];
		let _newHeight = pSizePic.height;

		if (_row.renderHeight !== _newHeight && _row.renderHeight < _newHeight) {
			_row.height = _newHeight;
			this.raiseOnContentHeightChanged(
				new RowColEventArgs(this.cells, pCellRange.row, pCellRange.col)
			);
		}

		if (!_col.renderWidth || _col.renderWidth < pSizePic.width) {
			let _cell = this.cells.getCellElement(pCellRange.row, pCellRange.col);

			wjc.setCss(_cell, { justifyContent: 'flex-start' });
		}
	}

	_getSortRowIndex() {
		return this.sortRowIndex != null
			? this.sortRowIndex
			: this.columnHeaders.rows.filter((row) => !isIgnored(row)).length - 1;
	}

	private static _getSortIcon(col: wjg.Column): string {
		return '<span class="wj-glyph-' + (col.currentSort == '+' ? 'up' : 'down') + '"></span>';
	}

	public containsStyle(pzStyleName: string, outStyleName?: { name: string }) {
		const _keys = this.styles.keys();
		for (const _zKey of _keys) {
			if (compareStrings(pzStyleName, _zKey.toString(), true)) {
				if (outStyleName) outStyleName.name = _zKey;
				return true;
			}
		}

		return false;
	}

	getPreferredSize() {
		return new wjc.Size(this.width, this.height);
	}
}

export class GroupColumnItem {
	private _func: AggregateEnum = AggregateEnum.Sum;

	public get function(): AggregateEnum {
		return this._func;
	}

	public set function(val: AggregateEnum) {
		this._func = val;
	}

	private _order: SortOrder = SortOrder.Ascending;

	@Enum(SortOrder)
	public get order(): SortOrder {
		return this._order;
	}

	public set order(val: SortOrder) {
		if (val != SortOrder.None) this._bOrderDefaultChange = true;

		this._order = val;
	}

	private _bOrderDefaultChange = false;

	public get bOrderDefaultChange(): boolean {
		return this._bOrderDefaultChange;
	}

	private _text: string = null;

	public get text(): string {
		return this._text;
	}

	public set text(val: string) {
		this._text = val;
	}

	private _bFixed: boolean;

	public get bFixed(): boolean {
		return this._bFixed;
	}

	public set bFixed(val: boolean) {
		this._bFixed = val;
	}

	public readonly nodeStateCollection: Array<string>;

	constructor(
		pzText: string,
		pOrder: SortOrder = SortOrder.Ascending,
		pFunction: AggregateEnum = AggregateEnum.Sum
	) {
		this._text = pzText;
		this._order = pOrder;
		this._func = pFunction;

		this.nodeStateCollection = new Array();
	}
}

export class CellStyle {
	public static parseString(pzStyle: string): CellStyle {
		if (String.isNullOrEmpty(pzStyle) || pzStyle.length < 1) return;

		let _style: CellStyle = new CellStyle(),
			_text: string;

		if (!pzStyle.endsWith(';')) pzStyle += ';';

		let _keys = Object.keys(StyleElementFlags).filter((key) => !Number.isNumber(key));
		for (const _key of _keys) {
			_text = this.matchText(_key, pzStyle);
			if (_text) {
				if (
					(_key == StyleElementFlags[StyleElementFlags.ForeColor] ||
						_key == StyleElementFlags[StyleElementFlags.BackColor]) &&
					_text &&
					!_text.includes('rgb') &&
					_text.includes(',')
				) {
					_style[_key] = `rgba(${_text})`;
					continue;
				}

				_style[_key] = _text;
			}
		}

		return _style;

		/* let _styles = pzStyle.split(/:|;/),
            _style1: CellStyle = new CellStyle();
    
        if (_styles && _styles.length > 2) {
            _styles = _styles.splice(0, _styles.length - 1);
            for (let _n = 0; _n < _styles.length; _n += 2) {
                let _zKey = _styles[_n],
                    _value = _styles[_n + 1];
    
                if (_zKey == StyleElementFlags[StyleElementFlags.ForeColor] &&
                    _value && !_value.includes('rgb') && _value.includes(',')) {
                    _style1[_zKey] = `rgba(${_value})`;
                    continue;
                }
    
                if (_zKey == StyleElementFlags[StyleElementFlags.Border] && _value.includes(',')) {
                    _style1[_zKey] = _value;
                    continue;
                }
    
                _style1[_zKey] = _value ? _value.trimChars("\"") : String.empty;
            }
        }
    
        return _style1; */
	}

	public static buildCss(
		pCellStyle: CellStyle,
		e?: StyleElementFlags,
		pColorDefault: wjc.Color = wjc.Color.fromString('black'),
		pbIsRtfCell: boolean = false,
		pbImportant: boolean = false
	) {
		if (!pCellStyle || !wjc.isObject(pCellStyle)) return null;
		let _css = {};

		for (let _zKey in pCellStyle) {
			let _zStyleValue: string = pCellStyle[_zKey];

			if (e != null && _zKey != StyleElementFlags[e]) continue;

			switch (StyleElementFlags[_zKey]) {
				case StyleElementFlags.TextAlign:
					// case StyleElementFlags.ImageAlign:
					/* if (pCellStyle[StyleElementFlags[StyleElementFlags.TextAlign]] != null &&
                        StyleElementFlags[_zKey] == StyleElementFlags.ImageAlign &&
                        !String.format("{0}", pCellStyle[StyleElementFlags[StyleElementFlags.DataType]]).includes("Boolean"))
                        break; */

					if (
						StyleElementFlags[_zKey] == StyleElementFlags.TextAlign &&
						(StyleTextImageAlign[_zStyleValue] == null ||
							compareStrings(
								pCellStyle[StyleElementFlags[StyleElementFlags.DataType]],
								'System.Boolean',
								true
							))
					)
						break;

					if (
						StyleElementFlags[_zKey] == StyleElementFlags.ImageAlign &&
						ImageAlignEnum[_zStyleValue] == null
					)
						break;

					if (_zStyleValue)
						Object.assign(_css, this.buildAlignStyle(_zStyleValue, pbIsRtfCell));
					break;
				case StyleElementFlags.BackColor:
					if (_zStyleValue !== 'None')
						_css['background-color'] = `${_zStyleValue}${
							pbImportant ? '!important' : ''
						}`;

					break;
				case StyleElementFlags.ForeColor:
					if (_zStyleValue !== 'None' && !pbIsRtfCell)
						_css['color'] = `${_zStyleValue}${pbImportant ? '!important' : ''}`;

					break;
				case StyleElementFlags.Font:
					if (pbIsRtfCell) break;

					let _zStyleFont = _zStyleValue.split(',');
					if (_zStyleFont.length > 0 && _zStyleFont[0])
						_css['font-family'] = _zStyleFont[0];

					if (_zStyleFont.length > 1 && _zStyleFont[1]) {
						var _zFontSize = _zStyleFont[1];

						if (Number.isNumber(_zFontSize)) _zFontSize = _zFontSize + 'pt';

						_css['font-size'] = _zFontSize;
					}

					if (_zStyleFont.length > 2 && _zStyleFont[2] != null) {
						let _zFontStyle = _zStyleValue.substring(_zStyleValue.indexOf('style='));
						if (
							_zFontStyle.includes('Regular') ||
							String.isNullOrEmpty(_zStyleFont[2])
						) {
							_css['font-weight'] = 'normal';
						} else {
							if (_zFontStyle.includes('Italic')) _css['font-style'] = 'italic';

							if (_zFontStyle.includes('Bold')) _css['font-weight'] = 'bold';
							else _css['font-weight'] = 'normal';

							if (
								_zFontStyle.includes('Underline') &&
								_zFontStyle.includes('Strikeout')
							) {
								_css['text-decoration'] = 'underline line-through';
							} else {
								if (_zFontStyle.includes('Underline'))
									_css['text-decoration'] = 'underline';

								if (_zFontStyle.includes('Strikeout'))
									_css['text-decoration'] = 'line-through';
							}
						}
					}

					break;
				case StyleElementFlags.TextDirection:
					break;

				case StyleElementFlags.Border:
					let _borders = _zStyleValue.split(',');
					if (
						_borders == null ||
						(_borders.length != 4 && _borders.length != 6 && _borders.length != 7)
					)
						break;

					let _nBorderSize = 1;
					if (!String.isNullOrEmpty(_borders[1]) && Number.isNumber(_borders[1]))
						_nBorderSize = Number.asNumber(_borders[1]);

					_nBorderSize = BravoSettings.toCurrentDpiXWithBorder(_nBorderSize);

					let _borderColor = pColorDefault.toString(),
						_borderStyle = _borders[0] || 'solid',
						_borderAlign = _borders[_borders.length - 1];

					if (_borders.length == 4 && _borders[2]) {
						_borderColor = _borders[2];
					} else if (_borders.length == 6) {
						_borderColor = String.format(
							'rgb({0}, {1}, {2})',
							_borders[2],
							_borders[3],
							_borders[4]
						);
					} else if (_borders.length == 7) {
						_borderColor = String.format(
							'rgba({0}, {1}, {2}, {4})',
							_borders[2],
							_borders[3],
							_borders[4],
							Number.isNumber(_borders[5]) ? Number.asNumber(_borders[5]) / 100 : 0
						);
					}

					if (_borderStyle == 'Flat') _borderStyle = 'solid';

					if (_borderStyle.toLowerCase() == 'none') {
						_css['border-style'] = _borderStyle;
						// _css['border'] = String.format("{0}px solid rgba(255,255,255,0)", _nBorderSize);
					} else {
						if (_borderAlign == 'Vertical') {
							_css['border-right-width'] = String.format('{0}px', _nBorderSize);
							_css['border-right-style'] = _borderStyle;
							_css['border-right-color'] = _borderColor;
							_css['border-bottom-width'] = String.format('{0}px', _nBorderSize);
							_css['border-bottom-style'] = _borderStyle;
							_css['border-bottom-color'] = 'rgba(255, 255, 255, 0)';
						} else if (_borderAlign == 'Horizontal') {
							_css['border-bottom-width'] = String.format('{0}px', _nBorderSize);
							_css['border-bottom-style'] = _borderStyle;
							_css['border-bottom-color'] = _borderColor;
							_css['border-right-width'] = String.format('{0}px', _nBorderSize);
							_css['border-right-style'] = _borderStyle;
							_css['border-right-color'] = 'rgba(255,255,255,0)';
						} else {
							_css['border-right-width'] = String.format('{0}px', _nBorderSize);
							_css['border-right-style'] = _borderStyle;
							_css['border-right-color'] = _borderColor;
							_css['border-bottom-width'] = String.format('{0}px', _nBorderSize);
							_css['border-bottom-style'] = _borderStyle;
							_css['border-bottom-color'] = _borderColor;
						}
					}

					break;

				case StyleElementFlags.Margins:
					let _margins = _zStyleValue.split(',');
					if (_margins == null || _margins.length != 4) break;

					_css['padding-left'] = +_margins[0] + CellPadding + 'px';
					_css['padding-right'] = +_margins[1] + CellPadding + 'px';
					_css['padding-top'] = +_margins[2] + CellPadding + 'px';
					_css['padding-bottom'] = +_margins[3] + CellPadding + 'px';

					break;
				case StyleElementFlags.WordWrap:
					if (
						BravoDataTypeConverter.convertValue(_zStyleValue, TypeCode.Boolean) == true
					) {
						_css['white-space'] = 'pre-wrap';
						_css['text-overflow'] = 'clip';
						_css['word-break'] = 'break-word';
					}
					break;
				case StyleElementFlags.LineHeight:
					/* if (_zFontSize && _zFontSize != _zStyleValue)
                        _css['line-height'] = _zFontSize;
                    else if (_zStyleValue)
                        _css['line-height'] = _zStyleValue */
					break;
				case StyleElementFlags.BackgroundImage:
					try {
						let _zValue = ExtensionsMethod.deserializebase64(_zStyleValue);
						let _imageData = String.format('"data:image/jpeg;base64,{0}"', _zValue);

						_css['background-image'] = 'url(' + _imageData + ')';
						_css['background-repeat'] = 'no-repeat';
						_css['background-size'] = String.format(
							'{0}%',
							(1 / devicePixelRatio) * 100
						);
					} catch (_ex) {
						console.info(_ex);
					}

					break;
				case StyleElementFlags.BackgroundImageLayout:
					let _imgAlign = ImageAlignEnum[_zStyleValue];

					// _css['background-size'] = '50%';

					switch (_imgAlign) {
						case ImageAlignEnum.Stretch:
							_css['background-size'] = '100%';
							break;
						case ImageAlignEnum.Scale:
							// delete _css['background-size'];
							_css['background-size'] = 'contain';
							_css['background-position'] = 'center center';

							break;
						case ImageAlignEnum.LeftTop:
							_css['background-position'] = 'left top';
							break;
						case ImageAlignEnum.CenterTop:
							_css['background-position'] = 'center top';
							break;
						case ImageAlignEnum.RightTop:
							_css['background-position'] = 'right top';
							break;
						case ImageAlignEnum.CenterBottom:
							_css['background-position'] = 'center bottom';
							break;
						case ImageAlignEnum.LeftBottom:
							_css['background-position'] = 'left bottom';
							break;
						case ImageAlignEnum.RightBottom:
							_css['background-position'] = 'right bottom';
							break;
						case ImageAlignEnum.CenterCenter:
							_css['background-position'] = 'center center';
							break;
						case ImageAlignEnum.LeftCenter:
							_css['background-position'] = 'left center';
							break;
						case ImageAlignEnum.RightCenter:
							_css['background-position'] = 'right center';
							break;
					}

					break;
			}
		}

		return _css;
	}

	public static buildAlignStyle(pzStyleValue: string, pbIsRtfCell: boolean = false) {
		let _zHTextAlign: string, _zVTextAlign: string;
		let _css = {};

		if (pzStyleValue.startsWith('Right')) {
			_zHTextAlign = 'flex-end';
			_css['text-align'] = 'right';
		} else if (pzStyleValue.startsWith('Center')) {
			_zHTextAlign = 'center';
			_css['text-align'] = 'center';
		} else {
			_zHTextAlign = 'flex-start';
			_css['text-align'] = 'left';
			// delete _css['text-align']
		}

		if (pzStyleValue.endsWith('Top')) _zVTextAlign = 'flex-start';
		else if (pzStyleValue.endsWith('Bottom')) _zVTextAlign = 'flex-end';
		else _zVTextAlign = 'center';

		if (!pbIsRtfCell) {
			_css['display'] = 'flex';
			_css['justify-content'] = _zHTextAlign;
			_css['align-items'] = _zVTextAlign;
		}

		return _css;
	}

	public static getStyle(row: wjg.Row): { name: string; style: CellStyle };
	public static getStyle(col: wjg.Column): { name: string; style: CellStyle };
	public static getStyle(item: any): { name: string; style: CellStyle } {
		if (item instanceof wjg.Row) {
			let _row = item;
			let _grid = _row.grid;
			if (_row.cssClass && _grid instanceof BravoWebGrid) {
				if (_row.cssClass.includes(CellStyleEnum[CellStyleEnum.GrandTotal]))
					return {
						name: CellStyleEnum[CellStyleEnum.GrandTotal],
						style: _grid.styles.get(CellStyleEnum.GrandTotal)
					};

				if (_row.cssClass.includes(CellStyleEnum[CellStyleEnum.Subtotal0]))
					return {
						name: CellStyleEnum[CellStyleEnum.Subtotal0],
						style: _grid.styles.get(CellStyleEnum.Subtotal0)
					};

				if (_row.cssClass.includes(CellStyleEnum[CellStyleEnum.Subtotal1]))
					return {
						name: CellStyleEnum[CellStyleEnum.Subtotal1],
						style: _grid.styles.get(CellStyleEnum.Subtotal1)
					};

				if (_row.cssClass.includes(CellStyleEnum[CellStyleEnum.Subtotal2]))
					return {
						name: CellStyleEnum[CellStyleEnum.Subtotal2],
						style: _grid.styles.get(CellStyleEnum.Subtotal2)
					};

				if (_row.cssClass.includes(CellStyleEnum[CellStyleEnum.Subtotal3]))
					return {
						name: CellStyleEnum[CellStyleEnum.Subtotal3],
						style: _grid.styles.get(CellStyleEnum.Subtotal3)
					};

				if (_row.cssClass.includes(CellStyleEnum[CellStyleEnum.Subtotal4]))
					return {
						name: CellStyleEnum[CellStyleEnum.Subtotal0],
						style: _grid.styles.get(CellStyleEnum.Subtotal5)
					};

				if (_row.cssClass.includes(CellStyleEnum[CellStyleEnum.Alternate]))
					return {
						name: CellStyleEnum[CellStyleEnum.Alternate],
						style: _grid.styles.get(CellStyleEnum.Alternate)
					};

				let _keys = _grid.styles.keys();
				for (const _key of _keys) {
					if (Number.isNumber(_key)) continue;

					if (_row.cssClass.includes(_key))
						return { name: _key, style: _grid.styles.get(_key) };
				}
			}
		}

		return null;
	}

	public clone() {
		let _keys = Object.keys(StyleElementFlags),
			_cs = new CellStyle();

		_keys.forEach((_key) => {
			if (this[_key]) _cs[_key] = this[_key];
		});

		return _cs;
	}

	public buildString(e?: StyleElementFlags) {
		if (!e) e = StyleElementFlags.All;

		let _zStyle = '';
		if (e & StyleElementFlags.TextAlign)
			_zStyle += this.getElement(StyleElementFlags.TextAlign);

		if (e & StyleElementFlags.ImageAlign)
			_zStyle += this.getElement(StyleElementFlags.ImageAlign);

		if (e & StyleElementFlags.WordWrap) _zStyle += this.getElement(StyleElementFlags.WordWrap);

		if (e & StyleElementFlags.BackColor)
			_zStyle += this.getElement(StyleElementFlags.BackColor);

		if (e & StyleElementFlags.ForeColor)
			_zStyle += this.getElement(StyleElementFlags.ForeColor);

		if (e & StyleElementFlags.Border) _zStyle += this.getElement(StyleElementFlags.Border);

		if (e & StyleElementFlags.Font) _zStyle += this.getElement(StyleElementFlags.Font);

		if (e & StyleElementFlags.Format) _zStyle += this.getElement(StyleElementFlags.Format);

		if (e & StyleElementFlags.UserData) _zStyle += this.getElement(StyleElementFlags.UserData);

		return _zStyle;
	}

	public mergeWith(pCellStyle: CellStyle) {
		if (!pCellStyle) return;

		let _props = Object.keys(pCellStyle);
		for (const _prop of _props) {
			let _zStyleSrc: string = pCellStyle[_prop],
				_zStyleDes: string = this[_prop];
			switch (StyleElementFlags[_prop]) {
				case StyleElementFlags.Font: {
					let _fontSrc = _zStyleSrc.split(','),
						_fontDes = _zStyleDes ? _zStyleDes.split(',') : new Array(_fontSrc.length);

					for (let _n = 0; _n < _fontSrc.length; _n++) {
						if (_fontSrc[_n] != _fontDes[_n] && _fontSrc[_n])
							_fontDes[_n] = _fontSrc[_n];
					}

					this[_prop] = _fontDes.join(',');

					break;
				}
				case StyleElementFlags.BackColor:
				case StyleElementFlags.ForeColor:
					if (_zStyleSrc != 'None') this[_prop] = _zStyleSrc;

					break;
				default: {
					if (_zStyleSrc != _zStyleDes) {
						this[_prop] = _zStyleSrc;
					}
				}
			}
		}
	}

	public static matchText(pzKey: string, pzStr: string) {
		let num = this.indexOfText(pzStr, pzKey + ':');
		if (num < 0) return null;

		num += pzKey.length;
		let num2 = this.indexOfText(pzStr, ';', num);
		if (num2 < 0) return null;

		pzStr = pzStr.substr(num + 1, num2 - num - 1);
		if (pzStr.length > 1 && pzStr.startsWith('"') && pzStr.endsWith('"')) {
			pzStr = pzStr.substr(1, pzStr.length - 2);
			pzStr = pzStr.replace('""', '"');
		}

		return pzStr;
	}

	public static indexOfText(pzSource: string, pzSearch: string, pnPos: number = 0) {
		let _i;
		for (
			_i = pzSource.indexOf(pzSearch, pnPos);
			_i > -1;
			_i = pzSource.indexOf(pzSearch, _i + 1)
		) {
			let _flag = false;
			for (let _j = 0; _j < _i; _j++) if (pzSource[_j] == `"`) _flag = !_flag;

			if (!_flag) break;
		}

		return _i;
	}

	private getElement(e: StyleElementFlags): string {
		let _zKey = StyleElementFlags[e],
			_zValue = this[_zKey];

		return !String.isNullOrEmpty(_zValue) ? String.format('{0}:{1};', _zKey, _zValue) : '';
	}
}

export class StyleElementMatch {
	constructor(m: RegExpMatchArray) {
		this._m = m;
	}

	public get element(): StyleElementFlags {
		if (String.isNullOrEmpty(this.zElementName)) return StyleElementFlags.None;
		return StyleElementFlags[this.zElementName];
	}

	public get zElementName(): string {
		if (this._m == null || this._m.groups['name'] == null) return String.empty;

		return this._m.groups['name'];
	}

	public get zElementValue(): string {
		if (this._m == null || this._m.groups['value'] == null) return String.empty;

		return this._m.groups['value'];
	}

	public get zElementString(): string {
		return this._m ? this._m.input : String.empty;
	}

	public get nStartIndex(): number {
		return this._m ? this._m.index : -1;
	}

	private _m: RegExpMatchArray;

	public get match(): RegExpMatchArray {
		return this._m;
	}
}

export class DynamicStyleItem {
	public zColumnList: string;
	public Name: string;
	public zStyleExpr: string;

	public constructor(pzName: string, pzStyleExpr: string, pzColumnList: string) {
		this.Name = pzName;
		this.zStyleExpr = pzStyleExpr;
		this.zColumnList = pzColumnList;
	}
}

export class BravoFormatItemEventArgs extends wjg.FormatItemEventArgs {
	private _image: HTMLElement | string;

	public get image(): HTMLElement | string {
		return this._image;
	}

	public set image(value: HTMLElement | string) {
		this._image = value;
	}

	private _html: string;

	public get html(): string {
		return this._html;
	}

	public set html(value: string) {
		this._html = value;
	}

	private _bAppendHtml: boolean = false;

	public get bAppendHtml(): boolean {
		return this._bAppendHtml;
	}

	public set bAppendHtml(v: boolean) {
		this._bAppendHtml = v;
	}

	private _cellStyle: CellStyle;

	public get cellStyle(): CellStyle {
		return this._cellStyle;
	}

	public set cellStyle(value: CellStyle) {
		this._cellStyle = value;
	}

	private _classStyle: Array<string>;

	public get classStyle(): Array<string> {
		if (this._classStyle == null) this._classStyle = new Array();

		return this._classStyle;
	}

	public set classStyle(value: Array<string>) {
		this._classStyle = value;
	}

	public static reset(e: BravoFormatItemEventArgs) {
		if (!e) return;

		e.bAppendHtml = e.cancel = false;
		e.html = undefined;
		e.image = undefined;
		e.classStyle = undefined;
		e.cellStyle = undefined;
	}
}

export class RaiseOwnerDrawCellEventArgs extends BravoFormatItemEventArgs {
	public multilineCellEventArgs: wjg.FormatItemEventArgs = null;

	public culture: any;

	constructor(panel: GridPanel, range: wjg.CellRange, cell: HTMLElement) {
		super(panel, range, cell);
	}
}

export class BravoGroupRow extends wjg.GroupRow {
	getCellRange() {
		let _bravoGrid = this.grid instanceof BravoWebGrid ? this.grid : null;
		if (_bravoGrid && _bravoGrid.isTreeNodeMode()) {
			let rows = this._list,
				top = this.index,
				bottom = rows.length - 1;
			for (let r = top + 1; r <= bottom; r++) {
				let gr = wjc.tryCast(rows[r], wjg.GroupRow);
				if (gr != null && gr.level <= this.level) {
					bottom = r - 1;
					break;
				}
			}
			return new wjg.CellRange(top, 0, bottom, this.grid.columns.length - 1);
		}

		return super.getCellRange();
	}
}

export class CustomOwnerDrawCellEventArgs extends BravoFormatItemEventArgs {
	public readonly bIsFixedCell: boolean;
	public readonly cellType: GridCellTypeEnum;
	public readonly bIsButtonCell: boolean;
	public readonly bIsAddNewRow: boolean;
	public readonly bIsFocusedCell: boolean;
	public readonly bIsHighlightCell: boolean;
	public readonly bIsColGroupCell: boolean;
	public readonly bIsTreeNodeCell: boolean;
	public readonly nCellIndent: number;
	public readonly bIsMultilineCell: boolean;

	constructor(
		p: GridPanel,
		rng: wjg.CellRange,
		cell: HTMLElement,
		pbIsFixedCell: boolean,
		pCellType: GridCellTypeEnum,
		pCellStyle: CellStyle,
		pbIsButtonCell: boolean,
		pbIsAddNewRow: boolean,
		pbIsFocusedCell: boolean,
		pbIsHighlightCell: boolean,
		pbIsColGroupCell: boolean,
		pbIsTreeNodeCell: boolean,
		pnCellIndent: number,
		pbIsMultilineCell: boolean,
		classStyle: Array<string>
	) {
		super(p, rng, cell);

		this.bIsFixedCell = pbIsFixedCell;
		this.cellType = pCellType;
		this.cellStyle = pCellStyle;
		this.bIsButtonCell = pbIsButtonCell;
		this.bIsAddNewRow = pbIsAddNewRow;
		this.bIsFocusedCell = pbIsFocusedCell;
		this.bIsHighlightCell = pbIsHighlightCell;
		this.bIsColGroupCell = pbIsColGroupCell;
		this.bIsTreeNodeCell = pbIsTreeNodeCell;
		this.nCellIndent = pnCellIndent;
		this.bIsMultilineCell = pbIsMultilineCell;
		this.classStyle = classStyle;
	}
}

export class StyleCssData {
	public readonly cellType: wjg.CellType;

	public readonly data: any;

	constructor(cellType: wjg.CellType, data: any) {
		this.cellType = cellType;
		this.data = data;
	}
}

export class DrawCellInfo {
	public readonly classStyle: Array<string>;
	public readonly styleCss: any;

	constructor(style?: Array<string>, css?: any) {
		this.classStyle = style || new Array();
		this.styleCss = css || {};
	}
}

class CustomKeyboardHandler {
	private _g: BravoWebGrid;

	constructor(g: BravoWebGrid) {
		this._g = g;
		const _host = g.hostElement;
		g.addEventListener(_host, 'keydown', this._keydown.bind(this));
	}

	private _keydown(e: KeyboardEvent) {
		const _g = this._g,
			_modifier = e.altKey || e.ctrlKey || e.shiftKey;

		let _bLastCol = _g.selection.col == _g.columns.length - 1,
			_bLastCell =
				_g.selection.row == _g.rows.length - 1 && _g.selection.col == _g.columns.length - 1,
			_col = <wjg.Column>_g.columns[_g.selection.col];

		if (_g.bHandleEnterKeyEdit && e.keyCode == wjc.Key.Enter && !_modifier) {
			if (this._performKeyAction(_g.keyActionEnter)) e.preventDefault();
			else if (
				!_g.canEditCell(_g.selection.row, _g.selection.col) &&
				_g.selection.isValid &&
				_g.selection.row == _g.rows.length - 1 &&
				_g.selection.col == _g.columns.length - 1
			) {
				_g.onLostGridEditing.raise(_g, new wjc.Event());
			} else if (
				(_bLastCol && _col.isReadOnly) ||
				(!_bLastCell && _bLastCol && !_col.isReadOnly)
			) {
				let _ecv = _g.editableCollectionView;

				if (_ecv && _ecv.currentEditItem) {
					_ecv.commitEdit();
				}
			}
		}
	}

	private _performKeyAction(action: wjg.KeyAction) {
		const _g = <BravoWebGrid>this._g;
		const _bStartEdit = _g.bIsEditing == null || _g.bIsEditing;
		if (
			_g.selection.isValid &&
			_g.canEditCell(_g.selection.row, _g.selection.col) &&
			_bStartEdit
		) {
			_g.startEditing(true, _g.selection.row, _g.selection.col);
			return true;
		}
	}
}

class BravoDirectiveCellFactory extends wjg.CellFactory {
	private _baseCf: wjg.CellFactory;

	constructor(grid: wjg.FlexGrid) {
		super();

		this._baseCf = grid.cellFactory;

		grid.cellFactory = this;
	}

	public updateCell(
		panel: wjg.GridPanel,
		rowIndex: number,
		colIndex: number,
		cell: HTMLElement,
		rng?: wjg.CellRange
	) {
		this._baseCf.updateCell(panel, rowIndex, colIndex, cell, rng);

		if (panel.cellType == wjg.CellType.Cell && panel.grid.itemsSource) {
			const _nFirstVisible = panel.columns.firstVisibleIndex;

			const _col = panel.grid.columns[colIndex];
			if (!_col) return;

			const _groupRow = wjc.tryCast(panel.rows[rowIndex], wjg.GroupRow) as wjg.GroupRow;
			const _g = wjc.tryCast(panel.grid, BravoWebGrid) as BravoWebGrid;
			if (
				_groupRow &&
				_groupRow.hasChildren &&
				_g &&
				_g.treeColumnPos != _nFirstVisible &&
				colIndex == _nFirstVisible
			) {
				if (_g.isTreeNodeMode()) return;

				const _gr =
					_groupRow.dataItem instanceof wjc.CollectionViewGroup
						? _groupRow.dataItem
						: null;
				cell.textContent =
					_col.aggregate == wjc.Aggregate.None
						? String.empty
						: BravoGlobalize.format(
								wjc.getAggregate(_col.aggregate, _gr?.items, _col.binding),
								_col.format
						  );
			}

			if (_groupRow) {
				const _cellType = _g.getCellType(panel, rowIndex, colIndex);
				const _bIsGrandTotalCell =
					_g.bAllowGrandTotal &&
					_groupRow.cssClass &&
					_groupRow.cssClass.includes(CellStyleEnum[CellStyleEnum.GrandTotal]);
				if (
					!_bIsGrandTotalCell &&
					_cellType == GridCellTypeEnum.Normal &&
					_g.isExpressionColumn(colIndex) &&
					!_g.isFunctionExpressionColumn(colIndex)
				) {
					const _col: wjg.Column = panel.columns[colIndex];
					if (_col)
						cell.textContent = BravoGlobalize.format(
							_groupRow.dataItem[_col.binding],
							_col.format
						);
				}
			}
		}
	}

	public disposeCell(cell: HTMLElement) {
		this._baseCf.disposeCell(cell);
	}

	public getEditorValue(g: wjg.FlexGrid) {
		return this._baseCf.getEditorValue(g);
	}
}

function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight, pbScale: boolean) {
	var ratio = pbScale
		? Math.min(maxWidth / srcWidth, maxHeight / srcHeight)
		: Math.max(maxWidth / srcWidth, maxHeight / srcHeight);

	return { width: srcWidth * ratio, height: srcHeight * ratio };
}

function _isNativeCheckbox(pGrid: BravoWebGrid, edt: any): boolean {
	return (
		edt instanceof HTMLInputElement && // input element
		edt.type == 'checkbox' && // checkbox
		!edt.disabled &&
		!edt.readOnly && // editable (TFS 257521)
		wjc.hasClass(edt, 'wj-cell-check') && // default check editor (TFS 221442)
		wjc.closest(edt, '.wj-flexgrid') == pGrid.hostElement
	); // this grid (TFS 223806)
}
