import { EventArgs } from '@grapecity/wijmo';

export class ListChangedEventArgs extends EventArgs {
    public readonly listChangedType: ListChangedType;
    public readonly newIndex: number;
    public readonly oldIndex: number;
    public readonly propDesc: any;

    constructor(listChangedType: ListChangedType, newIndex: number, oldIndex?: number, propDesc?: any) {
        super();

        this.listChangedType = listChangedType;
        this.newIndex = newIndex;
        this.oldIndex = oldIndex;
        this.propDesc = propDesc;
    }
}

export enum ListChangedType {
    /// <devdoc>
    ///    <para>[To be supplied.]</para>
    /// </devdoc>
    Reset,
    /// <devdoc>
    ///    <para>[To be supplied.]</para>
    /// </devdoc>
    ItemAdded,
    /// <devdoc>
    ///    <para>[To be supplied.]</para>
    /// </devdoc>
    ItemDeleted,
    /// <devdoc>
    ///    <para>[To be supplied.]</para>
    /// </devdoc>
    ItemMoved,
    /// <devdoc>
    ///    <para>[To be supplied.]</para>
    /// </devdoc>
    ItemChanged,
    /// <devdoc>
    ///    <para>[To be supplied.]</para>
    /// </devdoc>
    PropertyDescriptorAdded,
    /// <devdoc>
    ///    <para>[To be supplied.]</para>
    /// </devdoc>
    PropertyDescriptorDeleted,
    /// <devdoc>
    ///    <para>[To be supplied.]</para>
    /// </devdoc>
    PropertyDescriptorChanged
}