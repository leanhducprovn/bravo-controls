export enum ImageValueEnum {
	ByteArray = 0,
	Base64String = 2,
	FileLocation = 3
}

export enum CellStyleEnum {
	Normal = 0,
	Alternate = 1,
	Fixed = 2,
	Highlight = 3,
	Focus = 4,
	Editor = 5,
	Search = 6,
	Frozen = 7,
	FrozenAlternate = 8,
	NewRow = 9,
	EmptyArea = 10,
	SelectedColumnHeader = 11,
	SelectedRowHeader = 12,
	GrandTotal = 13,
	Subtotal0 = 14,
	Subtotal1 = 15,
	Subtotal2 = 16,
	Subtotal3 = 17,
	Subtotal4 = 18,
	Subtotal5 = 19,
	FilterEditor = 20,
	FirstCustomStyle = 21,
	RowHeader = 22,
	NullStyle = 23,
	NoCaptionColumn = 24
}

/// <summary>
/// Enum of autotext modes for cell content
/// </summary>
export enum GridAutoTextContentEnum {
	/// <summary>
	/// Keep original content
	/// </summary>
	None,

	/// <summary>
	/// Translate autotext for fixed cells only
	/// </summary>
	Fixed,

	/// <summary>
	/// Translate autotext for non-fixed cells only
	/// </summary>
	NonFixed,

	/// <summary>
	/// Translate autotext for all cells
	/// </summary>
	All
}

/// <summary>
/// Enum of row types to auto fit height
/// </summary>
export enum GridAutoFitRowHeightEnum {
	/// <summary>
	/// Not auto fit height
	/// </summary>
	None,

	/// <summary>
	/// Fixed rows only
	/// </summary>
	Fixed,

	/// <summary>
	/// Non-fixed rows only
	/// </summary>
	NonFixed,

	/// <summary>
	/// All rows
	/// </summary>
	All
}

export enum AnchorStyles {
	//
	// Summary:
	//     The control is not anchored to any edges of its container.
	None = 0,
	//
	// Summary:
	//     The control is anchored to the top edge of its container.
	Top = 1,
	//
	// Summary:
	//     The control is anchored to the bottom edge of its container.
	Bottom = 2,
	//
	// Summary:
	//     The control is anchored to the left edge of its container.
	Left = 4,
	//
	// Summary:
	//     The control is anchored to the right edge of its container.
	Right = 8
}

export enum DockStyle {
	None = 0,
	Top = 1,
	Bottom = 2,
	Left = 3,
	Right = 4,
	Fill = 5
}

export enum GridDataCellEnum {
	None = 0,
	Bound = 1,
	Unbound = 2,
	Both = 3
}

export enum RowHeaderNumberingEnum {
	None,
	DataOnly,
	All
}

export enum ScrollBars {
	//
	// Summary:
	//     No scroll bars are shown.
	None = 0,
	//
	// Summary:
	//     Only horizontal scroll bars are shown.
	Horizontal = 1,
	//
	// Summary:
	//     Only vertical scroll bars are shown.
	Vertical = 2,
	//
	// Summary:
	//     Both horizontal and vertical scroll bars are shown.
	Both = 3
}

export enum SizeType {
	AutoSize = 0,
	Absolute = 1,
	Percent = 2
}

export enum StyleElementFlags {
	None = 0,
	Font = 1,
	BackColor = 2,
	ForeColor = 4,
	Margins = 8,
	Border = 16,
	TextAlign = 32,
	TextEffect = 64,
	ImageAlign = 128,
	ImageSpacing = 256,
	Trimming = 512,
	WordWrap = 1024,
	Display = 2048,
	Format = 4096,
	EditMask = 8192,
	ComboList = 16384,
	ImageMap = 32768,
	DataType = 65536,
	DataMap = 131072,
	TextDirection = 262144,
	Editor = 524288,
	UserData = 1048576,
	BackgroundImage = 2097152,
	BackgroundImageLayout = 4194304,
	LineHeight = 8388608,
	All = 16777215
}

export enum BravoApplicationCommandActionEnum {
	/// <summary>
	/// Default handle
	/// </summary>
	DefaultHandle,

	/// <summary>
	/// Custom handle, ignore default handle
	/// </summary>
	CustomHandle,

	/// <summary>
	/// Not handle
	/// </summary>
	Cancel
}

export enum MergeAction {
	//
	// Summary:
	//     Appends the item to the end of the collection, ignoring match results.
	Append = 0,
	//
	// Summary:
	//     Inserts the item to the target's collection immediately preceding the matched
	//     item. A match of the end of the list results in the item being appended to the
	//     list. If there is no match or the match is at the beginning of the list, the
	//     item is inserted at the beginning of the collection.
	Insert = 1,
	//
	// Summary:
	//     Replaces the matched item with the source item. The original item's drop-down
	//     items do not become children of the incoming item.
	Replace = 2,
	//
	// Summary:
	//     Removes the matched item.
	Remove = 3,
	//
	// Summary:
	//     A match is required, but no action is taken. Use this for tree creation and successful
	//     access to nested layouts.
	MatchOnly = 4
}

//#region Enum Chart
export enum AutoLabelEnum {
	Never,
	Always,
	Automatic
}

export enum AutoColorEnum {
	None = 0,
	ForeColor = 1,
	BackColor = 2
}

export enum ColorPaletteEnum {
	Custom = -1,
	CopyCurrentToCustom = -2,
	Standard = 0,
	Office = 1,
	GrayScale = 2,
	Apex = 3,
	Aspect = 4,
	Civic = 5,
	Concourse = 6,
	Equity = 7,
	Flow = 8,
	Foundry = 9,
	Median = 10,
	Metro = 11,
	Module = 12,
	Opulent = 13,
	Oriel = 14,
	Origin = 15,
	Paper = 16,
	Solstice = 17,
	Technic = 18,
	Trek = 19,
	Urban = 20,
	Verve = 21
}

