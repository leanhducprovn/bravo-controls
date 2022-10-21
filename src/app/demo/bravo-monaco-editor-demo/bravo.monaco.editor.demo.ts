import { Component, OnInit } from '@angular/core';
import { filter, take } from 'rxjs/operators';
import {
    // BravoMonaco,
    BravoMonacoCompletionItem,
    BravoMonacoEditorConstructionOptions,
    BravoMonacoUri
} from '../../components/bravo.monaco.editor/bravo.monaco.editor.type';
import { BravoMonacoEditorService } from '../../components/bravo.monaco.editor/bravo.monaco.editor.service';

// declare var monaco: BravoMonaco;

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
        value: `<?xml version="1.0" encoding="UTF-8"?>
<shiporder>
    <orderperson>John Smith</orderperson>
    <shipto>
        <name>Ola Nordmann</name>
        <address>Langgt 23</address>
        <city>4000 Stavanger</city>
        <country>Norway</country>
    </shipto>
    <item>
        <title>Empire Burlesque</title>
        <note>Special Edition</note>
        <quantity>1</quantity>
        <price>10.90</price>
    </item>
    <item>
        <title>Hide your heart</title>
        <quantity>1</quantity>
        <price>9.90</price>
    </item>
</shiporder>` // two rows in the initial value
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
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
<xs:element name="shiporder">
  <xs:annotation>
    <xs:documentation>Details for order shipping.</xs:documentation>
  </xs:annotation>
  <xs:complexType>
    <xs:sequence>
      <xs:element name="orderperson" type="xs:string">
      <xs:annotation>
        <xs:documentation>Person that will handle the order.</xs:documentation>
      </xs:annotation>
      </xs:element>
      <xs:element name="shipto">
        <xs:annotation>
          <xs:documentation>Details of order reciever.</xs:documentation>
        </xs:annotation>
        <xs:complexType>
          <xs:sequence>
            <xs:element name="name" type="xs:string">
              <xs:annotation>
                <xs:documentation>Receiver name.</xs:documentation>
              </xs:annotation>
            </xs:element>
            <xs:element name="address" type="xs:string">
              <xs:annotation>
                <xs:documentation>Receiver address.</xs:documentation>
              </xs:annotation>
            </xs:element>
            <xs:element name="city" type="xs:string">
              <xs:annotation>
                <xs:documentation>Receiver city.</xs:documentation>
              </xs:annotation>
            </xs:element>
            <xs:element name="country" type="xs:string">
              <xs:annotation>
                <xs:documentation>Receiver country.</xs:documentation>
              </xs:annotation>
            </xs:element>
          </xs:sequence>
        </xs:complexType>
      </xs:element>
      <xs:element name="item" maxOccurs="unbounded">
        <xs:annotation>
          <xs:documentation>Order item.</xs:documentation>
        </xs:annotation>
        <xs:complexType>
          <xs:sequence>
            <xs:element name="title" type="xs:string">
              <xs:annotation>
                <xs:documentation>Item title.</xs:documentation>
              </xs:annotation>
            </xs:element>
            <xs:element name="note" type="xs:string" minOccurs="0">
              <xs:annotation>
                <xs:documentation>Item note.</xs:documentation>
              </xs:annotation>
            </xs:element>
            <xs:element name="quantity" type="xs:positiveInteger">
              <xs:annotation>
                <xs:documentation>Quantity of the item.</xs:documentation>
              </xs:annotation>
            </xs:element>
            <xs:element name="price" type="xs:decimal">
              <xs:annotation>
                <xs:documentation>Item price.</xs:documentation>
              </xs:annotation>
            </xs:element>
          </xs:sequence>
        </xs:complexType>
      </xs:element>
    </xs:sequence>
    <xs:attribute name="orderid" type="xs:string" use="required">
      <xs:annotation>
        <xs:documentation>Attribute example.</xs:documentation>
      </xs:annotation>
    </xs:attribute>
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

    private getAvailableElements(monaco, elements, usedItems) {
        var availableItems = [];
        var children;
        for (var i = 0; i < elements.length; i++) {
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
        for (var i = 0; i < children.length; i++) {
            // get all element attributes
            let elementAttrs = this.getElementAttributes(children[i]);
            // the element is a suggestion if it's available
            if (this.isItemAvailable(elementAttrs.name, elementAttrs.maxOccurs, usedItems)) {
                // mark it as a 'field', and get the documentation
                availableItems.push({
                    label: elementAttrs.name,
                    kind: monaco.languages.CompletionItemKind.Field,
                    detail: elementAttrs.type,
                    documentation: this.getItemDocumentation(children[i])
                });
            }
        }
        // return the suggestions we found
        return availableItems;
    }

    private getAvailableAttribute(monaco, elements, usedChildTags) {
        var availableItems = [];
        var children;
        for (var i = 0; i < elements.length; i++) {
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
            return [];
        }
        for (var i = 0; i < children.length; i++) {
            // get all attributes for the element
            var attrs = this.getElementAttributes(children[i]);
            // accept it in a suggestion list only if it is available
            if (this.isItemAvailable(attrs.name, attrs.maxOccurs, usedChildTags)) {
                // mark it as a 'property', and get it's documentation
                availableItems.push({
                    label: attrs.name,
                    kind: monaco.languages.CompletionItemKind.Property,
                    detail: attrs.type,
                    documentation: this.getItemDocumentation(children[i])
                });
            }
        }
        // return the elements we found
        return availableItems;
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
                    return [] as any;
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
                    return currentItem
                        ? this.getAvailableAttribute(monaco, currentItem.children, usedItems)
                        : ([] as any);
                } else {
                    // get elements completions
                    return currentItem
                        ? this.getAvailableElements(monaco, currentItem.children, usedItems)
                        : ([] as any);
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

        monaco.languages.registerCompletionItemProvider('xml', this.getXmlCompletionProvider(monaco));
    }
}
