import "./App.css";
import React from "react";
import {Component} from "react";
import {WhisperSpinner} from "react-spinners-kit";
import {ClientConfig, KalturaClientProxy} from "./KalturaClientProxy";
import {KalturaUploadToken} from "kaltura-typescript-client/api/types/KalturaUploadToken";

/**
 * This app is designed to run on phones.
 * The end user is a participant in a convention or meetup. Once he/she takes
 * a selfie or uploads an image, it will appear on a projected wall (with or without moderation).
 * Backend will be a Kaltura real account, and for first phase we will nave basic upload flow with only images.
 *
 * App main requirements
 *  - user scans QR code to get to the event URL
 *  - user hits the URL and receives: user-id, account, event properties etc'.
 *  - user generates UUID and saves to cookie?
 *  - fetch KS with user-id
 *  - app gets to ideal mode - show UI to allow camera API
 *  - let user snap a selfie
 *  - let user cancel or replace pic (show a preview)
 *  - let user upload
 *  - optional - add a throttle logic (prop of event?)
 *
 */
interface Props {
}

enum appStatus {
    initial = "INITIAL",
    showCameraButton = "SHOW_CAMERA_BUTTON",
    preview = "PREVIEW",
    uploading = "UPLOADING",
    saving = "SAVING",
}

interface State {
    snap?: boolean;
    firstLoad?: boolean;
    loading?: boolean;
    ks?: string;
    userId?: string;
    status: appStatus;
}

// path to get KS. cannot be part of current project as this holds admin-secrete

// export const KS_SERVICE_URL = "http://192.168.1.115/php5/service.php";
export const KS_SERVICE_URL = "http://localhost/php5/service.php";

class App extends Component<Props, State> {

    pid: number = 27017;
    clientProxy?: KalturaClientProxy;

    constructor(props: Props) {
        super(props);
        this.handleSnap = this.handleSnap.bind(this);
        this.handleUsername = this.handleUsername.bind(this);
        this.handleCameraChange = this.handleCameraChange.bind(this);
        // todo - set unique user with cookie. Once uploaded twice - free him from moderation?
        // todo - KMC moderation configuration by default on that pid - optional
        this.state = {snap: false, loading: true, userId: 'eitan', status: appStatus.initial};
        this.getKs();
    }

    async getKs(): Promise<void> {
        const {userId} = this.state;
        await fetch(KS_SERVICE_URL + "?user_id=" + userId)
            .then(response => response.text())
            .then(data => {
                // handle errors
                let config: ClientConfig = {
                    ks: data,
                    partnerId: this.pid.toString(),
                    serviceUrl: "http://www.kaltura.com"

                };
                this.clientProxy = new KalturaClientProxy(config);
                this.setState({ks: data, loading: false, status: appStatus.showCameraButton})
            });
    }

    receivedToken(token: any) {
        console.log(">>>> -- ", token);
    }

    handleCameraChange(e: any) {
        if (!this.clientProxy) {
            console.log("Kaltura Client is missing");
            return;
        }
        if (!e.target || !e.target.files || e.target.files.length === 0) {
            console.log("File is missing or corrupted");
            return;
        }
        this.clientProxy.createUploadToken(this.receivedToken);

        // this is just an example to test the kaltura client API

        this.clientProxy.getEntryById("1_ilwilm2w");

        // const newEntry = this.clientProxy.createEntry();
        // const uploadToken = this.clientProxy.createUploadToken(e.target.files[0]);
        // const fileStream = this.clientProxy.createFileStream();

        console.log(">>>>", e.target.files[0]);
    }

    handleUsername(e: any) {
        this.setState({userId: "rr"});
    }

    handleSnap() {
        this.setState({snap: true});
    }

    render() {
        const {snap, ks, loading, userId, status} = this.state;
        return (
            <div className="App">

                <div className="spinner-wrapper">
                    <WhisperSpinner loading={loading} size={100} frontColor={"#DDD"} backColor={"#333"}/>
                </div>

                {status === appStatus.saving &&
                <div className="login-input">
                    <input className="user-input"/>
                    <button className="user-name" onClick={this.handleUsername}></button>
                </div>
                }

                {
                    status === appStatus.showCameraButton &&
                    <div className="instructions">
                        Hey there.<br/><br/>
                        <div className="instructions-body">If you want your picture on the wall - take a snap and send
                            it to
                            Kaltura
                        </div>
                        <header className="App-body">
                            {
                                ks &&
                                <button className="snap-button" onClick={this.handleSnap}>
                                    <label htmlFor="hidden-new-file" className="ui icon button">
                                        <img className="camera" alt="star"
                                             src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowMEMzMzI3OTkxQTMxMUU5ODRGNkRFMTkyQjFENjUwMSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDowMEMzMzI3QTkxQTMxMUU5ODRGNkRFMTkyQjFENjUwMSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjAwQzMzMjc3OTFBMzExRTk4NEY2REUxOTJCMUQ2NTAxIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjAwQzMzMjc4OTFBMzExRTk4NEY2REUxOTJCMUQ2NTAxIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+80M6GgAAOqlJREFUeNrs3Qm8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"/>
                                    </label>
                                    <input id="hidden-new-file" type="file" accept="image/*;capture=camera"
                                           onChange={this.handleCameraChange}>
                                    </input>
                                </button>
                            }
                        </header>
                    </div>
                }

            </div>
        );
    }
}

export default App;