export enum CompassEnum {
	North = 0,
	South = 1,
	East = 2,
	West = 3,
	Radial = 8,
	Orthogonal = 9
}

export enum LabelCompassEnum {
	North = 0,
	NorthEast = 1,
	East = 2,
	SouthEast = 3,
	South = 4,
	SouthWest = 5,
	West = 6,
	NorthWest = 7,
	Radial = 8,
	Orthogonal = 9,
	Auto = 10,
	RadialText = 11
}

export enum Palettes {
	Standard,
	Cocoa,
	Coral,
	Drank,
	HighContrast,
	Light,
	Midnight,
	Modern,
	Organic,
	Slate,
	Zen,
	Cyborg,
	Superhero,
	Flatly,
	Darkly,
	Cerulan,
	Custom
}

export enum Chart2DTypeEnum {
	XYPlot = 0,
	Pie = 1,
	Bar = 2,
	Area = 3,
	Polar = 4,
	Radar = 5,
	Bubble = 6,
	HiLo = 7,
	HiLoOpenClose = 8,
	Candle = 9,
	Gantt = 10,
	Step = 11,
	Histogram = 12,
	Scatter = 13,
	Column = 14,
	Spline = 15,
	SplineArea = 16,
	SplineSymbols = 17
}

export enum AxisXValueLabelEnum {
	Manual,
	ByDataXMember,
	ByDataTextMember
}

export enum StringAlignment {
	Near,
	Center,
	Far
}
//#endregion Enum Chart

export enum BarCodeTypeEnum {
	None = 0,
	Ansi39 = 1,
	Ansi39x = 2,
	Code_2_of_5 = 3,
	Code25intlv = 4,
	Matrix_2_of_5 = 5,
	Code39 = 6,
	Code39x = 7,
	Code_128_A = 8,
	Code_128_B = 9,
	Code_128_C = 10,
	Code_128auto = 11,
	Code_93 = 12,
	Code93x = 13,
	MSI = 14,
	PostNet = 15,
	Codabar = 16,
	EAN_8 = 17,
	EAN_13 = 18,
	UPC_A = 19,
	UPC_E0 = 20,
	UPC_E1 = 21,
	RM4SCC = 22,
	UCCEAN128 = 23,
	QRCode = 24,
	Code49 = 25,
	JapanesePostal = 26,
	Pdf417 = 27,
	EAN128FNC1 = 28,
	RSS14 = 29,
	RSS14Truncated = 30,
	RSS14Stacked = 31,
	RSS14StackedOmnidirectional = 32,
	RSSExpanded = 33,
	RSSExpandedStacked = 34,
	RSSLimited = 35,
	DataMatrix = 36,
	MicroPDF417 = 37,
	IntelligentMail = 64
}

export enum Cursors {
	AppStarting = ' progress',
	PanSW = '',
	PanSouth = '',
	PanSE = '',
	PanNW = '',
	PanNorth = '',
	PanNE = '',
	PanEast = '',
	NoMoveVert = '',
	NoMoveHoriz = '',
	NoMove2D = 'move',
	VSplit = 'col-resize',
	HSplit = 'row-resize',
	Help = 'help',
	WaitCursor = 'wait',
	UpArrow = '',
	SizeWE = 'e-resize',
	SizeNWSE = 'nw-resize',
	SizeNS = 'n-resize',
	SizeNESW = 'ne-resize',
	SizeAll = 'all-scroll',
	No = 'no-drop',
	IBeam = '',
	Default = 'default',
	Cross = '',
	Arrow = '',
	PanWest = '',
	Hand = 'pointer'
}

export enum ProgressBarEnum {
	Loading = 0,
	Percent = 1
}

export enum LookupStatusEnum {
	Default,
	EnterToSearch,
	Searching,
	Loading,
	NoMatchedValue,
	SearchError
}

export enum GridCellTypeEnum {
	/// <summary>
	/// Non-determined cell
	/// </summary>
	None,

	/// <summary>
	/// Normal cell
	/// </summary>
	Normal,

	/// <summary>
	/// Check cell
	/// </summary>
	Check,

	/// <summary>
	/// Image cell
	/// </summary>
	img,

	/// <summary>
	/// HTML cell
	/// </summary>
	html,

	/// <summary>
	/// RTF cell
	/// </summary>
	rtf,

	/// <summary>
	/// Barcode cell
	/// </summary>
	barcode,

	/// <summary>
	/// Quick response barcode
	/// </summary>
	qrcode,

	/// <summary>
	/// Progress bar
	/// </summary>
	progress,

	/// <summary>
	/// Link
	/// </summary>
	link
}

export enum RestrictedColumnEnum {
	None = 0,
	NoAddNew = 1,
	NoEdit = 2,
	NoEditDOU = 4,
	NoOpen = 8,
	NoOpenDOU = 16
}

export enum Border3DSide {
	Left = 1,
	Top = 2,
	Right = 4,
	Bottom = 8,
	Middle = 2048,
	All = 2063
}

export enum SubtotalPositionEnum {
	AboveData = 0,
	BelowData = 1
}

export enum GridCountGroupChildEnum {
	/// <summary>
	/// Not counting and displaying
	/// </summary>
	Hide = 0,

	/// <summary>
	/// Counting and displaying total of child groups only
	/// </summary>
	GroupOnly = 1,

	/// <summary>
	/// Counting and displaying total of child data only
	/// </summary>
	DataOnly = 2,

	/// <summary>
	/// Counting and displaying total of all childs only
	/// </summary>
	All = 3
}

