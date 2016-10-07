
import {DbStorage} from "./DbStorage";
import {ISettings} from "./ISettings";
import {IArticle} from "./model/Article";
import * as values from "lodash/values"
import 'whatwg-fetch'

export class PocketApiBase {
    private static readonly uri = "https://getpocket.com/v3/";
    private static readonly consumer_key = '15287-db68741601b94e375145742f';

    public async post(path: string, data: any, accessToken?: string): Promise<any> {

        let extendedData = {
            consumer_key: PocketApiBase.consumer_key,
            //...data,
            access_token: accessToken
        };


        let
            response = await window.fetch(PocketApiBase.uri + path, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-Accept': 'application/json'
                },
                body: JSON.stringify(extendedData)
            });
        return response.json();
    }
}


class PocketApi extends PocketApiBase {
    constructor(private access_token: string) {
        super();
    }

    async get(since: number): Promise<{since: number, items: IArticle[]}> {
        let result = await super.post('get', {
            since,
            "detailType": "complete"
        }, this.access_token);
        return {since: <number>result.since, items: <IArticle[]>values(result.list)};
    }

    async archive(item_id: string) {
        var result = await super.post('send', {
            actions: [
                {
                    "action": "archive",
                    item_id,
                }
            ]
        }, this.access_token);
        return result.status === 1;
    }

    async add(url: string) {
        var result = await super.post('add', {url}, this.access_token);
        return <IArticle>result.item;
    }
}

export class PocketService {
    private api: PocketApi;
    private dbStorage: DbStorage;

    constructor(private settings: ISettings) {
        this.api = new PocketApi(settings.access_token);
        this.dbStorage = new DbStorage();
    }

    public async update() {
        let result = await this.api.get(this.settings.last_timestamp || 0);
        await this.dbStorage.update(result.items, result.since);
    }

    public articlesCount() {
        return this.dbStorage.count();
    }

    public async toggle(url: string) {
        if (url !== undefined) {
            var article = await this.dbStorage.article(url);
            if (article) {
                this.api.archive(article.item_id);
                await this.dbStorage.remove(article.item_id);
                return false;
            }
            else {
                var article = await this.api.add(url);
                await this.dbStorage.addArticle(article);
                return true;
            }
        }
        else {
            return false;
        }
    }

    public getRandomArticle() {
        return this.dbStorage.getRandomArticle();
    }

    public async hasArticle(url: string) {
        return url !== undefined && await this.dbStorage.article(url) != null;
    }
}