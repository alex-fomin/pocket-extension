import {PocketApiBase} from "../PocketService";
import {IAuthenticationSettings} from "./IAuthenticationSettings";
export class PocketAuthenticationService {
    private _api;

    constructor(private storage: IAuthenticationSettings) {
        this._api = new PocketApiBase();
    }

    private getRequestToken() {
        return this._api.post('oauth/request', {
            redirect_uri: this.storage.redirect_uri
        }).then(x=>x.code);
    }

    private redirectToPocket(request_token: string, openInNewPage: boolean) {
        var url = `https://getpocket.com/auth/authorize?request_token=${request_token}&redirect_uri=${
            this.storage.redirect_uri}`;
        if (openInNewPage) {
            window.open(url, '_blank');
        }
        else {
            window.location.href = url;
        }
    }

    private authorize(request_token: string) {
        return this._api.post('oauth/authorize', {
            code: request_token
        });
    }

    public phase1() {
        return this.getRequestToken()
            .then(request_token=> {
                this.storage.request_token = request_token;
                this.redirectToPocket(request_token, false);
            })
    }

    public phase2() {
        return this.authorize(this.storage.request_token);
    }
}