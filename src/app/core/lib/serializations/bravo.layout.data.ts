import { BravoLayoutItem } from './bravo.layout.item';
import { BravoZipTool } from '../bravo.zip.tool';

import * as helper from './options.helper';
import * as sax from 'sax';
import * as wjc from '@grapecity/wijmo';
import { BravoCryptography } from '../bravo.cryptography';

var currentElement: any;
var options: any;

export const RootName: string = 'root';
const ChartValue: string = 'Value';
const ReportChart: string = 'Chart';
const TagName: string = 'tagname';

export class BravoLayoutData {
    collection: Array<BravoLayoutItem> = new Array();

    public get count(): number {
        return this.collection.length;
    }

    public get(key): BravoLayoutItem {
        if (!this.contains(key))
            this.collection.push(new BravoLayoutItem(key, null));

        return this.collection.find((x) => x.name == key);
    }

    public getKeys(): string[] {
        let _arr = this.collection.map((item) => item.name);
        return _arr;
    }

    public static async createNew(
        xml: any,
        userOptions: any = { addParent: true }
    ): Promise<BravoLayoutData> {
        if (xml instanceof Uint8Array) {
            try {
                let _zLayout: string = null;
                await BravoZipTool.openAync(xml).then(async (data) => {
                    _zLayout = await data.readEntryAync('Xml');
                });

                return this.createNewString(_zLayout, userOptions);
            } catch (_ex) {
                console.error(_ex);
                throw new Error(_ex);
            }
        }

        if (wjc.isString(xml)) return this.createNewString(xml, userOptions);
    }

    public static createNew2(xml: any, userOptions?: any): BravoLayoutData {
        if (xml instanceof Uint8Array) {
            try {
                let _zLayout: string = null;
                let _zipFile = BravoZipTool.open(xml);

                try {
                    if (!_zipFile) return;

                    _zLayout = _zipFile.readEntry('Xml');
                    if (!_zLayout) return;

                    return this.createNewString(_zLayout, userOptions);
                } finally {
                    if (_zipFile) {
                        _zipFile.dispose();
                        _zipFile = null;
                    }
                }
            } catch (_ex) {
                throw new Error(_ex);
            }
        }

        if (wjc.isString(xml)) return this.createNewString(xml, userOptions);
    }

    public static createNewString(xml: string, options?: any): BravoLayoutData {
        if (!xml) return null;

        options = validateOptions(options);

        let parser = sax.parser(true, {});
        let result = {};
        currentElement = result;

        parser.onopentag = onStartElement;
        parser.ontext = onText;
        // parser.oncomment = onComment;
        parser.onclosetag = onEndElement;
        parser.onerror = onError;
        parser.oncdata = onCdata;
        parser.ondoctype = onDoctype;
        parser.onprocessinginstruction = onInstruction;

        parser.write(xml).close();

        if (result[options.elementsKey]) {
            delete result[options.elementsKey];
        }

        let _l = result[options.valueKey];
        if (_l instanceof BravoLayoutData) {
            if (_l.contains(RootName)) {
                _l = _l.getChildLayoutData(RootName);
                return _l;
            } else if (_l.count == 1) {
                return _l.collection[0].data();
            }
        }

        return new BravoLayoutData();
    }

    public static createNewObject(pObject: any) {
        let _layoutData = new BravoLayoutData();

        if (pObject && pObject.collection instanceof Array) {
            pObject.collection.forEach((_item) => {
                let _subLayoutData = null;

                if (_item.value && _item.value.collection instanceof Array) {
                    _subLayoutData = this.createNewObject(_item.value);
                    _layoutData.collection.push(
                        new BravoLayoutItem(
                            _item.name,
                            _subLayoutData,
                            _item.description,
                            _item.attributes
                        )
                    );
                } else {
                    _layoutData.collection.push(
                        new BravoLayoutItem(
                            _item.name,
                            _item.value,
                            _item.description,
                            _item.attributes
                        )
                    );
                }
            });
        }
        return _layoutData;
    }

