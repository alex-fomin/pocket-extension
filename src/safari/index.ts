import {Commands, Messages} from "./consts";
import {PocketService} from "../common/PocketService"
import {SafariSettings} from "./SafariSettings";

const settings = new SafariSettings();

safari.application.addEventListener("command", (event: SafariCommandEvent)=> {
    if (settings.isAuthorized()) {
        var pocketService = new PocketService(settings.access_token);


        if (event.command === Commands.ADD_TO_POCKET) {
            pocketService.toggle(safari.application.activeBrowserWindow.activeTab.url);
        }
        else {

        }
    }
    else {
        safari.application.activeBrowserWindow.openTab().url = safari.extension.baseURI + "oauth.html";
    }
}, false);

safari.application.addEventListener("message", (messageEvent: SafariExtensionMessageEvent)=> {
    if (messageEvent.name === Messages.SET_ACCESS_TOKEN) {
        settings.access_token = messageEvent.message;
    }
}, false);