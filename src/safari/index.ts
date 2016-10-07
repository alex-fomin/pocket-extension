import {Commands, Messages} from "./consts";
import {PocketService} from "../common/PocketService"
import {SafariSettings} from "./SafariSettings";

const settings = new SafariSettings();

var pocketService: PocketService = null;

if (settings.isAuthorized()) {
    pocketService = new PocketService(settings);
    updateBadge(pocketService);
    updateIcon(pocketService);
    update(pocketService).then(()=> {
        updateBadge(pocketService);
        updateIcon(pocketService);
    });
}

async function update(pocketService: PocketService) {
    updateBadge(pocketService);
    return pocketService.update();
}

async function updateBadge(pocketService: PocketService) {
    var count = await pocketService.articlesCount();
    var toolbarButton = safari.extension.toolbarItems.find(item=>item.command == Commands.RANDOM_ARTICLE);
    toolbarButton.badge = count;
}

async function updateIcon(pocketService: PocketService, url?: string) {
    let hasArticle = await pocketService.hasArticle(url || safari.application.activeBrowserWindow.activeTab.url);
    setImage(hasArticle);
}



const commandHandlers = {
    [Commands.ADD_TO_POCKET]: async function (pocketService) {
        var wasAdded = await pocketService.toggle(safari.application.activeBrowserWindow.activeTab.url);
        setImage(wasAdded);
        updateBadge(pocketService);
    },
    [Commands.RANDOM_ARTICLE]: async function (pocketService) {
        update(pocketService);
        let article = await pocketService.getRandomArticle();
        safari.application.activeBrowserWindow.activeTab.url = article.resolved_url;
    }
};

function setImage(hasArticle: boolean) {
    let addToPocketItem = safari.extension.toolbarItems.find(item=>item.command == Commands.ADD_TO_POCKET);
    if (hasArticle) {
        addToPocketItem.image = safari.extension.baseURI + "added-38.png";
        addToPocketItem.label = "Remove from Pocket";
    }
    else {
        addToPocketItem.image = safari.extension.baseURI + "notAdded-38.png";
        addToPocketItem.label = "Add to Pocket";
    }
}


const messageProcessors = {
    [Messages.SET_ACCESS_TOKEN]: (messageEvent: SafariExtensionMessageEvent)=> {
        settings.access_token = messageEvent.message;
        pocketService = new PocketService(settings);
        update(pocketService);
    }
};

safari.application.addEventListener("command", event=> {
    if (settings.isAuthorized()) {
        let handler: Function = commandHandlers[event.command] || (()=> {
            });
        handler(pocketService);
    }
    else {
        safari.application.activeBrowserWindow.openTab().url = safari.extension.baseURI + "oauth.html";
    }
}, false);

safari.application.addEventListener("message", messageEvent=> {
    let messageProcessor: Function = messageProcessors[messageEvent.name] || (()=> {
        });
    messageProcessor(messageEvent);
}, false);


safari.application.addEventListener("beforeNavigate", async e=> {
    if (settings.isAuthorized()) {
        let hasArticle = await pocketService.hasArticle(e.url);
        setImage(hasArticle);
    }
}, false);

safari.application.addEventListener("activate", async e=> {
    if (settings.isAuthorized()) {
        let hasArticle = await pocketService.hasArticle((<SafariBrowserTab>e.target).url);
        setImage(hasArticle);

    }
}, true);