export enum GridBuiltInContextMenuEnum {
	/// <summary>
	/// No built-in context menu (be negated by any other value)
	/// </summary>
	None = 0,

	/// <summary>
	/// Built-in context menu for row header
	/// </summary>
	ContextMenuForRowHeader = 1,

	/// <summary>
	/// Built-in context menu for column header
	/// </summary>
	ContextMenuForColHeader = 2,

	/// <summary>
	/// Built-in context menu for node
	/// </summary>
	ContextMenuForNode = 4,

	/// <summary>
	/// Built-in context menu for top-left fixed cells
	/// </summary>
	ContextMenuForGridHeader = 8,

	/// <summary>
	/// Auto detected context menu (combine all)
	/// </summary>
	Automatic = 15
}

export enum GlyphTypeEnum {
	CircleChevron,
	CircleChevronDown,
	CircleChevronUp,
	CircleChevronLeft,
	CircleChevronRight,
	Chevron,
	ChevronDown,
	ChevronUp,
	ChevronLeft,
	ChevronRight
}

export enum HeaderGlyphEnum {
	Off = 0,
	Left = 1,
	Right = 2,
	LeftWithSeparator = 3,
	RightWithSeparator = 4
}

export enum ArrowDirection {
	//
	// Summary:
	//     The direction is left (System.Windows.Forms.Orientation.Horizontal).
	Left = 0,
	//
	// Summary:
	//     The direction is up (System.Windows.Forms.Orientation.Vertical).
	Up = 1,
	//
	// Summary:
	//     The direction is right (System.Windows.Forms.Orientation.Horizontal).
	Right = 16,
	//
	// Summary:
	//     The direction is down (System.Windows.Forms.Orientation.Vertical).
	Down = 17
}

export enum ContentAlignment {
	//
	// Summary:
	//     Content is vertically aligned at the top, and horizontally aligned on the left.
	TopLeft = 1,
	//
	// Summary:
	//     Content is vertically aligned at the top, and horizontally aligned at the center.
	TopCenter = 2,
	//
	// Summary:
	//     Content is vertically aligned at the top, and horizontally aligned on the right.
	TopRight = 4,
	//
	// Summary:
	//     Content is vertically aligned in the middle, and horizontally aligned on the
	//     left.
	MiddleLeft = 16,
	//
	// Summary:
	//     Content is vertically aligned in the middle, and horizontally aligned at the
	//     center.
	MiddleCenter = 32,
	//
	// Summary:
	//     Content is vertically aligned in the middle, and horizontally aligned on the
	//     right.
	MiddleRight = 64,
	//
	// Summary:
	//     Content is vertically aligned at the bottom, and horizontally aligned on the
	//     left.
	BottomLeft = 256,
	//
	// Summary:
	//     Content is vertically aligned at the bottom, and horizontally aligned at the
	//     center.
	BottomCenter = 512,
	//
	// Summary:
	//     Content is vertically aligned at the bottom, and horizontally aligned on the
	//     right.
	BottomRight = 1024
}

export enum StepStatusEnum {
	None = 0,
	Current = 1,
	Completed = 2
}

export enum StepStateEnum {
	Default,
	Begin,
	Running,
	Cancelling,
	Error,
	Warning,
	Success
}

export enum GridBorderStyle {
	Solid = 0,
	Dash = 1,
	DashDot = 2,
	DashDotDot = 3,
	Dot = 4,
	Double = 5,
	None = 6
}

export enum AllowMergingEnum {
	None = 0,
	Free = 1,
	RestrictRows = 2,
	RestrictCols = 3,
	RestrictAll = 4,
	FixedOnly = 5,
	Spill = 6,
	Nodes = 7,
	Custom = 8,
	Default = 9
}

export enum CharacterCasing {
	//
	// Summary:
	//     The case of characters is left unchanged.
	Normal = 0,
	//
	// Summary:
	//     Converts all characters to uppercase.
	Upper = 1,
	//
	// Summary:
	//     Converts all characters to lowercase.
	Lower = 2
}

export enum BravoAutoCorrectEnum {
	None = 0,
	CapitalizeFirstLetter = 1,
	CapitalizeTitle = 2
}

export enum StyleTextImageAlign {
	LeftTop = 0,
	LeftCenter = 1,
	LeftBottom = 2,
	CenterTop = 3,
	CenterCenter = 4,
	CenterBottom = 5,
	RightTop = 6,
	RightCenter = 7,
	RightBottom = 8,
	GeneralTop = 9,
	GeneralCenter = 10,
	GeneralBottom = 11
}

export enum ImageAlignEnum {
	LeftTop = 0,
	LeftCenter = 1,
	LeftBottom = 2,
	CenterTop = 3,
	CenterCenter = 4,
	CenterBottom = 5,
	RightTop = 6,
	RightCenter = 7,
	RightBottom = 8,
	Scale = 9,
	Stretch = 10,
	Tile = 11,
	Hide = 12,
	TileStretch = 13
}

export enum StyleDisplay {
	None = 0,
	TextOnly = 1,
	ImageOnly = 2,
	Overlay = 3,
	Stack = 4
}

export enum SortFlags {
	None = 0,
	Ascending = 1,
	Descending = 2,
	AsDisplayed = 4,
	IgnoreCase = 8,
	UseColSort = 16
}

export enum TextDirectionEnum {
	Normal = 0,
	Up = 1,
	Down = 2
}

export enum ToolStripTextDirection {
	Inherit = 0,
	//
	// Summary:
	//     Specifies horizontal text orientation.
	Horizontal = 1,
	//
	// Summary:
	//     Specifies that text is to be rotated 90 degrees.
	Vertical90 = 2,
	//
	// Summary:
	//     Specifies that text is to be rotated 270 degrees.
	Vertical270 = 3
}