    public static createNewObject2(pObject: any) {
        let _layoutData = new BravoLayoutData();

        if (pObject && pObject.collection instanceof Array) {
            pObject.collection.forEach((_item) => {
                let _subLayoutData = null;

                if (_item.value && _item.value instanceof Array) {
                    _subLayoutData = this.createNewObject(_item.value);
                    _layoutData.collection.push(
                        new BravoLayoutItem(
                            _item.name,
                            _subLayoutData,
                            _item.description,
                            _item.attributes
                        )
                    );
                } else {
                    _layoutData.collection.push(
                        new BravoLayoutItem(
                            _item.name,
                            _item.value,
                            _item.description,
                            _item.attributes
                        )
                    );
                }
            });
        }

        return _layoutData;
    }

    public contains(...keys: string[]) {
        if (keys.length < 2) {
            return this.collection.findIndex((item) => item.name == keys[0]) !=
                -1
                ? true
                : false;
        }

        let _l: BravoLayoutData = this;
        for (let _n = 0; _n < keys.length - 1; _n++) {
            _l = _l.getChildLayoutData(keys[_n]);
            if (!_l) return;
        }

        return _l && _l.contains(keys[keys.length - 1]);
    }

    public containsValue(item: BravoLayoutItem) {
        return this.collection.includes(item);
    }

    public containsChildLayoutData(...keys: string[]): boolean {
        if (keys.length < 2)
            return this.contains(keys[0]) && this.get(keys[0]).bIsData;

        let _l: BravoLayoutData = this;
        for (let _n = 0; _n < keys.length; _n++) {
            _l = _l.getChildLayoutData(keys[_n]);
            if (!_l) break;
        }

        return _l != null;
    }

    public clear() {
        this.collection.clear();
    }

    public getChildLayoutData(...keys: string[]): BravoLayoutData {
        if (keys.length < 2)
            return this.containsChildLayoutData(keys[0])
                ? this.get(keys[0]).data()
                : null;

        let _l: BravoLayoutData = this;
        for (let _n = 0; _n < keys.length; _n++) {
            _l = _l.getChildLayoutData(keys[_n]);
            if (!_l) break;
        }

        return _l;
    }

    public getChildLayoutItem(...keys: string[]): BravoLayoutItem {
        if (keys.length < 2) {
            return this.contains(keys[0]) ? this.get(keys[0]) : null;
        }

        let _l: BravoLayoutData = this;
        for (let _n = 0; _n < keys.length - 1; _n++) {
            _l = _l.getChildLayoutData(keys[_n]);
            if (!_l) return;
        }

        return _l && _l.contains(keys[keys.length - 1])
            ? _l.get(keys[keys.length - 1])
            : null;
    }

    public add(item: BravoLayoutItem) {
        if (this.contains(item.name)) {
            let _it = this.get(item.name);
            _it.value = item.value;
            _it.description = item.description;

            if (item.bHasAttributes) {
                _it.attributes = {};
                _it.attributes = { ...item.attributes };
            } else if (_it.bHasAttributes) {
                _it.attributes = null;
            }
        } else {
            this.collection.push(item);
        }
    }

    public addLayoutItem(key: string, value: any, description?: string) {
        let _zName = key;
        let _nPos = _zName.indexOf(' ');
        if (_nPos > 0) _zName = _zName.substring(0, _nPos);

        if (!this.contains(_zName)) {
            this.collection.push(
                new BravoLayoutItem(_zName, value, description)
            );
        } else {
            let _item = this.get(_zName);
            _item.value = value;
            _item.description = description;
        }

        /* if(_nPos > 0){
            let _ms =
        } */
    }

