import {KalturaClient, KalturaMultiRequest, KalturaRequest} from "kaltura-typescript-client";
import {KalturaMediaEntry, KalturaMediaEntryArgs} from "kaltura-typescript-client/api/types/KalturaMediaEntry";
import {KalturaMediaType} from "kaltura-typescript-client/api/types/KalturaMediaType";
import {KalturaUploadToken, KalturaUploadTokenArgs} from "kaltura-typescript-client/api/types/KalturaUploadToken";

export interface ClientConfig {
    ks: string;
    serviceUrl: string;
    partnerId: string;
}

export class KalturaClientProxy {

    kClient?: KalturaClient;

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
                endpointUrl: "",
                clientTag: "snapToWall"
            },
            {
                ks: config.ks
            }
        );
    }

    public createEntry() {
        let kalturaMediaEntryArgs: KalturaMediaEntryArgs = {
            mediaType: KalturaMediaType.image
        }
        const mediaEntry: KalturaMediaEntry = new KalturaMediaEntry(kalturaMediaEntryArgs);
        return mediaEntry;
    }

    public createFileStream() {

    }

    public createUploadToken(file: File) {
        const kalturaUploadTokenArgs: KalturaUploadTokenArgs = {
            fileName: file.name,
            fileSize: file.size
        }
        const kalturaUploadToken: KalturaUploadToken = new KalturaUploadToken(kalturaUploadTokenArgs);
        let multiRequest: KalturaMultiRequest = new KalturaMultiRequest(kalturaUploadToken)


    }

}