export enum ToolStripLayoutStyle {
	StackWithOverflow = 0,
	HorizontalStackWithOverflow = 1,
	VerticalStackWithOverflow = 2,
	Flow = 3,
	Table = 4
}

export enum ScrollOrientation {
	Horizontal = 0,
	Vertical = 1
}

export enum PrintStateEnum {
	None = 0,
	Cancel = 1,
	HasError = 2,
	HasDocument = 4,
	DocumentReady = 8,
	AfterPrint = 16
}

export enum PrintTrackingEnum {
	None,
	FirstPrint,
	RePrint
}

export enum PrintJobTypeEnum {
	/// <summary>
	/// Nothing
	/// </summary>
	None,

	/// <summary>
	/// Return a layout of report
	/// </summary>
	GetReportLayout,

	/// <summary>
	/// Return a report
	/// </summary>
	GetReport,

	/// <summary>
	/// Return a sample report
	/// </summary>
	GetReportSample,

	/// <summary>
	/// Print preview
	/// </summary>
	PrintPreview,

	/// <summary>
	/// Quick print
	/// </summary>
	QuickPrint,

	/// <summary>
	/// Cancel
	/// </summary>
	Cancel
}

export enum PrintSavingEnum {
	/// <summary>
	/// Save as file
	/// </summary>
	File,

	/// <summary>
	/// Save as image
	/// </summary>
	Image,

	/// <summary>
	/// Save as pdf file
	/// </summary>
	PdfFile
}

export enum ReportUnit {
	Centimeters = 0,
	HundredthsOfInch = 1,
	Inches = 2,
	Millimeters = 3
}

