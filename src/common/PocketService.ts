import * as Ajax from "simple-ajax"

import * as _ from "lodash";
import {ArticleStorage} from "./ArticleStorage";

export class PocketApi {
    private static uri = "https://getpocket.com/v3/";
    private static consumer_key = '15287-db68741601b94e375145742f';

    public post(path: string, data: any, accessToken?: string): Promise<any> {

        let extendedData = _.extend(
            {consumer_key: PocketApi.consumer_key},
            _.isUndefined(accessToken) ? {} : {access_token: accessToken},
            data);


        let ajax = new Ajax({
                url: PocketApi.uri + path,
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


export class PocketService {
    private api: PocketApi;
    private articleStorage: ArticleStorage;

    constructor(private accessToken: string) {
        this.api = new PocketApi();
        this.articleStorage = new ArticleStorage();
    }

    public toggle(uri: string) {
    }
}