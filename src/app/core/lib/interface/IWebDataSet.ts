import { WebDataTable, WebTableCollection } from '../data/bravo.web.datatable';

export interface IWebDataSet {
    name: string;
    tables: WebTableCollection;
    extendedProperties: Map<string, any>;
    writeJson(pbFormat: boolean);
    writeXml();
}