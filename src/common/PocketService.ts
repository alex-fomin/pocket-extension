import {DbStorage} from "./DbStorage";
import {ISettings} from "./ISettings";
import {IArticle} from "./model/Article";
import * as values from "lodash/values"
import * as extend from "lodash/extend"
import * as Ajax from "simple-ajax"
import {log} from "./decorators/log";

export class PocketApiBase {
    private static readonly uri = "https://getpocket.com/v3/";
    private static readonly consumer_key = '15287-db68741601b94e375145742f';

    public post(path: string, data: any, accessToken?: string): Promise<any> {

        let extendedData = extend(
            {
                consumer_key: PocketApiBase.consumer_key,
                access_token: accessToken
            },
            data);


        let ajax = new Ajax({
                url: PocketApiBase.uri + path,
                method: 'POST',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                data: extendedData,
                headers: {
                    'X-Accept': 'application/json'
                }
            }
        );

        let deferred = new Promise((resolve, reject)=> {
            ajax.on("success", ({target})=>resolve(JSON.parse(target.responseText)));
            ajax.on("error", (e)=>reject(e));
        });

        ajax.send();

        return deferred;
    }
}


class PocketApi extends PocketApiBase {
    constructor(private access_token: string) {
        super();
    }

    @log(false)
    async get(since: number): Promise<{since: number, items: IArticle[]}> {
        let result = await super.post('get', {
            since,
            "detailType": "complete"
        }, this.access_token);
        return {since: <number>result.since, items: <IArticle[]>values(result.list)};
    }

    @log(true)
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

    @log(true)
    async add(url: string): Promise<IArticle> {
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

    @log(true)
    public async update() {
        let result = await this.api.get(this.settings.last_timestamp || 0);
        await this.dbStorage.update(result.items, result.since);
    }

    @log(true)
    public async refresh() {
        this.settings.last_timestamp = 0;
        await this.dbStorage.clear();
        await this.update();
    }

    @log(true)
    public articlesCount() {
        return this.dbStorage.count();
    }

    @log(true)
    public async toggle(url: string) {
        if (url !== undefined) {
            var article = await this.dbStorage.article(url);
            if (article) {
                this.api.archive(article.item_id);
                await this.dbStorage.remove(article.item_id);
                return false;
            }
            else {
                var addedArticle = await this.api.add(url);
                await this.dbStorage.addArticle(addedArticle);
                return true;
            }
        }
        else {
            return false;
        }
    }

    @log(true)
    public getRandomArticle() {
        return this.dbStorage.getRandomArticle();
    }

    @log(true)
    public async hasArticle(url: string) {
        return url !== undefined && await this.dbStorage.article(url) != null;
    }
}