import {ISettings} from "../common/ISettings";

var secureSettings = safari.extension.secureSettings;
var settings = safari.extension.settings;


export class SafariSettings implements ISettings {
    get access_token() {
        return secureSettings.getItem('access_token');
    }

    set access_token(value: string) {
        secureSettings.setItem('access_token', value);
    }

    get last_timestamp() {
        return settings.getItem('last_timestamp');
    }

    set last_timestapm(value: number) {
        settings.setItem('last_timestamp', value)
    }

    isAuthorized() {
        return this.access_token != null;
    }
}