    public openChildLayoutData(...keys: string[]): BravoLayoutData {
        if (keys.length < 2) {
            if (this.contains(keys[0]) && this.get(keys[0]).bIsData)
                return this.get(keys[0]).data();

            if (!this.contains(keys[0]))
                this.collection.push(
                    new BravoLayoutItem(keys[0], new BravoLayoutData())
                );
            else this.get(keys[0]).value = new BravoLayoutData();

            return this.get(keys[0]).data();
        }

        let _l: BravoLayoutData = this;
        for (let _i = 0; _i < keys.length; _i++) {
            _l = _l.openChildLayoutData(keys[_i]);
            if (!_l) break;
        }

        return _l;
    }

    public async serialize(pzType = 'base64') {
        let _zipTool = BravoZipTool.createAsync();

        try {
            _zipTool.addEntryAync('Xml', this.toString());
            return await _zipTool.generateAync({ type: pzType });
        } finally {
            _zipTool.dispose();
            _zipTool = null;
        }
    }

    public remove(...keys: string[]) {
        if (keys.length < 2) {
            let _index = this.collection.findIndex((i) => i.name == keys[0]);
            if (_index != -1) this.collection.splice(_index, 1);

            return;
        }

        let _l = <BravoLayoutData>this;
        for (let _n = 0; _n < keys.length - 1; _n++) {
            _l = _l.getChildLayoutData(keys[_n]);
            if (!_l) break;
        }

        if (_l && _l.contains(keys[keys.length - 1]))
            _l.remove(keys[keys.length - 1]);
    }

    public clone(): BravoLayoutData {
        let _ldat = new BravoLayoutData();

        for (const _kp of this.collection) {
            if (_kp.value == null) {
                _ldat.addLayoutItem(_kp.name, null);
                continue;
            }

            _ldat.addLayoutItem(
                _kp.name,
                _kp.bIsData ? _kp.data().clone() : _kp.value,
                _kp.description
            );

            if (_kp.bHasAttributes) {
                for (const _zAttrName in _kp.attributes)
                    _ldat.get(_kp.name).attributes[_zAttrName] =
                        _kp.attributes[_zAttrName];
            }
        }

        return _ldat;
    }

    public toString() {
        let _document = new Document(); //document.implementation.createHTMLDocument('New Document');

        try {
            const _parentNode = _document.createElement(RootName);

            this.addChildNode(_parentNode, this.collection);

            return _parentNode.outerHTML;
        } finally {
            _document = null;
        }
    }

    private addChildNode(
        parentNode: HTMLElement,
        subCollection: Array<BravoLayoutItem>
    ) {
        for (let _kp of subCollection) {
            if (_kp.description)
                parentNode.appendChild(
                    parentNode.ownerDocument.createComment(_kp.description)
                );

            const _node = parentNode.ownerDocument.createElement(_kp.name);
            if (_kp.bHasAttributes) {
                for (let _zAttrName of _kp.attributes) {
                    let _attr = _node.ownerDocument.createAttribute(_zAttrName);
                    _attr.value = _kp.attributes[_zAttrName];
                    _node.attributes.setNamedItem(_attr);
                }
            }

            if (_kp.bIsData && _kp.data().collection) {
                this.addChildNode(
                    parentNode.appendChild(_node),
                    _kp.data().collection
                );
            } else {
                parentNode.appendChild(_node);

                if (_kp.value != null) {
                    let _zVal = String.format('{0}', _kp.value);
                    if (
                        String.compare(_kp.name, ChartValue) == 0 &&
                        parentNode &&
                        String.compare(parentNode.nodeName, ReportChart) == 0
                    ) {
                        _node.innerHTML = _zVal;
                    } else {
                        if (_kp.isEncrypt()) {
                            const _zPlainText = BravoCryptography.decryptString(
                                _zVal,
                                null
                            );
                            if (String.compare(_zPlainText, _zVal) == 0)
                                _zVal = BravoCryptography.encryptString(_zVal);
                        }

                        let _zText = _node.ownerDocument.createTextNode(_zVal);
                        _node.appendChild(_zText);
                    }
                }
            }
        }
    }