export enum PaperKind {
	//
	// Summary:
	//     The paper size is defined by the user.
	Custom = 0,
	//
	// Summary:
	//     Letter paper (8.5 in. by 11 in.).
	Letter = 1,
	//
	// Summary:
	//     Letter small paper (8.5 in. by 11 in.).
	LetterSmall = 2,
	//
	// Summary:
	//     Tabloid paper (11 in. by 17 in.).
	Tabloid = 3,
	//
	// Summary:
	//     Ledger paper (17 in. by 11 in.).
	Ledger = 4,
	//
	// Summary:
	//     Legal paper (8.5 in. by 14 in.).
	Legal = 5,
	//
	// Summary:
	//     Statement paper (5.5 in. by 8.5 in.).
	Statement = 6,
	//
	// Summary:
	//     Executive paper (7.25 in. by 10.5 in.).
	Executive = 7,
	//
	// Summary:
	//     A3 paper (297 mm by 420 mm).
	A3 = 8,
	//
	// Summary:
	//     A4 paper (210 mm by 297 mm).
	A4 = 9,
	//
	// Summary:
	//     A4 small paper (210 mm by 297 mm).
	A4Small = 10,
	//
	// Summary:
	//     A5 paper (148 mm by 210 mm).
	A5 = 11,
	//
	// Summary:
	//     B4 paper (250 mm by 353 mm).
	B4 = 12,
	//
	// Summary:
	//     B5 paper (176 mm by 250 mm).
	B5 = 13,
	//
	// Summary:
	//     Folio paper (8.5 in. by 13 in.).
	Folio = 14,
	//
	// Summary:
	//     Quarto paper (215 mm by 275 mm).
	Quarto = 15,
	//
	// Summary:
	//     Standard paper (10 in. by 14 in.).
	Standard10x14 = 16,
	//
	// Summary:
	//     Standard paper (11 in. by 17 in.).
	Standard11x17 = 17,
	//
	// Summary:
	//     Note paper (8.5 in. by 11 in.).
	Note = 18,
	//
	// Summary:
	//     #9 envelope (3.875 in. by 8.875 in.).
	Number9Envelope = 19,
	//
	// Summary:
	//     #10 envelope (4.125 in. by 9.5 in.).
	Number10Envelope = 20,
	//
	// Summary:
	//     #11 envelope (4.5 in. by 10.375 in.).
	Number11Envelope = 21,
	//
	// Summary:
	//     #12 envelope (4.75 in. by 11 in.).
	Number12Envelope = 22,
	//
	// Summary:
	//     #14 envelope (5 in. by 11.5 in.).
	Number14Envelope = 23,
	//
	// Summary:
	//     C paper (17 in. by 22 in.).
	CSheet = 24,
	//
	// Summary:
	//     D paper (22 in. by 34 in.).
	DSheet = 25,
	//
	// Summary:
	//     E paper (34 in. by 44 in.).
	ESheet = 26,
	//
	// Summary:
	//     DL envelope (110 mm by 220 mm).
	DLEnvelope = 27,
	//
	// Summary:
	//     C5 envelope (162 mm by 229 mm).
	C5Envelope = 28,
	//
	// Summary:
	//     C3 envelope (324 mm by 458 mm).
	C3Envelope = 29,
	//
	// Summary:
	//     C4 envelope (229 mm by 324 mm).
	C4Envelope = 30,
	//
	// Summary:
	//     C6 envelope (114 mm by 162 mm).
	C6Envelope = 31,
	//
	// Summary:
	//     C65 envelope (114 mm by 229 mm).
	C65Envelope = 32,
	//
	// Summary:
	//     B4 envelope (250 mm by 353 mm).
	B4Envelope = 33,
	//
	// Summary:
	//     B5 envelope (176 mm by 250 mm).
	B5Envelope = 34,
	//
	// Summary:
	//     B6 envelope (176 mm by 125 mm).
	B6Envelope = 35,
	//
	// Summary:
	//     Italy envelope (110 mm by 230 mm).
	ItalyEnvelope = 36,
	//
	// Summary:
	//     Monarch envelope (3.875 in. by 7.5 in.).
	MonarchEnvelope = 37,
	//
	// Summary:
	//     6 3/4 envelope (3.625 in. by 6.5 in.).
	PersonalEnvelope = 38,
	//
	// Summary:
	//     US standard fanfold (14.875 in. by 11 in.).
	USStandardFanfold = 39,
	//
	// Summary:
	//     German standard fanfold (8.5 in. by 12 in.).
	GermanStandardFanfold = 40,
	//
	// Summary:
	//     German legal fanfold (8.5 in. by 13 in.).
	GermanLegalFanfold = 41,
	//
	// Summary:
	//     ISO B4 (250 mm by 353 mm).
	IsoB4 = 42,
	//
	// Summary:
	//     Japanese postcard (100 mm by 148 mm).
	JapanesePostcard = 43,
	//
	// Summary:
	//     Standard paper (9 in. by 11 in.).
	Standard9x11 = 44,
	//
	// Summary:
	//     Standard paper (10 in. by 11 in.).
	Standard10x11 = 45,
	//
	// Summary:
	//     Standard paper (15 in. by 11 in.).
	Standard15x11 = 46,
	//
	// Summary:
	//     Invitation envelope (220 mm by 220 mm).
	InviteEnvelope = 47,
	//
	// Summary:
	//     Letter extra paper (9.275 in. by 12 in.). This value is specific to the PostScript
	//     driver and is used only by Linotronic printers in order to conserve paper.
	LetterExtra = 50,
	//
	// Summary:
	//     Legal extra paper (9.275 in. by 15 in.). This value is specific to the PostScript
	//     driver and is used only by Linotronic printers in order to conserve paper.
	LegalExtra = 51,
	//
	// Summary:
	//     Tabloid extra paper (11.69 in. by 18 in.). This value is specific to the PostScript
	//     driver and is used only by Linotronic printers in order to conserve paper.
	TabloidExtra = 52,
	//
	// Summary:
	//     A4 extra paper (236 mm by 322 mm). This value is specific to the PostScript driver
	//     and is used only by Linotronic printers to help save paper.
	A4Extra = 53,
	//
	// Summary:
	//     Letter transverse paper (8.275 in. by 11 in.).
	LetterTransverse = 54,
	//
	// Summary:
	//     A4 transverse paper (210 mm by 297 mm).
	A4Transverse = 55,
	//
	// Summary:
	//     Letter extra transverse paper (9.275 in. by 12 in.).
	LetterExtraTransverse = 56,
	//
	// Summary:
	//     SuperA/SuperA/A4 paper (227 mm by 356 mm).
	APlus = 57,
	//
	// Summary:
	//     SuperB/SuperB/A3 paper (305 mm by 487 mm).
	BPlus = 58,
	//
	// Summary:
	//     Letter plus paper (8.5 in. by 12.69 in.).
	LetterPlus = 59,
	//
	// Summary:
	//     A4 plus paper (210 mm by 330 mm).
	A4Plus = 60,
	//
	// Summary:
	//     A5 transverse paper (148 mm by 210 mm).
	A5Transverse = 61,
	//
	// Summary:
	//     JIS B5 transverse paper (182 mm by 257 mm).
	B5Transverse = 62,
	//
	// Summary:
	//     A3 extra paper (322 mm by 445 mm).
	A3Extra = 63,
	//
	// Summary:
	//     A5 extra paper (174 mm by 235 mm).
	A5Extra = 64,
	//
	// Summary:
	//     ISO B5 extra paper (201 mm by 276 mm).
	B5Extra = 65,
	//
	// Summary:
	//     A2 paper (420 mm by 594 mm).
	A2 = 66,
	//
	// Summary:
	//     A3 transverse paper (297 mm by 420 mm).
	A3Transverse = 67,
	//
	// Summary:
	//     A3 extra transverse paper (322 mm by 445 mm).
	A3ExtraTransverse = 68,
	//
	// Summary:
	//     Japanese double postcard (200 mm by 148 mm). Requires Windows 98, Windows NT
	//     4.0, or later.
	JapaneseDoublePostcard = 69,
	//
	// Summary:
	//     A6 paper (105 mm by 148 mm). Requires Windows 98, Windows NT 4.0, or later.
	A6 = 70,
	//
	// Summary:
	//     Japanese Kaku #2 envelope. Requires Windows 98, Windows NT 4.0, or later.
	JapaneseEnvelopeKakuNumber2 = 71,
	//
	// Summary:
	//     Japanese Kaku #3 envelope. Requires Windows 98, Windows NT 4.0, or later.
	JapaneseEnvelopeKakuNumber3 = 72,
	//
	// Summary:
	//     Japanese Chou #3 envelope. Requires Windows 98, Windows NT 4.0, or later.
	JapaneseEnvelopeChouNumber3 = 73,
	//
	// Summary:
	//     Japanese Chou #4 envelope. Requires Windows 98, Windows NT 4.0, or later.
	JapaneseEnvelopeChouNumber4 = 74,
	//
	// Summary:
	//     Letter rotated paper (11 in. by 8.5 in.).
	LetterRotated = 75,
	//
	// Summary:
	//     A3 rotated paper (420 mm by 297 mm).
	A3Rotated = 76,
	//
	// Summary:
	//     A4 rotated paper (297 mm by 210 mm). Requires Windows 98, Windows NT 4.0, or
	//     later.
	A4Rotated = 77,
	//
	// Summary:
	//     A5 rotated paper (210 mm by 148 mm). Requires Windows 98, Windows NT 4.0, or
	//     later.
	A5Rotated = 78,
	//
	// Summary:
	//     JIS B4 rotated paper (364 mm by 257 mm). Requires Windows 98, Windows NT 4.0,
	//     or later.
	B4JisRotated = 79,
	//
	// Summary:
	//     JIS B5 rotated paper (257 mm by 182 mm). Requires Windows 98, Windows NT 4.0,
	//     or later.
	B5JisRotated = 80,
	//
	// Summary:
	//     Japanese rotated postcard (148 mm by 100 mm). Requires Windows 98, Windows NT
	//     4.0, or later.
	JapanesePostcardRotated = 81,
	//
	// Summary:
	//     Japanese rotated double postcard (148 mm by 200 mm). Requires Windows 98, Windows
	//     NT 4.0, or later.
	JapaneseDoublePostcardRotated = 82,
	//
	// Summary:
	//     A6 rotated paper (148 mm by 105 mm). Requires Windows 98, Windows NT 4.0, or
	//     later.
	A6Rotated = 83,
	//
	// Summary:
	//     Japanese rotated Kaku #2 envelope. Requires Windows 98, Windows NT 4.0, or later.
	JapaneseEnvelopeKakuNumber2Rotated = 84,
	//
	// Summary:
	//     Japanese rotated Kaku #3 envelope. Requires Windows 98, Windows NT 4.0, or later.
	JapaneseEnvelopeKakuNumber3Rotated = 85,
	//
	// Summary:
	//     Japanese rotated Chou #3 envelope. Requires Windows 98, Windows NT 4.0, or later.
	JapaneseEnvelopeChouNumber3Rotated = 86,
	//
	// Summary:
	//     Japanese rotated Chou #4 envelope. Requires Windows 98, Windows NT 4.0, or later.
	JapaneseEnvelopeChouNumber4Rotated = 87,
	//
	// Summary:
	//     JIS B6 paper (128 mm by 182 mm). Requires Windows 98, Windows NT 4.0, or later.
	B6Jis = 88,
	//
	// Summary:
	//     JIS B6 rotated paper (182 mm by 128 mm). Requires Windows 98, Windows NT 4.0,
	//     or later.
	B6JisRotated = 89,
	//
	// Summary:
	//     Standard paper (12 in. by 11 in.). Requires Windows 98, Windows NT 4.0, or later.
	Standard12x11 = 90,
	//
	// Summary:
	//     Japanese You #4 envelope. Requires Windows 98, Windows NT 4.0, or later.
	JapaneseEnvelopeYouNumber4 = 91,
	//
	// Summary:
	//     Japanese You #4 rotated envelope. Requires Windows 98, Windows NT 4.0, or later.
	JapaneseEnvelopeYouNumber4Rotated = 92,
	//
	// Summary:
	//     16K paper (146 mm by 215 mm). Requires Windows 98, Windows NT 4.0, or later.
	Prc16K = 93,
	//
	// Summary:
	//     32K paper (97 mm by 151 mm). Requires Windows 98, Windows NT 4.0, or later.
	Prc32K = 94,
	//
	// Summary:
	//     32K big paper (97 mm by 151 mm). Requires Windows 98, Windows NT 4.0, or later.
	Prc32KBig = 95,
	//
	// Summary:
	//     #1 envelope (102 mm by 165 mm). Requires Windows 98, Windows NT 4.0, or later.
	PrcEnvelopeNumber1 = 96,
	//
	// Summary:
	//     #2 envelope (102 mm by 176 mm). Requires Windows 98, Windows NT 4.0, or later.
	PrcEnvelopeNumber2 = 97,
	//
	// Summary:
	//     #3 envelope (125 mm by 176 mm). Requires Windows 98, Windows NT 4.0, or later.
	PrcEnvelopeNumber3 = 98,
	//
	// Summary:
	//     #4 envelope (110 mm by 208 mm). Requires Windows 98, Windows NT 4.0, or later.
	PrcEnvelopeNumber4 = 99,
	//
	// Summary:
	//     #5 envelope (110 mm by 220 mm). Requires Windows 98, Windows NT 4.0, or later.
	PrcEnvelopeNumber5 = 100,
	//
	// Summary:
	//     #6 envelope (120 mm by 230 mm). Requires Windows 98, Windows NT 4.0, or later.
	PrcEnvelopeNumber6 = 101,
	//
	// Summary:
	//     #7 envelope (160 mm by 230 mm). Requires Windows 98, Windows NT 4.0, or later.
	PrcEnvelopeNumber7 = 102,
	//
	// Summary:
	//     #8 envelope (120 mm by 309 mm). Requires Windows 98, Windows NT 4.0, or later.
	PrcEnvelopeNumber8 = 103,
	//
	// Summary:
	//     #9 envelope (229 mm by 324 mm). Requires Windows 98, Windows NT 4.0, or later.
	PrcEnvelopeNumber9 = 104,
	//
	// Summary:
	//     #10 envelope (324 mm by 458 mm). Requires Windows 98, Windows NT 4.0, or later.
	PrcEnvelopeNumber10 = 105,
	//
	// Summary:
	//     16K rotated paper (146 mm by 215 mm). Requires Windows 98, Windows NT 4.0, or
	//     later.
	Prc16KRotated = 106,
	//
	// Summary:
	//     32K rotated paper (97 mm by 151 mm). Requires Windows 98, Windows NT 4.0, or
	//     later.
	Prc32KRotated = 107,
	//
	// Summary:
	//     32K big rotated paper (97 mm by 151 mm). Requires Windows 98, Windows NT 4.0,
	//     or later.
	Prc32KBigRotated = 108,
	//
	// Summary:
	//     #1 rotated envelope (165 mm by 102 mm). Requires Windows 98, Windows NT 4.0,
	//     or later.
	PrcEnvelopeNumber1Rotated = 109,
	//
	// Summary:
	//     #2 rotated envelope (176 mm by 102 mm). Requires Windows 98, Windows NT 4.0,
	//     or later.
	PrcEnvelopeNumber2Rotated = 110,
	//
	// Summary:
	//     #3 rotated envelope (176 mm by 125 mm). Requires Windows 98, Windows NT 4.0,
	//     or later.
	PrcEnvelopeNumber3Rotated = 111,
	//
	// Summary:
	//     #4 rotated envelope (208 mm by 110 mm). Requires Windows 98, Windows NT 4.0,
	//     or later.
	PrcEnvelopeNumber4Rotated = 112,
	//
	// Summary:
	//     Envelope #5 rotated envelope (220 mm by 110 mm). Requires Windows 98, Windows
	//     NT 4.0, or later.
	PrcEnvelopeNumber5Rotated = 113,
	//
	// Summary:
	//     #6 rotated envelope (230 mm by 120 mm). Requires Windows 98, Windows NT 4.0,
	//     or later.
	PrcEnvelopeNumber6Rotated = 114,
	//
	// Summary:
	//     #7 rotated envelope (230 mm by 160 mm). Requires Windows 98, Windows NT 4.0,
	//     or later.
	PrcEnvelopeNumber7Rotated = 115,
	//
	// Summary:
	//     #8 rotated envelope (309 mm by 120 mm). Requires Windows 98, Windows NT 4.0,
	//     or later.
	PrcEnvelopeNumber8Rotated = 116,
	//
	// Summary:
	//     #9 rotated envelope (324 mm by 229 mm). Requires Windows 98, Windows NT 4.0,
	//     or later.
	PrcEnvelopeNumber9Rotated = 117,
	//
	// Summary:
	//     #10 rotated envelope (458 mm by 324 mm). Requires Windows 98, Windows NT 4.0,
	//     or later.
	PrcEnvelopeNumber10Rotated = 118
}

