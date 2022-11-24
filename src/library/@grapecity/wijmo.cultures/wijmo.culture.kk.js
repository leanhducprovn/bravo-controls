﻿/*!
    *
    * Wijmo Library 5.20221.857
    * http://wijmo.com/
    *
    * Copyright(c) GrapeCity, Inc.  All rights reserved.
    *
    * Licensed under the GrapeCity Commercial License.
    * sales@wijmo.com
    * wijmo.com/products/wijmo-5/license/
    *
    */

var wijmo;!function(e){window.wijmo||(window.wijmo=e);var o={Globalize:{name:"kk",displayName:"Kazakh",numberFormat:{".":",",",":" ","-":"-","+":"+","%":"%",percent:{pattern:["-n%","n%"]},currency:{decimals:2,symbol:"₸",pattern:["-n $","n $"]}},calendar:{"/":".",":":":",firstDay:1,days:["жексенбі","дүйсенбі","сейсенбі","сәрсенбі","бейсенбі","жұма","сенбі"],daysAbbr:["жс","дс","сс","ср","бс","жм","сб"],months:["Қаңтар","Ақпан","Наурыз","Сәуір","Мамыр","Маусым","Шілде","Тамыз","Қыркүйек","Қазан","Қараша","Желтоқсан"],monthsAbbr:["қаң.","ақп.","нау.","сәу.","мам.","мау.","шіл.","там.","қыр.","қаз.","қар.","жел."],am:["AM","A"],pm:["PM","P"],eras:["б.з."],patterns:{d:"dd.MM.yyyy",D:'yyyy "ж". d MMMM, dddd',f:'yyyy "ж". d MMMM, dddd HH:mm',F:'yyyy "ж". d MMMM, dddd HH:mm:ss',t:"HH:mm",T:"HH:mm:ss",m:"d MMMM",M:"d MMMM",y:'yyyy "ж". MMMM',Y:'yyyy "ж". MMMM',g:"dd.MM.yyyy HH:mm",G:"dd.MM.yyyy HH:mm:ss",s:'yyyy"-"MM"-"dd"T"HH":"mm":"ss'}}},Licensing:{cls:"CLOSE",ctc:'Please contact GrapeCity: <a href="mailto:us.sales@grapecity.com">us.sales@grapecity.com</a>.',dmn:"The Wijmo license in this application is not valid for the current domain. The license domain is <b>{licDomain}</b>; the current domain is <b>{domain}</b>.",evl:"Wijmo Evaluation Version ({version})",exp:"The Wijmo license in this application has expired. The license expiration date is <b>{expDate:d}</b>.",hdr:"Wijmo License",lic:"The Wijmo license in this application is invalid.",mss:"The Wijmo license in this application is not set.",prd:"The Wijmo license in this application is not valid for the <b>{control}</b> control.",ver:"The Wijmo license in this application is not valid for the version in use. The license version is <b>{licVer}</b>; the product version is <b>{version}</b>."},Calendar:{ariaLabels:{calendar:"Күнтізбе",monthView:"Ай көрінісі",yearView:'"Жыл" көрінісі',prvMo:"Алдыңғы ай",today:"Бүгін",nxtMo:"Келесі ай",prvYr:"Алдыңғы жылда",currMo:"Current Month",nxtYr:"Кeлесі жыл"}},DropDown:{ariaLabels:{tgl:"Toggle dropdown"}},FlexGrid:{groupHeaderFormat:"{name}: <b>{value}</b> ({count:n0} элемент)",ariaLabels:{toggleDropDown:"Toggle Dropdown",toggleGroup:"Toggle Group"}},FlexGridDetailProvider:{ariaLabels:{toggleDetail:"Toggle Row Detail"}},FlexGridFilter:{ariaLabels:{edit:"Edit Filter for Column",dialog:"Filter Editor for Column",asc:"Sort Column in Ascending Order",dsc:"Sort Column in Descending Order",search:"Search Item List",op1:"First Condition Operator",val1:"First Condition Value",and:"Require both Conditions",or:"Require either Condition",op2:"Second Condition Operator",val2:"Second Condition Value"},ascending:"↑ Артуы бойынша",descending:"↓ Кемуі бойынша",apply:"Қолдану",cancel:"бас тарту",clear:"Тазалау",conditions:"Шарты бойынша сүзу",values:"Мәні бойынша сүзу",search:"Іздеу",selectAll:"Бәрін бөлектеу",null:"(жоқ)",header:"Мәні мынадай элементтерді көрсету",and:"Және",or:"Немесе",stringOperators:[{name:"(орнатылмаған)",op:null},{name:"Тең",op:0},{name:"Тең емес",op:1},{name:"Басталады",op:6},{name:"Аяқталады",op:7},{name:"Құрамында бар",op:8},{name:"Құрамында жоқ",op:9}],numberOperators:[{name:"(орнатылмаған)",op:null},{name:"Тең",op:0},{name:"Тең емес",op:1},{name:"Үлкендеу",op:2},{name:"Үлкендеу немесе тең",op:3},{name:"Аздау",op:4},{name:"Аздау немесе тең",op:5}],dateOperators:[{name:"(орнатылмаған)",op:null},{name:"Тең",op:0},{name:"Бұрын",op:4},{name:"кейін",op:2}],booleanOperators:[{name:"(орнатылмаған)",op:null},{name:"Тең",op:0},{name:"Тең емес",op:1}]},GroupPanel:{dragDrop:"Drag and Drop columns here to create Groups."},InputDateTime:{ariaLabels:{tglDate:"Toggle Calendar",tglTime:"Toggle Time List"}},InputNumber:{ariaLabels:{incVal:"Increase Value",decVal:"Decrease Value"}},MultiSelect:{itemsSelected:"{count:n0} элементтер таңдалған"},MultiSelectListBox:{filterPlaceholder:"Сүзу",selectAll:"Барлығын таңдау"},olap:{PivotFieldEditor:{dialogHeader:"Өріс параметрлері:",header:"Үст. дерек-е:",summary:"Тұжырым:",showAs:"Көрсету:",weighBy:"арқылы салмағы:",sort:"Сұрыптау:",filter:"Сүзгі:",format:"Пішімі:",sample:"Үлгі:",edit:"Өңдеу…",clear:"Тазарту",ok:"OK",cancel:"болдырмау",none:"(жоқ)",sorts:{asc:"Артуы бойынша",desc:"Кемуі бойынша"},aggs:{sum:"Қосынды",cnt:"Саны",avg:"Орташа",max:"Ең көп",min:"Ең аз",rng:"Ауқым",std:"Стандартты ауытқу",var:"Var",stdp:"StdDevPop",varp:"VarPop",first:"Аты",last:"Соңғы"},calcs:{noCalc:"Есептеу жоқ",dRow:"Алдыңғы жолға айырмашылығы",dRowPct:"% Алдыңғы жолға айырмашылығы",dCol:"алдыңғы бағанының айырмасы",dColPct:"алдыңғы бағанының айырмасы%",dPctGrand:"Гранд барлығы%",dPctRow:"жол барлығы%",dPrevRow:"% of value in the previous row",dPctCol:"баған барлығы%",dPrevCol:"% of value in the previous column",dRunTot:"Жинақталған жалпы",dRunTotPct:"Жинақталған жалпы%"},formats:{n0:"бүтін (n0)",n2:"ондық (n2)",c:"валюта (c)",p0:"пайыз (p0)",p2:"пайыз (p2)",n2c:"мыңдаған (n2,)",n2cc:"миллиондаған (n2,,)",n2ccc:"миллиардтаған (n2,,,)",d:"дата (d)",MMMMddyyyy:"Ай Күн Жыл (MMMM dd, yyyy)",dMyy:"Күні айы жыл (d/M/yy)",ddMyy:"Күні айы жыл (dd/M/yy)",dMyyyy:"Күні айы жыл (dd/M/yyyy)",MMMyyyy:"Ай жылы (MMM yyyy)",MMMMyyyy:"Ай жылы (MMMM yyyy)",yyyy:"жыл (yyyy)",yyyyQq:'жыл тоқсан (yyyy "Q"q)',FYEEEEQU:'Қаржы жылы тоқсан ("FY"EEEE "Q"U)'}},PivotEngine:{grandTotal:"Жалпы жиын",subTotal:"Аралық жиын"},PivotPanel:{fields:"Есепке қосу үшін өрісті таңдаңыз:",drag:"Төменде көрсетілген аумақтардың арасымен өрістерді апарыңыз:",filters:"Сүзгілер",cols:"бағандар",rows:"Жолдар",vals:"Мәндер",defer:"тапсырдыңыз жаңартулар",update:"Жаңарту"},_ListContextMenu:{up:"Жоғары жылжыту",down:"Төменге",first:"Басына жылжыту",last:"Соңына жылжыту",filter:"Есеп сүзгісіне жылжыту",rows:"Жол белгілеріне жылжыту",cols:"Баған белгілеріне жылжыту",vals:"Мәндерге жылжыту",remove:"Өрісті жою",edit:"Өріс параметрлері…",detail:"Егжей-тегжейлі көрсету…"},PivotChart:{by:"арқылы",and:"және"},DetailDialog:{header:"Нақты көрініс:",ok:"OK",items:"{cnt:n0} items",item:"{cnt} item",row:"Жол",col:"БАҒАН"},Slicer:{multiSelect:"&Бірнеше таңдау",clearFilter:"Сүзгіні жою"}},Viewer:{cancel:"болдырмау",ok:"OK",bottom:"Төменгі:",top:"Жоғарғы:",right:"Оң жақ:",left:"Сол жақ:",margins:"Шеттер (дюймдер)",orientation:"Бағдар:",paperKind:"Қағаздың түрі:",pageSetup:"Бет параметрлері",landscape:"Альбомдық",portrait:"Кітаптық",pageNumber:"Бет нөмірі",zoomFactor:"Zoom фактор",paginated:"Орналасуды басып шығару",print:"басып шығару",search:"Іздеу",matchCase:"Регистрді ескеріп",wholeWord:"Толық сөзді ғана сәйкестендіру",searchResults:"Іздеу нәтижелері",previousPage:"Бұрынғы бет",nextPage:"Келесі бет",firstPage:"Бірінші бет",lastPage:"Соңғы бет",backwardHistory:"Артқа",forwardHistory:"Алға",pageCount:"Беттер саны",selectTool:"таңдау құралы",moveTool:"Move Tool",continuousMode:"Continuous Page View",singleMode:"Бір бетте көрінісі",wholePage:"Тұтас Page қиыстыру",pageWidth:"Fit Page Width",zoomOut:"Кішілеу",zoomIn:"Ірілеу",rubberbandTool:"Іріктеу арқылы Zoom",magnifierTool:"үлкейткіш",rotatePage:"Page бұру",rotateDocument:"құжатты айналдырыңыз",exports:"Экспорттау",fullScreen:"Толық экранды",exitFullScreen:"Толық экраннан шығу",hamburgerMenu:"Құралдар",showSearchBar:"Іздеу тақтасын көрсету",viewMenu:"Орналасу параметрлері…",searchOptions:"Іздеу параметрлері",matchCaseMenuItem:"Үлкен-кішілігін ескеріп",wholeWordMenuItem:"Толық сөзді ескеру",thumbnails:"бет нобайлары",outlines:"құжат құрылымы",loading:"Қотарылуда…",pdfExportName:"Adobe PDF",docxExportName:"Open XML Word",xlsxExportName:"Open XML Excel",docExportName:"Microsoft Word",xlsExportName:"Microsoft Excel",mhtmlExportName:"Web archive (MHTML)",htmlExportName:"HTML құжаты",rtfExportName:"RTF құжат",metafileExportName:"Compressed metafiles",csvExportName:"CSV",tiffExportName:"Tiff Суреттер",bmpExportName:"BMP images",emfExportName:"Enhanced metafile",gifExportName:"GIF images",jpgExportName:"JPEG images",jpegExportName:"JPEG images",pngExportName:"PNG Суреттер",abstractMethodException:"This is an abstract method, please implement it.",cannotRenderPageNoViewPage:"Cannot render page without document source and view page.",cannotRenderPageNoDoc:"Cannot render page without document source and view page.",exportFormat:"Export format:",exportOptionTitle:"Экспорт параметрлері",documentRestrictionsGroup:"Document restrictions",passwordSecurityGroup:"Password security",outputRangeGroup:"Output range",documentInfoGroup:"Document info",generalGroup:"Жалпы",docInfoTitle:"Басталуы",docInfoAuthor:"Автор",docInfoManager:"Басшысы",docInfoOperator:"Оператор",docInfoCompany:"Компания",docInfoSubject:"Тақырыбы",docInfoComment:"Аӊғартпа",docInfoCreator:"Жасаушы",docInfoProducer:"Продюсер",docInfoCreationTime:"Жасау  уақыты",docInfoRevisionTime:"Revision time",docInfoKeywords:"Кілтсөздер",embedFonts:"TrueType қаріптерін ендіру",pdfACompatible:"PDF/A compatible (level 2B)",useCompression:"Use compression",useOutlines:"Generate outlines",allowCopyContent:"Allow content copying or extraction",allowEditAnnotations:"Allow annotation editing",allowEditContent:"Allow content editing",allowPrint:"Allow printing",ownerPassword:"Permissions (owner) password:",userPassword:"Document open (user) password:",encryptionType:"Encryption level:",paged:"Түсірілетін",showNavigator:"Навигаторды көрсету",navigatorPosition:"Навигатор Қызметі",singleFile:"Single File",tolerance:"Tolerance when detecting text bounds (points):",pictureLayer:"Use separate picture layer",metafileType:"Metafile Type:",monochrome:"Бір түсті",resolution:"Ажыратымдылық",outputRange:"Бет ауқымы:",outputRangeInverted:"Inverted",showZoomBar:"Zoom Bar",searchPrev:"Search Previous",searchNext:"Search Next",checkMark:"✓",exportOk:"Экспорттау",cannotSearch:"Іздеу көрсетілуі үшін құжат көзін қажет етеді.",parameters:"Параметрлер",requiringParameters:"Кіріс параметрлері.",nullParameterError:"Мән бос бола алмайды.",invalidParameterError:"Дұрыс емес енгізу",parameterNoneItemsSelected:"(жоқ)",parameterAllItemsSelected:"(бәрі)",parameterSelectAllItemText:"(Бәрін бөлектеу)",selectParameterValue:"(Мәнді таңдау)",apply:"Қолдану",errorOccured:"Қате туындады."},FlexSheet:{insertRow:"Жол кірістіру",deleteRow:"Жолды жою",insertCol:"Бағанды кірістіру",deleteCol:"Бағанды жою",convertTable:"Convert Table",copyCells:"Ұяшықтарды көшіру",fillSeries:"Қатарларды бояу",fillFormat:"Fill Formatting Only",fillWithoutFormat:"Fill Without Formatting",insertSheet:"Кірістіру",deleteSheet:"Жою",renameSheet:"атын өзгерту"},FlexChartAnalytics:{BreakEven:{profitArea:"Profit Area",lossArea:"Loss Area",safetyMargin:"Safety Margin",salesRevenue:"Sales Revenue",totalCost:"Жалпы құны",fixedCost:"Fixed Cost",variableCost:"Variable Cost",marginalProfit:"Marginal Profit",breakEven:"Break Even"}}},t=window.wijmo._updateCulture;t?t(o):window.wijmo.culture=o}(wijmo||(wijmo={}));