    /* private addChildNodeBak(parentNode: HTMLElement, subCollection: Array<BravoLayoutItem>) {
        for (let _kp of subCollection) {
            if (_kp.description)
                parentNode.appendChild(parentNode.ownerDocument.createComment(_kp.description));

            let _node = parentNode.ownerDocument.createElement(_kp.name);
            _node.setAttribute(TagName, _kp.name);

            if (_kp.bHasAttributes) {
                for (let _zAttrName of _kp.attributes) {
                    let _attr = _node.ownerDocument.createAttribute(_zAttrName);
                    _attr.value = _kp.attributes[_zAttrName];
                    _node.attributes.setNamedItem(_attr);
                }
            }

            if (_kp.bIsData && _kp.data().collection) {
                this.addChildNode(parentNode.appendChild(_node), _kp.data().collection);
            }
            else {
                parentNode.appendChild(_node);

                if (_kp.value) {
                    if (String.compare(_kp.name, ChartValue) == 0 && parentNode &&
                        String.compare(parentNode.nodeName, ReportChart) == 0)
                        _node.innerHTML = String.format("{0}", _kp.value);
                    else {
                        let _zText = _node.ownerDocument.createTextNode(_kp.value);
                        _node.appendChild(_zText);
                    }

                }
            }
        }
    } */

    public implementsInterface(interfaceName: string): boolean {
        return interfaceName == 'IBravoLayoutData';
    }
}

function validateOptions(userOptions) {
    options = helper.copyOptions(userOptions);

    helper.ensureFlagExists('addParent', options, true);
    helper.ensureFlagExists('ignoreDeclaration', options);
    helper.ensureFlagExists('ignoreInstruction', options);
    helper.ensureFlagExists('ignoreAttributes', options);
    helper.ensureFlagExists('ignoreText', options);
    helper.ensureFlagExists('ignoreComment', options);
    helper.ensureFlagExists('ignoreCdata', options);
    helper.ensureFlagExists('ignoreDoctype', options);
    helper.ensureFlagExists('compact', options);
    helper.ensureFlagExists('alwaysArray', options);
    helper.ensureFlagExists('alwaysChildren', options);
    helper.ensureFlagExists('trim', options);
    helper.ensureFlagExists('nativeType', options);
    helper.ensureFlagExists('sanitize', options);
    helper.ensureFlagExists('instructionHasAttributes', options);
    helper.ensureFlagExists('captureSpacesBetweenElements', options);
    helper.ensureKeyExists('declaration', options);
    helper.ensureKeyExists('instruction', options);
    helper.ensureKeyExists('attributes', options);
    helper.ensureKeyExists('text', options);
    helper.ensureKeyExists('comment', options);
    helper.ensureKeyExists('cdata', options);
    helper.ensureKeyExists('doctype', options);
    helper.ensureKeyExists('type', options);
    helper.ensureKeyExists('name', options);
    helper.ensureKeyExists('elements', options);
    helper.ensureKeyExists('value', options);
    helper.ensureKeyExists('parent', options);
    helper.checkFnExists('doctype', options);
    helper.checkFnExists('instruction', options);
    helper.checkFnExists('cdata', options);
    helper.checkFnExists('comment', options);
    helper.checkFnExists('text', options);
    helper.checkFnExists('instructionName', options);
    helper.checkFnExists('elementName', options);
    helper.checkFnExists('attributeName', options);
    helper.checkFnExists('attributeValue', options);
    helper.checkFnExists('attributes', options);

    return options;
}

function nativeType(value) {
    var nValue = Number(value);
    if (!isNaN(nValue)) {
        return nValue;
    }
    var bValue = value.toLowerCase();
    if (bValue === 'true') {
        return true;
    } else if (bValue === 'false') {
        return false;
    }
    return value;
}

