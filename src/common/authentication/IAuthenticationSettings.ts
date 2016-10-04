export interface IAuthenticationSettings {
    redirect_uri: string;
    request_token: string;
}

export class LocalAuthenticationSettings implements IAuthenticationSettings {
    constructor(public redirect_uri: string) {

    }

    get request_token() {
        return localStorage.getItem("request_token");
    }

    set request_token(value) {
        localStorage.setItem("request_token", value)
    }
}