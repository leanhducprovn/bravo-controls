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

var wijmo;!function(e){window.wijmo||(window.wijmo=e);var r={Globalize:{name:"da",displayName:"Danish",numberFormat:{".":",",",":".","-":"-","+":"+","%":"%",percent:{pattern:["-n %","n %"]},currency:{decimals:2,symbol:"kr.",pattern:["-n $","n $"]}},calendar:{"/":"-",":":":",firstDay:1,days:["søndag","mandag","tirsdag","onsdag","torsdag","fredag","lørdag"],daysAbbr:["sø","ma","ti","on","to","fr","lø"],months:["januar","februar","marts","april","maj","juni","juli","august","september","oktober","november","december"],monthsAbbr:["jan","feb","mar","apr","maj","jun","jul","aug","sep","okt","nov","dec"],am:["",""],pm:["",""],eras:["A.D."],patterns:{d:"dd-MM-yyyy",D:"d. MMMM yyyy",f:"d. MMMM yyyy HH:mm",F:"d. MMMM yyyy HH:mm:ss",t:"HH:mm",T:"HH:mm:ss",m:"d. MMMM",M:"d. MMMM",y:"MMMM yyyy",Y:"MMMM yyyy",g:"dd-MM-yyyy HH:mm",G:"dd-MM-yyyy HH:mm:ss",s:'yyyy"-"MM"-"dd"T"HH":"mm":"ss'}}},Licensing:{cls:"LUK",ctc:'Kontakt GrapeCity:  <a href="mailto:us.sales@grapecity.com"> us.sales@grapecity.com</a>.',dmn:"Wijmo licensen i dette program er ikke gyldigt for det aktuelle domæne. Domænet licens er <b>{licDomain}</b>; det aktuelle domæne er  <b>{domain}</b>.",evl:"Wijmo evaluering udgave ({version})",exp:"Wijmo licensen i dette program er udløbet. Udløbsdatoen for licensen er <b>{expDate:d}</b>.",hdr:"Wijmo licens",lic:"Wijmo licensen i denne ansøgning er ugyldig.",mss:"Wijmo licensen i dette program er ikke angivet.",prd:"Wijmo licensen i dette program er ikke gyldig for kontrolelementet <b>{control}</b>  .",ver:"Wijmo licensen i dette program er ikke gyldig for versionen i brug. En licensversion er <b>{licVer}</b>, fabrikat gengivelse er  <b>{version}</b>."},Calendar:{ariaLabels:{calendar:"Kalender",monthView:"Månedsvisning",yearView:"Årsvisning",prvMo:"Forrige måned",today:"I dag",nxtMo:"Næste måned",prvYr:"Forrige år",currMo:"Indeværende måned",nxtYr:"Næste år"}},DropDown:{ariaLabels:{tgl:"Åbn dropdown"}},FlexGrid:{groupHeaderFormat:"{name}: <b>{value}</b> ({count:n0} emner)",ariaLabels:{toggleDropDown:"Åbn Dropdown",toggleGroup:"Skifte gruppe"}},FlexGridDetailProvider:{ariaLabels:{toggleDetail:"Skift række detaljer"}},FlexGridFilter:{ariaLabels:{edit:"Rediger Filter for kolonne",dialog:"Filter Editor for kolonne",asc:"Sorteringskolonne i stigende rækkefølge",dsc:"Sorteringskolonne i faldende rækkefølge",search:"Søg elementlisten",op1:"Første betingelse operatør",val1:"Første betingelse værdi",and:"Kræve begge betingelser",or:"Kræve enten betingelse",op2:"Anden betingelse operatør",val2:"Anden betingelse værdi"},ascending:"↑ Stigende",descending:"↓ Faldende",apply:"Anvend",cancel:"Annuller",clear:"Ryd",conditions:"Filtrer efter betingelse",values:"Filtrer efter værdi",search:"Søg",selectAll:"Markér alt",null:"(intet)",header:"Vis emner med værdien",and:"Og",or:"Eller",stringOperators:[{name:"(ikke indstillet)",op:null},{name:"Lig med",op:0},{name:"Ikke lig med",op:1},{name:"Begynder med",op:6},{name:"Slutter med",op:7},{name:"Indeholder",op:8},{name:"Indeholder ikke",op:9}],numberOperators:[{name:"(ikke indstillet)",op:null},{name:"Lig med",op:0},{name:"Ikke lig med",op:1},{name:"Større end",op:2},{name:"Større end eller lig med",op:3},{name:"Mindre end",op:4},{name:"Mindre end eller lig med",op:5}],dateOperators:[{name:"(ikke indstillet)",op:null},{name:"Lig med",op:0},{name:"Før",op:4},{name:"Efter",op:2}],booleanOperators:[{name:"(ikke indstillet)",op:null},{name:"Lig med",op:0},{name:"Ikke lig med",op:1}]},GroupPanel:{dragDrop:"Træk og slip kolonner her for at oprette grupper."},InputDateTime:{ariaLabels:{tglDate:"Skift kalender",tglTime:"Skift tid liste"}},InputNumber:{ariaLabels:{incVal:"Øge værdi",decVal:"Formindsk værdien"}},MultiSelect:{itemsSelected:"{count:n0} varer valgt"},MultiSelectListBox:{filterPlaceholder:"Filtrer",selectAll:"Markér alt"},olap:{PivotFieldEditor:{dialogHeader:"Indstillinger for feltet:",header:"Overskrift:",summary:"Resumé:",showAs:"Vis som:",weighBy:"Vejes af:",sort:"Sorter:",filter:"Filter:",format:"Format:",sample:"Prøve:",edit:"Rediger…",clear:"Ryd",ok:"OK",cancel:"Annuller",none:"(ingen)",sorts:{asc:"Stigende",desc:"Faldende"},aggs:{sum:"Sum",cnt:"Antal",avg:"Gennemsnit",max:"Maks.",min:"Min",rng:"Område",std:"Stdafv",var:"Var",stdp:"StdDevPop",varp:"VarPop",first:"Første",last:"Sidste"},calcs:{noCalc:"Ingen beregning",dRow:"Forskellen fra forrige række",dRowPct:"% Forskel fra forrige række",dCol:"Forskellen fra forrige kolonne",dColPct:"% Forskel fra forrige kolonne",dPctGrand:"% af hovedtotal",dPctRow:"% af rækken total",dPrevRow:"% af værdien i den foregående række",dPctCol:"% af kolonnen total",dPrevCol:"% af værdien i kolonnen foregående",dRunTot:"Løbende total",dRunTotPct:"% løbende samlede"},formats:{n0:"Heltal (n0)",n2:"Decimal (n2)",c:"Valuta (c)",p0:"Procentdel (p0)",p2:"Procentdel (p2)",n2c:"Tusinder (n2,)",n2cc:"Millioner (n2,,)",n2ccc:"Milliarder (n2,,,)",d:"Dato (d)",MMMMddyyyy:"Måned dag år (MMMM dd, yyyy)",dMyy:"Dag måned år (d/M/yy)",ddMyy:"Dag måned år (dd/M/yy)",dMyyyy:"Dag måned år (dd/M/yyyy)",MMMyyyy:"Måned år (MMM yyyy)",MMMMyyyy:"Måned år (MMMM yyyy)",yyyy:"År (yyyy)",yyyyQq:'År kvartal (yyyy"Q" q)',FYEEEEQU:'Regnskabsår kvartal ("FY" EEEE "Q" U)'}},PivotEngine:{grandTotal:"Hovedtotal",subTotal:"Subtotal"},PivotPanel:{fields:"Vælg felter for at føje til rapport:",drag:"Træk felter mellem områder nedenfor:",filters:"Filtre",cols:"Kolonner",rows:"Rækker",vals:"Værdier",defer:"Udsætte opdateringer",update:"Opdater"},_ListContextMenu:{up:"Flyt op",down:"Flyt ned",first:"Flyt til start",last:"Flytte til slutningen",filter:"Flyt til rapportfilter",rows:"Flyt til rækkenavne",cols:"Flyt til kolonnenavne",vals:"Flyt til værdier",remove:"Fjern felt",edit:"Feltindstillinger…",detail:"Vis detalje…"},PivotChart:{by:"efter",and:"og"},DetailDialog:{header:"Detaljevisning:",ok:"OK",items:"{cnt:n0} elementer",item:"{cnt} vare",row:"Række",col:"Kolonne"},Slicer:{multiSelect:"Vælg flere",clearFilter:"Ryd filter"}},Viewer:{cancel:"Annuller",ok:"OK",bottom:"Bund:",top:"Top:",right:"Højre:",left:"Venstre:",margins:"Margener (tommer)",orientation:"Orientering:",paperKind:"Papir form:",pageSetup:"Sideopsætning",landscape:"Liggende",portrait:"Stående",pageNumber:"Sidetal",zoomFactor:"Zoomfaktor",paginated:"Udskriftslayout",print:"Udskriv",search:"Søg",matchCase:"Forskel på store og små bogstaver",wholeWord:"Søg kun efter hele ord",searchResults:"Søgeresultater",previousPage:"Forrige side",nextPage:"Næste side",firstPage:"Første side",lastPage:"Sidste side",backwardHistory:"Tilbage",forwardHistory:"Fremad",pageCount:"Antal sider",selectTool:"Vælg værktøj",moveTool:"Flytte-værktøj",continuousMode:"Kontinuerlig sidevisning",singleMode:"Enkelt sidevisning",wholePage:"Fit hele siden",pageWidth:"Passe til sidebredden",zoomOut:"Zoome ud",zoomIn:"Zoom ind",rubberbandTool:"Zoom ved valg",magnifierTool:"Forstørrelsesglas",rotatePage:"Roter side",rotateDocument:"Rotér dokument",exports:"Eksportér",fullScreen:"Fuld skærm",exitFullScreen:"Afslut fuld skærm",hamburgerMenu:"Funktioner",showSearchBar:"Vis søgelinje",viewMenu:"Indstillinger for layout",searchOptions:"Søgekriterier",matchCaseMenuItem:"Forskel på store og små bogstaver",wholeWordMenuItem:"Kun hele ord",thumbnails:"Sideminiaturebilleder",outlines:"dokumentoversigt",loading:"Indlæser…",pdfExportName:"Adobe PDF",docxExportName:"Open XML-Word",xlsxExportName:"Open XML-Excel",docExportName:"Microsoft Word",xlsExportName:"Microsoft Excel",mhtmlExportName:"Webarkiv (MHTML)",htmlExportName:"HTML-dokument",rtfExportName:"RTF-dokument",metafileExportName:"Komprimeret metafiler",csvExportName:"CSV",tiffExportName:"TIFF-billeder",bmpExportName:"BMP-billeder",emfExportName:"Udvidet metafil",gifExportName:"GIF-billeder",jpgExportName:"JPEG-billeder",jpegExportName:"JPEG-billeder",pngExportName:"PNG-billeder",abstractMethodException:"Dette er en abstrakt metode, skal du gennemføre den.",cannotRenderPageNoViewPage:"Kan ikke gengives side uden dokument kilde og se side.",cannotRenderPageNoDoc:"Kan ikke gengives side uden dokument kilde og se side.",exportFormat:"Eksportformat:",exportOptionTitle:"Eksportindstillinger",documentRestrictionsGroup:"Dokument restriktioner",passwordSecurityGroup:"Adgangskodesikkerhed",outputRangeGroup:"Outputområdet",documentInfoGroup:"Dokumentinfo",generalGroup:"Generelt",docInfoTitle:"Titel",docInfoAuthor:"Forfatter",docInfoManager:"Chef",docInfoOperator:"Operatør",docInfoCompany:"Firma",docInfoSubject:"Emne",docInfoComment:"Kommentar",docInfoCreator:"Oprettet af",docInfoProducer:"Producer",docInfoCreationTime:"Oprettelsestidspunkt",docInfoRevisionTime:"Revision tid",docInfoKeywords:"Nøgleord",embedFonts:"Integrer TrueType-skrifttyper",pdfACompatible:"PDF/A kompatibel (niveau 2B)",useCompression:"Brug komprimering",useOutlines:"Generere konturer",allowCopyContent:"Tillad indhold kopiering eller udvinding",allowEditAnnotations:"Tillad redigering af anmærkning",allowEditContent:"Tillad redigering af indhold",allowPrint:"Tillad udskrivning",ownerPassword:"(Ejeren) tilladelsesadgangskode:",userPassword:"Dokument åbent (brugeren) password:",encryptionType:"Krypteringsniveau:",paged:"Sideinddelt",showNavigator:"Vis Navigator",navigatorPosition:"Navigator Position",singleFile:"Enkelt fil",tolerance:"Tolerance når afsløre tekst grænser (point):",pictureLayer:"Brug separate billede lag",metafileType:"Metafil Type:",monochrome:"Monokrom",resolution:"Opløsning:",outputRange:"Sideområde:",outputRangeInverted:"Inverteret",showZoomBar:"Zoom-bjælken",searchPrev:"Søg tidligere",searchNext:"Søg næste",checkMark:"✓",exportOk:"Eksport…",cannotSearch:"Søg kræver, at en dokumentkilde angives.",parameters:"parameters",requiringParameters:"Venligst input parametre.",nullParameterError:"En værdi må ikke være null.",invalidParameterError:"Inputtet er ugyldigt.",parameterNoneItemsSelected:"(ingen)",parameterAllItemsSelected:"(alle)",parameterSelectAllItemText:"(Markér alle)",selectParameterValue:"(Vælg værdi)",apply:"Anvend",errorOccured:"Der opstod en fejl."},FlexSheet:{insertRow:"Indsæt række",deleteRow:"Slet række",insertCol:"Indsæt kolonne",deleteCol:"Slet kolonne",convertTable:"Konverter tabel",copyCells:"Kopiere celler",fillSeries:"Fyld serie",fillFormat:"Fyld kun formatering",fillWithoutFormat:"Fyld uden formatering",insertSheet:"Indsæt",deleteSheet:"Slet",renameSheet:"Omdøb"},FlexChartAnalytics:{BreakEven:{profitArea:"Profit område",lossArea:"Tab Område",safetyMargin:"Sikkerhedsmargen",salesRevenue:"Nettoomsætning",totalCost:"Samlede omkostninger",fixedCost:"Fast omkostning",variableCost:"Variable omkostninger",marginalProfit:"Marginalt overskud",breakEven:"Gå i nul"}}},t=window.wijmo._updateCulture;t?t(r):window.wijmo.culture=r}(wijmo||(wijmo={}));