export enum FlowDirection {
	//
	// Summary:
	//     Elements flow from the left edge of the design surface to the right.
	LeftToRight = 0,
	//
	// Summary:
	//     Elements flow from the top of the design surface to the bottom.
	TopDown = 1,
	//
	// Summary:
	//     Elements flow from the right edge of the design surface to the left.
	RightToLeft = 2,
	//
	// Summary:
	//     Elements flow from the bottom of the design surface to the top.
	BottomUp = 3
}

export enum BorderStyle {
	//
	// Summary:
	//     No border.
	None = 0,
	//
	// Summary:
	//     A single-line border.
	FixedSingle = 1,
	//
	// Summary:
	//     A three-dimensional border.
	Fixed3D = 2
}

export enum ListViewTypeEnum {
	IconAndText = 0,
	List = 1,
	Detail = 2,
	Icon = 3,
	Text = 4,
	Attach = 5,
	Picture = 6
}

/// <summary>
/// Enum of lookup mode
/// </summary>
export enum LookupModeEnum {
	/// <summary>
	/// Lookup exact value member (default)
	/// </summary>
	ExactValueMember = 0,

	/// <summary>
	/// Lookup value member but accept approximately value
	/// </summary>
	PartialValueMember = 1,

	/// <summary>
	/// List of value member
	/// </summary>
	ChecklistValueMember = 2,

