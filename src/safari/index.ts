import {Commands, Messages} from "./consts";
import {PocketService} from "../common/PocketService"
import {SafariSettings} from "./SafariSettings";
import _ = require("lodash");

const settings = new SafariSettings();

if (settings.isAuthorized()) {
    var pocketService = new PocketService(settings);


    pocketService.update().then(pocketService.articlesCount)
        .then(count=> {
            safari.extension.toolbarItems[0].badge = count;
        });
}

const commandHandlers = {
    [Commands.ADD_TO_POCKET]: async function () {
        await pocketService.update();
        _.find(safari.extension.toolbarItems, item=>item.command == Commands.RANDOM_ARTICLE).badge = await pocketService.articlesCount();
    }
};

const messageProcessors = {
    [Messages.SET_ACCESS_TOKEN]: (messageEvent: SafariExtensionMessageEvent)=> {
        settings.access_token = messageEvent.message;
    }
};


safari.application.addEventListener("command", (event: SafariCommandEvent)=> {
    if (settings.isAuthorized()) {
        let handler: Function = commandHandlers[event.command] || _.noop;
        handler(event);
    }
    else {
        safari.application.activeBrowserWindow.openTab().url = safari.extension.baseURI + "oauth.html";
    }
}, false);

safari.application.addEventListener("message", (messageEvent: SafariExtensionMessageEvent)=> {
    let messageProcessor: Function = messageProcessors[messageEvent.name] || _.noop;
    messageProcessor(messageEvent);
}, false);