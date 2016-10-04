import * as Ajax from "simple-ajax"

import * as _ from "lodash";
import {ArticleStorage} from "./ArticleStorage";
import {ISettings} from "./ISettings";
import {IArticle} from "./model/Article";

export class PocketApiBase {
    private static readonly uri = "https://getpocket.com/v3/";
    private static readonly consumer_key = '15287-db68741601b94e375145742f';

    public post(path: string, data: any, accessToken?: string): Promise<any> {

        let extendedData = _.extend(
            {consumer_key: PocketApiBase.consumer_key},
            _.isUndefined(accessToken) ? {} : {access_token: accessToken},
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

    get(since: number): Promise<{since: number, items: IArticle[]}> {
        return super.post('get', {
            since,
            "detailType": "complete"
        }, this.access_token)
            .then(result=>({since: result.since, items: _.values(result.list)}));
    }
}

export class PocketService {
    private api: PocketApi;
    private articleStorage: ArticleStorage;

    constructor(private settings: ISettings) {
        this.api = new PocketApi(settings.access_token);
        this.articleStorage = new ArticleStorage();
    }

    public update() {
        return this.api.get(this.settings.last_timestamp || 0)
            .then(result=>this.articleStorage.update(result.items, result.since));
    }

    public articlesCount() {
        return this.articleStorage.count();
    }

    public toggle(uri: string) {
    }
}