	/// <summary>
	/// Suggest value member
	/// </summary>
	SuggestValueMember = 3,

	/// <summary>
	/// Suggest display member
	/// </summary>
	SuggestDisplayMember = 4
}

export enum ResetTypeEnum {
	None,
	MetadataUnchanged,
	MetadataChanged
}

export enum ShowAddNewRowEnum {
	None,
	EditableCell,
	MergedCell
}

export enum NumericScaleModeEnum {
	Manual,
	ManualDataY,
	ManualDataX,
	AutoDataY,
	AutoDataX,
	Auto
}

export enum MultiFileEnum {
	None,
	ZipAlways,
	ZipMultiOnly
}

export enum MarqueeTypeEnum {
	Normal,
	Slide
}

export enum DateTimeFormatEnum {
	None = 0,
	Date = 1,
	Hour = 2,
	Minute = 4,
	Second = 8,
	Millisecond = 16
}

export enum AutoScaleMode {
	Inherit
}

export enum AutoSizeMode {
	GrowAndShrink,
	GroupOnly
}

export enum GridModeEnum {
	Grid,
	GanttChart
}

export enum TimeScaleEnum {
	QuarterHour,
	HalfHour,
	Hour,
	HalfDay,
	DayOfWeek,
	Day,
	Month,
	Quarter,
	Year
}

export enum GanttBarColorTypeEnum {
	Default,
	AutoValue,
	AbsoluteValue
}

export enum AutoMinMaxTimeEnum {
	None = 0,
	MinimumTime = 1,
	MaximumTime = 2,
	Both = 3
}

export enum GanttGroupTypeEnum {
	None,
	Merged
}

export enum ShowExcludedTimeEnum {
	None = 0,
	Fixed = 1,
	NonFixed = 2,
	Both = 3
}

export enum TimeMarkingEnum {
	None = 0,
	Bar = 1,
	Base = 2,
	Arrow = 4,
	Cell = 8
}

export enum BravoAutoActionEnum {
	None = 0,
	CloseForm = 1,
	ExitProgram = 2,
	ShutdownComputer = 3
}

export enum DropDownTypeEnum {
	None = 0,
	DropDown = 1,
	SplitDropDown = 2
}

export enum PictureBoxSizeMode {
	Normal = 0,
	StretchImage = 1,
	AutoSize = 2,
	CenterImage = 3,
	Zoom = 4
}

export enum ImageLayout {
	None = 0,
	Tile = 1,
	Center = 2,
	Stretch = 3,
	Zoom = 4
}

export enum TextImageRelation {
	Overlay = 0,
	ImageAboveText = 1,
	TextAboveImage = 2,
	ImageBeforeText = 4,
	TextBeforeImage = 8
}

