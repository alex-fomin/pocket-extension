/// <reference path="./lib/safari.d.ts"/>

import {IBrowserInteraction} from "../common/IBrowserInteraction";
import {Messages, Commands} from "./consts";
export class SafariBrowserInteraction implements IBrowserInteraction {
    onSaveAccessToken(onSaveAccessToken: (accessToken: string)=>void): void {
        safari.application.addEventListener("message", messageEvent=> {
            if (messageEvent.name === Messages.SET_ACCESS_TOKEN) {
                onSaveAccessToken(messageEvent.message);
            }
        }, false);
    }

    onChangeActivePage(param: (url: string)=>void): void {

        safari.application.addEventListener("beforeNavigate", async e=> {
            param(e.url);
        }, false);

        safari.application.addEventListener("activate", async e=> {
            param((<SafariBrowserTab>e.target).url);
        }, true);

    }

    onRandomArticle(onRandomArticle: Function): void {
        safari.application.addEventListener("command", event=> {
            if (event.command == Commands.RANDOM_ARTICLE) {
                onRandomArticle();
            }
        });
    }

    startOAuthRoutine() {

        safari.application.activeBrowserWindow.openTab().url = safari.extension.baseURI + "oauth.html";
    }

    onToggle(onToggle: Function): void {
        safari.application.addEventListener("command", event=> {
            if (event.command == Commands.ADD_TO_POCKET) {
                onToggle();
            }
        });
    }


    goto(url: string): void {
        safari.application.activeBrowserWindow.activeTab.url = url;
    }

    getActiveUrl(): string {
        return safari.application.activeBrowserWindow.activeTab.url;
    }

    setBadge(count: number) {
        var toolbarButton = safari.extension.toolbarItems.find(item=>item.command == Commands.RANDOM_ARTICLE);
        toolbarButton.badge = count;
    }

    setUnreadStatus(isUnread: boolean) {
        let addToPocketItem = safari.extension.toolbarItems.find(item=>item.command == Commands.ADD_TO_POCKET);
        if (isUnread) {
            addToPocketItem.image = safari.extension.baseURI + "notAdded-38.png";
            addToPocketItem.label = "Add to Pocket";
        } else {
            addToPocketItem.image = safari.extension.baseURI + "added-38.png";
            addToPocketItem.label = "Remove from Pocket";
        }
    }
}
