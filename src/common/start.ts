import {ISettings} from "./ISettings";
import {IBrowserInteraction} from "./IBrowserInteraction";
import {PocketService} from "./PocketService";

export function start(settings: ISettings, browserInteraction: IBrowserInteraction) {


    var pocketService: PocketService = null;

    if (settings.isAuthorized()) {
        pocketService = new PocketService(settings);


        updateBadge(pocketService);
        updateIcon(pocketService);
        pocketService.refresh().then(()=> {
            updateBadge(pocketService);
            updateIcon(pocketService);
        });
    }

    let updateCount = 0;

    async function update(pocketService: PocketService) {
        updateBadge(pocketService);
        updateCount++;
        if (updateCount == 10) {
            updateCount = 0;
            return pocketService.refresh();
        }
        else {
            return pocketService.update();
        }
    }

    async function updateBadge(pocketService: PocketService) {
        var count = await pocketService.articlesCount();
        browserInteraction.setBadge(count);
    }

    async function updateIcon(pocketService: PocketService, url?: string) {
        let hasArticle = await pocketService.hasArticle(url || browserInteraction.getActiveUrl());
        browserInteraction.setUnreadStatus(!hasArticle);
    }

    browserInteraction.onRandomArticle(async()=> {
        if (settings.isAuthorized()) {
            update(pocketService);
            let article = await pocketService.getRandomArticle();
            browserInteraction.goto(article.resolved_url);
        }
        else {
            browserInteraction.startOAuthRoutine();
        }
    });

    browserInteraction.onToggle(async()=> {
        if (settings.isAuthorized()) {
            var wasAdded = await pocketService.toggle(safari.application.activeBrowserWindow.activeTab.url);
            browserInteraction.setUnreadStatus(!wasAdded);
            updateBadge(pocketService);
        }
        else {
            browserInteraction.startOAuthRoutine();
        }
    });

    browserInteraction.onChangeActivePage(async url=> {
        if (settings.isAuthorized()) {
            let hasArticle = await pocketService.hasArticle(url);
            browserInteraction.setUnreadStatus(!hasArticle);
        }
    });

    browserInteraction.onSaveAccessToken(accessToken=> {
        settings.access_token = accessToken;
        pocketService = new PocketService(settings);
        update(pocketService);
    });
}
