import { Component, OnInit } from '@angular/core';
import { filter, take } from 'rxjs/operators';
import {
    BravoMonaco,
    BravoMonacoCompletionItem,
    BravoMonacoEditorConstructionOptions,
    BravoMonacoUri
} from '../../components/bravo.monaco.editor/bravo.monaco.editor.type';
import { BravoMonacoEditorService } from '../../components/bravo.monaco.editor/bravo.monaco.editor.service';

declare var monaco: BravoMonaco;

@Component({
    selector: 'bravo-monaco-editor-demo',
    templateUrl: './bravo.monaco.editor.demo.html',
    styleUrls: ['./bravo.monaco.editor.demo.less']
})
export class BravoMonacoEditorDemo implements OnInit {
    constructor(private bravoMonacoEditorService: BravoMonacoEditorService) {
        this.bravoMonacoEditorService.isMonacoLoaded$
            .pipe(
                filter((isLoaded) => !!isLoaded),
                take(1)
            )
            .subscribe(() => {
                this.registerMonacoCustomTheme();
                this.customIntelliSense();
            });
    }

    ngOnInit(): void {}

    public editor: BravoMonacoEditorConstructionOptions = {
        theme: 'BravoTheme',
        language: 'xml',
        suggestOnTriggerCharacters: true,
        value: `<?xml version="1.0" encoding="utf-8" ?>
<XmlSnippets>
	<Declare>
		<IncludeFile name="Declare.xml"></IncludeFile>
	</Declare>
	<Snippets>
		<Snippet name="root"/>
		<Snippet name="!--" visibleType="ChildTagNames">
			<Declare>
				<![CDATA[!--^-->]]>
			</Declare>
		</Snippet>
	</Snippets>
	<root>
		<DEFAULT>
			<Snippets>
				<Snippet name="Image"/>
				<Snippet name="Pages"/>
				<Snippet type="PropertyList" defaultClass="Bravo.MainWindow.BravoDashboard" defaultAssembly="Bravo.MainWindow"/>
			</Snippets>
			<Pages>
				<Snippets>
					<Snippet name="Dashboard"/>
					<Snippet name="Diagram"/>
					<Snippet name="Page_"/>
					<Snippet name="Report"/>
				</Snippets>
				<DEFAULT>
					<Snippets>
						<Snippet name="Cols"/>
						<Snippet name="Controls"/>
						<Snippet name="Rows"/>
						<Snippet name="Text"/>
					</Snippets>
					<Cols>
						<Snippets>
							<Snippet name="Column_"/>
						</Snippets>
						<DEFAULT>
							<Snippets>
								<Snippet type="PropertyList" defaultClass="System.Windows.Forms.ColumnStyle"/>
							</Snippets>
							<DEFAULT>
								<Snippets>
									<Snippet type="PropertyValue" defaultClass="System.Windows.Forms.ColumnStyle"/>
								</Snippets>
							</DEFAULT>
						</DEFAULT>
					</Cols>
					<Rows>
						<Snippets>
							<Snippet name="Row_"/>
						</Snippets>
						<DEFAULT>
							<Snippets>
								<Snippet type="PropertyList" defaultClass="System.Windows.Forms.RowStyle"/>
							</Snippets>
							<DEFAULT>
								<Snippets>
									<Snippet type="PropertyValue" defaultClass="System.Windows.Forms.RowStyle"/>
								</Snippets>
							</DEFAULT>
						</DEFAULT>
					</Rows>
					<Controls>
						<Snippets>
							<Snippet name="\w+" type="LayoutData" layoutName="BravoWidget"/>
						</Snippets>
						<DEFAULT>
							<Snippets>
								<Snippet name="Row"/>
								<Snippet name="Column"/>
								<Snippet type="PropertyList" defaultClass="Bravo.MainWindow.BravoWidgetBase" defaultAssembly="Bravo.MainWindow"/>
							</Snippets>
							<DEFAULT>
								<Snippets>
									<Snippet type="PropertyValue" defaultClass="Bravo.MainWindow.BravoWidgetBase" defaultAssembly="Bravo.MainWindow"/>
								</Snippets>
							</DEFAULT>
						</DEFAULT>
					</Controls>
				</DEFAULT>
			</Pages>
			<DEFAULT>
				<Snippets>
					<Snippet type="PropertyValue" defaultClass="Bravo.MainWindow.BravoDashboard" defaultAssembly="Bravo.MainWindow"/>
				</Snippets>
			</DEFAULT>
		</DEFAULT>
	</root>
</XmlSnippets>`
    };

    public modelUri: BravoMonacoUri;

