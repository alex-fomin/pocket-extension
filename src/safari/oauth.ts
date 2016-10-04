import {PocketAuthenticationService} from "../common/authentication/PocketAuthenticationService";
import {LocalAuthenticationSettings} from "../common/authentication/IAuthenticationSettings";
import {SafariSettings} from "./SafariSettings";
import {Messages} from "./consts";

window.onload = ()=> {
    var authenticationSettings = new LocalAuthenticationSettings(window.location.href + "?authenticated");

    var pocketAuthenticationService = new PocketAuthenticationService(authenticationSettings);

    if (document.location.href.indexOf("?authenticated") >= 0) {
        pocketAuthenticationService.phase2()
            .then(({access_token})=> {
                (safari.self as SafariContentWebPage).tab.dispatchMessage(Messages.SET_ACCESS_TOKEN, access_token);
                window.close();
            })

    }
    else {
        var button = document.getElementById("authorize");
        button.onclick = (e)=> {
            pocketAuthenticationService.phase1();
        };
    }
};