import Dexie from 'dexie';
import {IArticle, Status} from "./model/Article";
//noinspection TypeScriptCheckImport
import * as groupBy from  'lodash/groupBy'

export class DbStorage extends Dexie {
    private articles: Dexie.Table<IArticle, string>;

    constructor() {
        super("pocket");

        this.version(1).stores({
            articles: "&item_id,given_url,resolved_url"
        });

    }


    public count() {
        return this.articles.count();
    }

    public async getRandomArticle() {
        let count = await this.count();
        return await this.articles.offset(Math.round(Math.random() * count)).first();
    }

    public async update(articles: IArticle[], since?: number) {
        var articleMap = groupBy(articles, a=>(a.status === Status.OK).toString());
        if (since === undefined) {
            await this.articles.clear();
        }
        var deleted = (articleMap['false'] || []).map(x=>x.item_id);
        await this.articles.bulkDelete(deleted);
        await this.articles.bulkPut(articleMap['true'] || []);
    }

    public async article(url: string) {
        if (url == null || url === undefined || url == "") {
            return null;
        }

        return await this.articles
            .where('given_url').equals(url)
            .or('resolved_url').equals(url)
            .first();
    }

    remove(item_id: string) {
        return this.articles.delete(item_id)
    }

    addArticle(article: IArticle) {
        return this.articles.add(article);
    }

    clear() {
        return this.articles.clear();
    }
}