    private registerMonacoCustomTheme() {
        monaco.editor.defineTheme('BravoTheme', {
            base: 'vs',
            inherit: true,
            rules: [
                { token: 'comment', fontStyle: 'italic' },
                { token: 'comment.js', foreground: 'ff0303', fontStyle: 'bold' },
                { token: 'comment.css', foreground: 'ff0303', fontStyle: 'bold' }
            ],
            colors: {}
        });
    }

    xmlSchemaString: string = `<?xml version="1.0" encoding="UTF-8" ?>
<xs:schema attributeFormDefault="unqualified" elementFormDefault="qualified" xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <xs:element name="XmlSnippets">
    <xs:complexType>
      <xs:sequence>
        <xs:element name="Declare">
          <xs:complexType>
            <xs:sequence>
              <xs:element name="IncludeFile">
                <xs:complexType>
                  <xs:simpleContent>
                    <xs:extension base="xs:string">
                      <xs:attribute type="xs:string" name="name"/>
                    </xs:extension>
                  </xs:simpleContent>
                </xs:complexType>
              </xs:element>
            </xs:sequence>
          </xs:complexType>
        </xs:element>
        <xs:element name="Snippets">
          <xs:complexType>
            <xs:sequence>
              <xs:element name="Snippet" maxOccurs="unbounded" minOccurs="0">
                <xs:complexType mixed="true">
                  <xs:sequence>
                    <xs:element type="xs:string" name="Declare" minOccurs="0"/>
                  </xs:sequence>
                  <xs:attribute type="xs:string" name="name" use="optional"/>
                  <xs:attribute type="xs:string" name="visibleType" use="optional"/>
                </xs:complexType>
              </xs:element>
            </xs:sequence>
          </xs:complexType>
        </xs:element>
        <xs:element name="root">
          <xs:complexType>
            <xs:sequence>
              <xs:element name="DEFAULT">
                <xs:complexType>
                  <xs:sequence>
                    <xs:element name="Snippets">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippet" maxOccurs="unbounded" minOccurs="0">
                            <xs:complexType>
                              <xs:simpleContent>
                                <xs:extension base="xs:string">
                                  <xs:attribute type="xs:string" name="name" use="optional"/>
                                  <xs:attribute type="xs:string" name="type" use="optional"/>
                                  <xs:attribute type="xs:string" name="defaultClass" use="optional"/>
                                  <xs:attribute type="xs:string" name="defaultAssembly" use="optional"/>
                                </xs:extension>
                              </xs:simpleContent>
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
                                <xs:element name="Snippet" maxOccurs="unbounded" minOccurs="0">
                                  <xs:complexType>
                                    <xs:simpleContent>
                                      <xs:extension base="xs:string">
                                        <xs:attribute type="xs:string" name="name" use="optional"/>
                                      </xs:extension>
                                    </xs:simpleContent>
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
                                      <xs:element name="Snippet" maxOccurs="unbounded" minOccurs="0">
                                        <xs:complexType>
                                          <xs:simpleContent>
                                            <xs:extension base="xs:string">
                                              <xs:attribute type="xs:string" name="name" use="optional"/>
                                            </xs:extension>
                                          </xs:simpleContent>
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
                                                <xs:simpleContent>
                                                  <xs:extension base="xs:string">
                                                    <xs:attribute type="xs:string" name="name"/>
                                                  </xs:extension>
                                                </xs:simpleContent>
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
                                                      <xs:simpleContent>
                                                        <xs:extension base="xs:string">
                                                          <xs:attribute type="xs:string" name="type"/>
                                                          <xs:attribute type="xs:string" name="defaultClass"/>
                                                        </xs:extension>
                                                      </xs:simpleContent>
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
                                                            <xs:simpleContent>
                                                              <xs:extension base="xs:string">
                                                                <xs:attribute type="xs:string" name="type"/>
                                                                <xs:attribute type="xs:string" name="defaultClass"/>
                                                              </xs:extension>
                                                            </xs:simpleContent>
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
                                                <xs:simpleContent>
                                                  <xs:extension base="xs:string">
                                                    <xs:attribute type="xs:string" name="name"/>
                                                  </xs:extension>
                                                </xs:simpleContent>
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
                                                      <xs:simpleContent>
                                                        <xs:extension base="xs:string">
                                                          <xs:attribute type="xs:string" name="type"/>
                                                          <xs:attribute type="xs:string" name="defaultClass"/>
                                                        </xs:extension>
                                                      </xs:simpleContent>
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
                                                            <xs:simpleContent>
                                                              <xs:extension base="xs:string">
                                                                <xs:attribute type="xs:string" name="type"/>
                                                                <xs:attribute type="xs:string" name="defaultClass"/>
                                                              </xs:extension>
                                                            </xs:simpleContent>
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
                                                <xs:simpleContent>
                                                  <xs:extension base="xs:string">
                                                    <xs:attribute type="xs:string" name="name"/>
                                                    <xs:attribute type="xs:string" name="type"/>
                                                    <xs:attribute type="xs:string" name="layoutName"/>
                                                  </xs:extension>
                                                </xs:simpleContent>
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
                                                  <xs:element name="Snippet" maxOccurs="unbounded" minOccurs="0">
                                                    <xs:complexType>
                                                      <xs:simpleContent>
                                                        <xs:extension base="xs:string">
                                                          <xs:attribute type="xs:string" name="name" use="optional"/>
                                                          <xs:attribute type="xs:string" name="type" use="optional"/>
                                                          <xs:attribute type="xs:string" name="defaultClass" use="optional"/>
                                                          <xs:attribute type="xs:string" name="defaultAssembly" use="optional"/>
                                                        </xs:extension>
                                                      </xs:simpleContent>
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
                                                            <xs:simpleContent>
                                                              <xs:extension base="xs:string">
                                                                <xs:attribute type="xs:string" name="type"/>
                                                                <xs:attribute type="xs:string" name="defaultClass"/>
                                                                <xs:attribute type="xs:string" name="defaultAssembly"/>
                                                              </xs:extension>
                                                            </xs:simpleContent>
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
                    <xs:element name="DEFAULT">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="Snippets">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="Snippet">
                                  <xs:complexType>
                                    <xs:simpleContent>
                                      <xs:extension base="xs:string">
                                        <xs:attribute type="xs:string" name="type"/>
                                        <xs:attribute type="xs:string" name="defaultClass"/>
                                        <xs:attribute type="xs:string" name="defaultAssembly"/>
                                      </xs:extension>
                                    </xs:simpleContent>
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

    schemaNode = this.stringToXml(this.xmlSchemaString).childNodes[0];

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

    _suggestions: any[] = [];
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
                var currentItem = this.schemaNode;
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

                let suggestions: BravoMonacoCompletionItem[];
                const wordUntilPosition = model.getWordUntilPosition(position);
                if (wordBeforePosition.word.trim() === '' || wordUntilPosition.word.trim() === '') {
                    const keywords = this._suggestions
                        ? this._suggestions
                        : [
                              {
                                  label: 'XmlSnippets',
                                  insertText: 'XmlSnippets',
                                  detail: 'B???t ?????u ph???n khai b??o'
                              },
                              {
                                  label: 'Declare',
                                  insertText: 'Declare',
                                  detail: 'Khai b??o template d??ng chung s??? ???????c tham chi???u ?????n b???ng declare="" v?? link="" (cho ph??p ????? quy - tham chi???u ch??nh n??)',
                                  documentation:
                                      'Trong m???t s??? tr?????ng h???p l?? th??? con c???a <Snippet> ????? khai b??o n???i dung ch??n kh??c ng???m ?????nh theo khai b??o format.'
                              },
                              {
                                  label: 'IncludeFile',
                                  insertText: 'IncludeFile',
                                  detail: 'Tham chi???u ?????n n???i dung khai b??o ??? file kh??c ??? c??ng th?? m???c'
                              },
                              {
                                  label: 'Path',
                                  insertText: 'Path',
                                  detail: 'Khai b??o ???????ng d???n',
                                  documentation:
                                      '<Path name="/A/B"/ exclude="B1|B2"> khai b??o ???????ng d???n (/A/B) trong n???i dung layout ????? l???y t???t c??? c??c m???c con c???a B m?? kh??ng ph???i l?? B1 v?? B2.\n\nname\t: khai b??o ???????ng d???n trong n???i dung layout\nexclude\t: danh s??ch c??c m???c con s??? b??? qua'
                              },
                              {
                                  label: 'DEFAULT',
                                  insertText: 'DEFAULT',
                                  detail: '?????i di???n cho nhi???u m???c con, nhi???u c???t kh??c nhau... thu???c m???t m???c m???, th??? ph???i ????? ??? v??? tr?? cu???i c??ng trong nh??m'
                              },
                              {
                                  label: 'Snippets',
                                  insertText: 'Snippets',
                                  detail: 'khai b??o c??c m???c trong auto complete menu',
                                  documentation:
                                      'name\t: t??n c???a snippet\ntoolTipText\t: n???i dung tooltip\ntoolTipTitle\t: ti??u ????? tooltip\n\ntype\t: ki???u snippet\n\tDefault\t: snippet ????? ch??n 1 chu???i v??n b???n\n\tDeclare\t: tham chi???u ?????n khai b??o ??? ph???n <Declare>\n\tTagName\t: li???t k?? t??n c???a c??c th??? khai b??o ph?? h???p v???i tagPath\n\tTagValue\t: li???t k?? gi?? tr??? c???a c??c th??? khai b??o ph?? h???p v???i tagPath\n\tPropertyList\t: li???t k?? c??c properties c???a class khai b??o\n\tPropertyValue\t: gi?? tr??? property c???a class khai b??o\n\tEnumValue\t: li???t k?? c??c gi?? tr??? d???ng enum\n\tLanguageName\t: li???t k?? c??c ng??n ng??? giao di???n\n\tCommandKey\t: li???t k?? c??c CommandKey trong B00Command\n\tClassName\t: li???t k?? c??c class\n\tDllName\t: li???t k?? c??c assembly\n\tTableName\t: li???t k?? t??n c??c b???ng d??? li???u khai b??o\n\tDataColumnName\t: li???t k?? t??n c??c c???t d??? li???u c???a b???ng\n\tChildControlName\t: li???t k?? ????? quy t??n c??c control c???a m???t control collection ph?? h???p v???i tagPath\n\tGridColumnName\t: li???t k?? t??n c??c c???t c???a grid ph?? h???p v???i tagPath\n\tDbTableName\t: li???t k?? t??n c??c b???ng trong CSDL\n\tDbCommandName\t: li???t k?? t??n c??c th??? t???c l??u v?? h??m trong CSDL\n\tDbParameterName\t: li???t k?? c??c tham s??? c???a th??? t???c l??u v?? h??m trong CSDL\n\tLayoutData\t: li???t k?? c??c khai b??o layout theo pattern ch??? ?????nh ??? name\n\tPrinterName\t: li???t k?? t??n c??c m??y in ???????c c??i ?????t\n\tConnectionName\t: li???t k?? t??n c??c k???t n???i CSDL khai b??o trong config\n\ntagPath\t: khai b??o ???????ng d???n trong n???i dung layout ????? l???y gi?? tr??? th???\nrecursivePath\t: d??ng k???t h???p v???i tagPath ????? t??m ????? quy c??c th??? con\ntableName\t: ch??? ?????nh t??n b???ng d??? li???u\ntableNamePath\t: khai b??o ???????ng d???n trong n???i dung layout ????? l???y t??n b???ng d??? li???u\ntablePattern\t: d??ng k???t h???p c??ng tableNamePath ho???c tableName ????? t??m th??? m??? ch???a khai b??o b???ng d??? li???u v?? s??? ???????c thay th??? v??o tableNamePath ho???c tableName\nbaseClass\t: khai b??o danh s??ch c??c class v?? c??c class k??? th???a c???a ch??ng s??? ???????c li???t k?? (t??n c??c class ph??n c??ch b???i d???u ,)\ndefaultAssembly\t: khai b??o danh s??ch c??c assembly ng???m ?????nh d??ng khi kh??ng ch??? ?????nh th??? <Assembly>\ndefaultClass\t: khai b??o danh s??ch c??c class d??ng khi kh??ng ch??? ?????nh th??? <ClassName>\nvalue\t: ch??? ?????nh danh s??ch c??c gi?? tr??? c??ch nhau b???i d???u , cho snippet type="EnumValue" ho???c d??ng k???t h???p c??ng tableNamePath ho???c tagPath ????? l???y gi?? tr??? th??? theo khu??n m???u\nintegerValue\t: d??ng cho snippet type="EnumValue", integerValue="True" s??? l???y gi?? tr??? Integer c???a ki???u enum khai b??o trong defaultClass=""\n\nvisibleType\t: ph???m vi c???a snippet\n\tDefault\t: ch??? d??ng cho th??? ??? v??? tr?? khai b??o\n\tChildTagNames\t: d??ng cho tag name ??? v??? tr?? khai b??o v?? t???t c??? c??c tag name con\n\tChildTagValues\t: d??ng cho tag value ??? v??? tr?? khai b??o v?? t???t c??? c??c tag value con\n\tTagNameOnly\t: ch??? d??ng ri??ng cho tag name\n\tTagValueOnly\t: ch??? d??ng ri??ng cho tag value\n\nformat\t: ki???u ?????nh d???ng n???i dung ch??n (^ l?? ch??? v??? tr?? con tr??? sau khi ch??n)\n\tDefault\t: tag name ho???c tag value\n\tMultiValues\t: cho ph??p tag value g???m nhi???u gi?? tr??? c??ch nhau b???i d???u ,\n\tOpenedTag\t: tag name <snippet_name\n\tClosedTag\t: tag name <snippet_name/>^\n\tCompletedTag\t: tag name <snippet_name>^</snippet_name>\n\tParentTag\t: tag name <snippet_name>...^...</snippet_name>'
                              }
                          ];

                    suggestions = keywords.map((id: any) => ({
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
}