function addField(type, value) {
    var key;
    if (options.compact) {
        if (!currentElement[options[type + 'Key']] && options.alwaysArray) {
            currentElement[options[type + 'Key']] = [];
        }

        if (
            currentElement[options[type + 'Key']] &&
            !wjc.isArray(currentElement[options[type + 'Key']])
        ) {
            currentElement[options[type + 'Key']] = [
                currentElement[options[type + 'Key']]
            ];
        }

        if (type + 'Fn' in options && typeof value === 'string') {
            value = options[type + 'Fn'](value, currentElement);
        }

        if (
            type === 'instruction' &&
            ('instructionFn' in options || 'instructionNameFn' in options)
        ) {
            for (key in value) {
                if (value.hasOwnProperty(key)) {
                    if ('instructionFn' in options) {
                        value[key] = options.instructionFn(
                            value[key],
                            key,
                            currentElement
                        );
                    } else {
                        var temp = value[key];
                        delete value[key];
                        value[
                            options.instructionNameFn(key, temp, currentElement)
                        ] = temp;
                    }
                }
            }
        }
        if (wjc.isArray(currentElement[options[type + 'Key']])) {
            currentElement[options[type + 'Key']].push(value);
        } else {
            currentElement[options[type + 'Key']] = value;
        }
    } else {
        if (!currentElement[options.elementsKey]) {
            currentElement[options.elementsKey] = [];
        }
        var element = {};
        element[options.typeKey] = type;
        if (type === 'instruction') {
            for (key in value) {
                if (value.hasOwnProperty(key)) {
                    break;
                }
            }
            element[options.nameKey] =
                'instructionNameFn' in options
                    ? options.instructionNameFn(key, value, currentElement)
                    : key;
            if (options.instructionHasAttributes) {
                element[options.attributesKey] =
                    value[key][options.attributesKey];
                if ('instructionFn' in options) {
                    element[options.attributesKey] = options.instructionFn(
                        element[options.attributesKey],
                        key,
                        currentElement
                    );
                }
            } else {
                if ('instructionFn' in options) {
                    value[key] = options.instructionFn(
                        value[key],
                        key,
                        currentElement
                    );
                }
                element[options.instructionKey] = value[key];
            }
        } else {
            if (type + 'Fn' in options) {
                value = options[type + 'Fn'](value, currentElement);
            }
            element[options[type + 'Key']] = value;
        }
        if (options.addParent) {
            element[options.parentKey] = currentElement;
        }
        currentElement[options.elementsKey].push(element);
    }
}

function manipulateAttributes(attributes) {
    if ('attributesFn' in options && attributes) {
        attributes = options.attributesFn(attributes, currentElement);
    }
    if (
        (options.trim ||
            'attributeValueFn' in options ||
            'attributeNameFn' in options) &&
        attributes
    ) {
        var key;
        for (key in attributes) {
            if (attributes.hasOwnProperty(key)) {
                if (options.trim) attributes[key] = attributes[key].trim();
                if ('attributeValueFn' in options)
                    attributes[key] = options.attributeValueFn(
                        attributes[key],
                        key,
                        currentElement
                    );
                if ('attributeNameFn' in options) {
                    var temp = attributes[key];
                    delete attributes[key];
                    attributes[
                        options.attributeNameFn(
                            key,
                            attributes[key],
                            currentElement
                        )
                    ] = temp;
                }
            }
        }
    }
    return attributes;
}

