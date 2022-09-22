import { Event, ICollectionView } from '@grapecity/wijmo';

export interface IBindingList {
    listChanged: Event;
    getCollection?(): ICollectionView;
    dispose();
}