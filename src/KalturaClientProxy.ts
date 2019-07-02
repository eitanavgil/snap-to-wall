import {KalturaClient, KalturaMultiRequest, KalturaRequest} from "kaltura-typescript-client";
import {KalturaMediaEntry, KalturaMediaEntryArgs} from "kaltura-typescript-client/api/types/KalturaMediaEntry";
import {KalturaMediaType} from "kaltura-typescript-client/api/types/KalturaMediaType";
import {MediaGetAction, MediaGetActionArgs} from "kaltura-typescript-client/api/types/MediaGetAction";
import {UploadTokenAddAction, UploadTokenAddActionArgs} from "kaltura-typescript-client/api/types/UploadTokenAddAction";
import {KalturaUploadToken} from "kaltura-typescript-client/api/types/KalturaUploadToken";

export interface ClientConfig {
    ks: string;
    serviceUrl: string;
    partnerId: string;
}

export class KalturaClientProxy {

    kClient: KalturaClient;

    constructor(config: ClientConfig) {
        this.kClient = this.initClient(config)
    }

    /**
     * Initialize Kaltura client
     * @param serviceUrl
     * @param clientTag
     * @param ks
     */
    initClient(config: ClientConfig): KalturaClient {
        return new KalturaClient(
            {
                endpointUrl: "http://www.kaltura.com/",
                clientTag: "snapToWall"
            },
            {
                ks: config.ks
            }
        );
    }

    // public createEntry() {
    //     let kalturaMediaEntryArgs: KalturaMediaEntryArgs = {
    //         mediaType: KalturaMediaType.image
    //     }
    //     const mediaEntry: KalturaMediaEntry = new KalturaMediaEntry(kalturaMediaEntryArgs);
    //     return mediaEntry;
    // }


    public createUploadToken(callback: (token: any) => void) {
        const uploadTokenAddActionArgs: UploadTokenAddActionArgs = {};
        const uploadTokenAdd: UploadTokenAddAction = new UploadTokenAddAction(uploadTokenAddActionArgs);
        let multiRequest: KalturaMultiRequest = new KalturaMultiRequest(uploadTokenAdd);
        this.kClient.multiRequest(multiRequest).then((data: any) => {
                callback(data[0]["result"]);
            },
            err => {
                console.log("Err ", err);
            })
    }

    // This is not really relevant to this app - it is just to show a template example of how to cal a server API
    // and get response from it.

    public getEntryById(id: string) {
        const mediaGetActionArgs: MediaGetActionArgs = {entryId: id};
        const mediaGetAction: MediaGetAction = new MediaGetAction(mediaGetActionArgs);
        let multiRequest: KalturaMultiRequest = new KalturaMultiRequest(mediaGetAction);
        this.kClient.multiRequest(multiRequest).then((data: any) => {
                console.log("Got entry ", data);
            },
            err => {
                console.log("Err ", err);

            })
    }

}