export enum FlatStyle {
	Flat = 0,
	Popup = 1,
	Standard = 2,
	System = 3
}

export enum SelectedMemberEnum {
	FileName,
	FileNameWithoutExtension,
	FileExtension,
	FileLocation,
	FolderName,
	FileContent,
	ZipContent,
	FileSize,
	FileReadTime,
	FileWriteTime,
	FileReadTimeUTC,
	FileWriteTimeUTC,
	ImageDimension,
	ImageResolution,
	ImagePixelFormat,
	ImageThumbnail
}

export enum AllowEditingMultiCellEnum {
	None = 0,
	Delete = 1,
	Paste = 2,
	TrimEmptyRow = 4
}

export enum StringSplitOptions {
	//
	// Summary:
	//     The return value includes array elements that contain an empty string
	None = 0,
	//
	// Summary:
	//     The return value does not include array elements that contain an empty string
	RemoveEmptyEntries = 1
}

export enum BorderSides {
	None = 0,
	Top = 1,
	Left = 2,
	Right = 4,
	Bottom = 8,
	All = 15
}

export enum LegendVisibleEnum {
	Hide,
	Standard,
	CustomTop,
	CustomBottom
}

export enum TotalVisibleEnum {
	None = 0,
	Total = 1,
	Intermediate = 2,
	Both = Total | Intermediate
}

export enum LabelDisplayModeEnum {
	Value,
	Deviation
}

export enum LabelPosition {
	None = 0,
	Left = 1,
	Top = 2,
	Right = 3,
	Bottom = 4,
	Center = 5,
	Auto = 6
}

export enum LabelPositionEnum {
	None,
	Above,
	Middle,
	Below,
	Auto
}

export enum PointerTypeEnum {
	None,
	Triangle,
	Inner,
	Outner,
	TriangleRounded
}

export enum SpecialChartEnum {
	Waterfall,
	Tornado
}

export enum AppearanceStyleEnum {
	Checkbox,
	Button
}

export enum ValueTypeEnum {
	DateTime,
	Numeric
}

export enum DateTimeShiftTypeEnum {
	Second,
	Minute,
	Hour,
	Day,
	Month,
	Year
}

export enum TextAlignEnum {
	None = 0,
	LeftTop = 1,
	LeftCenter = 2,
	LeftBottom = 3,
	CenterTop = 4,
	CenterCenter = 5,
	CenterBottom = 6,
	RightTop = 7,
	RightCenter = 8,
	RightBottom = 9,
	GeneralTop = 10,
	GeneralCenter = 11,
	GeneralBottom = 12
}

export enum DisplayPositionEnum {
	Top,
	Right
}

export enum ContentOption {
	None = 0,
	Trim = 1,
	WordWrap = 2
}

export enum SliderLabelDisplay {
	// Không hiển thị
	None = 0,
	// Hiển thị ở vị trí min, max
	MinMax = 1,
	// Hiển thị ở vị trí tick
	Tick = 2
}

export enum SliderLabelPosition {
	// Hiển thị phía trên
	Above = 0,
	// Hiển thị phía dưới
	Below = 1
}

export enum SliderTickStyle {
	// Không hiển thị
	None = 0,
	// Hiển thị phía trên
	TopLeft = 1,
	// Hiển thị phía dưới
	BottomRight = 2,
	// Hiển thị cả hai phía
	Both = 3
}

export enum CodeType {
	None = 0,
	Ansi39 = 1,
	Ansi39x = 2,
	Code_2_of_5 = 3,
	Code25intlv = 4,
	Matrix_2_of_5 = 5,
	Code39 = 6,
	Code39x = 7,
	Code_128_A = 8,
	Code_128_B = 9,
	Code_128_C = 10,
	Code_128auto = 11,
	Code_93 = 12,
	Code93x = 13,
	MSI = 14,
	PostNet = 0xf,
	Codabar = 0x10,
	EAN_8 = 17,
	EAN_13 = 18,
	UPC_A = 19,
	UPC_E0 = 20,
	UPC_E1 = 21,
	RM4SCC = 22,
	UCCEAN128 = 23,
	QRCode = 24,
	Code49 = 25,
	JapanesePostal = 26,
	Pdf417 = 27,
	EAN128FNC1 = 28,
	RSS14 = 29,
	RSS14Truncated = 30,
	RSS14Stacked = 0x1f,
	RSS14StackedOmnidirectional = 0x20,
	RSSExpanded = 33,
	RSSExpandedStacked = 34,
	RSSLimited = 35,
	DataMatrix = 36,
	MicroPDF417 = 37,
	IntelligentMail = 0x40
}

export enum Code128CodeSet {
	Auto = 0,
	A = 1,
	B = 2,
	C = 3
}

export enum BarCodeRenderType {
	Canvas = 0,
	Svg = 1
}

export enum BarCodeLabelPosition {
	Top = 0,
	Bottom = 1
}

export enum MessageBoxButtons {
	OK = 0,
	OKCancel = 1,
	AbortRetryIgnore = 2,
	YesNoCancel = 3,
	YesNo = 4,
	RetryCancel = 5,
	Logout = 6
}

export enum MessageBoxIcon {
	None = 0,
	Hand = 16,
	Stop = 16,
	Error = 16,
	Question = 32,
	Exclamation = 48,
	Warning = 48,
	Asterisk = 64,
	Information = 64
}

export enum DialogResult {
	None = 0,
	OK = 1,
	Cancel = 2,
	Abort = 3,
	Retry = 4,
	Ignore = 5,
	Yes = 6,
	No = 7,
	Logout = 8
}

export enum HorizontalAlignment {
	Left = 0,
	Right = 1,
	Center = 2
}