function onInstruction(instruction) {
    var attributes = {};
    if (
        instruction.body &&
        (instruction.name.toLowerCase() === 'xml' ||
            options.instructionHasAttributes)
    ) {
        var attrsRegExp = /([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|(\w+))\s*/g;
        var match;
        while ((match = attrsRegExp.exec(instruction.body)) !== null) {
            attributes[match[1]] = match[2] || match[3] || match[4];
        }
        attributes = manipulateAttributes(attributes);
    }
    if (instruction.name.toLowerCase() === 'xml') {
        if (options.ignoreDeclaration) {
            return;
        }
        currentElement[options.declarationKey] = {};
        if (Object.keys(attributes).length) {
            currentElement[options.declarationKey][options.attributesKey] =
                attributes;
        }
        if (options.addParent) {
            currentElement[options.declarationKey][options.parentKey] =
                currentElement;
        }
    } else {
        if (options.ignoreInstruction) {
            return;
        }
        if (options.trim) {
            instruction.body = instruction.body.trim();
        }
        var value = {};
        if (
            options.instructionHasAttributes &&
            Object.keys(attributes).length
        ) {
            value[instruction.name] = {};
            value[instruction.name][options.attributesKey] = attributes;
        } else {
            value[instruction.name] = instruction.body;
        }
        addField('instruction', value);
    }
}

function onStartElement(pTag) {
    let element, name, attributes;

    if (typeof pTag === 'object') {
        name = pTag.name;

        let _attr = pTag.attributes;
        if (_attr && _attr[TagName]) {
            name = _attr[TagName];
            delete _attr[TagName];
        }

        attributes = _attr;
    }

    if (!name) throw new Error(`Element name ${name} is null`);

    attributes = manipulateAttributes(attributes);

    if (!currentElement[options.elementsKey]) {
        currentElement[options.elementsKey] = [];
        currentElement[options.valueKey] = new BravoLayoutData();
    }

    if (options.compact) {
        element = {};

        if (
            !options.ignoreAttributes &&
            attributes &&
            Object.keys(attributes).length
        ) {
            element[options.attributesKey] = {};
            var key;
            for (key in attributes) {
                if (attributes.hasOwnProperty(key)) {
                    element[options.attributesKey][key] = attributes[key];
                }
            }
        }

        if (!(name in currentElement) && options.alwaysArray)
            currentElement[name] = [];

        if (currentElement[name] && !wjc.isArray(currentElement[name]))
            currentElement[name] = [currentElement[name]];

        if (wjc.isArray(currentElement[name]))
            currentElement[name].push(element);
        else currentElement[name] = element;
    } else {
        element = new BravoLayoutItem();
        element[options.typeKey] = 'element';
        element[options.nameKey] = name;

        if (
            !options.ignoreAttributes &&
            attributes &&
            Object.keys(attributes).length
        )
            element[options.attributesKey] = attributes;

        if (options.alwaysChildren) {
            element[options.elementsKey] = [];
            element[options.valueKey] = new BravoLayoutData();
        }

        currentElement[options.elementsKey].push(element);

        if (currentElement[options.valueKey])
            currentElement[options.valueKey].collection.push(element);
    }

    // if (options.addParent) {
    if (String.compare(name, RootName) != 0)
        element[options.parentKey] = currentElement;
    // }

    currentElement = element;
}

function onText(text) {
    if (options.ignoreText || (text && text.trim() == '--')) {
        return;
    }
    if (!text.trim() && !options.captureSpacesBetweenElements) {
        return;
    }
    if (options.trim) {
        text = text.trim();
    }
    if (options.nativeType) {
        text = nativeType(text);
    }
    if (options.sanitize) {
        text = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    currentElement[options.typeKey] = 'text';
    currentElement[options.elementsKey] = text;
    currentElement[options.valueKey] = text;

    //addField('text', text);
}

function onComment(comment) {
    if (options.ignoreComment) {
        return;
    }

    if (options.trim) {
        comment = comment.trim();
    }

    addField('comment', comment);
}

function onEndElement(name) {
    var parentElement = currentElement[options.parentKey];
    if (!options.addParent) {
        delete currentElement[options.parentKey];
    }

    if (currentElement[options.elementsKey]) {
        delete currentElement[options.elementsKey];
    }

    currentElement = parentElement;
}

function onCdata(cdata) {
    if (options.ignoreCdata) {
        return;
    }

    if (options.trim) {
        cdata = cdata.trim();
    }
}

function onDoctype(doctype) {
    if (options.ignoreDoctype) {
        return;
    }
    doctype = doctype.replace(/^ /, '');
    if (options.trim) {
        doctype = doctype.trim();
    }
    addField('doctype', doctype);
}

function onError(error) {
    error.note = error; //console.error(error);
}
