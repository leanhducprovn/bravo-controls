export interface IConnection {
    name: string;
    state: any;
    hostApi: string;
    serviceName: string;
    authorization: string;
    connectionName: string;
    nCompressionThreshold: number;
    options: any;
    contextId: string;
    token: string;
    publicKey: any;

    zAppName: string;
    zKeyInfo: string;

    open();
    close();
    getApplicationName();
    beforeSend(data: any, xhr: XMLHttpRequest);
}
