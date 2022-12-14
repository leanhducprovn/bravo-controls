import {
    Component,
    ElementRef,
    EventEmitter,
    OnInit,
    OnChanges,
    OnDestroy,
    Input,
    ChangeDetectionStrategy,
    forwardRef,
    SimpleChanges,
    Output
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, Validator, NG_VALIDATORS, ValidationErrors } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { filter, take } from 'rxjs/operators';
import * as wjc from '@grapecity/wijmo';

import { BravoMonacoEditorService } from './bravo.monaco.editor.service';
import {
    BravoMonaco,
    BravoMonacoUri,
    BravoMonacoTextModel,
    BravoMonacoStandaloneCodeEditor,
    BravoMonacoEditorConstructionOptions,
    BravoMonacoEditorMinimapOptions,
    BravoMonacoCompletionItem
} from './bravo.monaco.editor.type';

declare var monaco: BravoMonaco;

@Component({
    selector: 'bravo-monaco-editor',
    templateUrl: './bravo.monaco.editor.html',
    styleUrls: ['./bravo.monaco.editor.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => BravoMonacoEditor),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => BravoMonacoEditor),
            multi: true
        }
    ]
})
export class BravoMonacoEditor
    extends wjc.Control
    implements OnInit, OnChanges, OnDestroy, ControlValueAccessor, Validator
{
    /**
     * Value
     */
    private _value: string = 'Bravo Monaco Editor';
    @Input()
    public set value(pValue: string) {
        if (this._value == pValue) return;

        this._value = pValue;
    }
    public get value(): string {
        return this._value;
    }

    /**
     * Language
     */
    private _language: string = 'xml';
    @Input()
    public set language(pValue: string) {
        if (this._language == pValue) return;

        this._language = pValue;
    }
    public get language(): string {
        return this._language;
    }

    /**
     * Theme
     * The current out-of-the-box available themes are: 'vs' (default), 'vs-dark', 'hc-black', 'hc-light'.
     */
    private _theme: string = 'vs';
    @Input()
    public set theme(pValue: string) {
        if (this._theme == pValue) return;

        this._theme = pValue;
    }
    public get theme(): string {
        return this._theme;
    }

    /**
     * ReadOnly
     */
    private _readOnly: boolean = false;
    @Input()
    public set readOnly(pValue: boolean) {
        if (this._readOnly == pValue) return;

        this._readOnly = pValue;
    }
    public get readOnly(): boolean {
        return this._readOnly;
    }

    /**
     * Folding enabled
     */
    private _folding: boolean = true;
    @Input()
    public set folding(pValue: boolean) {
        if (this._folding == pValue) return;

        this._folding = pValue;
    }
    public get folding(): boolean {
        return this._folding;
    }

    /**
     * Folding highlight
     */
    private _foldingHighlight: boolean = true;
    @Input()
    public set foldingHighlight(pValue: boolean) {
        if (this._foldingHighlight == pValue) return;

        this._foldingHighlight = pValue;
    }
    public get foldingHighlight(): boolean {
        return this._foldingHighlight;
    }

    /**
     * Folding imports by default
     */
    private _foldingImportsByDefault: boolean = true;
    @Input()
    public set foldingImportsByDefault(pValue: boolean) {
        if (this._foldingImportsByDefault == pValue) return;

        this._foldingImportsByDefault = pValue;
    }
    public get foldingImportsByDefault(): boolean {
        return this._foldingImportsByDefault;
    }

    /**
     * Folding maximum regions
     */
    private _foldingMaximumRegions: number = 5000;
    @Input()
    public set foldingMaximumRegions(pValue: number) {
        if (this._foldingMaximumRegions == pValue) return;

        this._foldingMaximumRegions = pValue;
    }
    public get foldingMaximumRegions(): number {
        return this._foldingMaximumRegions;
    }

    /**
     * Folding strategy
     */
    private _foldingStrategy: 'auto' | 'indentation' = 'auto';
    @Input()
    public set foldingStrategy(pValue: 'auto' | 'indentation') {
        if (this._foldingStrategy == pValue) return;

        this._foldingStrategy = pValue;
    }
    public get foldingStrategy(): 'auto' | 'indentation' {
        return this._foldingStrategy;
    }

    /**
     * Show folding controls
     */
    private _showFoldingControls: 'always' | 'never' | 'mouseover' = 'always';
    @Input()
    public set showFoldingControls(pValue: 'always' | 'never' | 'mouseover') {
        if (this._showFoldingControls == pValue) return;

        this._showFoldingControls = pValue;
    }
    public get showFoldingControls(): 'always' | 'never' | 'mouseover' {
        return this._showFoldingControls;
    }

    /**
     * Minimap
     */
    private _minimap: BravoMonacoEditorMinimapOptions = {
        autohide: false,
        enabled: false,
        maxColumn: 120,
        renderCharacters: true,
        scale: 1,
        showSlider: 'mouseover',
        side: 'right',
        size: 'fit'
    };
    @Input()
    public set minimap(pValue: BravoMonacoEditorMinimapOptions) {
        if (this._minimap == pValue) return;

        this._minimap = pValue;
    }
    public get minimap(): BravoMonacoEditorMinimapOptions {
        return this._minimap;
    }

    /**
     * Scroll
     */
    private _scrollBeyondLastLine: boolean = false;
    @Input()
    public set scrollBeyondLastLine(pValue: boolean) {
        if (this._scrollBeyondLastLine == pValue) return;

        this._scrollBeyondLastLine = pValue;
    }
    public get scrollBeyondLastLine(): boolean {
        return this._scrollBeyondLastLine;
    }

    /**
     * Automatic layout
     */
    private _automaticLayout: boolean = true;
    @Input()
    public set automaticLayout(pValue: boolean) {
        if (this._automaticLayout == pValue) return;

        this._automaticLayout = pValue;
    }
    public get automaticLayout(): boolean {
        return this._automaticLayout;
    }

    /**
     * Mouse style
     */
    private _mouseStyle: 'default' | 'text' | 'copy' = 'text';
    @Input()
    public set mouseStyle(pValue: 'default' | 'text' | 'copy') {
        if (this._mouseStyle == pValue) return;

        this._mouseStyle = pValue;
    }
    public get mouseStyle(): 'default' | 'text' | 'copy' {
        return this._mouseStyle;
    }

    /**
     * Tab size
     */
    private _tabSize: number = 8;
    @Input()
    public set tabSize(pValue: number) {
        if (this._tabSize == pValue) return;

        this._tabSize = pValue;
    }
    public get tabSize(): number {
        return this._tabSize;
    }

    /**
     * Font size
     */
    private _fontSize: number = 13;
    @Input()
    public set fontSize(pValue: number) {
        if (this._fontSize == pValue) return;

        this._fontSize = pValue;
    }
    public get fontSize(): number {
        return this._fontSize;
    }

    /**
     * Options
     */
    private _options: BravoMonacoEditorConstructionOptions;
    @Input()
    public set options(pValue: BravoMonacoEditorConstructionOptions) {
        if (this._options == pValue) return;

        this._options = pValue;
    }
    public get options(): BravoMonacoEditorConstructionOptions {
        return this._options;
    }

    /**
     * Uri
     */
    private _uri?: BravoMonacoUri;
    @Input()
    public set uri(pValue: BravoMonacoUri) {
        if (this._uri == pValue) return;

        this._uri = pValue;
    }
    public get uri(): BravoMonacoUri {
        return this._uri;
    }

    /**
     * Custom suggestions
     */

    /**
     * xmlSchema
     */
    private _xmlSchema: string = `<?xml version="1.0" encoding="utf-8"?>
<xs:schema attributeFormDefault="unqualified" elementFormDefault="qualified" xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <xs:element name="XmlSnippets">
    <xs:complexType>
      <xs:sequence>
        <xs:element name="Declare">
          <xs:complexType>
            <xs:sequence>
              <xs:element name="MenuItemsTemplate">
                <xs:complexType>
                  <xs:sequence>
                    <xs:element name="Snippets">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippet">
                            <xs:complexType>
                              <xs:attribute name="type" type="xs:string" use="required" />
                              <xs:attribute name="format" type="xs:string" use="required" />
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="_MENU_">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element maxOccurs="unbounded" name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="name" type="xs:string" use="optional" />
                                    <xs:attribute name="type" type="xs:string" use="optional" />
                                    <xs:attribute name="defaultClass" type="xs:string" use="optional" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="Items">
                            <xs:complexType>
                              <xs:attribute name="declare" type="xs:string" use="required" />
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DEFAULT">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                        <xs:attribute name="pattern" type="xs:string" use="required" />
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="_SEPARATOR_">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="type" type="xs:string" use="required" />
                                    <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DEFAULT">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                        <xs:attribute name="pattern" type="xs:string" use="required" />
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="DEFAULT">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element maxOccurs="unbounded" name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="name" type="xs:string" use="optional" />
                                    <xs:attribute name="type" type="xs:string" use="optional" />
                                    <xs:attribute name="defaultClass" type="xs:string" use="optional" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="Items">
                            <xs:complexType>
                              <xs:attribute name="declare" type="xs:string" use="required" />
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DEFAULT">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                  </xs:sequence>
                </xs:complexType>
              </xs:element>
              <xs:element name="FullMenuStripTemplate">
                <xs:complexType>
                  <xs:sequence>
                    <xs:element name="Snippets">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element maxOccurs="unbounded" name="Snippet">
                            <xs:complexType>
                              <xs:attribute name="name" type="xs:string" use="optional" />
                              <xs:attribute name="type" type="xs:string" use="optional" />
                              <xs:attribute name="defaultClass" type="xs:string" use="optional" />
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="Items">
                      <xs:complexType>
                        <xs:attribute name="declare" type="xs:string" use="required" />
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="DEFAULT">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="type" type="xs:string" use="required" />
                                    <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                  </xs:sequence>
                </xs:complexType>
              </xs:element>
              <xs:element name="MenuStripTemplate">
                <xs:complexType>
                  <xs:sequence>
                    <xs:element name="Snippets">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippet">
                            <xs:complexType>
                              <xs:attribute name="name" type="xs:string" use="required" />
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="Items">
                      <xs:complexType>
                        <xs:attribute name="declare" type="xs:string" use="required" />
                      </xs:complexType>
                    </xs:element>
                  </xs:sequence>
                </xs:complexType>
              </xs:element>
              <xs:element name="CommandValidatorTemplate">
                <xs:complexType>
                  <xs:sequence>
                    <xs:element name="Snippets">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippet">
                            <xs:complexType>
                              <xs:attribute name="type" type="xs:string" use="required" />
                              <xs:attribute name="defaultClass" type="xs:string" use="required" />
                              <xs:attribute name="defaultAssembly" type="xs:string" use="required" />
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="CommandName">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="type" type="xs:string" use="required" />
                                    <xs:attribute name="format" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="DEFAULT">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="type" type="xs:string" use="required" />
                                    <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                    <xs:attribute name="defaultAssembly" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                  </xs:sequence>
                </xs:complexType>
              </xs:element>
              <xs:element name="EvaluatorClass">
                <xs:complexType>
                  <xs:sequence>
                    <xs:element name="BravoCommandKey">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element maxOccurs="unbounded" name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="name" type="xs:string" use="optional" />
                                    <xs:attribute name="type" type="xs:string" use="optional" />
                                    <xs:attribute name="defaultClass" type="xs:string" use="optional" />
                                    <xs:attribute name="defaultAssembly" type="xs:string" use="optional" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="Assembly">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="ClassName">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="baseClass" type="xs:string" use="required" />
                                          <xs:attribute name="defaultAssembly" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="zCommandAssembly">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="zCommandClassName">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="baseClass" type="xs:string" use="required" />
                                          <xs:attribute name="assemblyPath" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DEFAULT">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                          <xs:attribute name="defaultAssembly" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                        <xs:attribute name="link" type="xs:string" use="required" />
                        <xs:attribute name="ref" type="xs:string" use="required" />
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="BravoServerConstraint">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element maxOccurs="unbounded" name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="name" type="xs:string" use="optional" />
                                    <xs:attribute name="type" type="xs:string" use="optional" />
                                    <xs:attribute name="defaultClass" type="xs:string" use="optional" />
                                    <xs:attribute name="defaultAssembly" type="xs:string" use="optional" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="Assembly">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="ClassName">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="baseClass" type="xs:string" use="required" />
                                          <xs:attribute name="defaultAssembly" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="zCommandAssembly">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="zCommandClassName">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="baseClass" type="xs:string" use="required" />
                                          <xs:attribute name="assemblyPath" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DataMember">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element maxOccurs="unbounded" name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="format" type="xs:string" use="required" />
                                          <xs:attribute name="tablePattern" type="xs:string" use="optional" />
                                          <xs:attribute name="tableNamePath" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="Parameters">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="tableNamePath" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                                <xs:element name="DEFAULT">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippets">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element maxOccurs="unbounded" name="Snippet">
                                              <xs:complexType>
                                                <xs:attribute name="type" type="xs:string" use="optional" />
                                                <xs:attribute name="defaultClass" type="xs:string" use="optional" />
                                                <xs:attribute name="name" type="xs:string" use="optional" />
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                      <xs:element name="DEFAULT">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element name="Snippets">
                                              <xs:complexType>
                                                <xs:sequence>
                                                  <xs:element name="Snippet">
                                                    <xs:complexType>
                                                      <xs:attribute name="type" type="xs:string" use="required" />
                                                      <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                                    </xs:complexType>
                                                  </xs:element>
                                                </xs:sequence>
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="zSourceValueMember">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="tableNamePath" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="zSourceReturnMember">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="format" type="xs:string" use="required" />
                                          <xs:attribute name="tableNamePath" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="zTargetValueMember">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="tableNamePath" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DEFAULT">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                          <xs:attribute name="defaultAssembly" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                        <xs:attribute name="link" type="xs:string" use="required" />
                        <xs:attribute name="ref" type="xs:string" use="required" />
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="BravoAddRowEvaluator">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element maxOccurs="unbounded" name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="name" type="xs:string" use="optional" />
                                    <xs:attribute name="type" type="xs:string" use="optional" />
                                    <xs:attribute name="defaultClass" type="xs:string" use="optional" />
                                    <xs:attribute name="defaultAssembly" type="xs:string" use="optional" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="Assembly">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="ClassName">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="baseClass" type="xs:string" use="required" />
                                          <xs:attribute name="defaultAssembly" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DataMember">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="tableNamePath" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DefaultValues">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="tableNamePath" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                                <xs:element name="DEFAULT" />
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DEFAULT">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                          <xs:attribute name="defaultAssembly" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                        <xs:attribute name="link" type="xs:string" use="required" />
                        <xs:attribute name="ref" type="xs:string" use="required" />
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="BravoDeleteRowEvaluator">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element maxOccurs="unbounded" name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="name" type="xs:string" use="optional" />
                                    <xs:attribute name="type" type="xs:string" use="optional" />
                                    <xs:attribute name="defaultClass" type="xs:string" use="optional" />
                                    <xs:attribute name="defaultAssembly" type="xs:string" use="optional" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="Assembly">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="ClassName">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="baseClass" type="xs:string" use="required" />
                                          <xs:attribute name="defaultAssembly" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DataMember">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="tableNamePath" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DEFAULT">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                          <xs:attribute name="defaultAssembly" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                        <xs:attribute name="link" type="xs:string" use="required" />
                        <xs:attribute name="ref" type="xs:string" use="required" />
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="BravoCopyValue">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element maxOccurs="unbounded" name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="name" type="xs:string" use="optional" />
                                    <xs:attribute name="type" type="xs:string" use="optional" />
                                    <xs:attribute name="defaultClass" type="xs:string" use="optional" />
                                    <xs:attribute name="defaultAssembly" type="xs:string" use="optional" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="Assembly">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="ClassName">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="baseClass" type="xs:string" use="required" />
                                          <xs:attribute name="defaultAssembly" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="CopyValues">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="tableNamePath" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                                <xs:element name="DEFAULT" />
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DEFAULT">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                          <xs:attribute name="defaultAssembly" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                        <xs:attribute name="link" type="xs:string" use="required" />
                        <xs:attribute name="ref" type="xs:string" use="required" />
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="BravoTableAggregator">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element maxOccurs="unbounded" name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="name" type="xs:string" use="optional" />
                                    <xs:attribute name="type" type="xs:string" use="optional" />
                                    <xs:attribute name="defaultClass" type="xs:string" use="optional" />
                                    <xs:attribute name="defaultAssembly" type="xs:string" use="optional" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="Assembly">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="ClassName">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="baseClass" type="xs:string" use="required" />
                                          <xs:attribute name="defaultAssembly" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DataMember">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="tableNamePath" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="Groups">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="tableNamePath" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                                <xs:element name="DEFAULT">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippets">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element name="Snippet">
                                              <xs:complexType>
                                                <xs:attribute name="type" type="xs:string" use="required" />
                                                <xs:attribute name="format" type="xs:string" use="required" />
                                                <xs:attribute name="tablePattern" type="xs:string" use="required" />
                                                <xs:attribute name="tableNamePath" type="xs:string" use="required" />
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="SumValues">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="tableNamePath" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                                <xs:element name="DEFAULT">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippets">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element name="Snippet">
                                              <xs:complexType>
                                                <xs:attribute name="type" type="xs:string" use="required" />
                                                <xs:attribute name="format" type="xs:string" use="required" />
                                                <xs:attribute name="tablePattern" type="xs:string" use="required" />
                                                <xs:attribute name="tableNamePath" type="xs:string" use="required" />
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DEFAULT">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                          <xs:attribute name="defaultAssembly" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                        <xs:attribute name="link" type="xs:string" use="required" />
                        <xs:attribute name="ref" type="xs:string" use="required" />
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="BravoAddFileEvaluator">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element maxOccurs="unbounded" name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="name" type="xs:string" use="optional" />
                                    <xs:attribute name="type" type="xs:string" use="optional" />
                                    <xs:attribute name="defaultClass" type="xs:string" use="optional" />
                                    <xs:attribute name="defaultAssembly" type="xs:string" use="optional" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="Assembly">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="ClassName">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="baseClass" type="xs:string" use="required" />
                                          <xs:attribute name="defaultAssembly" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DataMember">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="tableNamePath" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="selectedMembers">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                                <xs:element name="DEFAULT">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippets">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element name="Snippet">
                                              <xs:complexType>
                                                <xs:attribute name="type" type="xs:string" use="required" />
                                                <xs:attribute name="tableNamePath" type="xs:string" use="required" />
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DEFAULT">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                          <xs:attribute name="defaultAssembly" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                        <xs:attribute name="link" type="xs:string" use="required" />
                        <xs:attribute name="ref" type="xs:string" use="required" />
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="BravoTimeAttendanceEvaluator">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element maxOccurs="unbounded" name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="name" type="xs:string" use="optional" />
                                    <xs:attribute name="type" type="xs:string" use="optional" />
                                    <xs:attribute name="defaultClass" type="xs:string" use="optional" />
                                    <xs:attribute name="defaultAssembly" type="xs:string" use="optional" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DataMember">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="format" type="xs:string" use="required" />
                                          <xs:attribute name="tablePattern" type="xs:string" use="required" />
                                          <xs:attribute name="tableNamePath" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="selectedMembers">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                                <xs:element name="DEFAULT">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippets">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element name="Snippet">
                                              <xs:complexType>
                                                <xs:attribute name="type" type="xs:string" use="required" />
                                                <xs:attribute name="tablePattern" type="xs:string" use="required" />
                                                <xs:attribute name="tableNamePath" type="xs:string" use="required" />
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DEFAULT">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                          <xs:attribute name="defaultAssembly" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                        <xs:attribute name="link" type="xs:string" use="required" />
                        <xs:attribute name="ref" type="xs:string" use="required" />
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="BravoSendDataChange">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element maxOccurs="unbounded" name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="name" type="xs:string" use="optional" />
                                    <xs:attribute name="type" type="xs:string" use="optional" />
                                    <xs:attribute name="defaultClass" type="xs:string" use="optional" />
                                    <xs:attribute name="defaultAssembly" type="xs:string" use="optional" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DataMember">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="tableNamePath" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DEFAULT">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                          <xs:attribute name="defaultAssembly" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                        <xs:attribute name="link" type="xs:string" use="required" />
                        <xs:attribute name="ref" type="xs:string" use="required" />
                      </xs:complexType>
                    </xs:element>
                  </xs:sequence>
                </xs:complexType>
              </xs:element>
              <xs:element name="EvaluatorTemplate">
                <xs:complexType>
                  <xs:sequence>
                    <xs:element name="Snippets">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element maxOccurs="unbounded" name="Snippet">
                            <xs:complexType>
                              <xs:attribute name="name" type="xs:string" use="optional" />
                              <xs:attribute name="type" type="xs:string" use="optional" />
                              <xs:attribute name="defaultClass" type="xs:string" use="optional" />
                              <xs:attribute name="defaultAssembly" type="xs:string" use="optional" />
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="zAllocationBaseMember">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="type" type="xs:string" use="required" />
                                    <xs:attribute name="tablePattern" type="xs:string" use="required" />
                                    <xs:attribute name="tableNamePath" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="Assembly">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="type" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="ClassName">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="type" type="xs:string" use="required" />
                                    <xs:attribute name="baseClass" type="xs:string" use="required" />
                                    <xs:attribute name="defaultAssembly" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="bindingMembers">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="DEFAULT">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element maxOccurs="unbounded" name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="name" type="xs:string" use="optional" />
                                          <xs:attribute name="visibleType" type="xs:string" use="required" />
                                          <xs:attribute name="type" type="xs:string" use="optional" />
                                          <xs:attribute name="format" type="xs:string" use="optional" />
                                          <xs:attribute name="tablePattern" type="xs:string" use="optional" />
                                          <xs:attribute name="tableNamePath" type="xs:string" use="optional" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                                <xs:element name="DEFAULT">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippets">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element maxOccurs="unbounded" name="Snippet">
                                              <xs:complexType>
                                                <xs:attribute name="name" type="xs:string" use="required" />
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                      <xs:element name="DataMember">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element name="Snippets">
                                              <xs:complexType>
                                                <xs:sequence>
                                                  <xs:element name="Snippet">
                                                    <xs:complexType>
                                                      <xs:attribute name="type" type="xs:string" use="required" />
                                                      <xs:attribute name="format" type="xs:string" use="required" />
                                                      <xs:attribute name="tablePattern" type="xs:string" use="required" />
                                                      <xs:attribute name="tableNamePath" type="xs:string" use="required" />
                                                    </xs:complexType>
                                                  </xs:element>
                                                </xs:sequence>
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="Controls">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element maxOccurs="unbounded" name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="name" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="Name">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="format" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="Select">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="DataMember">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="type" type="xs:string" use="required" />
                                    <xs:attribute name="format" type="xs:string" use="required" />
                                    <xs:attribute name="tablePattern" type="xs:string" use="required" />
                                    <xs:attribute name="tableNamePath" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="DEFAULT">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="type" type="xs:string" use="required" />
                                    <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                    <xs:attribute name="defaultAssembly" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                  </xs:sequence>
                  <xs:attribute name="link" type="xs:string" use="required" />
                  <xs:attribute name="ref" type="xs:string" use="required" />
                  <xs:attribute name="condition" type="xs:string" use="required" />
                </xs:complexType>
              </xs:element>
              <xs:element name="ValidatorClass">
                <xs:complexType>
                  <xs:sequence>
                    <xs:element name="BravoServerConstraintValidator">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element maxOccurs="unbounded" name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="name" type="xs:string" use="optional" />
                                    <xs:attribute name="type" type="xs:string" use="optional" />
                                    <xs:attribute name="defaultClass" type="xs:string" use="optional" />
                                    <xs:attribute name="defaultAssembly" type="xs:string" use="optional" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="Assembly">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="ClassName">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="baseClass" type="xs:string" use="required" />
                                          <xs:attribute name="defaultAssembly" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="Parameters">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="tableNamePath" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                                <xs:element name="DEFAULT">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippets">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element maxOccurs="unbounded" name="Snippet">
                                              <xs:complexType>
                                                <xs:attribute name="type" type="xs:string" use="optional" />
                                                <xs:attribute name="defaultClass" type="xs:string" use="optional" />
                                                <xs:attribute name="name" type="xs:string" use="optional" />
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                      <xs:element name="DEFAULT">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element name="Snippets">
                                              <xs:complexType>
                                                <xs:sequence>
                                                  <xs:element name="Snippet">
                                                    <xs:complexType>
                                                      <xs:attribute name="type" type="xs:string" use="required" />
                                                      <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                                    </xs:complexType>
                                                  </xs:element>
                                                </xs:sequence>
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DEFAULT">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                          <xs:attribute name="defaultAssembly" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                  </xs:sequence>
                </xs:complexType>
              </xs:element>
              <xs:element name="ValidatorTemplate">
                <xs:complexType>
                  <xs:sequence>
                    <xs:element name="Snippets">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element maxOccurs="unbounded" name="Snippet">
                            <xs:complexType>
                              <xs:attribute name="name" type="xs:string" use="optional" />
                              <xs:attribute name="type" type="xs:string" use="optional" />
                              <xs:attribute name="defaultClass" type="xs:string" use="optional" />
                              <xs:attribute name="defaultAssembly" type="xs:string" use="optional" />
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="Assembly">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="type" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="ClassName">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="type" type="xs:string" use="required" />
                                    <xs:attribute name="baseClass" type="xs:string" use="required" />
                                    <xs:attribute name="defaultAssembly" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="SourceColumn">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="type" type="xs:string" use="required" />
                                    <xs:attribute name="format" type="xs:string" use="required" />
                                    <xs:attribute name="tablePattern" type="xs:string" use="required" />
                                    <xs:attribute name="tableNamePath" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="TargetColumn">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="type" type="xs:string" use="required" />
                                    <xs:attribute name="format" type="xs:string" use="required" />
                                    <xs:attribute name="tablePattern" type="xs:string" use="required" />
                                    <xs:attribute name="tableNamePath" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="DEFAULT">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="type" type="xs:string" use="required" />
                                    <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                    <xs:attribute name="defaultAssembly" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                  </xs:sequence>
                  <xs:attribute name="condition" type="xs:string" use="required" />
                </xs:complexType>
              </xs:element>
              <xs:element name="ControlTemplate">
                <xs:complexType>
                  <xs:sequence>
                    <xs:element name="Snippets">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element maxOccurs="unbounded" name="Snippet">
                            <xs:complexType>
                              <xs:attribute name="name" type="xs:string" use="optional" />
                              <xs:attribute name="type" type="xs:string" use="optional" />
                              <xs:attribute name="defaultClass" type="xs:string" use="optional" />
                              <xs:attribute name="defaultAssembly" type="xs:string" use="optional" />
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="Assembly">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="type" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="ClassName">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="type" type="xs:string" use="required" />
                                    <xs:attribute name="baseClass" type="xs:string" use="required" />
                                    <xs:attribute name="defaultAssembly" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="selectedMembers">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="type" type="xs:string" use="required" />
                                    <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DEFAULT">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="format" type="xs:string" use="required" />
                                          <xs:attribute name="tableNamePath" type="xs:string" use="required" />
                                          <xs:attribute name="value" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="bindingMembers">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="DEFAULT">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element maxOccurs="unbounded" name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="name" type="xs:string" use="optional" />
                                          <xs:attribute name="visibleType" type="xs:string" use="required" />
                                          <xs:attribute name="type" type="xs:string" use="optional" />
                                          <xs:attribute name="format" type="xs:string" use="optional" />
                                          <xs:attribute name="tableNamePath" type="xs:string" use="optional" />
                                          <xs:attribute name="value" type="xs:string" use="optional" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                                <xs:element name="DEFAULT">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippets">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element maxOccurs="unbounded" name="Snippet">
                                              <xs:complexType>
                                                <xs:attribute name="name" type="xs:string" use="required" />
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                      <xs:element name="DataMember">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element name="Snippets">
                                              <xs:complexType>
                                                <xs:sequence>
                                                  <xs:element name="Snippet">
                                                    <xs:complexType>
                                                      <xs:attribute name="type" type="xs:string" use="required" />
                                                      <xs:attribute name="format" type="xs:string" use="required" />
                                                      <xs:attribute name="tableNamePath" type="xs:string" use="required" />
                                                      <xs:attribute name="value" type="xs:string" use="required" />
                                                    </xs:complexType>
                                                  </xs:element>
                                                </xs:sequence>
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="DataMember">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="type" type="xs:string" use="required" />
                                    <xs:attribute name="tableName" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="Select">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="type" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="DEFAULT">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="type" type="xs:string" use="required" />
                                    <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                    <xs:attribute name="defaultAssembly" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                  </xs:sequence>
                  <xs:attribute name="condition" type="xs:string" use="required" />
                </xs:complexType>
              </xs:element>
              <xs:element name="DataCollectionItemLayoutTemplate">
                <xs:complexType>
                  <xs:sequence>
                    <xs:element name="Snippets">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element maxOccurs="unbounded" name="Snippet">
                            <xs:complexType>
                              <xs:attribute name="name" type="xs:string" use="optional" />
                              <xs:attribute name="type" type="xs:string" use="optional" />
                              <xs:attribute name="defaultClass" type="xs:string" use="optional" />
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="ContentLayout">
                      <xs:complexType>
                        <xs:attribute name="declare" type="xs:string" use="required" />
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="Items">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="name" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DEFAULT">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="name" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                              <xs:attribute name="declare" type="xs:string" use="required" />
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="DEFAULT">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="type" type="xs:string" use="required" />
                                    <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                  </xs:sequence>
                </xs:complexType>
              </xs:element>
              <xs:element name="DataCollectionControlTemplate">
                <xs:complexType>
                  <xs:sequence>
                    <xs:element name="Snippets">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element maxOccurs="unbounded" name="Snippet">
                            <xs:complexType>
                              <xs:attribute name="name" type="xs:string" use="optional" />
                              <xs:attribute name="type" type="xs:string" use="optional" />
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="Assembly">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="type" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="ClassName">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="type" type="xs:string" use="required" />
                                    <xs:attribute name="baseClass" type="xs:string" use="required" />
                                    <xs:attribute name="defaultAssembly" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="GroupLayout">
                      <xs:complexType>
                        <xs:attribute name="declare" type="xs:string" use="required" />
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="ItemLayout">
                      <xs:complexType>
                        <xs:attribute name="declare" type="xs:string" use="required" />
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="EmptyItemLayout">
                      <xs:complexType>
                        <xs:attribute name="declare" type="xs:string" use="required" />
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="dropExecute">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="name" type="xs:string" use="required" />
                                    <xs:attribute name="type" type="xs:string" use="required" />
                                    <xs:attribute name="format" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DEFAULT">
                            <xs:complexType>
                              <xs:attribute name="declare" type="xs:string" use="required" />
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="Execute">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="name" type="xs:string" use="required" />
                                    <xs:attribute name="type" type="xs:string" use="required" />
                                    <xs:attribute name="format" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DEFAULT">
                            <xs:complexType>
                              <xs:attribute name="declare" type="xs:string" use="required" />
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="listLayout">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="type" type="xs:string" use="required" />
                                    <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DEFAULT">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="gridLayout">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="type" type="xs:string" use="required" />
                                    <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DEFAULT">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="orgChartLayout">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="type" type="xs:string" use="required" />
                                    <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DEFAULT">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="DataMember">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="type" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="DEFAULT">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="type" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                  </xs:sequence>
                </xs:complexType>
              </xs:element>
              <xs:element name="ControlClass">
                <xs:complexType>
                  <xs:sequence>
                    <xs:element name="TableLayoutPanel">
                      <xs:complexType>
                        <xs:attribute name="declare" type="xs:string" use="required" />
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="BravoTableLayoutPanel">
                      <xs:complexType>
                        <xs:attribute name="declare" type="xs:string" use="required" />
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="BravoExpandingPanel">
                      <xs:complexType>
                        <xs:attribute name="declare" type="xs:string" use="required" />
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="BravoExtendedPanel">
                      <xs:complexType>
                        <xs:attribute name="declare" type="xs:string" use="required" />
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="BravoGroupPanel">
                      <xs:complexType>
                        <xs:attribute name="declare" type="xs:string" use="required" />
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="BravoDataServiceTextBox">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element maxOccurs="unbounded" name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="name" type="xs:string" use="optional" />
                                    <xs:attribute name="type" type="xs:string" use="optional" />
                                    <xs:attribute name="defaultClass" type="xs:string" use="optional" />
                                    <xs:attribute name="defaultAssembly" type="xs:string" use="optional" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="Assembly">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="ClassName">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="baseClass" type="xs:string" use="required" />
                                          <xs:attribute name="defaultAssembly" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="selectedMembers">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                                <xs:element name="DEFAULT">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippets">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element name="Snippet">
                                              <xs:complexType>
                                                <xs:attribute name="type" type="xs:string" use="required" />
                                                <xs:attribute name="format" type="xs:string" use="required" />
                                                <xs:attribute name="tableNamePath" type="xs:string" use="required" />
                                                <xs:attribute name="value" type="xs:string" use="required" />
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DataMember">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="tableName" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="Select">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DEFAULT">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                          <xs:attribute name="defaultAssembly" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="BravoTabControl">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element maxOccurs="unbounded" name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="name" type="xs:string" use="optional" />
                                    <xs:attribute name="type" type="xs:string" use="optional" />
                                    <xs:attribute name="defaultClass" type="xs:string" use="optional" />
                                    <xs:attribute name="defaultAssembly" type="xs:string" use="optional" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="Assembly">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="ClassName">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="baseClass" type="xs:string" use="required" />
                                          <xs:attribute name="defaultAssembly" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="Pages">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="name" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                                <xs:element name="DEFAULT">
                                  <xs:complexType>
                                    <xs:attribute name="declare" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DEFAULT">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                          <xs:attribute name="defaultAssembly" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="BravoDataGrid">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element maxOccurs="unbounded" name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="name" type="xs:string" use="optional" />
                                    <xs:attribute name="type" type="xs:string" use="optional" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="Assembly">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="ClassName">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="baseClass" type="xs:string" use="required" />
                                          <xs:attribute name="defaultAssembly" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="Cols">
                            <xs:complexType>
                              <xs:attribute name="declare" type="xs:string" use="required" />
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DataMember">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="Groups">
                            <xs:complexType>
                              <xs:attribute name="declare" type="xs:string" use="required" />
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="Rows">
                            <xs:complexType>
                              <xs:attribute name="declare" type="xs:string" use="required" />
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="zAddNewColumnName">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="tableNamePath" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="zBarColorMember">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="tableNamePath" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="zCarryingColumns">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="format" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="zDisplayTextMember">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="tableNamePath" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="zEndTimeMember">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="tableNamePath" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="zMakingTreeNodeKeyColName">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="zNumericScaleMember">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="format" type="xs:string" use="required" />
                                          <xs:attribute name="tableNamePath" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="zStartTimeMember">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="tableNamePath" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="zTreeColName">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="Styles">
                            <xs:complexType>
                              <xs:attribute name="declare" type="xs:string" use="required" />
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="SumColumns">
                            <xs:complexType>
                              <xs:attribute name="declare" type="xs:string" use="required" />
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DEFAULT">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="BravoCheckList">
                      <xs:complexType>
                        <xs:attribute name="declare" type="xs:string" use="required" />
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="BravoOptionControl">
                      <xs:complexType>
                        <xs:attribute name="declare" type="xs:string" use="required" />
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="BravoDataCollectionControl">
                      <xs:complexType>
                        <xs:attribute name="declare" type="xs:string" use="required" />
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="BravoDataListControl">
                      <xs:complexType>
                        <xs:attribute name="declare" type="xs:string" use="required" />
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="BravoLookupListControl">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="ServerCommand">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="name" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                                <xs:element name="DEFAULT">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippets">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element maxOccurs="unbounded" name="Snippet">
                                              <xs:complexType>
                                                <xs:attribute name="name" type="xs:string" use="required" />
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                      <xs:element name="Command">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element name="Snippets">
                                              <xs:complexType>
                                                <xs:sequence>
                                                  <xs:element name="Snippet">
                                                    <xs:complexType>
                                                      <xs:attribute name="type" type="xs:string" use="required" />
                                                    </xs:complexType>
                                                  </xs:element>
                                                </xs:sequence>
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                      <xs:element name="Parameters">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element name="Snippets">
                                              <xs:complexType>
                                                <xs:sequence>
                                                  <xs:element name="Snippet">
                                                    <xs:complexType>
                                                      <xs:attribute name="type" type="xs:string" use="required" />
                                                      <xs:attribute name="tableNamePath" type="xs:string" use="required" />
                                                    </xs:complexType>
                                                  </xs:element>
                                                </xs:sequence>
                                              </xs:complexType>
                                            </xs:element>
                                            <xs:element name="DEFAULT">
                                              <xs:complexType>
                                                <xs:sequence>
                                                  <xs:element name="Snippets">
                                                    <xs:complexType>
                                                      <xs:sequence>
                                                        <xs:element maxOccurs="unbounded" name="Snippet">
                                                          <xs:complexType>
                                                            <xs:attribute name="type" type="xs:string" use="optional" />
                                                            <xs:attribute name="defaultClass" type="xs:string" use="optional" />
                                                            <xs:attribute name="name" type="xs:string" use="optional" />
                                                          </xs:complexType>
                                                        </xs:element>
                                                      </xs:sequence>
                                                    </xs:complexType>
                                                  </xs:element>
                                                  <xs:element name="DEFAULT">
                                                    <xs:complexType>
                                                      <xs:sequence>
                                                        <xs:element name="Snippets">
                                                          <xs:complexType>
                                                            <xs:sequence>
                                                              <xs:element name="Snippet">
                                                                <xs:complexType>
                                                                  <xs:attribute name="type" type="xs:string" use="required" />
                                                                  <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                                                </xs:complexType>
                                                              </xs:element>
                                                            </xs:sequence>
                                                          </xs:complexType>
                                                        </xs:element>
                                                      </xs:sequence>
                                                    </xs:complexType>
                                                  </xs:element>
                                                </xs:sequence>
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="TableName">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="BindingMembers">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="format" type="xs:string" use="required" />
                                          <xs:attribute name="tableNamePath" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                                <xs:element name="DEFAULT">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippets">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element name="Snippet">
                                              <xs:complexType>
                                                <xs:attribute name="type" type="xs:string" use="required" />
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                      <xs:element name="DEFAULT">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element name="Snippets">
                                              <xs:complexType>
                                                <xs:sequence>
                                                  <xs:element maxOccurs="unbounded" name="Snippet">
                                                    <xs:complexType>
                                                      <xs:attribute name="name" type="xs:string" use="required" />
                                                    </xs:complexType>
                                                  </xs:element>
                                                </xs:sequence>
                                              </xs:complexType>
                                            </xs:element>
                                            <xs:element name="DataMember">
                                              <xs:complexType>
                                                <xs:sequence>
                                                  <xs:element name="Snippets">
                                                    <xs:complexType>
                                                      <xs:sequence>
                                                        <xs:element name="Snippet">
                                                          <xs:complexType>
                                                            <xs:attribute name="type" type="xs:string" use="required" />
                                                          </xs:complexType>
                                                        </xs:element>
                                                      </xs:sequence>
                                                    </xs:complexType>
                                                  </xs:element>
                                                </xs:sequence>
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                        <xs:attribute name="declare" type="xs:string" use="required" />
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="BravoMapControl">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element maxOccurs="unbounded" name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="name" type="xs:string" use="optional" />
                                    <xs:attribute name="type" type="xs:string" use="optional" />
                                    <xs:attribute name="defaultClass" type="xs:string" use="optional" />
                                    <xs:attribute name="defaultAssembly" type="xs:string" use="optional" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="Assembly">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="ClassName">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="baseClass" type="xs:string" use="required" />
                                          <xs:attribute name="defaultAssembly" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DataMember">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="tableName" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="droppedPinMembers">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element maxOccurs="unbounded" name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="name" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                                <xs:element name="DEFAULT">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippets">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element name="Snippet">
                                              <xs:complexType>
                                                <xs:attribute name="type" type="xs:string" use="required" />
                                                <xs:attribute name="tableName" type="xs:string" use="required" />
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="pushpinDefinition">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="name" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                                <xs:element name="DEFAULT">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippets">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element maxOccurs="unbounded" name="Snippet">
                                              <xs:complexType>
                                                <xs:attribute name="name" type="xs:string" use="optional" />
                                                <xs:attribute name="type" type="xs:string" use="optional" />
                                                <xs:attribute name="defaultClass" type="xs:string" use="optional" />
                                                <xs:attribute name="defaultAssembly" type="xs:string" use="optional" />
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                      <xs:element name="ClassName">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element name="Snippets">
                                              <xs:complexType>
                                                <xs:sequence>
                                                  <xs:element name="Snippet">
                                                    <xs:complexType>
                                                      <xs:attribute name="type" type="xs:string" use="required" />
                                                      <xs:attribute name="baseClass" type="xs:string" use="required" />
                                                      <xs:attribute name="defaultAssembly" type="xs:string" use="required" />
                                                    </xs:complexType>
                                                  </xs:element>
                                                </xs:sequence>
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                      <xs:element name="slices">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element name="Snippets">
                                              <xs:complexType>
                                                <xs:sequence>
                                                  <xs:element name="Snippet">
                                                    <xs:complexType>
                                                      <xs:attribute name="name" type="xs:string" use="required" />
                                                    </xs:complexType>
                                                  </xs:element>
                                                </xs:sequence>
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                      <xs:element name="bars">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element name="Snippets">
                                              <xs:complexType>
                                                <xs:sequence>
                                                  <xs:element name="Snippet">
                                                    <xs:complexType>
                                                      <xs:attribute name="name" type="xs:string" use="required" />
                                                    </xs:complexType>
                                                  </xs:element>
                                                </xs:sequence>
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                      <xs:element name="DEFAULT">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element name="Snippets">
                                              <xs:complexType>
                                                <xs:sequence>
                                                  <xs:element name="Snippet">
                                                    <xs:complexType>
                                                      <xs:attribute name="type" type="xs:string" use="required" />
                                                      <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                                      <xs:attribute name="defaultAssembly" type="xs:string" use="required" />
                                                    </xs:complexType>
                                                  </xs:element>
                                                </xs:sequence>
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="polylineDefinition">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="name" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                                <xs:element name="DEFAULT">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippets">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element maxOccurs="unbounded" name="Snippet">
                                              <xs:complexType>
                                                <xs:attribute name="name" type="xs:string" use="optional" />
                                                <xs:attribute name="type" type="xs:string" use="optional" />
                                                <xs:attribute name="defaultClass" type="xs:string" use="optional" />
                                                <xs:attribute name="defaultAssembly" type="xs:string" use="optional" />
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                      <xs:element name="DEFAULT">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element name="Snippets">
                                              <xs:complexType>
                                                <xs:sequence>
                                                  <xs:element name="Snippet">
                                                    <xs:complexType>
                                                      <xs:attribute name="type" type="xs:string" use="required" />
                                                      <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                                      <xs:attribute name="defaultAssembly" type="xs:string" use="required" />
                                                    </xs:complexType>
                                                  </xs:element>
                                                </xs:sequence>
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="polygonDefinition">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="name" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                                <xs:element name="DEFAULT">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippets">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element maxOccurs="unbounded" name="Snippet">
                                              <xs:complexType>
                                                <xs:attribute name="name" type="xs:string" use="optional" />
                                                <xs:attribute name="type" type="xs:string" use="optional" />
                                                <xs:attribute name="defaultClass" type="xs:string" use="optional" />
                                                <xs:attribute name="defaultAssembly" type="xs:string" use="optional" />
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                      <xs:element name="DEFAULT">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element name="Snippets">
                                              <xs:complexType>
                                                <xs:sequence>
                                                  <xs:element name="Snippet">
                                                    <xs:complexType>
                                                      <xs:attribute name="type" type="xs:string" use="required" />
                                                      <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                                      <xs:attribute name="defaultAssembly" type="xs:string" use="required" />
                                                    </xs:complexType>
                                                  </xs:element>
                                                </xs:sequence>
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="directionsDefinition">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="name" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                                <xs:element name="DEFAULT">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippets">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element maxOccurs="unbounded" name="Snippet">
                                              <xs:complexType>
                                                <xs:attribute name="name" type="xs:string" use="optional" />
                                                <xs:attribute name="type" type="xs:string" use="optional" />
                                                <xs:attribute name="defaultClass" type="xs:string" use="optional" />
                                                <xs:attribute name="defaultAssembly" type="xs:string" use="optional" />
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                      <xs:element name="DEFAULT">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element name="Snippets">
                                              <xs:complexType>
                                                <xs:sequence>
                                                  <xs:element name="Snippet">
                                                    <xs:complexType>
                                                      <xs:attribute name="type" type="xs:string" use="required" />
                                                      <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                                      <xs:attribute name="defaultAssembly" type="xs:string" use="required" />
                                                    </xs:complexType>
                                                  </xs:element>
                                                </xs:sequence>
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DEFAULT">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                          <xs:attribute name="defaultAssembly" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="BravoScheduleControl">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element maxOccurs="unbounded" name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="name" type="xs:string" use="optional" />
                                    <xs:attribute name="type" type="xs:string" use="optional" />
                                    <xs:attribute name="defaultClass" type="xs:string" use="optional" />
                                    <xs:attribute name="defaultAssembly" type="xs:string" use="optional" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="Assembly">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="ClassName">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="baseClass" type="xs:string" use="required" />
                                          <xs:attribute name="defaultAssembly" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="selectedMembers">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                                <xs:element name="DEFAULT">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippets">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element name="Snippet">
                                              <xs:complexType>
                                                <xs:attribute name="type" type="xs:string" use="required" />
                                                <xs:attribute name="format" type="xs:string" use="required" />
                                                <xs:attribute name="tableNamePath" type="xs:string" use="required" />
                                                <xs:attribute name="value" type="xs:string" use="required" />
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DataMember">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="tableName" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="cols">
                            <xs:complexType>
                              <xs:attribute name="declare" type="xs:string" use="required" />
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="groups">
                            <xs:complexType>
                              <xs:attribute name="declare" type="xs:string" use="required" />
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="sumCols">
                            <xs:complexType>
                              <xs:attribute name="declare" type="xs:string" use="required" />
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="styles">
                            <xs:complexType>
                              <xs:attribute name="declare" type="xs:string" use="required" />
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="timeScaleCols">
                            <xs:complexType>
                              <xs:attribute name="declare" type="xs:string" use="required" />
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="scheduleStyle">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="name" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                                <xs:element name="DEFAULT">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippets">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element maxOccurs="unbounded" name="Snippet">
                                              <xs:complexType>
                                                <xs:attribute name="name" type="xs:string" use="required" />
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                      <xs:element name="Alignment">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element name="Snippets">
                                              <xs:complexType>
                                                <xs:sequence>
                                                  <xs:element name="Snippet">
                                                    <xs:complexType>
                                                      <xs:attribute name="type" type="xs:string" use="required" />
                                                      <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                                    </xs:complexType>
                                                  </xs:element>
                                                </xs:sequence>
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="dropData">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="name" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                                <xs:element name="DEFAULT">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippets">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element maxOccurs="unbounded" name="Snippet">
                                              <xs:complexType>
                                                <xs:attribute name="name" type="xs:string" use="required" />
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="execute">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="name" type="xs:string" use="required" />
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="format" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                                <xs:element name="DEFAULT">
                                  <xs:complexType>
                                    <xs:attribute name="declare" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="mapExecute">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="name" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                                <xs:element name="DEFAULT">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippets">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element maxOccurs="unbounded" name="Snippet">
                                              <xs:complexType>
                                                <xs:attribute name="name" type="xs:string" use="required" />
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                      <xs:element name="Execute">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element name="Snippets">
                                              <xs:complexType>
                                                <xs:sequence>
                                                  <xs:element name="Snippet">
                                                    <xs:complexType>
                                                      <xs:attribute name="name" type="xs:string" use="required" />
                                                      <xs:attribute name="type" type="xs:string" use="required" />
                                                      <xs:attribute name="format" type="xs:string" use="required" />
                                                    </xs:complexType>
                                                  </xs:element>
                                                </xs:sequence>
                                              </xs:complexType>
                                            </xs:element>
                                            <xs:element name="DEFAULT">
                                              <xs:complexType>
                                                <xs:attribute name="declare" type="xs:string" use="required" />
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="commandExecute">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="name" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                                <xs:element name="DEFAULT">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippets">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element maxOccurs="unbounded" name="Snippet">
                                              <xs:complexType>
                                                <xs:attribute name="name" type="xs:string" use="required" />
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                      <xs:element name="Execute">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element name="Snippets">
                                              <xs:complexType>
                                                <xs:sequence>
                                                  <xs:element name="Snippet">
                                                    <xs:complexType>
                                                      <xs:attribute name="name" type="xs:string" use="required" />
                                                      <xs:attribute name="type" type="xs:string" use="required" />
                                                      <xs:attribute name="format" type="xs:string" use="required" />
                                                    </xs:complexType>
                                                  </xs:element>
                                                </xs:sequence>
                                              </xs:complexType>
                                            </xs:element>
                                            <xs:element name="DEFAULT">
                                              <xs:complexType>
                                                <xs:attribute name="declare" type="xs:string" use="required" />
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="dropExecute">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="name" type="xs:string" use="required" />
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="format" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                                <xs:element name="DEFAULT">
                                  <xs:complexType>
                                    <xs:attribute name="declare" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DEFAULT">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                          <xs:attribute name="defaultAssembly" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                  </xs:sequence>
                </xs:complexType>
              </xs:element>
              <xs:element name="OptionCheckListTemplate">
                <xs:complexType>
                  <xs:sequence>
                    <xs:element name="Snippets">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element maxOccurs="unbounded" name="Snippet">
                            <xs:complexType>
                              <xs:attribute name="name" type="xs:string" use="optional" />
                              <xs:attribute name="type" type="xs:string" use="optional" />
                              <xs:attribute name="defaultClass" type="xs:string" use="optional" />
                              <xs:attribute name="defaultAssembly" type="xs:string" use="optional" />
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="Controls">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="name" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DEFAULT">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element maxOccurs="unbounded" name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="name" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="DEFAULT">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element maxOccurs="unbounded" name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="name" type="xs:string" use="optional" />
                                    <xs:attribute name="type" type="xs:string" use="optional" />
                                    <xs:attribute name="defaultClass" type="xs:string" use="optional" />
                                    <xs:attribute name="defaultAssembly" type="xs:string" use="optional" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                  </xs:sequence>
                </xs:complexType>
              </xs:element>
              <xs:element name="GridSumColumnCollectionTemplate">
                <xs:complexType>
                  <xs:sequence>
                    <xs:element name="Snippets">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element maxOccurs="unbounded" name="Snippet">
                            <xs:complexType>
                              <xs:attribute name="name" type="xs:string" use="optional" />
                              <xs:attribute name="type" type="xs:string" use="optional" />
                              <xs:attribute name="tagPath" type="xs:string" use="optional" />
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="DEFAULT">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element maxOccurs="unbounded" name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="name" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="function">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                  </xs:sequence>
                </xs:complexType>
              </xs:element>
              <xs:element name="GridGroupCollectionTemplate">
                <xs:complexType>
                  <xs:sequence>
                    <xs:element name="Snippets">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippet">
                            <xs:complexType>
                              <xs:attribute name="type" type="xs:string" use="required" />
                              <xs:attribute name="tagPath" type="xs:string" use="required" />
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="DEFAULT">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element maxOccurs="unbounded" name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="name" type="xs:string" use="optional" />
                                    <xs:attribute name="type" type="xs:string" use="optional" />
                                    <xs:attribute name="defaultClass" type="xs:string" use="optional" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="Name">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="tagPath" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DEFAULT">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                  </xs:sequence>
                </xs:complexType>
              </xs:element>
              <xs:element name="GridRowCollectionTemplate">
                <xs:complexType>
                  <xs:sequence>
                    <xs:element name="Snippets">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippet">
                            <xs:complexType>
                              <xs:attribute name="name" type="xs:string" use="required" />
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="DEFAULT">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="type" type="xs:string" use="required" />
                                    <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DEFAULT">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                        <xs:attribute name="pattern" type="xs:string" use="required" />
                      </xs:complexType>
                    </xs:element>
                  </xs:sequence>
                </xs:complexType>
              </xs:element>
              <xs:element name="GridColumnCollectionTemplate">
                <xs:complexType>
                  <xs:sequence>
                    <xs:element name="Snippets">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippet">
                            <xs:complexType>
                              <xs:attribute name="type" type="xs:string" use="required" />
                              <xs:attribute name="tableNamePath" type="xs:string" use="required" />
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="DEFAULT">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element maxOccurs="unbounded" name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="name" type="xs:string" use="optional" />
                                    <xs:attribute name="type" type="xs:string" use="optional" />
                                    <xs:attribute name="defaultClass" type="xs:string" use="optional" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="Editor">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element maxOccurs="unbounded" name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="name" type="xs:string" use="optional" />
                                          <xs:attribute name="type" type="xs:string" use="optional" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="optional" />
                                          <xs:attribute name="defaultAssembly" type="xs:string" use="optional" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                                <xs:element name="Assembly">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippets">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element name="Snippet">
                                              <xs:complexType>
                                                <xs:attribute name="type" type="xs:string" use="required" />
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                                <xs:element name="bindingMembers">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="DEFAULT">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element name="Snippets">
                                              <xs:complexType>
                                                <xs:sequence>
                                                  <xs:element maxOccurs="unbounded" name="Snippet">
                                                    <xs:complexType>
                                                      <xs:attribute name="name" type="xs:string" use="optional" />
                                                      <xs:attribute name="visibleType" type="xs:string" use="required" />
                                                      <xs:attribute name="type" type="xs:string" use="optional" />
                                                      <xs:attribute name="format" type="xs:string" use="optional" />
                                                      <xs:attribute name="tableNamePath" type="xs:string" use="optional" />
                                                    </xs:complexType>
                                                  </xs:element>
                                                </xs:sequence>
                                              </xs:complexType>
                                            </xs:element>
                                            <xs:element name="DEFAULT">
                                              <xs:complexType>
                                                <xs:sequence>
                                                  <xs:element name="Snippets">
                                                    <xs:complexType>
                                                      <xs:sequence>
                                                        <xs:element maxOccurs="unbounded" name="Snippet">
                                                          <xs:complexType>
                                                            <xs:attribute name="name" type="xs:string" use="required" />
                                                          </xs:complexType>
                                                        </xs:element>
                                                      </xs:sequence>
                                                    </xs:complexType>
                                                  </xs:element>
                                                  <xs:element name="DataMember">
                                                    <xs:complexType>
                                                      <xs:sequence>
                                                        <xs:element name="Snippets">
                                                          <xs:complexType>
                                                            <xs:sequence>
                                                              <xs:element name="Snippet">
                                                                <xs:complexType>
                                                                  <xs:attribute name="type" type="xs:string" use="required" />
                                                                  <xs:attribute name="format" type="xs:string" use="required" />
                                                                  <xs:attribute name="tableNamePath" type="xs:string" use="required" />
                                                                </xs:complexType>
                                                              </xs:element>
                                                            </xs:sequence>
                                                          </xs:complexType>
                                                        </xs:element>
                                                      </xs:sequence>
                                                    </xs:complexType>
                                                  </xs:element>
                                                </xs:sequence>
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                                <xs:element name="ClassName">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippets">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element name="Snippet">
                                              <xs:complexType>
                                                <xs:attribute name="type" type="xs:string" use="required" />
                                                <xs:attribute name="baseClass" type="xs:string" use="required" />
                                                <xs:attribute name="defaultAssembly" type="xs:string" use="required" />
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                                <xs:element name="Cols">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippets">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element name="Snippet">
                                              <xs:complexType>
                                                <xs:attribute name="name" type="xs:string" use="required" />
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                      <xs:element name="DEFAULT">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element name="Snippets">
                                              <xs:complexType>
                                                <xs:sequence>
                                                  <xs:element name="Snippet">
                                                    <xs:complexType>
                                                      <xs:attribute name="type" type="xs:string" use="required" />
                                                      <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                                    </xs:complexType>
                                                  </xs:element>
                                                </xs:sequence>
                                              </xs:complexType>
                                            </xs:element>
                                            <xs:element name="DEFAULT">
                                              <xs:complexType>
                                                <xs:sequence>
                                                  <xs:element name="Snippets">
                                                    <xs:complexType>
                                                      <xs:sequence>
                                                        <xs:element name="Snippet">
                                                          <xs:complexType>
                                                            <xs:attribute name="type" type="xs:string" use="required" />
                                                            <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                                          </xs:complexType>
                                                        </xs:element>
                                                      </xs:sequence>
                                                    </xs:complexType>
                                                  </xs:element>
                                                </xs:sequence>
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                                <xs:element name="Controls">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippets">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element name="Snippet">
                                              <xs:complexType>
                                                <xs:attribute name="type" type="xs:string" use="required" />
                                                <xs:attribute name="tagPath" type="xs:string" use="required" />
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                      <xs:element name="DEFAULT">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element name="Snippets">
                                              <xs:complexType>
                                                <xs:sequence>
                                                  <xs:element maxOccurs="unbounded" name="Snippet">
                                                    <xs:complexType>
                                                      <xs:attribute name="name" type="xs:string" use="optional" />
                                                      <xs:attribute name="type" type="xs:string" use="optional" />
                                                      <xs:attribute name="defaultClass" type="xs:string" use="optional" />
                                                      <xs:attribute name="defaultAssembly" type="xs:string" use="optional" />
                                                    </xs:complexType>
                                                  </xs:element>
                                                </xs:sequence>
                                              </xs:complexType>
                                            </xs:element>
                                            <xs:element name="Assembly">
                                              <xs:complexType>
                                                <xs:sequence>
                                                  <xs:element name="Snippets">
                                                    <xs:complexType>
                                                      <xs:sequence>
                                                        <xs:element name="Snippet">
                                                          <xs:complexType>
                                                            <xs:attribute name="type" type="xs:string" use="required" />
                                                          </xs:complexType>
                                                        </xs:element>
                                                      </xs:sequence>
                                                    </xs:complexType>
                                                  </xs:element>
                                                </xs:sequence>
                                              </xs:complexType>
                                            </xs:element>
                                            <xs:element name="bindingMembers">
                                              <xs:complexType>
                                                <xs:sequence>
                                                  <xs:element name="DEFAULT">
                                                    <xs:complexType>
                                                      <xs:sequence>
                                                        <xs:element name="Snippets">
                                                          <xs:complexType>
                                                            <xs:sequence>
                                                              <xs:element maxOccurs="unbounded" name="Snippet">
                                                                <xs:complexType>
                                                                  <xs:attribute name="name" type="xs:string" use="optional" />
                                                                  <xs:attribute name="visibleType" type="xs:string" use="required" />
                                                                  <xs:attribute name="type" type="xs:string" use="optional" />
                                                                  <xs:attribute name="format" type="xs:string" use="optional" />
                                                                  <xs:attribute name="tableNamePath" type="xs:string" use="optional" />
                                                                </xs:complexType>
                                                              </xs:element>
                                                            </xs:sequence>
                                                          </xs:complexType>
                                                        </xs:element>
                                                        <xs:element name="DEFAULT">
                                                          <xs:complexType>
                                                            <xs:sequence>
                                                              <xs:element name="Snippets">
                                                                <xs:complexType>
                                                                  <xs:sequence>
                                                                    <xs:element maxOccurs="unbounded" name="Snippet">
                                                                      <xs:complexType>
                                                                        <xs:attribute name="name" type="xs:string" use="required" />
                                                                      </xs:complexType>
                                                                    </xs:element>
                                                                  </xs:sequence>
                                                                </xs:complexType>
                                                              </xs:element>
                                                              <xs:element name="DataMember">
                                                                <xs:complexType>
                                                                  <xs:sequence>
                                                                    <xs:element name="Snippets">
                                                                      <xs:complexType>
                                                                        <xs:sequence>
                                                                          <xs:element name="Snippet">
                                                                            <xs:complexType>
                                                                              <xs:attribute name="type" type="xs:string" use="required" />
                                                                              <xs:attribute name="format" type="xs:string" use="required" />
                                                                              <xs:attribute name="tableNamePath" type="xs:string" use="required" />
                                                                            </xs:complexType>
                                                                          </xs:element>
                                                                        </xs:sequence>
                                                                      </xs:complexType>
                                                                    </xs:element>
                                                                  </xs:sequence>
                                                                </xs:complexType>
                                                              </xs:element>
                                                            </xs:sequence>
                                                          </xs:complexType>
                                                        </xs:element>
                                                      </xs:sequence>
                                                    </xs:complexType>
                                                  </xs:element>
                                                </xs:sequence>
                                              </xs:complexType>
                                            </xs:element>
                                            <xs:element name="ClassName">
                                              <xs:complexType>
                                                <xs:sequence>
                                                  <xs:element name="Snippets">
                                                    <xs:complexType>
                                                      <xs:sequence>
                                                        <xs:element name="Snippet">
                                                          <xs:complexType>
                                                            <xs:attribute name="type" type="xs:string" use="required" />
                                                            <xs:attribute name="baseClass" type="xs:string" use="required" />
                                                            <xs:attribute name="defaultAssembly" type="xs:string" use="required" />
                                                          </xs:complexType>
                                                        </xs:element>
                                                      </xs:sequence>
                                                    </xs:complexType>
                                                  </xs:element>
                                                </xs:sequence>
                                              </xs:complexType>
                                            </xs:element>
                                            <xs:element name="DEFAULT">
                                              <xs:complexType>
                                                <xs:sequence>
                                                  <xs:element name="Snippets">
                                                    <xs:complexType>
                                                      <xs:sequence>
                                                        <xs:element name="Snippet">
                                                          <xs:complexType>
                                                            <xs:attribute name="type" type="xs:string" use="required" />
                                                            <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                                            <xs:attribute name="defaultAssembly" type="xs:string" use="required" />
                                                          </xs:complexType>
                                                        </xs:element>
                                                      </xs:sequence>
                                                    </xs:complexType>
                                                  </xs:element>
                                                </xs:sequence>
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                                <xs:element name="selectedMembers">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippets">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element name="Snippet">
                                              <xs:complexType>
                                                <xs:attribute name="type" type="xs:string" use="required" />
                                                <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                      <xs:element name="DEFAULT">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element name="Snippets">
                                              <xs:complexType>
                                                <xs:sequence>
                                                  <xs:element name="Snippet">
                                                    <xs:complexType>
                                                      <xs:attribute name="type" type="xs:string" use="required" />
                                                      <xs:attribute name="visibleType" type="xs:string" use="required" />
                                                      <xs:attribute name="format" type="xs:string" use="required" />
                                                      <xs:attribute name="tableNamePath" type="xs:string" use="required" />
                                                    </xs:complexType>
                                                  </xs:element>
                                                </xs:sequence>
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                                <xs:element name="DEFAULT">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippets">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element name="Snippet">
                                              <xs:complexType>
                                                <xs:attribute name="type" type="xs:string" use="required" />
                                                <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                                <xs:attribute name="defaultAssembly" type="xs:string" use="required" />
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="Name">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="tableNamePath" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="Rows">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="name" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                                <xs:element name="DEFAULT">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippets">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element maxOccurs="unbounded" name="Snippet">
                                              <xs:complexType>
                                                <xs:attribute name="name" type="xs:string" use="required" />
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DEFAULT">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                  </xs:sequence>
                </xs:complexType>
              </xs:element>
              <xs:element name="GridStyleCollectionTemplate">
                <xs:complexType>
                  <xs:sequence>
                    <xs:element name="Snippets">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element maxOccurs="unbounded" name="Snippet">
                            <xs:complexType>
                              <xs:attribute name="name" type="xs:string" use="optional" />
                              <xs:attribute name="type" type="xs:string" use="optional" />
                              <xs:attribute name="defaultClass" type="xs:string" use="optional" />
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="StyleExpr">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element maxOccurs="unbounded" name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="name" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="Name">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="format" type="xs:string" use="required" />
                                          <xs:attribute name="tagPath" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                        <xs:attribute name="pattern" type="xs:string" use="required" />
                      </xs:complexType>
                    </xs:element>
                  </xs:sequence>
                </xs:complexType>
              </xs:element>
              <xs:element name="ParentContainerTemplate">
                <xs:complexType>
                  <xs:sequence>
                    <xs:choice maxOccurs="unbounded">
                      <xs:element name="Snippets">
                        <xs:complexType>
                          <xs:sequence>
                            <xs:element maxOccurs="unbounded" name="Snippet">
                              <xs:complexType>
                                <xs:attribute name="name" type="xs:string" use="optional" />
                                <xs:attribute name="type" type="xs:string" use="optional" />
                                <xs:attribute name="defaultClass" type="xs:string" use="optional" />
                              </xs:complexType>
                            </xs:element>
                          </xs:sequence>
                        </xs:complexType>
                      </xs:element>
                      <xs:element name="Cols">
                        <xs:complexType>
                          <xs:sequence>
                            <xs:element name="Snippets">
                              <xs:complexType>
                                <xs:sequence>
                                  <xs:element name="Snippet">
                                    <xs:complexType>
                                      <xs:attribute name="name" type="xs:string" use="required" />
                                    </xs:complexType>
                                  </xs:element>
                                </xs:sequence>
                              </xs:complexType>
                            </xs:element>
                            <xs:element name="DEFAULT">
                              <xs:complexType>
                                <xs:sequence>
                                  <xs:element name="Snippets">
                                    <xs:complexType>
                                      <xs:sequence>
                                        <xs:element name="Snippet">
                                          <xs:complexType>
                                            <xs:attribute name="type" type="xs:string" use="required" />
                                            <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                          </xs:complexType>
                                        </xs:element>
                                      </xs:sequence>
                                    </xs:complexType>
                                  </xs:element>
                                  <xs:element name="DEFAULT">
                                    <xs:complexType>
                                      <xs:sequence>
                                        <xs:element name="Snippets">
                                          <xs:complexType>
                                            <xs:sequence>
                                              <xs:element name="Snippet">
                                                <xs:complexType>
                                                  <xs:attribute name="type" type="xs:string" use="required" />
                                                  <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                                </xs:complexType>
                                              </xs:element>
                                            </xs:sequence>
                                          </xs:complexType>
                                        </xs:element>
                                      </xs:sequence>
                                    </xs:complexType>
                                  </xs:element>
                                </xs:sequence>
                              </xs:complexType>
                            </xs:element>
                          </xs:sequence>
                        </xs:complexType>
                      </xs:element>
                      <xs:element name="Rows">
                        <xs:complexType>
                          <xs:sequence>
                            <xs:element name="Snippets">
                              <xs:complexType>
                                <xs:sequence>
                                  <xs:element name="Snippet">
                                    <xs:complexType>
                                      <xs:attribute name="name" type="xs:string" use="required" />
                                    </xs:complexType>
                                  </xs:element>
                                </xs:sequence>
                              </xs:complexType>
                            </xs:element>
                            <xs:element name="DEFAULT">
                              <xs:complexType>
                                <xs:sequence>
                                  <xs:element name="Snippets">
                                    <xs:complexType>
                                      <xs:sequence>
                                        <xs:element name="Snippet">
                                          <xs:complexType>
                                            <xs:attribute name="type" type="xs:string" use="required" />
                                            <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                          </xs:complexType>
                                        </xs:element>
                                      </xs:sequence>
                                    </xs:complexType>
                                  </xs:element>
                                  <xs:element name="DEFAULT">
                                    <xs:complexType>
                                      <xs:sequence>
                                        <xs:element name="Snippets">
                                          <xs:complexType>
                                            <xs:sequence>
                                              <xs:element name="Snippet">
                                                <xs:complexType>
                                                  <xs:attribute name="type" type="xs:string" use="required" />
                                                  <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                                </xs:complexType>
                                              </xs:element>
                                            </xs:sequence>
                                          </xs:complexType>
                                        </xs:element>
                                      </xs:sequence>
                                    </xs:complexType>
                                  </xs:element>
                                </xs:sequence>
                              </xs:complexType>
                            </xs:element>
                          </xs:sequence>
                        </xs:complexType>
                      </xs:element>
                      <xs:element name="Controls">
                        <xs:complexType>
                          <xs:sequence>
                            <xs:element name="DEFAULT">
                              <xs:complexType>
                                <xs:attribute name="declare" type="xs:string" use="required" />
                              </xs:complexType>
                            </xs:element>
                          </xs:sequence>
                        </xs:complexType>
                      </xs:element>
                    </xs:choice>
                  </xs:sequence>
                </xs:complexType>
              </xs:element>
              <xs:element name="PageContainerTemplate">
                <xs:complexType>
                  <xs:sequence>
                    <xs:element name="Snippets">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element maxOccurs="unbounded" name="Snippet">
                            <xs:complexType>
                              <xs:attribute name="name" type="xs:string" use="optional" />
                              <xs:attribute name="type" type="xs:string" use="optional" />
                              <xs:attribute name="defaultClass" type="xs:string" use="optional" />
                              <xs:attribute name="defaultAssembly" type="xs:string" use="optional" />
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="Assembly">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="type" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="ClassName">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="type" type="xs:string" use="required" />
                                    <xs:attribute name="baseClass" type="xs:string" use="required" />
                                    <xs:attribute name="defaultAssembly" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="Cols">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="name" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DEFAULT">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                                <xs:element name="DEFAULT">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippets">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element name="Snippet">
                                              <xs:complexType>
                                                <xs:attribute name="type" type="xs:string" use="required" />
                                                <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="Rows">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="name" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DEFAULT">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                                <xs:element name="DEFAULT">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippets">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element name="Snippet">
                                              <xs:complexType>
                                                <xs:attribute name="type" type="xs:string" use="required" />
                                                <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="Controls">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="DEFAULT">
                            <xs:complexType>
                              <xs:attribute name="declare" type="xs:string" use="required" />
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="DEFAULT">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="type" type="xs:string" use="required" />
                                    <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                    <xs:attribute name="defaultAssembly" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                  </xs:sequence>
                </xs:complexType>
              </xs:element>
              <xs:element name="ChildContainerTemplate">
                <xs:complexType>
                  <xs:sequence>
                    <xs:element name="Snippets">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element maxOccurs="unbounded" name="Snippet">
                            <xs:complexType>
                              <xs:attribute name="name" type="xs:string" use="optional" />
                              <xs:attribute name="type" type="xs:string" use="optional" />
                              <xs:attribute name="defaultClass" type="xs:string" use="optional" />
                              <xs:attribute name="defaultAssembly" type="xs:string" use="optional" />
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="Assembly">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="type" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="ClassName">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="type" type="xs:string" use="required" />
                                    <xs:attribute name="baseClass" type="xs:string" use="required" />
                                    <xs:attribute name="defaultAssembly" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="Cols">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="name" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DEFAULT">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                                <xs:element name="DEFAULT">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippets">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element name="Snippet">
                                              <xs:complexType>
                                                <xs:attribute name="type" type="xs:string" use="required" />
                                                <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="Rows">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="name" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DEFAULT">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                                <xs:element name="DEFAULT">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippets">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element name="Snippet">
                                              <xs:complexType>
                                                <xs:attribute name="type" type="xs:string" use="required" />
                                                <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="Controls">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="DEFAULT">
                            <xs:complexType>
                              <xs:attribute name="declare" type="xs:string" use="required" />
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="DEFAULT">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="type" type="xs:string" use="required" />
                                    <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                    <xs:attribute name="defaultAssembly" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                  </xs:sequence>
                </xs:complexType>
              </xs:element>
              <xs:element name="ChartStyleCollectionTemplate">
                <xs:complexType>
                  <xs:sequence>
                    <xs:element name="Snippets">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element maxOccurs="unbounded" name="Snippet">
                            <xs:complexType>
                              <xs:attribute name="name" type="xs:string" use="required" />
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="DEFAULT">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element maxOccurs="unbounded" name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="name" type="xs:string" use="optional" />
                                    <xs:attribute name="type" type="xs:string" use="optional" />
                                    <xs:attribute name="defaultClass" type="xs:string" use="optional" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="Border">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                                <xs:element name="DEFAULT">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippets">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element name="Snippet">
                                              <xs:complexType>
                                                <xs:attribute name="type" type="xs:string" use="required" />
                                                <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DEFAULT">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                  </xs:sequence>
                </xs:complexType>
              </xs:element>
              <xs:element name="ChartTitleTemplate">
                <xs:complexType>
                  <xs:sequence>
                    <xs:element name="Snippets">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippet">
                            <xs:complexType>
                              <xs:attribute name="type" type="xs:string" use="required" />
                              <xs:attribute name="defaultClass" type="xs:string" use="required" />
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="DEFAULT">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="type" type="xs:string" use="required" />
                                    <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                  </xs:sequence>
                </xs:complexType>
              </xs:element>
              <xs:element name="ChartGroupsTemplate">
                <xs:complexType>
                  <xs:sequence>
                    <xs:element name="Snippets">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element maxOccurs="unbounded" name="Snippet">
                            <xs:complexType>
                              <xs:attribute name="name" type="xs:string" use="required" />
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="DEFAULT">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element maxOccurs="unbounded" name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="name" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DEFAULT">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                  </xs:sequence>
                </xs:complexType>
              </xs:element>
              <xs:element name="ChartDataTemplate">
                <xs:complexType>
                  <xs:sequence>
                    <xs:element name="Snippets">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element maxOccurs="unbounded" name="Snippet">
                            <xs:complexType>
                              <xs:attribute name="name" type="xs:string" use="required" />
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="PlotArea">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="type" type="xs:string" use="required" />
                                    <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DEFAULT">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="AxisX">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="type" type="xs:string" use="required" />
                                    <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="GridMajor">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                                <xs:element name="DEFAULT">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippets">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element name="Snippet">
                                              <xs:complexType>
                                                <xs:attribute name="type" type="xs:string" use="required" />
                                                <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="GridMinor">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                                <xs:element name="DEFAULT">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippets">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element name="Snippet">
                                              <xs:complexType>
                                                <xs:attribute name="type" type="xs:string" use="required" />
                                                <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DEFAULT">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="AxisY">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="type" type="xs:string" use="required" />
                                    <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="GridMajor">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                                <xs:element name="DEFAULT">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippets">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element name="Snippet">
                                              <xs:complexType>
                                                <xs:attribute name="type" type="xs:string" use="required" />
                                                <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="GridMinor">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                                <xs:element name="DEFAULT">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippets">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element name="Snippet">
                                              <xs:complexType>
                                                <xs:attribute name="type" type="xs:string" use="required" />
                                                <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DEFAULT">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="AxisY2">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="type" type="xs:string" use="required" />
                                    <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="GridMajor">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                                <xs:element name="DEFAULT">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippets">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element name="Snippet">
                                              <xs:complexType>
                                                <xs:attribute name="type" type="xs:string" use="required" />
                                                <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="GridMinor">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                                <xs:element name="DEFAULT">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippets">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element name="Snippet">
                                              <xs:complexType>
                                                <xs:attribute name="type" type="xs:string" use="required" />
                                                <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DEFAULT">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="Bar">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="type" type="xs:string" use="required" />
                                    <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DEFAULT">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="Bubble">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="type" type="xs:string" use="required" />
                                    <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DEFAULT">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="Gantt">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="type" type="xs:string" use="required" />
                                    <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DEFAULT">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="HiLoData">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="type" type="xs:string" use="required" />
                                    <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DEFAULT">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="Histogram">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="type" type="xs:string" use="required" />
                                    <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DEFAULT">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="Pie">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="type" type="xs:string" use="required" />
                                    <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DEFAULT">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="Polar">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="type" type="xs:string" use="required" />
                                    <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DEFAULT">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="Radar">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="type" type="xs:string" use="required" />
                                    <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DEFAULT">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                  </xs:sequence>
                </xs:complexType>
              </xs:element>
              <xs:element name="FlexChartDataLabelTemplate">
                <xs:complexType>
                  <xs:sequence>
                    <xs:element name="Snippets">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippet">
                            <xs:complexType>
                              <xs:attribute name="type" type="xs:string" use="required" />
                              <xs:attribute name="defaultClass" type="xs:string" use="required" />
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="DEFAULT">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="type" type="xs:string" use="required" />
                                    <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                  </xs:sequence>
                </xs:complexType>
              </xs:element>
              <xs:element name="FlexChartStyleCollectionTemplate">
                <xs:complexType>
                  <xs:sequence>
                    <xs:element name="Snippets">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element maxOccurs="unbounded" name="Snippet">
                            <xs:complexType>
                              <xs:attribute name="name" type="xs:string" use="required" />
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="DEFAULT">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="type" type="xs:string" use="required" />
                                    <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DEFAULT">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                  </xs:sequence>
                </xs:complexType>
              </xs:element>
              <xs:element name="FlexChartDataTemplate">
                <xs:complexType>
                  <xs:sequence>
                    <xs:element name="Snippets">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element maxOccurs="unbounded" name="Snippet">
                            <xs:complexType>
                              <xs:attribute name="name" type="xs:string" use="required" />
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="AxisX">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="type" type="xs:string" use="required" />
                                    <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="MinorGridStyle">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                                <xs:element name="DEFAULT">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippets">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element name="Snippet">
                                              <xs:complexType>
                                                <xs:attribute name="type" type="xs:string" use="required" />
                                                <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="MajorGridStyle">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                                <xs:element name="DEFAULT">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippets">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element name="Snippet">
                                              <xs:complexType>
                                                <xs:attribute name="type" type="xs:string" use="required" />
                                                <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="Style">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                                <xs:element name="DEFAULT">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippets">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element name="Snippet">
                                              <xs:complexType>
                                                <xs:attribute name="type" type="xs:string" use="required" />
                                                <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DEFAULT">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="AxisY">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="type" type="xs:string" use="required" />
                                    <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="MinorGridStyle">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                                <xs:element name="DEFAULT">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippets">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element name="Snippet">
                                              <xs:complexType>
                                                <xs:attribute name="type" type="xs:string" use="required" />
                                                <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="MajorGridStyle">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                                <xs:element name="DEFAULT">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippets">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element name="Snippet">
                                              <xs:complexType>
                                                <xs:attribute name="type" type="xs:string" use="required" />
                                                <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="Style">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                                <xs:element name="DEFAULT">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippets">
                                        <xs:complexType>
                                          <xs:sequence>
                                            <xs:element name="Snippet">
                                              <xs:complexType>
                                                <xs:attribute name="type" type="xs:string" use="required" />
                                                <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                              </xs:complexType>
                                            </xs:element>
                                          </xs:sequence>
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DEFAULT">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="Legend">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="type" type="xs:string" use="required" />
                                    <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="DEFAULT">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                  </xs:sequence>
                </xs:complexType>
              </xs:element>
              <xs:element name="PrintSettingsTemplate">
                <xs:complexType>
                  <xs:sequence>
                    <xs:element name="Snippets">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element maxOccurs="unbounded" name="Snippet">
                            <xs:complexType>
                              <xs:attribute name="name" type="xs:string" use="optional" />
                              <xs:attribute name="type" type="xs:string" use="optional" />
                              <xs:attribute name="defaultClass" type="xs:string" use="optional" />
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="Landscape">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="type" type="xs:string" use="required" />
                                    <xs:attribute name="value" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="MeasuringUnit">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="type" type="xs:string" use="required" />
                                    <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="Margins">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element maxOccurs="unbounded" name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="name" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="PaperSize">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="name" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="PaperName">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="Printer">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element maxOccurs="unbounded" name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="name" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="PrinterName">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="Duplex">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="PageRange">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippets">
                                  <xs:complexType>
                                    <xs:sequence>
                                      <xs:element name="Snippet">
                                        <xs:complexType>
                                          <xs:attribute name="type" type="xs:string" use="required" />
                                          <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                        </xs:complexType>
                                      </xs:element>
                                    </xs:sequence>
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="DEFAULT">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="type" type="xs:string" use="required" />
                                    <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                  </xs:sequence>
                </xs:complexType>
              </xs:element>
              <xs:element name="ExportSettingsTemplate">
                <xs:complexType>
                  <xs:sequence>
                    <xs:element name="Snippets">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippet">
                            <xs:complexType>
                              <xs:attribute name="type" type="xs:string" use="required" />
                              <xs:attribute name="defaultClass" type="xs:string" use="required" />
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="DEFAULT">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:attribute name="type" type="xs:string" use="required" />
                                    <xs:attribute name="defaultClass" type="xs:string" use="required" />
                                  </xs:complexType>
                                </xs:element>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                  </xs:sequence>
                </xs:complexType>
              </xs:element>
            </xs:sequence>
          </xs:complexType>
        </xs:element>
      </xs:sequence>
    </xs:complexType>
  </xs:element>
</xs:schema>`.replace(/xs\:/g, '');
    @Input()
    public set xmlSchema(pValue: string) {
        if (this._xmlSchema == pValue) return;

        this._xmlSchema = pValue;
    }
    public get xmlSchema(): string {
        return this._xmlSchema;
    }

    private stringToXml(text) {
        var xmlDoc;
        if (window.DOMParser) {
            var parser = new DOMParser();
            xmlDoc = parser.parseFromString(text, 'text/xml');
        } else {
            xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
            xmlDoc.async = false;
            xmlDoc.loadXML(text);
        }
        return xmlDoc;
    }

    private _schemaNode = this.stringToXml(this.xmlSchema).childNodes[0];

    private getLastOpenedTag(text) {
        // get all tags inside of the content
        var tags = text.match(/<\/*(?=\S*)([a-zA-Z-]+)/g);
        if (!tags) {
            return undefined;
        }
        // we need to know which tags are closed
        var closingTags = [];
        for (var i = tags.length - 1; i >= 0; i--) {
            if (tags[i].indexOf('</') === 0) {
                closingTags.push(tags[i].substring('</'.length));
            } else {
                // get the last position of the tag
                var tagPosition = text.lastIndexOf(tags[i]);
                var tag = tags[i].substring('<'.length);
                var closingBracketIdx = text.indexOf('/>', tagPosition);
                // if the tag wasn't closed
                if (closingBracketIdx === -1) {
                    // if there are no closing tags or the current tag wasn't closed
                    if (!closingTags.length || closingTags[closingTags.length - 1] !== tag) {
                        // we found our tag, but let's get the information if we are looking for
                        // a child element or an attribute
                        text = text.substring(tagPosition);
                        return {
                            tagName: tag,
                            isAttributeSearch: text.indexOf('<') > text.indexOf('>')
                        };
                    }
                    // remove the last closed tag
                    closingTags.splice(closingTags.length - 1, 1);
                }
                // remove the last checked tag and continue processing the rest of the content
                text = text.substring(0, tagPosition);
            }
        }
    }

    private getAreaInfo(text) {
        // opening for strings, comments and CDATA
        var items = ['"', "'", '<!--', '<![CDATA['];
        var isCompletionAvailable = true;
        // remove all comments, strings and CDATA
        text = text.replace(
            /"([^"\\]*(\\.[^"\\]*)*)"|\'([^\'\\]*(\\.[^\'\\]*)*)\'|<!--([\s\S])*?-->|<!\[CDATA\[(.*?)\]\]>/g,
            ''
        );
        for (var i = 0; i < items.length; i++) {
            var itemIdx = text.indexOf(items[i]);
            if (itemIdx > -1) {
                // we are inside one of unavailable areas, so we remote that area
                // from our clear text
                text = text.substring(0, itemIdx);
                // and the completion is not available
                isCompletionAvailable = false;
            }
        }
        return {
            isCompletionAvailable: isCompletionAvailable,
            clearedText: text
        };
    }

    private shouldSkipLevel(tagName) {
        // if we look at the XSD schema, these nodes are containers for elements,
        // so we can skip that level
        return tagName === 'complexType' || tagName === 'all' || tagName === 'sequence';
    }

    private findElements(elements?, elementName?) {
        for (var i = 0; i < elements.length; i++) {
            // we are looking for elements, so we don't need to process annotations and attributes
            if (elements[i].tagName !== 'annotation' && elements[i].tagName !== 'attribute') {
                // if it is one of the nodes that do not have the info we need, skip it
                // and process that node's child items
                if (this.shouldSkipLevel(elements[i].tagName)) {
                    var child = this.findElements(elements[i].children, elementName);
                    // if child exists, return it
                    if (child) {
                        return child;
                    }
                }
                // if there is no elementName, return all elements (we'll explain
                // this bit little later
                else if (!elementName) {
                    return elements;
                }
                // find all the element attributes, and if is't name is the same
                // as the element we're looking for, return the element.
                else if (this.getElementAttributes(elements[i]).name === elementName) {
                    return elements[i];
                }
            }
        }
    }

    private findAttributes(elements) {
        var attrs = [];
        for (var i = 0; i < elements.length; i++) {
            // skip level if it is a 'complexType' tag
            if (elements[i].tagName === 'complexType') {
                var child = this.findAttributes(elements[i].children);
                if (child) {
                    return child;
                }
            }
            // we need only those XSD elements that have a
            // tag 'attribute'
            else if (elements[i].tagName === 'attribute') {
                attrs.push(elements[i]);
            }
        }
        return attrs;
    }

    private getElementAttributes(element) {
        var attrs: any = {};
        for (var i = 0; i < element.attributes.length; i++) {
            attrs[element.attributes[i].name] = element.attributes[i].value;
        }
        // return all attributes as an object
        return attrs;
    }

    private getItemDocumentation(element) {
        for (var i = 0; i < element.children.length; i++) {
            // annotaion contains documentation, so calculate the
            // documentation from it's child elements
            if (element.children[i].tagName === 'annotation') {
                return this.getItemDocumentation(element.children[0]);
            }
            // if it's the documentation element, just get the value
            else if (element.children[i].tagName === 'documentation') {
                return element.children[i].textContent;
            }
        }
    }

    private isItemAvailable(itemName, maxOccurs, items) {
        // the default for 'maxOccurs' is 1
        maxOccurs = maxOccurs || '1';
        // the element can appere infinite times, so it is availabel
        if (maxOccurs && maxOccurs === 'unbounded') {
            return true;
        }
        // count how many times the element appered
        var count = 0;
        for (var i = 0; i < items.length; i++) {
            if (items[i] === itemName) {
                count++;
            }
        }
        // if it didn't appear yet, or it can appear again, then it
        // is available, otherwise it't not
        return count === 0 || parseInt(maxOccurs) > count;
    }

    private _suggestions: any[] = [];
    private getAvailableElements(monaco, elements, usedItems) {
        let availableItems: any[] = [];
        let children;
        for (let i = 0; i < elements.length; i++) {
            // annotation element only contains documentation,
            // so no need to process it here
            if (elements[i].tagName !== 'annotation') {
                // get all child elements that have 'element' tag
                children = this.findElements([elements[i]]);
            }
        }
        // if there are no such elements, then there are no suggestions
        if (!children) {
            return [];
        }
        for (let i = 0; i < children.length; i++) {
            // get all element attributes
            let elementAttrs = this.getElementAttributes(children[i]);
            // the element is a suggestion if it's available
            if (this.isItemAvailable(elementAttrs.name, elementAttrs.maxOccurs, usedItems)) {
                // mark it as a 'field', and get the documentation
                availableItems.push({
                    label: elementAttrs.name,
                    kind: monaco.languages.CompletionItemKind.Field,
                    detail: elementAttrs.type,
                    documentation: this.getItemDocumentation(children[i]),
                    insertText: `${elementAttrs.name}>$1</${elementAttrs.name}`,
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                });
            }
        }
        // return the suggestions we found
        this._suggestions = availableItems;
        // return availableItems;
    }

    private getAvailableAttribute(monaco, elements, usedChildTags) {
        let availableItems: any[] = [];
        let children;
        for (let i = 0; i < elements.length; i++) {
            // annotation element only contains documentation,
            // so no need to process it here
            if (elements[i].tagName !== 'annotation') {
                // get all child elements that have 'attribute' tag
                children = this.findAttributes([elements[i]]);
            }
        }
        // if there are no attributes, then there are no
        // suggestions available
        if (!children) {
            return [] as any;
        }
        for (let i = 0; i < children.length; i++) {
            // get all attributes for the element
            var attrs = this.getElementAttributes(children[i]);
            // accept it in a suggestion list only if it is available
            if (this.isItemAvailable(attrs.name, attrs.maxOccurs, usedChildTags)) {
                // mark it as a 'property', and get it's documentation
                availableItems.push({
                    label: attrs.name,
                    kind: monaco.languages.CompletionItemKind.Property,
                    detail: attrs.type,
                    documentation: this.getItemDocumentation(children[i]),
                    insertText: `<${attrs.name}>$1</${attrs.name}>`,
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                });
            }
        }
        // return the elements we found
        this._suggestions = availableItems;
        // return availableItems;
    }

    private getXmlCompletionProvider(monaco) {
        return {
            triggerCharacters: ['<'],
            provideCompletionItems: (model, position) => {
                // get editor content before the pointer
                var textUntilPosition = model.getValueInRange({
                    startLineNumber: 1,
                    startColumn: 1,
                    endLineNumber: position.lineNumber,
                    endColumn: position.column
                });
                // get content info - are we inside of the area where we don't want suggestions, what is the content without those areas
                let areaUntilPositionInfo = this.getAreaInfo(textUntilPosition); // isCompletionAvailable, clearedText
                // if we don't want any suggestions, return empty array
                if (!areaUntilPositionInfo.isCompletionAvailable) {
                    return [];
                }
                // if we want suggestions, inside of which tag are we?
                var lastOpenedTag = this.getLastOpenedTag(areaUntilPositionInfo.clearedText);
                // get opened tags to see what tag we should look for in the XSD schema
                var openedTags = [];
                // get the elements/attributes that are already mentioned in the element we're in
                var usedItems = [];
                var isAttributeSearch = lastOpenedTag && lastOpenedTag.isAttributeSearch;
                // no need to calculate the position in the XSD schema if we are in the root element
                if (lastOpenedTag) {
                    // parse the content (not cleared text) into an xml document
                    var xmlDoc = this.stringToXml(textUntilPosition);
                    var lastChild = xmlDoc.lastElementChild;
                    while (lastChild) {
                        openedTags.push(lastChild.tagName);
                        // if we found our last opened tag
                        if (lastChild.tagName === lastOpenedTag.tagName) {
                            // if we are looking for attributes, then used items should
                            // be the attributes we already used
                            if (lastOpenedTag.isAttributeSearch) {
                                var attrs = lastChild.attributes;
                                for (var i = 0; i < attrs.length; i++) {
                                    usedItems.push(attrs[i].nodeName);
                                }
                            } else {
                                // if we are looking for child elements, then used items
                                // should be the elements that were already used
                                var children = lastChild.children;
                                for (var i = 0; i < children.length; i++) {
                                    usedItems.push(children[i].tagName);
                                }
                            }
                            break;
                        }
                        // we haven't found the last opened tag yet, so we move to
                        // the next element
                        lastChild = lastChild.lastElementChild;
                    }
                }
                // find the last opened tag in the schema to see what elements/attributes it can have
                var currentItem = this._schemaNode;
                for (var i = 0; i < openedTags.length; i++) {
                    if (currentItem) {
                        currentItem = this.findElements(currentItem.children, openedTags[i]);
                    }
                }

                // return available elements/attributes if the tag exists in the schema, or an empty
                // array if it doesn't
                if (isAttributeSearch) {
                    // get attributes completions
                    return currentItem ? this.getAvailableAttribute(monaco, currentItem.children, usedItems) : [];
                } else {
                    // get elements completions
                    return currentItem ? this.getAvailableElements(monaco, currentItem.children, usedItems) : [];
                }
            }
        };
    }

    private customIntelliSense() {
        monaco.languages.registerCompletionItemProvider('xml', {
            triggerCharacters: ['<'],
            provideCompletionItems: (model, position) => {
                const wordBeforePosition = model.getWordUntilPosition({
                    lineNumber: position.lineNumber,
                    column: position.column - 1
                });

                const wordUntilPosition = model.getWordUntilPosition(position);
                if (wordBeforePosition.word.trim() === '' || wordUntilPosition.word.trim() === '') {
                    const keywords = this._suggestions;
                    let suggestions: BravoMonacoCompletionItem[] = keywords.map((id: any) => ({
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

        monaco.languages.registerCompletionItemProvider('xml', this.getXmlCompletionProvider(monaco));
    }

    @Output()
    public init: EventEmitter<BravoMonacoStandaloneCodeEditor> = new EventEmitter();

    public editor: BravoMonacoStandaloneCodeEditor;
    public modelUriInstance: BravoMonacoTextModel;
    public parsedError: string;

    private onTouched: () => void = () => {};
    private onErrorStatusChange: () => void = () => {};
    private propagateChange: (_: any) => any = () => {};

    public get model() {
        return this.editor && this.editor.getModel();
    }

    public get modelMarkers() {
        return (
            this.model &&
            monaco.editor.getModelMarkers({
                resource: this.model.uri
            })
        );
    }

    constructor(
        private http: HttpClient,
        private bravoMonacoEditorService: BravoMonacoEditorService,
        private elRef: ElementRef
    ) {
        super(elRef.nativeElement);
    }

    ngOnInit() {
        this.bravoMonacoEditorService.isMonacoLoaded$
            .pipe(
                filter((isLoaded) => isLoaded),
                take(1)
            )
            .subscribe(() => {
                this.initEditor();
                this.customIntelliSense();
            });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.editor && changes.options && !changes.options.firstChange) {
            const { language: toLanguage, theme: toTheme, ...options } = changes.options.currentValue;
            const { language: fromLanguage, theme: fromTheme } = changes.options.previousValue;

            if (fromLanguage !== toLanguage) {
                monaco.editor.setModelLanguage(
                    this.editor.getModel(),
                    this.options && this.options.language ? this.options.language : 'text'
                );
            }

            if (fromTheme !== toTheme) {
                monaco.editor.setTheme(toTheme);
            }

            this.editor.updateOptions(options);
        }

        if (this.editor && changes.uri) {
            const toUri = changes.uri.currentValue;
            const fromUri = changes.uri.previousValue;

            if ((fromUri && !toUri) || (!fromUri && toUri) || (toUri && fromUri && toUri.path !== fromUri.path)) {
                const value = this.editor.getValue();

                if (this.modelUriInstance) {
                    this.modelUriInstance.dispose();
                }

                let existingModel;

                if (toUri) {
                    existingModel = monaco.editor.getModels().find((model) => model.uri.path === toUri.path);
                }

                this.modelUriInstance = existingModel
                    ? existingModel
                    : monaco.editor.createModel(value, this.options.language || 'text', this.uri);
                this.editor.setModel(this.modelUriInstance);
            }
        }
    }

    writeValue(value: string): void {
        this.value = value;
        if (this.editor && value) {
            this.editor.setValue(value);
        } else if (this.editor) {
            this.editor.setValue('');
        }
    }

    registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    validate(): ValidationErrors {
        return !this.parsedError
            ? null
            : {
                  monaco: {
                      value: this.parsedError.split('|')
                  }
              };
    }

    registerOnValidatorChange?(fn: () => void): void {
        this.onErrorStatusChange = fn;
    }

    private initEditor() {
        let options: BravoMonacoEditorConstructionOptions = {
            theme: this.theme,
            value: [this.value].join('\n'),
            minimap: this.minimap,
            language: this.language,
            readOnly: this.readOnly,
            folding: this.folding,
            foldingHighlight: this.foldingHighlight,
            foldingImportsByDefault: this.foldingImportsByDefault,
            foldingMaximumRegions: this.foldingMaximumRegions,
            foldingStrategy: this.foldingStrategy,
            showFoldingControls: this.showFoldingControls,
            scrollBeyondLastLine: this.scrollBeyondLastLine,
            automaticLayout: this.automaticLayout,
            mouseStyle: this.mouseStyle,
            tabSize: this.tabSize,
            fontSize: this.fontSize
        };

        let editorContent = this.hostElement?.querySelector('.bravo-monaco-editor') as HTMLElement;
        if (editorContent)
            this.editor = monaco.editor.create(editorContent, this.options ? { ...options, ...this.options } : options);

        this.registerEditorListeners();
        this.init.emit(this.editor);
    }

    private registerEditorListeners() {
        this.editor.onDidChangeModelContent(() => {
            this.propagateChange(this.editor.getValue());
        });

        this.editor.onDidChangeModelDecorations(() => {
            const currentParsedError = this.modelMarkers.map(({ message }) => message).join('|');
            const hasValidationStatusChanged = this.parsedError !== currentParsedError;

            if (hasValidationStatusChanged) {
                this.parsedError = currentParsedError;
                this.onErrorStatusChange();
            }
        });

        this.editor.onDidBlurEditorText(() => {
            this.onTouched();
        });
    }

    ngOnDestroy() {
        if (this.editor) {
            this.editor.dispose();
        }
    }
}
